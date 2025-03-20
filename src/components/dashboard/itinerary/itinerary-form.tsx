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
import { addDays } from "date-fns"
import { useRouter } from "next/navigation"
import { Combobox } from "@/components/ui/combobox"
import { CitiesService, type City } from "@/services/cities.service"
import { useDebouncedCallback } from "use-debounce"

interface Destination {
  id: string;
  name: string;
}

const formSchema = z.object({
  city: z.object({
    name: z.string(),
    country: z.string(),
    countryCode: z.string(),
  }, {
    required_error: "Please select a city",
  }),
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

// Add this type for better error handling
type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
}

export function ItineraryForm({ onSuccess }: ItineraryFormProps) {
  const [loading, setLoading] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loadingDestinations, setLoadingDestinations] = useState(true)
  const router = useRouter()
  const [cities, setCities] = useState<City[]>([])
  const [searchingCities, setSearchingCities] = useState(false)

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

  // Load popular cities on mount
  useEffect(() => {
    const loadPopularCities = async () => {
      const popularCities = await CitiesService.getPopularCities()
      setCities(popularCities)
    }
    loadPopularCities()
  }, [])

  // Debounced city search
  const searchCities = useDebouncedCallback(async (query: string) => {
    if (query.length < 2) return
    
    setSearchingCities(true)
    try {
      const results = await CitiesService.searchCities(query)
      setCities(results)
    } catch (error) {
      console.error('Error searching cities:', error)
      toast.error('Failed to search cities')
    } finally {
      setSearchingCities(false)
    }
  }, 300)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: { name: "", country: "", countryCode: "" },
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
        dest => dest.name.toLowerCase().includes(watchCity.name.toLowerCase())
      );
      
      if (matchingDestination) {
        form.setValue("destinationId", matchingDestination.id);
      }
    }
  }, [watchCity, destinations, form]);

  const handleTravelTypeSelect = (value: "BUDGET" | "STANDARD" | "LUXURY") => {
    form.setValue("travelType", value, { shouldValidate: true });
  }

  const handleDurationSelect = (value: "1_DAY" | "3_DAYS" | "1_WEEK" | "2_WEEKS") => {
    form.setValue("duration", value, { shouldValidate: true });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      setLoading(true);

      // Validate destination ID
      if (!values.destinationId) {
        toast.error("Please select a valid destination");
        setLoading(false);
        return;
      }

      // Create dates
      const startDate = new Date();
      let endDate: Date;
      
      switch (values.duration) {
        case "1_DAY":
          endDate = addDays(startDate, 1);
          break;
        case "3_DAYS":
          endDate = addDays(startDate, 3);
          break;
        case "1_WEEK":
          endDate = addDays(startDate, 7);
          break;
        case "2_WEEKS":
          endDate = addDays(startDate, 14);
          break;
        default:
          endDate = addDays(startDate, 3);
      }

      // Generate itinerary
      let generatedItinerary;
      try {
        const generateResponse = await fetch("/api/itineraries/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: values.city.name,
            travelType: values.travelType,
            duration: values.duration,
          }),
        });


        if (!generateResponse.ok) {
          const error = await generateResponse.json() as ApiError;
          throw new Error(error.message || "Failed to generate itinerary");
        }

        generatedItinerary = await generateResponse.json();
      } catch (genError) {
        generatedItinerary = {
          city: values.city.name,
          travelType: values.travelType,
          duration: values.duration,
          days: [],
          notes: `${values.travelType.toLowerCase()} travel to ${values.city.name}`,
          budget: {
            currency: "USD",
            total: 0,
            categories: {}
          }
        };
      }

      // Create itinerary
      const itineraryData = {
        title: `Trip to ${values.city.name}`,
        description: `${values.travelType.toLowerCase()} travel to ${values.city.name}`,
        startDate,
        endDate,
        city: values.city.name,
        travelType: values.travelType,
        duration: values.duration,
        isPublic: values.isPublic,
        destinationId: values.destinationId,
        body: generatedItinerary
      };

      console.log("Creating itinerary with data:", itineraryData);

      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itineraryData),
      });

      console.log("Creation response status:", response.status);

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw new Error(error.message || "Failed to create itinerary");
      }

      const createdItinerary = await response.json();
      console.log("Created itinerary:", createdItinerary);

      toast.success("Itinerary created successfully!");
      onSuccess();
      router.refresh();
    } catch (error: any) {
      console.error("Error creating itinerary:", error);
      toast.error(error.message || "Failed to create itinerary");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination City</FormLabel>
              <FormControl>
                <Combobox
                  options={cities.map(city => ({
                    label: `${city.name}, ${city.country}`,
                    value: JSON.stringify(city)
                  }))}
                  value={field.value ? JSON.stringify(field.value) : ''}
                  onSelect={(value) => {
                    const city = JSON.parse(value)
                    field.onChange(city)
                    // Auto-set destination if matches
                    const matchingDestination = destinations.find(
                      dest => dest.name.toLowerCase().includes(city.name.toLowerCase())
                    )
                    if (matchingDestination) {
                      form.setValue("destinationId", matchingDestination.id)
                    }
                  }}
                  placeholder="Search for a city..."
                />
              </FormControl>
              <FormDescription>
                Start typing to search for cities worldwide
              </FormDescription>
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

        <Button 
          type="submit" 
          onClick={() => {
            alert("Are you sure you want to create this itinerary?");
          }}
          // disabled={loading || !form.formState.isValid}
          className="w-full bg-neutral-800 hover:bg-neutral-700 text-white"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Trip Plan
        </Button>
      </form>
    </Form>
  );
} 