import { useQuery } from '@apollo/client';
import { GET_POST_BY_SLUG, GET_RELATED_POSTS, SinglePostQueryResult, RelatedPostsQueryResult } from '../queries/single-post';
import { transformPost, transformPosts } from '../transformers';
import { TransformedPost } from '../transformers';

interface UsePostOptions {
  slug: string;
  fetchRelated?: boolean;
}

interface UsePostReturn {
  // Post data
  post: TransformedPost | null;
  relatedPosts: TransformedPost[];
  
  // Loading states
  loading: boolean;
  relatedLoading: boolean;
  
  // Error states
  error: any;
  relatedError: any;
  
  // Helpers
  isNotFound: boolean;
  hasRelatedPosts: boolean;
  
  // Actions
  refetch: () => void;
}

export function usePost({ slug, fetchRelated = true }: UsePostOptions): UsePostReturn {
  // Fetch main post
  const { 
    data, 
    loading, 
    error, 
    refetch 
  } = useQuery<SinglePostQueryResult>(GET_POST_BY_SLUG, {
    variables: { slug },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  // Transform the post data
  const post = data?.postBy ? transformPost(data.postBy) : null;
  const isNotFound = !loading && !error && !post;

  // Get category IDs for related posts
  const categoryIds = data?.postBy?.categories?.nodes?.map(cat => cat.id) || [];
  const postId = data?.postBy?.id;

  // Fetch related posts (only if we have a post and categories)
  const shouldFetchRelated = fetchRelated && !!post && categoryIds.length > 0 && !!postId;
  
  const {
    data: relatedData,
    loading: relatedLoading,
    error: relatedError,
  } = useQuery<RelatedPostsQueryResult>(GET_RELATED_POSTS, {
    variables: {
      categoryIds,
      excludePostId: postId,
      first: 3,
    },
    skip: !shouldFetchRelated,
    fetchPolicy: 'cache-first',
  });

  // Transform related posts
  const relatedPosts = relatedData?.posts?.nodes ? transformPosts(relatedData.posts.nodes) : [];

  return {
    // Post data
    post,
    relatedPosts,
    
    // Loading states
    loading,
    relatedLoading: shouldFetchRelated ? relatedLoading : false,
    
    // Error states
    error,
    relatedError: shouldFetchRelated ? relatedError : null,
    
    // Helpers
    isNotFound,
    hasRelatedPosts: relatedPosts.length > 0,
    
    // Actions
    refetch,
  };
}

// Simplified hook for just getting a post (no related posts)
export function usePostOnly(slug: string) {
  return usePost({ slug, fetchRelated: false });
}

// Hook for getting post slugs (for static generation)
export function usePostSlugs() {
  // This would be used for generateStaticParams
  // We'll implement this in the next step
  return {
    slugs: [],
    loading: false,
    error: null,
  };
}