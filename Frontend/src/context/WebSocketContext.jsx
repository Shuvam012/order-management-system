


import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const WebSocketContext = createContext();

const WS_URL = "ws://localhost:5000";
const RECONNECT_DELAY = 3000;

export const WebSocketProvider = ({ children }) => {
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const shouldReconnect = useRef(true); // prevent reconnect on intentional unmount

  const connect = useCallback(() => {
    // cleanup any existing socket before making a new one
    if (wsRef.current) {
      wsRef.current.close();
    }

    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      clearTimeout(reconnectTimer.current); // cancel any pending reconnect
    };

    socket.onmessage = (event) => {
      try {
        setLastMessage(JSON.parse(event.data));
      } catch {
        console.error("Invalid WS payload:", event.data);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);

      // auto-reconnect unless component is unmounting
      if (shouldReconnect.current) {
        console.log(`Reconnecting in ${RECONNECT_DELAY / 1000}s...`);
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      socket.close(); // triggers onclose → reconnect
    };
  }, []);

  useEffect(() => {
    shouldReconnect.current = true;
    connect();

    // cleanup on unmount
    return () => {
      shouldReconnect.current = false;
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return (
    <WebSocketContext.Provider value={{ lastMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);