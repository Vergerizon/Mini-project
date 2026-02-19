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
 * Create a new transaction (purchase a product).
 * POST /api/transactions
 */
export const createTransaction = async ({ user_id, product_id, customer_number }) => {
  const response = await api.post("/transactions", {
    user_id,
    product_id,
    customer_number,
  });
  return response.data?.data ?? response.data;
};

/**
 * Fetch transactions for the logged-in user via /me (no userId required).
 * GET /api/transactions/me
 */
export const fetchMyTransactions = async ({ page = 1, limit = 50, status } = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  const response = await api.get("/transactions/me", { params });
  return response.data;
};

/**
 * Fetch transactions for a specific user (admin use).
 * GET /api/transactions/user/:userId
 */
export const fetchUserTransactions = async (userId, { page = 1, limit = 50, status } = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  const response = await api.get(`/transactions/user/${userId}`, { params });
  return response.data;
};

/**
 * Fetch a single transaction by ID.
 * GET /api/transactions/:id
 */
export const fetchTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data?.data ?? response.data;
};

export default {
  createTransaction,
  fetchUserTransactions,
  fetchTransactionById,
};
