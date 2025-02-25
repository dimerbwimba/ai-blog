"use client"

import { BubbleMenu, Editor } from '@tiptap/react'
import { EditorState } from 'prosemirror-state'
import { EditorToolbar } from "./editor-toolbar"

interface FormatBubbleMenuProps {
  editor: Editor
  shouldShow?: (props: { editor: Editor; state: EditorState; from: number; to: number }) => boolean
}

export function FormatBubbleMenu({ editor, shouldShow }: FormatBubbleMenuProps) {
  if (!editor) return null

  return (
    <BubbleMenu 
      className="flex space-x-2 overflow-hidden rounded-lg border border-border bg-background shadow-md" 
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{ duration: 100 }}
    >
      <EditorToolbar editor={editor} />
    </BubbleMenu>
  )
} 