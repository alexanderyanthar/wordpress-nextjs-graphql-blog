import { Metadata } from 'next';
import client from '@/lib/apollo-client'; // Fix this path to your actual client
import { GET_POST_BY_SLUG, SinglePostQueryResult } from '@/lib/graphql/queries/single-post';
import { transformPost } from '@/lib/graphql/transformers';

export async function generatePostMetadata(slug: string): Promise<Metadata> {
  try {
    // Fetch post data for SEO
    const { data } = await client.query<SinglePostQueryResult>({
      query: GET_POST_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'cache-first',
    });

    if (!data?.postBy) {
      // Post not found - return basic metadata
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
      };
    }

    // Transform the post data
    const post = transformPost(data.postBy);

    // Generate SEO-optimized metadata
    const title = post.title;
    const description = post.plainTextExcerpt || post.excerpt || 'Read this post on our blog.';
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${slug}`;

    return {
      title,
      description,
      
      // Open Graph tags
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.date,
        images: post.featuredImageUrl ? [
          {
            url: post.featuredImageUrl,
            alt: title,
          }
        ] : undefined,
      },

      // Twitter Card tags
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
      },

      // Additional SEO tags
      keywords: [
        ...post.categoryNames,
        ...post.tagNames,
      ].join(', '),

      // Canonical URL
      alternates: {
        canonical: url,
      },

      // Article-specific metadata (without author)
      other: {
        'article:published_time': post.date,
        'article:modified_time': post.date,
        'article:section': post.categoryNames[0] || '',
        'article:tag': post.tagNames.join(', '),
      },
    };
  } catch (error) {
    console.error('Error generating post metadata:', error);
    
    // Fallback metadata on error
    return {
      title: `Post: ${slug.replace(/-/g, ' ')}`,
      description: `Read our post about ${slug.replace(/-/g, ' ')}`,
    };
  }
}