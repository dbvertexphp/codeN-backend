import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    durationType: {
      type: String,
      enum: ["months", "days"],
      required: true,
    },

    months: {
      type: Number,
      default: 0,
    },

    extraMonths: {
      type: Number,
      default: 0,
    },

    totalMonths: {
      type: Number,
      default: 0,
    },

    days: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    perDay: {
      type: Number,
      default: 0,
    },

    planLabel: {
      type: String, // Example: "6M + 3M FREE"
    },

    discountLabel: {
      type: String,
    },
  },
  { _id: false }
);

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    features: [{ type: String }],

    pricing: [pricingSchema],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);

export default SubscriptionPlan;