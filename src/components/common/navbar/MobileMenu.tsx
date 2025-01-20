'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { withLazyLoading } from '@/src/components/common/Performance';
import { useRouter } from 'next/navigation';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string | null;
      image?: string | null;
    }
  }
}

interface MobileMenuProps {
  closeAction: () => void;
  imageUrl: string;
  isLoading?: boolean;
}

function MobileMenu({ closeAction, imageUrl, isLoading = false }: MobileMenuProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const handleNavigation = (path: string) => {
    closeAction();
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const profileItems: Array<{
    label: string;
    path: string;
    primary?: boolean;
  }> = isAuthenticated ? [
    { label: 'Profile', path: '/profile' },
    { label: 'Settings', path: '/settings' },
    { label: 'Logout', path: '/auth/logout' }
  ] : [
    { label: 'Login', path: '/auth/login', primary: true },
    { label: 'Sign Up', path: '/auth/signup', primary: true }
  ];

  const menuItems: Array<{
    label: string;
    path: string;
    requireAuth?: boolean;
  }> = [
    { label: 'Create a task', path: '/categories', requireAuth: false },
    { label: 'Find Tasks', path: '/tasks', requireAuth: false },
    { label: 'My Projects', path: '/projects', requireAuth: true },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto p-6 shadow-xl"
    >
      <div className="flex justify-between mb-8">
        {isAuthenticated && (
          <div className="flex flex-col items-center">
            {isLoading ? (
              <>
                <div className="w-40 h-40 rounded-lg bg-gray-200 animate-pulse mb-3" />
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
              </>
            ) : (
              <>
                <Image
                  src={imageUrl}
                  alt="Profile Picture"
                  width={160}
                  height={160}
                  className="rounded-lg mb-3 transition-opacity duration-200"
                  priority
                />
                <motion.span 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-semibold text-center"
                >
                  {session?.user?.firstName ? 
                    `${session.user.firstName} ${session.user.lastName}` : 
                    'User'}
                </motion.span>
              </>
            )}
          </div>
        )}
        <button
          onClick={closeAction}
          className="h-fit text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200"
          disabled={isLoading}
        >
          ✕
        </button>
      </div>

      <nav className="space-y-4">
        {menuItems.map((item, index) => (
          (!item.requireAuth || isAuthenticated) && (
            <motion.button 
              key={item.path}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onClick={() => handleNavigation(item.path)}
              className="w-full text-left p-4 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {item.label}
            </motion.button>
          )
        ))}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4 border-t border-gray-200"
        >
          {profileItems.map((item, index) => (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
              onClick={() => handleNavigation(item.path)}
              className={`w-full text-left p-4 text-md transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                item.primary 
                  ? 'text-white bg-blue-600 hover:bg-blue-700 text-center mb-2'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              disabled={isLoading}
            >
              {item.label}
            </motion.button>
          ))}
        </motion.div>
      </nav>

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}
    </motion.div>
  );
}

export default withLazyLoading(MobileMenu);