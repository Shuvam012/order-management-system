// import User from "../models/User.js";
// import { client } from "./mqttClient.js";
// import MQTT_TOPICS from "./topics.js";
// import { wss } from "../websocket/soketServer.js";

// const handleVendorStatus = async () => {
//   client.subscribe(MQTT_TOPICS.VENDOR_STATUS, { qos: 1 });

//   client.on("message", async (topic, message) => {
//   if (topic !== MQTT_TOPICS.VENDOR_STATUS) return;

//   try {
//     const { vendorId, status } = JSON.parse(message.toString());
//     console.log(" MQTT vendor/status received:", vendorId, status); // 

//     if (!vendorId) return;

//     const vendor = await User.findById(vendorId);
//     if (!vendor) return;

//     vendor.isOnline = status === "online";
//     await vendor.save();

//     console.log(" Broadcasting vendor status via WebSocket:", status); 

//     if (wss) {
//       wss.clients.forEach((wsClient) => {
//         if (wsClient.readyState === 1) {
//           wsClient.send(JSON.stringify({
//             topic: MQTT_TOPICS.VENDOR_STATUS,
//             data: {
//               vendorId: vendorId.toString(), 
//               status,
//               isOnline: vendor.isOnline,
//               name: vendor.name,
//             },
//           }));
//         }
//       });
//     }

//   } catch (err) {
//     console.error("Error updating vendor status:", err.message);
//   }
// });
// };

// export default handleVendorStatus;