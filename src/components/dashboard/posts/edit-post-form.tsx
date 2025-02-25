'use client'

import { PostForm } from "@/components/dashboard/posts/post-form"
import { useEffect, useState } from "react"
import { PostFormSkeleton } from "@/components/dashboard/posts/post-form-skeleton"
import { notFound } from "next/navigation"

interface EditPostFormProps {
    id: string
}

export function EditPostForm({ id }: EditPostFormProps) {
    const [post, setPost] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${id}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error("Failed to fetch post")
                }


                setPost(data)
            } catch (error) {
                console.error(error)
                notFound()
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [id])

    if (isLoading) {
        return <PostFormSkeleton />
    }

    if (!post) {
        return null
    }

    return (
        <PostForm
            initialData={{
                title: post.title,
                content: post.content,
                slug: post.slug,
                description: post.description,
                image: post.image,
                status: post.status,
                featured: post.featured,
                destinations: post.destinations?.map((d: any) => d.destinationId) || [],
                categories: post.categories?.map((c: any) => c.categoryId) || [],
                tags: post.tags || [],
                keywords: post.keywords || [],
                faqs: post.faqs || [],
            }}
            postId={post.id}
        />
    )
} 