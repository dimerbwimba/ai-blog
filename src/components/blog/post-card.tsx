import Link from "next/link"
import Image from "next/image"
import { formatDate, isUrlFormatCorrect } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, MapPin } from "lucide-react"

interface PostCardProps {
  post: {
    id: string
    title: string
    description: string
    image: string
    seo_slug: string
    slug: string
    createdAt: string
    author: {
      name: string
      image: string
    }
    destinations?: {
      destination: {
        name: string
      }
    }[]
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden bg-white shadow-none group">
      <Link href={`/travel/${post.seo_slug}`}>
        <div className="relative h-48 overflow-hidden">
          {post.image && isUrlFormatCorrect(post.image) && (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          )}
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {post.destinations?.[0] && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{post.destinations[0].destination.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </div>
        </div>

        <Link href={`/travel/${post.seo_slug}`}>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>
      </div>
    </Card>
  )
}

PostCard.Skeleton = function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  )
} 