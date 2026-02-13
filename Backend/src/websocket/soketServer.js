import { WebSocketServer } from "ws";
import { client } from "../mqtt/mqttClient.js";
import MQTT_TOPICS from "../mqtt/topics.js";
import User from "../models/User.js";

let wss;

const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    

    ws.isAlive = true;
    ws.on("pong", () => { ws.isAlive = true; });
    ws.on("close", () => console.log("WebSocket client disconnected"));
    ws.on("error", (err) => console.error("WebSocket error:", err.message));
  });

  // Ping all clients every 30s, kill dead connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("Terminating dead connection");
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(heartbeatInterval));

  // Subscribe to MQTT topics
  client.subscribe(
    [MQTT_TOPICS.ORDER_NEW, MQTT_TOPICS.ORDER_UPDATE, MQTT_TOPICS.VENDOR_STATUS],
    { qos: 1 }
  );

  // Broadcast MQTT messages to all connected WebSocket clients
  client.on("message", (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      wss.clients.forEach((wsClient) => {
        if (wsClient.readyState === 1) {
          wsClient.send(JSON.stringify({ topic, data: payload }));
        }
      });
    } catch (err) {
      console.error("Failed to parse MQTT message:", err.message);
    }
  });
};

export { initWebSocket, wss };