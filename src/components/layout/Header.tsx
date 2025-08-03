"use client"

import { useState, memo, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { Menu, Search, Command } from "lucide-react"
import { ThemeToggle } from "../theme-toggle"
import { TransformedPost } from "@/lib/graphql/transformers"

// Dynamically import the enhanced search modal
const SearchModal = dynamic(() => import('./SearchModal'), { 
  ssr: false,
  loading: () => null
});

// Navigation items configuration
const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Posts', href: '/posts' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
]

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Ensure component is mounted before adding interactive features
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }, [isMobileMenuOpen])

  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  const closeSearchModal = useCallback(() => {
    setIsSearchModalOpen(false);
  }, []);

  // Handle search results from the modal - this can be empty since SearchModal handles navigation internally
  const handleSearchResults = useCallback((results: TransformedPost[], searchTerm?: string) => {
    // The enhanced SearchModal handles navigation internally
    // This callback is mainly for compatibility
  }, []);

  // Keyboard shortcut for search (Ctrl+K / Cmd+K) - only after mount
  useEffect(() => {
    if (!isMounted) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openSearchModal();
      }
      if (event.key === 'Escape' && isSearchModalOpen) {
        closeSearchModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, isSearchModalOpen, openSearchModal, closeSearchModal]);

  return (
    <>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo section */}
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

            {/* Desktop Actions (Search + Theme) */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Search Button */}
              {isMounted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openSearchModal}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden lg:inline">Search</span>
                  <Badge variant="secondary" className="hidden lg:flex text-xs">
                    <Command className="h-3 w-3 mr-1" />
                    K
                  </Badge>
                </Button>
              )}
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
    
            {/* Mobile Navigation Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetContent 
                side="right" 
                className="w-[300px] sm:w-[400px]"
                aria-labelledby="mobile-menu-title"
                aria-describedby="mobile-menu-description"
              >
                <SheetHeader>
                  <SheetTitle id="mobile-menu-title">
                    Navigation Menu
                  </SheetTitle>
                  <p id="mobile-menu-description" className="sr-only">
                    Main navigation menu for mobile devices
                  </p>
                </SheetHeader>
                <nav 
                  className="flex flex-col space-y-4 mt-6"
                  role="navigation"
                  aria-label="Mobile navigation"
                >
                  {/* Search in mobile menu */}
                  {isMounted && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openSearchModal();
                      }}
                      className="flex items-center justify-start gap-2 text-foreground"
                    >
                      <Search className="h-4 w-4" />
                      Search Posts
                    </Button>
                  )}

                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      role="menuitem"
                    >
                      {item.name}
                    </Link>
                  ))}
                    {/* Theme toggle in mobile menu */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between px-4">
                      <span className="text-sm text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
    
            {/* Mobile menu button */}
            <div className="flex items-center space-x-2 md:hidden">
              {/* Mobile Search Button */}
              {isMounted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openSearchModal}
                  aria-label="Open search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-haspopup="true"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">
                  {isMobileMenuOpen ? "Close menu" : "Open menu"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onSearchResults={handleSearchResults}
      />
    </>
  )
}

export default memo(Header)