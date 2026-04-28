import apiClient from './client';
import { ApiResponse, Booking, PaginatedResponse } from '../types';

export const bookingApi = {
  create: async (data: {
    providerId: number;
    preferredDate: string;
    preferredTime: string;
    jobDescription: string;
  }): Promise<Booking> => {
    const res = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
    return res.data.data;
  },

  getMyBookings: async (page = 0, size = 10): Promise<PaginatedResponse<Booking>> => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>('/bookings/my', {
      params: { page, size },
    });
    return res.data.data;
  },

  getById: async (bookingId: number): Promise<Booking> => {
    const res = await apiClient.get<ApiResponse<Booking>>(`/bookings/${bookingId}`);
    return res.data.data;
  },

  getProviderBookings: async (
    status?: string,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Booking>> => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>('/bookings/my/provider', {
      params: { status, page, size },
    });
    return res.data.data;
  },

  accept: async (bookingId: number): Promise<Booking> => {
    const res = await apiClient.put<ApiResponse<Booking>>(`/bookings/${bookingId}/action`, {
      action: 'accept',
    });
    return res.data.data;
  },

  decline: async (bookingId: number, declineReason: string): Promise<Booking> => {
    const res = await apiClient.put<ApiResponse<Booking>>(`/bookings/${bookingId}/action`, {
      action: 'decline',
      declineReason,
    });
    return res.data.data;
  },

  complete: async (bookingId: number): Promise<Booking> => {
    const res = await apiClient.put<ApiResponse<Booking>>(`/bookings/${bookingId}/complete`);
    return res.data.data;
  },
};
