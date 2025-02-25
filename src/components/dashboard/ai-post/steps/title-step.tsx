"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, ThumbsDown, ThumbsUp, Wand2, ArrowRight } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface TitleStepProps {
  onTitleSelect: (title: string) => void
  isGenerating: boolean
  onGenerate: (topic: string) => Promise<string[]>
  initialData?: {
    topic: string
    suggestedTitles: string[]
    selectedTitle: string
  }
}

export function TitleStep({ 
  onTitleSelect, 
  isGenerating, 
  onGenerate,
  initialData 
}: TitleStepProps) {
  const [topic, setTopic] = useState(initialData?.topic || "")
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>(initialData?.suggestedTitles || [])
  const [selectedTitle, setSelectedTitle] = useState(initialData?.selectedTitle || "")
  const [customTitle, setCustomTitle] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    try {
      const titles = await onGenerate(topic)
      setSuggestedTitles(titles)
    } catch {
      toast("Failed to generate titles")
    }
  }

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title)
    setShowNextButton(true)
  }

  const handleCustomTitle = () => {
    if (customTitle.trim()) {
      onTitleSelect(customTitle)
    }
  }

  const handleNext = () => {
    if (selectedTitle) {
      onTitleSelect(selectedTitle)
    } else if (customTitle.trim()) {
      onTitleSelect(customTitle)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Step 1: Generate Title</h3>
              <p className="text-sm text-muted-foreground">
                Enter your topic to generate SEO-friendly title suggestions
              </p>
            </div>
            <Badge variant="secondary">Step 1 of 5</Badge>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter your topic (e.g., Hidden gems in Bali)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {suggestedTitles.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                {suggestedTitles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground"
                  >
                    <p className="text-sm">{title}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTitleSelect(title)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSuggestedTitles(titles => 
                          titles.filter(t => t !== title)
                        )}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate More
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCustom(true)}
                >
                  Write Custom Title
                </Button>
              </div>
            </div>
          )}

          {isCustom && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your custom title..."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
              <Button
                onClick={handleCustomTitle}
                disabled={!customTitle.trim()}
              >
                Use Custom Title
              </Button>
            </div>
          )}

          {selectedTitle && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Selected Title:</p>
              <p className="text-lg">{selectedTitle}</p>
            </div>
          )}

          {showNextButton && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} className="w-[200px]">
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
} 