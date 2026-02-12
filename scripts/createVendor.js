import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const createVendor = async () => {
  try {
    await connectDB();

    const vendorEmail = process.env.VENDOR_EMAIL;
    const vendorPassword = process.env.VENDOR_PASSWORD;

    if (!vendorEmail || !vendorPassword) {
      console.error("VENDOR_EMAIL or VENDOR_PASSWORD missing in .env");
      process.exit(1);
    }

    const existingVendor = await User.findOne({ role: "vendor" });
    if (existingVendor) {
      console.log("Vendor user already exists");
      process.exit(0);
    }

    await User.create({
      name: "Default Vendor",
      email: vendorEmail,
      password: vendorPassword,
      role: "vendor",
      isOnline: false, // useful later for MQTT last will
    });

    console.log("Vendor user created successfully");
    process.exit(0);

  } catch (error) {
    console.error("Error creating vendor user:", error.message);
    process.exit(1);
  }
};

createVendor();
