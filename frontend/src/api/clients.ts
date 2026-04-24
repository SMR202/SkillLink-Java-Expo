import apiClient from './client';
import { ApiResponse, ClientProfile } from '../types';

export const clientApi = {
  getMyProfile: async (): Promise<ClientProfile> => {
    const res = await apiClient.get<ApiResponse<ClientProfile>>('/clients/me');
    return res.data.data;
  },

  updateContact: async (phoneNumber: string): Promise<ClientProfile> => {
    const res = await apiClient.put<ApiResponse<ClientProfile>>('/clients/contact', { phoneNumber });
    return res.data.data;
  },

  addAddress: async (data: {
    label?: string;
    streetAddress: string;
    city?: string;
    area?: string;
    isPrimary?: boolean;
  }): Promise<ClientProfile> => {
    const res = await apiClient.post<ApiResponse<ClientProfile>>('/clients/addresses', data);
    return res.data.data;
  },
};
