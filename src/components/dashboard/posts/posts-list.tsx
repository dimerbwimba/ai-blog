"use client"

import React, { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { VerticalCard } from "@/components/ui/vertical-card"
import { Separator } from "@/components/ui/separator"
import SEOChecker from "@/components/ui/seo-checker"

interface Post {
  id: string
  title: string
  status: "DRAFTED" | "PUBLISHED" | "APPROVED" | "REJECTED"
  createdAt: string
  updatedAt: string
  content: string
  description: string
  tags: string[]
  keywords: string[]
  author: {
    name: string
  }
  seo_slug: string
  slug: string
  image: string
  categories: {
    category: {
      name: string
      slug: string
    }
  }[]
}

export const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/posts")
      const data = await response.json()
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      setPosts(data)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
      toast.error("Failed to fetch posts")
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchPosts()
  }, [])

  const onDelete = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  if (isLoading) {
    return <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  }

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          You&apos;ve published {posts.length} posts
        </h1>
      </div>
      <Separator className="my-4" />
      {
        posts.map((post) =>
          <div  key={post.id}>
            <VerticalCard
              onDelete={onDelete}
              id={post.id}
              title={post.title}
              author={{
                name: post.author.name,
              }}
              date={post.createdAt}
              image={post.image}
              status={post.status}
              categories={post.categories}
              link={`/dashboard/posts/${post.id}/edit`}
            />
            <SEOChecker
              title={post.title}
              content={post.content}
              slug={post.slug}
              seo_slug={post.seo_slug}
              description={post.description}
              image={post.image}
              tags={post.tags}
              keywords={post.keywords}
            />
          </div>

        )
      }
    </div>
  )
} 