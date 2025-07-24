'use client';
import { useGetPostsQuery } from '@/types/generated/graphql';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { loading, error, data } = useGetPostsQuery({
    variables: { first: 3 }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">WordPress GraphQL Blog</h1>
        
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>GraphQL Code Generation Test</CardTitle>
            <CardDescription>Typed posts from WordPress via GraphQL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data?.posts?.nodes?.map((post) => (
                <div key={post?.id} className="p-2 border rounded">
                  <h3 className="font-semibold">{post?.title}</h3>
                  <p className="text-sm text-gray-600">{post?.slug}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
