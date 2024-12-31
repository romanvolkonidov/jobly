'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface MobileMenuProps {
  user: {
    imageUrl?: string | null;
    name?: string | null;
  } | null;
  isLoggedIn: boolean;
  closeAction: () => void;
}

export function MobileMenu({ user, isLoggedIn, closeAction }: MobileMenuProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    closeAction();
    router.push(path);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-white overflow-y-auto p-6"
    >
      <div className="flex flex-col mb-6">
        <div className="flex justify-between">
          {isLoggedIn && (
            <div className="flex flex-col items-center w-20">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="User Profile Picture"
                  width={80}
                  height={80}
                  className="rounded-lg mb-2"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-lg mb-2" />
              )}
              <span className="text-lg font-semibold text-center whitespace-nowrap">{user?.name || 'User'}</span>
            </div>
          )}
          <button
            onClick={closeAction}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            ✕
          </button>
        </div>
      </div>

      <nav className="space-y-3">
        {/* Primary Actions */}
        <div className="space-y-2">
          <button
            onClick={() => handleNavigation('/tasks')}
            className="block w-full p-4 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-left"
          >
            Find Tasks
          </button>
          {isLoggedIn && (
            <button
              onClick={() => handleNavigation('/projects')}
              className="block w-full p-4 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              My Projects
            </button>
          )}
          <button
            onClick={() => handleNavigation('/categories')}
            className="block w-full p-4 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-left"
          >
            Create a task
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-2 pt-2 border-t border-gray-200">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => handleNavigation('/profile')}
                className="block w-full p-3 text-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                Profile
              </button>
              <button
                onClick={() => handleNavigation('/settings')}
                className="block w-full p-3 text-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                Settings
              </button>
              <button
                onClick={() => handleNavigation('/auth/logout')}
                className="block w-full p-3 text-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigation('/auth/login')}
              className="block w-full p-3 text-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </motion.div>
  );
}
