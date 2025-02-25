"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Loader2, Wand2, X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TagsStepProps {
  onTagsSelect: (data: { tags: string[]; keywords: string[] }) => void
  onBack: () => void
  isGenerating: boolean
  onGenerate: (data: { title: string; description: string }) => Promise<{
    tags: string[]
    keywords: string[]
  }>
  initialData?: {
    title: string
    description: string
    tags: string[]
    keywords: string[]
  }
}

export function TagsStep({
  onTagsSelect,
  onBack,
  isGenerating,
  onGenerate,
  initialData
}: TagsStepProps) {
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || [])
  const [newTag, setNewTag] = useState("")
  const [newKeyword, setNewKeyword] = useState("")
  const [showNextButton, setShowNextButton] = useState(
    !!(initialData?.tags?.length && initialData?.keywords?.length)
  )

  const handleGenerate = async () => {
    if (!initialData?.title || !initialData?.description) {
      toast.error("Title and description are required")
      return
    }

    try {
      const generated = await onGenerate({
        title: initialData.title,
        description: initialData.description
      })
      
      setTags(generated.tags)
      setKeywords(generated.keywords)
      setShowNextButton(true)
      toast.success("Generated tags and keywords")
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate tags and keywords")
    }
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return
    if (tags.includes(newTag.trim())) {
      toast.error("Tag already exists")
      return
    }
    setTags([...tags, newTag.trim()])
    setNewTag("")
    setShowNextButton(true)
  }

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return
    if (keywords.includes(newKeyword.trim())) {
      toast.error("Keyword already exists")
      return
    }
    setKeywords([...keywords, newKeyword.trim()])
    setNewKeyword("")
    setShowNextButton(true)
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
    setShowNextButton(tags.length > 1 || keywords.length > 0)
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
    setShowNextButton(keywords.length > 1 || tags.length > 0)
  }

  const handleNext = () => {
    if (!tags.length || !keywords.length) {
      toast.error("At least one tag and keyword are required")
      return
    }
    onTagsSelect({ tags, keywords })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Step 4: Tags & Keywords</h3>
              <p className="text-sm text-muted-foreground">
                Generate and manage your post&apos;s tags and keywords
              </p>
            </div>
            <Badge variant="secondary">Step 4 of 5</Badge>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !initialData?.title}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Tags & Keywords...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Tags & Keywords
              </>
            )}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags Section */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Tags</h4>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[120px] w-full rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={cn(
                        "px-3 py-1 cursor-pointer hover:bg-secondary/80",
                        "flex items-center gap-1"
                      )}
                    >
                      {tag}
                      <X
                        className="h-3 w-3 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Keywords Section */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Keywords</h4>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add a keyword"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleAddKeyword}
                    disabled={!newKeyword.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[120px] w-full rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className={cn(
                        "px-3 py-1 cursor-pointer hover:bg-secondary/80",
                        "flex items-center gap-1"
                      )}
                    >
                      {keyword}
                      <X
                        className="h-3 w-3 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Slugs
            </Button>

            {showNextButton && (
              <Button 
                onClick={handleNext}
                disabled={!tags.length || !keywords.length}
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