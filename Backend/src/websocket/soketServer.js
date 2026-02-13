import { WebSocketServer } from "ws";
// import { MqttClient } from "mqtt";
import { client } from "../mqtt/mqttClient.js";
import MQTT_TOPICS from "../mqtt/topics.js";

let wss

const initWebSocket = (server) => {
    wss = new WebSocketServer({ server });

    // wss.on("connection", (ws) => {
    //     wss.on("message", (message) => {
    //         console.log("WebSocket client connected");
    //     });

    //     // ws.send("something");
    //     ws.on("close", () => {
    //         console.log("WebSocket client disconnected");
    //     });
    // });

    // subscribe to MQTT topics
   
   wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

   
    client.subscribe(
        [
            MQTT_TOPICS.ORDER_NEW,
            MQTT_TOPICS.ORDER_UPDATE,
            MQTT_TOPICS.VENDOR_STATUS,
        ],
        { qos: 1 }
    )

    client.on("message", (topic, message) => {
        const payload = JSON.parse(message.toString());

        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(
                    JSON.stringify({
                        topic,
                        data: payload,
                    })
                );
            }
        });
    })

}

export { initWebSocket, wss }



// import { WebSocketServer } from "ws";
// import { client } from "../mqtt/mqttClient.js";
// import MQTT_TOPICS from "../mqtt/topics.js";

// let wss;

// const initWebSocket = (server) => {
//   wss = new WebSocketServer({ server });

//   wss.on("connection", (ws) => {
//     console.log("WebSocket client connected");

//     ws.on("close", () => {
//       console.log("WebSocket client disconnected");
//     });
//   });

//   // Subscribe to all important topics
//   client.subscribe([MQTT_TOPICS.ORDER_NEW, MQTT_TOPICS.ORDER_UPDATE, MQTT_TOPICS.VENDOR_STATUS], { qos: 1 });

//   // Forward MQTT messages to all connected WebSocket clients
//   client.on("message", (topic, message) => {
//     const payload = JSON.parse(message.toString());
//     wss.clients.forEach((client) => {
//       if (client.readyState === 1) {
//         client.send(JSON.stringify({ topic, data: payload }));
//       }
//     });
//   });
// };

// export { initWebSocket, wss };
