const mongoose = require("mongoose");
const paymentHistorySchema = require("./subSchema/paymentHistorySchema");
const creditBook = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    customerName: {
        type: String,
        required: true
    },

    customerPhone: {
        type: String,
        required: true
    },

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    productSummary: {
        type: String,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    remainingAmount: {
        type: Number,
        required: true
    },

    orderDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Cleared"],
        default: "Pending"
    },

    clearedAt: {
        type: Date,
        default: null
    },

    paymentHistory: {
        type: [paymentHistorySchema],
        default: []
    }

}, {
    timestamps: true
});


module.exports = mongoose.model("CreditBook", creditBook);