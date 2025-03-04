"use client"

import { Separator } from "@/components/ui/separator"
import { Eye, User } from "lucide-react"

interface TopPostsProps {
  data?: Array<{
    id: string
    title: string
    views: number
    uniqueViews: number
  }>
}

export function TopPosts({ data = [] }: TopPostsProps) {
  return (
        <div className="space-y-4">
          {data.map((post) => (
            <div key={post.id} className=" space-y-2">
              <h3 className="font-medium">{post.title}</h3>
              <div className="flex flex-row items-center gap-6">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {post.uniqueViews} unique
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </div>
  )
}