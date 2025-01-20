'use client';

import { withLazyLoading } from '@/src/components/common/Performance';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '@/src/data/categories';

interface DesktopMenuProps {
  isLoggedIn: boolean;
  isLoading?: boolean;
}

function DesktopMenu({ isLoggedIn, isLoading = false }: DesktopMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [menuTop, setMenuTop] = useState(0);
  const categoryRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hoveredCategory && categoryRef.current) {
      const rect = categoryRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const menuHeight = viewportHeight - 80;
      const categoryTop = rect.top;
      
      let newTop = 0;
      
      if (categoryTop + menuHeight > viewportHeight) {
        newTop = viewportHeight - menuHeight - rect.top;
      }
      
      setMenuTop(newTop);
    }
  }, [hoveredCategory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setHoveredCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="hidden md:flex space-x-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-8">
      <div
        ref={menuRef}
        className="relative group"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => {
          setIsMenuOpen(false);
          setHoveredCategory(null);
        }}
      >
        <button className="text-base font-medium text-gray-700 hover:text-orange-600 transition-all duration-200 flex items-center space-x-1 py-2">
          Create a Task
        </button>
        {isMenuOpen && (
          <div className="absolute top-full left-0 bg-white shadow-md rounded-md w-64 mt-0 z-10 animate-fadeIn">
            {categories.map((category) => (
              <div
                key={category.name}
                ref={hoveredCategory === category.name ? categoryRef : null}
                className="relative group"
                onMouseEnter={() => setHoveredCategory(category.name)}
              >
                <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200 flex justify-between items-center">
                  {category.name}
                  <svg
                    className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {hoveredCategory === category.name && (
                  <div className="absolute top-0 -right-6 h-full w-6" />
                )}
                {hoveredCategory === category.name && (
                  <div 
                    className="absolute left-[calc(100%-1px)] bg-white shadow-md rounded-md w-48 z-20 overflow-hidden animate-fadeIn"
                    style={{
                      top: menuTop,
                      height: 'calc(100vh - 80px)',
                    }}
                  >
                    <div className="flex flex-col bg-white h-full overflow-y-auto">
                      {categories
                        .find(cat => cat.name === hoveredCategory)
                        ?.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory}
                            href={`/create-task/${subcategory.toLowerCase().replace(/ /g, '-')}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-base transition-colors bg-white group"
                          >
                            <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                              {subcategory}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Link 
        href="/tasks" 
        className="text-lg text-gray-700 hover:text-gray-900 transition-colors duration-200"
      >
        Find Tasks
      </Link>
      
      {isLoggedIn && (
        <Link 
          href="/projects" 
          className="text-lg text-gray-700 hover:text-gray-900 transition-colors duration-200"
        >
          My Projects
        </Link>
      )}

      
    </div>
  );
}

// Add these animations to your global CSS or tailwind config
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(-10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.2s ease-out forwards;
// }

export default withLazyLoading(DesktopMenu);