// import Order from "../models/Order";

// //create order

//  const createOrder = async (req, res) => {
//   try {
//     const { items, totalAmount } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "Order items required" });
//     }

//     const order = await Order.create({
//       customer: req.user._id,
//       items,
//       totalAmount,
//     });

//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




// // update status
//  const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Vendor accepting order
//     if (status === "accepted") {
//       order.vendor = req.user._id;
//     }

//     order.status = status;
//     await order.save();

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };





// // all order  admin

//  const getAllOrders = async (req, res) => {
//   const orders = await Order.find()
//     .populate("customer", "name email")
//     .populate("vendor", "name email");

//   res.json(orders);
// };







// export { createOrder, updateOrderStatus, getAllOrders };





import Order from "../models/Order.js";

// ================= CREATE ORDER (Customer) =================
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

    // 🔔 MQTT: orders/new
    // publish("orders/new", order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE ORDER STATUS (SINGLE VENDOR) =================
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

    // Assign vendor once
    if (!order.vendor) {
      order.vendor = req.user._id;
    }

    order.status = status;
    await order.save();

    // 🔔 MQTT: orders/update
    // publish("orders/update", order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL ORDERS (Admin) =================
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

export { createOrder, updateOrderStatus, getAllOrders };
