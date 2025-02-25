"use client"

import { 
    useEditor, 
    EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Typography from '@tiptap/extension-typography'

import { UseFormReturn } from "react-hook-form"
import { EditorToolbar } from "./editor/editor-toolbar"
import { cn } from "@/lib/utils"
import { LinkBubbleMenu } from "./editor/link-bubble-menu"
import { FormatBubbleMenu } from "./editor/format-bubble-menu"
import { ImageBubbleMenu } from "./editor/image-bubble-menu"
import { TableBubbleMenu } from "./editor/table-bubble-menu"

interface PostFormEditorProps {
  form: UseFormReturn<any>
}

export function PostFormEditor({ form }: PostFormEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      
      Typography,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline decoration-primary cursor-pointer',
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'table-wrapper',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-border',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-muted font-bold p-2 text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2 border border-border align-top',
        },
      }),
    ],
    content: form.getValues("content") || "",
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-lg mx-auto focus:outline-none",
          "prose-headings:font-bold prose-headings:tracking-tight",
          "prose-p:leading-7",
          "prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:pl-6 prose-blockquote:italic",
          "prose-ul:list-disc prose-ol:list-decimal",
          "prose-img:rounded-lg prose-img:focus:boder-2",
          "prose-a:text-blue-500 prose-a:underline hover:prose-a:underline",
          "prose-code:rounded prose-code:bg-muted prose-code:p-1",
          "prose-pre:bg-muted prose-pre:p-4",
          "dark:prose-invert"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      form.setValue("content", editor.getHTML(), { 
        shouldValidate: true,
        shouldDirty: true 
      })
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="">
      <EditorToolbar editor={editor}>
      </EditorToolbar>
      <div className={cn(
        "min-h-[500px] w-full z-0 rounded-b-lg border-t bg-background",
      )}>
        {editor && (
          <>
            <FormatBubbleMenu 
              editor={editor} 
              shouldShow={({ editor, from, to }) => {
                const isImage = editor.isActive('image')
                const isLink = editor.isActive('link')
                const isTable = editor.isActive('table')
                const isAd = editor.isActive('advertisement')
                const hasSelection = from !== to
                return hasSelection && !isImage && !isLink && !isTable && !isAd
              }}
            />
            <LinkBubbleMenu 
              editor={editor}
              shouldShow={({ editor }) => {
                return editor.isActive('link') && !editor.isActive('image')
              }}
            />
            <ImageBubbleMenu editor={editor} />
            <TableBubbleMenu 
              editor={editor}
              shouldShow={({ editor }) => {
                return editor.isActive('table')
              }}
            />
           
          </>
        )}
        
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}