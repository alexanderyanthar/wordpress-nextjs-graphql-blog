import { Metadata } from 'next';
import client from '@/lib/apollo-client';
import { getAllCategorySlugs } from '@/lib/graphql/utils/getAllCategorySlugs';
import { generateCategoryMetadata } from '@/lib/seo/generateCategoryMetadata';
import { CategoryPageClient } from './CategoryPageClient';

// Configure ISR revalidation
export const revalidate = 7200; // Revalidate every 2 hours

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Static generation function
export async function generateStaticParams() {
  try {
    const slugs = await getAllCategorySlugs(client);
    console.log(`🏗️  Generating static params for ${slugs.length} categories`);
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error in generateStaticParams for categories:', error);
    return []; // Return empty array so build doesn't fail
  }
}

// Enhanced metadata generation with real category data
export async function generateMetadata(
  { params }: CategoryPageProps
): Promise<Metadata> {
  const { slug } = await params;
  return generateCategoryMetadata(slug);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}