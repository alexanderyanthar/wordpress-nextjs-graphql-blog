import { ReactNode } from 'react';
import { TransformedPost } from '@/lib/graphql/transformers';
import Image from 'next/image';

interface PostPageProps {
  post: TransformedPost;
  children?: ReactNode;
}

export function PostPage({ post, children }: PostPageProps) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {/* Post Meta */}
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <time dateTime={post.date}>
            {post.formattedDate}
          </time>
          <span>{post.readingTime} min read</span>
        </div>
        
        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categoryNames.map((categoryName, index) => (
            <span
              key={`category-${index}`}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
            >
              {categoryName}
            </span>
          ))}
          {post.tagNames.map((tagName, index) => (
            <span
              key={`tag-${index}`}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
            >
              #{tagName}
            </span>
          ))}
        </div>
        
        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="mb-8">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </header>
      
      {/* Post Content Area */}
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
    </article>
  );
}