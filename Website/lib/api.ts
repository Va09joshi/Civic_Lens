import axios from "axios";

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const parts = document.cookie.split(";").map((part) => part.trim());
  const row = parts.find((part) => part.startsWith(`${name}=`));
  return row ? decodeURIComponent(row.split("=").slice(1).join("=")) : "";
}

const api = axios.create({
  // Use same-origin proxy route so deployed frontend is not blocked by backend CORS rules.
  baseURL: "/api/proxy",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token") || readCookie("cl_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle API errors
      return Promise.reject(
        error.response.data?.message || "An error occurred."
      );
    }
    return Promise.reject(error.message || "Network error.");
  }
);

export default api;
