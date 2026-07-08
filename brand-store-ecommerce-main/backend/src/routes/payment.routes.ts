import { Router } from "express";
import { protect } from "../middleware/auth";

const router = Router();

// @route   POST /api/payments/stripe
router.post("/stripe", protect, async (req, res, next) => {
  try {
    // Dynamic import to avoid requiring Stripe in dev without keys
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-12-18.acacia" as any,
    });

    const { amount, currency = "usd" } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: { userId: req.user._id.toString() },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/payments/razorpay
router.post("/razorpay", protect, async (req, res, next) => {
  try {
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const { amount, currency = "INR" } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

export default router;
