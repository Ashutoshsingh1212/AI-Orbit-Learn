export * from './tool';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
}

export interface Category {
  name: string;
  slug: string;
  toolCount: number;
  count?: number;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  toolId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReviewsApiResponse {
  success: boolean;
  reviews: Review[];
  stats: {
    averageRating: number;
    totalReviews: number;
  };
  pagination: PaginationMeta;
}
