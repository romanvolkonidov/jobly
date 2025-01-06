'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
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

  // Add other user data properties if needed
}

function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;
  const [userImageUrl, setUserImageUrl] = useState<string>('/default-avatar.png');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch('/api/profile', { credentials: 'include' });
        if (!response.ok) {
          console.error('Failed to fetch user data:', response.statusText);
          return;
        }
        const userData: UserData = await response.json();
        setUserImageUrl(userData.imageUrl || '/default-avatar.png');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [session?.user?.id]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="fixed w-full top-0 z-50 flex justify-center items-center h-16 bg-white border-b">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-lg text-blue-600">
            Skill Spot
          </Link>
          <DesktopMenu isLoggedIn={isAuthenticated} />
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <>
              <MessagesButton />
              <button 
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}
          <MenuToggle
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          {!isMobileMenuOpen && (
            <div className="hidden md:flex">
              <UserMenu
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpenAction={setIsUserMenuOpen}
                onLogoutAction={handleLogout}
                imageUrl={userImageUrl}
              />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            closeAction={() => setIsMobileMenuOpen(false)}
            imageUrl={userImageUrl}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

export default withLazyLoading(Navbar);