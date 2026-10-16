import api from "./api";

export const getAllOrdersStatistics =  () =>{
    const response = api.get("/auth/user-statistics/:id");
    return response.data;
}