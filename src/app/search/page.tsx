'use client';

import { SearchResults } from '@/components/posts/SearchResults';

export default function SearchPage() {
  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Search Posts</h1>
          <p className="text-gray-600">
            Find posts by keyword, category, or tag
          </p>
        </div>
        
        <SearchResults />
      </div>
    </main>
  );
}
