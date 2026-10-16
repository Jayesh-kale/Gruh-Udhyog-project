
require("dotenv").config();
const connectDB = require("./config/database");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const creditBookRoutes = require("./routes/creditBookRoutes");
const productionQueueRoutes = require("./routes/productionQueueRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(cookieParser());

connectDB();

app.use(cors(
    {
    origin: "http://localhost:5173",
    credentials: true
}
));

// Webhook route must be registered before express.json().
app.use("/api/payments", paymentRoutes);

app.use(express.json());



app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/credit-book", creditBookRoutes);
app.use("/api/production-queue",productionQueueRoutes);
app.use("/api/admin/dashboard",dashboardRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.send("GruhUdyog CRM API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});