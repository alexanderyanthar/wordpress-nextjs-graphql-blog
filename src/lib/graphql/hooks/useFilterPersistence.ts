import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from './usePostFilters';

export interface UseFilterPersistenceOptions {
  onFiltersChange?: (filters: FilterState) => void;
  debounceMs?: number;
}

export const useFilterPersistence = (options: UseFilterPersistenceOptions = {}) => {
  const { onFiltersChange, debounceMs = 300 } = options;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse filters from URL parameters
  const parseFiltersFromURL = useCallback((): FilterState => {
    const filters: FilterState = {
      searchTerm: searchParams.get('q') || '',
      selectedCategories: [],
      selectedTags: [],
      sortBy: 'date_desc',
    };

    // Parse categories
    const categoriesParam = searchParams.get('categories');
    if (categoriesParam) {
      try {
        filters.selectedCategories = categoriesParam
          .split(',')
          .map(id => parseInt(id, 10))
          .filter(id => !isNaN(id));
      } catch (error) {
        console.warn('Error parsing categories from URL:', error);
      }
    }

    // Parse tags
    const tagsParam = searchParams.get('tags');
    if (tagsParam) {
      try {
        filters.selectedTags = tagsParam.split(',').filter(Boolean);
      } catch (error) {
        console.warn('Error parsing tags from URL:', error);
      }
    }

    // Parse sort
    const sortParam = searchParams.get('sort') as FilterState['sortBy'];
    if (sortParam && ['date_desc', 'date_asc', 'title_asc', 'title_desc'].includes(sortParam)) {
      filters.sortBy = sortParam;
    }

    // Parse date range
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    if (startDate && endDate) {
      filters.dateRange = {
        start: startDate,
        end: endDate,
      };
    }

    return filters;
  }, [searchParams]);

  // Convert filters to URL parameters
  const filtersToURLParams = useCallback((filters: FilterState): URLSearchParams => {
    const params = new URLSearchParams();

    // Add search term
    if (filters.searchTerm.trim()) {
      params.set('q', filters.searchTerm.trim());
    }

    // Add categories
    if (filters.selectedCategories.length > 0) {
      params.set('categories', filters.selectedCategories.join(','));
    }

    // Add tags
    if (filters.selectedTags.length > 0) {
      params.set('tags', filters.selectedTags.join(','));
    }

    // Add sort (only if not default)
    if (filters.sortBy !== 'date_desc') {
      params.set('sort', filters.sortBy);
    }

    // Add date range
    if (filters.dateRange) {
      params.set('start_date', filters.dateRange.start);
      params.set('end_date', filters.dateRange.end);
    }

    return params;
  }, []);

  // Update URL with filters (debounced)
  const updateURL = useCallback((filters: FilterState) => {
    const params = filtersToURLParams(filters);
    const newURL = params.toString() ? `?${params.toString()}` : '';
    
    // Only update if URL actually changed
    const currentURL = window.location.search;
    if (currentURL !== newURL) {
      router.replace(newURL, { scroll: false });
    }
  }, [router, filtersToURLParams]);


  // Initialize filters from URL on mount
  const initializeFiltersFromURL = useCallback(() => {
    const filters = parseFiltersFromURL();
    onFiltersChange?.(filters);
    return filters;
  }, [parseFiltersFromURL, onFiltersChange]);

  // Persist filters to URL
  const persistFiltersToURL = useCallback((filters: FilterState) => {
    updateURL(filters);
  }, [updateURL]);

  // Clear URL parameters
  const clearURLParams = useCallback(() => {
    router.replace('', { scroll: false });
  }, [router]);

  // Get shareable URL
  const getShareableURL = useCallback((filters: FilterState): string => {
    const params = filtersToURLParams(filters);
    const baseURL = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
    return params.toString() ? `${baseURL}?${params.toString()}` : baseURL;
  }, [filtersToURLParams]);

  // Check if URL has filter parameters
  const hasURLFilters = useCallback((): boolean => {
    return searchParams.toString().length > 0;
  }, [searchParams]);

  return {
    // Core functions
    parseFiltersFromURL,
    initializeFiltersFromURL,
    persistFiltersToURL,
    clearURLParams,
    
    // Utility functions
    getShareableURL,
    hasURLFilters,
    
    // Current URL state
    currentSearchParams: searchParams,
  };
};

// Utility function to create filter-aware links
export const createFilteredLink = (
  basePath: string, 
  filters: Partial<FilterState>
): string => {
  const params = new URLSearchParams();

  if (filters.searchTerm?.trim()) {
    params.set('q', filters.searchTerm.trim());
  }

  if (filters.selectedCategories?.length) {
    params.set('categories', filters.selectedCategories.join(','));
  }

  if (filters.selectedTags?.length) {
    params.set('tags', filters.selectedTags.join(','));
  }

  if (filters.sortBy && filters.sortBy !== 'date_desc') {
    params.set('sort', filters.sortBy);
  }

  if (filters.dateRange) {
    params.set('start_date', filters.dateRange.start);
    params.set('end_date', filters.dateRange.end);
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

// Hook for components that need to read filters from URL without managing them
export const useFiltersFromURL = () => {
  const searchParams = useSearchParams();
  
  return {
    searchTerm: searchParams.get('q') || '',
    categories: searchParams.get('categories')?.split(',').map(Number).filter(Boolean) || [],
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    sort: (searchParams.get('sort') as FilterState['sortBy']) || 'date_desc',
    startDate: searchParams.get('start_date') || '',
    endDate: searchParams.get('end_date') || '',
  };
};