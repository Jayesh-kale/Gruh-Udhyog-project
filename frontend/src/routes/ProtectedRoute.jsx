import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../services/context/authContext.jsx";

const ProtectedRoute = ({ allowedRoles = [] }) => {

    const {
        loading,
        user,
        isAuthenticated
    } = useAuth();

    // Wait until authentication check finishes
    if (loading) {

        return (

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontSize: "20px"
                }}
            >
                Loading...
            </div>

        );

    }

    // Not Logged In
    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;

    }
    if (

        allowedRoles.length > 0 &&

        !allowedRoles.includes(user.role)

    ) {

        // Keep users inside valid routes when role is not allowed.
        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        else{
        return <Navigate to="/" replace />;
        }

    }


    // Logged In
    return <Outlet />;

};

export default ProtectedRoute;