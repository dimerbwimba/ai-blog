"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
  redirectToSearch?: boolean
  size?: "default" | "lg" | "sm"
}

export function SearchBar({ 
  initialQuery = '', 
  placeholder = "Search for amazing travel stories...",
  className,
  onSearch,
  redirectToSearch = true,
  size = "default"
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return

    if (onSearch) {
      onSearch(searchQuery.trim())
    }

    if (redirectToSearch) {
      const params = new URLSearchParams(searchParams)
      params.set('q', searchQuery.trim())
      params.delete('page')
      router.push(`/search?${params.toString()}`)
    }
  }, [onSearch, redirectToSearch, router, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-2xl mx-auto bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm", className)}>
      <div className="relative group">
        <Input
          type="search"
          placeholder={placeholder}
          className={cn(
            "w-full pl-12 pr-4 transition-all duration-300 rounded-xl border-2 focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
            size === "lg" && "h-14 text-lg",
            size === "default" && "h-12 text-base",
            size === "sm" && "h-10 text-sm"
          )}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search articles"
          tabIndex={0}
        />
        <Search 
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200",
            size === "lg" && "h-6 w-6",
            size === "default" && "h-5 w-5",
            size === "sm" && "h-4 w-4"
          )} 
        />
        <Button 
          type="submit"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200",
            size === "lg" && "px-6 py-2 text-base",
            size === "default" && "px-4 py-2 text-sm",
            size === "sm" && "px-3 py-1 text-xs"
          )}
          aria-label="Submit search"
        >
          Search
        </Button>
      </div>
      {!query && (
        <p className={cn(
          "text-muted-foreground mt-2 text-center",
          size === "lg" && "text-base",
          size === "default" && "text-sm",
          size === "sm" && "text-xs"
        )}>
          Discover travel guides, tips, and inspiring destinations
        </p>
      )}
    </form>
  )
} 