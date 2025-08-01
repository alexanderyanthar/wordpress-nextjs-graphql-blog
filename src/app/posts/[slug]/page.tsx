import { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// This will be enhanced with actual post data later
export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    title: `Post: ${slug}`,
    description: 'Blog post content',
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Post: {slug}
        </h1>
        <p className="text-gray-600">
          This is a placeholder for the post with slug: {slug}
        </p>
      </div>
    </main>
  );
}