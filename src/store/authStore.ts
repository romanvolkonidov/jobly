// src/store/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthState {
 user: User | null;
 isAuthenticated: boolean;
 setAuth: (user: User) => void;
 logout: () => void;
}

const useAuthStore = create<AuthState>()(
 persist(
   (set) => ({
     user: null,
     isAuthenticated: false,
     
     setAuth: (user) => set({ 
       user, 
       isAuthenticated: true 
     }),
     
     logout: () => set({ 
       user: null, 
       isAuthenticated: false 
     }),
   }),
   {
     name: 'auth-storage',
   }
 )
);

export default useAuthStore;