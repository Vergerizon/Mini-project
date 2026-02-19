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
 * Dashboard summary (total revenue, transactions, users, etc).
 * GET /api/reports/dashboard
 */
export const fetchDashboardReport = async () => {
  const response = await api.get("/reports/dashboard");
  return response.data?.data ?? response.data;
};

/**
 * User transaction summaries.
 * GET /api/reports/users
 */
export const fetchUserReport = async () => {
  const response = await api.get("/reports/users");
  return response.data?.data ?? response.data;
};

/**
 * Product revenue summaries.
 * GET /api/reports/products
 */
export const fetchProductReport = async () => {
  const response = await api.get("/reports/products");
  return response.data?.data ?? response.data;
};

/**
 * Failed transactions report.
 * GET /api/reports/failed-transactions
 */
export const fetchFailedTransactions = async () => {
  const response = await api.get("/reports/failed-transactions");
  return response.data?.data ?? response.data;
};

/**
 * Daily transaction summary.
 * GET /api/reports/daily
 */
export const fetchDailyReport = async () => {
  const response = await api.get("/reports/daily");
  return response.data?.data ?? response.data;
};
