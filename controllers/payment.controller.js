// import crypto from "crypto";
// import mongoose from "mongoose";
// import razorpay from "../config/razorpay.js";
// import SubscriptionPlan from "../models/admin/SubscriptionPlan/scriptionplan.model.js";
// import Subscription from "../models/Subscription.js";

// // export const createOrder = async (req, res) => {
// //   try {
// //     const { planId, userId } = req.body;

// //     // 🔹 Validate Inputs
// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "User ID is required",
// //       });
// //     }

// //     if (!planId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Plan ID is required",
// //       });
// //     }

// //     // 🔹 Find Plan
// //     const plan = await SubscriptionPlan.findById(planId);

// //     if (!plan || !plan.isActive) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Plan not found or inactive",
// //       });
// //     }

// //     // 🔥 Get First Pricing Object
// //     const pricing = plan.pricing[0];

// //     if (!pricing) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Pricing not available",
// //       });
// //     }

// //     const amount = pricing.price * 100; // convert to paisa

// //     // 🔹 Create Razorpay Order
// //     const order = await razorpay.orders.create({
// //       amount,
// //       currency: "INR",
// //       receipt: `receipt_${Date.now()}`,
// //     });

// //     // 🔥 Calculate Start & End Date
// //     const startDate = new Date();
// //     let endDate = new Date(startDate);

// //     if (pricing.durationType === "months") {
// //       const monthsToAdd =
// //         pricing.totalMonths || pricing.months || 0;
// //       endDate.setMonth(endDate.getMonth() + monthsToAdd);
// //     } else if (pricing.durationType === "days") {
// //       const daysToAdd = pricing.days || 0;
// //       endDate.setDate(endDate.getDate() + daysToAdd);
// //     }

// //     // 🔹 Create Subscription Entry
// //     await Subscription.create({
// //       user: userId,
// //       plan: planId,
// //       orderId: order.id,
// //       paymentId: null,
// //       status: "pending",
// //       startDate,
// //       endDate,
// //     });

// //     return res.status(200).json({
// //       success: true,
// //       orderId: order.id,
// //       amount,
// //       planName: plan.name,
// //       price: pricing.price,
// //       duration:
// //         pricing.durationType === "months"
// //           ? `${pricing.totalMonths || pricing.months} Months`
// //           : `${pricing.days} Days`,
// //     });
// //   } catch (error) {
// //     console.error("Create Order Error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Create order failed",
// //     });
// //   }
// // };

// export const createOrder = async (req, res) => {
//   try {

//     const { planId } = req.body;
//     const userId = req.user._id;

//     const plan = await SubscriptionPlan.findById(planId);

//     if (!plan || !plan.isActive) {
//       return res.status(404).json({
//         success:false,
//         message:"Plan not found"
//       });
//     }

//     const pricing = plan.pricing[0];

//     const amount = pricing.price * 100;

//     const order = await razorpay.orders.create({
//       amount,
//       currency:"INR",
//       receipt:`sub_${Date.now()}`,
//       notes:{
//         userId:userId.toString(),
//         planId:planId.toString()
//       }
//     });

//     await Subscription.create({
//       user:userId,
//       plan:planId,
//       orderId:order.id,
//       status:"pending"
//     });

//     res.json({
//       success:true,
//       orderId:order.id,
//       amount,
//       planName:plan.name
//     });

//   } catch(error){

//     console.log(error);

//     res.status(500).json({
//       success:false,
//       message:"Order creation failed"
//     });

//   }
// };

// // const verifyPayment = async (req, res) => {
// //   try {
// //     const {
// //       razorpay_order_id,
// //       razorpay_payment_id,
// //       razorpay_signature
// //     } = req.body;

// //     const generated_signature = crypto
// //       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
// //       .digest("hex");

// //     if (generated_signature !== razorpay_signature) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid signature"
// //       });
// //     }

// //     const subscription = await Subscription.findOne({
// //       orderId: razorpay_order_id
// //     }).populate("plan");

// //     if (!subscription) {
// //       return res.status(404).json({
// //         message: "Subscription not found"
// //       });
// //     }

// //     // 🔥 Already active check
// //     if (subscription.status === "active") {
// //       return res.status(200).json({
// //         success: true,
// //         message: "Subscription already active"
// //       });
// //     }

// //     subscription.paymentId = razorpay_payment_id;
// //     subscription.status = "active";
// //     subscription.startDate = new Date();

// //     const pricing = subscription.plan.pricing[0];
// //     let endDate = new Date();

// //     if (pricing.durationType === "months") {
// //       const monthsToAdd = pricing.totalMonths || pricing.months || 1;
// //       endDate.setMonth(endDate.getMonth() + monthsToAdd);
// //     } else if (pricing.durationType === "days") {
// //       const daysToAdd = pricing.days || 1;
// //       endDate.setDate(endDate.getDate() + daysToAdd);
// //     }

// //     subscription.endDate = endDate;

// //     await subscription.save();

// //     res.status(200).json({
// //       success: true,
// //       message: "Payment verified & subscription activated",
// //       startDate: subscription.startDate,
// //       endDate: subscription.endDate
// //     });

// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).json({ message: "Verification failed" });
// //   }
// // };


// export const verifyPayment = async (req,res)=>{

//   try{

//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature
//     } = req.body;

//     const generated = crypto
//       .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if(generated !== razorpay_signature){

//       return res.status(400).json({
//         success:false,
//         message:"Invalid signature"
//       });

//     }

//     const subscription = await Subscription
//       .findOne({orderId:razorpay_order_id})
//       .populate("plan");

//     if(!subscription){
//       return res.status(404).json({
//         message:"Subscription not found"
//       });
//     }

//     if(subscription.status === "active"){
//       return res.json({
//         success:true,
//         message:"Already verified"
//       });
//     }

//     subscription.paymentId = razorpay_payment_id;
//     subscription.status = "active";

//     const pricing = subscription.plan.pricing[0];

//     const startDate = new Date();
//     let endDate = new Date();

//     if(pricing.durationType === "months"){
//       endDate.setMonth(endDate.getMonth() + pricing.months);
//     }

//     if(pricing.durationType === "days"){
//       endDate.setDate(endDate.getDate() + pricing.days);
//     }

//     subscription.startDate = startDate;
//     subscription.endDate = endDate;

//     await subscription.save();

//     res.json({
//       success:true,
//       message:"Payment verified",
//       startDate,
//       endDate
//     });

//   }catch(error){

//     console.log(error);

//     res.status(500).json({
//       message:"Verification failed"
//     });

//   }

// };

// export default { createOrder, verifyPayment };

import crypto from "crypto";
import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import SubscriptionPlan from "../models/admin/SubscriptionPlan/scriptionplan.model.js";
import Subscription from "../models/Subscription.js";

/*
=====================================
CREATE ORDER
=====================================
*/

export const createOrder = async (req, res) => {
  try {

    const { planId } = req.body;
    const userId = req.user._id;

    if (!planId) {
      return res.status(400).json({
        success:false,
        message:"Plan ID required"
      });
    }

    const plan = await SubscriptionPlan.findById(planId);

    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success:false,
        message:"Plan not found or inactive"
      });
    }

    if (!plan.pricing || !plan.pricing.length) {
      return res.status(400).json({
        success:false,
        message:"Pricing not configured"
      });
    }

    const pricing = plan.pricing[0];

    const amount = pricing.price * 100;

    // block duplicate pending orders
    const pending = await Subscription.findOne({
      user:userId,
      status:"pending"
    });

    if(pending){
      return res.status(400).json({
        success:false,
        message:"Payment already pending"
      });
    }

    const order = await razorpay.orders.create({
      amount,
      currency:"INR",
      receipt:`receipt_${Date.now()}`,
      notes:{
        userId:userId.toString(),
        planId:planId.toString()
      }
    });

    await Subscription.create({
      user:userId,
      plan:planId,
      orderId:order.id,
      paymentId:null,
      status:"pending"
    });

    return res.status(200).json({
      success:true,
      orderId:order.id,
      amount,
      planName:plan.name,
      price:pricing.price
    });

  } catch (error) {

    console.log("Create Order Error:",error);

    return res.status(500).json({
      success:false,
      message:"Order creation failed"
    });

  }
};


/*
=====================================
VERIFY PAYMENT
=====================================
*/

export const verifyPayment = async (req,res)=>{

  try{

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
      return res.status(400).json({
        success:false,
        message:"Invalid payment data"
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if(generatedSignature !== razorpay_signature){

      return res.status(400).json({
        success:false,
        message:"Payment verification failed"
      });

    }

    const subscription = await Subscription
      .findOne({orderId:razorpay_order_id})
      .populate("plan");

    if(!subscription){
      return res.status(404).json({
        success:false,
        message:"Subscription not found"
      });
    }

    if(subscription.status === "active"){
      return res.status(200).json({
        success:true,
        message:"Subscription already active"
      });
    }

    const pricing = subscription.plan.pricing[0];

    const today = new Date();

    let endDate = new Date(today);

    if(pricing.durationType === "months"){
      endDate.setMonth(endDate.getMonth() + pricing.months);
    }

    if(pricing.durationType === "days"){
      endDate.setDate(endDate.getDate() + pricing.days);
    }

    /*
    =================================
    EXTEND EXISTING SUBSCRIPTION
    =================================
    */

    const activeSub = await Subscription.findOne({
      user:subscription.user,
      status:"active",
      endDate:{ $gte: today }
    });

    if(activeSub){

      const newEnd = new Date(activeSub.endDate);

      if(pricing.durationType === "months"){
        newEnd.setMonth(newEnd.getMonth() + pricing.months);
      }

      if(pricing.durationType === "days"){
        newEnd.setDate(newEnd.getDate() + pricing.days);
      }

      activeSub.endDate = newEnd;

      await activeSub.save();

      subscription.status = "merged";
      subscription.paymentId = razorpay_payment_id;

      await subscription.save();

      return res.json({
        success:true,
        message:"Subscription extended",
        expiryDate:newEnd
      });

    }

    /*
    =================================
    ACTIVATE NEW SUBSCRIPTION
    =================================
    */

    subscription.paymentId = razorpay_payment_id;
    subscription.status = "active";
    subscription.startDate = today;
    subscription.endDate = endDate;

    await subscription.save();

    return res.status(200).json({
      success:true,
      message:"Payment verified & subscription activated",
      startDate:today,
      endDate:endDate
    });

  }catch(error){

    console.log("Verify Payment Error:",error);

    return res.status(500).json({
      success:false,
      message:"Verification failed"
    });

  }

};

export default { createOrder, verifyPayment };
