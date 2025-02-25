import { Loader2 } from "lucide-react"
import { Button } from "./button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { Input } from "./input"
import { useState } from "react"
import { toast } from "sonner"

export default function DeleteAlert({
    title,
    apiUrl,
    idToDelete,
    showDeleteDialog,
    toDelete,
    onAfterDelete,
    onClose
}: {
    title: string,
    apiUrl: string,
    idToDelete: string,
    showDeleteDialog: boolean,
    toDelete: string,
    onAfterDelete: (id: string) => void,
    onClose: (v: boolean) => void,
}) {
    const [deleteConfirmation, setDeleteConfirmation] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleDeleteDestination = async () => {
        if (!deleteConfirmation || deleteConfirmation !== "DELETE") return
        setIsLoading(true)
        try {
            const response = await fetch(`${apiUrl}`, {
                method: 'DELETE',
                body: JSON.stringify({ id: idToDelete })
            })

            if (!response.ok) {
                throw new Error('Failed to delete destination')
            }

            onAfterDelete(idToDelete)
            toast.success("Destination deleted successfully")
        } catch (error:any) {
            toast.error("Failed to delete destination")
            console.error('Failed to delete destination:', error)
        } finally {
            onClose(false)
            setDeleteConfirmation("")
            setIsLoading(false)
        }
    }

    const handleCloseDialog = (v: boolean) => {
        onClose(v)
        setDeleteConfirmation("")
        setIsLoading(false)
    }
    return (
        <Dialog open={showDeleteDialog} onOpenChange={handleCloseDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete  &quot;{toDelete}&quot;?
                        This action cannot be undone. Type DELETE to confirm.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="mt-4"
                />
                <DialogFooter className="mt-4">
                    <Button
                        variant="ghost"
                        onClick={() => handleCloseDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteDestination}
                        disabled={deleteConfirmation !== "DELETE"}
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2" /> : null}
                        Delete 
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}