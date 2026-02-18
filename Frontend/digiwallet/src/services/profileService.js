import axios from "axios";
import { API_BASE_URL } from "../constants";
import { getToken } from "./authService";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Fetch the logged-in user's own profile.
 * Uses GET /api/users/me on the backend.
 */
export const fetchMyProfile = async () => {
  const response = await api.get(`/users/me`);
  return response.data?.data ?? response.data;
};

/**
 * Update the logged-in user's own profile.
 * Uses PUT /api/users/:id
 */
export const updateMyProfile = async (payload) => {
  const response = await api.put(`/users/me`, payload);
  return response.data?.data ?? response.data;
};
