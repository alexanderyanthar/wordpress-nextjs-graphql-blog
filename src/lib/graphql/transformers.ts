import { stripHtml, createExcerpt, formatPostDate, calculateReadingTime } from './utils';
import type { GetPostsPaginatedQuery, GetCategoriesQuery } from '@/types/generated/graphql';

// WordPress GraphQL response interfaces
type WordPressPost = NonNullable<GetPostsPaginatedQuery['posts']>['nodes'][0];
type WordPressCategory = NonNullable<GetCategoriesQuery['categories']>['nodes'][0];

// Transform WordPress post for display
export interface TransformedPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  plainTextExcerpt: string;
  slug: string;
  date: string;
  formattedDate: string;
  readingTime: number;
  categoryNames: string[];
  tagNames: string[];
  featuredImageUrl?: string;
}

export const transformPost = (post: WordPressPost): TransformedPost => {
  const categoryNames = post?.categories?.nodes?.map((cat) => cat.name || '') || [];
  const tagNames = post?.tags?.nodes?.map((tag) => tag.name || '') || [];
  const featuredImageUrl = post?.featuredImage?.node?.sourceUrl || undefined;
  
  // Handle missing content field with proper typing
  const content: string = ('content' in post && typeof post.content === 'string') ? post.content : '';
  
  return {
    id: post.id,
    title: post.title || '',
    content: content,
    excerpt: post.excerpt || '',
    plainTextExcerpt: createExcerpt(content || post.excerpt || '', 160),
    slug: post.slug || '',
    date: post.date || '',
    formattedDate: formatPostDate(post.date || ''),
    readingTime: calculateReadingTime(content || ''),
    categoryNames: categoryNames.filter(Boolean),
    tagNames: tagNames.filter(Boolean),
    featuredImageUrl,
  };
};
// Transform category for display
export interface TransformedCategory {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count: number;
  description: string;
}

export const transformCategory = (category: WordPressCategory): TransformedCategory => {
  return {
    id: category.id || '',
    databaseId: category.databaseId || 0,
    name: category.name || '',
    slug: category.slug || '',
    count: category.count || 0,
    description: stripHtml(category.description || ''),
  };
};

// Transform posts array
export const transformPosts = (posts: WordPressPost[]): TransformedPost[] => {
  return posts.filter(Boolean).map(transformPost);
};

// Transform categories array
export const transformCategories = (categories: WordPressCategory[]): TransformedCategory[] => {
  return categories.filter(Boolean).map(transformCategory);
};