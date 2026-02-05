import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Automatically select the correct URL based on platform:
// - Web: localhost
// - Android emulator: 10.0.2.2
// - iOS simulator: localhost
// - Physical device: use your PC's LAN IP (e.g., 192.168.x.x)
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  // iOS or other
  return 'http://localhost:3000';
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };
