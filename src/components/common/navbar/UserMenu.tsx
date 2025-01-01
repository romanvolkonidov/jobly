//src/components/common/navbar/UserMenu.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
  isUserMenuOpen: boolean;
  setIsUserMenuOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
  user: { 
    imageUrl?: string | null; 
    name?: string | null; 
  } | null;
  isLoggedIn: boolean;
  onLogoutAction: () => void;
}

export function UserMenu({ 
  isUserMenuOpen, 
  setIsUserMenuOpenAction, 
  user, 
  isLoggedIn,
  onLogoutAction 
}: UserMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      onLogoutAction();
      setIsUserMenuOpenAction(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMenuClick = () => {
    setIsUserMenuOpenAction(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpenAction(!isUserMenuOpen)}
        className="flex items-center space-x-2"
      >
        {isLoggedIn ? (
          <Image
            src={user?.imageUrl || '/default-avatar.png'}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <Link
            href="/auth/login"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        )}
      </button>

      {isUserMenuOpen && isLoggedIn && (
        <div className="absolute right-0 mt-2 w-48 py-2 z-50 bg-white rounded-lg shadow-lg border border-gray-100">
          <Link
            href="/profile"
            onClick={handleMenuClick}
            className="flex px-4 py-2 hover:bg-gray-50 items-center text-gray-700 transition-colors"
          >
            <User className="h-4 w-4 mr-2" /> Profile
          </Link>
          <Link
            href="/settings"
            onClick={handleMenuClick}
            className="flex px-4 py-2 hover:bg-gray-50 items-center text-gray-700 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full px-4 py-2 hover:bg-gray-50 items-center text-gray-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;