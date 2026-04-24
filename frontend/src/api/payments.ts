import apiClient from './client';
import { Payment, EarningsSummary, ApiResponse, PaginatedResponse } from '../types';

export const paymentApi = {
  checkout: (data: { bookingId: number; paymentMethod: string; paymentToken: string; amount?: number }) =>
    apiClient.post<ApiResponse<Payment>>('/payments/checkout', data),

  getEarnings: () =>
    apiClient.get<ApiResponse<EarningsSummary>>('/payments/earnings'),

  getHistory: (page = 0, size = 10) =>
    apiClient.get<ApiResponse<PaginatedResponse<Payment>>>('/payments/history', {
      params: { page, size },
    }),

  getProviderHistory: (page = 0, size = 10) =>
    apiClient.get<ApiResponse<PaginatedResponse<Payment>>>('/payments/history/provider', {
      params: { page, size },
    }),
};
