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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null); // Clear user data in case of an error
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-lg text-blue-600">
            Jobly
          </Link>
          <DesktopMenu />
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
                user={user} // Pass the dynamically fetched user state
              />
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            user={user}
            closeAction={() => setIsMobileMenuOpen(false)} // Corrected prop name
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
