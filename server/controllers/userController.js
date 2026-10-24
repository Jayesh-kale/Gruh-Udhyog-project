const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const order = require("../models/order");
const { mailTransporter } = require("../utils/mailTransporter");

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : process.env.COOKIE_SAME_SITE || "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

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
        res.cookie("token", token, authCookieOptions);

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

    res.clearCookie("token", authCookieOptions);

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
// gives the orders specific to the user
exports.getOrderStatistics = async(req , res) => {
    try {
         const records = await order.findById(req.user.id);
         if (records) {
             res.status(200).json({
                 success: true,
                 records
             });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.forgotPassword = async (req, res) => {
    const genericResponse = {
        success: true,
        message: "If an account exists for that email, a password reset link has been sent."
    };

    try {
        const email = String(req.body?.email || "").trim().toLowerCase();
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json(genericResponse);
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        user.passwordResetToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${rawToken}`;
        await mailTransporter.sendMail({
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Reset your GruhUdyog password",
            text: `Reset your password using this link (valid for 15 minutes): ${resetUrl}`,
            html: `<p>We received a request to reset your GruhUdyog password.</p>
                <p><a href="${resetUrl}">Reset your password</a></p>
                <p>This link expires in 15 minutes. If you did not request this, you can ignore this email.</p>`
        });

        return res.status(200).json(genericResponse);
    } catch (error) {
        console.error("Forgot password error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to send the password reset email."
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const password = String(req.body?.password || "");

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "This password reset link is invalid or has expired."
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now log in."
        });
    } catch (error) {
        console.error("Reset password error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to reset the password."
        });
    }
};