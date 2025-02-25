"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Form,
} from "@/components/ui/form"
import { PostFormToolbar } from "./post-form-toolbar"
import { PostFormMedia } from "./post-form-media"
import { PostFormContext } from "./post-form-context"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PostFormSeo } from "./post-form-seo"
import { PostFormSettings } from "./post-form-settings"
import { PostFormEditor } from "./post-form-editor"
import { PostFormFAQ } from "./post-form-faq"

const postFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    image: z.string()
      .min(1, "Image is required")
      .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
        message: "Image URL must start with http:// or https://"
      }),
    status: z.enum(["DRAFTED", "PUBLISHED"]).default("DRAFTED"),
    featured: z.boolean().default(false),
    destinations: z.array(z.string()).min(1, "At least one destination is required"),
    categories: z.array(z.string()).min(1, "At least one category is required"),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    faqs: z.array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    ).min(3, "At least 3 FAQs are required"),
})

type PostFormValues = z.infer<typeof postFormSchema>

const defaultValues: PostFormValues = {
    title: "",
    content: "",
    slug: "",
    description: "",
    image: "",
    status: "DRAFTED",
    featured: false,
    destinations: [
        
    ],
    categories: [

    ],
    tags: [],
    keywords: [],
    faqs: [],
}

interface PostFormProps {
  initialData?: PostFormValues
  postId?: string
}

export function PostForm({ initialData, postId }: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialData || defaultValues,
  })

  async function onSubmit(data: PostFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch(
        postId ? `/api/posts/${postId}` : "/api/posts", 
        {
          method: postId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        if (error.error) {
          throw new Error(Array.isArray(error.error) 
            ? error.error[0].message 
            : error.error)
        }
        throw new Error(postId ? "Failed to update post" : "Failed to create post")
      }

      const post = await response.json()
      
      toast.success(postId ? "Post updated successfully" : "Post created successfully")
      router.push(`/dashboard/posts/${post.id}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <div className="">
        <div className="col-span-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <PostFormToolbar 
              onSubmit={() => form.handleSubmit(onSubmit)} 
              isLoading={isLoading}
              isEditing={!!postId}
            />
            <PostFormMedia form={form} />
            <div className="grid grid-cols-2 gap-4">
              <PostFormSeo form={form} />
              <PostFormSettings form={form} />
              <PostFormContext form={form} />
              
            <PostFormFAQ form={form} />
            </div>
            <PostFormEditor form={form} />
          </form>
        </div>
      </div>
    </Form>
  )
} 