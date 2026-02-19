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
 * Fetch all categories (admin sees all fields).
 * GET /api/categories
 */
export const fetchCategories = async ({ page = 1, limit = 100 } = {}) => {
  const response = await api.get("/categories", { params: { page, limit } });
  return response.data;
};

/**
 * Get category by ID.
 * GET /api/categories/:id
 */
export const fetchCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data?.data ?? response.data;
};

/**
 * Create a new category. ADMIN only.
 * POST /api/categories
 */
export const createCategory = async (payload) => {
  const response = await api.post("/categories", payload);
  return response.data;
};

/**
 * Update a category. ADMIN only.
 * PUT /api/categories/:id
 */
export const updateCategory = async (id, payload) => {
  const response = await api.put(`/categories/${id}`, payload);
  return response.data;
};

/**
 * Delete a category. ADMIN only.
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

/**
 * Toggle category active/inactive. ADMIN only.
 * PATCH /api/categories/:id/toggle-status
 */
export const toggleCategoryStatus = async (id) => {
  const response = await api.patch(`/categories/${id}/toggle-status`);
  return response.data;
};
