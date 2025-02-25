"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "../ui/badge"

export function HeroSection() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

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

          <form 
            onSubmit={handleSearch}
            className="flex gap-2 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search destinations, guides..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm"
              />
            </div>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Search
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center  justify-center gap-3 text-sm  pb-10">
            <span className="text-muted-foreground">Popular:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {["Thailand", "Japan", "Italy", "Greece"].map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white cursor-pointer transition-colors"
                  onClick={() => router.push(`/search?q=${tag}`)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 