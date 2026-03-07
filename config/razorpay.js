// import Razorpay from "razorpay";

// const razorpayInstance = new Razorpay({
//   key_id: "rzp_test_SJTKjbIuvQ1Z5X",
//   key_secret: "leMWrmw1vvOr16wiXseND9qX",
// });

// console.log("Razorpay Initialized ✅");

// export default razorpayInstance;

import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config(); // 🔥 important

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("Razorpay Initialized ✅");

export default razorpayInstance;
