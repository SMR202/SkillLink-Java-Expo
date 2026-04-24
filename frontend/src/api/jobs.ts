import apiClient from './client';
import { ApiResponse, Booking, JobPost, PaginatedResponse, Proposal } from '../types';

export const jobApi = {
  create: async (data: {
    title: string;
    categoryId: number;
    description: string;
    budget: number;
    location?: string;
    deadline?: string;
  }) => {
    const res = await apiClient.post<ApiResponse<JobPost>>('/jobs', data);
    return res.data.data;
  },

  getOpen: async (page = 0, size = 20) => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<JobPost>>>('/jobs', {
      params: { page, size },
    });
    return res.data.data;
  },

  getMine: async (page = 0, size = 20) => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<JobPost>>>('/jobs/my', {
      params: { page, size },
    });
    return res.data.data;
  },

  submitProposal: async (jobId: number, data: {
    coverMessage: string;
    proposedPrice: number;
    estimatedDeliveryTime: string;
  }) => {
    const res = await apiClient.post<ApiResponse<Proposal>>(`/jobs/${jobId}/proposals`, data);
    return res.data.data;
  },

  getProposals: async (jobId: number) => {
    const res = await apiClient.get<ApiResponse<Proposal[]>>(`/jobs/${jobId}/proposals`);
    return res.data.data;
  },

  acceptProposal: async (proposalId: number, data: { preferredDate: string; preferredTime: string }) => {
    const res = await apiClient.put<ApiResponse<Booking>>(`/proposals/${proposalId}/accept`, data);
    return res.data.data;
  },
};
