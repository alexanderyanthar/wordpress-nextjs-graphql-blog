import { Metadata } from 'next';

interface PostPageProps {
  params: {
    slug: string;
  };
}

// This will be enhanced with actual post data later
export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  return {
    title: `Post: ${params.slug}`,
    description: 'Blog post content',
  };
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <main className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Post: {params.slug}
        </h1>
        <p className="text-gray-600">
          This is a placeholder for the post with slug: {params.slug}
        </p>
      </div>
    </main>
  );
}