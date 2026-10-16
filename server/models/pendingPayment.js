const mongoose = require("mongoose");

const pendingPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      village: { type: String, required: true, trim: true },
    },
    items: {
      type: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, required: true },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

pendingPaymentSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 24 * 60 * 60 }
);

module.exports = mongoose.model("PendingPayment", pendingPaymentSchema);
