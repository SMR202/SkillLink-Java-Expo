export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface SkillCategory {
  id: number;
  name: string;
  icon: string;
}

export interface ProviderProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  skills: SkillCategory[];
  portfolioLinks: string[];
  city: string;
  avgRating: number;
  totalReviews: number;
  isVerified: boolean;
  phoneNumber: string | null;
  profileComplete: boolean;
}

export interface ClientProfile {
  id: number;
  userId: number;
  phoneNumber: string | null;
  avatarUrl: string | null;
  addresses: Address[];
}

export interface Address {
  id: number;
  label: string;
  streetAddress: string;
  city: string;
  area: string;
  isPrimary: boolean;
}

export interface Booking {
  id: number;
  clientId: number;
  clientName: string;
  providerId: number;
  providerName: string;
  providerAvatarUrl: string | null;
  preferredDate: string;
  preferredTime: string;
  jobDescription: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
  declineReason: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page
  size: number;
  first: boolean;
  last: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  referenceId: number;
  isRead: boolean;
  createdAt: string;
}
