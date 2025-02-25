"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { EmailVerifyBanner } from "../dashboard/email-verify-banner"
import { CircleCheck } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    image: z.string().url().optional(),
})

interface SettingsFormProps {
    initialData: {
        name: string
        email: string
        image?: string | null
    }
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const { update, data } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name,
            email: initialData.email,
            image: initialData.image || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)

            // Make API call to update user settings
            const response = await fetch("/api/user/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    currentEmail: initialData.email // Pass current email for comparison
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to update settings")
            }

            const updatedUser = await response.json()

            // Update session with new data
            await update({
                ...updatedUser,
            })

            if (values.email !== initialData.email) {
                toast.warning("Please verify your new email address")
            } else {
                toast.success("Settings updated successfully")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full bg-white shadow-none">
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className=" bg-green-50 p-2 rounded-md">

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-row items-center p-4 gap-2">
                                <div className="text-sm w-3/4 pr-10 py-3 text-gray-500">
                                    <span className="font-bold">Note:</span>
                                    If you change your email, you will need to verify it again.
                                </div>
                                {/* Email Verification Status */}
                                <div className="flex justify-end">
                                {data?.user?.emailVerified ? (
                                    <span className="text-sm flex flex-row items-center text-center text-white bg-green-500 px-2 py-1 rounded-md">
                                        
                                        <CircleCheck className="w-4 h-4" />
                                        <span className="">Email Verified</span>
                                    </span>
                                ) : (
                                    <EmailVerifyBanner />
                                )}
                                </div>
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Image URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://example.com/image.jpg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter a URL for your profile image
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant="outline" className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
} 