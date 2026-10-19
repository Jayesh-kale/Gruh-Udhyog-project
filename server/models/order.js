const mongoose = require("mongoose");

const paymentHistorySchema = require(
    "./subSchema/paymentHistorySchema"
);

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        productName: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            default: null,
            trim: true,
        },

        unit: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        pricePerUnit: {
            type: Number,
            required: true,
            min: 0,
        },

        itemTotal: {
            type: Number,
            required: true,
            min: 0,
        },

        image: {
            url: {
                type: String,
                default: "",
                trim: true,
            },
        },
    },
    {
        _id: false,
    }
);

const customerSnapshotSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        village: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const rawMaterialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
        },

        unit: {
            type: String,
            enum: [
                "Kg",
                "Gram",
                "Piece",
                "Packet",
            ],
            default: "Kg",
        },
    },
    {
        _id: false,
    }
);

const editHistorySchema = new mongoose.Schema(
    {
        action: {
            type: String,
            enum: [
                "Created",
                "Updated",
                "Item Added",
                "Item Removed",
                "Quantity Updated",
                "Price Updated",
                "Payment Updated",
                "Status Updated",
                "Raw Material Updated",
                "Customer Updated",
                "Notes Updated",
                "Cancelled",
                "Locked",
            ],
            required: true,
        },

        editedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        editedAt: {
            type: Date,
            default: Date.now,
        },

        reason: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        _id: false,
    }
);

const refundSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        reason: {
            type: String,
            trim: true,
            default: "",
        },

        razorpayRefundId: {
            type: String,
            trim: true,
            default: null,
        },

        status: {
            type: String,
            enum: [
                "Created",
                "Processed",
                "Failed",
            ],
            default: "Created",
        },

        refundedAt: {
            type: Date,
            default: Date.now,
        },

        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        customer: {
            type: customerSnapshotSchema,
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return (
                        Array.isArray(items) &&
                        items.length > 0
                    );
                },
                message:
                    "Order must contain at least one product.",
            },
        },

        orderType: {
            type: String,
            enum: ["Online", "Offline"],
            required: true,
        },

        /*
         * Online customer payments:
         * paymentMethod = "Razorpay"
         *
         * Offline admin payments:
         * paymentMethod = "Cash" or "UPI"
         */
        paymentMethod: {
            type: String,
            enum: [
                "Cash",
                "UPI",
                "Razorpay",
            ],
            required: true,
        },

        paymentGateway: {
            type: String,
            enum: [
                "Razorpay",
                null,
            ],
            default: null,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        paidAmount: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        remainingAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Partially Paid",
                "Paid",
                "Failed",
                "Authorized",
                "Refunded",
                "Partially Refunded",
            ],
            default: "Pending",
            index: true,
        },

        /*
         * Razorpay's server-created order ID.
         *
         * Example:
         * order_Nx123456789
         */
        razorpayOrderId: {
            type: String,
            trim: true,
            default: null,
            index: true,
        },

        /*
         * Razorpay's payment ID returned after checkout.
         *
         * Example:
         * pay_Nx123456789
         */
        razorpayPaymentId: {
            type: String,
            trim: true,
            default: null,
            index: true,
        },

        /*
         * The latest verified Checkout signature.
         * Do not use this as a replacement for webhook validation.
         */
        razorpaySignature: {
            type: String,
            trim: true,
            default: null,
        },

        paymentFailureReason: {
            type: String,
            trim: true,
            default: null,
        },

        paymentCapturedAt: {
            type: Date,
            default: null,
        },

        whatsappReceiptStatus: {
            type: String,
            enum: ["Pending", "Sent", "Failed", "Disabled"],
            default: "Pending",
        },

        whatsappReceiptSentAt: {
            type: Date,
            default: null,
        },

        whatsappReceiptError: {
            type: String,
            trim: true,
            default: null,
        },

        paymentHistory: {
            type: [paymentHistorySchema],
            default: [],
        },

        refunds: {
            type: [refundSchema],
            default: [],
        },

        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Preparing",
                "Ready",
                "Delivered",
                "Cancelled",
            ],
            default: "Pending",
            index: true,
        },

        isLocked: {
            type: Boolean,
            default: false,
        },

        rawMaterials: {
            type: [rawMaterialSchema],
            default: [],
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        editHistory: {
            type: [editHistorySchema],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        orderDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

/*
 * Helpful indexes
 */
orderSchema.index({
    "customer.phone": 1,
});

orderSchema.index({
    "customer.name": 1,
});

orderSchema.index({
    orderStatus: 1,
});

orderSchema.index({
    paymentStatus: 1,
});

orderSchema.index({
    orderType: 1,
});

orderSchema.index({
    orderDate: -1,
});

orderSchema.index({
    orderStatus: 1,
    paymentStatus: 1,
});

orderSchema.index({
    razorpayOrderId: 1,
    paymentStatus: 1,
});

orderSchema.index({
    razorpayPaymentId: 1,
    paymentStatus: 1,
});

/*
 * Validation before save
 */
orderSchema.pre("validate", function (next) {
    const total = Number(this.totalAmount || 0);
    const paid = Number(this.paidAmount || 0);

    if (paid > total) {
        return next(
            new Error(
                "Paid amount cannot be greater than total amount."
            )
        );
    }

    if (
        this.orderType === "Online" &&
        this.paymentMethod !== "Razorpay"
    ) {
        return next(
            new Error(
                "Online orders must use Razorpay payment."
            )
        );
    }

    if (
        this.orderType === "Online" &&
        this.paymentGateway !== "Razorpay"
    ) {
        return next(
            new Error(
                "Online orders must have Razorpay as payment gateway."
            )
        );
    }

    if (
        this.paymentMethod === "Razorpay" &&
        !this.razorpayOrderId
    ) {
        return next(
            new Error(
                "Razorpay order ID is required for Razorpay payments."
            )
        );
    }

   
});

module.exports = mongoose.model(
    "Order",
    orderSchema
);