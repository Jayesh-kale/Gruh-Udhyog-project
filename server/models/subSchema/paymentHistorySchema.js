const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: [
                "Cash",
                "UPI",
                "Razorpay",
            ],
            required: true,
        },

        transactionId: {
            type: String,
            trim: true,
            default: null,
        },

        razorpayPaymentId: {
            type: String,
            trim: true,
            default: null,
        },

        razorpayOrderId: {
            type: String,
            trim: true,
            default: null,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Success",
                "Failed",
                "Refunded",
            ],
            default: "Success",
        },

        failureReason: {
            type: String,
            trim: true,
            default: null,
        },

        paidAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: true,
    }
);

module.exports = paymentHistorySchema;
