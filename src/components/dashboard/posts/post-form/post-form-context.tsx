"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Separator } from "@/components/ui/separator"
import { Layers, MapPin, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"

interface PostFormContextProps {
  form: UseFormReturn<any>
}

export function PostFormContext({ form }: PostFormContextProps) {
  const [categories, setCategories] = useState([])
  const [destinations, setDestinations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Watch form values for real-time updates
  const selectedDestinations = form.watch('destinations') || []
  const selectedCategories = form.watch('categories') || []
  
  const hasErrors = !selectedDestinations.length || !selectedCategories.length
  const maxCategoriesReached = selectedCategories.length >= 2

  useEffect(() => {
    // Load both categories and destinations on mount
    Promise.all([loadCategories(), loadDestinations()])
  }, [])

  async function loadCategories() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/categories")
      if (!response.ok) {
        throw new Error("Failed to load categories")
      }
      const data = await response.json()
      setCategories(data)
    } catch (error:any) {
      console.error("[LOAD_CATEGORIES_ERROR]", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadDestinations() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/destinations")
      if (!response.ok) {
        throw new Error("Failed to load destinations")
      }4
      const data = await response.json()
      setDestinations(data)
    } catch (error:any) {
      console.error("[LOAD_DESTINATIONS_ERROR]", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDestinationSelect = (destinationId: string) => {
    // Always replace the current destination with the new one
    form.setValue('destinations', [destinationId], { shouldValidate: true })
  }

  const handleCategorySelect = (categoryId: string) => {
    const currentCategories = form.getValues('categories') || []
    if (currentCategories.includes(categoryId)) {
      // Allow removing if already selected
      const newCategories = currentCategories.filter((id: string) => id !== categoryId)
      form.setValue('categories', newCategories, { shouldValidate: true })
    } else if (currentCategories.length < 2) {
      // Only allow adding if under the limit
      form.setValue('categories', [...currentCategories, categoryId], { shouldValidate: true })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={hasErrors ? "destructive" : "outline"} className="w-full">
          <Layers className="w-4 h-4 mr-2" />
          <div>
            Post Context {hasErrors ? '(Required)' : ''}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Post Context</DialogTitle>
          <DialogDescription>
            Select one destination and up to two categories for your post
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4">
          <div className="grid max-w-lg gap-6 py-4 w-full">
            <FormField
              control={form.control}
              name="destinations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Destination</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedDestinations.length}/1 selected
                    </span>
                  </FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {destinations.length === 0 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadDestinations()}
                        className="col-span-3 mb-2"
                        disabled={isLoading}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Load Destinations
                      </Button>
                    ) : (
                      destinations.map((destination: any) => (
                        <Button
                          key={destination.id}
                          size="sm"
                          variant={selectedDestinations.includes(destination.id) ? "default" : "outline"}
                          onClick={() => handleDestinationSelect(destination.id)}
                        >
                          {destination.name}
                        </Button>
                      ))
                    )}
                  </div>
                  <FormDescription>
                    Choose one destination for this post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Layers className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Categories</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedCategories.length}/2 selected
                    </span>
                  </FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.length === 0 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadCategories()}
                        className="col-span-3 mb-2"
                        disabled={isLoading}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Load Categories
                      </Button>
                    ) : (
                      categories.map((category: any) => {
                        const isSelected = selectedCategories.includes(category.id)
                        return (
                          <Button
                            key={category.id}
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => handleCategorySelect(category.id)}
                            disabled={!isSelected && maxCategoriesReached}
                          >
                            {category.name}
                          </Button>
                        )
                      })
                    )}
                  </div>
                  <FormDescription>
                    Choose up to two categories for this post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}