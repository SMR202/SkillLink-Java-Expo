import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import SecureStore from '../utils/storage';

const BACKEND_PORT = '8080';

const normalizeApiUrl = (url: string) => url.replace(/\/+$/, '');

const extractHost = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const withoutScheme = value.replace(/^[a-z]+:\/\//i, '');
  const hostWithPort = withoutScheme.split('/')[0];
  const host = hostWithPort.split(':')[0];
  return host || null;
};

const resolveApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return normalizeApiUrl(envUrl);
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `http://${window.location.hostname}:${BACKEND_PORT}/api`;
  }

  const host =
    extractHost(Constants.expoConfig?.hostUri) ??
    extractHost((Constants.expoGoConfig as { debuggerHost?: string } | null)?.debuggerHost) ??
    extractHost(Constants.linkingUri);

  if (host) {
    return `http://${host}:${BACKEND_PORT}/api`;
  }

  return Platform.OS === 'android'
    ? `http://10.0.2.2:${BACKEND_PORT}/api`
    : `http://localhost:${BACKEND_PORT}/api`;
};

const API_BASE_URL = resolveApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        if (data.success) {
          const { accessToken, refreshToken: newRefreshToken } = data.data;
          await SecureStore.setItemAsync('accessToken', accessToken);
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // The auth store will handle the redirect
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
