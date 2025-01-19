'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import MenuToggle from './MenuToggle';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import MessagesButton from './MessagesButton';
import { withLazyLoading } from '@/src/components/common/Performance';
import { UserMenu } from './UserMenu';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Add useQueryClient

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  aboutMe?: string;
  location?: string;
  isWorker: boolean;
  rating?: number;
  portfolioImages: string[];
  portfolioVideo?: string;
  completedTasks: number;
  reviewCount: number;
  taskRating?: number;
}

function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient(); // Add this line
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;

  // Replace the useEffect + useState with useQuery
  const { data: userData, isLoading: profileLoading } = useQuery({
    queryKey: ['userData', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const response = await fetch('/api/profile', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch user data');
      return response.json();
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30,
  });

  // Use session image if available, fall back to userData, then default
  const userImageUrl = session?.user?.image || userData?.imageUrl || '/default-avatar.png';
  const isLoading = status === "loading" || (isAuthenticated && !session.user.image && profileLoading);

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/auth/login'
      });
      // Clear React Query cache
      queryClient.clear();
      // Force revalidate session
      await queryClient.invalidateQueries({ queryKey: ['userData'] });
      // Reset local state
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      // Redirect after cleanup
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Add immediate check for authentication
  useEffect(() => {
    const handleAuthChange = () => {
      if (status === "unauthenticated") {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        queryClient.clear();
        router.replace('/auth/login');
      }
    };

    handleAuthChange();
    return () => {
      queryClient.clear();
    };
  }, [status, queryClient, router]);

  // Update the isAuthenticated check to be more strict
  const isFullyAuthenticated = isAuthenticated && status === "authenticated";

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed w-full top-0 z-50 bg-white border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="font-bold text-lg text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Skill Spot
          </Link>
          <DesktopMenu isLoggedIn={isAuthenticated} isLoading={isLoading} />
        </div>

        <div className="flex items-center space-x-4">
          {isFullyAuthenticated && (
            <>
              <MessagesButton />
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6 text-gray-600" />
              </motion.button>
            </>
          )}
          <MenuToggle
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          {!isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="hidden md:flex"
            >
              <UserMenu
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpenAction={setIsUserMenuOpen}
                onLogoutAction={handleLogout}
                imageUrl={userImageUrl}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <MobileMenu
            closeAction={() => setIsMobileMenuOpen(false)}
            imageUrl={userImageUrl}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default withLazyLoading(Navbar);