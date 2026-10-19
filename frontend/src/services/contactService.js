// This service is for handling mail service
import api from "./api";

export async function sendContactMessage(formData) {
    const response = await api.post(
        "/contact",
        formData
    );

    return response.data;
}