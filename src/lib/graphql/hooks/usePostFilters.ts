import { useState, useCallback, useMemo } from 'react';
import { useSearchPostsAdvancedQuery } from '@/types/generated/graphql';
import { transformPosts } from '@/lib/graphql/transformers';

export interface FilterState {
  searchTerm: string;
  selectedCategories: number[];
  selectedTags: string[];
  sortBy: 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface UsePostFiltersOptions {
  initialFilters?: Partial<FilterState>;
  pageSize?: number;
  onFilterChange?: (filters: FilterState) => void;
}

export const usePostFilters = (options: UsePostFiltersOptions = {}) => {
  const { 
    initialFilters = {},
    pageSize = 12,
    onFilterChange
  } = options;

  // Initialize filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    selectedCategories: [],
    selectedTags: [],
    sortBy: 'date_desc',
    ...initialFilters,
  });

  // Convert filter state to GraphQL variables
  const queryVariables = useMemo(() => {
    const variables: Record<string, unknown> = {
      first: pageSize,
    };

    // Add search term
    if (filterState.searchTerm.trim()) {
      variables.search = filterState.searchTerm.trim();
    }

    // Add category filters
    if (filterState.selectedCategories.length > 0) {
      variables.categoryIds = filterState.selectedCategories.map(id => id.toString());
    }

    // Add tag filters
    if (filterState.selectedTags.length > 0) {
      variables.tagIds = filterState.selectedTags;
    }

    return variables;
  }, [filterState, pageSize]);

  // Helper function to check if any filters are active
  const hasActiveFilters = useCallback((filters: FilterState) => {
    return (
      filters.searchTerm.trim() !== '' ||
      filters.selectedCategories.length > 0 ||
      filters.selectedTags.length > 0 ||
      filters.dateRange !== undefined
    );
  }, []);

  // Execute GraphQL query
  const {
    data,
    loading,
    error,
    fetchMore,
    refetch,
  } = useSearchPostsAdvancedQuery({
    variables: queryVariables,
    skip: !hasActiveFilters(filterState), // Only run query if filters are active
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });

  // Transform and sort posts
  const posts = useMemo(() => {
    if (!data?.posts?.nodes) return [];
    
    const transformedPosts = transformPosts(data.posts.nodes);
    
    // Apply client-side sorting (since GraphQL might not support all sort options)
    switch (filterState.sortBy) {
      case 'date_desc':
        transformedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date_asc':
        transformedPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'title_asc':
        transformedPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        transformedPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    
    return transformedPosts;
  }, [data, filterState.sortBy]);

  const pageInfo = data?.posts?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage || false;

  // Update filter state
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filterState, ...newFilters };
    setFilterState(updatedFilters);
    onFilterChange?.(updatedFilters);
  }, [filterState, onFilterChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      searchTerm: '',
      selectedCategories: [],
      selectedTags: [],
      sortBy: 'date_desc',
    };
    setFilterState(clearedFilters);
    onFilterChange?.(clearedFilters);
  }, [onFilterChange]);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (!hasNextPage || loading) return;

    try {
      await fetchMore({
        variables: {
          ...queryVariables,
          after: pageInfo?.endCursor,
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
    } catch (err) {
      console.error('Error loading more posts:', err);
    }
  }, [fetchMore, hasNextPage, loading, pageInfo?.endCursor, queryVariables]);

  // Reset filters and refetch
  const resetAndRefetch = useCallback(() => {
    clearFilters();
    refetch(queryVariables);
  }, [clearFilters, refetch, queryVariables]);

  // Check if any filters are active
  const isFiltered = hasActiveFilters(filterState);

  return {
    // Filter state
    filterState,
    updateFilters,
    clearFilters,
    isFiltered,
    
    // Data
    posts,
    loading,
    error,
    
    // Pagination
    hasNextPage,
    loadMorePosts,
    
    // Actions
    refetch: resetAndRefetch,
  };
};


// Helper function to build filter summary text
export function getFilterSummary(filters: FilterState): string {
  const parts: string[] = [];
  
  if (filters.searchTerm.trim()) {
    parts.push(`search: "${filters.searchTerm}"`);
  }
  
  if (filters.selectedCategories.length > 0) {
    parts.push(`${filters.selectedCategories.length} categories`);
  }
  
  if (filters.selectedTags.length > 0) {
    parts.push(`${filters.selectedTags.length} tags`);
  }
  
  if (filters.dateRange) {
    parts.push('date range');
  }
  
  return parts.length > 0 ? parts.join(', ') : 'no filters';
}