'use client';

import { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PostCard from './PostCard';
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
}

export function PostList({
  categoryId,
  tagId,
  search,
  pageSize = 12,
  enableInfiniteScroll = false,
}: PostListProps) {
  const {
    posts,
    loading,
    error,
    hasNextPage,
    isLoadingMore,
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
    if (enableInfiniteScroll) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [enableInfiniteScroll, handleScroll]);

  // Reset fetching state when loading completes
  useEffect(() => {
    if (!isLoadingMore) {
      resetFetching();
    }
  }, [isLoadingMore, resetFetching]);

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

      {/* Load More Button */}
      {!enableInfiniteScroll && hasNextPage && !loadingState.isLoading && (
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