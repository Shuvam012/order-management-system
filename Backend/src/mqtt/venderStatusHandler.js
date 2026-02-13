



import User from "../models/User.js";
import { client } from "./mqttClient.js";
import MQTT_TOPICS from "./topics.js";

const handleVendorStatus = async () => {
  client.subscribe(MQTT_TOPICS.VENDOR_STATUS, { qos: 1 });

  client.on("message", async (topic, message) => {
    if (topic !== MQTT_TOPICS.VENDOR_STATUS) return;

    try {
      const { vendorId, status } = JSON.parse(message.toString());

      if (!vendorId) return;

      // Find vendor by ID
      const vendor = await User.findById(vendorId);
      if (!vendor) {
        console.warn("Vendor not found:", vendorId);
        return;
      }

      // Update online/offline
      vendor.isOnline = status === "online";
      await vendor.save();

      console.log(`Vendor ${vendor.name} is now ${status}`);
    } catch (err) {
      console.error("Error updating vendor status:", err.message);
    }
  });
};

export default handleVendorStatus;
