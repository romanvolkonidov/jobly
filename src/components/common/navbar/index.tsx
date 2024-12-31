//src/components/common/navbar/index.tsx
'use client';

import { useState, useEffect } from 'react';
import MenuToggle from './MenuToggle';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import UserMenu from './UserMenu';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import MessagesButton from './MessagesButton';
import { Bell } from 'lucide-react';
import { withLazyLoading } from '@/src/components/common/Performance';

interface UserData {
  imageUrl?: string | null;
  name?: string | null;
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/check-session');
        const sessionData = await sessionResponse.json();
        setIsLoggedIn(sessionData.isLoggedIn);

        if (sessionData.isLoggedIn) {
          const userResponse = await fetch('/api/profile');
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []); // Empty dependency array means this runs once when component mounts

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-lg text-blue-600">
          Skill Spot
          </Link>
          <DesktopMenu isLoggedIn={isLoggedIn} />
        </div>

<div className="flex items-center space-x-4">
  {isLoggedIn && (
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
        isLoggedIn={isLoggedIn}
        onLogoutAction={handleLogout}
      />
    </div>
  )}
</div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu 
            user={user} 
            isLoggedIn={isLoggedIn}
            closeAction={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

export default withLazyLoading(Navbar);