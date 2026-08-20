const express = require("express");

const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const {
    createOrder,
    updateOrder,
    updatePayment,
    changeOrderStatus,
    getAllOrders,
    getOrderById,
    deleteOrder,
    getMyOrders
} = require("../controllers/orderController");

//CUSTOMER ROUTES
router.get(
    "/my-orders",
    verifyToken,
    getMyOrders
);


// Admin Routes

// Create Order
router.post(
    "/create",
    verifyToken,
    createOrder
);

// Get All Orders
router.get(
    "/",
    verifyToken,
    isAdmin,
    getAllOrders
);


// Update Order
router.patch(
    "/:id",
    verifyToken,
    isAdmin,
    updateOrder
);

// Update Payment
router.patch(
    "/:id/payment",
    verifyToken,
    isAdmin,
    updatePayment
);

// Change Order Status
router.patch(
    "/:id/status",
    verifyToken,
    isAdmin,
    changeOrderStatus
);

// Soft Delete Order (Optional)
router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteOrder
);

module.exports = router;