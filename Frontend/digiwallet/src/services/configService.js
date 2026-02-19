import axios from "axios";
import { API_BASE_URL } from "../constants";

const STORAGE_KEY = "appConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Fetch role-based configuration (navigation + permissions) from the backend.
 * Called once after login; the result is cached in localStorage.
 */
export const fetchConfig = async (token) => {
  const response = await api.get("/auth/config", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const config = response.data; // { success, role, navigation, permissions }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  return config;
};

/** Read the cached config (synchronous). */
export const getConfig = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

/** Get only the navigation items from cached config. */
export const getNavigation = () => getConfig()?.navigation ?? [];

/** Get only the permissions object from cached config. */
export const getPermissions = () => getConfig()?.permissions ?? {};

/** Clear cached config (call on logout). */
export const clearConfig = () => localStorage.removeItem(STORAGE_KEY);
