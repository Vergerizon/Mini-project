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
 * Fetch all products (admin sees all fields).
 * GET /api/products
 */
export const fetchAllProducts = async ({ page = 1, limit = 100, type } = {}) => {
  const params = { page, limit };
  if (type) params.type = type;
  const response = await api.get("/products", { params });
  return response.data;
};

/**
 * Get product by ID.
 * GET /api/products/:id
 */
export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data?.data ?? response.data;
};

/**
 * Create a new product. ADMIN only.
 * POST /api/products
 */
export const createProduct = async (payload) => {
  const response = await api.post("/products", payload);
  return response.data;
};

/**
 * Update a product. ADMIN only.
 * PUT /api/products/:id
 */
export const updateProduct = async (id, payload) => {
  const response = await api.put(`/products/${id}`, payload);
  return response.data;
};

/**
 * Delete a product. ADMIN only.
 * DELETE /api/products/:id
 */
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

/**
 * Toggle product active/inactive. ADMIN only.
 * PATCH /api/products/:id/toggle-status
 */
export const toggleProductStatus = async (id) => {
  const response = await api.patch(`/products/${id}/toggle-status`);
  return response.data;
};
