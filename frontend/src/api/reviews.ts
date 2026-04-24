import apiClient from './client';
import { Review, ApiResponse, PaginatedResponse } from '../types';

export const reviewApi = {
  submit: (data: { bookingId: number; rating: number; reviewText: string }) =>
    apiClient.post<ApiResponse<Review>>('/reviews', data),

  getForProvider: (providerId: number, page = 0, size = 10) =>
    apiClient.get<ApiResponse<PaginatedResponse<Review>>>(`/reviews/provider/${providerId}`, {
      params: { page, size },
    }),

  getMine: (page = 0, size = 10) =>
    apiClient.get<ApiResponse<PaginatedResponse<Review>>>('/reviews/me', {
      params: { page, size },
    }),

  respond: (reviewId: number, response: string) =>
    apiClient.put<ApiResponse<Review>>(`/reviews/${reviewId}/respond`, { response }),
};
