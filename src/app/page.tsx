'use client';

import { PostList } from '@/components/posts/PostList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCategories } from '@/lib/graphql/hooks';

export default function Home() {
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">WordPress GraphQL Blog</h1>
          <p className="text-gray-600 text-lg">
            Discover our latest posts with advanced pagination and filtering
          </p>
        </div>
        
        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Browse by Category</CardTitle>
            <CardDescription>Click on a category to filter posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoriesLoading ? (
                <>Loading categories...</>
              ) : (
                categories.map((category) => (
                  <Badge 
                    key={category.id} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Posts List with Pagination */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
          <PostList 
            pageSize={9}
            enableInfiniteScroll={false}
          />
        </div>
      </div>
    </main>
  );
}