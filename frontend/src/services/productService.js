import api from "./api";
//param automatically passes the query params to the api call

export const getProduct = async (params) => {
    const response = await api.get("/products/", {
        params
    });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
}

export const getFeaturedProducts = async () => {

    const response = await api.get("/products/featured");
    return response.data;

};

export const categoryService = async () => {
    try {
        const res = await api.get("/products/category");
        const categories = res?.data?.data?.categories ?? res?.data?.categories ?? [];
        return categories;
    } catch (error) {
        throw error;
    }
};

export const getSeasonalProducts = async () => {

    try {
        const response = await api.get("/products/seasonal");
        return response.data.data.seasonalProducts;
    } catch (error) {
        throw error;
    }
}

// To Add The Product That Admin Will Add To Display On Customer Side
export const createProduct = async (payload) => {
    try {
        const response = await api.post("/products/createProduct", payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateProduct = async(id, payload) => {
    try {
        const response = await api.patch(`/products/${id}`, payload);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}