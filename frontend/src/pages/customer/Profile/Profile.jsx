import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../services/context/authContext.jsx";
import "./Profile.css";
import { getMyOrders } from "../../../services/orderService";

const Profile = () => {
    const { user } = useAuth();
    const [ordersInfo, setOrdersInfo] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        village: user?.village || "",
    });

    const loadRecords = async () => {
        try {
            const response = await getMyOrders();
            setOrdersInfo(response?.data?.orders || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadRecords();
        }
    }, [user]);

    const stats = useMemo(() => {
        const status = (order) => String(order.orderStatus || "").toLowerCase();
        return {
            totalOrders: ordersInfo.length,
            pendingOrders: ordersInfo.filter((order) =>
                ["pending", "processing", "ready"].includes(status(order))
            ).length,
            completedOrders: ordersInfo.filter((order) =>
                ["completed", "delivered"].includes(status(order))
            ).length,
            cancelledOrders: ordersInfo.filter((order) =>
                ["cancelled", "canceled"].includes(status(order))
            ).length,
        };
    }, [ordersInfo]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };


    const handleSubmit = (e) => {

        e.preventDefault();

        setIsEditing(false);
    };


    const getInitials = (name) => {

        if (!name) return "U";

        return name
            .split(" ")
            .map(word => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();

    };


    return (

        <div className="customer-profile-page">

            <div className="container py-4 py-md-5">

                {/*====
                    PROFILE HEADER
               ==== */}

                <div className="profile-hero mb-4">

                    <div className="profile-hero-content">

                        <div className="profile-avatar">

                            {getInitials(formData.name)}

                        </div>

                        <div className="profile-heading">

                            <span className="profile-welcome">
                                Welcome back
                            </span>

                            <h2>
                                {formData.name || "Customer"}
                            </h2>

                            <p>
                                Manage your profile and track your orders.
                            </p>

                        </div>

                    </div>


                    <button
                        className="btn btn-light profile-edit-btn"
                        onClick={() =>
                            setIsEditing(prev => !prev)
                        }
                    >

                        <i className="bi bi-pencil-square me-2"></i>

                        {isEditing
                            ? "Cancel"
                            : "Edit Profile"
                        }

                    </button>

                </div>


                {/*====
                    ORDER STATISTICS
               ==== */}

                <div className="row g-3 mb-4">

                    <div className="col-6 col-lg-3">

                        <div className="profile-stat-card">

                            <div className="stat-icon">
                                <i className="bi bi-bag"></i>
                            </div>

                            <div>
                                <span>
                                    Total Orders
                                </span>

                                <strong>
                                    {stats.totalOrders}
                                </strong>
                            </div>

                        </div>

                    </div>


                    <div className="col-6 col-lg-3">

                        <div className="profile-stat-card">

                            <div className="stat-icon">
                                <i className="bi bi-clock-history"></i>
                            </div>

                            <div>
                                <span>
                                    Pending
                                </span>

                                <strong>
                                    {stats.pendingOrders}
                                </strong>
                            </div>

                        </div>

                    </div>


                    <div className="col-6 col-lg-3">

                        <div className="profile-stat-card">

                            <div className="stat-icon">
                                <i className="bi bi-check2-circle"></i>
                            </div>

                            <div>
                                <span>
                                    Completed
                                </span>

                                <strong>
                                    {stats.completedOrders}
                                </strong>
                            </div>

                        </div>

                    </div>


                    <div className="col-6 col-lg-3">

                        <div className="profile-stat-card">

                            <div className="stat-icon">
                                <i className="bi bi-x-circle"></i>
                            </div>

                            <div>
                                <span>
                                    Cancelled
                                </span>

                                <strong>
                                    {stats.cancelledOrders}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>


                <div className="row g-4">


                    {/*
                        PERSONAL INFORMATION
                    */}

                    <div className="col-lg-7">

                        <div className="profile-card h-100">

                            <div className="profile-card-header">

                                <div>

                                    <span className="section-label">
                                        ACCOUNT
                                    </span>

                                    <h4>
                                        Personal Information
                                    </h4>

                                </div>

                                <div className="section-icon">
                                    <i className="bi bi-person"></i>
                                </div>

                            </div>


                            <div className="profile-card-body">

                                {isEditing ? (

                                    <form
                                        onSubmit={
                                            handleSubmit
                                        }
                                    >

                                        <div className="row g-3">


                                            <div className="col-md-6">

                                                <label className="form-label">
                                                    Full Name
                                                </label>

                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control profile-input"
                                                    value={
                                                        formData.name
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    required
                                                />

                                            </div>


                                            <div className="col-md-6">

                                                <label className="form-label">
                                                    Phone
                                                </label>

                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className="form-control profile-input"
                                                    value={
                                                        formData.phone
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                            </div>


                                            <div className="col-12">

                                                <label className="form-label">
                                                    Email Address
                                                </label>

                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control profile-input"
                                                    value={
                                                        formData.email
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                            </div>


                                            <div className="col-12">

                                                <label className="form-label">
                                                    Village / City
                                                </label>

                                                <input
                                                    type="text"
                                                    name="village"
                                                    className="form-control profile-input"
                                                    value={
                                                        formData.village
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                            </div>


                                            <div className="col-12">

                                                <button
                                                    type="submit"
                                                    className="btn btn-dark px-4"
                                                >
                                                    <i className="bi bi-check2 me-2"></i>

                                                    Save Changes

                                                </button>

                                            </div>

                                        </div>

                                    </form>

                                ) : (

                                    <div className="profile-details">


                                        <div className="profile-detail-row">

                                            <div className="detail-icon">
                                                <i className="bi bi-person"></i>
                                            </div>

                                            <div>
                                                <small>
                                                    Full Name
                                                </small>

                                                <p>
                                                    {formData.name || "Not provided"}
                                                </p>
                                            </div>

                                        </div>


                                        <div className="profile-detail-row">

                                            <div className="detail-icon">
                                                <i className="bi bi-telephone"></i>
                                            </div>

                                            <div>
                                                <small>
                                                    Phone Number
                                                </small>

                                                <p>
                                                    {formData.phone || "Not provided"}
                                                </p>
                                            </div>

                                        </div>


                                        <div className="profile-detail-row">

                                            <div className="detail-icon">
                                                <i className="bi bi-envelope"></i>
                                            </div>

                                            <div>
                                                <small>
                                                    Email Address
                                                </small>

                                                <p>
                                                    {formData.email || "Not provided"}
                                                </p>
                                            </div>

                                        </div>


                                        <div className="profile-detail-row">

                                            <div className="detail-icon">
                                                <i className="bi bi-geo-alt"></i>
                                            </div>

                                            <div>
                                                <small>
                                                    Location
                                                </small>

                                                <p>
                                                    {formData.village || "Not provided"}
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/*
                        ACCOUNT SECURITY
                    */}

                    <div className="col-lg-5">

                        <div className="profile-card h-100">

                            <div className="profile-card-header">

                                <div>

                                    <span className="section-label">
                                        SECURITY
                                    </span>

                                    <h4>
                                        Account Security
                                    </h4>

                                </div>

                                <div className="section-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>

                            </div>


                            <div className="profile-card-body">


                                <div className="security-item">

                                    <div className="security-icon">
                                        <i className="bi bi-lock"></i>
                                    </div>

                                    <div className="flex-grow-1">

                                        <strong>
                                            Password
                                        </strong>

                                        <p>
                                            Keep your account secure with a strong password.
                                        </p>

                                    </div>

                                    <button
                                        className="btn btn-outline-dark btn-sm"
                                    >
                                        Change
                                    </button>

                                </div>


                                <hr />


                                <div className="security-item">

                                    <div className="security-icon">
                                        <i className="bi bi-phone"></i>
                                    </div>

                                    <div>

                                        <strong>
                                            Phone Verification
                                        </strong>

                                        <p>
                                            Your phone number is connected to your account.
                                        </p>

                                    </div>

                                    <span className="verified-badge">
                                        Verified
                                    </span>

                                </div>


                                <hr />


                                <div className="security-item">

                                    <div className="security-icon">
                                        <i className="bi bi-person-check"></i>
                                    </div>

                                    <div>

                                        <strong>
                                            Account Status
                                        </strong>

                                        <p>
                                            Your account is active.
                                        </p>

                                    </div>

                                    <span className="active-badge">
                                        Active
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/*
                        RECENT ORDERS
                    */}

                    <div className="col-12">

                        <div className="profile-card">

                            <div className="profile-card-header">

                                <div>

                                    <span className="section-label">
                                        ORDERS
                                    </span>

                                    <h4>
                                        Recent Orders
                                    </h4>

                                    <span className="section-label">
                                        {ordersInfo?.length || 0} Orders
                                    </span>

                                </div>

                                <button className="btn btn-outline-dark btn-sm">
                                    View All
                                </button>

                            </div>


                            <div className="table-responsive">

                                <table className="table profile-orders-table align-center mb-0">

                                    <thead>

                                        <tr>

                                            <th>
                                                Order
                                            </th>

                                            <th>
                                                Items
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Status
                                            </th>


                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {ordersInfo?.slice(0, 4).map(order => (

                                            <tr
                                                key={
                                                    order._id
                                                }
                                            >

                                                <td>

                                                    <strong>
                                                        {order._id}
                                                    </strong>

                                                </td>

                                                <td className="text-truncate" style={{ maxWidth: "200px" }}>
                                                    {order.items?.map(item => item.productName).join(", ")}
                                                </td>

                                                <td>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>

                                                <td>

                                                    <strong>
                                                        ₹{order.totalAmount}
                                                    </strong>

                                                </td>

                                                <td>

                                                    <span className={
                                                            order.orderStatus === "Ready"
                                                                ? "order-status ready"
                                                                : "order-status delivered"
                                                        }
                                                    >
                                                        {order.orderStatus}
                                                    </span>

                                                </td>

                                                <td>

                                                    <button className="btn btn-sm btn-light">

                                                        View

                                                        <i className="bi bi-arrow-right ms-2"></i>

                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Profile;