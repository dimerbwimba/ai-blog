"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Loader2, Wand2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { slugify } from "@/lib/utils"

interface SlugStepProps {
  onSlugsSelect: (slugs: { slug: string; seoSlug: string }) => void
  onBack: () => void
  isGenerating: boolean
  onGenerate: (title: string) => Promise<{ slug: string; seoSlug: string }>
  initialData?: {
    title: string
    description: string
    slug: string
    seoSlug: string
  }
}

export function SlugStep({
  onSlugsSelect,
  onBack,
  isGenerating,
  onGenerate,
  initialData
}: SlugStepProps) {
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [seoSlug, setSeoSlug] = useState(initialData?.seoSlug || "")
  const [showNextButton, setShowNextButton] = useState(
    !!(initialData?.slug && initialData?.seoSlug)
  )

  const handleGenerate = async () => {
    if (!initialData?.title) {
      toast("Title is required")
      return
    }

    try {
      const slugs = await onGenerate(initialData.title)
      if (!slugs.slug || !slugs.seoSlug) {
        throw new Error("Invalid slugs generated")
      }
      
      setSlug(slugs.slug)
      setSeoSlug(slugs.seoSlug)
      setShowNextButton(true)
      toast.success("Generated SEO-friendly slugs")
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate slugs")
    }
  }

  const handleManualSlugUpdate = (value: string, type: 'slug' | 'seoSlug') => {
    const slugified = slugify(value)
    if (type === 'slug') {
      setSlug(slugified.slice(0, 60))
    } else {
      setSeoSlug(slugified.slice(0, 80))
    }
    setShowNextButton(true)
  }

  const handleNext = () => {
    if (!slug || !seoSlug) {
      toast.error("Both slugs are required")
      return
    }
    onSlugsSelect({ slug, seoSlug })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Step 3: URL Slugs</h3>
              <p className="text-sm text-muted-foreground">
                Generate and customize your SEO-friendly URLs
              </p>
            </div>
            <Badge variant="secondary">Step 3 of 5</Badge>
          </div>

          {initialData?.title && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Title:</p>
              <p className="text-lg">{initialData.title}</p>
            </div>
          )}

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !initialData?.title}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating SEO-Friendly Slugs...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate SEO-Friendly Slugs
              </>
            )}
          </Button>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Slug</label>
              <Input
                value={slug}
                onChange={(e) => handleManualSlugUpdate(e.target.value, 'slug')}
                placeholder="Enter URL slug"
                maxLength={60}
              />
              <p className="text-sm text-muted-foreground">
                Your post URL: example.com/blog/<span className="font-mono">{slug || 'url-slug'}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">SEO Slug</label>
              <Input
                value={seoSlug}
                onChange={(e) => handleManualSlugUpdate(e.target.value, 'seoSlug')}
                placeholder="Enter SEO-friendly slug"
                maxLength={80}
              />
              <p className="text-sm text-muted-foreground">
                Optimized version for search engines
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Description
            </Button>

            {showNextButton && (
              <Button 
                onClick={handleNext}
                disabled={!slug || !seoSlug}
                className="w-[200px]"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
} 