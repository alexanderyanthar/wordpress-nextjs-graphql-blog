/**
 * Footer Component Requirements:
 * 
 * Desktop Layout:
 * - Footer navigation links (Privacy, Terms, Contact, About)
 * - Social media icons section
 * - Copyright section with dynamic year
 * - Newsletter signup (future enhancement)
 * 
 * Mobile Layout:
 * - Stacked sections for better mobile experience
 * - Responsive grid layout
 * - Touch-friendly social media icons
 * 
 * Responsive Behavior:
 * - Multi-column layout on desktop
 * - Single column stack on mobile
 * - Consistent spacing and typography
 * - Accessible focus states
 * 
 * Technologies:
 * - Tailwind CSS for responsive grid
 * - Lucide React for social media icons
 * - Next.js Link for navigation
 * - shadcn/ui components where appropriate
 */

import Link from "next/link"
import { Mail, Github, Twitter, Linkedin, Facebook } from "lucide-react"

// Footer navigation items
const footerNavItems = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Contact', href: '/contact' },
    { name: 'About', href: '/about' },
  ]

// Social media links
const socialLinks = [
    { name: 'Email', href: 'mailto:hello@yourblog.com', icon: Mail },
    { name: 'GitHub', href: 'https://github.com/yourusername', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/yourusername', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/yourusername', icon: Linkedin },
    { name: 'Facebook', href: 'https://facebook.com/yourusername', icon: Facebook },
  ]

interface FooterProps {
    // Props will be added as we build the component
  }
  
export default function Footer({}: FooterProps) {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
                {/* Quick Links Section */}
                <div className="sm:col-span-2 lg:col-span-2">
                <h3 className="text-lg font-semibold text-foreground mb-4 lg:mb-6 border-b border-primary/20 pb-2">
                    Quick Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {footerNavItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="group text-sm text-muted-foreground hover:text-foreground transition-all duration-200 py-1 rounded-md hover:bg-accent/50 px-2 -mx-2"
                    >
                        <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                        {item.name}
                        </span>
                    </Link>
                    ))}
                </div>
                </div>
        
                {/* Social Media Section */}
                <div className="sm:col-span-1 lg:col-span-1">
                <h3 className="text-lg font-semibold text-foreground mb-4 lg:mb-6 border-b border-primary/20 pb-2">
                    Connect
                </h3>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                    {socialLinks.map((social) => {
                    const IconComponent = social.icon
                    return (
                        <Link
                        key={social.name}
                        href={social.href}
                        className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background border text-muted-foreground hover:text-foreground hover:border-primary hover:shadow-lg transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                        aria-label={social.name}
                        target={social.href.startsWith('http') ? '_blank' : undefined}
                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-200" />
                        </Link>
                    )
                    })}
                </div>
                </div>
        
                {/* Copyright/Info Section */}
                <div className="sm:col-span-1 lg:col-span-1">
                <h3 className="text-lg font-semibold text-foreground mb-4 lg:mb-6 border-b border-primary/20 pb-2">
                    Info
                </h3>
                <div className="text-sm text-muted-foreground space-y-2 lg:space-y-3">
                    <div className="font-medium">© {new Date().getFullYear()} Your Blog Name</div>
                    <div>All rights reserved</div>
                    <div className="flex flex-col space-y-1 lg:space-y-2">
                    <Link 
                        href="/sitemap" 
                        className="group hover:text-foreground transition-all duration-200 hover:bg-accent/30 rounded px-1 -mx-1 py-1"
                    >
                        <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                        Sitemap
                        </span>
                    </Link>
                    <Link 
                        href="/rss" 
                        className="group hover:text-foreground transition-all duration-200 hover:bg-accent/30 rounded px-1 -mx-1 py-1"
                    >
                        <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                        RSS Feed
                        </span>
                    </Link>
                    </div>
                    <div className="text-xs pt-2 border-t border-border opacity-75 hover:opacity-100 transition-opacity duration-200">
                    Built with Next.js & WordPress
                    </div>
                </div>
                </div>
            </div>
            </div>
        </footer>
    )
}