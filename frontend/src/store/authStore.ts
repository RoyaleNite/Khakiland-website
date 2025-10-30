import { create } from 'zustand';
import type { User, LoginCredentials, RegisterData } from '../types';
import { authAPI } from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const tokens = await authAPI.login(credentials);

      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);

      const user = await authAPI.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Login failed',
        isLoading: false
      });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authAPI.register(userData);

      localStorage.setItem('accessToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);

      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data || 'Registration failed',
        isLoading: false
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false, error: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const user = await authAPI.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
