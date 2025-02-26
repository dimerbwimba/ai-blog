"use client"

import { useState } from "react"
import { TitleStep } from "./steps/title-step"
import { slugify } from "@/lib/utils"
import { toast } from "sonner"
import { useAIPostForm } from "@/hooks/use-ai-post-form"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DescriptionStep } from "./steps/description-step"
import { SlugStep } from "./steps/slug-step"
import { TagsStep } from "./steps/tags-step"
import { OutlineStep } from "./steps/outline-step"
import { ContentStep } from "./steps/content-step"
import { EndStep } from "./steps/end-step"
import { FAQsStep } from "./steps/faqs-step"
import { OutlineSection } from "@/hooks/use-ai-post-form"

interface AIPostFormProps {
  onSuccess: () => void
}

export function AIPostForm({ onSuccess }: AIPostFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { formData, updateFormData, clearFormData } = useAIPostForm()

  const handleTitleGenerate = async (topic: string): Promise<string[]> => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/posts/ai/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })

      if (!response.ok) {
        throw new Error('Failed to generate titles')
      }

      const titles = await response.json()
      updateFormData({ topic, suggestedTitles: titles })
      return titles
    } catch (error) {
      toast("Failed to generate titles")
      console.error(error)
      return []
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTitleSelect = (title: string) => {
    updateFormData({
      title,
      slug: slugify(title),
      selectedTitle: title,
      currentStep: 2
    })
  }

  const handleDescriptionGenerate = async (title: string): Promise<string[]> => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/posts/ai/generate-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })

      if (!response.ok) {
        throw new Error('Failed to generate descriptions')
      }

      const descriptions = await response.json()
      updateFormData({ suggestedDescriptions: descriptions })
      return descriptions
    } catch (error) {
      toast("Failed to generate descriptions")
      console.error(error)
      return []
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDescriptionSelect = (description: string) => {
    updateFormData({
      description,
      selectedDescription: description,
      currentStep: 3
    })
  }

  const handleBackToTitle = () => {
    updateFormData({ currentStep: 1 })
  }

  const handleSlugsSelect = (slugs: { slug: string; seoSlug: string }) => {
    updateFormData({
      slug: slugs.slug,
      seoSlug: slugs.seoSlug,
      currentStep: 4
    })
  }

  const handleBackToDescription = () => {
    updateFormData({ currentStep: 2 })
  }

  const handleSlugsGenerate = async (title: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/posts/ai/generate-slugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })

      if (!response.ok) {
        throw new Error('Failed to generate slugs')
      }

      const slugs = await response.json()
      return slugs
    } catch (error) {
      toast("Failed to generate slugs")
      console.error(error)
      return { slug: '', seoSlug: '' }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTagsGenerate = async (data: { 
    title: string; 
    description: string 
  }) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/posts/ai/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to generate tags')
      }

      const result = await response.json()
      updateFormData({ 
        suggestedTags: result.tags,
        suggestedKeywords: result.keywords
      })
      return result
    } catch (error) {
      toast.error("Failed to generate tags and keywords")
      console.error(error)
      return { tags: [], keywords: [] }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTagsSelect = (data: { tags: string[]; keywords: string[] }) => {
    updateFormData({
      tags: data.tags,
      keywords: data.keywords,
      currentStep: 5
    })
  }

  const handleBackToSlugs = () => {
    updateFormData({ currentStep: 3 })
  }

  const handleOutlineGenerate = async (data: {
    title: string
    description: string
    keywords: string[]
  }) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/posts/ai/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to generate outline')
      }

      const outline = await response.json()
      updateFormData({ suggestedOutline: outline })
      return outline
    } catch (error) {
      toast.error("Failed to generate outline")
      console.error(error)
      return []
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOutlineSelect = (outline: any[]) => {
    updateFormData({
      outline,
      currentStep: 6
    })
  }

  const handleBackToTags = () => {
    updateFormData({ currentStep: 4 })
  }

  const handleContentGenerated = (outline: any[]) => {
    updateFormData({
      outline,
      currentStep: 7
    })
  }

  const handleBackToOutline = () => {
    updateFormData({ currentStep: 5 })
  }

  const handleBackToContent = () => {
    updateFormData({ currentStep: 6 })
  }

  const handleFAQsGenerate = async (data: {
    title: string
    description: string
    keywords: string[]
    content: string
  }) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/posts/ai/generate-faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to generate FAQs')
      }

      const faqs = await response.json()
      return faqs
    } catch (error) {
      toast.error("Failed to generate FAQs")
      console.error(error)
      return []
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFAQsSelect = (faqs: any[]) => {
    updateFormData({
      faqs,
      currentStep: 8
    })
  }

  // const handleBackToFAQs = () => {
  //   updateFormData({ currentStep: 7 })
  // }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Create AI Post</h2>
          <p className="text-muted-foreground">
            Generate your post step by step
          </p>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all progress?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                saved progress and reset the form to its initial state.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={clearFormData}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {formData.currentStep === 1 && (
        <TitleStep
          onTitleSelect={handleTitleSelect}
          isGenerating={isGenerating}
          onGenerate={handleTitleGenerate}
          initialData={{
            topic: formData.topic || '',
            suggestedTitles: formData.suggestedTitles || [],
            selectedTitle: formData.selectedTitle || ''
          }}
        />
      )}

      {formData.currentStep === 2 && (
        <DescriptionStep
          onDescriptionSelect={handleDescriptionSelect}
          onBack={handleBackToTitle}
          isGenerating={isGenerating}
          onGenerate={handleDescriptionGenerate}
          initialData={{
            title: formData.title || '',
            description: formData.description || '',
            suggestedDescriptions: formData.suggestedDescriptions || [],
            selectedDescription: formData.selectedDescription || ''
          }}
        />
      )}

      {formData.currentStep === 3 && (
        <SlugStep
          onSlugsSelect={handleSlugsSelect}
          onBack={handleBackToDescription}
          isGenerating={isGenerating}
          onGenerate={handleSlugsGenerate}
          initialData={{
            title: formData.title || '',
            description: formData.description || '',
            slug: formData.slug || '',
            seoSlug: formData.seoSlug || ''
          }}
        />
      )}

      {formData.currentStep === 4 && (
        <TagsStep
          onTagsSelect={handleTagsSelect}
          onBack={handleBackToSlugs}
          isGenerating={isGenerating}
          onGenerate={handleTagsGenerate}
          initialData={{
            title: formData.title || '',
            description: formData.description || '',
            tags: formData.tags || [],
            keywords: formData.keywords || []
          }}
        />
      )}

      {formData.currentStep === 5 && (
        <OutlineStep
          onOutlineSelect={handleOutlineSelect}
          onBack={handleBackToTags}
          isGenerating={isGenerating}
          onGenerate={handleOutlineGenerate}
          initialData={{
            title: formData.title || '',
            description: formData.description || '',
            keywords: formData.keywords || [],
            outline: (formData.outline || []).map((section: any) => ({
              h2: section.h2 || '',
              h3: section.h3 || []
            }))
          }}
        />
      )}

      {formData.currentStep === 6 && (
        <ContentStep
          onContentGenerated={handleContentGenerated}
          onBack={handleBackToOutline}
          initialData={{
            title: formData.title || '',
            description: formData.description || '',
            keywords: formData.keywords || [],
            outline: formData.outline as OutlineSection[]
          }}
        />
      )}

      {formData.currentStep === 7 && (
        <FAQsStep
          onFAQsSelect={handleFAQsSelect}
          onBack={handleBackToContent}
          isGenerating={isGenerating}
          onGenerate={handleFAQsGenerate}
          initialData={{
            title: formData.title || '',
            description: formData.description || '',
            keywords: formData.keywords || [],
            outline: formData.outline || [],
            faqs: formData.faqs || []
          }}
        />
      )}

      {formData.currentStep === 8 && (
        <EndStep
          onBack={handleBackToContent}
          onSuccess={onSuccess}
          initialData={{
            title: formData.title || '',
            description: formData.description || '',
            slug: formData.slug || '',
            seoSlug: formData.seoSlug || '',
            tags: formData.tags || [],
            keywords: formData.keywords || [],
            outline: formData.outline.map((section: any) => ({
              ...section,
              content: formData.sections?.find((s: any) => s.h2 === section.h2)?.content
            })),
            faqs: formData.faqs || []
          }}
        />
      )}
      
      
      {/* Additional steps will be added here */}
    </div>
  )
} 