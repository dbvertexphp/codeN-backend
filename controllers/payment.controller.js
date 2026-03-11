import crypto from 'crypto';
import mongoose from 'mongoose';
import razorpay from '../config/razorpay.js';
import SubscriptionPlan from '../models/admin/SubscriptionPlan/scriptionplan.model.js';
import Subscription from '../models/Subscription.js';
import UserModel from '../models/user/userModel.js';
import PromoCode from '../models/admin/promo/promo.model.js';
//working krishna
// export const createOrder = async (req, res) => {
//   try {
//     const { planId, userId } = req.body;

//     // 🔹 Validate Inputs
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required',
//       });
//     }

//     if (!planId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Plan ID is required',
//       });
//     }

//     // 🔹 Find Plan
//     const plan = await SubscriptionPlan.findById(planId);

//     if (!plan || !plan.isActive) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plan not found or inactive',
//       });
//     }

//     // 🔥 Get First Pricing Object
//     const pricing = plan.pricing[0];

//     if (!pricing) {
//       return res.status(400).json({
//         success: false,
//         message: 'Pricing not available',
//       });
//     }

//     const amount = pricing.price * 100; // convert to paisa

//     // 🔹 Create Razorpay Order
//     const order = await razorpay.orders.create({
//       amount,
//       currency: 'INR',
//       receipt: `receipt_${Date.now()}`,
//     });

//     // 🔥 Calculate Start & End Date
//     const startDate = new Date();
//     let endDate = new Date(startDate);

//     if (pricing.durationType === 'months') {
//       const monthsToAdd = pricing.totalMonths || pricing.months || 0;
//       endDate.setMonth(endDate.getMonth() + monthsToAdd);
//     } else if (pricing.durationType === 'days') {
//       const daysToAdd = pricing.days || 0;
//       endDate.setDate(endDate.getDate() + daysToAdd);
//     }

//     // 🔹 Create Subscription Entry
//     await Subscription.create({
//       user: userId,
//       plan: planId,
//       orderId: order.id,
//       paymentId: null,
//       status: 'pending',
//       startDate,
//       endDate,
//     });

//     return res.status(200).json({
//       success: true,
//       orderId: order.id,
//       amount,
//       planName: plan.name,
//       price: pricing.price,
//       duration:
//         pricing.durationType === 'months'
//           ? `${pricing.totalMonths || pricing.months} Months`
//           : `${pricing.days} Days`,
//     });
//   } catch (error) {
//     console.error('Create Order Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Create order failed',
//     });
//   }
// };

// export const createOrder = async (req, res) => {
//   try {
//     const { planId, userId, promoCode } = req.body;

//     // 🔹 Validate Inputs
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required',
//       });
//     }

//     if (!planId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Plan ID is required',
//       });
//     }

//     // 🔹 Find Plan
//     const plan = await SubscriptionPlan.findById(planId);

//     if (!plan || !plan.isActive) {
//       return res.status(404).json({
//         success: false,
//         message: 'Plan not found or inactive',
//       });
//     }

//     // 🔥 Get First Pricing Object
//     const pricing = plan.pricing[0];

//     if (!pricing) {
//       return res.status(400).json({
//         success: false,
//         message: 'Pricing not available',
//       });
//     }

//     let finalPrice = pricing.price;

//     if (promoCode) {
//       const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });

//       if (!promo || !promo.isActive) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid promo code',
//         });
//       }

//       // Expiry Check
//       if (promo.expiryDate < new Date()) {
//         return res.status(400).json({
//           success: false,
//           message: 'Promo code expired',
//         });
//       }

//       // Usage Limit Check
//       if (promo.usedCount >= promo.usageLimit) {
//         return res.status(400).json({
//           success: false,
//           message: 'Promo code usage limit reached',
//         });
//       }

//       // Minimum Purchase Check
//       if (pricing.price < promo.minPurchase) {
//         return res.status(400).json({
//           success: false,
//           message: `Minimum purchase should be ₹${promo.minPurchase}`,
//         });
//       }

//       // Discount Calculation
//       if (promo.discountType === 'percentage') {
//         let discount = (pricing.price * promo.discountValue) / 100;

//         if (promo.maxDiscount && discount > promo.maxDiscount) {
//           discount = promo.maxDiscount;
//         }

//         finalPrice = pricing.price - discount;
//       }

//       if (promo.discountType === 'fixed') {
//         finalPrice = pricing.price - promo.discountValue;
//       }

//       if (finalPrice < 0) finalPrice = 0;
//     }

//     const amount = finalPrice * 100; // convert to paisa

//     // 🔹 Create Razorpay Order
//     const order = await razorpay.orders.create({
//       amount,
//       currency: 'INR',
//       receipt: `receipt_${Date.now()}`,
//     });

//     // 🔥 Calculate Start & End Date
//     const startDate = new Date();
//     let endDate = new Date(startDate);

//     if (pricing.durationType === 'months') {
//       const monthsToAdd = pricing.totalMonths || pricing.months || 0;
//       endDate.setMonth(endDate.getMonth() + monthsToAdd);
//     } else if (pricing.durationType === 'days') {
//       const daysToAdd = pricing.days || 0;
//       endDate.setDate(endDate.getDate() + daysToAdd);
//     }
//     console.log('PromoCode:', promoCode);
//     console.log('Original Price:', pricing.price);
//     console.log('Final Price:', finalPrice);
//     console.log('Razorpay Amount:', amount);
//     // 🔹 Create Subscription Entry
//     await Subscription.create({
//       user: userId,
//       plan: planId,
//       orderId: order.id,
//       paymentId: null,
//       status: 'pending',
//       startDate,
//       endDate,
//       promoCode: promoCode || null,
//     });
//     return res.status(200).json({
//       success: true,
//       orderId: order.id,
//       planName: plan.name,
//       originalPrice: pricing.price,
//       discountedPrice: finalPrice,
//       discount: pricing.price - finalPrice,
//       amount: amount, // Razorpay paisa (same variable)
//       actualAmount: amount / 100, // 👈 rupees me
//       duration:
//         pricing.durationType === 'months'
//           ? `${pricing.totalMonths || pricing.months} Months`
//           : `${pricing.days} Days`,
//     });
//   } catch (error) {
//     console.error('Create Order Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Create order failed',
//     });
//   }
// };

export const createOrder = async (req, res) => {
  try {
    // 1. Inputs (Flutter se selectedMonths bhejna zaroori hai)
    const { planId, userId, promoCode, selectedMonths } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Plan ID are required',
      });
    }

    // 2. Find Plan
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found or inactive',
      });
    }

    // 3. Find Correct Pricing Tier (Jaisa applyPromoCode mein kiya tha)
    const months = Number(selectedMonths);
    const pricing =
      plan.pricing.find((p) => p.months === months) || plan.pricing[0];

    if (!pricing) {
      return res.status(400).json({
        success: false,
        message: 'Pricing tier not found for selected duration',
      });
    }

    let finalPrice = pricing.price;
    let appliedPromo = null;

    // 4. Promo Code Logic
    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode.toUpperCase(),
        isActive: true,
      });

      if (promo) {
        const now = new Date();
        const expiry = new Date(promo.expiryDate);

        // Saare checks: Expiry, Usage, Min Purchase, aur Applicable Months
        const isExpired = now > expiry;
        const limitReached = promo.usedCount >= promo.usageLimit;
        const minPurchaseMet = pricing.price >= promo.minPurchase;
        const isApplicableMonth =
          !promo.applicableMonths?.length ||
          promo.applicableMonths.includes(months);

        if (
          !isExpired &&
          !limitReached &&
          minPurchaseMet &&
          isApplicableMonth
        ) {
          let discount = 0;
          if (promo.discountType === 'percentage') {
            discount = (pricing.price * promo.discountValue) / 100;
            if (promo.maxDiscount && discount > promo.maxDiscount) {
              discount = promo.maxDiscount;
            }
          } else {
            discount = promo.discountValue;
          }

          finalPrice = pricing.price - discount;
          appliedPromo = promo.code; // Store for subscription record
        } else {
          // Agar promo invalid hai toh aap error bhi bhej sakte hain
          console.log('Promo Code not valid');
        }
      }
    }

    if (finalPrice < 0) finalPrice = 0;

    // 5. Razorpay Amount (Math.round use karein decimals se bachne ke liye)
    const amountInPaisa = Math.round(finalPrice * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaisa,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // 6. Calculate Start & End Date
    const startDate = new Date();
    let endDate = new Date(startDate);

    if (pricing.durationType === 'months') {
      const monthsToAdd = pricing.totalMonths || pricing.months || 0;
      endDate.setMonth(endDate.getMonth() + monthsToAdd);
    } else if (pricing.durationType === 'days') {
      const daysToAdd = pricing.days || 0;
      endDate.setDate(endDate.getDate() + daysToAdd);
    }

    // 7. Create Subscription Entry
    await Subscription.create({
      user: userId,
      plan: planId,
      orderId: order.id,
      paymentId: null,
      status: 'pending',
      startDate,
      endDate,
      promoCode: appliedPromo || null,
    });

    // 8. Final Response
    return res.status(200).json({
      success: true,
      orderId: order.id,
      planName: plan.name,
      originalPrice: pricing.price,
      discountedPrice: finalPrice,
      discount: pricing.price - finalPrice,
      amount: amountInPaisa, // Paisa for Razorpay
      actualAmount: finalPrice, // Rupees for UI
      duration:
        pricing.durationType === 'months'
          ? `${months} Months`
          : `${pricing.days} Days`,
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Create order failed',
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }

    const subscription = await Subscription.findOne({
      orderId: razorpay_order_id,
    }).populate('plan');

    if (!subscription) {
      return res.status(404).json({
        message: 'Subscription not found',
      });
    }

    // Already active check
    if (subscription.status === 'active') {
      return res.status(200).json({
        success: true,
        message: 'Subscription already active',
      });
    }

    subscription.paymentId = razorpay_payment_id;
    subscription.status = 'active';
    subscription.startDate = new Date();

    const pricing = subscription.plan.pricing[0];
    let endDate = new Date();

    if (pricing.durationType === 'months') {
      const monthsToAdd = pricing.totalMonths || pricing.months || 1;
      endDate.setMonth(endDate.getMonth() + monthsToAdd);
    } else if (pricing.durationType === 'days') {
      const daysToAdd = pricing.days || 1;
      endDate.setDate(endDate.getDate() + daysToAdd);
    }

    subscription.endDate = endDate;

    await subscription.save();

    // ✅ USER MODEL UPDATE
    await UserModel.findByIdAndUpdate(subscription.user, {
      subscription: {
        plan_id: subscription.plan._id,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: true,
      },
      subscriptionStatus: 'premium_plus',
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified & subscription activated',

      planName: subscription.plan.name,
      planId: subscription.plan._id,

      startDate: subscription.startDate,
      endDate: subscription.endDate,

      status: subscription.status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

export default { createOrder, verifyPayment };
