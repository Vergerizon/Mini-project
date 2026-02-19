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
 * Fetch all users (paginated). ADMIN only.
 * GET /api/users
 */
export const fetchAllUsers = async ({ page = 1, limit = 20 } = {}) => {
  const response = await api.get("/users", { params: { page, limit } });
  return response.data;
};

/**
 * Get a single user by ID. ADMIN only.
 * GET /api/users/:id
 */
export const fetchUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data?.data ?? response.data;
};

/**
 * Delete a user. ADMIN only.
 * DELETE /api/users/:id
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

/**
 * Change a user's role. ADMIN only.
 * PATCH /api/users/:id/role
 */
export const changeUserRole = async (id, role) => {
  const response = await api.patch(`/users/${id}/role`, { role });
  return response.data;
};

/**
 * Top up a user's balance. ADMIN.
 * POST /api/users/:id/topup
 */
export const topUpUserBalance = async (id, amount) => {
  const response = await api.post(`/users/${id}/topup`, { amount });
  return response.data;
};
