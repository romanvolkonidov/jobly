// src/components/auth/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('client' | 'worker')[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (roles && user && !roles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, router, roles, user]);

  return <>{children}</>;
};

export default ProtectedRoute;