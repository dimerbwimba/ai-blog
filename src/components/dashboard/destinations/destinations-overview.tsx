"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPinIcon } from "lucide-react"
import { DestinationsList } from "./destinations-list"
import { DestinationForm } from "./destination-form"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DestinationsOverview() {
  const [showNewDestinationDialog, setShowNewDestinationDialog] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Destinations</h2>
          <p className="text-muted-foreground">
            Manage your travel destinations
          </p>
        </div>
        <Button onClick={() => setShowNewDestinationDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Destination
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="space-y-2">
            <MapPinIcon className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Active Destinations</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your travel destinations
            </p>
          </div>
        </Card>
      </div>

      

      <DestinationsList />

      <Dialog open={showNewDestinationDialog} onOpenChange={setShowNewDestinationDialog}>
        <DialogContent className="sm:max-w-[625px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Destination</DialogTitle>
            <DialogDescription>
              Add a new travel destination
            </DialogDescription>
          </DialogHeader>
          <div className="px-20">
            <DestinationForm onSuccess={() => setShowNewDestinationDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 