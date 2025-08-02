import { useQuery, ApolloError } from '@apollo/client';
import { GET_CATEGORY_WITH_POSTS, CategoryWithPostsResult } from '../queries/category';
import { transformPosts, transformCategory } from '../transformers';
import { TransformedPost, TransformedCategory } from '../transformers';
import type { GetPostsPaginatedQuery, GetCategoriesQuery } from '@/types/generated/graphql';

// Extract the proper types from your generated types
type WordPressPost = NonNullable<GetPostsPaginatedQuery['posts']>['nodes'][0];
type WordPressCategory = NonNullable<GetCategoriesQuery['categories']>['nodes'][0];

interface UseCategoryOptions {
  slug: string;
  postsPerPage?: number;
}

interface UseCategoryReturn {
  // Category data
  category: TransformedCategory | null;
  posts: TransformedPost[];
  
  // Loading states
  loading: boolean;
  
  // Error states
  error: ApolloError | undefined;
  
  // Pagination
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Helpers
  isNotFound: boolean;
  
  // Actions
  refetch: () => void;
}

export function useCategory({ slug, postsPerPage = 12 }: UseCategoryOptions): UseCategoryReturn {
  const { data, loading, error, refetch } = useQuery<CategoryWithPostsResult>(
    GET_CATEGORY_WITH_POSTS,
    {
      variables: {
        slug,
        categoryName: slug, // Pass the same slug value for both variables
        first: postsPerPage,
      },
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  );

  // Transform the data using proper types
  const category = data?.category 
    ? transformCategory(data.category as WordPressCategory) 
    : null;
  const posts = data?.posts?.nodes 
    ? transformPosts(data.posts.nodes as WordPressPost[]) 
    : [];
  
  const isNotFound = !loading && !error && !category;

  return {
    // Category data
    category,
    posts,
    
    // Loading states
    loading,
    
    // Error states
    error,
    
    // Pagination
    hasNextPage: data?.posts?.pageInfo?.hasNextPage || false,
    hasPreviousPage: data?.posts?.pageInfo?.hasPreviousPage || false,
    
    // Helpers
    isNotFound,
    
    // Actions
    refetch,
  };
}