"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Loader2, Save, Eye, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
}

interface Destination {
  id: string
  name: string
}

interface EndStepProps {
  onBack: () => void
  onSuccess: () => void
  initialData: {
    title: string
    description: string
    slug: string
    seoSlug: string
    tags: string[]
    keywords: string[]
    outline: {
      h2: string
      h3: string[]
      content?: string
    }[]
    faqs: { question: string; answer: string }[]
  }
}

export function EndStep({
  onBack,
  onSuccess,
  initialData
}: EndStepProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedDestination, setSelectedDestination] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [categoriesRes, destinationsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/destinations')
        ])

        if (!categoriesRes.ok || !destinationsRes.ok) {
          throw new Error('Failed to load data')
        }

        const categoriesData = await categoriesRes.json()
        const destinationsData = await destinationsRes.json()

        setCategories(categoriesData)
        setDestinations(destinationsData)
      } catch (error) {
        console.error('[LOAD_DATA_ERROR]', error)
        toast.error('Failed to load categories and destinations')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSaveClick = () => {
    setShowSaveDialog(true)
  }

  const handleSave = async () => {
    if (!selectedCategory || !selectedDestination) {
      toast.error('Please select both a category and destination')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      // Compile all content into HTML
      const content = initialData.outline.map(section => `
        <h2>${section.h2}</h2>
        ${section.content || ''}
      `).join('')

      // Add FAQs section if exists
      const faqsSection = initialData.faqs.length > 0 ? `
        <h2>Frequently Asked Questions</h2>
        <div class="space-y-4">
          ${initialData.faqs.map(faq => `
            <div class="space-y-2">
              <h3 class="font-medium">${faq.question}</h3>
              <p>${faq.answer}</p>
            </div>
          `).join('')}
        </div>
      ` : ''

      const fullContent = `${content}\n${faqsSection}`

      const postData = {
        image:"https://theroostingplace.blog/wp-content/uploads/2020/12/qi-bin-w4hbafegiac-unsplash.jpg",
        title: initialData.title,
        description: initialData.description,
        content: fullContent,
        slug: initialData.slug,
        seoSlug: initialData.seoSlug,
        tags: initialData.tags,
        keywords: initialData.keywords,
        categories: [selectedCategory],
        destinations: [selectedDestination],
        status: "DRAFTED" as const,
        outline: initialData.outline,
        faqs: initialData.faqs
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      toast.success("Post saved successfully!")
      setShowSaveDialog(false)
      window.location.reload()
      onSuccess()
    } catch (error) {
      console.error("[SAVE_POST_ERROR]", error)
      setError("Failed to save post. Please try again.")
      toast.error("Failed to save post")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Review & Save</h3>
              <p className="text-sm text-muted-foreground">
                Review your post content before saving
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={handleSaveClick}
                disabled={isSaving}
                size="sm"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Post
              </Button>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="meta">
              <AccordionTrigger>Meta Information</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Title</h4>
                    <p className="text-lg">{initialData.title}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{initialData.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">URLs</h4>
                    <div className="space-y-1">
                      <p>Slug: {initialData.slug}</p>
                      <p>SEO Slug: {initialData.seoSlug}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {initialData.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {initialData.keywords.map(keyword => (
                        <Badge key={keyword} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="content">
              <AccordionTrigger>Content</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="prose prose-stone dark:prose-invert max-w-none">
                    {initialData.outline.map((section, index) => (
                      <div key={index} className="mb-6">
                        <h2>{section.h2}</h2>
                        <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faqs">
              <AccordionTrigger>FAQs</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-4">
                    {initialData.faqs.map((faq, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <h4 className="font-medium">{faq.question}</h4>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to FAQs
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full mt-4">
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <h1>{initialData.title}</h1>
              <p className="lead">{initialData.description}</p>
              {initialData.outline.map((section, index) => (
                <div key={index}>
                  <h2>{section.h2}</h2>
                  <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                </div>
              ))}
              {initialData.faqs.length > 0 && (
                <>
                  <h2>Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {initialData.faqs.map((faq, index) => (
                      <div key={index} className="space-y-2">
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Post</DialogTitle>
            <DialogDescription>
              Select a category and destination for your post
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Select
                value={selectedDestination}
                onValueChange={setSelectedDestination}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((destination) => (
                    <SelectItem key={destination.id} value={destination.id}>
                      {destination.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !selectedCategory || !selectedDestination}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}