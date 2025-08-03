'use client';

import { useState } from 'react';
import Link from 'next/link';
import PostCard from '@/components/posts/PostCard';
import { SearchInput } from '@/components/posts/SearchInput';
import { PostSkeletons } from '@/components/loading/PostSkeletons';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useHomePage } from '@/lib/graphql/hooks/useHomePage';
import { useAdvancedSearch } from '@/lib/graphql/search-hooks';
import { TransformedPost } from '@/lib/graphql/transformers';

export default function Home() {
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
    categoriesCount: 15,
  });

  const [quickSearchResults, setQuickSearchResults] = useState<TransformedPost[]>([]);
  const [isQuickSearching, setIsQuickSearching] = useState(false);

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

  const selectedCategory = selectedCategories.length > 0 
    ? categories.find(c => c.databaseId === selectedCategories[0])
    : null;

  const showQuickSearch = isQuickSearching;
  const showCategoryFilter = hasCategoryFilter && !isQuickSearching;
  const showLatestPosts = !showQuickSearch && !showCategoryFilter;

  // Enhanced loading state with proper skeletons
  if (homeLoading) {
    return (
      <main className="container mx-auto py-8">
        <div className="space-y-8">
          {/* Hero Section Skeleton */}
          <div className="text-center">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-6" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-10 w-40 mx-auto mb-8" />
          </div>
          
          {/* Categories Section Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Posts Section Skeleton */}
          <div>
            <Skeleton className="h-8 w-32 mb-6" />
            <PostSkeletons count={9} variant="card" />
          </div>
        </div>
      </main>
    );
  }

  // Enhanced error state
  if (homeError) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Unable to load homepage</h2>
          <p className="text-gray-600 mb-6">There was a problem loading the homepage content.</p>
          <Button onClick={refetchHomePage}>Try Again</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        
        {/* Hero Section */}
        <ErrorBoundary>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {siteSettings?.title || 'WordPress GraphQL Blog'}
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              {siteSettings?.description || 'Discover our latest posts with advanced search and filtering'}
            </p>
            
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
        </ErrorBoundary>
        
        {/* Categories Section */}
        <ErrorBoundary>
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
                    key={category.databaseId}
                    variant={selectedCategories.includes(category.databaseId) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleCategoryClick(category.databaseId)}
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))}
              </div>
              
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
        </ErrorBoundary>
        
        {/* Content Section */}
        <ErrorBoundary>
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
                posts={latestPosts}
                hasMorePosts={hasMorePosts}
              />
            )}
          </div>
        </ErrorBoundary>
        
      </div>
    </main>
  );
}

// Enhanced components with error boundaries
function QuickSearchResultsSection({ 
  searchResults, 
  onClearSearch 
}: { 
  searchResults: TransformedPost[];
  onClearSearch: () => void;
}) {
  return (
    <ErrorBoundary>
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
            <ErrorBoundary key={post.id}>
              <PostCard post={post} />
            </ErrorBoundary>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

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
    <ErrorBoundary>
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
          <PostSkeletons count={6} variant="card" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((post) => (
              <ErrorBoundary key={post.id}>
                <PostCard post={post} />
              </ErrorBoundary>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

function LatestPostsSection({ 
  posts, 
  hasMorePosts 
}: { 
  posts: TransformedPost[];
  hasMorePosts: boolean;
}) {
  return (
    <ErrorBoundary>
      <div>
        <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ErrorBoundary key={post.id}>
              <PostCard post={post} />
            </ErrorBoundary>
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
    </ErrorBoundary>
  );
}