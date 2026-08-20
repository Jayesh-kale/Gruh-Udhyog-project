//this is used to generate the data on the dashboard page
//Reports should only use aggregation pipelines and queries to summarize existing data.

const Order = require("../models/order");
const Product = require("../models/product");
const CreditBook = require("../models/creditBook");
const ProductionQueue = require("../models/productionQueue");

const { sendSuccess, sendError } = require("../utils/sendResponse");

exports.getDashboardReport = async (req, res) => {

    try {
        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending"
        });

        const confirmedOrders =
            await Order.countDocuments({
                orderStatus: "Confirmed"
            });

        const preparingOrders =
            await Order.countDocuments({
                orderStatus: "Preparing"
            });

        const readyOrders =
            await Order.countDocuments({
                orderStatus: "Ready"
            });

        const cancelledOrders =
            await Order.countDocuments({
                orderStatus: "Cancelled"
            });

        const sales = await Order.aggregate([

            {
                $group: {

                    _id: null,

                    totalSales: {
                        $sum: "$totalAmount"
                    },

                    totalPaid: {
                        $sum: "$paidAmount"
                    },

                    totalRemaining: {
                        $sum: "$remainingAmount"
                    }

                }

            }

        ]);

        //product
        const totalProducts =
            await Product.countDocuments({
                isActive: true
            });

        const listedOnline =
            await Product.countDocuments({

                isActive: true,

                isListedOnline: true

            });

        // Credit

        const totalCreditCustomers =
            await CreditBook.distinct("customerId");

        const totalCreditAmount =
            await CreditBook.aggregate([

                {

                    $group: {

                        _id: null,

                        total: {
                            $sum: "$remainingAmount"
                        }

                    }

                }

            ]);


        // Production
        const queues = await ProductionQueue.find();

        let pending = 0;

        let preparing = 0;

        let ready = 0;

        for (const queue of queues) {

            pending +=
                queue.pendingOnline +
                queue.pendingOffline;

            preparing +=
                queue.preparingOnline +
                queue.preparingOffline;

            ready +=
                queue.readyOnline +
                queue.readyOffline;

        }

        return sendSuccess(

            res,

            200,

            "Dashboard report fetched successfully.",

            {

                orders: {

                    total: totalOrders,

                    pending: pendingOrders,

                    confirmed: confirmedOrders,

                    preparing: preparingOrders,

                    ready: readyOrders,

                    cancelled: cancelledOrders

                },

                sales: {

                    totalSales:
                        sales[0]?.totalSales || 0,

                    paidAmount:
                        sales[0]?.totalPaid || 0,

                    remainingAmount:
                        sales[0]?.totalRemaining || 0

                },

                products: {

                    total: totalProducts,

                    listedOnline

                },

                credit: {

                    customers:
                        totalCreditCustomers.length,

                    totalAmount:
                        totalCreditAmount[0]?.total || 0

                },

                production: {

                    pending,

                    preparing,

                    ready

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

//sales report for the given date range, payment status, order type, and order status
exports.getSalesReport = async (req, res) => {

    try {

        const {
            from,
            to,
            paymentStatus,
            orderType,
            orderStatus
        } = req.query;

        const query = {
            orderStatus: {
                $ne: "Cancelled"
            }
        };
        //data Report

        if (from || to) {

            query.orderDate = {};

            if (from) {
                query.orderDate.$gte = new Date(from);
            }

            if (to) {

                const endDate = new Date(to);

                endDate.setHours(23, 59, 59, 999);

                query.orderDate.$lte = endDate;

            }

        }
        // Payment Status

        if (paymentStatus) {

            query.paymentStatus = paymentStatus;

        }

        // Order Type

        if (orderType) {

            query.orderType = orderType;

        }

        // Order Status

        if (orderStatus) {

            query.orderStatus = orderStatus;

        }

        // Aggregate Report

        const report = await Order.aggregate([

            {

                $match: query

            },

            {

                $group: {

                    _id: null,

                    totalOrders: {

                        $sum: 1

                    },

                    totalSales: {

                        $sum: "$totalAmount"

                    },

                    totalPaid: {

                        $sum: "$paidAmount"

                    },

                    totalRemaining: {

                        $sum: "$remainingAmount"

                    },

                    averageOrderValue: {

                        $avg: "$totalAmount"

                    }

                }

            }

        ]);

        return sendSuccess(

            res,

            200,

            "Sales report fetched successfully.",

            report[0] || {

                totalOrders: 0,

                totalSales: 0,

                totalPaid: 0,

                totalRemaining: 0,

                averageOrderValue: 0

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

// Product Sales Report
exports.getProductReport = async (req, res) => {

    try {

        const {
            from,
            to,
            category
        } = req.query;

        //we replace this const match={} because it gives cancelled order also
        //hence i implement this:
        const match = {

            orderStatus: {
                $ne: "Cancelled"
            }

        };

        // Date Filter

        if (from || to) {

            match.orderDate = {};

            if (from) {

                match.orderDate.$gte =
                    new Date(from);

            }

            if (to) {

                const endDate = new Date(to);

                endDate.setHours(
                    23,
                    59,
                    59,
                    999
                );

                match.orderDate.$lte = endDate;

            }

        }

        const pipeline = [

            {
                $match: match
            },

            {
                $unwind: "$items"
            }

        ];

        // Category Filter

        if (category) {

            pipeline.push({

                $match: {

                    "items.category": category

                }

            });

        }

        pipeline.push(

            {

                $group: {

                    _id: "$items.productId",

                    productName: {

                        $first: "$items.productName"

                    },

                    category: {

                        $first: "$items.category"

                    },

                    type: {

                        $first: "$items.type"

                    },

                    totalQuantity: {

                        $sum: "$items.quantity"

                    },

                    totalRevenue: {

                        $sum: "$items.itemTotal"

                    },

                    totalOrders: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    totalRevenue: -1

                }

            }

        );

        const report =
            await Order.aggregate(pipeline);

        return sendSuccess(

            res,

            200,

            "Product report fetched successfully.",

            report

        );

    } catch (error) {

        return sendError(

            res,

            500,

            error.message

        );

    }

};
// Customer Report
exports.getCustomerReport = async (req, res) => {

    try {

        const {
            from,
            to,
            search
        } = req.query;

        const match = {

            orderStatus: {
                $ne: "Cancelled"
            }

        };

        if (from || to) {

            match.orderDate = {};

            if (from) {

                match.orderDate.$gte =
                    new Date(from);

            }

            if (to) {

                const endDate = new Date(to);

                endDate.setHours(
                    23,
                    59,
                    59,
                    999
                );

                match.orderDate.$lte = endDate;

            }

        }

        const pipeline = [

            {
                $match: match
            },

            {

                $group: {

                    _id: "$customer.customerId",

                    customerName: {
                        $first: "$customer.name"
                    },

                    phone: {
                        $first: "$customer.phone"
                    },

                    village: {
                        $first: "$customer.village"
                    },

                    totalOrders: {
                        $sum: 1
                    },

                    totalSales: {
                        $sum: "$totalAmount"
                    },

                    paidAmount: {
                        $sum: "$paidAmount"
                    },

                    remainingAmount: {
                        $sum: "$remainingAmount"
                    }

                }

            }

        ];

        if (search) {

            pipeline.push({

                $match: {

                    customerName: {

                        $regex: search,

                        $options: "i"

                    }

                }

            });

        }

        pipeline.push({

            $sort: {

                totalSales: -1

            }

        });

        const report =
            await Order.aggregate(pipeline);

        return sendSuccess(

            res,

            200,

            "Customer report fetched successfully.",

            report

        );

    } catch (error) {

        return sendError(

            res,

            500,

            error.message

        );

    }

};

// Credit Report
exports.getCreditReport = async (req, res) => {

    try {

        const report =
            await CreditBook.aggregate([

                {

                    $group: {

                        _id: null,

                        totalCustomers: {

                            $addToSet: "$customerId"

                        },

                        totalOrders: {

                            $sum: 1

                        },

                        totalCredit: {

                            $sum: "$remainingAmount"

                        },

                        largestCredit: {

                            $max: "$remainingAmount"

                        },

                        averageCredit: {

                            $avg: "$remainingAmount"

                        }

                    }

                }

            ]);

        const data = report[0] || {};

        return sendSuccess(

            res,

            200,

            "Credit report fetched successfully.",

            {

                customers:
                    data.totalCustomers?.length || 0,

                orders:
                    data.totalOrders || 0,

                totalCredit:
                    data.totalCredit || 0,

                largestCredit:
                    data.largestCredit || 0,

                averageCredit:
                    Number(
                        (data.averageCredit || 0)
                            .toFixed(2)
                    )

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

// Production Report
exports.getProductionReport = async (req, res) => {

    try {

        const report =
            await ProductionQueue.aggregate([

                {

                    $group: {

                        _id: null,

                        pendingOnline: {

                            $sum: "$pendingOnline"

                        },

                        pendingOffline: {

                            $sum: "$pendingOffline"

                        },

                        preparingOnline: {

                            $sum: "$preparingOnline"

                        },

                        preparingOffline: {

                            $sum: "$preparingOffline"

                        },

                        readyOnline: {

                            $sum: "$readyOnline"

                        },

                        readyOffline: {

                            $sum: "$readyOffline"

                        }

                    }

                }

            ]);

        const data = report[0] || {};

        const pendingOnline =
            data.pendingOnline || 0;

        const pendingOffline =
            data.pendingOffline || 0;

        const preparingOnline =
            data.preparingOnline || 0;

        const preparingOffline =
            data.preparingOffline || 0;

        const readyOnline =
            data.readyOnline || 0;

        const readyOffline =
            data.readyOffline || 0;

        return sendSuccess(

            res,

            200,

            "Production report fetched successfully.",

            {

                pendingOnline,

                pendingOffline,

                preparingOnline,

                preparingOffline,

                readyOnline,

                readyOffline,

                totalPending:
                    pendingOnline +
                    pendingOffline,

                totalPreparing:
                    preparingOnline +
                    preparingOffline,

                totalReady:
                    readyOnline +
                    readyOffline

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