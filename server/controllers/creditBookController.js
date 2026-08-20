const mongoose = require("mongoose");

const CreditBook = require("../models/creditBook");
const { sendSuccess, sendError } = require("../utils/sendResponse");

// Get All Credit Entries
exports.getAllCreditEntries = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const search = req.query.search?.trim();

        const query = {};

        if (search) {

            query.$or = [

                {
                    customerName: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    customerPhone: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }

        const totalRecords = await CreditBook.countDocuments(query);

        const creditEntries = await CreditBook.find(query)
            .sort({ orderDate: -1 })
            .skip(skip)
            .limit(limit);

        return sendSuccess(
            res,
            200,
            "Credit book fetched successfully.",
            {
                totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / limit),
                creditEntries
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

// Get Credit Entry By Id
exports.getCreditEntryById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return sendError(
                res,
                400,
                "Invalid credit entry id."
            );

        }

        const creditEntry = await CreditBook.findById(id);

        if (!creditEntry) {

            return sendError(
                res,
                404,
                "Credit entry not found."
            );

        }

        return sendSuccess(
            res,
            200,
            "Credit entry fetched successfully.",
            {
                creditEntry
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