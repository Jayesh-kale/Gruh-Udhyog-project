const mongoose = require("mongoose");
const Product = require("../models/product");
const { uploadToCloudinary, cloudinary } = require("../config/cloudinary");
const buildProductFilter = require("../utils/buildProductFilter");
const buildProductSort = require("../utils/buildProductSort.js");
const { sendSuccess, sendError } = require("../utils/sendResponse");



// Get All Products
exports.getAllProducts = async (req, res) => {

    try {

        let {
            page = 1,
            limit = 10,
            sort = "-createdAt"
        } = req.query;

        // Pagination Validation
        const pageNumber = Math.max(
            1,
            Number(page) || 1
        );

        const limitNumber = Math.min(
            100,
            Math.max(1, Number(limit) || 10)
        );

        const skip = (pageNumber - 1) * limitNumber;

        // Build Filter
        const filter = buildProductFilter(req.query);

        // Sorting
        const sortOption = buildProductSort(sort);

        const totalProducts = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        const totalPages = Math.ceil(
            totalProducts / limitNumber
        );

        return sendSuccess(
            res,
            200,
            "Products fetched successfully.",
            {

                products,

                pagination: {

                    totalProducts,

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

// Get Product By Id
exports.getProductById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return sendError(
                res,
                400,
                "Invalid product id."
            );

        }

        const query = {
            _id: id
        };

        const isAdmin =
            req.user?.role === "Admin";

        const includeInactive =
            req.query.includeInactive === "true";

        if (!(isAdmin && includeInactive)) {
            query.isActive = true;
        }

        const product = await Product.findOne(query);

        if (!product) {

            return sendError(
                res,
                404,
                "Product not found."
            );

        }
        return sendSuccess(
            res,
            200,
            "Product fetched successfully.",
            { product }
        );

    } catch (error) {

        return sendError(
            res,
            500,
            error.message
        );

    }

};

// Create online Product
exports.createProduct = async (req, res) => {

    let uploadedImage = null;
    let image = {

            url: "",

            public_id: ""

        };

    try {

        const {
            name,
            category,
            type,
            description,
            defaultOnlinePrice,
            unit,
            isListedOnline = true,
            isSeasonal = false,
            season = null
        } = req.body;

        if (!name || !category || !unit) {

            return sendError(
                res,
                400,
                "Name, category and unit are required."
            );

        }

        if (defaultOnlinePrice == null || defaultOnlinePrice < 0) {

            return sendError(
                res,
                400,
                "Invalid online price."
            );

        }

        if (isSeasonal && !season) {

            return sendError(
                res,
                400,
                "Season is required for seasonal products."
            );

        }

        if (!isSeasonal && season) {

            return sendError(
                res,
                400,
                "Season should only be provided for seasonal products."
            );

        }
        // ==========================
        // Check Duplicate Product
        // ==========================
        const existingProduct = await Product.findOne({

            name: {
                $regex: `^${name.trim()}$`,
                $options: "i"
            },

            category,

            type,

            isActive: true

        });

        if (existingProduct) {

            return sendError(
                res,
                409,
                "Product already exists."

            );

        }

        // ==========================
        // Upload Image to Cloudinary
        // ==========================
        

        if (req.file) {

            image = await uploadToCloudinary(
                req.file.path,
                "products"
            );

        }
        // ==========================
        // Create Product
        // ==========================
        const product = await Product.create({

            name: name.trim(),

            category: category.trim(),

            type: type ? type.trim() : null,

            description: description?.trim() || "",

            image,

            defaultOnlinePrice,

            unit,

            isListedOnline,

            isSeasonal,

            season: isSeasonal ? season.trim() : null

        });

        // ==========================
        // Success Response
        // ==========================
        return sendSuccess(

            res,

            201,

            "Product created successfully.",

            { product }

        );

    } catch (error) {

        if (image.public_id) {

            await deleteFromCloudinary(
                image.public_id
            );

        }

        return sendError(
            res,
            500,
            error.message
        );

    }

};

//for updating the online product information
exports.updateProduct = async (req, res) => {

    let newUploadedImage = null;
    let oldPublicId = null;

    try {

        const { id } = req.params;

        // ==========================
        // Validate Product Id
        // ==========================
        if (!mongoose.Types.ObjectId.isValid(id)) {

            return sendError(
                res,
                400,
                "Invalid product id."
            );

        }

        // ==========================
        // Find Product
        // ==========================
        const product = await Product.findById(id);

        if (!product) {

            return sendError(
                res,
                404,
                "Product not found."
            );

        }

        // ==========================
        // Read Request Body
        // ==========================
        const {
            name,
            category,
            type,
            description,
            defaultOnlinePrice,
            unit,
            isListedOnline,
            isSeasonal,
            season
        } = req.body;

        // ==========================
        // Business Validation
        // ==========================
        const finalIsSeasonal =
            isSeasonal !== undefined
                ? isSeasonal
                : product.isSeasonal;

        const finalSeason =
            season !== undefined
                ? season
                : product.season;

        if (finalIsSeasonal && !finalSeason) {

            return sendError(
                res,
                400,
                "Season is required for seasonal products."
            );

        }

        if (!finalIsSeasonal && finalSeason) {

            return sendError(
                res,
                400,
                "Season should only be provided for seasonal products."
            );

        }

        // ==========================
        // Duplicate Validation
        // ==========================
        const duplicateProduct = await Product.findOne({

            _id: { $ne: id },

            name: {
                $regex: `^${(name ?? product.name).trim()}$`,
                $options: "i"
            },

            category: category ?? product.category,

            type: type ?? product.type,

            isActive: true

        });

        if (duplicateProduct) {

            return sendError(
                res,
                409,
                "Another product with the same details already exists."
            );

        }

        // ==========================
        // Upload New Image (Optional)
        // ==========================
        if (req.file) {

            oldPublicId = product.image.public_id;

            newUploadedImage = await uploadToCloudinary(
                req.file.buffer,          // Use req.file.path if using diskStorage
                "family-business/products"
            );

            product.image = {
                url: newUploadedImage.secure_url,
                public_id: newUploadedImage.public_id
            };

        }

        // ==========================
        // Update Fields
        // ==========================
        if (name !== undefined)
            product.name = name.trim();

        if (category !== undefined)
            product.category = category.trim();

        if (type !== undefined)
            product.type = type ? type.trim() : null;

        if (description !== undefined)
            product.description = description.trim();

        if (defaultOnlinePrice !== undefined)
            product.defaultOnlinePrice = defaultOnlinePrice;

        if (unit !== undefined)
            product.unit = unit;

        if (isListedOnline !== undefined)
            product.isListedOnline = isListedOnline;

        if (isSeasonal !== undefined)
            product.isSeasonal = isSeasonal;

        product.season = finalIsSeasonal
            ? finalSeason.trim()
            : null;

        // ==========================
        // Save Product
        // ==========================
        await product.save();

        // ==========================
        // Delete Old Image
        // ==========================
        if (oldPublicId) {

            await cloudinary.uploader.destroy(oldPublicId);

        }

        // ==========================
        // Success Response
        // ==========================
        return sendSuccess(
            res,
            200,
            "Product updated successfully.",
            { product }
        );

    } catch (error) {

        // ==========================
        // Rollback Cloudinary Upload
        // ==========================
        if (newUploadedImage?.public_id) {

            await cloudinary.uploader.destroy(
                newUploadedImage.public_id
            );

        }

        return sendError(
            res,
            500,
            error.message
        );

    }

};

// Soft Delete Product
exports.deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;

        // ==========================
        // Validate Product Id
        // ==========================
        if (!mongoose.Types.ObjectId.isValid(id)) {

            return sendError(
                res,
                400,
                "Invalid product id."
            );

        }

        // ==========================
        // Find Product
        // ==========================
        const product = await Product.findById(id);

        if (!product) {

            return sendError(
                res,
                404,
                "Product not found."
            );

        }

        // ==========================
        // Already Deleted?
        // ==========================
        if (!product.isActive) {

            return sendError(
                res,
                400,
                "Product is already inactive."
            );

        }

        // ==========================
        // Soft Delete
        // ==========================
        product.isActive = false;

        await product.save();

        return sendSuccess(
            res,
            200,
            "Product deleted successfully."
        );

    } catch (error) {

        return sendError(
            res,
            500,
            error.message
        );

    }

};




// Search Products
exports.searchProducts = async (req, res) => {
    try {

        const { keyword = "" } = req.query;

        const products = await Product.find({
            isActive: true,
            $or: [
                {
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    type: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        });


        //first check if products are found or not
        if (products.length === 0) {
            return sendError(
                res,
                404,
                "No products found."
            );
        }

        return sendSuccess(res,200,"Products fetched successfully.",{ products });

    } catch (error) {

       return sendError(
            res,
            500,
            error.message
        );

    }
};

//for getting the distinct product categories for the customer to browse
exports.getProductCategory = async (req, res) => {
    try {
        const categories = await Product.find({isActive: true}).distinct("category");
        return sendSuccess(res, 200, "Categories fetched successfully.", { categories });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

//to get featured products
exports.getFeaturedProducts = async (req, res) => {

    const products = await Product.find({

        isListedOnline: true,

        isFeatured: true

    })
    .sort({ displayOrder: 1 })
    .limit(8);

    sendSuccess(
        res,
        200,
        "Featured products fetched successfully",
        { products }
    );

};

exports.getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category, isActive: true });
        if (products.length === 0) {
            return sendError(res, 404, "No products found in this category.");
        }
        return sendSuccess(res, 200, "Products fetched successfully.", { products });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

exports.getSeasonalProducts = async (req, res) => {

    try {
        const seasonalProducts = await Product.find({
            isActive: true,
            isSeasonal: true,
            isListedOnline: true
        });

        if (seasonalProducts.length === 0) {
            return sendError(
                res,
                404,
                "No seasonal products Available."
            );
        }

        return sendSuccess(
            res,
            200,
            "Seasonal products fetched successfully.",
            { seasonalProducts }
        );

    } catch (error) {
        return sendError(
            res,
            500,
            error.message
        );
    }
}
