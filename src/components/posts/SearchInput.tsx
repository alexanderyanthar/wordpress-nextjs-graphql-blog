'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Filter } from "lucide-react";
import { useAdvancedSearch, useSearchInput } from '@/lib/graphql/search-hooks';
import { useHomePageCategories } from '@/lib/graphql/hooks/useHomePageCategories';
import { TransformedPost, TransformedCategory } from '@/lib/graphql/transformers';

interface SearchInputProps {
  onSearchResults?: (results: TransformedPost[]) => void;
  placeholder?: string;
  showFilters?: boolean;
  categories?: TransformedCategory[];
  initialSearchTerm?: string;  // ADD THIS LINE
}

// Enhanced SearchItem interface to handle different item types
// Export the interface so other files can use it
export interface SearchItem {
  id: string;
  type: 'post' | 'category' | 'tag';
  title?: string;
  name?: string;
  databaseId?: number;
}

export function SearchInput({ 
  onSearchResults, 
  placeholder = "Search posts...",
  showFilters = true,
  categories: categoriesProp,
  initialSearchTerm = ''  // ADD THIS LINE
}: SearchInputProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    searchResults,
    loading,
    suggestions,
    suggestionsLoading,
    hasActiveFilters,
    clearSearch,
    toggleCategory,
  } = useAdvancedSearch({
    enableSuggestions: true,
    initialSearchTerm,  // ADD THIS LINE
  });

  const {
    isOpen,
    setIsOpen,
    highlightedIndex,
    handleKeyDown,
  } = useSearchInput((item: SearchItem) => {
    if (item.type === 'category') {
      // Use databaseId if available, otherwise convert string id to number
      const categoryId = item.databaseId || Number(item.id);
      toggleCategory(categoryId);
      setSearchTerm('');
    } else {
      // For posts, use title; for tags, use name
      const displayText = item.title || item.name || '';
      setSearchTerm(displayText);
    }
    setIsOpen(false);
  });

  // NEW: Skip fetching categories if provided via props
  const { categories: fetchedCategories } = useHomePageCategories(!!categoriesProp);
  
  // Use provided categories or fallback to fetched ones
  const categories = categoriesProp || fetchedCategories;

  // Update parent component with results
  useEffect(() => {
    onSearchResults?.(searchResults);
  }, [searchResults, onSearchResults]);

  // Show suggestions when typing
  const showSuggestions = isOpen && searchTerm.length >= 2 && !loading;
  
  // Create properly typed suggestions array
  const allSuggestions: SearchItem[] = [
    ...suggestions.posts.map((p: TransformedPost) => ({ 
      id: p.id,
      title: p.title,
      type: 'post' as const 
    })),
    ...suggestions.categories.map((c: { id: string; name: string; databaseId?: number }) => ({ 
      id: c.id,
      name: c.name,
      databaseId: c.databaseId,
      type: 'category' as const 
    })),
    ...suggestions.tags.map((t: { id: string; name: string }) => ({ 
      id: t.id,
      name: t.name,
      type: 'tag' as const 
    })),
  ].slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={(e) => handleKeyDown(e, allSuggestions)}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-20"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {showFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`h-7 w-7 p-0 ${hasActiveFilters ? 'text-blue-600' : ''}`}
              >
                <Filter className="h-3 w-3" />
              </Button>
            )}
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
            <CardContent className="p-2">
              {suggestionsLoading ? (
                <div className="p-2 text-sm text-gray-500">Loading suggestions...</div>
              ) : allSuggestions.length > 0 ? (
                <div className="space-y-1">
                  {allSuggestions.map((item, index) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className={`p-2 rounded cursor-pointer text-sm ${
                        index === highlightedIndex 
                          ? 'bg-gray-100' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        if (item.type === 'category') {
                          const categoryId = item.databaseId || Number(item.id);
                          toggleCategory(categoryId);
                          setSearchTerm('');
                        } else {
                          const displayText = item.title || item.name || '';
                          setSearchTerm(displayText);
                        }
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.title || item.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 text-sm text-gray-500">No suggestions found</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Category Filters */}
            <div>
              <h4 className="font-medium mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategories.includes(category.databaseId) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      toggleCategory(category.databaseId);
                    }}
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div>
                <h4 className="font-medium mb-2">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary">
                      Search: &quot;{searchTerm}&quot;
                    </Badge>
                  )}
                  {selectedCategories.map((categoryId) => {
                    const category = categories.find(c => c.databaseId === categoryId);
                    return category ? (
                      <Badge key={categoryId} variant="secondary">
                        Category: {category.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Status */}
      {loading && (
        <div className="text-sm text-gray-500">Searching...</div>
      )}
      
      {hasActiveFilters && !loading && (
        <div className="text-sm text-gray-600">
          Found {searchResults.length} post{searchResults.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}