"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Destination {
  id: string
  name: string
  country: string
  continent: string
  region?: string | null
}

const formSchema = z.object({
  source: z.enum(["booking", "airbnb", "expedia"], {
    required_error: "Please select a source",
  }),
  destinationId: z.string({
    required_error: "Please select a destination",
  }),
})

interface ScrapingFormProps {
  onSuccess: () => void
}

export function ScrapingForm({ onSuccess }: ScrapingFormProps) {
  const [loading, setLoading] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [logs, setLogs] = useState<Array<{message: string, type: 'info' | 'success' | 'error'}>>(() => {
    // Try to restore logs from localStorage
    const savedLogs = localStorage.getItem('scraping_logs')
    return savedLogs ? JSON.parse(savedLogs) : []
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: "booking",
    },
  })

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scraping_logs', JSON.stringify(logs))
  }, [logs])

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations')
        const data = await response.json()
        setDestinations(data)
      } catch (error) {
        console.error('Error fetching destinations:', error)
        toast.error('Failed to load destinations')
      }
    }

    fetchDestinations()
  }, [])

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => {
      const newLogs = [...prev, { message, type }]
      localStorage.setItem('scraping_logs', JSON.stringify(newLogs))
      return newLogs
    })
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setLogs([]) // Clear previous logs
      localStorage.removeItem('scraping_logs') // Clear saved logs
      
      const destination = destinations.find(d => d.id === values.destinationId)
      if (!destination) throw new Error("Destination not found")

      addLog("Starting scraping process...", "info")
      addLog(`Source: ${values.source}`, "info")
      addLog(`Location: ${destination.name}, ${destination.country}`, "info")
      
      const response = await fetch("/api/hotels/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: values.source,
          location: `${destination.name}, ${destination.country}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to scrape hotels")
      }

      const data = await response.json()
      
      addLog(`Found ${data.totalResults} properties`, "success")
      addLog("Breakdown:", "info")
      addLog(`- Hotels: ${data.breakdown.hotels}`, "info")
      addLog(`- Resorts: ${data.breakdown.resorts}`, "info")
      addLog(`- Apartments: ${data.breakdown.apartments}`, "info")
      addLog(`- 5-star properties: ${data.breakdown.fiveStarHotels}`, "info")
      
      addLog("Scraping completed successfully!", "success")
      onSuccess()
    } catch (error) {
      console.error(error)
      addLog("Failed to scrape hotels", "error")
      toast.error("Failed to scrape hotels")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="booking">Booking.com</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="expedia">Expedia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the source to scrape from
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {destinations.map((destination) => (
                        <SelectItem key={destination.id} value={destination.id}>
                          {destination.name}, {destination.country}
                          {destination.region && ` (${destination.region})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the destination to scrape accommodations for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Scraping..." : "Start Scraping"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Scraping Progress</h3>
          {loading && (
            <Badge variant="secondary" className="animate-pulse">
              In Progress
            </Badge>
          )}
        </div>
        <Separator className="my-4" />
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "text-sm py-1",
                  log.type === 'error' && "text-red-500",
                  log.type === 'success' && "text-green-500",
                  log.type === 'info' && "text-muted-foreground"
                )}
              >
                {log.message}
              </div>
            ))}
            {loading && logs.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Waiting to start...
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
} 