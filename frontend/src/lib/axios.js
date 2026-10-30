import axios from "axios";

const trim = (url) => url?.replace(/\/+$/, "");

// Local dev (npm run dev) always talks to the local backend unless
// VITE_DEV_API_BASE_URL is set. Production builds use VITE_API_BASE_URL.
const baseURL = import.meta.env.DEV
  ? trim(import.meta.env.VITE_DEV_API_BASE_URL) || "http://localhost:8000/api"
  : trim(import.meta.env.VITE_API_BASE_URL);

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
