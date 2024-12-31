'use client';

import { useState, useEffect } from 'react';
import { MenuToggle } from './MenuToggle';
import { MobileMenu } from './MobileMenu';
import { DesktopMenu } from './DesktopMenu';
import { UserMenu } from './UserMenu';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';

interface UserData {
  imageUrl?: string | null;
  name?: string | null;
}

export default function Navbar() {
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
            Jobly
          </Link>
          <DesktopMenu isLoggedIn={isLoggedIn} />
        </div>

        <div className="flex items-center space-x-4">
          <MenuToggle
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          {!isMobileMenuOpen && (
            <div className="hidden md:flex">
              <UserMenu
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        user={user}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout} // Add this prop
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