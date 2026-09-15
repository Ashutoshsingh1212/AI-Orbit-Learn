import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tool } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  bookmarkedSlugs: Set<string>;
  bookmarks: Tool[];
  isBookmarksOpen: boolean;
  setIsBookmarksOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
  toggleBookmark: (tool: Tool) => Promise<boolean>;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: '7d35901b-9a26-4195-830f-f1d7555ed2bd',
  name: 'Demo Reviewer',
  email: 'demo@aiorbit.club',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'ADMIN',
  createdAt: '2026-09-15T00:00:00.000Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Tool[]>([]);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null
  );

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Load session on start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('ai_orbit_token');
      if (token) {
        if (token.startsWith('demo_session_')) {
          const storedUser = localStorage.getItem('ai_orbit_demo_user');
          try {
            setUser(storedUser ? JSON.parse(storedUser) : DEMO_USER);
          } catch {
            setUser(DEMO_USER);
          }
          await fetchBookmarks();
        } else {
          try {
            const res = await api.getMe();
            if (res.success && res.data) {
              setUser(res.data);
              await fetchBookmarks();
            }
          } catch (err) {
            console.warn('Session expired or invalid, clearing token.');
            localStorage.removeItem('ai_orbit_token');
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await api.getBookmarks();
      if (res.success && res.data) {
        setBookmarks(res.data);
        const slugs = new Set(res.data.map((t) => t.slug || t.id));
        setBookmarkedSlugs(slugs);
      }
    } catch (err) {
      console.error('Failed to load user bookmarks:', err);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res.success && res.token) {
      localStorage.setItem('ai_orbit_token', res.token);
      setUser(res.user);
      await fetchBookmarks();
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      setIsAuthModalOpen(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.register(name, email, password);
    if (res.success && res.token) {
      localStorage.setItem('ai_orbit_token', res.token);
      setUser(res.user);
      await fetchBookmarks();
      showToast(`Account created! Welcome, ${res.user.name}.`, 'success');
      setIsAuthModalOpen(false);
    }
  };

  const loginAsDemo = async () => {
    try {
      await login('demo@aiorbit.club', 'password123');
    } catch (err: any) {
      console.warn('Backend demo login encountered an issue, activating demo fallback:', err?.message || err);
      const fallbackToken = 'demo_session_' + Date.now();
      localStorage.setItem('ai_orbit_token', fallbackToken);
      localStorage.setItem('ai_orbit_demo_user', JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
      await fetchBookmarks();
      showToast('Welcome to AI Orbit (Demo Reviewer Access)!', 'success');
      setIsAuthModalOpen(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ai_orbit_token');
    localStorage.removeItem('ai_orbit_demo_user');
    setUser(null);
    setBookmarks([]);
    setBookmarkedSlugs(new Set());
    showToast('Logged out successfully', 'info');
  };

  const toggleBookmark = async (tool: Tool): Promise<boolean> => {
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Please log in or continue as Demo user to save bookmarks', 'info');
      return false;
    }

    const isCurrentlySaved = bookmarkedSlugs.has(tool.slug);

    // Optimistic UI update
    setBookmarkedSlugs((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) {
        next.delete(tool.slug);
      } else {
        next.add(tool.slug);
      }
      return next;
    });

    try {
      const res = await api.toggleBookmark(tool.slug);
      if (res.success) {
        showToast(res.message, 'success');
        await fetchBookmarks();
        return res.bookmarked;
      }
      return !isCurrentlySaved;
    } catch (err: any) {
      // Revert optimistic update
      setBookmarkedSlugs((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) {
          next.add(tool.slug);
        } else {
          next.delete(tool.slug);
        }
        return next;
      });
      showToast(err.message || 'Failed to update bookmark', 'error');
      return isCurrentlySaved;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        bookmarkedSlugs,
        bookmarks,
        isBookmarksOpen,
        setIsBookmarksOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        register,
        loginAsDemo,
        logout,
        toggleBookmark,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
