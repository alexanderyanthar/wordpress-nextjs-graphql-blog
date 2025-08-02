import { useQuery, ApolloError } from '@apollo/client';
import { HOME_PAGE_QUERY, HomePageQueryResult } from '../queries/home-page';
import { transformPosts, transformCategories } from '../transformers';
import { TransformedPost, TransformedCategory } from '../transformers';

interface UseHomePageOptions {
  postsCount?: number;
  categoriesCount?: number;
}

interface UseHomePageReturn {
  // Data
  siteSettings: HomePageQueryResult['generalSettings'] | null;
  posts: TransformedPost[];
  categories: TransformedCategory[];
  
  // States
  loading: boolean;
  error: ApolloError | undefined;
  
  // Helpers
  hasMorePosts: boolean;
  
  // Actions
  refetch: () => void;
}

export function useHomePage(options: UseHomePageOptions = {}): UseHomePageReturn {
  const {
    postsCount = 9,
    categoriesCount = 15,
  } = options;

  const { data, loading, error, refetch } = useQuery<HomePageQueryResult>(HOME_PAGE_QUERY, {
    variables: {
      postsFirst: postsCount,
      categoriesFirst: categoriesCount,
    },
    fetchPolicy: 'cache-first', // Match your existing pattern
    notifyOnNetworkStatusChange: true,
  });

  // Process the data using your existing transformers
  const siteSettings = data?.generalSettings || null;
  
  // Transform categories using your existing transformer
  const categories = data?.categories?.nodes 
    ? transformCategories(data.categories.nodes)
    : [];
  
  // Transform posts using your existing transformer
  const posts = data?.posts?.nodes 
    ? transformPosts(data.posts.nodes)
    : [];

  const hasMorePosts = data?.posts?.pageInfo?.hasNextPage || false;

  return {
    // Data
    siteSettings,
    posts,
    categories,
    
    // States
    loading,
    error,
    
    // Helpers
    hasMorePosts,
    
    // Actions
    refetch,
  };
}