const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const paymentController = require("../controllers/paymentController");

// Important: this route must use express.raw().
router.post(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleRazorpayWebhook
);

router.post(
  "/razorpay/verify",
  verifyToken,
  paymentController.verifyPayment
);

module.exports = router;