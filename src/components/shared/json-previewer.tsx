"use client"

import { useState, useEffect } from "react"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface JsonPreviewerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  minHeight?: string
}

export function JsonPreviewer({ 
  value, 
  onChange, 
  className,
  minHeight = "300px" 
}: JsonPreviewerProps) {
  const [isValid, setIsValid] = useState(true)
  const [isPrettifying, setIsPrettifying] = useState(false)

  // Validate JSON as user types
  useEffect(() => {
    try {
      if (!value) {
        setIsValid(true)
        return
      }
      JSON.parse(value)
      setIsValid(true)
    } catch {
      setIsValid(false)
    }
  }, [value])

  const handlePrettify = (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      setIsPrettifying(true)
      const parsed = JSON.parse(value)
      const prettified = JSON.stringify(parsed, null, 2)
      onChange(prettified)
      toast.success("JSON formatted successfully")
    } catch (error) {
      toast.error("Invalid JSON format")
    } finally {
      setIsPrettifying(false)
    }
  }

  const handleFormat = (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      const parsed = JSON.parse(value)
      const minified = JSON.stringify(parsed)
      onChange(minified)
      toast.success("JSON minified successfully")
    } catch (error) {
      toast.error("Invalid JSON format")
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isValid ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <span className={cn(
            "text-sm",
            isValid ? "text-green-500" : "text-red-500"
          )}>
            {isValid ? "Valid JSON" : "Invalid JSON"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrettify}
            disabled={!value || isPrettifying}
          >
            {isPrettifying && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Prettify
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFormat}
            disabled={!value}
          >
            Minify
          </Button>
        </div>
      </div>

      <div 
        className={cn(
          "relative font-mono rounded-lg border",
          className
        )}
        style={{ minHeight }}
      >
        <textarea
          rows={18}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-full p-4 font-mono text-sm resize-none rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
            "bg-muted/50 focus:bg-background transition-colors duration-200",
            !isValid && "border-red-500 focus:ring-red-500",
            isValid && "focus:ring-primary"
          )}
          placeholder={`{
  "name": "Hotel Example",
  "description": "A beautiful hotel...",
  "price": {
    "amount": 150,
    "currency": "USD"
  },
  "rating": 4.5,
  "amenities": ["wifi", "pool", "spa"]
}`}
          spellCheck={false}
        />
      </div>
    </div>
  )
} 