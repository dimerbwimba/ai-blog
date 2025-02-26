"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, ThumbsDown, ThumbsUp, Wand2, ArrowRight, ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface DescriptionStepProps {
  onDescriptionSelect: (description: string) => void
  onBack: () => void
  isGenerating: boolean
  onGenerate: (title: string) => Promise<string[]>
  initialData?: {
    title: string
    description: string
    suggestedDescriptions: string[]
    selectedDescription: string
  }
}

export function DescriptionStep({
  onDescriptionSelect,
  onBack,
  isGenerating,
  onGenerate,
  initialData
}: DescriptionStepProps) {
  const [suggestedDescriptions, setSuggestedDescriptions] = useState<string[]>(
    initialData?.suggestedDescriptions || []
  )
  const [selectedDescription, setSelectedDescription] = useState(
    initialData?.selectedDescription || ""
  )
  const [customDescription, setCustomDescription] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [showNextButton, setShowNextButton] = useState(!!initialData?.selectedDescription)

  const handleGenerate = async () => {
    try {
      const descriptions = await onGenerate(initialData?.title || '')
      setSuggestedDescriptions(descriptions)
    } catch {
      toast("Failed to generate descriptions")
    }
  }

  const handleDescriptionSelect = (description: string) => {
    setSelectedDescription(description)
    setShowNextButton(true)
  }

  const handleCustomDescription = () => {
    if (customDescription.trim()) {
      handleDescriptionSelect(customDescription)
    }
  }

  const handleNext = () => {
    if (selectedDescription) {
      onDescriptionSelect(selectedDescription)
    } else if (customDescription.trim()) {
      onDescriptionSelect(customDescription)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Step 2: Generate Description</h3>
              <p className="text-sm text-muted-foreground">
                Generate an SEO-friendly description for your post
              </p>
            </div>
            <Badge variant="secondary">Step 2 of 5</Badge>
          </div>

          {initialData?.title && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Selected Title:</p>
              <p className="text-lg">{initialData.title}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !initialData?.title}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Descriptions
                </>
              )}
            </Button>
          </div>

          {suggestedDescriptions.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                {suggestedDescriptions.map((description, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground"
                  >
                    <p className="text-sm flex-1 mr-4">{description}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDescriptionSelect(description)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSuggestedDescriptions(descriptions => 
                          descriptions.filter(d => d !== description)
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
                  Write Custom Description
                </Button>
              </div>
            </div>
          )}

          {isCustom && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your custom description..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={handleCustomDescription}
                disabled={!customDescription.trim()}
              >
                Use Custom Description
              </Button>
            </div>
          )}

          {selectedDescription && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Selected Description:</p>
              <p className="text-lg">{selectedDescription}</p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Title
            </Button>

            {showNextButton && (
              <Button onClick={handleNext} className="w-[200px]">
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