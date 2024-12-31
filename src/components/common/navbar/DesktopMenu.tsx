//src/components/common/navbar/DesktopMenu.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '@/src/data/categories';

interface DesktopMenuProps {
  isLoggedIn: boolean; // Add this prop
}

export function DesktopMenu({ isLoggedIn }: DesktopMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [menuTop, setMenuTop] = useState(0);
  const categoryRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="hidden md:flex space-x-6">
      <Link href="/tasks" className="text-lg text-gray-700 hover:text-gray-900">
        Find Tasks
      </Link>
      
      {isLoggedIn && ( // Only show My Projects when logged in
        <Link href="/projects" className="text-lg text-gray-700 hover:text-gray-900">
          My Projects
        </Link>
      )}

      <div
        className="relative"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => {
          setIsMenuOpen(false);
          setHoveredCategory(null);
        }}
      >
        <button className="text-lg text-gray-700 hover:text-gray-900">
          Create a Task
        </button>
        {isMenuOpen && (
          <div className="absolute top-full left-0 bg-white shadow-md rounded-md w-64 mt-0 z-10">
            {categories.map((category) => (
              <div
                key={category.name}
                ref={hoveredCategory === category.name ? categoryRef : null}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.name)}
              >
                <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  {category.name}
                </div>
                {hoveredCategory === category.name && (
                  <div className="absolute top-0 -right-6 h-full w-6" />
                )}
                {hoveredCategory === category.name && (
                  <div 
                    className="absolute left-[calc(100%-1px)] bg-white shadow-md rounded-md w-48 z-20 overflow-hidden"
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
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-base transition-colors bg-white"
                          >
                            {subcategory}
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
    </div>
  );
}