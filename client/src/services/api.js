import axios from "axios";
import { removeToken } from "../utils/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://draft16.onrender.com/api",
});

// Auto-redirect to login on 401 (expired / invalid JWT)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
