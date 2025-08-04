import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { BatchHttpLink } from '@apollo/client/link/batch-http';

// Batch HTTP link for query batching (better performance)
const batchHttpLink = new BatchHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  batchMax: 5, // Maximum number of queries to batch
  batchInterval: 20, // Wait 20ms to batch queries
});

// Fallback HTTP link (for operations that shouldn't be batched)
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

// Auth link (for future authentication if needed)
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Add authorization header here if needed
    }
  }
});

// Error link for handling GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
    
    // Retry logic for network errors with proper type checking
    if ('statusCode' in networkError && networkError.statusCode === 500) {
      // Retry on server errors
      return forward(operation);
    }
  }
});

// Enhanced cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Posts pagination with proper merging
        posts: {
          keyArgs: ['where'], // Cache separately based on filters
          merge(existing, incoming, { args }) {
            // Handle cursor-based pagination
            if (args?.after) {
              // Merge with existing posts for "load more"
              return {
                ...incoming,
                nodes: [
                  ...(existing?.nodes || []),
                  ...(incoming?.nodes || []),
                ],
                edges: [
                  ...(existing?.edges || []),
                  ...(incoming?.edges || []),
                ],
              };
            }
            // Replace for new queries
            return incoming;
          },
        },
        
        // Categories - cache aggressively
        categories: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        
        // Tags - cache aggressively  
        tags: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    
    // Post entity normalization
    Post: {
      fields: {
        // Featured image caching
        featuredImage: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        
        // Categories relation caching
        categories: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        
        // Tags relation caching
        tags: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    
    // Category entity normalization
    Category: {
      keyFields: ['databaseId'], // Use databaseId as primary key
    },
    
    // Tag entity normalization
    Tag: {
      keyFields: ['databaseId'], // Use databaseId as primary key if available
    },
    
    // User/Author entity normalization
    User: {
      keyFields: ['databaseId'],
    },
  },
  
  // Enable result caching
  resultCaching: true,
  
  // Cache persistence (optional - enables offline support)
  ...(typeof window !== 'undefined' && {
    // Only enable in browser environment
    possibleTypes: {}, // Add your possible types here if using unions/interfaces
  }),
});

// Apollo Client instance with performance optimizations
const client = new ApolloClient({
  link: from([
    errorLink,
    authLink,
    // Use batch link for better performance
    batchHttpLink,
  ]),
  cache,
  
  // Performance-optimized default options
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      // Cache-first for frequently accessed data
      fetchPolicy: 'cache-first',
      // Reduce network requests
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
      // Cache-first for better performance
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  
  // Enable query deduplication
  queryDeduplication: true,
  
  // Connection to dev tools
  connectToDevTools: process.env.NODE_ENV === 'development',
  
  // Assume immutable cache (better performance if your data is immutable)
  assumeImmutableResults: true,
});

// Cache persistence helper (for offline support)
export const persistCache = async () => {
  if (typeof window !== 'undefined') {
    try {
      // You can implement cache persistence here
      // Example: using apollo3-cache-persist
      // await persistCache({
      //   cache,
      //   storage: window.localStorage,
      // });
    } catch (error) {
      console.warn('Cache persistence failed:', error);
    }
  }
};

// Cache utilities for manual optimization
export const cacheUtils = {
  // Clear specific query from cache
  clearQuery: (queryName: string, variables?: any) => {
    client.cache.evict({
      fieldName: queryName,
      args: variables,
    });
    client.cache.gc();
  },
  
  // Prefetch data
  prefetch: async (query: any, variables?: any) => {
    try {
      await client.query({
        query,
        variables,
        fetchPolicy: 'cache-first',
      });
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  },
  
  // Get cache size (for debugging)
  getCacheSize: () => {
    return JSON.stringify(client.cache.extract()).length;
  },
};

export default client;