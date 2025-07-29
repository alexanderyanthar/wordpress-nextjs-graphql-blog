/**
 * PostCard Component Requirements:
 * 
 * Content Display:
 * - Featured image with fallback handling
 * - Post title (clickable to full post)
 * - Post excerpt/summary
 * - Author information with avatar
 * - Publication date
 * - Reading time estimate
 * - Categories and tags
 * 
 * Interactive Features:
 * - Hover effects on card and image
 * - Clickable title and image
 * - Category/tag badges that are clickable
 * - Smooth transitions and animations
 * 
 * Responsive Design:
 * - Card layout adapts to grid system
 * - Image aspect ratio maintained
 * - Typography scales appropriately
 * - Touch-friendly on mobile
 * 
 * Data Integration:
 * - Compatible with WordPress GraphQL data
 * - Handles missing/optional fields gracefully
 * - Type-safe with TypeScript interfaces
 */

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export default function PostCard({ post }: PostCardProps) {
    return (
        <article className="group">
        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Featured Image Section */}
            <div className="aspect-video relative overflow-hidden">
            {post.featuredImageUrl ? (
                <Image
                src={post.featuredImageUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
            ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No image</span>
                </div>
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
            <CardFooter className="pt-3">
            {/* Categories */}
            <div className="flex flex-wrap gap-1">
                {post.categoryNames.slice(0, 2).map((categoryName) => (
                <Badge key={categoryName} variant="secondary" className="text-xs">
                    {categoryName}
                </Badge>
                ))}
            </div>
            </CardFooter>
        </Card>
        </article>
    )
}