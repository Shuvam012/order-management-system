import express from "express";

import { createOrder, updateOrderStatus, getAllOrders  ,getVendorOrders} from "../controllers/orderController.js";
import {protect, authorize} from '../middleware/authMiddleware.js'



const router = express.Router();



// Customer
router.post("/", protect, authorize("customer"), createOrder);

// Vendor
router.put("/:id", protect, authorize("vendor"), updateOrderStatus);

router.get("/vendor", protect, authorize("vendor"), getVendorOrders);


// Admin
router.get("/", protect, authorize("admin"), getAllOrders);



export default router;
