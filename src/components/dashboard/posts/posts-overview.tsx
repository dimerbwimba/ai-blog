"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Settings } from "lucide-react"
import Link from "next/link"
import { PostsList } from "./posts-list"
import { useAiPostModal } from "@/store/use-ai-post-modal"

export const PostsOverview = () => {
  const postWithAiModal = useAiPostModal()
  return (
    <div className="space-y-4">
      <div className=" justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
          <p className="text-muted-foreground">
            Create and manage your travel stories
          </p>
        </div>
        <div className=" space-x-3 mt-3">
          <Button asChild>
            <Link href="/dashboard/posts/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Post Manually
            </Link>
          </Button>
          <Button 
            variant={"secondary"} 
             
            onClick={postWithAiModal.onOpen} 
            className=" cursor-pointer" asChild>
            <span>
              <Plus className="w-4 h-4 mr-2" />
              Create with AI
            </span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="space-y-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Draft Posts</h3>
            <p className="text-sm text-muted-foreground">
              View and edit your draft posts
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Published Posts</h3>
            <p className="text-sm text-muted-foreground">
              Manage your published content
            </p>
          </div>
        </Card>
      </div>

      <PostsList />
    </div>
  )
} 