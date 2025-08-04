import { gql } from '@apollo/client';

// Core post fragment with minimal fields (for lists/cards)
export const POST_CORE_FIELDS = gql`
  fragment PostCoreFields on Post {
    id
    databaseId
    title
    slug
    date
  }
`;

// Post fragment with essential fields (existing, but optimized)
export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    databaseId
    title
    excerpt
    slug
    date
    modified
    commentCount
    status
  }
`;

// Post fragment with content (optimized for single post pages)
export const POST_CONTENT_FIELDS = gql`
  fragment PostContentFields on Post {
    id
    databaseId
    title
    content
    excerpt
    slug
    date
    modified
    commentCount
    commentStatus
    status
  }
`;

// Lightweight category fragment (for filters/lists)
export const CATEGORY_CORE_FIELDS = gql`
  fragment CategoryCoreFields on Category {
    id
    databaseId
    name
    slug
  }
`;

// Full category fragment (existing, optimized)
export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    databaseId
    name
    slug
    count
    description
    uri
  }
`;

// Lightweight tag fragment (for filters/lists)
export const TAG_CORE_FIELDS = gql`
  fragment TagCoreFields on Tag {
    id
    databaseId
    name
    slug
  }
`;

// Full tag fragment (existing, optimized)
export const TAG_FIELDS = gql`
  fragment TagFields on Tag {
    id
    databaseId
    name
    slug
    count
    description
    uri
  }
`;

// Minimal author fragment (for post cards)
export const AUTHOR_CORE_FIELDS = gql`
  fragment AuthorCoreFields on User {
    id
    databaseId
    name
    slug
  }
`;

// Full author fragment (existing, optimized)
export const AUTHOR_FIELDS = gql`
  fragment AuthorFields on User {
    id
    databaseId
    name
    slug
    description
    uri
    avatar {
      url
      width
      height
    }
  }
`;

// Optimized featured image fragment with responsive sizes
export const FEATURED_IMAGE_FIELDS = gql`
  fragment FeaturedImageFields on MediaItem {
    id
    databaseId
    sourceUrl
    altText
    caption
    mediaDetails {
      width
      height
      file
      sizes {
        name
        sourceUrl
        width
        height
      }
    }
  }
`;

// Lightweight image fragment (for thumbnails/cards)
export const IMAGE_CORE_FIELDS = gql`
  fragment ImageCoreFields on MediaItem {
    id
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

// PageInfo fragment for pagination
export const PAGE_INFO_FIELDS = gql`
  fragment PageInfoFields on WPPageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

// Connection edge fragment for cursor pagination  
export const POST_EDGE_FIELDS = gql`
  fragment PostEdgeFields on RootQueryToPostConnectionEdge {
    cursor
    node {
      id
    }
  }
`;

// SEO fields fragment (if using SEO plugins like Yoast)
export const SEO_FIELDS = gql`
  fragment SEOFields on PostTypeSEO {
    title
    metaDesc
    canonical
    opengraphTitle
    opengraphDescription
    opengraphImage {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
    twitterTitle
    twitterDescription
    twitterImage {
      sourceUrl
      altText
    }
  }
`;

// Comment fields fragment
export const COMMENT_FIELDS = gql`
  fragment CommentFields on Comment {
    id
    databaseId
    content
    date
    status
    author {
      node {
        name
        url
        avatar {
          url
        }
      }
    }
    parent {
      node {
        id
      }
    }
  }
`;

// Menu item fragment (for navigation)
export const MENU_ITEM_FIELDS = gql`
  fragment MenuItemFields on MenuItem {
    id
    databaseId
    title
    url
    target
    cssClasses
    description
    label
    linkRelationship
    menuItemId
    parentId
    childItems {
      nodes {
        id
        title
        url
        target
      }
    }
  }
`;

// Site settings fragment (for header/footer data)
export const SITE_SETTINGS_FIELDS = gql`
  fragment SiteSettingsFields on GeneralSettings {
    title
    description
    url
    language
    startOfWeek
    timezone
    dateFormat
    timeFormat
  }
`;

// Reusable post list fragment (combines common fields for post lists)
export const POST_LIST_ITEM_FIELDS = gql`
  ${POST_FIELDS}
  ${IMAGE_CORE_FIELDS}
  ${CATEGORY_CORE_FIELDS}
  ${AUTHOR_CORE_FIELDS}
  
  fragment PostListItemFields on Post {
    ...PostFields
    featuredImage {
      node {
        ...ImageCoreFields
      }
    }
    categories(first: 3) {
      nodes {
        ...CategoryCoreFields
      }
    }
    author {
      node {
        ...AuthorCoreFields
      }
    }
  }
`;

// Reusable post card fragment (optimized for card layouts)
export const POST_CARD_FIELDS = gql`
  ${POST_CORE_FIELDS}
  ${IMAGE_CORE_FIELDS}
  ${CATEGORY_CORE_FIELDS}
  
  fragment PostCardFields on Post {
    ...PostCoreFields
    excerpt
    featuredImage {
      node {
        ...ImageCoreFields
      }
    }
    categories(first: 2) {
      nodes {
        ...CategoryCoreFields
      }
    }
  }
`;

// Full post detail fragment (for single post pages)
export const POST_DETAIL_FIELDS = gql`
  ${POST_CONTENT_FIELDS}
  ${FEATURED_IMAGE_FIELDS}
  ${CATEGORY_FIELDS}
  ${TAG_FIELDS}
  ${AUTHOR_FIELDS}
  
  fragment PostDetailFields on Post {
    ...PostContentFields
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
    author {
      node {
        ...AuthorFields
      }
    }
  }
`;