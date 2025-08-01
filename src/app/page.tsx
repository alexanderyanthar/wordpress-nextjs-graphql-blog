'use client';

import { useState } from 'react';
import Link from 'next/link';
import PostCard from '@/components/posts/PostCard';
import { SearchInput } from '@/components/posts/SearchInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useHomePage } from '@/lib/graphql/hooks/useHomePage'; // NEW: Single hook for all homepage data
import { useAdvancedSearch } from '@/lib/graphql/search-hooks';
import { TransformedPost } from '@/lib/graphql/transformers';

export default function Home() {
  // NEW: Single hook replaces useCategories + PostList's usePaginatedPosts
  const { 
    siteSettings,
    posts: latestPosts,
    categories,
    loading: homeLoading,
    error: homeError,
    hasMorePosts,
    refetch: refetchHomePage
  } = useHomePage({
    postsCount: 9,
    categoriesCount: 15, // Reduced from 100!
  });

  // Quick search state (unchanged)
  const [quickSearchResults, setQuickSearchResults] = useState<TransformedPost[]>([]);
  const [isQuickSearching, setIsQuickSearching] = useState(false);

  // Category filtering using existing search hook (unchanged)
  const {
    selectedCategories,
    searchResults: categoryFilteredResults,
    loading: categoryLoading,
    hasActiveFilters: hasCategoryFilter,
    toggleCategory,
    clearSearch: clearCategoryFilter,
  } = useAdvancedSearch({
    enableSuggestions: false,
  });

  const handleQuickSearchResults = (results: TransformedPost[]) => {
    setQuickSearchResults(results);
    setIsQuickSearching(results.length > 0);
  };

  const clearQuickSearch = () => {
    setIsQuickSearching(false);
    setQuickSearchResults([]);
  };

  const handleCategoryClick = (categoryDatabaseId: number) => {
    if (isQuickSearching) {
      clearQuickSearch();
    }
    toggleCategory(categoryDatabaseId);
  };

  // Get selected category name for display
  const selectedCategory = selectedCategories.length > 0 
    ? categories.find(c => c.databaseId === selectedCategories[0])
    : null;

  // Determine what to show (unchanged logic)
  const showQuickSearch = isQuickSearching;
  const showCategoryFilter = hasCategoryFilter && !isQuickSearching;
  const showLatestPosts = !showQuickSearch && !showCategoryFilter;

  // NEW: Single loading state for homepage data
  if (homeLoading) {
    return (
      <main className="container mx-auto py-8">
        <div className="space-y-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  // NEW: Single error state for homepage data
  if (homeError) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Unable to load homepage</h2>
          <Button onClick={refetchHomePage}>Try Again</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        
        {/* Hero Section - NEW: Uses siteSettings from combined query */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {siteSettings?.title || 'WordPress GraphQL Blog'}
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            {siteSettings?.description || 'Discover our latest posts with advanced search and filtering'}
          </p>
          
          {/* Quick Search (unchanged) */}
          <div className="max-w-md mx-auto mb-4">
            <SearchInput
              categories={categories}
              onSearchResults={handleQuickSearchResults}
              placeholder="Quick search..."
              showFilters={false}
            />
          </div>
          
          <Link href="/search">
            <Button variant="outline" className="mb-8">
              <Search className="w-4 h-4 mr-2" />
              Advanced Search
            </Button>
          </Link>
        </div>
        
        {/* Categories Section - NEW: No separate loading state needed */}
        <Card>
          <CardHeader>
            <CardTitle>Browse by Category</CardTitle>
            <CardDescription>
              Click on a category to filter posts
              {selectedCategory && (
                <span className="text-blue-600 font-medium">
                  {' '} • Currently showing: {selectedCategory.name}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategories.includes(category.databaseId) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleCategoryClick(category.databaseId)}
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
            
            {/* Clear category button */}
            {selectedCategory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearCategoryFilter()}
                className="mt-3"
              >
                Clear Category Filter
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Content Section (unchanged logic) */}
        <div>
          {showQuickSearch && (
            <QuickSearchResultsSection 
              searchResults={quickSearchResults}
              onClearSearch={clearQuickSearch}
            />
          )}
          
          {showCategoryFilter && (
            <CategoryFilteredSection 
              categoryName={selectedCategory?.name || ''}
              searchResults={categoryFilteredResults}
              loading={categoryLoading}
              onClearCategory={clearCategoryFilter}
            />
          )}
          
          {showLatestPosts && (
            <LatestPostsSection 
              posts={latestPosts} // NEW: Pass posts from combined query
              hasMorePosts={hasMorePosts}
            />
          )}
        </div>
        
      </div>
    </main>
  );
}

// Quick search results component (unchanged)
function QuickSearchResultsSection({ 
  searchResults, 
  onClearSearch 
}: { 
  searchResults: TransformedPost[];
  onClearSearch: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Search Results ({searchResults.length})
        </h2>
        <Button variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// Category filtered section (unchanged)
function CategoryFilteredSection({ 
  categoryName,
  searchResults,
  loading,
  onClearCategory 
}: { 
  categoryName: string;
  searchResults: TransformedPost[];
  loading: boolean;
  onClearCategory: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Posts in &quot;{categoryName}&quot; ({searchResults.length})
        </h2>
        <Button variant="outline" onClick={onClearCategory}>
          Clear Category Filter
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

// NEW: Updated latest posts component - no longer uses PostList
function LatestPostsSection({ 
  posts, 
  hasMorePosts 
}: { 
  posts: TransformedPost[];
  hasMorePosts: boolean;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {hasMorePosts && (
        <div className="text-center mt-8">
          <Link href="/posts">
            <Button variant="outline">
              View More Posts
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}