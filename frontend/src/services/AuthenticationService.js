import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1/auth",
  timeout: 8000,
});

const TOKEN_KEY = "userToken";
const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
const getToken = () => localStorage.getItem(TOKEN_KEY);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!config.headers || !config.headers["Content-Type"]) {
    config.headers = { ...(config.headers || {}), "Content-Type": "application/json" };
  }
  return config;
});

async function register(registerRequest) {
  const { data } = await api.post("/register", registerRequest);
  return data;
}


async function login(authenticationRequest) {
  const { data } = await api.post("/authenticate", authenticationRequest, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.token) setToken(data.token);
  return data;
}

async function getMyId() {
  const { data } = await axios.get("/api/v1/auth/me/id", {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return data.id;
}



function logout() {
  clearToken();
}

function isAuthenticated() {
  return getToken() !== null;
}

const authService = {
  register,
  login,
  logout,
  isAuthenticated,
  getToken,
  getMyId,
};

export default authService;
