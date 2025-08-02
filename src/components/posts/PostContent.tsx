import { TransformedPost } from '@/lib/graphql/transformers';

interface PostContentProps {
  post: TransformedPost;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <div 
      className="prose prose-lg prose-slate max-w-none 
                 prose-headings:font-bold prose-headings:tracking-tight
                 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                 prose-p:text-gray-700 prose-p:leading-relaxed
                 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                 prose-strong:text-gray-900 prose-strong:font-semibold
                 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                 prose-pre:bg-gray-900 prose-pre:text-gray-100
                 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4
                 prose-ul:list-disc prose-ol:list-decimal
                 prose-li:text-gray-700 prose-li:leading-relaxed
                 prose-img:rounded-lg prose-img:shadow-md"
      dangerouslySetInnerHTML={{ __html: post.content }}
    />
  );
}