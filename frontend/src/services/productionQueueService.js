import api from "./api"


export const getAllProductionSummary = async () => {
    const { data } = await api.get("/production-queue/dashboard");
    return data;
};

export const getAllProductionQueue = async () => {
    const { data } = await api.get("/production-queue/");
    return data;
};
