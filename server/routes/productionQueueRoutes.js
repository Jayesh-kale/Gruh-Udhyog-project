const express = require("express");

const router = express.Router();

const {

    verifyToken,

    isAdmin

} = require("../middleware/authMiddleware");

const {

    getAllProductionQueues,

    getProductionQueueByProduct,

    getProductionDashboard

} = require("../controllers/productionQueueController");

router.get(

    "/",

    verifyToken,

    isAdmin,

    getAllProductionQueues

);

router.get(

    "/dashboard",

    verifyToken,

    isAdmin,

    getProductionDashboard

);

router.get(

    "/:productId",

    verifyToken,

    isAdmin,

    getProductionQueueByProduct

);

module.exports = router;