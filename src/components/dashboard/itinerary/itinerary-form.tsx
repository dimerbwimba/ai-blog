"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addDays } from "date-fns"
import { useRouter } from "next/navigation"

interface Destination {
  id: string;
  name: string;
}

const formSchema = z.object({
  city: z.string().min(1, "City is required"),
  destinationId: z.string().min(1, "Destination is required"),
  travelType: z.enum(["BUDGET", "STANDARD", "LUXURY"], {
    required_error: "Travel type is required",
  }),
  duration: z.enum(["1_DAY", "3_DAYS", "1_WEEK", "2_WEEKS"], {
    required_error: "Duration is required",
  }),
  isPublic: z.boolean().default(false),
})

interface ItineraryFormProps {
  onSuccess: () => void
}

export function ItineraryForm({ onSuccess }: ItineraryFormProps) {
  const [loading, setLoading] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loadingDestinations, setLoadingDestinations] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations');
        if (response.ok) {
          const data = await response.json();
          setDestinations(data);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        toast.error('Failed to load destinations');
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchDestinations();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      destinationId: "",
      travelType: "STANDARD",
      duration: "3_DAYS",
      isPublic: false,
    },
  })

  const watchCity = form.watch("city");
  
  useEffect(() => {
    if (watchCity && destinations.length > 0) {
      const matchingDestination = destinations.find(
        dest => dest.name.toLowerCase().includes(watchCity.toLowerCase())
      );
      
      if (matchingDestination) {
        form.setValue("destinationId", matchingDestination.id);
      }
    }
  }, [watchCity, destinations, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      
      const startDate = new Date()
      let endDate: Date
      
      switch (values.duration) {
        case "1_DAY":
          endDate = addDays(startDate, 1)
          break
        case "3_DAYS":
          endDate = addDays(startDate, 3)
          break
        case "1_WEEK":
          endDate = addDays(startDate, 7)
          break
        case "2_WEEKS":
          endDate = addDays(startDate, 14)
          break
        default:
          endDate = addDays(startDate, 3)
      }
      
      const fallbackBody = {
        city: values.city,
        travelType: values.travelType,
        duration: values.duration,
        days: [],
        notes: `${values.travelType.toLowerCase()} travel to ${values.city}`,
        budget: {
          currency: "USD",
          total: 0,
          categories: {}
        }
      }
      
      let generatedItinerary = fallbackBody
      
      try {
        const generateResponse = await fetch("/api/itineraries/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: values.city,
            travelType: values.travelType,
            duration: values.duration,
          }),
        })

        if (generateResponse.ok) {
          const data = await generateResponse.json()
          if (data) {
            generatedItinerary = data
          }
        }
      } catch (genError) {
        console.error("Error generating itinerary:", genError)
      }
      
      const itineraryData = {
        title: `Trip to ${values.city}`,
        description: `${values.travelType.toLowerCase()} travel to ${values.city}`,
        startDate,
        endDate,
        city: values.city,
        travelType: values.travelType,
        duration: values.duration,
        isPublic: values.isPublic,
        destinationId: values.destinationId,
        body: generatedItinerary
      }
      
      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itineraryData),
      })

      if (!response.ok) {
        throw new Error("Failed to create itinerary")
      }

      const createdItinerary = await response.json()
      onSuccess()
      
    } catch (error) {
      console.error("Error creating itinerary:", error)
      toast.error("Failed to create itinerary")
    } finally {
      setLoading(false)
    }
  }

  const handleTravelTypeSelect = (value: "BUDGET" | "STANDARD" | "LUXURY") => {
    form.setValue("travelType", value);
  }

  const handleDurationSelect = (value: "1_DAY" | "3_DAYS" | "1_WEEK" | "2_WEEKS") => {
    form.setValue("duration", value);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination City</FormLabel>
              <FormControl>
                <Input placeholder="Paris, Tokyo, New York..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="travelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Style</FormLabel>
                <div className="flex flex-col gap-2">
                  <Button 
                    type="button"
                    variant={field.value === "BUDGET" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleTravelTypeSelect("BUDGET")}
                  >
                    <div className="flex items-center gap-2">
                      <span role="img" aria-label="budget">💰</span>
                      <span>Budget</span>
                    </div>
                  </Button>
                  <Button 
                    type="button"
                    variant={field.value === "STANDARD" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleTravelTypeSelect("STANDARD")}
                  >
                    <div className="flex items-center gap-2">
                      <span role="img" aria-label="standard">✈️</span>
                      <span>Standard</span>
                    </div>
                  </Button>
                  <Button 
                    type="button"
                    variant={field.value === "LUXURY" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleTravelTypeSelect("LUXURY")}
                  >
                    <div className="flex items-center gap-2">
                      <span role="img" aria-label="luxury">👑</span>
                      <span>Luxury</span>
                    </div>
                  </Button>
                </div>
                <FormDescription>
                  Your preferred travel style
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Duration</FormLabel>
                <div className="flex flex-col gap-2">
                  <Button 
                    type="button"
                    variant={field.value === "1_DAY" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleDurationSelect("1_DAY")}
                  >
                    1 Day
                  </Button>
                  <Button 
                    type="button"
                    variant={field.value === "3_DAYS" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleDurationSelect("3_DAYS")}
                  >
                    3 Days
                  </Button>
                  <Button 
                    type="button"
                    variant={field.value === "1_WEEK" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleDurationSelect("1_WEEK")}
                  >
                    1 Week
                  </Button>
                  <Button 
                    type="button"
                    variant={field.value === "2_WEEKS" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleDurationSelect("2_WEEKS")}
                  >
                    2 Weeks
                  </Button>
                </div>
                <FormDescription>
                  Length of your trip
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Itinerary</FormLabel>
                <FormDescription>
                  Make this itinerary visible to other users
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Trip Plan
        </Button>
      </form>
    </Form>
  )
} 