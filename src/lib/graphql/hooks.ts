import { useGetCategoriesQuery } from '@/types/generated/graphql';
import { transformCategories } from './transformers';
import { ApolloError } from '@apollo/client';

// Custom hook for categories with caching
export const useCategories = () => {
  const { data, loading, error } = useGetCategoriesQuery({
    fetchPolicy: 'cache-first', // Cache categories as they don't change often
  });

  const transformedCategories = data?.categories?.nodes 
    ? transformCategories(data.categories.nodes)
    : [];

  return {
    categories: transformedCategories,
    loading,
    error,
  };
};

// Custom hook for error handling
export const useGraphQLError = (error: ApolloError | undefined) => {
  if (!error) return null;

  if (error.networkError) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error.graphQLErrors?.length > 0) {
    return error.graphQLErrors[0].message;
  }

  return error.message || 'An unexpected error occurred.';
};
