"use client"

import { useState } from "react"
import Image from "next/image"
import { useQuery } from "convex/react"
import { api } from "@/lib/convex"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, ImageIcon } from "lucide-react"

interface Photo {
  _id: string
  _creationTime: number
  chapter_id: string
  url: string
  metadata: {
    date?: number
    gps?: {
      lat: number
      lon: number
    }
  }
  event_id?: string
  uploaded_by: string
  created_at: number
}

interface Event {
  _id: string
  title: string
  start_time: number
  photo_url?: string
}

interface PhotoGalleryProps {
  chapterId: string
}

export function PhotoGallery({ chapterId }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedTab, setSelectedTab] = useState<string>("all")
  
  // Fetch all photos
  const photos = useQuery(api.photos.listByChapter, { chapterId }) || []
  
  // Fetch all events
  const events = useQuery(api.events.listByChapter, { chapterId }) || []
  
  // Create a map of event IDs to event objects
  const eventMap = events.reduce<Record<string, Event>>((acc, event) => {
    acc[event._id] = event
    return acc
  }, {})
  
  // Group photos by event
  const photosByEvent = photos.reduce<Record<string, Photo[]>>((acc, photo) => {
    const eventId = photo.event_id || "miscellaneous"
    if (!acc[eventId]) {
      acc[eventId] = []
    }
    acc[eventId].push(photo)
    return acc
  }, {})
  
  // Get event IDs with photos
  const eventIdsWithPhotos = Object.keys(photosByEvent).filter(id => id !== "miscellaneous")
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/60" />
        <h3 className="mt-4 text-lg font-medium">No photos yet</h3>
        <p className="text-muted-foreground">
          Upload photos to see them here
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="all">All Photos</TabsTrigger>
          <TabsTrigger value="events">By Event</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="misc">Miscellaneous</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <PhotoCard
                key={photo._id}
                photo={photo}
                event={photo.event_id ? eventMap[photo.event_id] : undefined}
                onClick={() => setSelectedPhoto(photo)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <div className="space-y-8">
            {eventIdsWithPhotos.length > 0 ? (
              eventIdsWithPhotos.map((eventId) => {
                const event = eventMap[eventId]
                const eventPhotos = photosByEvent[eventId] || []
                
                return (
                  <div key={eventId} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">
                        {event ? event.title : "Unknown Event"}
                      </h3>
                      {event && (
                        <Badge variant="outline">
                          {formatDate(event.start_time)}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {eventPhotos.map((photo) => (
                        <PhotoCard
                          key={photo._id}
                          photo={photo}
                          onClick={() => setSelectedPhoto(photo)}
                          showEventBadge={false}
                        />
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No event photos</h3>
                <p className="text-muted-foreground">
                  No photos have been associated with events yet
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...photos]
              .sort((a, b) => b.created_at - a.created_at)
              .slice(0, 20)
              .map((photo) => (
                <PhotoCard
                  key={photo._id}
                  photo={photo}
                  event={photo.event_id ? eventMap[photo.event_id] : undefined}
                  onClick={() => setSelectedPhoto(photo)}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="misc" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(photosByEvent.miscellaneous || []).map((photo) => (
              <PhotoCard
                key={photo._id}
                photo={photo}
                onClick={() => setSelectedPhoto(photo)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <PhotoDialog
        photo={selectedPhoto}
        event={selectedPhoto?.event_id ? eventMap[selectedPhoto.event_id] : undefined}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  )
}

interface PhotoCardProps {
  photo: Photo
  event?: Event
  onClick: () => void
  showEventBadge?: boolean
}

function PhotoCard({ photo, event, onClick, showEventBadge = true }: PhotoCardProps) {
  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-0 aspect-square relative">
        <Image
          src={photo.url}
          alt="Photo"
          fill
          className="object-cover"
        />
        {showEventBadge && event && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-primary/80 text-white text-xs">
              {event.title}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface PhotoDialogProps {
  photo: Photo | null
  event?: Event
  onClose: () => void
}

function PhotoDialog({ photo, event, onClose }: PhotoDialogProps) {
  if (!photo) return null
  
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Unknown date"
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }
  
  return (
    <Dialog open={!!photo} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>
            {event ? event.title : "Photo"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-video w-full">
          <Image
            src={photo.url}
            alt="Photo"
            fill
            className="object-contain"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground">
          <div>
            {photo.metadata.date && (
              <p>Taken: {formatDate(photo.metadata.date)}</p>
            )}
            <p>Uploaded: {formatDate(photo.created_at)}</p>
          </div>
          
          {event && (
            <div className="mt-2 sm:mt-0">
              <p>Event: {event.title}</p>
              <p>Event Date: {formatDate(event.start_time)}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 