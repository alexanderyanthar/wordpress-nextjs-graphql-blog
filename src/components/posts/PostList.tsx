'use client';

import { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PostCard from './PostCard';
import { Pagination, LoadMorePagination } from './Pagination';
import { usePaginatedPosts, useInfiniteScroll } from '@/lib/graphql/pagination-hooks';
import { useLoadingState } from '@/lib/graphql/loading-hooks';
import { GraphQLError } from '@/components/errors/GraphQLError';
import { PostSkeletons } from '@/components/loading/PostSkeletons';

interface PostListProps {
  categoryId?: string;
  tagId?: string;
  search?: string;
  pageSize?: number;
  enableInfiniteScroll?: boolean;
  paginationType?: 'pagination' | 'loadMore' | 'infinite';
  showPageSizeSelector?: boolean;
}

export function PostList({
  categoryId,
  tagId,
  search,
  pageSize = 12,
  enableInfiniteScroll = false,
  paginationType = 'loadMore',
  showPageSizeSelector = false,
}: PostListProps) {
  const {
    posts,
    loading,
    error,
    hasNextPage,
    isLoadingMore,
    totalCount,
    loadMorePosts,
    resetPagination,
  } = usePaginatedPosts({
    pageSize,
    categoryId,
    tagId,
    search,
  });

  const loadingState = useLoadingState(loading, error || null, posts, isLoadingMore);
  
  const { handleScroll, resetFetching } = useInfiniteScroll(
    loadMorePosts,
    hasNextPage,
    isLoadingMore
  );

  // Set up infinite scroll
  useEffect(() => {
    if (enableInfiniteScroll || paginationType === 'infinite') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [enableInfiniteScroll, paginationType, handleScroll]);

  // Reset fetching state when loading completes
  useEffect(() => {
    if (!isLoadingMore) {
      resetFetching();
    }
  }, [isLoadingMore, resetFetching]);

  // Handle page size changes
  const handlePageSizeChange = (_newPageSize: number) => {
    // You might want to add this functionality to your hook
    // For now, we'll just reset pagination
    resetPagination();
  };

  // Handle navigation - for now these will work with your existing loadMorePosts
  const handleNextPage = () => {
    loadMorePosts();
  };

  const handlePreviousPage = () => {
    // This would need to be implemented in your hook for true previous page functionality
    // For now, we'll just reset to beginning
    resetPagination();
  };

  // Create pageInfo object for the Pagination component
  const pageInfo = {
    hasNextPage,
    hasPreviousPage: false, // You'd need to track this in your hook
    startCursor: null,
    endCursor: null,
  };

  // Error state
  if (loadingState.isError && error) {
    return (
      <GraphQLError 
        error={error}
        onRetry={resetPagination}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Posts Grid */}
      {loadingState.isLoading ? (
        <PostSkeletons count={pageSize} variant="card" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Loading More Skeletons */}
      {loadingState.isLoadingMore && (
        <PostSkeletons count={3} variant="card" />
      )}

      {/* Pagination Component */}
      {paginationType === 'pagination' && !loadingState.isLoading && posts.length > 0 && (
        <Pagination
          pageInfo={pageInfo}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          onPageSizeChange={showPageSizeSelector ? handlePageSizeChange : undefined}
          loading={loading}
          isLoadingMore={isLoadingMore}
          currentPageSize={pageSize}
          totalCount={totalCount}
        />
      )}

      {/* Load More Pagination Component */}
      {paginationType === 'loadMore' && !loadingState.isLoading && (
        <LoadMorePagination
          hasNextPage={hasNextPage}
          onLoadMore={loadMorePosts}
          loading={loading}
          isLoadingMore={isLoadingMore}
        />
      )}

      {/* Original Load More Button (keeping for backward compatibility) */}
      {!enableInfiniteScroll && paginationType !== 'pagination' && paginationType !== 'loadMore' && hasNextPage && !loadingState.isLoading && (
        <div className="flex justify-center">
          <Button
            onClick={loadMorePosts}
            disabled={loadingState.isLoadingMore}
            variant="outline"
            size="lg"
          >
            {loadingState.isLoadingMore ? 'Loading...' : 'Load More Posts'}
          </Button>
        </div>
      )}

      {/* End of Posts Message */}
      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You&apos;ve reached the end of the posts!</p>
        </div>
      )}

      {/* Empty State */}
      {loadingState.isEmpty && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found.</p>
            {(search || categoryId || tagId) && (
              <p className="text-gray-400 mt-2">Try adjusting your filters.</p>
            )}
          </CardContent>
        </Card>
      )}
      
    </div>
  );
}