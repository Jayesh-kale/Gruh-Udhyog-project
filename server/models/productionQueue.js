//it's says how much orders we have to prepared
//Production Queue Module

const mongoose = require("mongoose");

const productionHistorySchema = new mongoose.Schema(
    {
        action: {
            type: String,
            enum: [
                "Order Created",
                "Moved To Preparing",
                "Moved To Ready",
                "Delivered",
                "Cancelled",
                "Manual Adjustment",
                "Product Added",
                "Product Removed",
                "Quantity Updated"
            ],
            required: true
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null
        },

        orderType: {
            type: String,
            enum: ["Online", "Offline"],
            default: null
        },

        quantity: {
            type: Number,
            required: true
        },

        previousStage: {
            type: String,
            default: null
        },

        currentStage: {
            type: String,
            default: null
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const productionQueue = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            unique: true
        },

        productName: {
            type: String,
            required: true
        },

        unit: {
            type: String,
            required: true
        },

        pendingOnline: {
            type: Number,
            default: 0
        },

        pendingOffline: {
            type: Number,
            default: 0
        },

        preparingOnline: {
            type: Number,
            default: 0
        },

        preparingOffline: {
            type: Number,
            default: 0
        },

        readyOnline: {
            type: Number,
            default: 0
        },

        readyOffline: {
            type: Number,
            default: 0
        },

        history: {
            type: [productionHistorySchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

productionQueue.virtual("totalPending").get(function () {
    return this.pendingOnline + this.pendingOffline;
});

productionQueue.virtual("totalPreparing").get(function () {
    return this.preparingOnline + this.preparingOffline;
});

productionQueue.virtual("totalReady").get(function () {
    return this.readyOnline + this.readyOffline;
});

productionQueue.set("toJSON", { virtuals: true });
productionQueue.set("toObject", { virtuals: true });

module.exports = mongoose.model(
    "ProductionQueue",
    productionQueue
);