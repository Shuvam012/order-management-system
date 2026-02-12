import User from "../models/User.js";
import { client } from "./mqttClient.js";
import MQTT_TOPICS from "./topics.js";

const handleVendorStatus = async () => {
  client.subscribe(MQTT_TOPICS.VENDOR_STATUS, { qos: 1 });

  client.on("message", async (topic, message) => {
    if (topic !== MQTT_TOPICS.VENDOR_STATUS) return;

    const { status } = JSON.parse(message.toString());

    // Single vendor 
    const vendor = await User.findOne({ role: "vendor" });
    if (!vendor) return;

    vendor.isOnline = status === "online";
    await vendor.save();

    console.log(`Vendor status updated: ${status}`);
  });
};


export default handleVendorStatus