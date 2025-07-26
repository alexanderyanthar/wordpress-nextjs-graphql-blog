import { gql } from '@apollo/client';
import { POST_FIELDS, CATEGORY_FIELDS, TAG_FIELDS, FEATURED_IMAGE_FIELDS } from './fragments';

// Search posts with comprehensive filtering
export const SEARCH_POSTS_ADVANCED = gql`
  ${POST_FIELDS}
  ${CATEGORY_FIELDS}
  ${TAG_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  
  query SearchPostsAdvanced(
    $search: String
    $categoryIds: [ID]
    $tagIds: [ID]
    $first: Int = 10
    $after: String
  ) {
    posts(
      first: $first
      after: $after
      where: {
        search: $search
        categoryIn: $categoryIds
        tagIn: $tagIds
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

// Get search suggestions
export const GET_SEARCH_SUGGESTIONS = gql`
  query GetSearchSuggestions($search: String!, $first: Int = 5) {
    posts(
      first: $first
      where: { search: $search }
    ) {
      nodes {
        id
        title
        slug
      }
    }
    categories(
      first: $first
      where: { search: $search }
    ) {
      nodes {
        id
        databaseId
        name
        slug
      }
    }
    tags(
      first: $first
      where: { search: $search }
    ) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

// Quick search for autocomplete
export const QUICK_SEARCH = gql`
  query QuickSearch($search: String!, $first: Int = 8) {
    posts(
      first: $first
      where: { search: $search }
    ) {
      nodes {
        id
        title
        slug
        excerpt
        date
      }
    }
  }
`;
