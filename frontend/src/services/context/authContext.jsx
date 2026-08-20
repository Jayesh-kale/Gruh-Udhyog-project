import { createContext, useContext, useEffect, useState } from "react";

import {
    loginUser,
    logoutUser,
    registerUser,
    getCurrentUser
} from "../authService";

import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [loading, setLoading] = useState(true);
    // Restore User From Cookie
    const refreshUser = async () => {

        try {

            const response = await getCurrentUser();

            setUser(response.user);

        } catch (error) {

            if (error.response?.status !== 401) {
                console.error(error);
            }

            setUser(null);

        } finally {

        setLoading(false);

    }

};

// Register
const register = async (userData) => {

    const response = await registerUser(userData);

    return response;

};

// Login

const login = async (credentials) => {

    const response = await loginUser(credentials);

    setUser(response.user);

    if (response.user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
    } else {
        navigate("/", { replace: true });
    }

    return response;

};

// Logout
const logout = async () => {

    await logoutUser();

    setUser(null);

    navigate("/login");

};
// Load User Once
useEffect(() => {

    const publicRoutes = ["/login", "/register"];

    if (publicRoutes.includes(pathname)) {
        setLoading(false);
        return;
    }

    refreshUser();

}, [pathname]);

return (

    <AuthContext.Provider

        value={{

            user,

            loading,

            isAuthenticated: !!user,

            register,

            login,

            logout,

            refreshUser

        }}

    >

        {children}

    </AuthContext.Provider>

);

};

export const useAuth = () => useContext(AuthContext);