import Link from "next/link"
import { Mail, Github, Info, Compass, BookOpen, FolderOpen, MapPin, Clock, Shield, FileText, Cookie } from "lucide-react"

const footerLinks = {
  company: [
    { label: "About", href: "/about", icon: <Info className="h-4 w-4" /> },
    { label: "Getting Started", href: "/getting-started", icon: <Compass className="h-4 w-4" /> },
    { label: "Travel Guides", href: "/travel-guides", icon: <BookOpen className="h-4 w-4" /> },
  ],
  resources: [
    { label: "Accommodations", href: "/accommodations", icon: <MapPin className="h-4 w-4" /> },
    { label: "Destinations", href: "/destinations", icon: <MapPin className="h-4 w-4" /> },
    { label: "Latest Posts", href: "/latest", icon: <Clock className="h-4 w-4" /> },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy", icon: <Shield className="h-4 w-4" /> },
    { label: "Terms of Service", href: "/terms", icon: <FileText className="h-4 w-4" /> },
    { label: "Cookie Policy", href: "/cookies", icon: <Cookie className="h-4 w-4" /> },
  ]
} as const

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="text-xl font-bold">
              ✈️ TravelBlog
            </Link>
            <p className="text-sm text-muted-foreground">
              🌎 Exploring the world, one story at a time.
            </p>
            <div className="flex items-center space-x-3">
              <Link 
                href="mailto:next191996@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
              <Link 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TravelBlog. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for travelers worldwide 🌍
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 