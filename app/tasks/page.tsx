'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TaskCard } from '@/src/components/tasks/TaskCard';
import { TaskModal } from '@/src/components/tasks/TaskModal';
import { Task } from '@/src/types/task';
import { categories } from '@/src/data/categories';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import debounce from 'lodash/debounce';

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
    status: 'open',
    searchQuery: ''
  });

  const debouncedSearch = debounce((value: string) => {
    setFilters(prev => ({ ...prev, searchQuery: value }));
    setPage(1);
  }, 300);

  const { data, isLoading, error } = useQuery<PaginatedResponse>({
    queryKey: ['tasks', page, filters, selectedFilters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.minBudget && { minBudget: filters.minBudget }),
        ...(filters.maxBudget && { maxBudget: filters.maxBudget }),
        ...(filters.searchQuery && { search: filters.searchQuery }),
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
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="w-full pl-10 p-2 border rounded"
                  />
                </div>
              </div>
              
              {/* Filters */}
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
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sortOrder: e.target.value as 'asc' | 'desc' 
                  }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task List */}
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

              {/* Pagination */}
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
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center">
                    <button
                      onClick={() => setExpandedCategories(prev =>
                        prev.includes(category.name)
                          ? prev.filter(c => c !== category.name)
                          : [...prev, category.name]
                      )}
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
                        onChange={() => {
                          setSelectedFilters(prev => {
                            if (prev.categories.includes(category.name)) {
                              return {
                                categories: prev.categories.filter(c => c !== category.name),
                                subcategories: prev.subcategories.filter(s => 
                                  !category.subcategories.includes(s)
                                )
                              };
                            } else {
                              return {
                                categories: [...prev.categories, category.name],
                                subcategories: [
                                  ...prev.subcategories,
                                  ...category.subcategories
                                ]
                              };
                            }
                          });
                          setPage(1);
                        }}
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
                            onChange={() => {
                              setSelectedFilters(prev => {
                                const newSubcategories = prev.subcategories.includes(subcategory)
                                  ? prev.subcategories.filter(s => s !== subcategory)
                                  : [...prev.subcategories, subcategory];

                                const categorySubcategories = categories.find(
                                  c => c.name === category.name
                                )?.subcategories || [];
                                
                                const allSelected = categorySubcategories.every(
                                  s => newSubcategories.includes(s)
                                );
                                const noneSelected = categorySubcategories.every(
                                  s => !newSubcategories.includes(s)
                                );

                                return {
                                  categories: allSelected
                                    ? [...new Set([...prev.categories, category.name])]
                                    : noneSelected
                                      ? prev.categories.filter(c => c !== category.name)
                                      : prev.categories,
                                  subcategories: newSubcategories
                                };
                              });
                              setPage(1);
                            }}
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
          isWorkerView={true}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}