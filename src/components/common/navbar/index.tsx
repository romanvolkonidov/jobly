'use client';

import { useState } from 'react';
import MenuToggle from './MenuToggle';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import UserMenu from './UserMenu';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import MessagesButton from './MessagesButton';
import { Bell } from 'lucide-react';
import { withLazyLoading } from '@/src/components/common/Performance';
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;


  // Logout handler
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  // Check session and fetch user data

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-16 bg-white border-b">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  const user = session?.user ? {
    id: session.user.id as string,
    name: session.user.name || '',  // Default to empty string
    email: session.user.email || '' // Default to empty string
  } : null;

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
