import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const API_URL = 'http://localhost:5000/api';

const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(`${API_URL}/auth/login`, { email, password });
          const { user, token } = response.data;
          
          // Set auth token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to login. Please try again.',
            isAuthenticated: false,
          });
        }
      },

      register: async (name, email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
          const { user, token } = response.data;
          
          // Set auth token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to register. Please try again.',
            isAuthenticated: false,
          });
        }
      },

      logout: () => {
        // Remove auth token from axios defaults
        delete axios.defaults.headers.common['Authorization'];
        
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;