"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Link2, ChevronRight } from "lucide-react"

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement>
}

interface HeadingData {
  id: string
  text: string
  level: number
}

export function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingData[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // Extract headings from content
  useEffect(() => {
    if (!contentRef.current) return

    const elements = contentRef.current.querySelectorAll("h2")
    const headingData: HeadingData[] = Array.from(elements).map((element) => {
      // Generate id if not exists
      if (!element.id) {
        element.id = element.textContent?.toLowerCase().replace(/\W+/g, "-") || ""
      }

      return {
        id: element.id,
        text: element.textContent || "",
        level: parseInt(element.tagName[1]),
      }
    })

    setHeadings(headingData)
  }, [contentRef])

  // Track active heading on scroll
  useEffect(() => {
    if (!contentRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-100px 0% -80% 0%",
        threshold: 1.0,
      }
    )

    const elements = contentRef.current.querySelectorAll("h2")
    elements.forEach((elem) => observer.observe(elem))

    return () => observer.disconnect()
  }, [contentRef])

  if (headings.length === 0) return null

  return (
    <nav className="relative p-6 rounded-lg border border-blue-200 bg-blue-50/30 shadow-lg">
      <div className="flex justify-center items-center gap-2 mb-6 pb-4 border-b border-blue-200">
        <Link2 className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-blue-900">Quick Navigation</h2>
      </div>
      <div className="space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              })
            }}
            className={cn(
              "group flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-200",
              "hover:bg-blue-100/50 hover:text-blue-800",
              activeId === heading.id
                ? "bg-blue-100/50 text-blue-800 font-medium"
                : "text-blue-600"
            )}
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              "group-hover:translate-x-1",
              activeId === heading.id && "text-blue-600"
            )} />
            <span className="text-sm">{heading.text}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}