"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  initialQuery?: string
}

function SearchBarContent({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const params = new URLSearchParams(searchParams)
    params.set('q', query)
    params.delete('page')
    router.push(`/search?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <Input
          type="search"
          placeholder="Search for amazing travel stories..."
          className="w-full pl-12 pr-4 h-12 text-lg transition-all duration-300 rounded-xl border-2 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search articles"
          tabIndex={0}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
        <Button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2 transition-all duration-200"
          aria-label="Submit search"
        >
          Search
        </Button>
      </div>
      {!query && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Discover travel guides, tips, and inspiring destinations
        </p>
      )}
    </form>
  )
}

export function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchBarContent {...props} />
    </Suspense>
  )
}