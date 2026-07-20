import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path !== "/login" && path !== "/register") {
          localStorage.removeItem("token");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
