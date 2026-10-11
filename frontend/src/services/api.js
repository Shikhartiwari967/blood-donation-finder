import axios from "axios";

const api = axios.create({
  baseURL: "https://blood-donation-finder-d42e.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;