import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "X-Required-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split(";")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (token) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
