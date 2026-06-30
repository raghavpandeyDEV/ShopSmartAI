import RazorPay from "razorpay"

const razorpayInstance = new RazorPay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_SECRET
})
export default razorpayInstance