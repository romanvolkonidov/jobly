import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';

interface UserMenuProps {
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: { imageUrl?: string | null; name?: string | null } | null;
}


export function UserMenu({ isUserMenuOpen, setIsUserMenuOpen, user }: UserMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-2"
      >
        <Image
          src={user?.imageUrl || '/default-avatar.png'}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
      </button>

      {isUserMenuOpen && (
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
          <Link
            href="/auth/logout"
            className="flex px-4 py-2 hover:bg-gray-100 items-center text-gray-700"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Link>
        </div>
      )}
    </div>
  );
}