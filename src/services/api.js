import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10s
});

// attach token automatically
API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// normalize errors for UI
API.interceptors.response.use(
  (res) => res,
  (err) => {
    // network / timeout
    if (
      err.message &&
      (err.message.includes("Network Error") || err.code === "ECONNABORTED")
    ) {
      return Promise.reject({
        message: "Cannot reach server. Make sure backend is running at http://localhost:5000",
      });
    }
    // axios error with response
    if (err.response && err.response.data) {
      const msg =
        err.response.data.message ||
        err.response.data ||
        JSON.stringify(err.response.data);
      return Promise.reject({ message: msg, status: err.response.status });
    }
    return Promise.reject({ message: err.message || "Unknown error" });
  }
);

export default API;