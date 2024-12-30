'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Settings, User, ChevronDown, Bell, Menu } from 'lucide-react';
import { tokens } from '@/src/styles/tokens';
import { CategoryMenu } from './createTask';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import { categories } from '@/src/data/categories';

interface UserData {
  imageUrl?: string | null;
  name?: string | null; // Added 'name'
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth/');
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/check-session');
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);

        if (data.isLoggedIn) {
          const userResponse = await fetch('/api/profile');
          const userData = await userResponse.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <nav
      style={{
        backgroundColor: tokens.colors.white,
        borderBottom: `1px solid ${tokens.colors.gray[100]}`,
      }}
      className="fixed w-full top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              style={{
                color: tokens.colors.primary.blue,
                fontSize: tokens.typography.fontSize.h1,
                fontFamily: tokens.typography.fontFamily.primary,
                fontWeight: tokens.typography.fontWeight.bold,
              }}
              className="tracking-tight"
            >
              Jobly
            </Link>

            {!isMobile && (!isAuthPage || isLoggedIn) && (
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/tasks"
                  style={{
                    color: tokens.colors.gray[600],
                    fontFamily: tokens.typography.fontFamily.primary,
                    fontSize: tokens.typography.fontSize.body,
                    transition: tokens.transitions.default,
                  }}
                  className="hover:text-gray-900"
                >
                  Find Tasks
                </Link>

                <div
                  className="relative group"
                  onMouseEnter={() => !isMobile && setShowCategories(true)}
                  onMouseLeave={() => !isMobile && setShowCategories(false)}
                  onClick={() => isMobile && setShowCategories(!showCategories)}
                >
                  <div
                    style={{
                      color: tokens.colors.gray[600],
                      fontFamily: tokens.typography.fontFamily.primary,
                      fontSize: tokens.typography.fontSize.body,
                      transition: tokens.transitions.default,
                    }}
                    className={`hover:text-gray-900 flex items-center $ {
                      isMobile ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    Post a Task
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </div>

                  {showCategories && <CategoryMenu categories={categories} />}
                </div>

                {isLoggedIn && (
                  <Link
                    href="/projects"
                    style={{
                      color: tokens.colors.gray[600],
                      fontFamily: tokens.typography.fontFamily.primary,
                      fontSize: tokens.typography.fontSize.body,
                      transition: tokens.transitions.default,
                    }}
                    className="hover:text-gray-900"
                  >
                    My Projects
                  </Link>
                )}
              </div>
            )}
          </div>

          {!isAuthPage && (
            <div className="flex items-center space-x-4">
              {isLoggedIn && (
                <button
                  className="relative"
                  style={{ color: tokens.colors.gray[600] }}
                >
                  <Bell className="h-6 w-6" />
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                    style={{ backgroundColor: tokens.colors.primary.red }}
                  />
                </button>
              )}

              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{ color: tokens.colors.gray[600] }}
                  className="md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}

              {!isLoggedIn ? (
                <Link
                  href="/auth/login"
                  style={{
                    backgroundColor: tokens.colors.primary.blue,
                    color: tokens.colors.white,
                    borderRadius: tokens.borderRadius.md,
                    transition: tokens.transitions.default,
                    fontFamily: tokens.typography.fontFamily.primary,
                    fontSize: tokens.typography.fontSize.body,
                  }}
                  className="px-4 py-2 hover:opacity-90"
                >
                  Login
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <Image
                      src={user?.imageUrl || '/default-avatar.png'}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <ChevronDown
                      style={{ color: tokens.colors.gray[600] }}
                      className="h-4 w-4"
                    />
                  </button>
                  {isMenuOpen && (
                    <div
                      style={{
                        backgroundColor: tokens.colors.white,
                        boxShadow: tokens.shadows.md,
                        borderRadius: tokens.borderRadius.md,
                        fontFamily: tokens.typography.fontFamily.primary,
                      }}
                      className="absolute right-0 mt-2 w-48 py-1 z-50"
                    >
                      <Link
                        href="/profile"
                        style={{
                          color: tokens.colors.gray[600],
                          transition: tokens.transitions.default,
                        }}
                        className="flex px-4 py-2 hover:bg-gray-50"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        style={{
                          color: tokens.colors.gray[600],
                          transition: tokens.transitions.default,
                        }}
                        className="flex px-4 py-2 hover:bg-gray-50"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <Link
                        href="/auth/logout"
                        style={{
                          color: tokens.colors.gray[600],
                          transition: tokens.transitions.default,
                        }}
                        className="flex px-4 py-2 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {isMobile && isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-4 mt-2">
              {isLoggedIn && (
                <div className="flex items-center space-x-4">
                  <Image
                    src={user?.imageUrl || '/default-avatar.png'}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <span>{user?.name || 'User'}</span>
                </div>
              )}
              <Link href="/tasks" className="block text-gray-700 hover:text-gray-900">
                Find Tasks
              </Link>
              <Link href="/projects" className="block text-gray-700 hover:text-gray-900">
                My Projects
              </Link>
              <Link href="/auth/logout" className="block text-gray-700 hover:text-gray-900">
                Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
