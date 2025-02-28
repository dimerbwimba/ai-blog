"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

interface ViewCounterProps {
  postId: string,
  views: number
}

export function ViewCounter({ postId, views  }: ViewCounterProps) {
  const [viewCount, setViewCount] = useState<number>(views)

  useEffect(() => {
    // Get initial view count
    fetch(`/api/posts/public/${postId}/view`)
      .then(res => res.json())
      .then(data => setViewCount(data.total))
      .catch(console.error)

    // Track view
    fetch(`/api/posts/public/${postId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(console.error)
  }, [postId])

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>{viewCount} views</span>
    </div>
  )
}