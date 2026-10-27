
// require("dotenv").config();
// const connectDB = require("./config/database");
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const rateLimit = require("express-rate-limit");


// const userRoutes = require("./routes/userRoutes");
// const productRoutes = require("./routes/productRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const creditBookRoutes = require("./routes/creditBookRoutes");
// const productionQueueRoutes = require("./routes/productionQueueRoutes");
// const reportRoutes = require("./routes/reportRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const { verifyMailTransporter } = require("./utils/mailTransporter");

// const app = express();
// const isProduction = process.env.NODE_ENV === "production";
// const allowedOrigins = ("https://gruh-udhyog-project-mngpqs7hg-jayesh-kale08.vercel.app" || "http://localhost:5173")
//     .split(",")
//     .map((origin) => origin.trim())
//     .filter(Boolean);

// if (isProduction) {
//     app.set("trust proxy", 1);
// }

// function validateProductionEnvironment() {
//     const required = [
//         "FRONTEND_URL",
//         "MONGO_URI",
//         "JWT_SECRET",
//         "RAZORPAY_KEY_ID",
//         "RAZORPAY_KEY_SECRET",
//         "RAZORPAY_WEBHOOK_SECRET"
//     ];

//     const missing = required.filter((name) => !process.env[name]);

//     if (missing.length) {
//         throw new Error(
//             `Missing production environment variables: ${missing.join(", ")}`
//         );
//     }

//     if (process.env.JWT_SECRET.length < 32) {
//         throw new Error("JWT_SECRET must be at least 32 characters in production.");
//     }

//     if (process.env.RAZORPAY_WEBHOOK_SECRET.startsWith("http")) {
//         throw new Error(
//             "RAZORPAY_WEBHOOK_SECRET must be the Razorpay webhook signing secret, not the webhook URL."
//         );
//     }

//     if (process.env.RAZORPAY_KEY_ID.startsWith("rzp_test_")) {
//         throw new Error(
//             "RAZORPAY_KEY_ID is still using test credentials in production."
//         );
//     }
// }

// app.use(cookieParser());

// app.use(cors(
//     {
//         origin(origin, callback) {
//             if (!origin || allowedOrigins.includes(origin)) {
//                 return callback(null, true);
//             }

//             return callback(new Error("Origin is not allowed by CORS."));
//         },
//         credentials: true
//     }
// ));

// // Webhook route must be registered before express.json().
// app.use("/api/payments", paymentRoutes);

// app.use(express.json({ limit: "1mb" }));

// app.use("/api/auth", rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 100,
//     standardHeaders: "draft-8",
//     legacyHeaders: false
// }));

// app.use("/api/contact", require("./routes/contactRoutes"));
// app.use("/api/auth", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/credit-book", creditBookRoutes);
// app.use("/api/production-queue",productionQueueRoutes);
// app.use("/api/admin/dashboard",dashboardRoutes);
// app.use("/api/reports", reportRoutes);

// verifyMailTransporter();
// app.get("/", (req, res) => {
//     res.send("GruhUdyog CRM API Running");
// });

// app.get("/health", (req, res) => {
//     res.status(200).json({
//         success: true,
//         status: "ok"
//     });
// });

// app.use((error, req, res, next) => {
//     console.error("Unhandled server error:", error);
//     res.status(error.status || 500).json({
//         success: false,
//         message: isProduction
//             ? "An unexpected server error occurred."
//             : error.message
//     });
// });

// async function startServer() {
//     if (isProduction) {
//         validateProductionEnvironment();
//     }

//     await connectDB();

//     const port = Number(process.env.PORT || 5000);
//     app.listen(port, () => {
//         console.log(`Server running on port ${port}`);
//     });
// }

// if (require.main === module) {
//     startServer().catch((error) => {
//         console.error("Server startup failed:", error);
//         process.exit(1);
//     });
// }

// module.exports = app;

require("dotenv").config();

const connectDB = require("./config/database");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const creditBookRoutes = require("./routes/creditBookRoutes");
const productionQueueRoutes = require("./routes/productionQueueRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentController = require("./controllers/paymentController");
const { verifyMailTransporter } = require("./utils/mailTransporter");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
    ...(process.env.FRONTEND_URL || "").split(","),
    "https://gruh-udhyog-project.vercel.app",
    "http://localhost:5173",
]
    .filter((origin) => origin.trim())
    .map((origin) => origin.trim().replace(/\/$/, ""));

const vercelPreviewRegex =
    /^https:\/\/gruh-udhyog-project-[a-z0-9-]+\.vercel\.app$/;

if (isProduction) {
    app.set("trust proxy", 1);
}

function validateProductionEnvironment() {
    const required = [
        "FRONTEND_URL",
        "MONGO_URI",
        "JWT_SECRET",
        "RAZORPAY_KEY_ID",
        "RAZORPAY_KEY_SECRET",
        "RAZORPAY_WEBHOOK_SECRET",
    ];

    const missing = required.filter((name) => !process.env[name]);

    if (missing.length) {
        throw new Error(
            `Missing production environment variables: ${missing.join(", ")}`
        );
    }

    if (process.env.JWT_SECRET.length < 32) {
        throw new Error(
            "JWT_SECRET must be at least 32 characters in production."
        );
    }

    if (process.env.RAZORPAY_WEBHOOK_SECRET.startsWith("http")) {
        throw new Error(
            "RAZORPAY_WEBHOOK_SECRET must be the Razorpay webhook signing secret, not the webhook URL."
        );
    }

    if (process.env.RAZORPAY_KEY_ID.startsWith("rzp_test_")) {
        throw new Error(
            "RAZORPAY_KEY_ID is still using test credentials in production."
        );
    }
}

app.use(cookieParser());

app.use(
    cors({
        origin(origin, callback) {
            // Allow server-to-server requests, health checks, and tools like Postman
            if (!origin) {
                return callback(null, true);
            }

            const normalizedOrigin = origin.trim().replace(/\/$/, "");

            const isAllowed =
                allowedOrigins.includes(normalizedOrigin) ||
                vercelPreviewRegex.test(normalizedOrigin);

            if (isAllowed) {
                return callback(null, true);
            }

            return callback(new Error("Origin is not allowed by CORS."));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Razorpay webhook must be registered before express.json().
app.post(
    "/api/payments/razorpay/webhook",
    express.raw({ type: "application/json" }),
    paymentController.handleRazorpayWebhook
);

app.use(express.json({ limit: "1mb" }));

app.use(
    "/api/auth",
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-8",
        legacyHeaders: false,
    })
);

app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/credit-book", creditBookRoutes);
app.use("/api/production-queue", productionQueueRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

verifyMailTransporter();

app.get("/", (req, res) => {
    res.send("GruhUdyog CRM API Running");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "ok",
    });
});

app.use((error, req, res, next) => {
    console.error("Unhandled server error:", error);

    res.status(error.status || 500).json({
        success: false,
        message: isProduction
            ? "An unexpected server error occurred."
            : error.message,
    });
});

async function startServer() {
    if (isProduction) {
        validateProductionEnvironment();
    }

    await connectDB();

    const port = Number(process.env.PORT || 5000);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error("Server startup failed:", error);
        process.exit(1);
    });
}

module.exports = app;