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
        <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Footer Navigation Links Section */}
            <div>
                <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                <div className="space-y-2">
                    {footerNavItems.map((item) => (
                        <Link
                        key={item.name}
                        href={item.href}
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                        {item.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Social Media Section */}
            <div className="flex space-x-4">
                {socialLinks.map((social) => {
                    const IconComponent = social.icon
                    return (
                    <Link
                        key={social.name}
                        href={social.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={social.name}
                        target={social.href.startsWith('http') ? '_blank' : undefined}
                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                        <IconComponent className="h-5 w-5" />
                    </Link>
                    )
                })}
            </div>

            {/* Copyright Section */}
            <div>
                <h3 className="font-semibold text-foreground mb-4">Info</h3>
                <div className="text-sm text-muted-foreground">
                    <div>© {new Date().getFullYear()} Your Blog Name</div>
                    <div className="mt-2">All rights reserved</div>
                    <div className="mt-2">
                        <Link 
                        href="/sitemap" 
                        className="hover:text-foreground transition-colors"
                        >
                        Sitemap
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </footer>
    )
}