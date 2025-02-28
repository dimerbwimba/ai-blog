"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface FloatingNotificationProps {
  type?: "newsletter" | "message"
  message?: string
  delay?: number // Delay in milliseconds before showing
}

export function FloatingNotification({
  type = "newsletter",
  message = "Get travel tips and exclusive content directly in your inbox!",
  delay = 2000
}: FloatingNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the notification before
    const dismissed = localStorage.getItem("notificationDismissed")
    if (dismissed) return

    // Show notification after delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem("notificationDismissed", "true")
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          source: 'floating-notification'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to subscribe')
      }

      toast.success("Thank you for subscribing!")
      handleDismiss()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  if (!isVisible || isDismissed) return null

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-[400px] bg-white rounded-lg shadow-lg border p-4 animate-in slide-in-from-bottom-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>

      {type === "newsletter" ? (
        <div className="space-y-3">
          <h3 className="font-semibold">Subscribe to Our Newsletter</h3>
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      ) : (
        <div className="pr-6">
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>
      )}
    </div>
  )
} 