const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// ================= Register User =================
exports.registerUser = async (req, res) => {
    try {
       
        const { name, email, password, phone, role } = req.body;

        // Check required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const normalizedRole = role || "customer";

        if (!["admin", "customer"].includes(normalizedRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        // Create User
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: normalizedRole
        });

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= Login User =================
exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        // Find User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare Password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d"
            }
        );

        // Store JWT in Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Change to true after deployment (HTTPS)
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//for user logout
exports.logoutUser = async (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });

    res.status(200).json({
        success: true,
        message: "Logout Successful"
    });

};

//for getting the user profile
exports.getUserProfile = async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user
    });
}

//this is most important function to get the current user from the token stored in the cookie
//it helps react to remember the user even after refreshing the page or closing the browser like instagram,facebeek
exports.getCurrentUser = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password"); //Return everything except the password.

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};