import { Metadata } from 'next';
import client from '@/lib/apollo-client';
import { GET_CATEGORY_WITH_POSTS, CategoryWithPostsResult } from '@/lib/graphql/queries/category';
import { transformCategory } from '@/lib/graphql/transformers';
import type { GetCategoriesQuery } from '@/types/generated/graphql';

// Extract the proper type from your generated types
type WordPressCategory = NonNullable<GetCategoriesQuery['categories']>['nodes'][0];

export async function generateCategoryMetadata(slug: string): Promise<Metadata> {
  try {
    // Fetch category data for SEO
    const { data } = await client.query<CategoryWithPostsResult>({
      query: GET_CATEGORY_WITH_POSTS,
      variables: { 
        slug, 
        categoryName: slug, // Pass the same slug value for both variables
        first: 1 
      }, // Only need category info, minimal posts
      fetchPolicy: 'cache-first',
    });

    if (!data?.category) {
      // Category not found - return basic metadata
      return {
        title: 'Category Not Found',
        description: 'The requested category could not be found.',
      };
    }

    // Transform the category data using proper type
    const category = transformCategory(data.category as WordPressCategory);

    // Generate SEO-optimized metadata
    const title = `${category.name} - Blog Category`;
    const description = category.description || `Browse all posts in the ${category.name} category. ${category.count} posts available.`;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/categories/${slug}`;

    return {
      title,
      description,
      
      // Open Graph tags
      openGraph: {
        title,
        description,
        url,
        type: 'website',
      },

      // Twitter Card tags
      twitter: {
        card: 'summary',
        title,
        description,
      },

      // Additional SEO tags
      keywords: `${category.name}, blog category, posts`,

      // Canonical URL
      alternates: {
        canonical: url,
      },

      // Additional metadata
      other: {
        'article:section': category.name,
      },
    };
  } catch (error) {
    console.error('Error generating category metadata:', error);
    
    // Fallback metadata on error
    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      title: `${categoryName} - Blog Category`,
      description: `Browse all posts in the ${categoryName} category.`,
    };
  }
}