import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import client from '@/lib/apollo-client';
import { PostPageClient } from './PostPageClient';
import { getAllPostSlugs } from '@/lib/graphql/utils/getAllPostSlugs';
import { generatePostMetadata } from '@/lib/seo/generatePostMetadata';

// Configure ISR revalidation
export const revalidate = 3600; // Revalidate every hour

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Static generation function for posts
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs(client);
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error in generateStaticParams for posts:', error);
    return []; // Return empty array so build doesn't fail
  }
}

// Enhanced metadata generation with real post data
export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata(slug);
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  // Validate slug format (optional but recommended)
  if (!slug || typeof slug !== 'string') {
    notFound();
  }

  return <PostPageClient slug={slug} />;
}