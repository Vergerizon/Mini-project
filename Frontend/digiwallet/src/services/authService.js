import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../constants";
import { fetchConfig, clearConfig } from "./configService";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const loginUser = async (email, password) => {
  const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });

  const token =
    response.headers["authorization"] ||
    response.data?.session?.token ||
    response.data?.token;

  if (token) {
    localStorage.setItem("token", token.replace("Bearer ", ""));
  }

  if (response.data?.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  // Fetch role-based config (navigation + permissions) from backend
  const savedToken = localStorage.getItem("token");
  if (savedToken) {
    await fetchConfig(savedToken);
  }

  return response.data;
};

/**
 * Register a new user.
 * POST /api/users (public, no auth required)
 */
export const registerUser = async (userData) => {
  const response = await api.post(API_ENDPOINTS.REGISTER, userData);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  clearConfig();
};

export const getToken = () => localStorage.getItem("token");
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/** Merge partial updates into the stored user object */
export const updateLocalUser = (partialUser) => {
  const existing = getUser();
  if (!existing) return;
  localStorage.setItem("user", JSON.stringify({ ...existing, ...partialUser }));
};
