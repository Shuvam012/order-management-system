





import Order from "../models/Order.js";
import { publishEvent } from "../mqtt/mqttClient.js";
import MQTT_TOPICS from "../mqtt/topics.js";

// create
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    const order = await Order.create({
      customer: req.user._id,
      items,
      totalAmount,
      status: "pending",
    });

   
    // publishEvent(MQTT_TOPICS.ORDER_NEW, order);
     publishEvent(MQTT_TOPICS.ORDER_NEW, {
      orderId: order._id,
      status: order.status,
      customer: order.customer,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// update
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "accepted",
      "on_the_way",
      "in_progress",
      "completed",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // assign vendor
    if (!order.vendor) {
      order.vendor = req.user._id;
    }

    order.status = status;
    await order.save();

    
    publishEvent(MQTT_TOPICS.ORDER_UPDATE, {
      orderId: order._id,
      status: order.status,
      vendor: order.vendor,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// all orders - admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("vendor", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// all orderss - vender
const getVendorOrders = async (req, res) => {
  const orders = await Order.find({ vendor: req.user._id });
  res.json(orders);
};


export { createOrder, updateOrderStatus, getAllOrders  , getVendorOrders};
