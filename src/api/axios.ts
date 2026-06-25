import axios from "axios";
import { deleteCookie } from "cookies-next";

const apiClient = axios.create({
  baseURL: "https://6a2bb86c3e2b60ab038eb30a.mockapi.io/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
