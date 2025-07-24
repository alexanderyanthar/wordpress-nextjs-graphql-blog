# WordPress GraphQL Setup Notes
## Local Development URLs
- WordPress site: http://wordpress-graphql-blog.local
- WordPress admin: http://wordpress-graphql-blog.local/wp-admin
- GraphQL endpoint: http://wordpress-graphql-blog.local/graphql
- GraphiQL IDE: WordPress Admin → GraphQL → GraphiQL IDE

## Admin Credentials
- Username: admin
- Password: password

## Installed Plugins
- WPGraphQL
- WPGraphQL for Advanced Custom Fields

## Sample Content Created
- Getting Started with GraphQL and WordPress
- [List your other post titles]

## Categories Created
- Technology
- Tutorials  
- News

## Test GraphQL Query
```graphql
query GetPosts {
  posts {
    nodes {
      id
      title
      excerpt
      slug
    }
  }
}
