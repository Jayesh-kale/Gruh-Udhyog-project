const express = require("express");

const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const {

    createProduct,
    updateProduct,
    getAllProducts,
    getRelatedProducts,
    getProductById,
    deleteProduct,
    searchProducts,
    getProductCategory,
    getFeaturedProducts,
    getSeasonalProducts

} = require("../controllers/productController");

const upload = require("../middleware/upload");

// Public Routes

// Get all products
router.get("/", getAllProducts);

//get related products
router.get("/related-Products", getRelatedProducts);

// Search products
router.get("/search", searchProducts);
router.get("/category", getProductCategory);
router.get("/featured", getFeaturedProducts);
router.get("/seasonal", getSeasonalProducts); 

// Get product by id
router.get("/:id", getProductById);


// ==========================
// Admin Routes
// ==========================

// Create Product
router.post(
    "/createProduct",
    verifyToken,
    isAdmin,
    upload.single("image"),
    createProduct
);

// Update Product
router.patch(
    "/:id",
    verifyToken,
    isAdmin,
    upload.single("image"),
    updateProduct
);

// Delete Product (Soft Delete)
router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteProduct
);

module.exports = router;