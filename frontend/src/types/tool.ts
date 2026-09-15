export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagLine: string;
  description: string;
  fullDescription?: string;
  category: string;
  pricing: 'Free' | 'Freemium' | 'Paid' | string;
  websiteUrl: string;
  url?: string;
  rating: number;
  reviewsCount: number;
  iconUrl: string;
  icon?: string;
  featured: boolean;
  verified: boolean;
  features: string[];
  useCases: string[];
  tags?: string[];
  reviews?: Array<{
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
  }>;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryCount {
  name: string;
  slug: string;
  toolCount: number;
  count?: number;
}

export interface ToolFilters {
  search?: string;
  category?: string;
  pricing?: string;
  view?: 'featured' | 'all' | string;
  sort?: 'popular' | 'rating' | 'newest' | 'az' | string;
  page?: number;
  limit?: number;
}

export interface ToolsApiResponse {
  success: boolean;
  data: Tool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ToolDetailApiResponse {
  success: boolean;
  data: Tool;
}

export interface CategoriesApiResponse {
  success: boolean;
  data: {
    totalTools: number;
    categories: CategoryCount[];
  };
}
