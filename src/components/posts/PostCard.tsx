import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PostCardProps {
    post: {
      id: string
      title: string
      slug: string
      plainTextExcerpt: string  // Use your plainTextExcerpt instead of excerpt
      date: string
      formattedDate: string     // Use your formatted date
      readingTime: number       // Use your reading time calculation
      categoryNames: string[]   // Use your category names array
      tagNames: string[]        // Use your tag names array
      featuredImageUrl?: string // Use your featured image URL
    }
  }

  // Add useState import and create loading state component
function ImageWithLoading({ 
    src, 
    alt, 
    postSlug 
  }: { 
    src: string; 
    alt: string; 
    postSlug: string; 
  }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
  
    if (hasError) {
      return (
        <Link 
          href={`/posts/${postSlug}`} 
          className="block w-full h-full bg-gradient-to-br from-muted to-muted/70 flex items-center justify-center hover:from-muted/80 hover:to-muted/50 transition-all duration-300 group/placeholder"
        >
          <div className="text-center transform group-hover/placeholder:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 mx-auto mb-2 bg-background border border-muted-foreground/20 rounded-full flex items-center justify-center group-hover/placeholder:border-primary/30 transition-colors">
              <svg className="w-6 h-6 text-muted-foreground group-hover/placeholder:text-primary/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <span className="text-muted-foreground text-xs">Image failed to load</span>
          </div>
        </Link>
      );
    }
  
    return (
      <Link href={`/posts/${postSlug}`} className="block w-full h-full group/image">
        <div className="relative w-full h-full">
          {/* Loading skeleton - only show when loading */}
          {isLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover group-hover/image:scale-110 transition-all duration-500 ease-out ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
    );
  }

export default function PostCard({ post }: PostCardProps) {
    return (
        <article className="group">
        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Featured Image Section */}
        <div className="aspect-video relative overflow-hidden bg-muted rounded-t-lg">
            {post.featuredImageUrl ? (
                <ImageWithLoading 
                src={post.featuredImageUrl}
                alt={post.title}
                postSlug={post.slug}
                />
            ) : (
                <Link 
                href={`/posts/${post.slug}`} 
                className="block w-full h-full bg-gradient-to-br from-muted to-muted/70 flex items-center justify-center hover:from-muted/80 hover:to-muted/50 transition-all duration-300 group/placeholder"
                >
                <div className="text-center transform group-hover/placeholder:scale-105 transition-transform duration-200">
                    <div className="w-12 h-12 mx-auto mb-2 bg-background border border-muted-foreground/20 rounded-full flex items-center justify-center group-hover/placeholder:border-primary/30 transition-colors">
                    <svg className="w-6 h-6 text-muted-foreground group-hover/placeholder:text-primary/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    </div>
                    <span className="text-muted-foreground text-xs">No image available</span>
                </div>
                </Link>
            )}
        </div>

            {/* Card Header */}
            <CardHeader className="pb-3">
            <Link 
                href={`/posts/${post.slug}`} 
                className="group block"
                aria-label={`Read more about: ${post.title}`}
            >
                <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {post.title}
                </h3>
            </Link>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="pb-3 space-y-3">
                {/* Post Excerpt */}
                {post.plainTextExcerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.plainTextExcerpt}
                    </p>
                )}
                
            {/* Enhanced Meta Information */}
            <div className="space-y-2">
                {/* Primary Meta - Date and Reading Time */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <time dateTime={post.date} className="font-medium">
                    {post.formattedDate}
                    </time>
                    <div className="flex items-center">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full mx-2"></span>
                    <span className="font-medium">{post.readingTime} min read</span>
                    </div>
                </div>
                
                {/* Secondary Meta - Word Count and Post ID (for debugging, optional) */}
                <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                    {post.tagNames && post.tagNames.length > 0 && (
                    <span className="text-right">
                        {post.tagNames.length} tag{post.tagNames.length !== 1 ? 's' : ''}
                    </span>
                    )}
                </div>
            </div>
            </CardContent>

            {/* Card Footer */}
            <CardFooter className="pt-4 pb-4">
                <div className="w-full space-y-3">
                    {/* Categories Section */}
                    {post.categoryNames && post.categoryNames.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-xs font-medium text-muted-foreground">Categories:</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5">
                        {post.categoryNames.slice(0, 3).map((categoryName) => (
                            <Link
                            key={categoryName}
                            href={`/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
                            className="group"
                            >
                            <Badge 
                                variant="default" 
                                className="text-xs font-medium bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-200 cursor-pointer group-hover:scale-105 group-hover:shadow-sm transform"
                            >
                                {categoryName}
                            </Badge>
                            </Link>
                        ))}
                        
                        {post.categoryNames.length > 3 && (
                            <Badge variant="secondary" className="text-xs text-muted-foreground font-normal">
                            +{post.categoryNames.length - 3}
                            </Badge>
                        )}
                        </div>
                    </div>
                    )}
                    
                    {/* Tags Section */}
                    {post.tagNames && post.tagNames.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <span className="text-xs font-medium text-muted-foreground">Tags:</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                        {post.tagNames.slice(0, 4).map((tagName) => (
                            <Link
                            key={tagName}
                            href={`/tags/${tagName.toLowerCase().replace(/\s+/g, '-')}`}
                            className="group"
                            >
                            <Badge 
                                variant="outline" 
                                className="text-xs text-muted-foreground border-muted-foreground/40 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer group-hover:scale-105 transform font-normal"
                            >
                                #{tagName}
                            </Badge>
                            </Link>
                        ))}
                        
                        {post.tagNames.length > 4 && (
                            <span className="text-xs text-muted-foreground/70 font-normal">
                            +{post.tagNames.length - 4}
                            </span>
                        )}
                        </div>
                    </div>
                    )}

                    {/* Empty state for posts with no categories or tags */}
                    {(!post.categoryNames || post.categoryNames.length === 0) && 
                    (!post.tagNames || post.tagNames.length === 0) && (
                    <div className="text-xs text-muted-foreground/60 italic">
                        No categories or tags
                    </div>
                    )}
                </div>
            </CardFooter>
        </Card>
        </article>
    )
}