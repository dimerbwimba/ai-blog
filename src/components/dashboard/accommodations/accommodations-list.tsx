"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Star, Trash2, ChevronDown, Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { JsonPreviewer } from "@/components/shared/json-previewer";

interface Accommodation {
  id: string;
  destination: {
    name: string;
    country: string;
  };
  jsonData: {
    properties: Array<{
      name: string;
      description: string;
      rate_per_night: {
        lowest: number;
      };
      overall_rating: number;
      reviews: number;
      amenities: string[];
    }>;
  };
  createdAt: string;
}

interface AccommodationsListProps {
  accommodations: Accommodation[];
}

export function AccommodationsList({
  accommodations = [],
}: AccommodationsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openAccommodationId, setOpenAccommodationId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleStartEdit = async (accommodation: Accommodation) => {
    setEditingId(accommodation.id);
    setEditingData(JSON.stringify(accommodation.jsonData, null, 2));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData("");
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      setIsSaving(true);
      const parsedData = JSON.parse(editingData);
      
      const response = await fetch(`/api/accommodations/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonData: parsedData }),
      });

      if (!response.ok) throw new Error("Failed to update accommodation");

      toast.success("Accommodation updated successfully");
      setEditingId(null);
      setEditingData("");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update accommodation");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/accommodations/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete accommodation");

      toast.success("Accommodation deleted successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete accommodation");
    } finally {
      setDeleteId(null);
    }
  };

  if (!accommodations?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No accommodations found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {accommodations.map((accommodation) => (
        <div 
          key={accommodation.id} 
          className="bg-background rounded-lg border border-border/10 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <ChevronDown 
                className={`h-4 w-4 transition-transform cursor-pointer ${openAccommodationId === accommodation.id ? 'rotate-180' : ''}`}
                onClick={() => setOpenAccommodationId(openAccommodationId === accommodation.id ? null : accommodation.id)}
              />
              <span className="text-lg uppercase font-semibold">
                {accommodation.destination.name}, {accommodation.destination.country}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {editingId === accommodation.id ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStartEdit(accommodation)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteId(accommodation.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {editingId === accommodation.id ? (
            <div className="p-4 border-t border-border/10">
              <JsonPreviewer
                value={editingData}
                onChange={setEditingData}
                className="h-96"
              />
            </div>
          ) : (
            openAccommodationId === accommodation.id && (
              <div className="p-4 border-t border-border/10">
                <div className="grid gap-4">
                  {accommodation?.jsonData?.properties?.map((property, propertyIndex) => (
                    <div 
                      key={`${accommodation.id}-${propertyIndex}`} 
                      className="bg-background rounded-lg p-4 border border-border/10"
                    >
                      <div>
                        <h3 className="text-lg font-semibold">
                          {property?.name}
                        </h3>
                        <p>
                          {property?.description}
                        </p>
                      </div>

                      <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price per night</span>
                          <span className="font-medium">
                            ${property?.rate_per_night?.lowest}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Rating</span>
                          <span className="flex items-center font-medium">
                            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {property?.overall_rating}
                            <span className="text-muted-foreground ml-1">
                              ({property?.reviews} reviews)
                            </span>
                          </span>
                        </div>

                        <div className="pt-3 border-t border-border/10">
                          <span className="text-sm text-muted-foreground block mb-2">Amenities</span>
                          <div className="flex flex-wrap gap-2">
                            {property?.amenities?.map((amenity) => (
                              <span
                                key={amenity}
                                className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              accommodation and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
