import { gql } from '@apollo/client';
import { 
  POST_FIELDS,           // Added this - it was missing!
  POST_CONTENT_FIELDS,
  CATEGORY_FIELDS,
  TAG_FIELDS,
  AUTHOR_FIELDS,
  FEATURED_IMAGE_FIELDS 
} from '../fragments';

// Single post query by slug
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

// Related posts query (posts in same categories)
export const GET_RELATED_POSTS = gql`
  ${POST_FIELDS}
  ${CATEGORY_FIELDS}
  ${TAG_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  
  query GetRelatedPosts(
    $categoryIds: [ID!]
    $excludePostId: ID!
    $first: Int = 3
  ) {
    posts(
      first: $first
      where: {
        categoryIn: $categoryIds
        notIn: [$excludePostId]
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
    }
  }
`;

// Types for query results
export interface SinglePostQueryResult {
  postBy: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    date: string;
    modified: string;
    author: {
      node: {
        id: string;
        name: string;
        slug: string;
        description?: string;
        avatar?: {
          url: string;
        };
      };
    } | null;
    featuredImage: {
      node: {
        id: string;
        sourceUrl: string;
        altText: string;
        caption?: string;
        mediaDetails: {
          width: number;
          height: number;
        };
      };
    } | null;
    categories: {
      nodes: Array<{
        id: string;
        databaseId: number;
        name: string;
        slug: string;
        count: number;
        description: string;
      }>;
    };
    tags: {
      nodes: Array<{
        id: string;
        name: string;
        slug: string;
        count: number;
        description: string;
      }>;
    };
  } | null;
}

// Fixed: This type should match what the query actually returns (with all fields)
export interface RelatedPostsQueryResult {
  posts: {
    nodes: Array<{
      id: string;
      title: string;
      excerpt: string;
      slug: string;
      date: string;
      modified: string;  // Added - required by your transformer
      featuredImage: {
        node: {
          id: string;         // Added - required by your transformer
          sourceUrl: string;
          altText: string;
          caption?: string;   // Added - from FeaturedImageFields
          mediaDetails: {     // Added - from FeaturedImageFields
            width: number;
            height: number;
          };
        };
      } | null;
      categories: {
        nodes: Array<{
          id: string;         // Added - from CategoryFields
          databaseId: number; // Added - from CategoryFields
          name: string;
          slug: string;       // Added - from CategoryFields
          count: number;      // Added - from CategoryFields
          description: string; // Added - from CategoryFields
        }>;
      };
      tags: {              // Added - was completely missing
        nodes: Array<{
          id: string;
          name: string;
          slug: string;
          count: number;
          description: string;
        }>;
      };
    }>;
  };
}