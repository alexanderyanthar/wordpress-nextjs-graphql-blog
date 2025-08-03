import { gql } from '@apollo/client';
import { 
  POST_FIELDS, 
  CATEGORY_FIELDS, 
  TAG_FIELDS, 
  FEATURED_IMAGE_FIELDS 
} from '../fragments';

// Get category by slug with posts
export const GET_CATEGORY_WITH_POSTS = gql`
  ${POST_FIELDS}
  ${CATEGORY_FIELDS}
  ${TAG_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  
  query GetCategoryWithPosts(
    $slug: ID!
    $categoryName: String!
    $first: Int = 12
    $after: String
  ) {
    category(id: $slug, idType: SLUG) {
      ...CategoryFields
    }
    
    posts(
      first: $first
      after: $after
      where: {
        categoryName: $categoryName
        status: PUBLISH
      }
    ) {
      nodes {
        ...PostFields
        featuredImage {
          node {
            ...FeaturedImageFields
          }
        }
        categories {
          nodes {
            ...CategoryFields
          }
        }
        tags {
          nodes {
            ...TagFields
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Get all category slugs for static generation
export const GET_ALL_CATEGORY_SLUGS = gql`
  query GetAllCategorySlugs($first: Int = 100, $after: String) {
    categories(
      first: $first
      after: $after
      where: { 
        hideEmpty: true 
      }
    ) {
      nodes {
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Types for query results
export interface CategoryWithPostsResult {
  category: {
    id: string;
    databaseId: number;
    name: string;
    slug: string;
    description?: string;
    count: number;
  } | null;
  posts: {
    nodes: unknown[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export interface CategorySlugsResult {
  categories: {
    nodes: Array<{
      slug: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}