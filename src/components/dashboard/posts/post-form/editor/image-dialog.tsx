"use client"

import { useState, useEffect } from "react"
import { Editor } from "@tiptap/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ImageDialogProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  initialData?: {
    imageUrl: string
    altText: string
  }
}

export function ImageDialog({ editor, isOpen, onClose, initialData }: ImageDialogProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [altText, setAltText] = useState("")

  useEffect(() => {
    if (initialData) {
      setImageUrl(initialData.imageUrl)
      setAltText(initialData.altText)
    }
  }, [initialData])

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (imageUrl) {
      if (editor.isActive('image')) {
        // Update existing image
        editor
          .chain()
          .focus()
          .setImage({ 
            src: imageUrl,
            alt: altText,
            title: altText,
          })
          .run()
      } else {
        // Insert new image
        editor
          .chain()
          .focus()
          .setImage({ 
            src: imageUrl,
            alt: altText,
            title: altText,
          })
          .run()
      }
    }
    
    // Reset form and close dialog
    setImageUrl("")
    setAltText("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Image' : 'Insert Image'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Edit the image URL and alt text.'
              : 'Add an image URL and alt text for better accessibility.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altText">Alt Text</Label>
            <Input
              id="altText"
              placeholder="Descriptive text for the image"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              {initialData ? 'Save Changes' : 'Insert Image'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
} 