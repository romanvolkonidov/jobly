'use client';

import React, { useState } from 'react';
import { ArrowRight, Search, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePostTask = () => {
    // Initialize with a default subcategory - you can adjust this as needed
    router.push('/create-task/general-task');
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Skills to Seal Your Deals<br />Use Your Skills to Pay the Bills
        </h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks or vacancies..."
              className="w-full pl-12 pr-4 py-3 text-lg border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Need something done?</h2>
            <p className="text-gray-600 mb-4">Post a one-time task</p>
            <button
              onClick={handlePostTask}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Post Task
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Hiring?</h2>
            <p className="text-gray-600 mb-4">Post a job vacancy</p>
            <a href="/post-vacancy" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors w-full">
              Post Vacancy
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center mb-8">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
              <h3 className="font-medium mb-2">Post</h3>
              <p className="text-gray-600">Create your listing for free</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
              <h3 className="font-medium mb-2">Connect</h3>
              <p className="text-gray-600">Message and negotiate directly</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
              <h3 className="font-medium mb-2">Complete</h3>
              <p className="text-gray-600">Handle payment privately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;