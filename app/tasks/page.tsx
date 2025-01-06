// app/tasks/page.tsx
//this file works in the following way: 
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import { Slider } from '@/src/components/ui/slider';
import TaskResponseModal from '@/src/components/common/modals/TaskResponseModal';

interface TaskFilters {
  minBudget?: number;
  maxBudget?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface Task {
  id: string;
  title: string;
  budget: number;
  createdBy: {
    firstName: string;
    lastName: string;
    rating: number;
    reviewCount: number;
  };
  bids: Array<{ id: string }>;
}

interface PaginatedResponse {
  tasks: Task[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
  };
}

const TaskSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export default function TaskSearchPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('all');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [budgetRange, setBudgetRange] = useState([0, 100000]);
  const { ref, inView } = useInView();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = useCallback((taskId: string) => {
    router.push(`/tasks/${taskId}`);
  }, [router]); // Empty dependency array since router is stable

  const fetchTasks = useCallback(async ({ pageParam = 1 }) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const searchParams = new URLSearchParams({
        page: pageParam.toString(),
        limit: '10',
        ...filters,
        minBudget: budgetRange[0].toString(),
        maxBudget: budgetRange[1].toString(),
      });

      const response = await fetch(`/api/tasks?${searchParams}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, [filters, budgetRange]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['tasks', activeTab, filters, budgetRange],
    queryFn: fetchTasks,
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse) =>
      lastPage.pagination?.currentPage < lastPage.pagination?.pages
        ? lastPage.pagination.currentPage + 1
        : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const handleResponse = (price: number, message: string) => {
    console.log('Response:', { price, message });
    setIsModalOpen(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TaskSkeleton />
      </div>
    );
  }

  // Show error state
  if (isError && error instanceof Error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 mb-4">Error loading tasks: {error.message}</p>
        <button
          onClick={() => fetchNextPage()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }





  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'recommended'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Recommended Tasks
        </button>
      </div>

      <div className="flex gap-8">
        {/* Task List */}
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.pages.map((page) =>
                page.tasks.map((task: Task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task.id)}
                    className="bg-white rounded-lg shadow-sm p-6 relative cursor-pointer hover:shadow-md transition-shadow"
                  >
                    {task.bids.length === 0 && (
                      <span className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        New
                      </span>
                    )}
                    <h3 className="text-xl font-medium mb-2">{task.title}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-semibold">
                        KES {task.budget?.toLocaleString() ?? 'Budget not set'}
                      </span>
                      <div className="text-sm text-gray-600">
                      Posted by {task.createdBy.firstName}                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-yellow-600">
                        ★ {task.createdBy.rating?.toFixed(1) ?? 'No rating'}(
                        {task.createdBy.reviewCount} reviews)
                      </span>
                      <span className="text-gray-600">
                        {task.bids.length} proposals
                      </span>
                    </div>
                  </div>
                ))
              )}
              {isFetchingNextPage && (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              )}
              <div ref={ref} />
            </div>
          )}
        </div>

        {/* Filters Sidebar */}
        <div className="w-64 shrink-0 space-y-6">
          {/* Budget Range Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-4">Budget Range</h3>
            <Slider
              min={0}
              max={100000}
              step={1000}
              value={budgetRange}
              onValueChange={setBudgetRange}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>KES {budgetRange[0].toLocaleString()}</span>
              <span>KES {budgetRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Sort Options */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-4">Sort By</h3>
            <select
              className="w-full p-2 border rounded"
              value={`${filters.sortBy}_${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('_');
                setFilters({
                  ...filters,
                  sortBy,
                  sortOrder: sortOrder as 'asc' | 'desc',
                });
              }}
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="budget_desc">Highest Budget</option>
              <option value="budget_asc">Lowest Budget</option>
            </select>
          </div>
        </div>
      </div>

      {isModalOpen && (
  <TaskResponseModal
    taskTitle="Task Title Here" // Example title
    maxBudget={50000} // Example budget
    isOpen={isModalOpen}
    onClose={toggleModal}
    onResponse={handleResponse}
  />
)}

    </div>
  );
}
