import { ReactNode } from 'react';
import { TransformedCategory } from '@/lib/graphql/transformers';

interface CategoryPageProps {
  category: TransformedCategory;
  children?: ReactNode;
}

export function CategoryPage({ category, children }: CategoryPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Category Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {category.name}
        </h1>
        
        {category.description && (
          <p className="text-xl text-gray-600 mb-6 max-w-3xl">
            {category.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-gray-500">
          <span className="text-sm">
            {category.count} {category.count === 1 ? 'post' : 'posts'}
          </span>
        </div>
      </header>
      
      {/* Category Content */}
      <div>
        {children}
      </div>
    </div>
  );
}