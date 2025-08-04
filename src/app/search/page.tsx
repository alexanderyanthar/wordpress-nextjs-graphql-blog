'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchResults } from '@/components/posts/SearchResults';
import { TransformedPost } from '@/lib/graphql/transformers';

// Search page content component wrapped in Suspense
function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get search term from URL
  const searchTerm = searchParams.get('q') || '';

  // Handle search results and update URL
  const handleSearchResults = (results: TransformedPost[], newSearchTerm?: string) => {
    // Only update URL if search term actually changed
    if (newSearchTerm !== undefined && newSearchTerm !== searchTerm) {
      const params = new URLSearchParams();
      if (newSearchTerm.trim()) {
        params.set('q', newSearchTerm.trim());
        router.replace(`/search?${params.toString()}`, { scroll: false });
      } else {
        router.replace('/search', { scroll: false });
      }
    }
  };

  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Search Posts</h1>
          <p className="text-gray-600">
            Find posts by keyword, category, or tag
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-1">
              Searching for: &quot;<span className="font-medium">{searchTerm}</span>&quot;
            </p>
          )}
        </div>
        
        <SearchResults 
          initialSearchTerm={searchTerm}
          onSearchResults={handleSearchResults}
        />
      </div>
    </main>
  );
}

// Main search page component with Suspense wrapper
export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="container mx-auto py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Search Posts</h1>
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      </main>
    }>
      <SearchPageContent />
    </Suspense>
  );
}