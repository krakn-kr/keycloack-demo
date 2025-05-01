import axios from "axios";
import { store } from "../store";
import { logout, refreshToken } from "../features/auth/authSlice";

const API_BASE_URL = "http://localhost:9090/api"; // Adjust to your Spring Boot backend URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await store.dispatch(refreshToken());
        
        // After token refresh, retry the original request
        const state = store.getState();
        originalRequest.headers.Authorization = `Bearer ${state.auth.token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;