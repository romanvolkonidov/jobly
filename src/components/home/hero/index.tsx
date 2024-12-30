'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const searchPlaceholders = [
  "Find a plumber nearby...",
  "Looking for a web developer...",
  "Need help moving...",
  "Search for a graphic designer..."
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setPlaceholderIndex(i => (i + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="relative min-h-[80vh] bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-32">
        <div className="text-center">
          <h1 className="text-[36px] font-bold text-gray-900 tracking-tight leading-tight">
            Get It Done
          </h1>
          
          <p className="mt-6 text-gray-600 text-[16px] leading-relaxed">
            Connect with skilled professionals in your area
          </p>

          <div className="mt-12 mx-auto max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isClient ? searchPlaceholders[placeholderIndex] : searchPlaceholders[0]}
                className="w-full px-8 py-6 text-lg border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-blue shadow-xl bg-white/90 backdrop-blur-sm"
              />
              <button 
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-white p-4 rounded-xl transition-colors 
                  ${isHovered ? 'bg-primary-blue/80' : 'bg-primary-blue'}`}
              >
                <Search className="h-6 w-6" />
              </button>
            </form>
          </div>

          <div className="mt-10 flex justify-center items-center space-x-6">
            <div className="flex -space-x-4">
              {[1,2,3,4].map((i) => (
                <div 
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 shadow-md"
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm">
              Join <span className="font-semibold text-primary-blue">2,000+</span> people getting things done
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}