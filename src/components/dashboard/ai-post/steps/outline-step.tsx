"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Loader2, Wand2, ChevronDown, ChevronRight, X, Plus } from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { SortableItem } from "./sortable-item"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface OutlineSection {
  h2: string
  h3: string[]
}

interface CustomOutlineItem {
  h2: string
  h3: string[]
}

interface OutlineStepProps {
  onOutlineSelect: (outline: OutlineSection[]) => void
  onBack: () => void
  isGenerating: boolean
  onGenerate: (data: { 
    title: string
    description: string
    keywords: string[] 
  }) => Promise<OutlineSection[]>
  initialData?: {
    title: string
    description: string
    keywords: string[]
    outline: OutlineSection[]
  }
}

export function OutlineStep({
  onOutlineSelect,
  onBack,
  isGenerating,
  onGenerate,
  initialData
}: OutlineStepProps) {
  const [outline, setOutline] = useState<OutlineSection[]>(initialData?.outline || [])
  const [isLoading, setIsLoading] = useState(false)
  const [showNextButton, setShowNextButton] = useState(!!initialData?.outline?.length)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showCustomOutline, setShowCustomOutline] = useState(false)
  const [customOutline, setCustomOutline] = useState<CustomOutlineItem[]>([])
  const [newH2, setNewH2] = useState("")
  const [newH3, setNewH3] = useState("")
  const [selectedH2Index, setSelectedH2Index] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleGenerate = async () => {
    if (!initialData) return

    try {
      setIsLoading(true)
      setError(null)
      const generatedOutline = await onGenerate({
        title: initialData.title,
        description: initialData.description,
        keywords: initialData.keywords
      })
      
      setOutline(generatedOutline)
      setShowNextButton(true)
    } catch (error) {
      setError("Failed to generate outline. Please try again.")
      console.error("[OUTLINE_GENERATE_ERROR]", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setOutline((items) => {
        const oldIndex = items.findIndex((item) => item.h2 === active.id)
        const newIndex = items.findIndex((item) => item.h2 === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const toggleSection = (h2: string) => {
    setExpandedSections(prev => 
      prev.includes(h2) 
        ? prev.filter(id => id !== h2)
        : [...prev, h2]
    )
  }

  const removeSection = (index: number) => {
    setOutline((prev) => prev.filter((_, i) => i !== index))
    if (outline.length <= 1) {
      setShowNextButton(false)
    }
  }

  const removeSubsection = (sectionIndex: number, subsectionIndex: number) => {
    setOutline((prev) => prev.map((section, i) => {
      if (i === sectionIndex) {
        return {
          ...section,
          h3: section.h3.filter((_: string, j: number) => j !== subsectionIndex)
        }
      }
      return section
    }))
  }

  const handleNext = () => {
    onOutlineSelect(outline)
  }

  const handleAddH2 = () => {
    if (!newH2.trim()) {
      toast.error("Please enter a heading")
      return
    }
    setCustomOutline([...customOutline, { h2: newH2, h3: [] }])
    setNewH2("")
  }

  const handleAddH3 = () => {
    if (selectedH2Index === null) {
      toast.error("Please select a section first")
      return
    }
    if (!newH3.trim()) {
      toast.error("Please enter a subheading")
      return
    }
    const updatedOutline = [...customOutline]
    updatedOutline[selectedH2Index].h3.push(newH3)
    setCustomOutline(updatedOutline)
    setNewH3("")
  }

  const handleRemoveH2 = (index: number) => {
    const updatedOutline = customOutline.filter((_, i) => i !== index)
    setCustomOutline(updatedOutline)
    if (selectedH2Index === index) setSelectedH2Index(null)
  }

  const handleRemoveH3 = (h2Index: number, h3Index: number) => {
    const updatedOutline = [...customOutline]
    updatedOutline[h2Index].h3 = updatedOutline[h2Index].h3.filter((_, i) => i !== h3Index)
    setCustomOutline(updatedOutline)
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Content Outline</h3>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || isGenerating}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Outline
                </>
              )}
            </Button>
          </div>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={outline.map((item) => item.h2)}
                strategy={verticalListSortingStrategy}
              >
                {outline.map((section, index) => (
                  <div key={section.h2} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
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
                      <div className="flex-1 font-medium">{section.h2}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(index)}
                        className="p-0 h-6 w-6 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {expandedSections.includes(section.h2) && (
                      <div className="ml-6 space-y-2">
                        {section.h3.map((subsection, subIndex) => (
                          <div key={subsection} className="flex items-center gap-2">
                            <div className="flex-1 text-sm text-muted-foreground">
                              {subsection}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSubsection(index, subIndex)}
                              className="p-0 h-6 w-6 text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </SortableContext>
            </DndContext>
          </ScrollArea>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerate}
                className="mt-2"
              >
                Try Again
              </Button>
            </Alert>
          )}

          {/* <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tags
            </Button>

            {showNextButton && (
              <Button 
                onClick={handleNext}
                disabled={!outline.length}
                className="w-[200px]"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div> */}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Custom Outline</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomOutline(!showCustomOutline)}
            >
              {showCustomOutline ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOutline([...outline, ...customOutline])}
            disabled={customOutline.length === 0}
          >
            Merge with AI Outline
          </Button>
        </div>

        {showCustomOutline && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Add new section (H2)"
                value={newH2}
                onChange={(e) => setNewH2(e.target.value)}
              />
              <Button onClick={handleAddH2} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {selectedH2Index !== null && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add new subsection (H3)"
                  value={newH3}
                  onChange={(e) => setNewH3(e.target.value)}
                />
                <Button onClick={handleAddH3} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {customOutline.map((section, h2Index) => (
                  <div
                    key={h2Index}
                    className={`p-4 rounded-lg border ${
                      selectedH2Index === h2Index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedH2Index(h2Index === selectedH2Index ? null : h2Index)}
                        >
                          {selectedH2Index === h2Index ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="font-medium">{section.h2}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveH2(h2Index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {selectedH2Index === h2Index && section.h3.length > 0 && (
                      <div className="ml-6 mt-2 space-y-2">
                        {section.h3.map((subheading, h3Index) => (
                          <div key={h3Index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{subheading}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveH3(h2Index, h3Index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tags
        </Button>

        {showNextButton && (
          <Button 
            onClick={handleNext}
            disabled={!outline.length}
            className="w-[200px]"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}