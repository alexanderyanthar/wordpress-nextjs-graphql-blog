import { useState, useCallback } from 'react';
import { useGetPostsPaginatedQuery } from '@/types/generated/graphql';
import { transformPosts } from './transformers';

export interface UsePaginatedPostsOptions {
  pageSize?: number;
  categoryId?: string;
  tagId?: string;
  search?: string;
}

export const usePaginatedPosts = (options: UsePaginatedPostsOptions = {}) => {
  const { pageSize = 12, categoryId, tagId, search } = options;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Build where clause based on options - convert string IDs to numbers
  const whereClause = {
    ...(categoryId && { categoryIn: [categoryId] }),
    ...(tagId && { tagIn: [tagId] }),
    ...(search && { search }),
  };

  const {
    data,
    loading,
    error,
    fetchMore,
    refetch,
  } = useGetPostsPaginatedQuery({
    variables: {
      first: pageSize,
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });

  const posts = data?.posts?.nodes ? transformPosts(data.posts.nodes) : [];
  const pageInfo = data?.posts?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage || false;
  const totalCount = data?.posts?.edges?.length || 0;

  const loadMorePosts = useCallback(async () => {
    if (!hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
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
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchMore, hasNextPage, isLoadingMore, pageInfo?.endCursor]);

  const resetPagination = useCallback(() => {
    // Rebuild where clause for refetch
    const refetchWhereClause = {
      ...(categoryId && { categoryIn: [categoryId] }),
      ...(tagId && { tagIn: [tagId] }),
      ...(search && { search }),
    };

    refetch({
      first: pageSize,
      after: undefined,
      where: Object.keys(refetchWhereClause).length > 0 ? refetchWhereClause : undefined,
    });
  }, [refetch, pageSize, categoryId, tagId, search]);

  return {
    posts,
    loading: loading && !isLoadingMore,
    error,
    hasNextPage,
    isLoadingMore,
    totalCount,
    loadMorePosts,
    resetPagination,
  };
};

// Hook for infinite scroll
export const useInfiniteScroll = (
  loadMore: () => void,
  hasNextPage: boolean,
  loading: boolean
) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - 1000
    ) {
      if (hasNextPage && !loading && !isFetching) {
        setIsFetching(true);
        loadMore();
      }
    }
  }, [hasNextPage, loading, isFetching, loadMore]);

  const resetFetching = useCallback(() => {
    setIsFetching(false);
  }, []);

  return {
    handleScroll,
    resetFetching,
    isFetching,
  };
};