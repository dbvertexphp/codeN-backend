import crypto from "crypto";
import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import SubscriptionPlan from "../models/admin/SubscriptionPlan/scriptionplan.model.js";
import Subscription from "../models/Subscription.js";

export const createOrder = async (req, res) => {
  try {
    const { planId, userId } = req.body;

    // 🔹 Validate Inputs
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    // 🔹 Find Plan
    const plan = await SubscriptionPlan.findById(planId);

    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: "Plan not found or inactive",
      });
    }

    // 🔥 Get First Pricing Object
    const pricing = plan.pricing[0];

    if (!pricing) {
      return res.status(400).json({
        success: false,
        message: "Pricing not available",
      });
    }

    const amount = pricing.price * 100; // convert to paisa

    // 🔹 Create Razorpay Order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // 🔥 Calculate Start & End Date
    const startDate = new Date();
    let endDate = new Date(startDate);

    if (pricing.durationType === "months") {
      const monthsToAdd =
        pricing.totalMonths || pricing.months || 0;
      endDate.setMonth(endDate.getMonth() + monthsToAdd);
    } else if (pricing.durationType === "days") {
      const daysToAdd = pricing.days || 0;
      endDate.setDate(endDate.getDate() + daysToAdd);
    }

    // 🔹 Create Subscription Entry
    await Subscription.create({
      user: userId,
      plan: planId,
      orderId: order.id,
      paymentId: null,
      status: "pending",
      startDate,
      endDate,
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount,
      planName: plan.name,
      price: pricing.price,
      duration:
        pricing.durationType === "months"
          ? `${pricing.totalMonths || pricing.months} Months`
          : `${pricing.days} Days`,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Create order failed",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    const subscription = await Subscription.findOne({
      orderId: razorpay_order_id
    }).populate("plan");

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found"
      });
    }

    // 🔥 Already active check
    if (subscription.status === "active") {
      return res.status(200).json({
        success: true,
        message: "Subscription already active"
      });
    }

    subscription.paymentId = razorpay_payment_id;
    subscription.status = "active";
    subscription.startDate = new Date();

    const pricing = subscription.plan.pricing[0];
    let endDate = new Date();

    if (pricing.durationType === "months") {
      const monthsToAdd = pricing.totalMonths || pricing.months || 1;
      endDate.setMonth(endDate.getMonth() + monthsToAdd);
    } else if (pricing.durationType === "days") {
      const daysToAdd = pricing.days || 1;
      endDate.setDate(endDate.getDate() + daysToAdd);
    }

    subscription.endDate = endDate;

    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Payment verified & subscription activated",
      startDate: subscription.startDate,
      endDate: subscription.endDate
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Verification failed" });
  }
};

export default { createOrder, verifyPayment };