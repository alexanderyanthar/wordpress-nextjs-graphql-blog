import { useState, useEffect, useMemo } from 'react';

export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  isEmpty: boolean;
  isLoadingMore: boolean;
}

// FIXED: Use useMemo instead of useState + useEffect to avoid infinite loops
export const useLoadingState = (
  loading: boolean,
  error: any,
  data: any,
  isLoadingMore: boolean = false
): LoadingState => {
  return useMemo(() => {
    const isEmpty = !loading && !error && (!data || (Array.isArray(data) && data.length === 0));
    
    return {
      isLoading: loading && !isLoadingMore,
      isError: !!error,
      error: error,
      isEmpty,
      isLoadingMore,
    };
  }, [loading, error, data, isLoadingMore]);
};

// Hook for managing multiple loading states
export const useMultipleLoadingStates = (states: Array<{ loading: boolean; error: any; data: any }>) => {
  return useMemo(() => {
    const anyLoading = states.some(state => state.loading);
    const anyError = states.find(state => state.error);
    const allEmpty = states.every(state => !state.loading && !state.error && (!state.data || (Array.isArray(state.data) && state.data.length === 0)));

    return {
      isLoading: anyLoading,
      isError: !!anyError,
      error: anyError?.error,
      isEmpty: allEmpty,
    };
  }, [states]);
};

// Hook for delayed loading (prevents flash of loading state)
export const useDelayedLoading = (loading: boolean, delay: number = 200) => {
  const [delayedLoading, setDelayedLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setDelayedLoading(true);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setDelayedLoading(false);
    }
  }, [loading, delay]);

  return delayedLoading;
};