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
 * Fetch all transactions (admin). GET /api/transactions
 */
export const fetchAllTransactions = async ({ page = 1, limit = 50, status } = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  const response = await api.get("/transactions", { params });
  return response.data;
};

/**
 * Complete (approve) a pending transaction. ADMIN only.
 * PATCH /api/transactions/:id/complete
 */
export const completeTransaction = async (id) => {
  const response = await api.patch(`/transactions/${id}/complete`);
  return response.data;
};

/**
 * Refund a successful transaction.
 * PATCH /api/transactions/:id/refund
 */
export const refundTransaction = async (id) => {
  const response = await api.patch(`/transactions/${id}/refund`);
  return response.data;
};

/**
 * Cancel a pending transaction.
 * PATCH /api/transactions/:id/cancel
 */
export const cancelTransaction = async (id) => {
  const response = await api.patch(`/transactions/${id}/cancel`);
  return response.data;
};
