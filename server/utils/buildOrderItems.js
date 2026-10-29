const product = require("../models/product");

const buildOrderItems = async (items, orderType, session) => {

    // Validate empty items
    if (!items || items.length === 0) {
        throw new Error("At least one product is required.");
    }

    // Check duplicate products
    const productIds = items.map(item => item.productId.toString());

    const itemKeys = items.map(item =>
        `${item.productId.toString()}:${item.packageId || item.packageIndex || "default"}`
    );

    if (itemKeys.length !== new Set(itemKeys).size) {
        throw new Error("Duplicate product packages are not allowed in a single order.");
    }

    // Fetch all products in one query
    const products = await product.find({
        _id: { $in: productIds }
    }).session(session);

    // Verify all products exist
    if (products.length !== productIds.length) {
        throw new Error("One or more products were not found.");
    }

    // Create lookup map
    const productMap = new Map(
        products.map(product => [
            product._id.toString(),
            product
        ])
    );

    const orderItems = [];

    let totalAmount = 0;

    for (const item of items) {

        const product = productMap.get(item.productId.toString());

        if (!product) {
            throw new Error("Product not found.");
        }

        // Quantity validation
        if (item.quantity <= 0) {
            throw new Error(`Invalid quantity for ${product.name}.`);
        }

        // Online Product Validation
        if (
            orderType === "Online" &&
            !product.isListedOnline
        ) {
            throw new Error(
                `${product.name} is not available for online ordering.`
            );
        }

        let pricePerUnit;
        let selectedPackage;

        if (orderType === "Online") {
            selectedPackage = item.packageId
                ? product.packages?.id(item.packageId)
                : Number.isInteger(Number(item.packageIndex))
                    ? product.packages?.[Number(item.packageIndex)]
                    : product.packages?.[0];
            if (product.packages?.length && !selectedPackage) {
                throw new Error(`Please select a valid package for ${product.name}.`);
            }
            pricePerUnit = selectedPackage?.price ?? product.defaultOnlinePrice;

        } else {

            if (
                item.pricePerUnit === undefined ||
                item.pricePerUnit < 0
            ) {
                throw new Error(
                    `Price is required for ${product.name}.`
                );
            }

            pricePerUnit = item.pricePerUnit;

        }

        const itemTotal = pricePerUnit * item.quantity;

        totalAmount += itemTotal;

        orderItems.push({

            productId: product._id,

            productName: product.name,

            category: product.category,

            type: product.type,

            unit: selectedPackage?.label || selectedPackage?.unit || product.unit,

            packageId: selectedPackage?._id || null,

            packageLabel: selectedPackage?.label || null,

            packageQuantity: selectedPackage?.quantity || null,

            packageUnit: selectedPackage?.unit || null,

            quantity: item.quantity,

            pricePerUnit,

            itemTotal,

            image: product.image

        });

    }

    return {
        orderItems,
        totalAmount
    };

};

module.exports = buildOrderItems;