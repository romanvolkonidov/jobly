'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  user: {
    imageUrl?: string | null;
    name?: string | null;
  } | null;
  closeAction: () => void;
}

export function MobileMenu({ user, closeAction }: MobileMenuProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={closeAction}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto p-6 shadow-xl"
      >
        <div className="flex justify-end mb-2">
          <button
            onClick={closeAction}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-start mb-8">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="User Profile Picture"
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-lg" />
          )}
          <span className="mt-3 text-lg font-semibold">{user?.name || 'User'}</span>
        </div>

        <nav className="space-y-6">
          <Link href="/tasks" className="block text-lg font-medium text-gray-700 hover:text-gray-900">
            Find Tasks
          </Link>
          <Link href="/projects" className="block text-lg font-medium text-gray-700 hover:text-gray-900">
            My Projects
          </Link>
          <Link href="/create" className="block text-lg font-medium text-gray-700 hover:text-gray-900">
            Post a Task
          </Link>
          <Link href="/profile" className="block text-md text-gray-700 hover:text-gray-900">
            Profile
          </Link>
          <Link href="/settings" className="block text-md text-gray-700 hover:text-gray-900">
            Settings
          </Link>
          <Link href="/auth/logout" className="block text-md text-gray-700 hover:text-gray-900">
            Logout
          </Link>
        </nav>
      </motion.div>
    </>
  );
}
