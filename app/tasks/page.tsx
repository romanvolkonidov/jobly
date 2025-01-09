'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TaskCard } from '@/src/components/tasks/TaskCard';
import { TaskModal } from '@/src/components/tasks/TaskModal';
import { Task } from '@/src/types/task';
import { categories } from '@/src/data/categories';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PaginatedResponse {
  tasks: Task[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
  };
}

interface SelectedFilters {
  categories: string[];
  subcategories: string[];
}

export default function TaskListingPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    categories: [],
    subcategories: []
  });
  const [filters, setFilters] = useState({
    minBudget: '',
    maxBudget: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
    status: 'open'
  });

  const toggleCategory = (categoryName: string) => {
    setSelectedFilters(prev => {
      const categorySubcategories = categories.find(c => c.name === categoryName)?.subcategories || [];
      
      if (prev.categories.includes(categoryName)) {
        return {
          categories: prev.categories.filter(c => c !== categoryName),
          subcategories: prev.subcategories.filter(s => !categorySubcategories.includes(s))
        };
      } else {
        return {
          categories: [...prev.categories, categoryName],
          subcategories: [...prev.subcategories, ...categorySubcategories]
        };
      }
    });
    setPage(1);
  };

  const toggleSubcategory = (subcategory: string, categoryName: string) => {
    setSelectedFilters(prev => {
      const newSubcategories = prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(s => s !== subcategory)
        : [...prev.subcategories, subcategory];

      const categorySubcategories = categories.find(c => c.name === categoryName)?.subcategories || [];
      const allCategorySubcategoriesSelected = categorySubcategories.every(s => newSubcategories.includes(s));
      const noCategorySubcategoriesSelected = categorySubcategories.every(s => !newSubcategories.includes(s));

      const newCategories = allCategorySubcategoriesSelected
        ? [...new Set([...prev.categories, categoryName])]
        : noCategorySubcategoriesSelected
          ? prev.categories.filter(c => c !== categoryName)
          : prev.categories;

      return {
        categories: newCategories,
        subcategories: newSubcategories
      };
    });
    setPage(1);
  };

  const toggleExpand = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleAll = () => {
    setSelectedFilters(prev => ({
      categories: prev.categories.length === categories.length ? [] : categories.map(c => c.name),
      subcategories: prev.subcategories.length === categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)
        ? []
        : categories.flatMap(c => c.subcategories)
    }));
    setPage(1);
  };

  const { data, isLoading, error } = useQuery<PaginatedResponse>({
    queryKey: ['tasks', page, filters, selectedFilters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.minBudget && { minBudget: filters.minBudget }),
        ...(filters.maxBudget && { maxBudget: filters.maxBudget }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        status: filters.status,
        ...(selectedFilters.categories.length > 0 && { categories: selectedFilters.categories.join(',') }),
        ...(selectedFilters.subcategories.length > 0 && { subcategories: selectedFilters.subcategories.join(',') })
      });

      const response = await fetch(`/api/tasks?${params}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minBudget}
                    onChange={(e) => setFilters(prev => ({ ...prev, minBudget: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxBudget}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="createdAt">Date Posted</option>
                  <option value="budget">Budget</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-semibold mb-6">
            Available Tasks {data?.pagination.total ? `(${data.pagination.total})` : ''}
          </h1>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              Failed to load tasks. Please try again later.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {data?.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isClientView={false}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
                {(!data?.tasks || data.tasks.length === 0) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <p className="text-gray-500">No tasks found matching your criteria</p>
                  </div>
                )}
              </div>

              {data?.pagination.pages && data.pagination.pages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  {[...Array(data.pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded ${
                        page === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Categories Sidebar */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.categories.length === categories.length}
                  onChange={toggleAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 font-medium">Show All</span>
              </label>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleExpand(category.name)}
                      className="mr-2 p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedCategories.includes(category.name) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <label className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        checked={selectedFilters.categories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">{category.name}</span>
                    </label>
                  </div>
                  
                  {expandedCategories.includes(category.name) && (
                    <div className="ml-8 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <label key={subcategory} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedFilters.subcategories.includes(subcategory)}
                            onChange={() => toggleSubcategory(subcategory, category.name)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm">{subcategory}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
                       </div>

                     </div>

       </div>
     </div>

     {selectedTask && (
       <TaskModal
         task={selectedTask}
         isWorkerView={false}
         onClose={() => setSelectedTask(null)}
       />
     )}
   </div>
 );
}