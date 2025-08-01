import { gql } from '@apollo/client';
import { 
  POST_FIELDS, 
  CATEGORY_FIELDS, 
  TAG_FIELDS, 
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

// Types for the query result
export interface HomePageQueryResult {
  generalSettings: {
    title: string;
    description: string;
    url: string;
    language: string;
  };
  posts: {
    nodes: any[]; // Will be transformed
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
  categories: {
    nodes: any[]; // Will be transformed
  };
}