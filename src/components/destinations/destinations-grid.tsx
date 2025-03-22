"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { MapPin,  ArrowRight, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DestinationsGridSkeleton } from "./destinations-grid-skeleton"

interface Post {
  id: string
  title: string
  description: string
  image: string
  createdAt: string
  slug:string
  seoSlug: string
  author: {
    name: string
    image: string
  }
}

interface Destination {
  id: string
  name: string
  description: string
  image: string
  country: string
  continent: string
  region: string | null
  postCount: number
  posts: Post[]
  slug: string
}

interface DestinationsGridProps {
  page?: string
  search?: string
  continent?: string
  country?: string
  sortBy?: 'name' | 'posts' | 'country'
  order?: 'asc' | 'desc'
}

export function DestinationsGrid({
  page = "1",
  search,
  continent,
  country,
  sortBy = "posts",
  order = "desc"
}: DestinationsGridProps) {
  const [showFullDescription, setShowFullDescription]= useState<boolean>(false)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: parseInt(page),
    totalPages: 1,
    hasMore: false
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.set('page', page)
        if (search) params.set('search', search)
        if (continent) params.set('continent', continent)
        if (country) params.set('country', country)
        if (sortBy) params.set('sortBy', sortBy)
        if (order) params.set('order', order)

        const response = await fetch(`/api/destinations/public/all?${params}`)
        if (!response.ok) throw new Error('Failed to fetch destinations')

        const data = await response.json()
        setDestinations(data.destinations)
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          hasMore: data.nextPage !== null
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [page, search, continent, country, sortBy, order])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`/destinations?${params.toString()}`)
  }

  if (isLoading) {
    return <DestinationsGridSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (destinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="mb-4">
          <MapPin className="h-12 w-12 text-muted-foreground animate-bounce" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Destinations Found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn&apos;t find any destinations matching your search criteria. Try adjusting your filters or search terms.
        </p>
        <Button 
          variant="outline"
          className="mt-6 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => {
            router.push('/destinations')
          }}
        >
          View All Destinations
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Featured Destination */}
      {destinations[0] && (
        <Card className="overflow-hidden bg-white dark:bg-gray-950 border-none shadow-none">
          <div className="grid grid-cols-1 gap-8">
            <Link href={`/destinations/${destinations[0].slug}`}  className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={destinations[0].image}
                alt={destinations[0].name}
                fill
                className="object-cover"
                priority
              />
            </Link>
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {destinations[0].continent}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {destinations[0].country}
                  </Badge>
                </div>
                <Link href={`/destinations/${destinations[0].slug}`}>
                  <h2 className="text-3xl uppercase text-blue-600 underline font-bold tracking-tight mb-3">{destinations[0].name}</h2>
                </Link>
                <p className="text-muted-foreground leading-relaxed">
                  {destinations[0].description.length > 200 ? (
                    <>
                      {showFullDescription ? destinations[0].description : `${destinations[0].description.slice(0, 200)}...`}
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                      >
                        {showFullDescription ? 'Read less' : 'Read more'}
                      </button>
                    </>
                  ) : (
                    destinations[0].description
                  )}
                </p>
              </div>
              
              {/* Posts Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Latest Posts
                </h3>
                <div className="space-y-3">
                  {destinations[0].posts?.slice(0, 3).map((post) => (
                    <Link 
                      key={post.id}
                      href={`/travel/${post.seoSlug}`}
                      className="block group"
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <div className="space-y-1">
                          <p className="font-medium group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {post.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Regular Grid */}
      <div className="grid grid-cols-1 gap-8">
        {destinations.slice(1).map((destination) => (
          <Card 
            key={destination.id}
            className="overflow-hidden bg-white dark:bg-gray-950 border-none shadow-none"
          >
            <div className="relative aspect-[3/2] mb-4 overflow-hidden rounded-lg">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {destination.continent}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {destination.country}
                  </Badge>
                </div>
                <Link href={`/destinations/${destination.slug}`}>
                  <h2 className="text-3xl uppercase text-blue-600 underline font-bold tracking-tight mb-3">{destination.name}</h2>
                </Link>
                <p className="text-muted-foreground leading-relaxed">
                  {destination.description.length > 200 ? (
                    <>
                      {showFullDescription ? destination.description : `${destination.description.slice(0, 200)}...`}
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                      >
                        {showFullDescription ? 'Read less' : 'Read more'}
                      </button>
                    </>
                  ) : (
                    destinations[0].description
                  )}
                </p>
              </div>

             {/* Posts Section */}
             <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Latest Posts
                </h3>
                <div className="space-y-3">
                  {destination.posts?.slice(0, 3).map((post) => (
                    <Link 
                      key={post.id}
                      href={`/travel/${post.slug}`}
                      className="block group"
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <div className="space-y-1">
                          <p className="font-medium group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {post.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <Button
            variant="outline"
            disabled={pagination.currentPage <= 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className="min-w-[100px]"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasMore}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className="min-w-[100px]"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 