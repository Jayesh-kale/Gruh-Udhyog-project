const mongoose = require("mongoose");

const paymentHistorySchema = require("./subSchema/paymentHistorySchema");

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        productName: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            default: null,
            trim: true
        },

        unit: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        pricePerUnit: {
            type: Number,
            required: true,
            min: 0
        },

        itemTotal: {
            type: Number,
            required: true,
            min: 0
        },

        image: {
            url: {
                type: String,
                default: ""
            }
        }
    },
    { _id: false }
);

const customerSnapshotSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        village: {
            type: String,
            required: true,
            trim: true
        }
    },
    { _id: false }
);

const rawMaterialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        unit: {
            type: String,
            enum: ["Kg", "Gram", "Piece", "Packet"],
            default: "Kg"
        }
    },
    { _id: false }
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
                "Locked"
            ],
            required: true
        },

        editedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        editedAt: {
            type: Date,
            default: Date.now
        },

        reason: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        customer: {
            type: customerSnapshotSchema,
            required: true
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return Array.isArray(items) && items.length > 0;
                },
                message: "Order must contain at least one product."
            }
        },

        orderType: {
            type: String,
            enum: ["Online", "Offline"],
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "UPI"],
            required: true
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paidAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        remainingAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Partially Paid", "Paid"],
            default: "Pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Preparing",
                "Ready",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        },

        isLocked: {
            type: Boolean,
            default: false
        },

        rawMaterials: {
            type: [rawMaterialSchema],
            default: []
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        },

        paymentHistory: {
            type: [paymentHistorySchema],
            default: []
        },

        editHistory: {
            type: [editHistorySchema],
            default: []
        },

        isActive: {
            type: Boolean,
            default: true
        },
        
        orderDate: {
            type: Date,
            required: true,
            default: Date.now
        },
    },
    {
        timestamps: true
    }
);



orderSchema.index({
    "customer.phone": 1
});

orderSchema.index({
    "customer.name": 1
});

orderSchema.index({
    orderStatus: 1
});

orderSchema.index({
    paymentStatus: 1
});

orderSchema.index({
    orderType: 1
});

orderSchema.index({
    orderDate: -1
});

orderSchema.index({
    orderStatus: 1,
    paymentStatus: 1
});

module.exports = mongoose.model("Order", orderSchema);