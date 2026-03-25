import apiClient from './client';
import { ApiResponse, ProviderProfile, SkillCategory, PaginatedResponse } from '../types';

export const providerApi = {
  getProfile: async (id: number): Promise<ProviderProfile> => {
    const res = await apiClient.get<ApiResponse<ProviderProfile>>(`/providers/${id}`);
    return res.data.data;
  },

  getMyProfile: async (): Promise<ProviderProfile> => {
    const res = await apiClient.get<ApiResponse<ProviderProfile>>('/providers/me');
    return res.data.data;
  },

  updateProfile: async (data: {
    bio?: string;
    skillIds?: number[];
    portfolioLinks?: string[];
    city?: string;
    phoneNumber?: string;
  }): Promise<ProviderProfile> => {
    const res = await apiClient.put<ApiResponse<ProviderProfile>>('/providers/profile', data);
    return res.data.data;
  },

  search: async (params: {
    q?: string;
    categoryId?: number;
    city?: string;
    minRating?: number;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<ProviderProfile>> => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<ProviderProfile>>>(
      '/search/providers', { params }
    );
    return res.data.data;
  },

  getCategories: async (): Promise<SkillCategory[]> => {
    const res = await apiClient.get<ApiResponse<SkillCategory[]>>('/categories');
    return res.data.data;
  },
};
