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
import { Edit2, MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { DestinationForm } from "./destination-form"
import DeleteAlert from "@/components/ui/delete-alert"
import { Separator } from "@/components/ui/separator"

interface Destination {
  id: string
  name: string
  description: string
  country: string
  region: string | null
  continent: string
  image: string
  postsCount: number
  createdAt: string
  _count: {
    posts: number
  }
}

export function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [destinationToDelete, setDestinationToDelete] = useState<Destination | null>(null)
  const [destinationToEdit, setDestinationToEdit] = useState<Destination | null>(null)

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/destinations')
      const data = await response.json()
      setDestinations(data)
    } catch (error:any) {
      console.error('Failed to fetch destinations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDestinations()
  }, [])

  if (isLoading) {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const handleDeleteClick = (destination: Destination) => {
    setDestinationToDelete(destination)
    setShowDeleteDialog(true)
  }
  const handleAfterDelete = (id: string) => {
    setDestinations(destinations.filter(destination => destination.id !== id))
  }

  const handleEditClick = (destination: Destination) => {
    setDestinationToEdit(destination)
    setShowEditDialog(true)
  }

  const handleEditSuccess = () => {
    setShowEditDialog(false)
    // Refresh the destinations list
    fetchDestinations()
  }

  return (
    <>
      <div className="flex justify-between items-center"> 
        <h1 className="text-2xl font-bold">
          You&apos;ve created {destinations.length} destinations
        </h1>
      </div>
      <Separator className="my-4" />  
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations?.map((destination) => (
              <TableRow key={destination.id}>
                <TableCell className="font-medium">{destination.name}</TableCell>
                <TableCell>{destination.country}</TableCell>
                <TableCell>{destination.region || '-'}</TableCell>
                <TableCell>{destination._count.posts}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(destination)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(destination)} className="text-red-600">
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
        title="Delete Destination"
        showDeleteDialog={showDeleteDialog}
        toDelete={destinationToDelete?.name || ""}
        onClose={setShowDeleteDialog}
        apiUrl="/api/destinations"
        idToDelete={destinationToDelete?.id || ""}
        onAfterDelete={handleAfterDelete}
      />

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[625px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>
              Update the details for {destinationToEdit?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="px-20">
            {destinationToEdit && (
              <DestinationForm
                initialData={{
                  name: destinationToEdit.name,
                  description: destinationToEdit.description,
                  country: destinationToEdit.country,
                  region: destinationToEdit.region || "",
                  image: destinationToEdit.image || "",
                  continent: destinationToEdit.continent || "",
                }}
                isEditing={true}
                destinationId={destinationToEdit.id}
                onSuccess={handleEditSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 