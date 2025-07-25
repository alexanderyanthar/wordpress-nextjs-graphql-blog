import { stripHtml, createExcerpt, formatPostDate, calculateReadingTime } from './utils';

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

export const transformPost = (post: any): TransformedPost => {
  const categoryNames = post?.categories?.nodes?.map((cat: any) => cat.name) || [];
  const tagNames = post?.tags?.nodes?.map((tag: any) => tag.name) || [];
  const featuredImageUrl = post?.featuredImage?.node?.sourceUrl;

  return {
    id: post.id,
    title: post.title || '',
    content: post.content || '',
    excerpt: post.excerpt || '',
    plainTextExcerpt: createExcerpt(post.content || post.excerpt || '', 160),
    slug: post.slug || '',
    date: post.date || '',
    formattedDate: formatPostDate(post.date || ''),
    readingTime: calculateReadingTime(post.content || ''),
    categoryNames,
    tagNames,
    featuredImageUrl,
  };
};

// Transform category for display
export interface TransformedCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
}

export const transformCategory = (category: any): TransformedCategory => {
  return {
    id: category.id || '',
    name: category.name || '',
    slug: category.slug || '',
    count: category.count || 0,
    description: stripHtml(category.description || ''),
  };
};

// Transform posts array
export const transformPosts = (posts: any[]): TransformedPost[] => {
  return posts.filter(Boolean).map(transformPost);
};

// Transform categories array
export const transformCategories = (categories: any[]): TransformedCategory[] => {
  return categories.filter(Boolean).map(transformCategory);
};
