"use client"

import { useRouter } from "next/navigation"
import { Badge } from "../ui/badge"
import { SearchBar } from "../search/search-bar"

export function HeroSection() {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-2xl mx-auto px-4 pt-16 sm:pt-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Discover Amazing Travel Stories
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Explore travel guides, tips, and stories from experienced travelers around the world. 
              Find your next destination and plan your perfect trip.
            </p>
          </div>
          <SearchBar />
        </div>
      </div>
    </div>
  )
} 