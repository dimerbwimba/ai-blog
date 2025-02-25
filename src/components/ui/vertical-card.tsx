import { CheckCircle, Circle, Loader2, MessageSquare, Pencil, Trash } from "lucide-react"
import { Card } from "./card"
import Image from "next/image"
import Link from "next/link"
import { formatDate, isUrlFormatCorrect } from "@/lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"
import DeleteAlert from "./delete-alert"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { toast } from "sonner"

export const VerticalCard = ({
    id,
    title,
    author,
    date,
    image,
    link,
    status,
    categories,
    onDelete,
}: {
    id: string,
    title: string,
    author: {
        name: string,
    },
    date: string,
    image: string,
    link: string,
    status: "DRAFTED" | "PUBLISHED" | "APPROVED" | "REJECTED",
    categories: {
        category: {
            name: string,
            slug: string
        }
    }[],
    onDelete: (id: string) => void,
}) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [isPublished, setIsPublished] = useState(false)

    const handlePublish = async () => {
        try {
            setIsPublishing(true)
            const response = await fetch(`/api/posts/${id}/publish`, {
                method: "PATCH",
            })
    
            if (!response.ok) {
                const error = await response.json()
                console.log(error)
                toast.error(error.message || "Failed to publish post")
            }
            setIsPublished(true)
            toast.success("Post published successfully, it will be visible in the next 24 hours")
        } catch (error) {
            console.log(error)
            setIsPublishing(false)
            toast.error(error instanceof Error ? error.message : "Failed to publish post")
        }
    }

    return (
        <TooltipProvider>
            <Card className="p-4 bg-white hover:bg-gray-50 transition-colors">
                <article className="flex gap-4">
                    <div className="flex-grow min-w-0">
                        <div className="text-red-600 font-bold uppercase text-xs tracking-wide mb-1">
                            {categories.map((category) => (
                                <span key={category.category.slug}>{category.category.name}</span>
                            ))}
                        </div>
                        <h2 className="text-base font-bold leading-snug mb-1">
                            <Link href={link} className="hover:text-blue-600">
                                {title}
                            </Link>
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">{author.name}</span>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <Badge variant={"outline"} className="text-xs">
                                    {status}
                                </Badge>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 my-2">
                            {formatDate(date)}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button size={"sm"}>
                                <Link href={link} className="flex items-center gap-2">
                                    <Pencil className="h-4 w-4" />
                                    Update
                                </Link>
                            </Button>
                            <Button size={"sm"} variant={"destructive"} onClick={() => setShowDeleteDialog(true)}>
                                <Trash className="h-4 w-4 mx-1" />
                                Delete
                            </Button>
                            {
                                status === "DRAFTED" &&
                                <Button disabled={isPublishing || isPublished} size={"sm"} variant={"outline"} onClick={handlePublish}>
                                    <CheckCircle className={isPublished ? "h-4 w-4 mx-1 text-green-500" : "h-4 w-4 mx-1 animate-pulse"} />
                                    {isPublished ? <span>Published</span> : <span>Publish your post</span>}
                                    {isPublishing && <Loader2 className="h-4 w-4 mx-1 animate-spin" />}
                                    
                                </Button>
                            }
                            {
                                status === "PUBLISHED" &&
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant={"outline"} className="text-xs py-1">
                                            <span className=" mx-2 inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                            <span>Waiting for approval</span>
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-medium">Your post is waiting for approval</p>
                                        <p className="">
                                            It typically takes up to 3 business
                                            <br/> days for our team to review and <br/>
                                            approve your post. We&apos;ll notify <br/> 
                                            you once the review is complete.</p>
                                    </TooltipContent>
                                </Tooltip>
                            }
                            {
                                status === "APPROVED" &&
                                <Badge variant={"secondary"} className="text-xs">
                                    <CheckCircle className="h-4 w-4 mx-1" />
                                    <span>Post has been approved</span>
                                </Badge>
                            }
                        </div>
                    </div>
                    <div className="flex-none relative w-24 h-24">
                        {
                            image && isUrlFormatCorrect(image) && (
                                <Image
                                    src={image}
                                    alt="Deportivo player"
                                    fill
                                    className="object-cover rounded"
                                />
                            )
                        }
                    </div>
                </article>
                <DeleteAlert
                    title={title}
                    toDelete={title}
                    onAfterDelete={() => {
                        onDelete(id)
                    }}
                    onClose={() => setShowDeleteDialog(false)}
                    showDeleteDialog={showDeleteDialog}
                    apiUrl={`/api/posts/${id}`}
                    idToDelete={id}
                />
            </Card>
        </TooltipProvider>
    )
}

