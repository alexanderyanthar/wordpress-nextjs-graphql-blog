'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PostSkeletonsProps {
  count?: number;
  variant?: 'card' | 'list' | 'hero';
}

export function PostSkeletons({ count = 6, variant = 'card' }: PostSkeletonsProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'hero') {
    return <PostHeroSkeleton />;
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {skeletons.map((i) => (
          <PostListSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Individual skeleton components
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
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-16 w-full mb-4" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

function PostListSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Skeleton className="h-24 w-32 flex-shrink-0 rounded" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PostHeroSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[2/1]">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-8">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-6" />
        <Skeleton className="h-20 w-full mb-6" />
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}
