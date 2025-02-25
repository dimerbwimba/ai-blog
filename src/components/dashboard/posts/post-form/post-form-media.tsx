"use client"

import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"

interface PostFormMediaProps {
    form: UseFormReturn<any>
}

export function PostFormMedia({ form }: PostFormMediaProps) {
    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <Input
                            placeholder="seo-friendly-url"
                            {...field}
                        />
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
} 