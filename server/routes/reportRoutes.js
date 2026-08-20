const express = require("express");

const router = express.Router();

const { verifyToken, isAdmin} = require("../middleware/authMiddleware");

const {getDashboardReport,
       getSalesReport,
       getProductReport,
       getCreditReport,
       getCustomerReport,
       getProductionReport
    } = require("../controllers/reportController");

router.get(
    "/dashboard",
    verifyToken,
    isAdmin,
    getDashboardReport
);

router.get(
    "/sales",
    verifyToken,
    isAdmin,
    getSalesReport
);

router.get(
    "/products",
    verifyToken,
    isAdmin,
    getProductReport
);

router.get(
    "/customers",
    verifyToken,
    isAdmin,
    getCustomerReport
);

router.get(
    "/credit",
    verifyToken,
    isAdmin,
    getCreditReport
);

router.get(
    "/production",
    verifyToken,
    isAdmin,
    getProductionReport
);
module.exports = router;