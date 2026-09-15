import type {
  Tool,
  ToolFilters,
  ToolsApiResponse,
  ToolDetailApiResponse,
  CategoriesApiResponse,
  ReviewsApiResponse,
  CategoryCount,
  User,
} from '../types';
import { FALLBACK_TOOLS, FALLBACK_CATEGORIES } from './fallbackData';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/+$/, '');

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath.startsWith('/api/') || normalizedPath === '/api') {
    if (API_BASE_URL.endsWith('/api')) {
      return `${API_BASE_URL}${normalizedPath.slice(4)}`;
    }
  }
  return `${API_BASE_URL}${normalizedPath}`;
}

/**
 * Filter and sort fallback tools in-memory when backend is offline
 */
function getFallbackTools(filters: ToolFilters = {}): ToolsApiResponse {
  let filtered = [...FALLBACK_TOOLS];

  // Search filter
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagLine.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'all' && filters.category !== 'All') {
    const catLower = filters.category.toLowerCase().trim();
    filtered = filtered.filter((t) => {
      const toolCatLower = t.category.toLowerCase();
      return (
        toolCatLower === catLower ||
        (catLower.includes('writing') && toolCatLower.includes('writing')) ||
        (catLower.includes('text') && toolCatLower.includes('text')) ||
        (catLower.includes('image') && toolCatLower.includes('image')) ||
        (catLower.includes('audio') && (toolCatLower.includes('audio') || toolCatLower.includes('voice'))) ||
        (catLower.includes('video') && toolCatLower.includes('video')) ||
        (catLower.includes('market') && toolCatLower.includes('market')) ||
        (catLower.includes('research') && toolCatLower.includes('research')) ||
        (catLower.includes('product') && toolCatLower.includes('product')) ||
        (catLower.includes('code') && toolCatLower.includes('cod'))
      );
    });
  }

  // Pricing filter
  if (filters.pricing && filters.pricing !== 'all' && filters.pricing !== 'All') {
    filtered = filtered.filter(
      (t) => t.pricing.toLowerCase() === filters.pricing!.toLowerCase()
    );
  }

  // View filter (featured)
  if (filters.view === 'featured') {
    filtered = filtered.filter((t) => t.featured);
  }

  // Sort order
  if (filters.sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (filters.sort === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } else {
    // popular (default)
    filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  }

  const page = filters.page ? Number(filters.page) : 1;
  const limit = filters.limit ? Number(filters.limit) : 12;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    success: true,
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/**
 * Fetch list of tools with optional search, category, pricing, view mode, and pagination filters
 */
export async function fetchTools(filters: ToolFilters = {}): Promise<ToolsApiResponse> {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) query.append('search', filters.search.trim());
  if (filters.category && filters.category !== 'all' && filters.category !== 'All') {
    query.append('category', filters.category);
  }
  if (filters.pricing && filters.pricing !== 'all' && filters.pricing !== 'All') {
    query.append('pricing', filters.pricing);
  }
  if (filters.view && filters.view !== 'all') {
    query.append('view', filters.view);
  }
  if (filters.sort) query.append('sort', filters.sort);
  if (filters.page) query.append('page', filters.page.toString());
  if (filters.limit) query.append('limit', filters.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const url = `${API_BASE_URL}/tools${queryString}`;

  const token = localStorage.getItem('ai_orbit_token');
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Failed to fetch tools (HTTP ${res.status})`);
    }
    return data;
  } catch (err: any) {
    console.warn('fetchTools using fallback catalog:', err.message);
    return getFallbackTools(filters);
  }
}

/**
 * Fetch a single AI tool's comprehensive details by slug or UUID
 */
export async function fetchToolBySlugOrId(slugOrId: string): Promise<Tool> {
  if (!slugOrId) {
    throw new Error('Tool identifier (slug or ID) is required');
  }

  const token = localStorage.getItem('ai_orbit_token');
  try {
    const res = await fetch(`${API_BASE_URL}/tools/${encodeURIComponent(slugOrId)}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Tool "${slugOrId}" not found`);
    }
    return data.data;
  } catch (err: any) {
    console.warn(`fetchToolBySlugOrId(${slugOrId}) using fallback:`, err.message);
    const found = FALLBACK_TOOLS.find(
      (t) => t.slug.toLowerCase() === slugOrId.toLowerCase() || t.id === slugOrId
    );
    if (found) return found;
    throw err;
  }
}

/**
 * Fetch distinct category list with counts
 */
export async function fetchCategories(): Promise<{ totalTools: number; categories: CategoryCount[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch categories');
    }
    return data.data;
  } catch (err: any) {
    console.warn('fetchCategories using fallback catalog:', err.message);
    return {
      totalTools: FALLBACK_TOOLS.length,
      categories: FALLBACK_CATEGORIES,
    };
  }
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('ai_orbit_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      return data as T;
    } catch (err: any) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
      throw err;
    }
  }

  async getTools(params: ToolFilters = {}): Promise<ToolsApiResponse> {
    return fetchTools(params);
  }

  async getToolById(id: string): Promise<ToolDetailApiResponse> {
    const tool = await fetchToolBySlugOrId(id);
    return { success: true, data: tool };
  }

  async getRelatedTools(id: string, limit: number = 3): Promise<{ success: boolean; data: Tool[] }> {
    try {
      return await this.request<{ success: boolean; data: Tool[] }>(`/tools/${id}/related?limit=${limit}`);
    } catch {
      const related = FALLBACK_TOOLS.filter((t) => t.id !== id && t.slug !== id).slice(0, limit);
      return { success: true, data: related };
    }
  }

  async getCategories(): Promise<CategoriesApiResponse> {
    const data = await fetchCategories();
    return { success: true, data };
  }

  async getReviews(toolId: string, page: number = 1, limit: number = 10): Promise<ReviewsApiResponse> {
    try {
      return await this.request<ReviewsApiResponse>(`/tools/${toolId}/reviews?page=${page}&limit=${limit}`);
    } catch {
      return {
        success: true,
        reviews: [],
        stats: {
          averageRating: 0,
          totalReviews: 0,
        },
        pagination: { page, limit, total: 0, totalPages: 1 },
      };
    }
  }

  async submitReview(
    toolId: string,
    data: { rating: number; title: string; content: string }
  ): Promise<{ success: boolean; data: any; message: string }> {
    return this.request<{ success: boolean; data: any; message: string }>(`/tools/${toolId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleBookmark(toolId: string): Promise<{ success: boolean; bookmarked: boolean; message: string }> {
    return this.request<{ success: boolean; bookmarked: boolean; message: string }>(
      `/tools/${toolId}/bookmark`,
      {
        method: 'POST',
      }
    );
  }

  async getBookmarks(): Promise<{ success: boolean; data: Tool[] }> {
    try {
      return await this.request<{ success: boolean; data: Tool[] }>('/bookmarks');
    } catch {
      return { success: true, data: [] };
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user: User; token: string; message: string }> {
    return this.request<{ success: boolean; user: User; token: string; message: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; user: User; token: string; message: string }> {
    return this.request<{ success: boolean; user: User; token: string; message: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }
    );
  }

  async getMe(): Promise<{ success: boolean; data: User }> {
    return this.request<{ success: boolean; data: User }>('/auth/me');
  }
}

export const api = new ApiClient();
