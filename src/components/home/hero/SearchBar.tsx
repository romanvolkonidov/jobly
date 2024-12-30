"use client";

import { useState } from 'react';
import Button from '@/src/components/ui/Button';


interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What task do you need help with?"
        className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-blue-500"
      />
      <Button type="submit" variant="primary" className="rounded-l-none">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;