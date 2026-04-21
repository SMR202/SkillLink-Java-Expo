import apiClient from './client';
import { ChatMessage, ApiResponse } from '../types';

export const messageApi = {
  send: (bookingId: number, content: string) =>
    apiClient.post<ApiResponse<ChatMessage>>('/messages', { bookingId, content }),

  getChat: (bookingId: number) =>
    apiClient.get<ApiResponse<ChatMessage[]>>(`/messages/${bookingId}`),

  markRead: (bookingId: number) =>
    apiClient.put<ApiResponse<void>>(`/messages/${bookingId}/read`),
};
