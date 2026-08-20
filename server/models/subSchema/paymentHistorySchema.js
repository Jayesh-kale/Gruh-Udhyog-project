const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "UPI"],
            required: true
        },

        paidAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

module.exports = paymentHistorySchema;