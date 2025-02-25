"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Loader2, Wand2, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

interface FAQ {
  question: string
  answer: string
}

interface FAQsStepProps {
  onFAQsSelect: (faqs: FAQ[]) => void
  onBack: () => void
  isGenerating: boolean
  onGenerate: (data: { 
    title: string
    description: string
    keywords: string[]
    content: string
  }) => Promise<FAQ[]>
  initialData: {
    title: string
    description: string
    keywords: string[]
    outline: {
      h2: string
      h3: string[]
      content?: string
    }[]
    faqs?: FAQ[]
  }
}

export function FAQsStep({
  onFAQsSelect,
  onBack,
  isGenerating,
  onGenerate,
  initialData
}: FAQsStepProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialData.faqs || [])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    try {
      setError(null)

      // Compile content for context
      const content = initialData.outline
        .map(section => `${section.h2}\n${section.content || ''}`).join('\n\n')

      const generatedFAQs = await onGenerate({
        title: initialData.title,
        description: initialData.description,
        keywords: initialData.keywords,
        content
      })

      setFaqs(generatedFAQs)
    } catch (error) {
      console.error("[GENERATE_FAQS_ERROR]", error)
      setError("Failed to generate FAQs. Please try again.")
      toast.error("Failed to generate FAQs")
    }
  }

  const handleNext = () => {
    if (faqs.length === 0) {
      toast.error("Please generate at least one FAQ")
      return
    }
    onFAQsSelect(faqs)
  }

  const removeFAQ = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index))
  }

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    setFaqs(prev => prev.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    ))
  }

  const addCustomFAQ = () => {
    setFaqs(prev => [...prev, { question: "", answer: "" }])
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Generate FAQs</h3>
            <div className="flex gap-2">
              <Button
                onClick={addCustomFAQ}
                variant="outline"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Custom FAQ
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="outline"
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate FAQs
                  </>
                )}
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[500px] rounded-md border p-4">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                    className="absolute top-2 right-2 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div>
                    <Input
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, "question", e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

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
              Back to Content
            </Button>

            <Button 
              onClick={handleNext}
              disabled={faqs.length === 0}
              className="w-[200px]"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 