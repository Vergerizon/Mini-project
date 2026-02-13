import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../constants";

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

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => localStorage.getItem("token");
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
