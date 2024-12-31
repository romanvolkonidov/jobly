//src/components/common/navbar/createTask.tsx
import Link from 'next/link';
import { tokens } from '@/src/styles/tokens';
import { useState } from 'react';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import { withLazyLoading } from '@/src/components/common/Performance';

interface CategoryWithSubcategories {
  name: string;
  subcategories: string[];
}

interface CategoryMenuProps {
  categories: CategoryWithSubcategories[];
  className?: string;
}

function CategoryMenu({ categories, className }: CategoryMenuProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleCategoryInteraction = (category: string) => {
    if (isMobile) {
      setActiveCategory(activeCategory === category ? null : category);
    }
  };

  return (
    <div
      style={{
        backgroundColor: tokens.colors.white,
        boxShadow: tokens.shadows.md,
        borderRadius: tokens.borderRadius.md,
        fontFamily: tokens.typography.fontFamily.primary,
      }}
      className={`absolute left-0 mt-0 w-64 py-1 z-50 ${className || ''}`}
    >
      {categories.map((category) => (
        <div
          key={category.name}
          className="relative"
          onMouseEnter={() => !isMobile && setHoveredCategory(category.name)}
          onMouseLeave={() => !isMobile && setHoveredCategory(null)}
          onClick={() => handleCategoryInteraction(category.name)}
        >
          <div
            style={{
              color: tokens.colors.gray[600],
              transition: tokens.transitions.default,
            }}
            className={`px-4 py-2 text-sm hover:bg-gray-50 flex justify-between items-center ${
              isMobile ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            {category.name}
            {category.subcategories.length > 0 && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </div>

          {((isMobile && activeCategory === category.name) ||
            (!isMobile && hoveredCategory === category.name)) &&
            category.subcategories.length > 0 && (
              <div
                style={{
                  backgroundColor: tokens.colors.white,
                  boxShadow: tokens.shadows.md,
                  borderRadius: tokens.borderRadius.md,
                  fontFamily: tokens.typography.fontFamily.primary,
                }}
                className={`${
                  isMobile
                    ? 'relative left-0 mt-0 ml-4'
                    : 'absolute left-full top-0 ml-0.5'
                } w-64 py-1`}
              >
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory}
                    href={`/tasks/post?category=${encodeURIComponent(
                      category.name
                    )}&subcategory=${encodeURIComponent(subcategory)}`}
                    style={{
                      color: tokens.colors.gray[600],
                      transition: tokens.transitions.default,
                    }}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    {subcategory}
                  </Link>
                ))}
              </div>
            )}
        </div>
      ))}
    </div>
  );
}

export default withLazyLoading(CategoryMenu);
