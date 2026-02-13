
import { updateOrderStatusService,
  getAllOrdersService,
  getVendorOrdersService,
  createOrderService
 } from "../services/orderService.js";


 const createOrder = async (req, res) => {
  try {
    const order = await createOrderService({
      customerId: req.user._id,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    if (err.message === "Order items required") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

 const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await updateOrderStatusService({
      orderId: req.params.id,
      status: req.body.status,
      userId: req.user._id,
    });

    res.json(updatedOrder);
  } catch (err) {
    if (err.message === "Invalid status")
      return res.status(400).json({ message: err.message });

    if (err.message === "Order not found")
      return res.status(404).json({ message: err.message });

    res.status(500).json({ message: err.message });
  }
};

/* ---------- Admin: Get All Orders ---------- */
 const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- Vendor: Get Orders ---------- */
const getVendorOrders = async (req, res) => {
  try {
    const orders = await getVendorOrdersService(req.user._id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { updateOrderStatus, getAllOrders, getVendorOrders , createOrder};