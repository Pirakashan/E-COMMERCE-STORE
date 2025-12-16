import axios from "axios";

const axios = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
    withCredentials: true, // send cookies to server
});

export default axiosInstance;
