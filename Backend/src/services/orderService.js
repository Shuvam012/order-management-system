import Order from "../models/Order.js";
import MQTT_TOPICS from "../mqtt/topics.js";

import { publishEvent } from "../mqtt/mqttClient.js";

const allowedStatus = ["accepted", "on_the_way", "in_progress", "completed"];


 const createOrderService = async ({ customerId, items, totalAmount }) => {
  if (!items || items.length === 0) {
    throw new Error("Order items required");
  }

  const order = await Order.create({
    customer: customerId,
    items,
    totalAmount,
    status: "pending",
  });

  const populatedOrder = await Order.findById(order._id)
    .populate("customer", "name email")
    .populate("vendor", "name isOnline");

 
  publishEvent(MQTT_TOPICS.ORDER_NEW, populatedOrder);

  return populatedOrder;
};

// up date order
 const updateOrderStatusService = async ({ orderId, status, userId }) => {
  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid status");
  }

  const order = await Order.findById(orderId)
    .populate("customer", "name email")
    .populate("vendor", "name isOnline");

  if (!order) throw new Error("Order not found");

  // Assign vendor once
  if (!order.vendor) {
    order.vendor = userId;
  }

  order.status = status;
  await order.save();

  const populatedOrder = await Order.findById(order._id)
    .populate("customer", "name email")
    .populate("vendor", "name isOnline");

  
  publishEvent(MQTT_TOPICS.ORDER_UPDATE, populatedOrder);

  return populatedOrder;
};



// Admin
 const getAllOrdersService = async () => {
  return await Order.find()
    .populate("customer", "name email")
    .populate("vendor", "name isOnline")
    .sort({ createdAt: -1 });
};


// Vendor
 const getVendorOrdersService = async (vendorId) => {
  return await Order.find({
    $or: [{ vendor: vendorId }, { vendor: null }],
  })
    .populate("customer", "name email")
    .populate("vendor", "name isOnline")
    .sort({ createdAt: -1 });
};


export { createOrderService, updateOrderStatusService, getAllOrdersService, getVendorOrdersService };