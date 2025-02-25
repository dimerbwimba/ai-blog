"use client"

import { BubbleMenu, Editor } from '@tiptap/react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from 'react'
import { ImageDialog } from './image-dialog'

interface ImageBubbleMenuProps {
  editor: Editor
}

export function ImageBubbleMenu({ editor }: ImageBubbleMenuProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  if (!editor) return null

  const handleEditImage = () => {
    setShowEditDialog(true)
  }

  const handleDeleteImage = () => {
    editor.chain().focus().deleteSelection().run()
  }

  return (
    <TooltipProvider>
      <BubbleMenu
        className="flex space-x-2 overflow-hidden rounded-lg border border-border bg-background shadow-md"
        editor={editor}
        tippyOptions={{
          duration: 100,
          placement: 'top',
        }}
        shouldShow={({ editor }) => editor.isActive('image')}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleEditImage}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Image</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Image</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive"
              onClick={handleDeleteImage}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Image</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Image</TooltipContent>
        </Tooltip>

        <ImageDialog
          editor={editor}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          initialData={{
            imageUrl: editor.getAttributes('image').src,
            altText: editor.getAttributes('image').alt,
          }}
        />
      </BubbleMenu>
    </TooltipProvider>
  )
} 