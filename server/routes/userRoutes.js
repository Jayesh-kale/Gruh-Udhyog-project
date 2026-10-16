const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {registerUser,
loginUser, logoutUser, getUserProfile, getCurrentUser
} = require("../controllers/userController");

// Register a new user
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout",  logoutUser);

router.get("/profile", verifyToken, getUserProfile);

router.get("/me", verifyToken , getCurrentUser);


module.exports = router;
