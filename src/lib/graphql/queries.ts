import { gql } from '@apollo/client';
import { 
  POST_FIELDS, 
  POST_CONTENT_FIELDS,
  CATEGORY_FIELDS,
  TAG_FIELDS,
  AUTHOR_FIELDS,
  FEATURED_IMAGE_FIELDS 
} from './fragments';

// Get posts with essential fields
export const GET_POSTS = gql`
  ${POST_FIELDS}
  ${CATEGORY_FIELDS}
  ${TAG_FIELDS}
  
  query GetPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        ...PostFields
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

// Get single post by slug with full content
export const GET_POST_BY_SLUG = gql`
  ${POST_CONTENT_FIELDS}
  ${CATEGORY_FIELDS}
  ${TAG_FIELDS}
  ${AUTHOR_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      ...PostContentFields
      author {
        node {
          ...AuthorFields
        }
      }
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
  }
`;

// Get all categories
export const GET_CATEGORIES = gql`
  ${CATEGORY_FIELDS}
  
  query GetCategories($first: Int = 100) {
    categories(first: $first) {
      nodes {
        ...CategoryFields
      }
    }
  }
`;

// Get all tags
export const GET_TAGS = gql`
  ${TAG_FIELDS}
  
  query GetTags($first: Int = 100) {
    tags(first: $first) {
      nodes {
        ...TagFields
      }
    }
  }
`;

// Search posts
export const SEARCH_POSTS = gql`
  ${POST_FIELDS}
  ${CATEGORY_FIELDS}
  
  query SearchPosts($search: String!, $first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: { search: $search }) {
      nodes {
        ...PostFields
        categories {
          nodes {
            ...CategoryFields
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
