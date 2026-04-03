import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL : "https://speak-zen-api.vercel.app/api",
    baseURL : "http://localhost:8000/api",
    withCredentials : true
})