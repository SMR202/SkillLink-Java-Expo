import apiClient from './client';
import SecureStore from '../utils/storage';
import { AuthTokens, ApiResponse } from '../types';

export const authApi = {
  signup: async (data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
  }): Promise<AuthTokens> => {
    const res = await apiClient.post<ApiResponse<AuthTokens>>('/auth/signup', data);
    const tokens = res.data.data;
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
    await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
    return tokens;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthTokens> => {
    const res = await apiClient.post<ApiResponse<AuthTokens>>('/auth/login', data);
    const tokens = res.data.data;
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
    await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
    return tokens;
  },

  forgotPassword: async (email: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('/auth/forgot-password', { email });
    return res.data.message || '';
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },

  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },
};
