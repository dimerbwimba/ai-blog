"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  MapPin, 
  Globe, 
  Lock, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { ItineraryEditDialog } from "./itinerary-edit-dialog"

interface ItineraryListProps {
  itineraries: any[]
  onDelete: (id: string) => void
  onUpdate: () => void
}

export function ItineraryList({ itineraries, onDelete, onUpdate }: ItineraryListProps) {
  const [editingItinerary, setEditingItinerary] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete itinerary')
      
      onDelete(id)
    } catch (error) {
      console.error('Error deleting itinerary:', error)
      toast.error('Failed to delete itinerary')
    }
  }

  const handleEdit = (itinerary: any) => {
    setEditingItinerary(itinerary)
    setShowEditDialog(true)
  }

  const handleEditSuccess = () => {
    setShowEditDialog(false)
    onUpdate()
  }

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
      {itineraries.map((itinerary) => (
        <Card key={itinerary.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{itinerary.title}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(itinerary)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this itinerary and all its data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(itinerary.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>
              {itinerary.description || "No description provided"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="mr-1 h-4 w-4" />
              <span>
                {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
              </span>
            </div>
            
            {itinerary.destinations && itinerary.destinations.length > 0 && (
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="mr-1 h-4 w-4" />
                <span>
                  {itinerary.destinations.length} destination{itinerary.destinations.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            
            <div className="mt-3">
              <Badge variant={itinerary.isPublic ? "default" : "outline"}>
                {itinerary.isPublic ? (
                  <>
                    <Globe className="mr-1 h-3 w-3" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="mr-1 h-3 w-3" />
                    Private
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}

      {editingItinerary && (
        <ItineraryEditDialog
          itinerary={editingItinerary}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
} 