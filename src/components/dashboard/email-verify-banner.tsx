"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/use-local-storage"

export const EmailVerifyBanner = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const { setItem } = useLocalStorage()

  // Initialize timeLeft from localStorage on mount
  useEffect(() => {
    const storedTime = window.localStorage.getItem('emailVerificationTimeout')
    if (storedTime) {
      const remaining = parseInt(storedTime) - Date.now()
      if (remaining > 0) {
        setTimeLeft(remaining)
      } else {
        window.localStorage.removeItem('emailVerificationTimeout')
      }
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (!timeLeft) {
      setItem('emailVerificationTimeout', '')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(current => {
        if (!current || current <= 1000) {
          setItem('emailVerificationTimeout', '')
          return null
        }
        return current - 1000
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, setItem])

  const handleVerification = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/user/verify-email", {
        method: "POST"
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          const newTimeLeft = data.timeLeft
          setTimeLeft(newTimeLeft)
          setItem('emailVerificationTimeout', (Date.now() + newTimeLeft).toString())
          throw new Error("Please wait before requesting another email")
        }
        throw new Error()
      }

      const newTimeLeft = 600000 // 10 minutes
      setTimeLeft(newTimeLeft)
      setItem('emailVerificationTimeout', (Date.now() + newTimeLeft).toString())
      toast.success("Verification email sent! Please check your inbox.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send verification email")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Button 
      className="px-4 h-8 text-sm font-medium"
      onClick={handleVerification}
      disabled={isLoading || !!timeLeft}
    >
      {isLoading ? "Sending..." : 
       timeLeft ? `Resend in ${formatTime(timeLeft)}` : 
       "Verify Email"}
    </Button>
  )
} 