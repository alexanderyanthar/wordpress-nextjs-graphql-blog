import { gql } from '@apollo/client';
import { POST_FIELDS, POST_CONTENT_FIELDS, CATEGORY_FIELDS, TAG_FIELDS, AUTHOR_FIELDS, FEATURED_IMAGE_FIELDS } from './fragments';

// Get posts with pagination and advanced filtering
export const GET_POSTS_PAGINATED = gql`
  ${POST_FIELDS}
  ${CATEGORY_FIELDS}
  ${TAG_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  
  query GetPostsPaginated(
    $first: Int = 10
    $after: String
    $where: RootQueryToPostConnectionWhereArgs
  ) {
    posts(first: $first, after: $after, where: $where) {
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
      edges {
        cursor
        node {
          id
        }
      }
    }
  }
`;

// Get posts by specific category with pagination
export const GET_POSTS_BY_CATEGORY = gql`
  ${POST_FIELDS}
  ${CATEGORY_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  
  query GetPostsByCategory(
    $categoryId: ID!
    $first: Int = 10
    $after: String
  ) {
    category(id: $categoryId) {
      id
      name
      slug
      description
      count
    }
    posts(
      first: $first
      after: $after
      where: { categoryIn: [$categoryId] }
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

// Get single post with full content and related data
export const GET_FULL_POST = gql`
  ${POST_CONTENT_FIELDS}
  ${CATEGORY_FIELDS}
  ${TAG_FIELDS}
  ${AUTHOR_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  
  query GetFullPost($slug: String!) {
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
      commentCount
      commentStatus
    }
  }
`;

// Get related posts based on categories
export const GET_RELATED_POSTS = gql`
  ${POST_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  
  query GetRelatedPosts(
    $categoryIds: [ID]
    $excludeId: ID!
    $first: Int = 4
  ) {
    posts(
      first: $first
      where: {
        categoryIn: $categoryIds
        notIn: [$excludeId]
      }
    ) {
      nodes {
        ...PostFields
        featuredImage {
          node {
            ...FeaturedImageFields
          }
        }
      }
    }
  }
`;

// Get recent posts for homepage
export const GET_RECENT_POSTS = gql`
  ${POST_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  
  query GetRecentPosts($first: Int = 6) {
    posts(
      first: $first
      where: {
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        ...PostFields
        featuredImage {
          node {
            ...FeaturedImageFields
          }
        }
      }
    }
  }
`;