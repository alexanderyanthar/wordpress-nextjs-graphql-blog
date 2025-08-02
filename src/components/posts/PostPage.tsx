import { ReactNode } from 'react';
import { TransformedPost } from '@/lib/graphql/transformers';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Clock, Calendar } from 'lucide-react';

interface PostPageProps {
  post: TransformedPost;
  children?: ReactNode;
}

export function PostPage({ post, children }: PostPageProps) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Post Header */}
      <header className="mb-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          {post.title}
        </h1>
        
        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.date} className="text-sm">
              {post.formattedDate}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{post.readingTime} min read</span>
          </div>
        </div>
        
        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {post.categoryNames.map((categoryName, index) => (
            <span
              key={`category-${index}`}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {categoryName}
            </span>
          ))}
          {post.tagNames.slice(0, 5).map((tagName, index) => (
            <span
              key={`tag-${index}`}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              #{tagName}
            </span>
          ))}
          {post.tagNames.length > 5 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
              +{post.tagNames.length - 5} more
            </span>
          )}
        </div>
        
        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="mb-8 relative aspect-video w-full">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover rounded-xl shadow-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
        )}
        
        <Separator className="my-8" />
      </header>
      
      {/* Post Content Area */}
      <div className="prose prose-lg prose-slate max-w-none">
        {children}
      </div>
    </article>
  );
}