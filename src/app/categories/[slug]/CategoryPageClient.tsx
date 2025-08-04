'use client';

import React, { useState } from 'react';
import { useCategory } from '@/lib/graphql/hooks/useCategory';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Loader2, Folder, FileText, Filter, Grid, List } from 'lucide-react';
import PostCard from '@/components/posts/PostCard';
import { CategoryBreadcrumb } from '@/components/categories/CategoryBreadcrumb';
import { TransformedCategory } from '@/lib/graphql/transformers';

interface CategoryPageClientProps {
  slug: string;
}

type SortOption = 'date' | 'title' | 'popularity';
type ViewMode = 'grid' | 'list';

export function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const {
    category,
    posts,
    loading,
    error,
    isNotFound,
    hasNextPage,
    refetch,
  } = useCategory({ slug, postsPerPage: 12 });

  // Loading state
  if (loading) {
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>Loading category...</span>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-700 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Error Loading Category</h2>
              </div>
              <p className="text-red-600 mb-4">
                There was an error loading this category. Please try again.
              </p>
              <Button variant="outline" onClick={refetch}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Not found state
  if (isNotFound) {
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
              <p className="text-gray-600 mb-4">
                The category &quot;{slug}&quot; could not be found.
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Category found - render the content
  if (!category) return null;

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <CategoryBreadcrumb categoryName={category.name} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Folder className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl md:text-5xl font-bold">
                  {category.name}
                </h1>
              </div>
              
              {category.description && (
                <p className="text-xl text-gray-600 mb-6 max-w-4xl leading-relaxed">
                  {category.description}
                </p>
              )}
              
              <div className="flex items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">
                    {category.count} {category.count === 1 ? 'post' : 'posts'}
                  </span>
                </div>
              </div>
            </header>

            {/* Category Controls */}
            {posts.length > 0 && (
              <Card className="mb-8">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Filter & Sort:</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                      <div className="flex-1">
                        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Sort posts" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">Latest First</SelectItem>
                            <SelectItem value="title">Alphabetical</SelectItem>
                            <SelectItem value="popularity">Most Popular</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-1">
                        <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                          <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="View mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">
                              <div className="flex items-center gap-2">
                                <Grid className="w-4 h-4" />
                                Grid
                              </div>
                            </SelectItem>
                            <SelectItem value="list">
                              <div className="flex items-center gap-2">
                                <List className="w-4 h-4" />
                                List
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Posts Grid */}
            {posts.length > 0 ? (
              <div className="space-y-8">
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "space-y-6"
                }>
                  {posts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post}
                    />
                  ))}
                </div>
                
                {/* Load More / Pagination Placeholder */}
                {hasNextPage && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">More posts available</p>
                    <Button variant="outline" disabled>
                      Load More (Coming Soon)
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Posts Found</h2>
                  <p className="text-gray-600">
                    This category doesn&apos;t have any published posts yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategorySidebar category={category} />
          </div>
        </div>
      </div>
    </main>
  );
}

interface CategorySidebarProps {
  category: TransformedCategory; // Replace with your category type
}

function CategorySidebar({ category }: CategorySidebarProps) {
  return (
    <div className="space-y-6">
      {/* Category Stats */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Category Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Posts:</span>
              <span className="font-medium text-blue-600">{category.count}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium text-sm truncate max-w-[100px]" title={category.name}>
                {category.name}
              </span>
            </div>
            {category.description && (
              <>
                <Separator />
                <div>
                  <span className="text-gray-600 text-sm">Description:</span>
                  <p className="text-sm mt-1 text-gray-700 line-clamp-3">
                    {category.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Folder className="w-4 h-4 mr-2" />
              Browse All Categories
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Latest Posts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Related Categories Placeholder */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Related Categories</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Related categories will be displayed here once implemented.
            </p>
            {/* TODO: Add related categories query and display */}
          </div>
        </CardContent>
      </Card>

      {/* Popular Posts in Category Placeholder */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Popular in {category.name}</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Popular posts in this category will be displayed here.
            </p>
            {/* TODO: Add popular posts query and display */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}