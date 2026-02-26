import express from "express";
import paymentController from "../controllers/payment.controller.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create-order",  paymentController.createOrder);
router.post("/verify-payment",  paymentController.verifyPayment);

export default router;