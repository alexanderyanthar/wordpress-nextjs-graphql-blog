# WordPress GraphQL Schema Documentation
## Core Query Types

### Posts
- `posts(first: Int, after: String, where: RootQueryToPostConnectionWhereArgs)` - Get multiple posts
- `post(id: ID!)` - Get post by ID
- `postBy(uri: String, slug: String, postId: Int)` - Get post by identifier

### Categories  
- `categories(first: Int, after: String)` - Get all categories
- `category(id: ID!)` - Get category by ID

### Tags
- `tags(first: Int, after: String)` - Get all tags
- `tag(id: ID!)` - Get tag by ID

## Important Post Fields
- `id` - Unique identifier
- `title` - Post title (rendered HTML)
- `content` - Post content (rendered HTML)
- `excerpt` - Post excerpt (rendered HTML)
- `slug` - URL slug
- `date` - Publication date
- `author` - Author information
- `featuredImage` - Featured image data
- `categories` - Associated categories
- `tags` - Associated tags

## Connection Types (Pagination)
- `nodes` - Array of items
- `pageInfo` - Pagination metadata
  - `hasNextPage` - Boolean
  - `hasPreviousPage` - Boolean
  - `startCursor` - String
  - `endCursor` - String

## Tested Query Patterns
- Basic post lists work with `posts(first: N)`
- Single posts work with `postBy(slug: "post-slug")`
- Use cursor-based pagination with `after` parameter
- Categories and tags load efficiently with `nodes` pattern
