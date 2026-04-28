import apiClient from './client';
import { AdminUser, Analytics, ApiResponse, PaginatedResponse } from '../types';

export const adminApi = {
  getUsers: (params?: { search?: string; role?: string; page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<AdminUser>>>('/admin/users', { params }),

  suspendUser: (userId: number) =>
    apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${userId}/suspend`),

  activateUser: (userId: number) =>
    apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${userId}/activate`),

  getAnalytics: () =>
    apiClient.get<ApiResponse<Analytics>>('/admin/analytics'),

  // Review moderation — uses /reviews endpoint (admin-level access)
  getAllReviews: () =>
    apiClient.get('/admin/reviews'),

  removeReview: (reviewId: number) =>
    apiClient.delete(`/admin/reviews/${reviewId}`),
};
