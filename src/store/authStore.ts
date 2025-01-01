// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      setAuth: (user) => set({ 
        user, 
        isAuthenticated: true,
        isLoading: false
      }),
      
      setLoading: (loading) => set({
        isLoading: loading
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;