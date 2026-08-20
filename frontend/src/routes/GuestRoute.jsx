import { Navigate } from "react-router-dom";
import { useAuth } from "../services/context/authContext.jsx";
import Loader from "../components/common/Loader";
//this functional route helps to render pages after successfully login based on role
function GuestRoute({ children }) {

    const {
        user,
        loading
    } = useAuth();

    if (loading) {
        return <Loader text="Loading..." />;
    }

    if (user) {

        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
}

export default GuestRoute;