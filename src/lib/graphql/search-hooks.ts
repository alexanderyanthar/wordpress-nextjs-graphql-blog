import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_POSTS_ADVANCED, GET_SEARCH_SUGGESTIONS } from './search-queries';
import { transformPosts } from './transformers';
import { SearchItem } from '@/components/posts/SearchInput';

export interface UseSearchOptions {
  debounceMs?: number;
  minSearchLength?: number;
  enableSuggestions?: boolean;
  searchMode?: 'text' | 'category' | 'tag'; // <-- add this line
}

interface SearchVariables {
  first: number;
  search?: string;
  categoryIds?: (number | string)[];
  tagIds?: (number | string)[];
}


export const useAdvancedSearch = (options: UseSearchOptions = {}) => {
  const {
    debounceMs = 500,
    minSearchLength = 2,
    enableSuggestions = true,
  } = options;

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);


  // Search query
  const [executeSearch, { data, loading, error, fetchMore }] = useLazyQuery(
    SEARCH_POSTS_ADVANCED,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );

  // Suggestions query
  const [getSuggestions, { data: suggestionsData, loading: suggestionsLoading }] = useLazyQuery(
    GET_SEARCH_SUGGESTIONS,
    {
      fetchPolicy: 'cache-first',
    }
  );

  // Execute search when parameters change
  useEffect(() => {
    const searchVars: SearchVariables = { first: 12 };

    if (debouncedSearchTerm.length >= minSearchLength) {
      searchVars.search = debouncedSearchTerm;
    }
    if (selectedCategories.length > 0) {
      searchVars.categoryIds = selectedCategories;
    }
    if (selectedTags.length > 0) {
      searchVars.tagIds = selectedTags;
    }

    const shouldSearch = Object.keys(searchVars).length > 1; // more than just 'first'

    if (shouldSearch) {
      setIsSearchActive(true);
      executeSearch({ variables: searchVars });
    } else {
      setIsSearchActive(false);
    }
  }, [debouncedSearchTerm, selectedCategories, selectedTags, minSearchLength, executeSearch]);

  // Get suggestions when typing
  useEffect(() => {
    if (enableSuggestions && searchTerm.length >= minSearchLength) {
      getSuggestions({
        variables: {
          search: searchTerm,
          first: 5,
        },
      });
    }
  }, [searchTerm, enableSuggestions, minSearchLength, getSuggestions]);

  // Transform search results
  const searchResults = useMemo(() => {
    return data?.posts?.nodes ? transformPosts(data.posts.nodes) : [];
  }, [data]);

  // Extract suggestions
  const suggestions = useMemo(() => {
    if (!suggestionsData) return { posts: [], categories: [], tags: [] };

    return {
      posts: suggestionsData.posts?.nodes || [],
      categories: suggestionsData.categories?.nodes || [],
      tags: suggestionsData.tags?.nodes || [],
    };
  }, [suggestionsData]);

  // Load more results
  const loadMoreResults = useCallback(() => {
    if (data?.posts?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: data.posts.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.posts?.nodes) return prev;

          return {
            posts: {
              ...fetchMoreResult.posts,
              nodes: [
                ...(prev.posts?.nodes || []),
                ...fetchMoreResult.posts.nodes,
              ],
            },
          };
        },
      });
    }
  }, [data?.posts?.pageInfo, fetchMore]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setIsSearchActive(false);
  }, []);

  // Toggle category filter
  const toggleCategory = useCallback((categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // Toggle tag filter
  const toggleTag = useCallback((tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      searchTerm.length >= minSearchLength ||
      selectedCategories.length > 0 ||
      selectedTags.length > 0
    );
  }, [searchTerm, selectedCategories, selectedTags, minSearchLength]);

  return {
    // Search state
    searchTerm,
    setSearchTerm,
    selectedCategories,
    selectedTags,
    isSearchActive,
    hasActiveFilters,

    // Results
    searchResults,
    loading,
    error,
    hasNextPage: data?.posts?.pageInfo?.hasNextPage || false,

    // Suggestions
    suggestions,
    suggestionsLoading,

    // Actions
    loadMoreResults,
    clearSearch,
    toggleCategory,
    toggleTag,
  };
};

// Hook for search input with autocomplete
export const useSearchInput = (onSelect?: (item: SearchItem) => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, suggestions: SearchItem[]) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          onSelect?.(suggestions[highlightedIndex]);
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [highlightedIndex, onSelect]);

  return {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
  };
};
