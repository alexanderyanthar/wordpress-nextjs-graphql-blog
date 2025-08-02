'use client';

import React from 'react';
import { PostPage } from '@/components/posts/PostPage';
import { usePost } from '@/lib/graphql/hooks/usePost';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Loader2 } from 'lucide-react';
import PostCard from '@/components/posts/PostCard';

interface PostPageClientProps {
  slug: string;
}

export function PostPageClient({ slug }: PostPageClientProps) {
  const {
    post,
    relatedPosts,
    loading,
    relatedLoading,
    error,
    isNotFound,
    hasRelatedPosts,
    refetch,
  } = usePost({ slug, fetchRelated: true });

  // Loading state
  if (loading) {
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>Loading post...</span>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-700 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Error Loading Post</h2>
              </div>
              <p className="text-red-600 mb-4">
                There was an error loading this post. Please try again.
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
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="text-gray-600 mb-4">
                The post with slug &quot;{slug}&quot; could not be found.
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

  // Post found - render the content
  if (!post) return null;

  return (
    <main className="container mx-auto py-8">
      <PostPage post={post}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </PostPage>

      {/* Related Posts Section */}
      {hasRelatedPosts && (
        <>
          <Separator className="my-12" />
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            
            {relatedLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading related posts...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <PostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}