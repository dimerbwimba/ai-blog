"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Clock } from "lucide-react"
import type { Post } from "@/types/post"
import { ScrollArea } from "../ui/scroll-area"

export function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/posts/latest?limit=3')
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching latest posts:', error)
        setError('Failed to load latest posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestPosts()
  }, [])

  if (error) {
    return (
      <div className="text-sm text-red-500 text-center py-4">
        {error}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-muted rounded-lg mb-2" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No posts available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="mt-4 text-2xl font-bold text-center">
        Latest Post
      </h2>
     
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/travel/${post.seo_slug}`}
              className="flex gap-4 items-start group"
            >
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <time dateTime={post.createdAt}>
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        
    </div>
  )
} 