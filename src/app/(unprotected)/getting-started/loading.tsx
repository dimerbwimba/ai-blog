"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const inspirationalQuotes = [
  {
    quote: "The beginning is the most important part of the work.",
    author: "Plato"
  },
  {
    quote: "Every great journey begins with a single step.",
    author: "Confucius"
  },
  {
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    quote: "Dreams don't work unless you do.",
    author: "John C. Maxwell"
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    quote: "Every moment is a fresh beginning.",
    author: "T.S. Eliot"
  },
  {
    quote: "The journey of discovery begins with curiosity.",
    author: "Unknown"
  }
]

export default function Loading() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 px-4">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="relative">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="text-lg font-medium text-muted-foreground animate-pulse">
              Preparing your journey...
            </span>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div 
          key={currentQuote} 
          className="space-y-2 animate-fade-in transition-all duration-500"
        >
          <p className="text-2xl font-serif italic text-muted-foreground">
            "{inspirationalQuotes[currentQuote].quote}"
          </p>
          <p className="text-sm text-muted-foreground">
            — {inspirationalQuotes[currentQuote].author}
          </p>
        </div>

        <div className="flex justify-center gap-1.5 mt-8">
          {inspirationalQuotes.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentQuote 
                  ? "w-6 bg-primary" 
                  : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 