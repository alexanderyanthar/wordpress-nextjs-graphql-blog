/**
 * Header Component Requirements:
 * 
 * Desktop Layout:
 * - Logo/Brand (text-based, clickable to home)
 * - Navigation menu (Home, Posts, Categories, About)
 * - Theme toggle button (dark/light mode)
 * - Search functionality (future enhancement)
 * 
 * Mobile Layout:
 * - Logo/Brand
 * - Hamburger menu button
 * - Mobile slide-out menu with navigation items
 * - Theme toggle in mobile menu
 * 
 * Responsive Behavior:
 * - Desktop navigation visible on md+ screens
 * - Mobile hamburger menu visible on sm and below
 * - Smooth transitions between states
 * - Accessible keyboard navigation
 * 
 * Technologies:
 * - shadcn/ui NavigationMenu for desktop
 * - shadcn/ui Sheet for mobile menu
 * - shadcn/ui Button for interactions
 * - Next.js Link for navigation
 * - Lucide React for icons
 */

/**
 * Breakpoint Strategy:
 * - Mobile: < 768px (sm and below)
 * - Desktop: >= 768px (md and above)
 * 
 * Layout Priorities:
 * 1. Logo always visible and prominent
 * 2. Navigation accessible on all screen sizes
 * 3. Theme toggle easily accessible
 * 4. Clean, uncluttered design
 */

import { Button } from "@/components/ui/button"
import { Sheet } from "@/components/ui/sheet"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  // Props will be added as we build the component
}

// Navigation items configuration
const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Posts', href: '/posts' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
]

export default function Header({}: HeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Simple test content */}
            <div className="flex items-center space-x-2">
                <Link 
                href="/" 
                className="text-xl md:text-2xl font-bold text-foreground hover:text-primary hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1"
            >
                    Your Blog Name
                </Link>
            </div>
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <nav className="flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent hover:bg-opacity-50 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </NavigationMenu>
          <Button variant="outline" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}