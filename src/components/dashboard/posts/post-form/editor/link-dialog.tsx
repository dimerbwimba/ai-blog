"use client"

import { Editor } from "@tiptap/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link2 } from "lucide-react"
import { useState, useEffect } from "react"

interface LinkDialogProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  initialUrl?: string
}

export function LinkDialog({ editor, isOpen, onClose, initialUrl = "" }: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl)

  useEffect(() => {
    setUrl(initialUrl)
  }, [initialUrl])

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    setUrl("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialUrl ? 'Edit Link' : 'Add Link'}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button size="sm" onClick={handleSave} className="flex items-center space-x-2">
            <Link2 className="h-4 w-4"/>
            <span>Save</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 