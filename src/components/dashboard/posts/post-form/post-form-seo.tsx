"use client"

import { Badge } from "@/components/ui/badge"
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
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Cog, Plus, X } from "lucide-react"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"

interface PostFormSeoProps {
    form: UseFormReturn<any>
}

function checkErrors(form: UseFormReturn<any>) {
    const titleError = form.formState.errors.title
    const slugError = form.formState.errors.slug
    const descriptionError = form.formState.errors.description
    const tagsError = form.formState.errors.tags
    const keywordsError = form.formState.errors.keywords
    
    return !!(titleError || slugError || descriptionError || tagsError || keywordsError)
}

export function PostFormSeo({ form }: PostFormSeoProps) {
    const [tagInput, setTagInput] = useState("")
    const [keywordInput, setKeywordInput] = useState("")
    const hasErrors = checkErrors(form)



    const handleAddTag = () => {
        if (tagInput.trim()) {
            const currentTags = form.getValues("tags") || []
            form.setValue("tags", [...currentTags, tagInput.trim()])
            setTagInput("")
        }
    }

    const handleAddKeyword = () => {
        if (keywordInput.trim()) {
            const currentKeywords = form.getValues("keywords") || []
            form.setValue("keywords", [...currentKeywords, keywordInput.trim()])
            setKeywordInput("")
        }
    }

    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button   variant={hasErrors ? "destructive" : "outline"} className="w-full text-center h-10">
                    <Cog className="w-4 h-4 mr-2" />
                    <div>
                        SEO Settings
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px] h-screen overflow-y-auto">
                <DialogHeader className=" text-center">
                    <DialogTitle>SEO Settings</DialogTitle>
                    <DialogDescription>
                        Optimize your post for search engines
                    </DialogDescription>
                </DialogHeader>
                <div className=" grid grid-cols-12 gap-4">
                    <div className="col-span-2">

                    </div>
                    <div className="col-span-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter post title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The title that will appear in search results
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SEO Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="post-url-slug"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The URL-friendly version of the title
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief description for search results"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This appears in search engine results
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <div className="flex gap-2">
                                            <Input
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                placeholder="Add a tag"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        handleAddTag()
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={handleAddTag}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(field.value || []).map((tag: string) => (
                                                <Badge key={tag} variant="secondary">
                                                    {tag}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="ml-2 h-auto p-0"
                                                        onClick={() => {
                                                            field.onChange(
                                                                (field.value || []).filter((t: string) => t !== tag)
                                                            )
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <FormDescription>
                                            Tags help categorize your content
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="keywords"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Keywords</FormLabel>
                                        <div className="flex gap-2">
                                            <Input
                                                value={keywordInput}
                                                onChange={(e) => setKeywordInput(e.target.value)}
                                                placeholder="Add a keyword"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        handleAddKeyword()
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={handleAddKeyword}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(field.value || []).map((keyword: string) => (
                                                <Badge key={keyword} variant="secondary">
                                                    {keyword}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="ml-2 h-auto p-0"
                                                        onClick={() => {
                                                            field.onChange(
                                                                (field.value || []).filter((k: string) => k !== keyword)
                                                            )
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <FormDescription>
                                            Keywords for search engine optimization
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="col-span-2">

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}