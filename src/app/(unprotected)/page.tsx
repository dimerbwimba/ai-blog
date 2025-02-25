import { Metadata } from "next"
import { PostList } from "@/components/blog/post-list"
import { PostService } from "@/services/post.service"
import { HeroSection } from "@/components/blog/hero-section"
import { Separator } from "@/components/ui/separator"
import { PopularDestinations } from "@/components/blog/popular-destinations"

export const metadata: Metadata = {
  title: "Travel Stories & Guides | TravelKaya",
  description: "Discover travel stories, guides, and tips from experienced travelers around the world.",
  keywords: ["travel blog", "travel guides", "travel stories", "travel tips", "destination guides"],
  openGraph: {
    title: "Travel Stories & Guides | TravelKaya",
    description: "Discover travel stories, guides, and tips from experienced travelers around the world.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
  }
}

// Fetch initial posts on the server
async function getInitialPosts() {
  try {
    const { posts, total } = await PostService.getPublicPosts({
      page: 1,
      limit: 9,
    })

    if (!posts || posts.length === 0) {
      return {
        posts: [],
        total: 0,
        error: "No posts found"
      }
    }

    return {
      posts,
      total,
      error: null
    }
  } catch (error) {
    console.error("[FETCH_INITIAL_POSTS_ERROR]", error)
    return {
      posts: [],
      total: 0,
      error: "Failed to fetch posts"
    }
  }
}

export default async function HomePage() {
  const { posts, error } = await getInitialPosts()

  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="max-w-2xl mx-auto">
          <Separator className="my-8" />
          <PopularDestinations />
          <Separator className="my-8" />
          
          {error ? (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {error}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Please try again later or check back for new posts.
              </p>
            </div>
          ) : (
            <PostList initialPosts={posts} />
          )}
        </div>
      </div>
    </div>
  )
}

// Add revalidation
export const revalidate = 10