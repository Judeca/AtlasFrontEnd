import axios from "axios";

// Determine the base URL based on the environment
const baseURL = process.env.NODE_ENV === "production" 
  ? "https://atlaslearn.onrender.com" 
  : "http://localhost:3001";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

export default api;
