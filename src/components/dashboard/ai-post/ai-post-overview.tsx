"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Info, Plus, Sparkles, Wand2 } from "lucide-react"
import { AIPostForm } from "./ai-post-form"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AIPostOverview() {
  const [showNewAIPostDialog, setShowNewAIPostDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">AI-Powered Post Creation</h2>
          <p className="text-muted-foreground">
            Generate comprehensive travel content with AI assistance
          </p>
        </div>
        <Button onClick={() => setShowNewAIPostDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New AI Post
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          Our AI assistant helps you create high-quality travel content in 3 simple steps:
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Enter your topic and destination</li>
            <li>Customize the tone and add specific requirements</li>
            <li>Review and edit the generated content</li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="space-y-2">
            <Bot className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-lg">Smart Research</h3>
            <p className="text-sm text-muted-foreground">
              AI automatically researches your destination and topic to provide accurate, up-to-date information
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-lg">SEO Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Get AI-powered suggestions for titles, descriptions, and keywords to improve visibility
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <Bot className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-lg">Complete Package</h3>
            <p className="text-sm text-muted-foreground">
              Generates full posts including FAQs, meta descriptions, and structured content
            </p>
          </div>
        </Card>
      </div>

      <Dialog 
        open={showNewAIPostDialog} 
        onOpenChange={setShowNewAIPostDialog}
      >
        <DialogContent className="max-w-[1000px] w-11/12 h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Post with AI</DialogTitle>
          </DialogHeader>
          <AIPostForm onSuccess={() => setShowNewAIPostDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
} 