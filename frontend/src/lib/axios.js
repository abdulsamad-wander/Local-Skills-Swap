import axios from "axios";

export const axiosInstance = axios.create({
    baseURL : "https://speak-zen-api.vercel.app/api",
    withCredentials : true
})