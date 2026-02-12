import env from "dotenv";
env.config();

import mqtt from "mqtt";

// import {MQtt_TOPICS} from "./topics.js";
import MQTT_TOPICS from "./topics.js";


const clientId = `backend_${Math.random().toString(16).slice(2)}`;

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
    clientId,
    protocol: "mqtts",
    clean: true,
    connectTimeout: 4000, // 4 seconds
   
    // username: process.env.MQTT_USERNAME,
    // password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000,// Reconnect every 1 second


    // Last will / vender offline detection
    will: {
      topic: MQTT_TOPICS.VENDOR_STATUS,
      payload: JSON.stringify({  status: "offline",}),
      qos: 1, 
    //   retain: false, 
    },
  });


  client.on("connect", () => {
      console.log("MQTT connected")


      // Vender online
  client.publish(
    MQTT_TOPICS.VENDOR_STATUS, 
    JSON.stringify({  status: "online",}), 
    { qos: 1});
  })


  

    client.on('error', (error) => {
      console.error('MQTT connection error:', error);
    });

    const publishEvent = (topic, payload) => {
        client.publish(topic, JSON.stringify(payload), { qos: 1 });
      };


export {client, publishEvent};