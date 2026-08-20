const mongoose = require("mongoose");

const ProductionQueue = require("../models/productionQueue");
const Product = require("../models/product");

const { sendSuccess, sendError } = require("../utils/sendResponse");

// Get All Production Queue

exports.getAllProductionQueues = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const search = req.query.search?.trim();

        const query = {};

        if (search) {

            const products = await mongoose
                .model("Product")
                .find({

                    name: {
                        $regex: search,
                        $options: "i"
                    }

                })
                .select("_id");

            query.productId = {
                $in: products.map(product => product._id)
            };

        }

        const totalRecords =
            await ProductionQueue.countDocuments(query);

        const queues = await ProductionQueue.find(query)
            .populate(
                "productId",
                "name category type image unit"
            )
            .sort({
                updatedAt: -1
            })
            .skip(skip)
            .limit(limit);

        return sendSuccess(

            res,

            200,

            "Production queue fetched successfully.",

            {

                totalRecords,

                currentPage: page,

                totalPages: Math.ceil(totalRecords / limit),

                queues

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

// Get Queue By Product
exports.getProductionQueueByProduct = async (req, res) => {

    try {

        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {

            return sendError(

                res,

                400,

                "Invalid product id."

            );

        }

        const queue =
            await ProductionQueue.findOne({

                productId

            })
            .populate(

                "productId",

                "name category type image unit"

            );

        if (!queue) {

            return sendError(

                res,

                404,

                "Production queue not found."

            );

        }

        return sendSuccess(

            res,

            200,

            "Production queue fetched successfully.",

            {

                queue

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

// Dashboard Summary
exports.getProductionDashboard = async (req, res) => {

    try {

        const queues =
            await ProductionQueue.find();

        const dashboard = {

            totalPending: 0,

            totalPreparing: 0,

            totalReady: 0,

            pendingOnline: 0,

            pendingOffline: 0,

            preparingOnline: 0,

            preparingOffline: 0,

            readyOnline: 0,

            readyOffline: 0,

            totalProducts: queues.length

        };

        for (const queue of queues) {

            dashboard.pendingOnline += queue.pendingOnline;

            dashboard.pendingOffline += queue.pendingOffline;

            dashboard.preparingOnline += queue.preparingOnline;

            dashboard.preparingOffline += queue.preparingOffline;

            dashboard.readyOnline += queue.readyOnline;

            dashboard.readyOffline += queue.readyOffline;

        }

        dashboard.totalPending =
            dashboard.pendingOnline +
            dashboard.pendingOffline;

        dashboard.totalPreparing =
            dashboard.preparingOnline +
            dashboard.preparingOffline;

        dashboard.totalReady =
            dashboard.readyOnline +
            dashboard.readyOffline;

        return sendSuccess(

            res,

            200,

            "Dashboard fetched successfully.",

            dashboard

        );

    } catch (error) {

        return sendError(

            res,

            500,

            error.message

        );

    }

};