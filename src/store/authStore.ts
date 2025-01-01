import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/src/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User | null) => void;
  logout: () => void;
}

const createCustomStorage = () => {
  const storage = localStorage; // Switch to localStorage
  const MAX_SIZE = 2000000; // 2MB safety limit
  
  return {
    getItem: (name: string) => {
      try {
        return storage.getItem(name);
      } catch (err) {
        console.error('Storage getItem error:', err);
        return null;
      }
    },
    setItem: (name: string, value: string) => {
      try {
        // Check size before setting
        if (value.length > MAX_SIZE) {
          storage.clear();
          const minimalData = JSON.parse(value);
          if (minimalData.state?.user) {
            minimalData.state.user = {
              id: minimalData.state.user.id,
              email: minimalData.state.user.email,
              name: minimalData.state.user.name
            };
          }
          storage.setItem(name, JSON.stringify(minimalData));
        } else {
          storage.setItem(name, value);
        }
      } catch (err) {
        console.error('Storage setItem error:', err);
        try {
          storage.clear();
          const minimalData = { 
            state: { 
              user: null, 
              isAuthenticated: false 
            }
          };
          storage.setItem(name, JSON.stringify(minimalData));
        } catch (retryErr) {
          console.error('Storage retry failed:', retryErr);
        }
      }
    },
    removeItem: (name: string) => {
      try {
        storage.removeItem(name);
      } catch (err) {
        console.error('Storage removeItem error:', err);
      }
    }
  };
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),
      logout: () => {
        localStorage.clear(); // Clear storage on logout
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createCustomStorage()),
      partialize: (state) => ({
        user: state.user ? {
          id: state.user.id,
          email: state.user.email,
          name: state.user.name
        } : null,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;