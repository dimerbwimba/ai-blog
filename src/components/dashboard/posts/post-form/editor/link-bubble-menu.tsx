"use client"

import { BubbleMenu, Editor } from '@tiptap/react'
import { Trash2, ExternalLink, Pencil } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { EditorState } from 'prosemirror-state'
import { useState } from "react"
import { LinkDialog } from "./link-dialog"

interface LinkBubbleMenuProps {
  editor: Editor
  shouldShow?: (props: { editor: Editor; state: EditorState; from: number; to: number }) => boolean
}

export function LinkBubbleMenu({ editor, shouldShow }: LinkBubbleMenuProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  if (!editor) return null

  const handleEditLink = () => {
    setShowLinkDialog(true)
  }

  const handleOpenLink = () => {
    const href = editor.getAttributes('link').href
    window.open(href, '_blank')
  }

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
  }

  return (
    <TooltipProvider>
      <BubbleMenu
        className="flex space-x-2 overflow-hidden rounded-lg border border-border bg-background shadow-md"
        editor={editor}
        shouldShow={shouldShow}
        tippyOptions={{ duration: 100 }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleEditLink}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Link</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleOpenLink}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open Link</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive"
              onClick={handleRemoveLink}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove Link</TooltipContent>
        </Tooltip>

        <LinkDialog 
          editor={editor}
          isOpen={showLinkDialog}
          onClose={() => setShowLinkDialog(false)}
          initialUrl={editor.getAttributes('link').href}
        />
      </BubbleMenu>
    </TooltipProvider>
  )
} 