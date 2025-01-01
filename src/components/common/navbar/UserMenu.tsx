'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface UserMenuProps {
  isUserMenuOpen: boolean;
  setIsUserMenuOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
  onLogoutAction: () => void;
}

export function UserMenu({ 
  isUserMenuOpen, 
  setIsUserMenuOpenAction,
  onLogoutAction 
}: UserMenuProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isLoggedIn = !!session;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
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

  if (isLoading) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpenAction(!isUserMenuOpen)}
        className="flex items-center space-x-2"
      >
        {isLoggedIn ? (
          <Image
            src={session.user?.image || '/default-avatar.png'}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
            priority
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