"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/lib/convex"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MainLayout } from "@/components/layout/main-layout"
import { APP_CONFIG } from "@/lib/constants"
import { Loader2, Trash, Image as ImageIcon, Calendar, MapPin, Clock, Search } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPhotosPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<string | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAssociatingEvent, setIsAssociatingEvent] = useState(false)
  const [photoToAssociate, setPhotoToAssociate] = useState<string | null>(null)
  const [eventToAssociate, setEventToAssociate] = useState<string | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()
  
  // In a real implementation, you would get the chapter ID from context or user session
  const chapterId = APP_CONFIG.CHAPTER_ID
  
  // Fetch photos and events from Convex
  const photos = useQuery(api.photos.listByChapter, { chapterId }) || []
  const events = useQuery(api.events.listByChapter, { chapterId }) || []
  
  // Mutations
  const deletePhoto = useMutation(api.photos.remove)
  const associatePhotoWithEvent = useMutation(api.photos.associateWithEvent)
  
  // Filter photos based on selected event and search query
  const filteredPhotos = photos.filter(photo => {
    // Filter by event
    if (selectedEvent !== "all" && photo.event_id !== selectedEvent) {
      return false
    }
    
    // Filter by search query if provided
    if (searchQuery) {
      const metadata = photo.metadata || {}
      const date = metadata.date ? new Date(metadata.date).toLocaleDateString() : ""
      const location = metadata.gps ? `${metadata.gps.lat},${metadata.gps.lon}` : ""
      
      const searchLower = searchQuery.toLowerCase()
      return (
        photo.url.toLowerCase().includes(searchLower) ||
        date.toLowerCase().includes(searchLower) ||
        location.toLowerCase().includes(searchLower)
      )
    }
    
    return true
  })
  
  // Group photos by event
  const photosByEvent = filteredPhotos.reduce((acc, photo) => {
    const eventId = photo.event_id || "uncategorized"
    if (!acc[eventId]) {
      acc[eventId] = []
    }
    acc[eventId].push(photo)
    return acc
  }, {} as Record<string, typeof photos>)
  
  const handleDeleteClick = (photoId: string) => {
    setPhotoToDelete(photoId)
    setIsDeleteDialogOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!photoToDelete) return
    
    try {
      await deletePhoto({ id: photoToDelete })
      
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      })
      
      setIsDeleteDialogOpen(false)
      setPhotoToDelete(null)
      
      // Refresh photos list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      })
    }
  }
  
  const handleAssociateEventClick = (photoId: string) => {
    setPhotoToAssociate(photoId)
    setEventToAssociate(null)
    setIsEventDialogOpen(true)
  }
  
  const confirmAssociateEvent = async () => {
    if (!photoToAssociate || !eventToAssociate) return
    
    setIsAssociatingEvent(true)
    
    try {
      await associatePhotoWithEvent({
        id: photoToAssociate,
        eventId: eventToAssociate,
      })
      
      toast({
        title: "Success",
        description: "Photo associated with event successfully",
      })
      
      setIsEventDialogOpen(false)
      setPhotoToAssociate(null)
      setEventToAssociate(null)
      
      // Refresh photos list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to associate photo with event",
        variant: "destructive",
      })
    } finally {
      setIsAssociatingEvent(false)
    }
  }
  
  const getEventName = (eventId: string) => {
    if (!eventId) return "Uncategorized"
    const event = events.find(e => e._id === eventId)
    return event ? event.title : "Unknown Event"
  }
  
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "Unknown Date"
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  
  const formatLocation = (gps: { lat: number; lon: number } | undefined) => {
    if (!gps) return "Unknown Location"
    return `${gps.lat.toFixed(6)}, ${gps.lon.toFixed(6)}`
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Manage Photos</h1>
            <div className="flex gap-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search photos..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Photos</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event._id} value={event._id}>
                      {event.title}
                    </SelectItem>
                  ))}
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="grid">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="grid">
              {Object.keys(photosByEvent).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No photos found
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(photosByEvent).map(([eventId, eventPhotos]) => (
                    <div key={eventId} className="space-y-4">
                      <h2 className="text-xl font-medium flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        {eventId === "uncategorized" ? "Uncategorized Photos" : getEventName(eventId)}
                        <Badge className="ml-2">{eventPhotos.length}</Badge>
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {eventPhotos.map((photo) => (
                          <Card key={photo._id} className="overflow-hidden">
                            <div className="relative aspect-square">
                              <Image
                                src={photo.url}
                                alt="Photo"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <CardFooter className="p-2 flex justify-between">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAssociateEventClick(photo._id)}
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleDeleteClick(photo._id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list">
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No photos found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPhotos.map((photo) => (
                    <Card key={photo._id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 h-48">
                          <Image
                            src={photo.url}
                            alt="Photo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-4">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span className="text-sm">
                                Event: {photo.event_id ? getEventName(photo.event_id) : "Uncategorized"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span className="text-sm">
                                Date: {formatDate(photo.metadata?.date)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span className="text-sm">
                                Location: {formatLocation(photo.metadata?.gps)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <ImageIcon className="h-4 w-4 mr-2" />
                              <span className="text-sm truncate">
                                URL: {photo.url}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <div className="flex md:flex-col justify-end p-4 space-x-2 md:space-x-0 md:space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssociateEventClick(photo._id)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Associate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDeleteClick(photo._id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Associate Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Associate Photo with Event</DialogTitle>
            <DialogDescription>
              Select an event to associate with this photo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={eventToAssociate || ""} onValueChange={setEventToAssociate}>
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title} ({formatDate(event.start_time)})
                  </SelectItem>
                ))}
                <SelectItem value="">Uncategorized</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAssociateEvent} disabled={isAssociatingEvent}>
              {isAssociatingEvent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Associating...
                </>
              ) : (
                "Associate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </MainLayout>
  )
} 