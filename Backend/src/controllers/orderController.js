





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
      topic:"orders/new",
      data:{
          orderId: order._id,
      status: order.status,
      customer: order.customer,
      }
    
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create order
// const createOrder = async (req, res) => {
//   const { items, totalAmount } = req.body;
//   if (!items || items.length === 0) return res.status(400).json({ message: "Items required" });

//   const order = await Order.create({ customer: req.user._id, items, totalAmount, status: "pending" });

//   client.publish(MQTT_TOPICS.ORDER_NEW, JSON.stringify({ orderId: order._id, status: order.status, customer: order.customer }), { qos: 1 });

//   res.status(201).json(order);
// };

// update order
// const updateOrderStatus = async (req, res) => {
//   const { status } = req.body;
//   const allowed = ["accepted", "on_the_way", "in_progress", "completed", "rejected"];
//   if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

//   const order = await Order.findById(req.params.id);
//   if (!order) return res.status(404).json({ message: "Order not found" });

//   if (!order.vendor) order.vendor = req.user._id;
//   order.status = status;
//   await order.save();

//   client.publish(MQTT_TOPICS.ORDER_UPDATE, JSON.stringify({ orderId: order._id, status: order.status, vendor: order.vendor }), { qos: 1 });

//   res.json(order);
// };



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

    
    // publishEvent(MQTT_TOPICS.ORDER_UPDATE, {

    //   orderId: order._id,
    //   status: order.status,
    //   vendor: order.vendor,
    // });
    
    publishEvent(MQTT_TOPICS.ORDER_UPDATE, {
      topic: "orders/update",
      data: {
        orderId: order._id,
        status: order.status,
        vendor: order.vendor,
      },
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
      .populate("vendor", "name isOnline");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// all orderss - vender
// const getVendorOrders = async (req, res) => {
//   const orders = await Order.find({ vendor: req.user._id });
//   res.json(orders);
// };
const getVendorOrders = async (req, res) => {
  const orders = await Order.find({ $or: [{ vendor: req.user._id }, { vendor: null }] });
  res.json(orders);
};


export { createOrder, updateOrderStatus, getAllOrders  , getVendorOrders};
