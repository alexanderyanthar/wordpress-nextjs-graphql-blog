module.exports = {
    schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://wordpress-graphql-blog.local/graphql',
    documents: ['src/**/*.{ts,tsx}', 'src/lib/graphql/**/*.{ts,tsx}'],
    generates: {
      'src/types/generated/graphql.ts': {
        plugins: [
          'typescript',
          'typescript-operations',
          'typescript-react-apollo',
        ],
        config: {
          withHooks: true,
          withComponent: false,
          withHOC: false,
        },
      },
      'src/types/generated/introspection.json': {
        plugins: ['introspection'],
      },
    },
  };
  