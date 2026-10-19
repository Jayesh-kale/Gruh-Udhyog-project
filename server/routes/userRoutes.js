const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {registerUser,
loginUser, logoutUser, getUserProfile, getCurrentUser, forgotPassword, resetPassword
} = require("../controllers/userController");

// Register a new user
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout",  logoutUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/profile", verifyToken, getUserProfile);

router.get("/me", verifyToken , getCurrentUser);


module.exports = router;
