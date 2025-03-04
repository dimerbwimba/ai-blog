"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { JsonPreviewer } from "@/components/shared/json-previewer"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface EditAccommodationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accommodationId: string
  onSuccess: () => void
}

export function EditAccommodationDialog({
  open,
  onOpenChange,
  accommodationId,
  onSuccess
}: EditAccommodationDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [jsonData, setJsonData] = useState("")

  useEffect(() => {
    const fetchAccommodation = async () => {
      if (!open || !accommodationId) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/accommodations/${accommodationId}`)
        if (!response.ok) throw new Error("Failed to fetch accommodation")
        
        const data = await response.json()
        setJsonData(JSON.stringify(data.jsonData, null, 2))
      } catch (error) {
        console.error(error)
        toast.error("Failed to load accommodation data")
        onOpenChange(false)
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodation()
  }, [open, accommodationId, onOpenChange])

  const handleSave = async () => {
    try {
      setSaving(true)
      const parsedData = JSON.parse(jsonData)
      
      const response = await fetch(`/api/accommodations/${accommodationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonData: parsedData }),
      })

      if (!response.ok) throw new Error("Failed to update accommodation")

      toast.success("Accommodation updated successfully")
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error("Failed to update accommodation")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Accommodation</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
         <div>
            <div>
              <JsonPreviewer
                value={jsonData}
                onChange={setJsonData}
                className="h-64"
              />

            </div>
         
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 