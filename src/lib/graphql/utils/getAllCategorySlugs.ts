import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GET_ALL_CATEGORY_SLUGS, CategorySlugsResult } from '../queries/category';

export async function getAllCategorySlugs(
  client: ApolloClient<NormalizedCacheObject>
): Promise<string[]> {
  const allSlugs: string[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  try {
    while (hasNextPage) {
      const { data }: { data: CategorySlugsResult } = await client.query<CategorySlugsResult>({
        query: GET_ALL_CATEGORY_SLUGS,
        variables: {
          first: 100,
          after,
        },
        fetchPolicy: 'network-only', // Always fetch fresh data for build
      });

      if (data?.categories?.nodes) {
        const slugs = data.categories.nodes
          .map((category: { slug: string }) => category.slug)
          .filter(Boolean); // Remove any null/undefined slugs
        
        allSlugs.push(...slugs);
      }

      hasNextPage = data?.categories?.pageInfo?.hasNextPage || false;
      after = data?.categories?.pageInfo?.endCursor || null;
    }

    console.log(`📂 Found ${allSlugs.length} categories for static generation`);
    return allSlugs;
  } catch (error) {
    console.error('Error fetching category slugs for static generation:', error);
    // Return empty array so build doesn't fail - pages will be generated on-demand
    return [];
  }
}