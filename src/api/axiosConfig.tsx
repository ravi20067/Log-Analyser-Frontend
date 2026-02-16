import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const api = axios.create({
  baseURL: "http://localhost:7777",
});


let logoutHandler: (() => void) | null = null;

// Function to register logout handler
export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && logoutHandler) {
      logoutHandler();
    }
    return Promise.reject(error);
  }
);


export default api;
