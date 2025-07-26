'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PostList } from '@/components/posts/PostList';
import { SearchInput } from '@/components/posts/SearchInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useCategories } from '@/lib/graphql/hooks';
import { TransformedPost } from '@/lib/graphql/transformers';

export default function Home() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchResults, setSearchResults] = useState<TransformedPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (results: TransformedPost[]) => {
    setSearchResults(results);
    setIsSearching(results.length > 0);
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
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
              onSearchResults={handleSearchResults}
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
        
        {/* Categories Section */}
        <Card>
          <CardHeader>
            <CardTitle>Browse by Category</CardTitle>
            <CardDescription>Click on a category to filter posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoriesLoading ? (
                <div className="text-gray-500">Loading categories...</div>
              ) : (
                categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Content Section - Search Results or Latest Posts */}
        <div>
          {isSearching ? (
            <SearchResultsSection 
              searchResults={searchResults}
              onClearSearch={clearSearch}
            />
          ) : (
            <LatestPostsSection />
          )}
        </div>
        
      </div>
    </main>
  );
}

// Extracted Search Results Component
function SearchResultsSection({ 
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

// Extracted Latest Posts Component
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

// Extracted Post Card Component
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