'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostList } from '@/components/posts/PostList';
import { SearchInput } from '@/components/posts/SearchInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useCategories } from '@/lib/graphql/hooks';
import { useAdvancedSearch } from '@/lib/graphql/search-hooks'; // ADDED: Import the search hook
import { TransformedPost } from '@/lib/graphql/transformers';

export default function Home() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [quickSearchResults, setQuickSearchResults] = useState<TransformedPost[]>([]);
  const [isQuickSearching, setIsQuickSearching] = useState(false);

  // ADDED: Use the search hook for category filtering
  const {
    selectedCategories,
    searchResults: categoryFilteredResults,
    loading: categoryLoading,
    hasActiveFilters: hasCategoryFilter,
    toggleCategory,
    clearSearch: clearCategoryFilter,
  } = useAdvancedSearch({
    enableSuggestions: false, // Don't need suggestions for category filtering
  });

  const handleQuickSearchResults = (results: TransformedPost[]) => {
    setQuickSearchResults(results);
    setIsQuickSearching(results.length > 0);
  };

  const clearQuickSearch = () => {
    setIsQuickSearching(false);
    setQuickSearchResults([]);
  };

  // FIXED: Now this actually calls the search hook's toggleCategory
  const handleCategoryClick = (categoryDatabaseId: number) => {
    
    // Clear quick search when selecting category
    if (isQuickSearching) {
      clearQuickSearch();
    }
    
    // Use the search hook's toggleCategory function
    toggleCategory(categoryDatabaseId);
  };

  // Get selected category name for display
  const selectedCategory = selectedCategories.length > 0 
    ? categories.find(c => c.databaseId === selectedCategories[0])
    : null;

  // Determine what to show
  const showQuickSearch = isQuickSearching;
  const showCategoryFilter = hasCategoryFilter && !isQuickSearching;
  const showLatestPosts = !showQuickSearch && !showCategoryFilter;

  return (
    <>
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">WordPress GraphQL Blog</h1>
          <p className="text-gray-600 text-lg mb-6">
            Discover our latest posts with advanced search and filtering
          </p>
          
          {/* Quick Search */}
          <div className="max-w-md mx-auto mb-4">
            <SearchInput 
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
        
        {/* Categories Section - FIXED: Now connected to search hook */}
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
              {categoriesLoading ? (
                <div className="text-gray-500">Loading categories...</div>
              ) : (
                categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategories.includes(category.databaseId) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleCategoryClick(category.databaseId)} // FIXED: Connected to search hook
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))
              )}
            </div>
            
            {/* Clear category button */}
            {selectedCategory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearCategoryFilter()} // FIXED: Use search hook's clear function
                className="mt-3"
              >
                Clear Category Filter
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Content Section - UPDATED: Show different content based on state */}
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
            <LatestPostsSection />
          )}
        </div>
        
      </div>
    </main>
    </>
  );
}

// Quick search results component
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

// UPDATED: Category filtered section using search hook results
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
          Posts in "{categoryName}" ({searchResults.length})
        </h2>
        <Button variant="outline" onClick={onClearCategory}>
          Clear Category Filter
        </Button>
      </div>
      
      {/* Show results from search hook, not PostList */}
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

// Latest posts component (unchanged)
function LatestPostsSection() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
      <PostList 
        pageSize={9}
        enableInfiniteScroll={false}
      />
    </div>
  );
}

// Post card component (unchanged)
function PostCard({ post }: { post: TransformedPost }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">
          {post.title}
        </CardTitle>
        <CardDescription>
          {post.formattedDate} • {post.readingTime} min read
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-3 mb-3">
          {post.plainTextExcerpt}
        </p>
        <div className="flex flex-wrap gap-1">
          {post.categoryNames.map((categoryName) => (
            <Badge key={categoryName} variant="outline" className="text-xs">
              {categoryName}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}