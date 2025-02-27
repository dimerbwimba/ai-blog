"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const categoryQuotes = [
  {
    quote: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.",
    author: "Marcel Proust"
  },
  {
    quote: "One's destination is never a place, but a new way of seeing things.",
    author: "Henry Miller"
  },
  {
    quote: "The world is full of magical things patiently waiting for our senses to grow sharper.",
    author: "W.B. Yeats"
  },
  {
    quote: "Life is a collection of moments and experiences that shape who we are.",
    author: "Unknown"
  },
  {
    quote: "Every place has a story waiting to be discovered.",
    author: "Unknown"
  },
  {
    quote: "The beauty of the world lies in the diversity of its people.",
    author: "Unknown"
  },
  {
    quote: "Exploration is really the essence of the human spirit.",
    author: "Frank Borman"
  },
  {
    quote: "The universe is full of magical things patiently waiting for our wits to grow sharper.",
    author: "Eden Phillpotts"
  }
]

export default function Loading() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % categoryQuotes.length)
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
              Discovering categories...
            </span>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div 
          key={currentQuote} 
          className="space-y-2 animate-fade-in transition-all duration-500"
        >
          <p className="text-2xl font-serif italic text-muted-foreground">
            "{categoryQuotes[currentQuote].quote}"
          </p>
          <p className="text-sm text-muted-foreground">
            — {categoryQuotes[currentQuote].author}
          </p>
        </div>

        <div className="flex justify-center gap-1.5 mt-8">
          {categoryQuotes.map((_, index) => (
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