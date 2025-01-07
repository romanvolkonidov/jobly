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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;
  const [userImageUrl, setUserImageUrl] = useState<string>('/default-avatar.png');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/profile', { credentials: 'include' });
        if (!response.ok) {
          console.error('Failed to fetch user data:', response.statusText);
          return;
        }
        const userData: UserData = await response.json();
        setUserImageUrl(userData.imageUrl || '/default-avatar.png');
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.id]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="fixed w-full top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          {isAuthenticated && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <MessagesButton />
              </motion.div>
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