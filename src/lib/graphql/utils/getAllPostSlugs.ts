import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GET_ALL_POST_SLUGS, PostSlugsQueryResult } from '../queries/single-post';


export async function getAllPostSlugs(
  client: ApolloClient<NormalizedCacheObject>
): Promise<string[]> {
  const allSlugs: string[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  try {
    while (hasNextPage) {
      const { data }: { data: PostSlugsQueryResult } = await client.query<PostSlugsQueryResult>({
        query: GET_ALL_POST_SLUGS,
        variables: {
          first: 100,
          after,
        },
        fetchPolicy: 'network-only', // Always fetch fresh data for build
      });

      if (data?.posts?.nodes) {
        const slugs = data.posts.nodes
          .map((post: { slug: string }) => post.slug)
          .filter(Boolean); // Remove any null/undefined slugs
        
        allSlugs.push(...slugs);
      }

      hasNextPage = data?.posts?.pageInfo?.hasNextPage || false;
      after = data?.posts?.pageInfo?.endCursor || null;
    }

    return allSlugs;
  } catch (error) {
    console.error('Error fetching post slugs for static generation:', error);
    // Return empty array so build doesn't fail - pages will be generated on-demand
    return [];
  }
}