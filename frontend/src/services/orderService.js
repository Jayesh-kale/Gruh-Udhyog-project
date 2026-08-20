import api from "./api";

export const createOrder = async (orderData) => {
    const response = await api.post("/orders/create", orderData);
    return response.data;
};
export const getMyOrders = async () => {
    const response = await api.get("/orders/my-orders");
    return response.data;
};

// Admin Api Calls
export const getAllOrders = async (params = {}) => {
    const response = await api.get("/orders", { params });
    return response.data;
}

export const updateOrderStatus = async (orderId, status) => {
    const response = await api.patch(`/orders/${orderId}/status`, { orderStatus: status });
    return response.data;
};


