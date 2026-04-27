import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        await api.post("/auth/refresh", {}, { withCredentials: true });

        // Retry original request
        return api(originalRequest);
      } catch (err) {
        // Refresh failed → user is logged out
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
