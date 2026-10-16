import axios from "axios";

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

    withCredentials: true,

    headers: {

        "Content-Type": "application/json"

    }

});

// Request Interceptor
api.interceptors.request.use(

    (config) => {
//to display all the URLS in the console for debugging purposes, uncomment the following line
        // console.log(
        //     `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
        // );

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);

// Response Interceptor
api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        const status = error.response?.status;
        const requestUrl = error.config?.url || "";
        const isAuthRequest = requestUrl.includes("/auth/login");
        const isSessionCheck = requestUrl.includes("/auth/me");
        const isAuthPage = ["/login", "/register"].includes(window.location.pathname);

        switch (status) {

            case 401:

                if (!isAuthRequest && !isSessionCheck && !isAuthPage) {
                    console.warn("Unauthorized");
                    window.location.replace("/login");
                } else {
                    console.warn("Login failed");
                }

                break;

            case 403:

                console.warn("Forbidden");

                break;

            case 404:

                console.warn("Resource Not Found");

                break;

            case 500:

                console.error("Internal Server Error");

                break;

            default:

                console.error(error.message);

        }

        return Promise.reject(error);

    }

);

export default api;