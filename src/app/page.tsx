'use client';

import { useGetPostsQuery } from '@/types/generated/graphql';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { transformPosts } from '@/lib/graphql/transformers';
import { useCategories, useGraphQLError } from '@/lib/graphql/hooks';

export default function Home() {
  const { data: postsData, loading: postsLoading, error: postsError } = useGetPostsQuery({
    variables: { first: 6 }
  });

  const { categories, loading: categoriesLoading } = useCategories();
  const errorMessage = useGraphQLError(postsError);

  // Handle errors with our utility
  if (errorMessage) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{errorMessage}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transform data using our utilities
  const transformedPosts = postsData?.posts?.nodes ? transformPosts(postsData.posts.nodes) : [];

  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">WordPress GraphQL Blog</h1>
          <p className="text-gray-600">Built with Next.js, TypeScript, and GraphQL</p>
        </div>
        
        {/* Categories Section */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Browse posts by category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name} ({category.count})
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posts Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>
                      {post.formattedDate} • {post.readingTime} min read
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                      {post.plainTextExcerpt}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {post.categoryNames.map((categoryName) => (
                        <Badge key={categoryName} variant="outline" className="text-xs">
                          {categoryName}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Total posts loaded:</strong> {transformedPosts.length}</p>
              <p><strong>Total categories:</strong> {categories.length}</p>
              <p><strong>Has next page:</strong> {postsData?.posts?.pageInfo?.hasNextPage ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
