import { getCookie } from "@/lib/auth";
import axios from "axios";


// Determine the base URL based on the environment
const baseURL = process.env.NODE_ENV === "production" 
  ? "https://atlaslearn.onrender.com" 
  : "http://localhost:3001";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from cookie
    const token = getCookie("token");
    
    // If token exists, add it to the Authorization header
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