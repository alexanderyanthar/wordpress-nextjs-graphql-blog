"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, ExternalLink } from "lucide-react";
import { SearchInput } from "@/components/posts/SearchInput";
import { TransformedPost } from "@/lib/graphql/transformers";
import Link from "next/link";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResults: (results: TransformedPost[], searchTerm?: string) => void;
}

function SearchModal({ isOpen, onClose, onSearchResults }: SearchModalProps) {
  const [searchResults, setSearchResults] = useState<TransformedPost[]>([]);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const router = useRouter();

  // Handle search results from SearchInput
  const handleSearchResults = (results: TransformedPost[]) => {
    setSearchResults(results);
    // Get the search term from the SearchInput component if possible
    // For now, we'll handle this through the SearchInput's internal state
  };

  // Navigate to full search page
  const goToFullSearch = () => {
    if (currentSearchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(currentSearchTerm.trim())}`);
      onClose();
    } else {
      // If no search term, just go to search page
      router.push('/search');
      onClose();
    }
  };

  // Navigate to individual post
  const goToPost = (slug: string) => {
    router.push(`/posts/${slug}`);
    onClose();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset results when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchResults([]);
      setCurrentSearchTerm('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Posts
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="mb-4">
            <SearchInput
              onSearchResults={handleSearchResults}
              placeholder="Search posts, categories, or tags..."
              showFilters={false} // Keep it simple in the modal
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFullSearch}
                  className="flex items-center gap-1"
                >
                  View all results
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>

              {/* Results List - Show first 5 results */}
              <div className="space-y-2">
                {searchResults.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => goToPost(post.slug)}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors group"
                  >
                    {/* Featured Image */}
                    {post.featuredImageUrl && (
                      <div className="w-16 h-12 relative rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={post.featuredImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      
                      {/* Categories */}
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {post.categoryNames.slice(0, 2).map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>

                      {/* Excerpt */}
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {post.plainTextExcerpt}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{post.formattedDate}</span>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </div>
                ))}
              </div>

              {/* Show more results button */}
              {searchResults.length > 5 && (
                <div className="pt-3 border-t">
                  <Button
                    variant="outline"
                    onClick={goToFullSearch}
                    className="w-full flex items-center gap-2"
                  >
                    View all {searchResults.length} results
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Empty State - when no search has been made */}
          {searchResults.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="mb-2">Start typing to search posts...</p>
                <Button
                  variant="outline"
                  onClick={goToFullSearch}
                  className="flex items-center gap-2 mx-auto"
                >
                  Go to advanced search
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground border-t pt-3 flex items-center justify-between">
          <span>Click results to view • ESC to close</span>
          <span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘K</kbd> to open
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchModal;