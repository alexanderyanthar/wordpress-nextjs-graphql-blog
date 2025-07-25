'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedPosts, useInfiniteScroll } from '@/lib/graphql/pagination-hooks';
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
  } = usePaginatedPosts({
    pageSize,
    categoryId,
    tagId,
    search,
  });

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

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error.message}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {/* Loading Skeletons */}
        {(loading || isLoadingMore) && (
          <>
            {[...Array(pageSize)].map((_, i) => (
              <PostCardSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        )}
      </div>

      {/* Load More Button (if not using infinite scroll) */}
      {!enableInfiniteScroll && hasNextPage && (
        <div className="flex justify-center">
          <Button
            onClick={loadMorePosts}
            disabled={isLoadingMore}
            variant="outline"
            size="lg"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Posts'}
          </Button>
        </div>
      )}

      {/* No More Posts Message */}
      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You've reached the end of the posts!</p>
        </div>
      )}

      {/* No Posts Found */}
      {!loading && posts.length === 0 && (
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

// Individual Post Card Component
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
      <CardHeader>
        <div className="flex flex-wrap gap-1 mb-2">
          {post.categoryNames.slice(0, 2).map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-lg line-clamp-2 hover:text-blue-600 transition-colors">
          {post.title}
        </CardTitle>
        <CardDescription>
          {post.formattedDate} • {post.readingTime} min read
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">
          {post.plainTextExcerpt}
        </p>
        <Button variant="outline" size="sm" className="w-full">
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton Component
function PostCardSkeleton() {
  return (
    <Card>
      <div className="aspect-video">
        <Skeleton className="w-full h-full rounded-t-lg" />
      </div>
      <CardHeader>
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-16 w-full mb-4" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}
