const mongoose = require("mongoose");

const Order = require("../models/order");
const CreditBook = require("../models/creditBook");

const generateOrderNumber = require("../utils/generateOrderNumber");
const buildOrderItems = require("../utils/buildOrderItems");
const calculatePayment = require("../utils/calculatePayment");
const isValidStatusTransition = require("../utils/isValidStatusTransition");

const generateEditHistory = require("../utils/generateEditHistory");
const buildOrderFilter = require("../utils/buildOrderFilter");
const { syncProductionQueue, syncUpdatedOrder } = require("../utils/syncProductionQueue");

const syncCreditBook = require("../utils/syncCreditBook");
const { sendSuccess, sendError } = require("../utils/sendResponse");


exports.createOrder = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();
        const {

            customer: customerData,

            orderType,

            paymentMethod,

            paidAmount = 0,

            rawMaterials = [],

            notes = req.body.orderType === "Online" ? "Online Order" : ""

        } = req.body;
        console.log(req.body);

        // Normalize items: accept either `productId` or `productID` from clients
        let items = Array.isArray(req.body.items) ? req.body.items : [];

        items = items.map(it => ({
            ...it,
            productId: it.productId || it.productID
        }));

        let customer = customerData;

        if (orderType === "Online") {

            if (!customerData?.village) {

                throw new Error("Village is required.");

            }

            customer = {

                customerId: customerData.customerId || null,

                name: req.body.customer.name,

                phone: req.body.customer.phone,

                village: req.body.customer.village

            };

        }
        if (orderType === "Offline") {

            if (req.user.role !== "admin") {

                return sendError(
                    res,
                    403,
                    "Only admin can create offline orders."
                );
            }

            if (!customer) {
                throw new Error("Customer details are required.");
            }

        }

        if (!["Online", "Offline"].includes(orderType)) {
            throw new Error("Invalid order type.");
        }

        if (!["Cash", "UPI"].includes(paymentMethod)) {
            throw new Error("Invalid payment method.");
        }

        if (!items || items.length === 0) {

            throw new Error("At least one product is required.");

        }

        const {
            orderItems,
            totalAmount
        } = await buildOrderItems(
            items,
            orderType,
            session
        );

        const {
            remainingAmount,
            paymentStatus
        } = calculatePayment(
            totalAmount,
            paidAmount
        );

        const orderNumber = await generateOrderNumber();

        const orders = await Order.create(
            [
                {
                    orderNumber,

                    customer,

                    items: orderItems,

                    orderType,

                    paymentMethod,

                    totalAmount,

                    paidAmount,

                    remainingAmount,

                    paymentStatus,

                    rawMaterials,

                    notes,

                    paymentHistory:
                        paidAmount > 0
                            ? [
                                {
                                    amount: paidAmount,
                                    paymentMethod
                                }
                            ]
                            : [],

                    editHistory: [
                        {
                            action: "Created",
                            editedBy: req.user?.id || customerData.customerId,
                            reason: "Order created."
                        }
                    ]
                }
            ],
            { session }
        );

        const createdOrder = orders[0];

        await syncCreditBook(createdOrder, session);

        // Sync Production Queue
        await syncProductionQueue(

            createdOrder,
            null,
            "Pending",
            session

        );

        await session.commitTransaction();

        return sendSuccess(res, 201, "Order created successfully.", createdOrder);

    } catch (error) {

        await session.abortTransaction();

        return sendError(res, 500, error.message);

    } finally {

        session.endSession();

    }

};

//for getting all the orders through pagination and filtering
exports.getAllOrders = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            sort = "-createdAt"
        } = req.query;

        console.log("Query Parameters in getAllOrders:", req.query); // Log the query parameters to see what is being passed

        const pageNumber = Math.max(1, Number(page) || 1);

        const limitNumber = Math.min(
            100,
            Math.max(1, Number(limit) || 10)
        );

        const skip = (pageNumber - 1) * limitNumber;

        const filter = buildOrderFilter(req.query);

        const orders = await Order.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNumber);

        const totalOrders = await Order.countDocuments(filter);

        const totalPages = Math.ceil(
            totalOrders / limitNumber
        );

        return sendSuccess(
            res,
            200,
            "Orders fetched successfully.",
            {

                orders,

                pagination: {

                    totalOrders,

                    totalPages,

                    currentPage: pageNumber,

                    limit: limitNumber,

                    hasNextPage:
                        pageNumber < totalPages,

                    hasPreviousPage:
                        pageNumber > 1

                }

            }
        );

    } catch (error) {

        return sendError(
            res,
            500,
            error.message
        );

    }

};

//for getting the order details by id
exports.getMyOrders = async (req, res) => {

    try {

        const {

            page = 1,

            limit = 10,

            sort = "-createdAt"

        } = req.query;

        const pageNumber = Math.max(
            1,
            Number(page) || 1
        );

        const limitNumber = Math.min(
            100,
            Math.max(1, Number(limit) || 10)
        );

        const skip = (pageNumber - 1) * limitNumber;

        let filter = {};

        // Admin -> All Orders
        if (req.user.role === "admin") {

            filter = buildOrderFilter(req.query);

        }

        // Customer -> Only Own Orders
        else {

            filter = {

                "customer.customerId": req.user?.id,

                ...(req.query.orderStatus && {
                    orderStatus: req.query.orderStatus
                })

            };

        }

        const orders = await Order.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNumber);

        const totalOrders = await Order.countDocuments(filter);

        const totalPages = Math.ceil(
            totalOrders / limitNumber
        );

        return sendSuccess(
            res,
            200,
            "Orders fetched successfully.",
            {
                orders,
                pagination: {

                    totalOrders,

                    totalPages,

                    currentPage: pageNumber,

                    limit: limitNumber,

                    hasNextPage:
                        pageNumber < totalPages,

                    hasPreviousPage:
                        pageNumber > 1

                }
            }
        );

    } catch (error) {

        return sendError(
            res,
            500,
            error.message
        );

    }

};


exports.updateOrder = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return sendError(
                res,
                400,
                "Invalid order id."
            );

        }

        const {
            customer,
            items = [],
            orderType,
            paymentMethod,
            rawMaterials = [],
            notes = "",
            orderDate
        } = req.body;

        const order = await Order.findById(id).session(session);

        if (!order) {
            return sendError(res, 404, "Order not found.");
        }

        if (order.isLocked) {
            return sendError(res, 400, "This order is locked.");
        }

        if (!customer) {
            return sendError(res, 400, "Customer details are required.");
        }

        if (!items || items.length === 0) {
            return sendError(res, 400, "At least one product is required.");
        }

        if (!["Online", "Offline"].includes(orderType)) {
            return sendError(res, 400, "Invalid order type.");
        }

        const validPaymentMethod =
            orderType === "Online"
                ? paymentMethod === "Razorpay"
                : ["Cash", "UPI"].includes(paymentMethod);

        if (!validPaymentMethod) {
            return sendError(res, 400, "Invalid payment method.");
        }

        // Keep old order for edit history
        const oldOrder = order.toObject();

        // Rebuild order items
        const {
            orderItems,
            totalAmount
        } = await buildOrderItems(
            items,
            orderType,
            session
        );

        // Recalculate payment using existing paid amount
        const {
            remainingAmount,
            paymentStatus
        } = calculatePayment(
            totalAmount,
            order.paidAmount
        );

        // Update order details

        order.customer = customer;

        order.items = orderItems;

        order.orderType = orderType;

        order.paymentMethod = paymentMethod;

        order.totalAmount = totalAmount;

        order.remainingAmount = remainingAmount;

        order.paymentStatus = paymentStatus;

        order.paymentGateway =
            orderType === "Online" ? "Razorpay" : null;

        order.rawMaterials = rawMaterials;

        order.notes = notes;

        if (orderDate) {
            order.orderDate = orderDate;
        }

        // Generate edit history
        const history = generateEditHistory(
            oldOrder,
            order,
            req.user._id
        );

        if (oldOrder.totalAmount !== totalAmount) {

            history.push({

                action: "Order Total Updated",

                editedBy: req.user?.id,

                reason: `Order total changed from ₹${oldOrder.totalAmount} to ₹${totalAmount}.`

            });

        }

        order.editHistory.push(...history);

        // Save Order
        await order.save({ session });

        // Synchronize CreditBook
        await syncCreditBook(
            order,
            session
        );

        await syncUpdatedOrder(

            oldOrder,

            order,

            session

        );

        // Commit Transaction
        await session.commitTransaction();

        return sendSuccess(
            res,
            200,
            "Order updated successfully.",
            {
                order
            }
        );

    } catch (error) {

        await session.abortTransaction();

        return sendError(
            res,
            500,
            error.message
        );

    } finally {

        session.endSession();

    }

};


exports.updatePayment = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            await session.abortTransaction();

            return sendError(
                res,
                400,
                "Invalid order id."
            );

        }

        const payload = req.body?.obj || req.body;
        const amount = Number(payload?.paidAmount);
        const paymentMethod = payload?.paymentMethod;

        // console.log("in updatepayment", req.params);
        

        const order = await Order.findById(id).session(session);

        if (!order) {

            await session.abortTransaction();

            return sendError(
                res,
                404,
                "Order not found."
            );

        }

        if (order.isLocked) {

            await session.abortTransaction();

            return sendError(
                res,
                400,
                "This order is locked."
            );

        }

        if (!Number.isFinite(amount) || amount <= 0) {

            await session.abortTransaction();

            return sendError(
                res,
                400,
                "Invalid payment amount."
            );

        }

        if (!["Cash", "UPI"].includes(paymentMethod)) {

            await session.abortTransaction();

            return sendError(
                res,
                400,
                "Invalid payment method."
            );

        }

        if (amount > order.remainingAmount) {

            await session.abortTransaction();

            return sendError(
                res,
                400,
                "Payment exceeds remaining balance."
            );

        }

        const newPaidAmount = order.paidAmount + amount;

        order.paidAmount = newPaidAmount;

        order.paymentHistory.push({

            amount,

            paymentMethod

        });

        const {
            remainingAmount,
            paymentStatus
        } = calculatePayment(
            order.totalAmount,
            order.paidAmount
        );

        order.remainingAmount = remainingAmount;

        order.paymentStatus = paymentStatus;

        await syncCreditBook(
            order,
            session
        );

        order.editHistory.push({

            action: "Payment Updated",

            editedBy: req.user?.id,

            reason: `Customer paid ₹${amount} via ${paymentMethod}.`

        });

        await order.save({ session });

        await session.commitTransaction();

        return sendSuccess(
            res,
            200,
            "Payment updated successfully.",
            { order }
        );

    } catch (error) {

        await session.abortTransaction();

        return sendError(
            res,
            500,
            error.message
        );

    } finally {

        session.endSession();

    }

};

//to change order status from pending to completed or vice versa
exports.changeOrderStatus = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { id } = req.params;
        const { orderStatus } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendError(
                res,
                400,
                "Invalid order id."
            );
        }

        if (!orderStatus) {
            throw new Error("Order status is required.");
        }

        const order = await Order.findById(id).session(session);

        if (!order) {
            return sendError(res, 404, "Order not found.");
        }

        if (order.isLocked) {
            return sendError(res, 400, "This order is locked.");
        }

        if (order.orderStatus === orderStatus) {
            return sendError(res, 400, "Order is already in this status.");
        }

        if (
            !isValidStatusTransition(
                order.orderStatus,
                orderStatus
            )
        ) {
            return sendError(res, 400, `Cannot change status from ${order.orderStatus} to ${orderStatus}.`);
        }

        const editorId = req.user?.id || req.user?._id;

        if (!editorId) {
            return sendError(res, 401, "Unauthorized");
        }

        const previousStatus = order.orderStatus;

        order.orderStatus = orderStatus;

        order.editHistory.push({

            action: "Status Updated",
            editedBy: editorId,
            reason: `Order status changed from ${previousStatus} to ${orderStatus}.`

        });

        await order.save({ session });

        await syncProductionQueue(
            order,
            previousStatus,
            order.orderStatus,
            session
        );

        await session.commitTransaction();

        return sendSuccess(res, 200, "Order status updated successfully.", { order });

    } catch (error) {
        await session.abortTransaction();

        return sendError(res, 500, error.message);

    } finally {

        session.endSession();

    }

};

exports.deleteOrder = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return sendError(
                res,
                400,
                "Invalid order id."
            );

        }

        const order = await Order.findById(id).session(session);

        if (!order) {

            return sendError(
                res,
                404,
                "Order not found."
            );

        }

        if (order.isLocked) {

            return sendError(
                res,
                400,
                "This order is locked."
            );

        }

        if (!order.isActive) {

            return sendError(
                res,
                400,
                "Order is already cancelled."
            );

        }

        const previousStatus = order.orderStatus;
        // Remove order quantity from Production Queue

        await syncProductionQueue(
            order,
            previousStatus,
            "Cancelled",
            session
        );


        // Cancel Order

        order.isActive = false;

        order.orderStatus = "Cancelled";

        order.editHistory.push({

            action: "Cancelled",

            editedBy: req.user?.id,

            reason: "Order cancelled by admin."

        });

        await order.save({ session });

        await session.commitTransaction();

        return sendSuccess(
            res,
            200,
            "Order cancelled successfully.",
            { order }
        );

    } catch (error) {

        await session.abortTransaction();

        return sendError(
            res,
            500,
            error.message
        );

    } finally {

        session.endSession();

    }
};
