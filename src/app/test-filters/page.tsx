'use client';

import { useState } from 'react';
import { PostFilters, FilterState } from '@/components/posts/PostFilters';
import { UsePostFiltersOptions } from '@/lib/graphql/hooks/usePostFilters';
import { useFilterPersistence } from '@/lib/graphql/hooks/useFilterPersistence';

// Mock data for testing
const mockCategories = [
  { id: '1', databaseId: 1, name: 'Technology', slug: 'tech', count: 15 },
  { id: '2', databaseId: 2, name: 'Design', slug: 'design', count: 8 },
  { id: '3', databaseId: 3, name: 'Business', slug: 'business', count: 12 },
];

const mockTags = [
  { id: 'tag1', name: 'React', slug: 'react', count: 10 },
  { id: 'tag2', name: 'NextJS', slug: 'nextjs', count: 7 },
  { id: 'tag3', name: 'GraphQL', slug: 'graphql', count: 5 },
];

export default function TestFiltersPage() {
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    selectedCategories: [],
    selectedTags: [],
    sortBy: 'date_desc',
  });

  const { persistFiltersToURL, clearURLParams } = useFilterPersistence();

  const handleFilterChange = (newFilters: FilterState) => {
    setFilterState(newFilters);
    persistFiltersToURL(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      searchTerm: '',
      selectedCategories: [],
      selectedTags: [],
      sortBy: 'date_desc',
    };
    setFilterState(clearedFilters);
    clearURLParams();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Filter Component Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PostFilters
            categories={mockCategories}
            tags={mockTags}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Filter State (Debug)</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(filterState, null, 2)}
          </pre>
          
          <h2 className="text-xl font-semibold mb-4 mt-6">URL Parameters</h2>
          <p className="text-sm text-gray-600">
            Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}