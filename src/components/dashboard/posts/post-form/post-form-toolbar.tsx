"use client"

import { Button } from "@/components/ui/button"
import { SaveIcon, XIcon } from "lucide-react"
import Link from "next/link"

interface PostFormToolbarProps {
  isLoading: boolean
  onSubmit: () => void
  isEditing:boolean
}

export function PostFormToolbar({ isLoading, onSubmit, isEditing }: PostFormToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/posts">
          <XIcon className="h-4 w-4 mr-2" />
          Cancel
        </Link>
      </Button>
      <Button type="submit" size="sm" disabled={isLoading} onClick={onSubmit}>
        <SaveIcon className="h-4 w-4 mr-2" />
        {isLoading ? "Saving..." : isEditing ? "Save updates" : "Save the post"}
      </Button>
    </div>
  )
} 