import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

interface PaginationProps {
  pageInfo: PaginationInfo;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
  isLoadingMore?: boolean;
  currentPageSize?: number;
  totalCount?: number;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

export function Pagination({
  pageInfo,
  onNextPage,
  onPreviousPage,
  onPageSizeChange,
  loading = false,
  isLoadingMore = false,
  currentPageSize = 12,
  totalCount,
  className = '',
}: PaginationProps) {
  const isDisabled = loading || isLoadingMore;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
      {/* Page size selector */}
      {onPageSizeChange && (
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Posts per page</p>
          <Select
            value={currentPageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            disabled={isDisabled}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Status text */}
      <div className="text-sm text-muted-foreground">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading posts...
          </div>
        ) : isLoadingMore ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more posts...
          </div>
        ) : totalCount ? (
          `Showing ${totalCount} posts`
        ) : (
          'Navigate through posts'
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={!pageInfo.hasPreviousPage || isDisabled}
          className="h-8 px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!pageInfo.hasNextPage || isDisabled}
          className="h-8 px-3"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// Simplified version for just load more functionality
export interface LoadMorePaginationProps {
  hasNextPage: boolean;
  onLoadMore: () => void;
  loading?: boolean;
  isLoadingMore?: boolean;
  className?: string;
}

export function LoadMorePagination({
  hasNextPage,
  onLoadMore,
  loading = false,
  isLoadingMore = false,
  className = '',
}: LoadMorePaginationProps) {
  if (!hasNextPage) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-sm text-muted-foreground">
          You've reached the end of the posts
        </p>
      </div>
    );
  }

  return (
    <div className={`text-center py-8 ${className}`}>
      <Button
        onClick={onLoadMore}
        disabled={loading || isLoadingMore}
        variant="outline"
        size="lg"
      >
        {isLoadingMore ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading more posts...
          </>
        ) : (
          'Load More Posts'
        )}
      </Button>
    </div>
  );
}