import { useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { CiReceipt } from "react-icons/ci";
import { LuCalendarClock } from "react-icons/lu";
import { FaBook } from "react-icons/fa";
import { toast } from "react-hot-toast";

import "./Dashboard.css";
import { getDashboardData } from "../../../services/DashboardService";
import { Button, Modal } from "../../../components/common";

const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [views, setViews] = useState(null);

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            const response = await getDashboardData();
            console.log("Dashboard data:", response.data.data);
            setDashboard(response.data.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchDashboard();
    }, []);


    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="dashboard-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }


    if (!dashboard) {
        return (
            <div className="dashboard-empty">
                Unable to load dashboard.
            </div>
        );
    }

    //to view order details in modal
    const handleViewOrder = (order) => {
        setViews(order);
    };

    return (

        <section className="admin-dashboard container-fluid">

            {/* ================= HEADER ================= */}

            <div className="dashboard-header">

                <div>
                    <span className="dashboard-eyebrow">
                        ADMIN PANEL
                    </span>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Here's what's happening with your business today.
                    </p>
                </div>

                <button
                    className="dashboard-refresh"
                    onClick={fetchDashboard}
                >
                    <i className="fa-solid fa-rotate"></i>
                    Refresh
                </button>

            </div>


            {/* ================= KPI CARDS ================= */}

            <div className="dashboard-stats">

                <div className="dashboard-card">

                    <div className="dashboard-card-top">
                        <span>Total Orders</span>

                        <div className="dashboard-icon">
                            <i className="fa-solid fa-receipt"><CiReceipt /></i>
                        </div>
                    </div>

                    <strong>
                        {dashboard.totalOrders}
                    </strong>

                    <small>
                        {dashboard.todayOrders} orders today
                    </small>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-card-top">
                        <span>Today's Sales</span>

                        <div className="dashboard-icon">
                            <i className="fa-solid fa-indian-rupee-sign"><FaIndianRupeeSign /></i>
                        </div>
                    </div>

                    <strong>
                        ₹{dashboard.todaySales.toLocaleString("en-IN")}
                    </strong>

                    <small>
                        Revenue generated today
                    </small>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-card-top">
                        <span>Pending Orders</span>

                        <div className="dashboard-icon">
                            <i className="fa-solid fa-clock"><LuCalendarClock /></i>
                        </div>
                    </div>

                    <strong>
                        {dashboard.pendingOrders}
                    </strong>

                    <small>
                        Orders waiting for processing
                    </small>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-card-top">
                        <span>Outstanding Credit</span>

                        <div className="dashboard-icon">
                            <i className="fa-solid fa-book"><FaBook /></i>
                        </div>
                    </div>

                    <strong>
                        ₹{dashboard.outstandingCredit.toLocaleString("en-IN")}
                    </strong>

                    <small>
                        Amount yet to be collected
                    </small>

                </div>

            </div>


            {/* ================= MAIN GRID ================= */}

            <div className="dashboard-grid">


                {/* ORDER STATUS */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h2>
                                Order Overview
                            </h2>

                            <p>
                                Current order pipeline
                            </p>
                        </div>

                        <i className="fa-solid fa-chart-simple"></i>

                    </div>


                    <div className="order-status-list">

                        <div className="status-row">
                            <span>Pending</span>
                            <strong>
                                {dashboard.orderStatus.Pending}
                            </strong>
                        </div>

                        <div className="status-row">
                            <span>Confirmed</span>
                            <strong>
                                {dashboard.orderStatus.Confirmed}
                            </strong>
                        </div>

                        <div className="status-row">
                            <span>Preparing</span>
                            <strong>
                                {dashboard.orderStatus.Preparing}
                            </strong>
                        </div>

                        <div className="status-row">
                            <span>Ready</span>
                            <strong>
                                {dashboard.orderStatus.Ready}
                            </strong>
                        </div>

                        <div className="status-row">
                            <span>Delivered</span>
                            <strong>
                                {dashboard.orderStatus.Delivered}
                            </strong>
                        </div>

                    </div>

                </div>


                {/* BUSINESS OVERVIEW */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h2>
                                Business Overview
                            </h2>

                            <p>
                                Quick business information
                            </p>
                        </div>

                        <i className="fa-solid fa-chart-pie"></i>

                    </div>


                    <div className="business-overview">

                        <div>
                            <span>Products</span>
                            <strong>
                                {dashboard.totalProducts}
                            </strong>
                        </div>

                        <div>
                            <span>Today's Orders</span>
                            <strong>
                                {dashboard.todayOrders}
                            </strong>
                        </div>

                        <div>
                            <span>Pending</span>
                            <strong>
                                {dashboard.pendingOrders}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>


            {/* ================= RECENT ORDERS ================= */}

            <div className="dashboard-panel recent-orders">

                <div className="panel-header">

                    <div>
                        <h2>
                            Recent Orders
                        </h2>

                        <p>
                            Latest customer orders
                        </p>
                    </div>

                    <button
                        className="view-orders-btn"
                        onClick={() => {
                            window.location.href = "/admin/orders";
                        }}
                    >
                        View All
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>

                </div>


                {dashboard.recentOrders.length === 0 ? (

                    <div className="no-orders">
                        <i className="fa-solid fa-receipt"></i>

                        <p>
                            No orders found
                        </p>
                    </div>

                ) : (

                    <div className="orders-table-wrapper">

                        <table className="orders-table">

                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Mobile No</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {dashboard.recentOrders.map(order => (

                                    <tr key={order._id}>

                                        <td>
                                            <strong>
                                                #{order.orderNumber}
                                            </strong>
                                        </td>

                                        <td>
                                            {order.customer?.name}
                                        </td>

                                        <td>
                                            {order.items?.length || 0}
                                        </td>

                                        <td>
                                            ₹{order.totalAmount.toLocaleString("en-IN")}
                                        </td>

                                        <td>
                                            <span className="payment-badge">
                                                {order.paymentStatus}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="payment-badge">    
                                            {order.customer?.phone || "N/A"}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`order-status ${order.orderStatus
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>

                                        <td>
                                            <Button variant="outline" size="sm" onClick={() => { handleViewOrder(order) }}>
                                                View
                                            </Button>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        {views && (
                            <Modal
                                open={!!views}
                                title={`Order #${views.orderNumber} Details`}
                                onClose={() => setViews(null)}>
                                <div className="order-details-modal scrollable-content" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                                    <p><strong>Order Number:</strong> {views.orderNumber}</p>
                                    <p><strong>Order Type:</strong> {views.orderType}</p>
                                    <p><strong>Customer:</strong> {views.customer?.name}</p>
                                    <p><strong>Customer Address:</strong> {views.customer?.village}</p>
                                    <p><strong>Mobile Number:</strong> {views.customer?.phone || "N/A"}</p>
                                    <p><strong>Items:</strong></p>
                                    <ul>
                                        {views.items.map((item, index) => (
                                            <li key={index}>
                                                <p>{item.productName}</p>
                                                <p>Image:<img src={item.image} alt="" srcset="" /></p>
                                                <p>Type: {item.type}</p>
                                                <p>Quantity: {item.quantity},PricePerUnit: ₹{item.pricePerUnit.toLocaleString("en-IN")}</p>
                                                <p><strong>Total Amount:</strong> {item.quantity} * {item.pricePerUnit.toLocaleString("en-IN")} = ₹{item.itemTotal.toLocaleString("en-IN")}</p>
                                            </li>
                                        ))}
                                    </ul>
                                     <p style={{ color: "red"}}><strong>OverAll Total Amount:</strong> ₹{views.totalAmount.toLocaleString("en-IN")}</p>
                                    <p><strong>Remaining Amount:</strong> ₹{views.remainingAmount?.toLocaleString("en-IN") || "N/A"}</p>
                                    <p><strong>Payment Status:</strong> {views.paymentStatus}</p>
                                    <p><strong>Order Status:</strong> {views.orderStatus}</p>
                                </div>
                            </Modal>
                        )}

                    </div>

                )}

            </div>

        </section>
    );
};

export default Dashboard;