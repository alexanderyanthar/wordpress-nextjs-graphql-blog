import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { transformCategories } from '../transformers';
import { HOMEPAGE_CATEGORY_FIELDS } from '../queries/home-page';

// Lightweight query for just categories (for SearchInput and other components)
const GET_CATEGORIES_LIGHTWEIGHT = gql`
  ${HOMEPAGE_CATEGORY_FIELDS}
  
  query GetCategoriesLightweight($first: Int = 20) {
    categories(first: $first, where: { hideEmpty: true }) {
      nodes {
        ...HomepageCategoryFields
      }
    }
  }
`;

// Lightweight hook for categories only (replaces useCategories for SearchInput)
export function useHomePageCategories(skip = false) {
  const { data, loading, error } = useQuery(GET_CATEGORIES_LIGHTWEIGHT, {
    variables: { first: 20 },
    fetchPolicy: 'cache-first',
    skip, // Skip the query if categories are provided elsewhere
  });

  return {
    categories: data?.categories?.nodes ? transformCategories(data.categories.nodes) : [],
    loading: skip ? false : loading,
    error: skip ? null : error,
  };
}