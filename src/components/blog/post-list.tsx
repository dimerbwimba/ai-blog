"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { PostCard } from "./post-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PostListProps {
  initialPosts: any[]
}

export function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  // Set initial posts after mount
  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  async function loadMorePosts() {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/posts/public?page=${page}&limit=9`, {
        next: { revalidate: 10 }
      })
      const data = await res.json()
      
      setPosts(prev => [...prev, ...data.posts])
      setHasMore(data.nextPage !== null)
      setPage(prev => prev + 1)
    } catch (error:any) {
      console.error("Failed to load posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (inView) {
      loadMorePosts()
    }
  }, [inView])

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Latest Stories</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {loading && Array.from({ length: 2 }).map((_, i) => (
          <PostCard.Skeleton key={i} />
        ))}
      </div>

      <div ref={ref} className="flex justify-center py-8">
        {loading && (
          <Button variant="ghost" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading more...
          </Button>
        )}
      </div>
    </section>
  )
} 