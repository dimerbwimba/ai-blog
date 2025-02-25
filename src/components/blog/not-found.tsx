"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-8 py-16 text-center">
      <div>
          <h1 className="text-9xl font-bold tracking-tighter mb-8">404</h1>
          <h2 className="text-2xl font-semibold mb-4">
            Oops! This travel article seems to have wandered off
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you&apos;re looking for seems to have caught the travel bug and wandered off! 
            Like a passport lost in transit, it might have been moved, deleted, or taken an 
            unplanned detour. Let&apos;s help you find your way back to familiar territory.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="outline" 
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="mt-16 space-y-4">
            <h3 className="text-lg font-semibold">
              Looking for something specific?
            </h3>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <Link 
                  href="/destinations" 
                  className="hover:underline"
                >
                  Browse Destinations
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="hover:underline"
                >
                  Explore Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  className="hover:underline"
                >
                  Search Articles
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO-friendly content */}
        <div className="sr-only">
          <h1>Page Not Found - 404 Error</h1>
          <h2>We couldn&apos;t find the page you&apos;re looking for</h2>
          <p>
            The requested page could not be found. This might be because:
            - The page has been moved or deleted
            - The URL was typed incorrectly
            - The link you followed might be outdated
          </p>
          <p>
            Please try using our navigation menu, return to the homepage,
            or use the search function to find what you&apos;re looking for.
          </p>
        </div>
      </div>
    </div>
  )
} 