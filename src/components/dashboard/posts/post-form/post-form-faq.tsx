"use client"

import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus,XCircle, AlertCircle } from "lucide-react"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PostFormFAQProps {
    form: UseFormReturn<any>
}

export function PostFormFAQ({ form }: PostFormFAQProps) {
    const faqs = form.watch('faqs') || []
    const faqsError = form.formState.errors.faqs
    const showError = faqsError && faqs.length < 3

    const handleAddFAQ = () => {
        const currentFaqs = form.getValues('faqs') || []
        form.setValue('faqs', [
            ...currentFaqs,
            { question: '', answer: '' }
        ], { shouldValidate: true })
    }

    const handleRemoveFAQ = (index: number) => {
        const currentFaqs = form.getValues('faqs') || []
        form.setValue('faqs', currentFaqs.filter((_: any, i: number) => i !== index), { shouldValidate: true })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={showError ? "destructive" : "outline"}
                    className="w-full text-center h-10"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    <div>
                        Add FAQ ({faqs.length}/3 minimum)
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px] h-[500px] overflow-y-auto">
                <DialogHeader className="text-center">
                    <DialogTitle>Add FAQ</DialogTitle>
                    <DialogDescription>
                        Add at least 3 FAQs to improve your post&apos;s SEO and user experience
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center">
                    <div className="space-y-4 max-w-lg flex flex-col gap-4">
                        <div className="flex text-center flex-col justify-center items-center">
                            <div className="text-lg font-semibold">Frequently Asked Questions</div>
                            <p className="text-sm text-muted-foreground">
                                Add questions and answers that your readers might have about this post.
                                This helps with SEO and makes your content more accessible.
                            </p>
                        </div>

                        {showError && (
                            <Alert className=" flex items-center justify-center sticky top-0 bg-gray-100  z-50" variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    At least 3 FAQs are required
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            {faqs.map((_: any, index: number) => (
                                <div key={index} className="relative space-y-2 rounded-lg border p-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-2"
                                        onClick={() => handleRemoveFAQ(index)}
                                        disabled={faqs.length <= 3}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>

                                    <FormField
                                        control={form.control}
                                        name={`faqs.${index}.question`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Question {index + 1}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter FAQ question" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`faqs.${index}.answer`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Answer {index + 1}</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter FAQ answer"
                                                        className="min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                        <Separator />

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddFAQ}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add FAQ
                        </Button>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}