import { Metadata } from 'next';
import { PostPage } from '@/components/posts/PostPage';
import { TransformedPost } from '@/lib/graphql/transformers';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Placeholder post data for testing (matches your TransformedPost interface)
function createPlaceholderPost(slug: string): TransformedPost {
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  return {
    id: '1',
    title: title,
    content: `
      <p>This is sample post content for testing the post page layout. This post has the slug: <strong>${slug}</strong>.</p>
      <p>In a real implementation, this content would come from WordPress GraphQL. The content supports HTML formatting and will be rendered properly.</p>
      <h2>Sample Heading</h2>
      <p>This demonstrates how headings and paragraphs will look in the post layout.</p>
      <ul>
        <li>Sample list item one</li>
        <li>Sample list item two</li>
        <li>Sample list item three</li>
      </ul>
      <p>The layout includes proper typography styling with the prose classes.</p>
    `,
    excerpt: `This is a sample post excerpt for testing the post page layout. Post slug: ${slug}`,
    plainTextExcerpt: `This is a sample post excerpt for testing the post page layout. Post slug: ${slug}`,
    slug: slug,
    date: new Date().toISOString(),
    formattedDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    readingTime: 3,
    categoryNames: ['Technology', 'Web Development'],
    tagNames: ['React', 'Next.js', 'TypeScript'],
    featuredImageUrl: undefined, // No featured image for placeholder
  };
}

export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const post = createPlaceholderPost(slug);
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPageRoute({ params }: PostPageProps) {
  const { slug } = await params;
  const post = createPlaceholderPost(slug);

  return (
    <main className="container mx-auto py-8">
      <PostPage post={post}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </PostPage>
    </main>
  );
}