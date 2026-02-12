import express from "express";
// import { registerUser, loginUser } from "../controllers/authController.js";
import { createOrder, updateOrderStatus, getAllOrders } from "../controllers/orderController.js";
import {protect, authorize} from '../middleware/authMiddleware.js'



const router = express.Router();



// Customer
router.post("/", protect, authorize("customer"), createOrder);

// Vendor
router.put("/:id", protect, authorize("vendor"), updateOrderStatus);

// Admin
router.get("/", protect, authorize("admin"), getAllOrders);

export default router;
