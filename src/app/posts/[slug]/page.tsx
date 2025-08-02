import { Metadata } from 'next';
import { PostPageClient } from './PostPageClient';
import client from '@/lib/apollo-client';
import { getAllPostSlugs } from '@/lib/graphql/utils/getAllPostSlugs';

export const revalidate = 3600;

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Static generation function (server-side only)
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs(client);
    const limitedSlugs = slugs.slice(0, 50);
    return limitedSlugs.map((slug) => ({ slug }));
    
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// Metadata generation (server-side only)
export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  const { slug } = await params;
  
  // Basic metadata - will be enhanced later with real post data
  return {
    title: `Post: ${slug.replace(/-/g, ' ')}`,
    description: `Read our post about ${slug.replace(/-/g, ' ')}`,
  };
}

// Server component that passes params to client component
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  return <PostPageClient slug={slug} />;
}