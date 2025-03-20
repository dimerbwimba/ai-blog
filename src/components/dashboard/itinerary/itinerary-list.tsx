"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  MapPin, 
  Globe, 
  Lock,
  Edit, 
  Trash2, 
  Eye 
} from "lucide-react"
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
import { Itinerary, useItineraryStore } from "@/store/use-itinerary-store"

interface ItineraryListProps {
  itineraries: any[]
  onDelete: (id: string) => void
  onUpdate: () => void
}

export function ItineraryList({ itineraries, onDelete, onUpdate }: ItineraryListProps) {
  const [editingItinerary, setEditingItinerary] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { setSelectedItinerary, openDetails } = useItineraryStore()

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

  const handleViewDetails = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary)
    openDetails()
  }

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
      {itineraries.map((itinerary) => (
        <div key={itinerary.id} className="border border-border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{itinerary.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {itinerary.description || "No description provided"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>
                {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
              </span>
            </div>
            
            {itinerary.destinations && itinerary.destinations.length > 0 && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                <span>
                  {itinerary.destinations.length} destination{itinerary.destinations.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            
            <div>
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
          </div>

          <div className=" grid grid-cols-3 gap-2">
            <Button onClick={() => handleViewDetails(itinerary)} variant="outline" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>

            <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(itinerary)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
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
          </div>
        </div>
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