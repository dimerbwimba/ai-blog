"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HotelList } from "./hotel-list"
import { ScrapingForm } from "./scraping-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function AccommodationsOverview() {
  const [isScrapingDialogOpen, setIsScrapingDialogOpen] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  const handleScrapingComplete = () => {
    setShowCompletionDialog(true)
    setIsScrapingDialogOpen(false)
  }

  const handleStartNewScrape = () => {
    setShowCompletionDialog(false)
    setIsScrapingDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Accommodations</h2>
          <p className="text-muted-foreground">
            Manage and view scraped accommodation data
          </p>
        </div>
        <Dialog 
          open={isScrapingDialogOpen} 
          onOpenChange={setIsScrapingDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>Scrape Hotels</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] h-screen">
            <DialogHeader>
              <DialogTitle>Scrape Hotel Data</DialogTitle>
              <DialogDescription>
                Configure and start the scraping process for hotel data
              </DialogDescription>
            </DialogHeader>
            <ScrapingForm onSuccess={handleScrapingComplete} />
          </DialogContent>
        </Dialog>

        {/* Completion Dialog */}
        <Dialog 
          open={showCompletionDialog} 
          onOpenChange={setShowCompletionDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scraping Complete</DialogTitle>
              <DialogDescription>
                The hotel data has been successfully scraped and saved.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCompletionDialog(false)}>
                Close
              </Button>
              <Button onClick={handleStartNewScrape}>
                Start New Scrape
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <HotelList />
    </div>
  )
} 