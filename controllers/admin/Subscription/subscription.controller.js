import SubscriptionPlan from "../../../models/admin/SubscriptionPlan/scriptionplan.model.js";
import User from "../../../models/user/userModel.js";
import SubscriptionTransaction from "../../../models/admin/SubscriptionTransaction.js";


export const getAllSubscriptionPlansPublic = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Subscription Plans fetched successfully",
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export const createSubscriptionPlan = async (req, res) => {
  try {
    const { name, features, pricing, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Plan name is required",
      });
    }

    if (!pricing || !Array.isArray(pricing) || pricing.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Please add at least one pricing row",
      });
    }

    // 🔥 Process Each Pricing Row
    const processedPricing = pricing.map((item) => {
      let totalDays = 0;
      let totalMonths = 0;

      if (item.durationType === "months") {
        totalMonths =
          Number(item.months || 0) + Number(item.extraMonths || 0);

        totalDays = totalMonths * 30;
      } else {
        totalDays = Number(item.days || 0);
      }

      const perDay =
        totalDays > 0 ? Number(item.price) / totalDays : 0;

      return {
        durationType: item.durationType,
        months: Number(item.months || 0),
        extraMonths: Number(item.extraMonths || 0),
        totalMonths,
        days: Number(item.days || 0),
        price: Number(item.price),
        perDay: Number(perDay.toFixed(2)),
        planLabel:
          item.durationType === "months"
            ? `${item.months}M + ${item.extraMonths || 0}M FREE`
            : `${item.days} Days`,
        discountLabel: item.discountLabel || "",
      };
    });

    const newPlan = await SubscriptionPlan.create({
      name,
      features,
      pricing: processedPricing,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      status: true,
      message: "Subscription Plan Created Successfully!",
      data: newPlan,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * 🟢 2. Buy Subscription Plan (User)
 * User planId aur selectedMonths (1, 3, 6, 12, 24) bhejega.
 */
export const buySubscriptionPlan = async (req, res) => {
  try {
    const { planId, selectedMonths, transactionId, paymentMethod } = req.body;
    const user_id = req.headers.userID;

    // 1. User check karein
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    // 2. Plan check karein
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(400).json({ status: false, message: "Plan is invalid or inactive" });
    }

    // 3. Pricing variant dhoondein (1, 3, 6, 12 mahine wala)
    const pricingOption = plan.pricing.find(p => p.months === Number(selectedMonths));
    if (!pricingOption) {
      return res.status(400).json({ status: false, message: "Invalid duration selected" });
    }

    // 4. Dates Calculate karein
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + pricingOption.months); // Mahino ke hisab se expiry set hogi

    // 5. User model update karein
    user.subscription = {
      plan_id: plan._id,
      startDate: startDate,
      endDate: endDate,
      isActive: true,
      selectedMonths: pricingOption.months
    };

    // Optional: Subscription name ke basis par status update
    const planName = plan.name.toLowerCase();
    user.subscriptionStatus = planName.includes("professional") ? "professional" :
                             planName.includes("premium") ? "premium_plus" : "starter";

    await user.save();

    // 6. Transaction Record banayein
    const transaction = await SubscriptionTransaction.create({
      user_id: user._id,
      plan_id: plan._id,
      amount: pricingOption.price, // Wahi price jo select kiya gaya
      transactionId: transactionId || `TXN-${Date.now()}`,
      paymentStatus: "success",
      paymentMethod: paymentMethod || "online",
      startDate,
      endDate,
      durationInDays: pricingOption.months * 30 // Approx days for history
    });

    res.status(200).json({
      status: true,
      message: `Successfully subscribed to ${plan.name} for ${selectedMonths} month(s)!`,
      data: { subscription: user.subscription, transaction }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * 🟢 3. Get All Plans for Admin
 */
export const getAllPlansForAdmin = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, data: plans });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * 🟢 4. Update Subscription Plan
 */
export const updateSubscriptionPlan = async (req, res) => {
  try {
    const { name, features, pricing, isActive } = req.body;

    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.planId,
      {
        name,
        features,
        pricing,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!plan)
      return res.status(404).json({
        status: false,
        message: "Plan not found"
      });

    res.status(200).json({
      status: true,
      message: "Plan Updated Successfully!",
      data: plan
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

/**
 * 🟢 5. Delete Subscription Plan
 */
export const deleteSubscriptionPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndDelete(req.params.planId);
    if (!plan) return res.status(404).json({ status: false, message: "Plan not found" });

    res.status(200).json({ status: true, message: "Plan Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAllTransactionsForAdmin = async (req, res) => {
  try {
    const transactions = await SubscriptionTransaction.find()
      .populate('user_id', 'name email') // User model se naam aur email uthayega
      .populate('plan_id', 'name')      // Plan model se plan ka naam uthayega
      .sort({ createdAt: -1 });         // Latest transactions sabse upar

    res.status(200).json({
      status: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
/**
 * 🟢 6. Get Active Plans for User (Flutter)
 */
export const getActivePlansForUser = async (req, res) => {
  try {
    // Sirf wahi plans jo admin ne 'active' rakhe hain
    const plans = await SubscriptionPlan.find({ isActive: true })
      .select('name features pricing') // Sirf kaam ki fields bhejein
      .sort({ "pricing.0.price": 1 }); // Saste plans pehle dikhane ke liye

    res.status(200).json({
      status: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * 🟢 7. Get User's Current Subscription (Flutter)
 */
export const getMySubscription = async (req, res) => {
  try {
    const user_id = req.headers.userID; // Same logic as your buy API

    const user = await User.findById(user_id)
      .select('subscription subscriptionStatus')
      .populate('subscription.plan_id', 'name');

    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    res.status(200).json({
      status: true,
      data: {
        isSubscribed: user.subscription?.isActive || false,
        details: user.subscription,
        status: user.subscriptionStatus
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

