"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const travelQuotes = [
  {
    quote: "Adventure is worthwhile in itself.",
    author: "Amelia Earhart"
  },
  {
    quote: "Travel makes one modest. You see what a tiny place you occupy in the world.",
    author: "Gustave Flaubert"
  },
  {
    quote: "Life is either a daring adventure or nothing at all.",
    author: "Helen Keller"
  },
  {
    quote: "The world is a book and those who do not travel read only one page.",
    author: "Saint Augustine"
  },
  {
    quote: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien"
  },
  {
    quote: "To travel is to live.",
    author: "Hans Christian Andersen"
  },
  {
    quote: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu"
  },
  {
    quote: "Travel far enough, you meet yourself.",
    author: "David Mitchell"
  }
]

export default function Loading() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % travelQuotes.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 px-4">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="space-y-2 animate-fade-in transition-all duration-500">
          <p className="text-2xl font-serif italic text-muted-foreground">
            "{travelQuotes[currentQuote].quote}"
          </p>
          <p className="text-sm text-muted-foreground">
            — {travelQuotes[currentQuote].author}
          </p>
        </div>

        <div className="flex justify-center gap-1.5 mt-8">
          {travelQuotes.map((_, index) => (
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