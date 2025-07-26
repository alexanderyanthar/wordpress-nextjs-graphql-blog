'use client';

import { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePaginatedPosts, useInfiniteScroll } from '@/lib/graphql/pagination-hooks';
import { useLoadingState } from '@/lib/graphql/loading-hooks';
import { GraphQLError } from '@/components/errors/GraphQLError';
import { PostSkeletons } from '@/components/loading/PostSkeletons';
import { TransformedPost } from '@/lib/graphql/transformers';

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

  const loadingState = useLoadingState(loading, error, posts, isLoadingMore);
  
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
          <p className="text-gray-500">You've reached the end of the posts!</p>
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

// Post Card Component
function PostCard({ post }: { post: TransformedPost }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
      {post.featuredImageUrl && (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex flex-wrap gap-1 mb-3">
          {post.categoryNames.slice(0, 2).map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          {post.formattedDate} • {post.readingTime} min read
        </p>
        
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">
          {post.plainTextExcerpt}
        </p>
        
        <Button variant="outline" size="sm" className="w-full">
          Read More
        </Button>
      </div>
    </Card>
  );
}