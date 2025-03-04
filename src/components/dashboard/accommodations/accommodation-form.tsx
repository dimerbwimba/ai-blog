"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
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
import { JsonPreviewer } from "@/components/shared/json-previewer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  jsonData: z.string().min(1, "JSON data is required").refine(
    (data) => {
      try {
        JSON.parse(data)
        return true
      } catch {
        return false
      }
    },
    {
      message: "Invalid JSON format",
    }
  ),
  destinationId: z.string().min(1, "Destination is required"),
})

interface Destination {
  id: string
  name: string
  country: string
}

export function AccommodationForm() {
  const [loading, setLoading] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jsonData: "",
      destinationId: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      
      const response = await fetch("/api/accommodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonData: JSON.parse(values.jsonData),
          destinationId: values.destinationId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save accommodation")
      }

      toast.success("Accommodation data saved successfully")
      router.refresh()
      form.reset()
    } catch (error) {
      console.error(error)
      toast.error("Failed to save accommodation data")
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="destinationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {destinations.map((destination) => (
                    <SelectItem key={destination.id} value={destination.id}>
                      {destination.name}, {destination.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jsonData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accommodation Data</FormLabel>
              <FormControl>
                <JsonPreviewer
                  value={field.value}
                  onChange={field.onChange}
                  className=" h-full"
                />
              </FormControl>
              <FormDescription>
                Enter the accommodation data in JSON format
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Accommodation
        </Button>
      </form>
    </Form>
  )
} 