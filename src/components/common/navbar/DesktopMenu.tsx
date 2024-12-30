'use client';

import { useState } from 'react';
import Link from 'next/link';
import { categories } from '@/src/data/categories';

export function DesktopMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="hidden md:flex space-x-6">
      <Link href="/tasks" className="text-lg text-gray-700 hover:text-gray-900">
        Find Tasks
      </Link>
      
      <Link href="/projects" className="text-lg text-gray-700 hover:text-gray-900">
        My Projects
      </Link>

      {/* Create a Task with Dropdown */}
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
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.name)}
              >
                <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  {category.name}
                </div>
              </div>
            ))}
            {/* Subcategories menu - now outside the mapping */}
            {hoveredCategory && (
              <div className="absolute left-full top-0 bg-white shadow-md rounded-md w-48 z-20">
                {categories
                  .find(category => category.name === hoveredCategory)
                  ?.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory}
                      href={`/create-task/${subcategory.toLowerCase().replace(/ /g, '-')}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {subcategory}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
