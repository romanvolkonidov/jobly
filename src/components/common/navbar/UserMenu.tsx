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
  user: { imageUrl?: string | null; name?: string | null } | null;
  isLoggedIn: boolean;
  onLogoutAction: () => void; // Add this prop
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
      await fetch('/api/auth/logout', { method: 'POST' });
      onLogoutAction(); // Call the callback to update parent state
      setIsUserMenuOpenAction(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        <div
          style={{
            backgroundColor: 'white',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
          className="absolute right-0 mt-2 w-48 py-2 z-50"
        >
          <Link
            href="/profile"
            className="flex px-4 py-2 hover:bg-gray-100 items-center text-gray-700"
          >
            <User className="h-4 w-4 mr-2" /> Profile
          </Link>
          <Link
            href="/settings"
            className="flex px-4 py-2 hover:bg-gray-100 items-center text-gray-700"
          >
            <Settings className="h-4 w-4 mr-2" /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex px-4 py-2 hover:bg-gray-100 items-center text-gray-700 w-full"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}