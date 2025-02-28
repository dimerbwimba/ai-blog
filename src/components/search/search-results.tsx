"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PostCard } from "@/components/blog/post-card"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/shared/pagination"
import { Loader2 } from "lucide-react"
import { SearchBar } from "@/components/shared/search-bar"
import { cn } from "@/lib/utils"

interface SearchResultsProps {
  query: string
  page: number
  categories: string[]
}

export function SearchResults({ query, page, categories }: SearchResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1, limit: 10 })
  const [loading, setLoading] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const searchBarWrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleScroll = () => {
      if (!searchBarWrapperRef.current) return

      const rect = searchBarWrapperRef.current.getBoundingClientRect()
      const shouldStick = rect.top <= 0

      if (shouldStick !== isSticky) {
        setIsSticky(shouldStick)
        
        // Update wrapper height when sticking/unsticking
        if (searchBarRef.current && searchBarWrapperRef.current) {
          searchBarWrapperRef.current.style.height = shouldStick 
            ? `${searchBarRef.current.offsetHeight}px` 
            : 'auto'
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isSticky])

  useEffect(() => {
    async function fetchResults() {
      if (!query) return

      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('q', query)
        params.set('page', page.toString())
        categories.forEach(cat => params.append('category', cat))

        const response = await fetch(`/api/search?${params.toString()}`)
        const data = await response.json()
        
        setResults(data.results)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, page, categories])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      {/* Wrapper div to maintain height and prevent content jump */}
      <div ref={searchBarWrapperRef}>
        <div 
          ref={searchBarRef}
          className={cn(
            "space-y-4 transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            isSticky && "fixed top-0 left-0 right-0 z-50 px-4 py-4 shadow-md"
          )}
        >
          <SearchBar initialQuery={query} />
          
          {query && (
            <h1 className={cn(
              "text-2xl font-bold max-w-2xl mx-auto transition-all duration-300",
              isSticky && "text-xl"
            )}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching...
                </span>
              ) : (
                `Search Results for "${query}" (${pagination.total})`
              )}
            </h1>
          )}
        </div>
      </div>

      {!query ? (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Search Travel Articles</h1>
          <p className="text-muted-foreground">Enter a search term to find articles</p>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid gap-8 sm:grid-cols-2">
            {results.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </>
      ) : !loading && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No results found</p>
          <Button 
            variant="link" 
            onClick={() => router.push('/search')}
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  )
} 