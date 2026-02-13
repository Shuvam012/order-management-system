// // src/context/WebSocketContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";

// const WebSocketContext = createContext();

// export const WebSocketProvider = ({ children }) => {
//   const [ws, setWs] = useState(null);

//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:5000");
//     setWs(socket);

//     socket.onopen = () => console.log("Connected to WebSocket server");
//     socket.onclose = () => console.log("WebSocket disconnected");

//     return () => socket.close();
//   }, []);

//   return (
//     <WebSocketContext.Provider value={{ ws }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export const useWebSocket = () => useContext(WebSocketContext);


// src/context/WebSocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]); // store all real-time messages

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");
    setWs(socket);

    socket.onopen = () => console.log("Connected to WebSocket server");
    socket.onclose = () => console.log("WebSocket disconnected");
    socket.onerror = (err) => console.error("WebSocket error:", err);

    // Listen for all messages from backend
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]); // append new messages
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
