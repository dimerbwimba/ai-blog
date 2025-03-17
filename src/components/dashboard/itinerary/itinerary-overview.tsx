"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Loader2, Search } from "lucide-react"
import { toast } from "sonner"
import { ItineraryList } from "./itinerary-list"
import { ItineraryForm } from "./itinerary-form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ItineraryOverview() {
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchItineraries()
  }, [])

  const fetchItineraries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/itineraries')
      if (!response.ok) throw new Error('Failed to fetch itineraries')
      const data = await response.json()
      setItineraries(data)
    } catch (error) {
      console.error('Error fetching itineraries:', error)
      toast.error('Failed to load itineraries')
    } finally {
      setLoading(false)
    }
  }

  const handleItineraryCreated = () => {
    fetchItineraries()
    setShowForm(false)
    toast.success('Itinerary created successfully')
  }

  const handleItineraryDeleted = (id: string) => {
    setItineraries(itineraries.filter((itinerary: any) => itinerary.id !== id))
    toast.success('Itinerary deleted successfully')
  }

  const handleItineraryUpdated = () => {
    fetchItineraries()
    toast.success('Itinerary updated successfully')
  }

  const filteredItineraries = itineraries.filter((itinerary: any) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      itinerary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (itinerary.description && itinerary.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "upcoming") {
      return matchesSearch && new Date(itinerary.startDate) >= new Date()
    }
    if (activeTab === "past") {
      return matchesSearch && new Date(itinerary.endDate) < new Date()
    }
    if (activeTab === "public") {
      return matchesSearch && itinerary.isPublic
    }
    
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Travel Itineraries</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            'Cancel'
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Itinerary
            </>
          )}
        </Button>
      </div>

      {showForm ? (
        <ItineraryForm onSuccess={handleItineraryCreated} />
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search itineraries..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredItineraries.length > 0 ? (
                <ItineraryList 
                  itineraries={filteredItineraries} 
                  onDelete={handleItineraryDeleted}
                  onUpdate={handleItineraryUpdated}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No itineraries found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery ? 'Try a different search term' : 'Create your first travel itinerary'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="upcoming" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredItineraries.length > 0 ? (
                <ItineraryList 
                  itineraries={filteredItineraries} 
                  onDelete={handleItineraryDeleted}
                  onUpdate={handleItineraryUpdated}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No upcoming trips</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Plan your next adventure
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="past" className="mt-6">
              {/* Similar content for past itineraries */}
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredItineraries.length > 0 ? (
                <ItineraryList 
                  itineraries={filteredItineraries} 
                  onDelete={handleItineraryDeleted}
                  onUpdate={handleItineraryUpdated}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No past trips</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your completed trips will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="public" className="mt-6">
              {/* Similar content for public itineraries */}
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredItineraries.length > 0 ? (
                <ItineraryList 
                  itineraries={filteredItineraries} 
                  onDelete={handleItineraryDeleted}
                  onUpdate={handleItineraryUpdated}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No public itineraries</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your trips with the community
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
} 