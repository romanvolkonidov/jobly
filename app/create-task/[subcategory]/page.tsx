'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { categories } from '@/src/data/categories';

export default function CreateTaskPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [taskName, setTaskName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [error, setError] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    const existingTaskData = JSON.parse(localStorage.getItem('taskData') || '{}');
    if (existingTaskData.name) {
      setTaskName(existingTaskData.name);
    }
    setLoading(false);
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedSubcategory('');
    setShowCategories(false);
  };

  const handleSubcategorySelect = (subcategoryName: string) => {
    setSelectedSubcategory(subcategoryName);
    setShowSubcategories(false);
  };

  const handleContinue = () => {
    let hasError = false;
    
    if (!taskName.trim()) {
      setError('Please enter a task name');
      hasError = true;
    }
    
    if (!selectedCategory) {
      setError('Please select a category');
      hasError = true;
    }
    
    if (!selectedSubcategory) {
      setError('Please select a subcategory');
      hasError = true;
    }

    if (hasError) return;
    
    setLoading(true);
    localStorage.setItem('taskData', JSON.stringify({
      name: taskName,
      category: selectedCategory,
      subcategory: selectedSubcategory
    }));
    
    router.push('/create-task/details');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6">What would you like to name your task?</h1>
        
        <div className="mb-6">
          <textarea
            value={taskName}
            onChange={(e) => {
              setTaskName(e.target.value);
              setError('');
            }}
            placeholder="For example: I need someone to make braids at my home"
            className={`w-full p-4 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-gray-600 mb-1">Selected service:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="text-blue-600 hover:underline"
              >
                {selectedCategory || 'Choose category'}
              </button>
              <span className="text-gray-400">→</span>
              <button
                onClick={() => selectedCategory && setShowSubcategories(!showSubcategories)}
                className={`${selectedCategory ? 'text-blue-600 hover:underline' : 'text-gray-400'}`}
              >
                {selectedSubcategory || 'Choose subcategory'}
              </button>
            </div>

            {showCategories && (
              <div className="mt-2 border rounded-lg max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategorySelect(category.name)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {showSubcategories && selectedCategory && (
              <div className="mt-2 border rounded-lg max-h-60 overflow-y-auto">
                {categories
                  .find(c => c.name === selectedCategory)
                  ?.subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      onClick={() => handleSubcategorySelect(subcategory)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      {subcategory}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        <button 
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}