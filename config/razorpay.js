import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_SJTKjbIuvQ1Z5X",
  key_secret: "leMWrmw1vvOr16wiXseND9qX",
});

console.log("Razorpay Initialized ✅");

export default razorpayInstance;