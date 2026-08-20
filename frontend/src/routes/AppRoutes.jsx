//this will handle all the routes in the application instead of putting in App.jsx we use its file
import { Routes, Route, Navigate } from "react-router-dom";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../components/layouts/AdminLayout";
import CustomerLayout from "../components/layouts/CustomerLayout";

// Authentication
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgetPassword from "../pages/auth/ForgetPassword";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard/Dashboard.jsx";
import AdminProducts from "../pages/admin/AdminProducts";
import Orders from "../pages/admin/Orders/Orders";
import ProductionQueue from "../pages/admin/ProductionQueue/ProductionQueue";
import CreditBook from "../pages/admin/CreditBook/CreditBook";
import Reports from "../pages/admin/Reports";

// Customer Pages
import Home from "../pages/customer/Home";
import ProductDetails from "../pages/customer/ProductDetails/ProductDetails";
import Cart from "../pages/customer/Cart/Cart";
import Products from "../pages/customer/Products/Products"
import Checkout from "../pages/customer/Checkout/Checkout";
import CustomerOrders from "../pages/customer/Orders/Orders";
import Profile from "../pages/customer/Profile";
import CreditDetails from "../pages/admin/CreditDetails/CreditDetails.jsx";
// import Unauthorized from "../pages/Unauthorized";
// import NotFound from "../pages/NotFound";



function AppRoutes() {

    return (
        <Routes>
            {/* ================= Public Routes ================= */}
            <Route
                path="/login"
                element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <GuestRoute>
                        <Register />
                    </GuestRoute>
                }
            />

            <Route
                path="/forget_password"
                element={
                    <GuestRoute>
                        <ForgetPassword />
                    </GuestRoute>
                }
            />

            {/* ================= Customer Routes ================= */}

            <Route
                path="/"
                element={
                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    />
                }
            >
                <Route element={<CustomerLayout />}>

                    <Route
                        index
                        element={<Home />}
                    />

                    <Route
                        path="products"
                        element={<Products />}
                    />

                    <Route
                        path="products/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="cart"
                        element={<Cart />}
                    />

                    <Route
                        path="checkout"
                        element={<Checkout />}
                    />

                    <Route
                        path="orders"
                        element={<CustomerOrders />}
                    />

                    <Route
                        path="profile"
                        element={<Profile />}
                    />
                </Route>
            </Route>

            {/* ================= Admin Routes ================= */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    />
                }
            >
                <Route element={<AdminLayout />}>
                    <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                    />

                     <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="products"
                        element={<AdminProducts />}
                    />

                    <Route
                        path="orders"
                        element={<Orders />}
                    />

                    <Route
                        path="production-queue"
                        element={<ProductionQueue />}
                    />

                    <Route
                        path="credit-book"
                        element={<CreditBook />}
                    />
                    <Route
                        path="personDetails"
                        element={<CreditDetails />}
                    />

                    <Route
                        path="reports"
                        element={<Reports />}
                    />
                </Route>
            </Route>

            {/* ================= Fallback ================= */}

            {/* <Route
                path="/unauthorized"
                element={<Unauthorized />}
            /> */}

            {/* <Route
                path="*"
                element={<NotFound />}
            /> */}
        </Routes>
    );
}

export default AppRoutes;