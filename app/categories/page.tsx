// app/categories/page.tsx
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { categories } from '@/src/data/categories';

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const selectedCategoryData = categories.find(
    (category) => category.name === selectedCategory
  );

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Choose a Category</h1>
        <div className="grid grid-flow-col auto-cols-[minmax(200px,1fr)] gap-4 w-full overflow-x-auto pb-4 px-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategorySelect(category.name)}
              className={`h-24 flex items-center justify-center border-2 rounded-lg shadow-sm transition-colors ${
                selectedCategory === category.name
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span
                className={`text-lg font-semibold px-6 text-center ${
                  selectedCategory === category.name ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Subcategories for {selectedCategory}
        </h2>
        <div className="grid gap-3">
          {selectedCategoryData?.subcategories.map((subcategory) => (
            <Link
              key={subcategory}
              href={`/create-task/${encodeURIComponent(subcategory.toLowerCase().replace(/ /g, '-'))}`}
              className="block p-4 text-lg font-medium text-gray-700 hover:text-gray-900 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {subcategory}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}