"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const destinationFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    country: z.string().min(3, "Country is required"),
    region: z.string().min(3, "Region is required"),
    image: z.string(),
    continent: z.string().min(3, "Continent is required"),
})

type DestinationFormValues = z.infer<typeof destinationFormSchema>

interface DestinationFormProps {
    initialData?: DestinationFormValues
    onSuccess?: () => void
    isEditing?: boolean
    destinationId?: string
}

export function DestinationForm({ 
    initialData,
    onSuccess,
    isEditing = false,
    destinationId 
}: DestinationFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<DestinationFormValues>({
        resolver: zodResolver(destinationFormSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            country: "",
            region: "",
            image: "",
            continent: "",
        },
    })

    async function onSubmit(data: DestinationFormValues) {
        try {
            setIsLoading(true)

            const url = isEditing 
                ? `/api/destinations/${destinationId}`
                : "/api/destinations"

            const method = isEditing ? "PATCH" : "POST"

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error(isEditing 
                    ? "Failed to update destination" 
                    : "Failed to create destination"
                )
            }

            toast.success(isEditing 
                ? "Destination updated successfully"
                : "Destination created successfully"
            )
            
            if (isEditing) {
                router.refresh()
                router.push("/dashboard/destinations")
            } else {
                form.reset()
                onSuccess?.()
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Paris" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe this destination..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. France" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Region</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Île-de-France" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="continent"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Continent</FormLabel>
                            <FormControl>
                                <Input placeholder="Europe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                                Optional: Add an image for this destination
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    {isEditing && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard/destinations")}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading 
                            ? (isEditing ? "Saving..." : "Creating...") 
                            : (isEditing ? "Save Changes" : "Create Destination")
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
} 