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
  userId?: number;
  user?: User;
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
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'PAID' | 'COMPLETED' | 'CANCELLED';
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

// Sprint 3 types
export interface Review {
  id: number;
  bookingId: number;
  clientId: number;
  clientName: string;
  providerId: number;
  providerName: string;
  rating: number;
  comment: string;
  providerResponse: string | null;
  createdAt: string;
  respondedAt: string | null;
}

export interface ChatMessage {
  id: number;
  bookingId: number;
  senderId: number;
  senderName: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface Conversation {
  bookingId: number;
  otherUserId: number;
  otherUserName: string;
  otherUserAvatarUrl: string | null;
  bookingStatus: Booking['status'];
  jobDescription: string;
  preferredDate: string;
  preferredTime: string;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Payment {
  id: number;
  bookingId: number;
  clientName: string;
  providerName: string;
  amount: number;
  platformFee: number;
  providerEarnings: number;
  status: string;
  paymentMethod: string;
  transactionRef: string;
  paidAt: string;
}

export interface EarningsSummary {
  totalEarnings: number;
  pendingPayouts: number;
  thisMonthEarnings: number;
  completedPayments: number;
  totalBookingsCompleted: number;
}

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface Analytics {
  totalUsers: number;
  totalClients: number;
  totalProviders: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  platformEarnings: number;
  totalReviews: number;
  averagePlatformRating: number;
}

export interface JobPost {
  id: number;
  clientId: number;
  clientName: string;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  budget: number;
  location: string | null;
  deadline: string | null;
  status: 'OPEN' | 'FILLED' | 'CLOSED';
  proposalCount: number;
  createdAt: string;
}

export interface Proposal {
  id: number;
  jobPostId: number;
  jobTitle: string;
  providerId: number;
  providerName: string;
  providerAvatarUrl: string | null;
  providerRating: number;
  coverMessage: string;
  proposedPrice: number;
  estimatedDeliveryTime: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  bookingId: number | null;
  createdAt: string;
}
