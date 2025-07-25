import { ApolloError } from '@apollo/client';

// Extract plain text from WordPress HTML content
export const stripHtml = (html: string): string => {
  if (!html) return '';
  
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
};

// Create excerpt from content
export const createExcerpt = (content: string, maxLength: number = 160): string => {
  const plainText = stripHtml(content);
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

// Format WordPress date
export const formatPostDate = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate reading time
export const calculateReadingTime = (content: string, wordsPerMinute: number = 200): number => {
  const plainText = stripHtml(content);
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Handle GraphQL errors
export const handleGraphQLError = (error: ApolloError): string => {
  if (error.networkError) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (error.graphQLErrors?.length > 0) {
    return error.graphQLErrors[0].message;
  }
  
  return error.message || 'An unexpected error occurred.';
};

// Build pagination variables
export const buildPaginationVars = (
  first: number = 10,
  after?: string | null
): { first: number; after?: string } => {
  const vars: { first: number; after?: string } = { first };
  
  if (typeof after === 'string' && after.length > 0) {
    vars.after = after;
  }
  
  return vars;
};
