"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Eye, ChevronDown, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface OutlineSection {
  h2: string
  h3: string[]
}

interface ContentStepProps {
  onContentGenerated: (sections: OutlineSection[]) => void
  onBack: () => void
  initialData: {
    title: string
    description: string
    keywords: string[]
    outline: OutlineSection[]
  }
}

interface SectionContent extends OutlineSection {
  content?: string
  isGenerating?: boolean
}

export function ContentStep({
  onContentGenerated,
  onBack,
  initialData
}: ContentStepProps) {
  const [sections, setSections] = useState<SectionContent[]>(
    initialData.outline.map(section => ({ ...section, content: undefined }))
  )
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const toggleSection = (h2: string) => {
    setExpandedSections(prev => 
      prev.includes(h2) 
        ? prev.filter(id => id !== h2)
        : [...prev, h2]
    )
  }

  const handleGenerateContent = async (sectionIndex: number) => {
    try {
      setSections(prev => prev.map((section, idx) => 
        idx === sectionIndex ? { ...section, isGenerating: true } : section
      ))

      const section = sections[sectionIndex]
      const content = await generateSectionContent({
        title: section.h2,
        subsections: section.h3,
        context: {
          title: initialData.title,
          description: initialData.description,
          keywords: initialData.keywords
        }
      })

      setSections(prev => prev.map((section, idx) => 
        idx === sectionIndex 
          ? { ...section, content, isGenerating: false } 
          : section
      ))

      toast.success(`Generated content for "${section.h2}"`)
    } catch (error) {
      toast.error("Failed to generate content")
      console.error("[GENERATE_SECTION_CONTENT_ERROR]", error)
      setSections(prev => prev.map((section, idx) => 
        idx === sectionIndex ? { ...section, isGenerating: false } : section
      ))
    }
  }

  const handlePreviewContent = (content: string | undefined) => {
    if (!content) {
      toast.error("No content to preview")
      return
    }
    setPreviewContent(content)
    setShowPreview(true)
  }

  const handleNext = () => {
    const hasAllContent = sections.every(section => section.content)
    if (!hasAllContent) {
      toast.error("Please generate content for all sections")
      return
    }
    onContentGenerated(sections)
  }

  const allContentGenerated = sections.every(section => section.content)

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Generate Content</h3>
          </div>

          <ScrollArea className="h-[500px] rounded-md border p-4">
            {sections.map((section, index) => (
              <div key={section.h2} className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection(section.h2)}
                      className="p-0 h-6 w-6"
                    >
                      {expandedSections.includes(section.h2) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <h4 className="font-medium">{section.h2}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {section.content && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewContent(section.content)}
                        className="h-8"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateContent(index)}
                      disabled={section.isGenerating}
                      className="h-8"
                    >
                      {section.isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          {section.content ? "Regenerate" : "Generate"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {expandedSections.includes(section.h2) && (
                  <div className="ml-6 space-y-2">
                    {section.h3.map((subsection) => (
                      <div key={subsection} className="text-sm text-muted-foreground">
                        • {subsection}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Outline
            </Button>

            <Button 
              onClick={handleNext}
              disabled={!allContentGenerated}
              className="w-[200px]"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
          </DialogHeader>
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: previewContent || '' }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

async function generateSectionContent(params: {
  title: string
  subsections: string[]
  context: {
    title: string
    description: string
    keywords: string[]
  }
}): Promise<string> {
  const response = await fetch('/api/posts/ai/generate-section', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })

  if (!response.ok) {
    throw new Error('Failed to generate section content')
  }

  const data = await response.json()
  return data.content
} 