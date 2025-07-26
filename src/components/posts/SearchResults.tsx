'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from './SearchInput';
import { TransformedPost } from '@/lib/graphql/transformers';

interface SearchResultsProps {
  initialResults?: TransformedPost[];
}

export function SearchResults({ initialResults = [] }: SearchResultsProps) {
  const [searchResults, setSearchResults] = useState<TransformedPost[]>(initialResults);

  const handleSearchResults = (results: TransformedPost[]) => {
    setSearchResults(results);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <SearchInput 
        onSearchResults={handleSearchResults}
        placeholder="Search posts, categories, or tags..."
        showFilters={true}
      />

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Search Results ({searchResults.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((post) => (
              <SearchResultCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Start Searching</h3>
            <p className="text-gray-500">
              Enter a search term or select filters to find posts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Individual Search Result Card
function SearchResultCard({ post }: { post: TransformedPost }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      {post.featuredImageUrl && (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-wrap gap-1 mb-2">
          {post.categoryNames.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-lg line-clamp-2">
          {post.title}
        </CardTitle>
        <CardDescription>
          {post.formattedDate} • {post.readingTime} min read
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">
          {post.plainTextExcerpt}
        </p>
        <Button variant="outline" size="sm" className="w-full">
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}