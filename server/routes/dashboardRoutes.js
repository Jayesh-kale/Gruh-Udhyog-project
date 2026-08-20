const express = require("express");

const router = express.Router();

const { verifyToken, isAdmin} = require("../middleware/authMiddleware");

const { getDashboardStats} = require("../controllers/dashboardController");


router.get( "/", verifyToken, isAdmin, getDashboardStats);


module.exports = router;