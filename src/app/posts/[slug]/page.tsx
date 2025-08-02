import { Metadata } from 'next';
import { PostPageClient } from './PostPageClient';
// import client from '@/lib/graphql/client'; // Fix this path
// import { getAllPostSlugs } from '@/lib/graphql/utils/getAllPostSlugs';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Static generation function (server-side only)
export async function generateStaticParams() {
  try {
    // Temporarily commented out until client import is fixed
    // const slugs = await getAllPostSlugs(client);
    // const limitedSlugs = slugs.slice(0, 50);
    // console.log(`🏗️  Generating static params for ${limitedSlugs.length} posts`);
    // return limitedSlugs.map((slug) => ({ slug }));
    
    // Temporary fallback - return empty array
    console.log('⚠️  Static generation temporarily disabled - fix client import');
    return [];
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