'use client';

import { useState, useEffect, useCallback } from 'react';
import MenuToggle from './MenuToggle';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import UserMenu from './UserMenu';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import MessagesButton from './MessagesButton';
import { Bell } from 'lucide-react';
import { withLazyLoading } from '@/src/components/common/Performance';
import useAuthStore from '@/src/store/authStore';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, setAuth, logout } = useAuthStore();

  // Logout handler
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Check session and fetch user data
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/check-session', {
          credentials: 'include',
        });
        const sessionData = await sessionResponse.json();

        if (sessionData.isLoggedIn) {
          const userResponse = await fetch('/api/profile', {
            credentials: 'include',
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setAuth(userData);
          } else {
            console.error('Failed to fetch user data');
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error checking session:', error);
        logout();
      }
    };

    checkSession();
  }, [setAuth, logout]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-16 bg-white border-b">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        {/* Left: Logo and Desktop Menu */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-lg text-blue-600">
            Skill Spot
          </Link>
          <DesktopMenu isLoggedIn={isAuthenticated} />
        </div>

        {/* Right: Notifications, User Menu, Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <>
              <MessagesButton />
              <button className="p-2 hover:bg-gray-100 rounded-full">
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
                user={user}
                isLoggedIn={isAuthenticated}
                onLogoutAction={handleLogout}
              />
            </div>
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            user={user}
            isLoggedIn={isAuthenticated}
            closeAction={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

export default withLazyLoading(Navbar);
