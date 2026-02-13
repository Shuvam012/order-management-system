import env from "dotenv";
env.config();

import mqtt from "mqtt";

// import {MQtt_TOPICS} from "./topics.js";
import MQTT_TOPICS from "./topics.js";


const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  clientId: `backend_${Math.random().toString(16).slice(2)}`,
  protocol: "mqtts",
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
  
});

client.on("connect", () => {
  console.log("MQTT connected");
  
});

client.on("error", (error) => {
  console.error("MQTT connection error:", error);
});

const publishEvent = (topic, payload) => {
  client.publish(topic, JSON.stringify(payload), { qos: 1 });
};

export { client, publishEvent };
