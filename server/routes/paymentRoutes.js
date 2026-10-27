const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const paymentController = require("../controllers/paymentController");

router.post(
  "/razorpay/verify",
  verifyToken,
  paymentController.verifyPayment
);

module.exports = router;