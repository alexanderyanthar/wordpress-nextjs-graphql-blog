import { gql } from '@apollo/client';
import { 
  POST_FIELDS, 
  FEATURED_IMAGE_FIELDS 
} from '../fragments';

// Optimized category fragment for homepage (no description, no slug for now)
export const HOMEPAGE_CATEGORY_FIELDS = gql`
  fragment HomepageCategoryFields on Category {
    databaseId
    name
    count
  }
`;

// Optimized post fields for homepage cards
export const HOMEPAGE_POST_FIELDS = gql`
  ${POST_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  ${HOMEPAGE_CATEGORY_FIELDS}
  
  fragment HomepagePostFields on Post {
    ...PostFields
    featuredImage {
      node {
        ...FeaturedImageFields
      }
    }
    categories(first: 5) {
      nodes {
        ...HomepageCategoryFields
      }
    }
    tags(first: 3) {
      nodes {
        name
      }
    }
  }
`;

// Combined homepage query
export const HOME_PAGE_QUERY = gql`
  ${HOMEPAGE_POST_FIELDS}
  ${HOMEPAGE_CATEGORY_FIELDS}
  
  query HomePageData(
    $postsFirst: Int = 9
    $categoriesFirst: Int = 15
  ) {
    # Site settings for SEO
    generalSettings {
      title
      description
      url
      language
    }
    
    # Latest posts for homepage
    posts(
      first: $postsFirst
      where: { 
        status: PUBLISH
      }
    ) {
      nodes {
        ...HomepagePostFields
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    
    # Categories for filtering (reduced from 100 to 15)
    categories(
      first: $categoriesFirst
      where: { 
        hideEmpty: true
      }
    ) {
      nodes {
        ...HomepageCategoryFields
      }
    }
  }
`;

// Import the generated types from your GraphQL codegen
import type { GetPostsPaginatedQuery, GetCategoriesQuery } from '@/types/generated/graphql';

// Extract the proper types from your generated types
type WordPressPost = NonNullable<GetPostsPaginatedQuery['posts']>['nodes'][0];
type WordPressCategory = NonNullable<GetCategoriesQuery['categories']>['nodes'][0];

// Types matching your existing transformers
export interface HomePageQueryResult {
  generalSettings: {
    title: string;
    description: string;
    url: string;
    language: string;
  };
  featuredPosts?: {
    nodes: WordPressPost[]; // Use the actual WordPress post type
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  latestPosts?: {
    nodes: WordPressPost[]; // Use the actual WordPress post type
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  posts?: {
    nodes: WordPressPost[]; // Use the actual WordPress post type
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  categories: {
    nodes: WordPressCategory[]; // Use the actual WordPress category type
  };
}