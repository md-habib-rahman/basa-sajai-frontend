import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    if (status >= 500) {
      toast.error(`Server Error: ${message}`);
    }

    return Promise.reject(error);
  },
);
