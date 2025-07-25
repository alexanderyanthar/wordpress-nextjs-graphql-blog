'use client';

import { useGetPostsQuery, useGetCategoriesQuery } from '@/types/generated/graphql';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { loading: postsLoading, error: postsError, data: postsData } = useGetPostsQuery({
    variables: { first: 5 }
  });

  const { loading: categoriesLoading, data: categoriesData } = useGetCategoriesQuery();

  if (postsLoading) return <p>Loading posts...</p>;
  if (postsError) return <p>Error loading posts: {postsError.message}</p>;

  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">WordPress GraphQL Blog</h1>
        
        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Available post categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoriesData?.categories?.nodes?.map((category) => (
                <Badge key={category?.id} variant="secondary">
                  {category?.name} ({category?.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Latest blog posts with fragments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {postsData?.posts?.nodes?.map((post) => (
                <div key={post?.id} className="p-4 border rounded">
                  <h3 className="font-semibold text-lg">{post?.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{post?.slug}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post?.categories?.nodes?.map((category) => (
                      <Badge key={category?.id} variant="outline" className="text-xs">
                        {category?.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">{post?.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
