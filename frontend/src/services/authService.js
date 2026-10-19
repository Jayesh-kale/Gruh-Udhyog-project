import api from "./api";
//it acts as a service layer for authentication-related API calls, providing functions to register, login, logout, and get the current user.
// It uses the api instance to make HTTP requests to the backend endpoints.
// Register User

export default api;

export const registerUser = async (userData) => {

    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;

};

export const loginUser = async (credentials) => {

    const response = await api.post(
        "/auth/login",
        credentials
    );

    return response.data;

};

export const logoutUser = async () => {

    const response = await api.post(
        "/auth/logout"
    );

    return response.data;

};

export const getCurrentUser = async () => {

    const response = await api.get(
        "/auth/me"
    );

    return response.data;

};

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
};