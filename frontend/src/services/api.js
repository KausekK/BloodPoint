import axios from "axios";
import authService from "./AuthenticationService";

function attachInterceptors(instance) {
  instance.interceptors.request.use((config) => {
    const token = authService.getToken?.();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    const m = (config.method || "").toLowerCase();
    if (["post", "put", "patch"].includes(m)) {
      config.headers = {
        ...(config.headers || {}),
        "Content-Type": config.headers?.["Content-Type"] || "application/json",
      };
    }
    return config;
  });
  return instance;
}

export function createApi(baseURL = "/api") {
  const instance = axios.create({ baseURL, timeout: 8000 });
  return attachInterceptors(instance);
}

export const api = createApi("/api");

export const api8081 = createApi("http://localhost:8081/api");
