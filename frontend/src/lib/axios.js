import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

export const axiosInstance = axios.create({
    baseURL,
    withCredentials : true
})