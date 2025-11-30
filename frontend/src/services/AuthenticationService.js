import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "/api/v1/auth",
  timeout: 8000,
});

const TOKEN_KEY = "userToken";
const USER_KEY = "currentUser";

const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
const getToken = () => localStorage.getItem(TOKEN_KEY);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};
const clearUser = () => localStorage.removeItem(USER_KEY);

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
  const { data } = await api.post("/authenticate", authenticationRequest);
  if (data?.token) {
    setToken(data.token);
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    const decoded = jwtDecode(data.token);
    const { uid, pid, hid, roles, exp } = decoded || {};

    if (exp && exp * 1000 <= Date.now()) {
      logout();
      throw new Error("Token expired");
    }

    setUser({
      userId: uid ?? null,
      pointId: pid ?? null,
      hospitalId: hid ?? null,
      roles: Array.isArray(roles) ? roles : [],
      token: data.token,
      mustChangePassword: data.mustChangePassword ?? mcp ?? false,
      exp: exp ?? null,
    });
  }
  return data;
}

async function getMyId() {
  const token = getToken();
  const { data } = await axios.get("/api/v1/auth/me/id", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.id;
}

function logout() {
  clearToken();
  clearUser();
  delete api.defaults.headers.common.Authorization;
}

function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return !exp || exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function getUserId() {
  return getUser()?.userId ?? null;
}
function getPointId() {
  return getUser()?.pointId ?? null;
}
function getHospitalId() {
  return getUser()?.hospitalId ?? null;
}
function hasRole(roleName) {
  const roles = getUser()?.roles || [];
  return roles.includes(roleName);
}
function mustChangePassword() {
  return !!getUser()?.mustChangePassword;
}

const authService = {
  register,
  login,
  logout,
  getMyId,

  isAuthenticated,
  getToken,
  getUser,

  getUserId,
  getPointId,
  getHospitalId,
  hasRole,
  mustChangePassword,
};

export default authService;
