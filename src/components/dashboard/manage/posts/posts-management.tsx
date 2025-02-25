"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    CheckCircle,
    XCircle,
    Eye,
    Loader2,
    MessageSquare,
} from "lucide-react"
import { formatDate, isUrlFormatCorrect } from "@/lib/utils"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"

interface Post {
    id: string
    title: string
    image:string
    author: {
        name: string
        email: string
    }
    status: string
    createdAt: string
    updatedAt: string
}

export function PostsManagement() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
    const [feedback, setFeedback] = useState("")
    const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/posts/manage")
            const data = await response.json()

            if (!response.ok) throw new Error("Failed to fetch posts")

            setPosts(data)
        } catch {
            toast.error("Failed to load posts")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAction = async () => {
        if (!selectedPost || !actionType || !feedback.trim()) return

        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/posts/${selectedPost.id}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: actionType,
                    feedback,
                }),
            })

            if (!response.ok) throw new Error("Failed to update post status")

            toast.success(`Post ${actionType.toLowerCase()}ed successfully`)
            fetchPosts()
            handleCloseDialog()
        } catch {
            toast.error("Failed to update post status")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleOpenDialog = (post: Post, type: "APPROVED" | "REJECTED") => {
        setSelectedPost(post)
        setActionType(type)
        setShowFeedbackDialog(true)
    }

    const handleCloseDialog = () => {
        setSelectedPost(null)
        setActionType(null)
        setFeedback("")
        setShowFeedbackDialog(false)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            <div className="p-6">
                <div className=" gap-6">
                    {posts.map((post) => (
                        <article key={post.id} className="flex gap-4">
                            <div className="flex-grow min-w-0">
                                {/* <div className="text-red-600 font-bold uppercase text-xs tracking-wide mb-1">
                                    {post.categories.map((category) => (
                                        <span key={category.category.slug}>{category.category.name}</span>
                                    ))}
                                </div> */}
                                <h2 className="text-base font-bold leading-snug mb-1">
                                    <Link href={""} className="hover:text-blue-600">
                                        {post.title}
                                    </Link>
                                </h2>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="font-medium">{post.author.name}</span>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        <Badge variant={"outline"} className="text-xs">
                                            {post.status}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 my-2">
                                    {formatDate(post.createdAt)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button size={"sm"} variant={"outline"} className="text-xs flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        View
                                    </Button>
                                    <Button
                                        size={"sm"}
                                        variant={"default"} 
                                        className="text-xs flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                        onClick={() => handleOpenDialog(post, "APPROVED")}
                                    >
                                        <CheckCircle className="h-3 w-3" />
                                        Approve
                                    </Button>
                                    <Button 
                                        size={"sm"}
                                        variant={"destructive"} 
                                        className="text-xs flex items-center gap-1"
                                        onClick={() => handleOpenDialog(post, "REJECTED")}
                                    >
                                        <XCircle className="h-3 w-3" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-none relative w-24 h-24">
                                {
                                    post.image && isUrlFormatCorrect(post.image) && (
                                        <Image
                                            src={post.image}
                                            alt="Deportivo player"
                                            fill
                                            className="object-cover rounded"
                                        />
                                    )
                                }
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "APPROVED" ? "Approve" : "Reject"} Post
                        </DialogTitle>
                        <DialogDescription>
                            Provide feedback to the author about your decision
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <h3 className="font-medium">Feedback Message</h3>
                            <Textarea
                                placeholder="Enter your feedback..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAction}
                            disabled={isSubmitting || !feedback.trim()}
                            variant={actionType === "APPROVED" ? "default" : "destructive"}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Send Feedback
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
} 