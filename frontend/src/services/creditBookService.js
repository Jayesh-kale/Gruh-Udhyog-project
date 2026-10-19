import api from "./api";


export const getCreditBookData = async () => {
        const response = await api.get("/credit-book/");
        return response;
};

export const getCreditEntryById = async (id) => {
        const response = await api.get(`/credit-book/${id}`);
        return response;
};
