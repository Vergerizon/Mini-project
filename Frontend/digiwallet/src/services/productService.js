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
 * Fetch all products (paginated).
 * GET /api/products
 */
export const fetchProducts = async ({ page = 1, limit = 100, type } = {}) => {
  const params = { page, limit };
  if (type) params.type = type;
  const response = await api.get("/products", { params });
  return response.data;
};

/**
 * Fetch products by type.
 * GET /api/products/type/:type
 */
export const fetchProductsByType = async (type) => {
  const response = await api.get(`/products/type/${type}`);
  return response.data?.data ?? response.data;
};

export default { fetchProducts, fetchProductsByType };
