'use client'

import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { PostFormSkeleton } from "./post-form-skeleton"
import Image from "next/image"
import SEOChecker from "@/components/ui/seo-checker"
import { Separator } from "@/components/ui/separator"

interface PostPreviewProps {
  postId: string
}

export function PostPreview({ postId }: PostPreviewProps) {
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error("Failed to fetch post")
        }

        setPost(data)
      } catch (error) {
        console.error(error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (isLoading) {
    return <PostFormSkeleton />
  }

  if (!post) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
              {post.status}
            </Badge>
            {/* {post.destinations?.map((d: any) => (
              <Badge key={d.destination.slug} variant="outline">
                {d.destination?.name}
              </Badge>
            ))} */}
          </div>
          {/* <div className="flex gap-2">
            {post.categories?.map((c: any) => (
              <Badge key={c.category.slug} variant="secondary">
                {c.category?.name}
              </Badge>
            ))}
          </div> */}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/travel/${post.seo_slug}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Post
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/dashboard/posts/${post.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </Link>
          </Button>
        </div>
      </div>

        <div className="relative aspect-video">
          <Image
            width={1000}
            height={1000}
            quality={100}
            priority={true} 
            placeholder="blur"
            blurDataURL={post.image}            
            src={post.image} 
            alt={post.title}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <Separator />
        <SEOChecker
          title={post.title}
          content={post.content}
          slug={post.slug}
          image={post.image}
          description={post.description}
          tags={post.tags}
          keywords={post.keywords}
          seo_slug={post.seo_slug}
        />
        <Separator />
        <div className="px-6 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <img 
                  src={post.author.image} 
                  alt={post.author.name}
                  className="rounded-full w-6 h-6"
                />
                <span>{post.author.name}</span>
              </div>
              <span>•</span>
              <time>{formatDate(post.createdAt)}</time>
              {post.updatedAt !== post.createdAt && (
                <>
                  <span>•</span>
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">{post.description}</p>
          <div className="prose prose-stone prose-p:mb-2 prose-table-th-p:mb-0 prose-table-td-p:mb-0 dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
    </div>
  )
} 