import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    plan: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "SubscriptionPlan",
  default: null
},
    paymentId: String,
    orderId: String,
    status: {
      type: String,
      enum: ["pending", "active", "failed","expired"],
      default: "pending"
    },
    startDate: Date,
    endDate: Date
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;