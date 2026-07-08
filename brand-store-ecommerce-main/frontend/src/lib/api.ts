import axios from "axios";

const api = axios.create({
  baseURL: 'https://brand-store-ecommerce-f998.onrender.com/api',
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to request header automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("brand-store-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
