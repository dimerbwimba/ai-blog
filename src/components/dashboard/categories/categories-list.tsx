"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Skeleton } from "@/components/ui/skeleton"
import DeleteAlert from "@/components/ui/delete-alert"
import { Separator } from "@/components/ui/separator"

interface Category {
    id: string
    name: string
    description: string
    slug: string
    postsCount: number
    createdAt: string
}

export function CategoriesList() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories')
                const data = await response.json()
                setCategories(data)
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (isLoading) {
        return <div>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Name</TableHead>
                 <TableHead>Description</TableHead>
                 <TableHead>Posts</TableHead>
                 <TableHead>Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {Array.from({ length: 4 }).map((_, index) => (
                 <TableRow key={index}>
                   <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
        </div>
    }   

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category)
        setShowDeleteDialog(true)
    }
    const handleAfterDelete = (id: string) => {
        setCategories(categories.filter(category => category.id !== id))
    }


    return (
        <>
        <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
                You&apos;ve published {categories.length} categories
            </h1>
        </div>
        <Separator className="my-4" />
        <div className="rounded-md border">

                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead className="font-bold">Name</TableHead>
                            <TableHead className="font-bold">Slug</TableHead>
                            <TableHead className="font-bold">Posts</TableHead>
                            <TableHead className="font-bold">Created</TableHead>
                            <TableHead className="font-bold w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell className="">{category.slug}</TableCell>
                                <TableCell>{category.postsCount}</TableCell>
                                <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleDeleteClick(category)} className="text-red-600">
                                                <Trash className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <DeleteAlert
                title="Delete Category"
                idToDelete={categoryToDelete?.id || ""}
                toDelete={categoryToDelete?.name || ""}
                showDeleteDialog={showDeleteDialog}
                onClose={setShowDeleteDialog}
                onAfterDelete={handleAfterDelete}
                apiUrl="/api/categories"
            />
        </>
    )
}