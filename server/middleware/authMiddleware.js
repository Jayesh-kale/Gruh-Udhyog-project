const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {

    try {

        const token = req.cookies.token;

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    }
    catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};

exports.isAdmin = (req, res, next) => {

    if (req.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Access Denied"
        });

    }

    next();

};