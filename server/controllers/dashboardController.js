const Order = require("../models/order");
const CreditBook = require("../models/creditBook");
const Product = require("../models/product");

const { sendSuccess, sendError } = require("../utils/sendResponse");

exports.getDashboardStats = async (req, res) => {

    try {
        //date range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        //Order statistics

        const totalOrders = await Order.countDocuments({
            isActive: true
        });

        const todayOrders = await Order.countDocuments({
            isActive: true,
            orderDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        const pendingOrders = await Order.countDocuments({
            isActive: true,
            orderStatus: "Pending"
        });

        const todaySalesResult = await Order.aggregate([

            {
                $match: {
                    isActive: true,
                    orderDate: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalAmount"
                    }
                }
            }

        ]);

        const todaySales =
            todaySalesResult[0]?.total || 0;


      //OutStanding Credit

        const creditResult = await Order.aggregate([

            {
                $match: {
                    isActive: true,
                    remainingAmount: {
                        $gt: 0
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$remainingAmount"
                    }
                }
            }

        ]);

        const outstandingCredit =
            creditResult[0]?.total || 0;

            //Order Status Count

        const orderStatusResult =
            await Order.aggregate([

                {
                    $match: {
                        isActive: true
                    }
                },

                {
                    $group: {
                        _id: "$orderStatus",
                        count: {
                            $sum: 1
                        }
                    }
                }

            ]);


        const orderStatus = {
            Pending: 0,
            Confirmed: 0,
            Preparing: 0,
            Ready: 0,
            Delivered: 0,
            Cancelled: 0
        };

        orderStatusResult.forEach(item => {

            if (orderStatus[item._id] !== undefined) {
                orderStatus[item._id] = item.count;
            }

        });
        // RECENT ORDERS

        const recentOrders = await Order.find({
            isActive: true
        })
            .sort({
                createdAt: -1
            })
            .limit(5)
            .select(
                "orderNumber customer items totalAmount paymentStatus orderStatus orderDate"
            )
            .lean();

            //product count

        const totalProducts = await Product.countDocuments({
            isActive: true
        });


        return sendSuccess(
            res,
            200,
            "Dashboard statistics fetched successfully.",
            {
                totalOrders,

                todayOrders,

                todaySales,

                pendingOrders,

                outstandingCredit,

                totalProducts,

                orderStatus,

                recentOrders
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