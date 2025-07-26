import { gql } from '@apollo/client';

// Post fragment with essential fields
export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    title
    excerpt
    slug
    date
    modified
  }
`;

// Post fragment with content
export const POST_CONTENT_FIELDS = gql`
  fragment PostContentFields on Post {
    id
    title
    content
    excerpt
    slug
    date
    modified
  }
`;

// Category fragment
export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    databaseId
    name
    slug
    count
    description
  }
`;

// Tag fragment
export const TAG_FIELDS = gql`
  fragment TagFields on Tag {
    id
    name
    slug
    count
    description
  }
`;

// Author fragment
export const AUTHOR_FIELDS = gql`
  fragment AuthorFields on User {
    id
    name
    slug
    description
    avatar {
      url
    }
  }
`;

// Featured image fragment
export const FEATURED_IMAGE_FIELDS = gql`
  fragment FeaturedImageFields on MediaItem {
    id
    sourceUrl
    altText
    caption
    mediaDetails {
      width
      height
      sizes {
        name
        sourceUrl
        width
        height
      }
    }
  }
`;
