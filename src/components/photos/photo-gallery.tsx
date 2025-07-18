"use client"

import { useState } from "react"
import Image from "next/image"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/lib/convex"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, ImageIcon, Heart, Smile, Zap, Laugh, Download, Share2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { toast } from "@/hooks/use-toast"

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
  reactions?: {
    counts: Record<string, number>
    total: number
  }
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
  const { user } = useUser()
  
  // Fetch all photos with reactions
  const photos = useQuery(api.photos.listWithReactions, { chapterId }) || []
  
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
        chapterId={chapterId}
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
        {photo.reactions && photo.reactions.total > 0 && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/80 text-black text-xs">
              {photo.reactions.total} {photo.reactions.total === 1 ? 'reaction' : 'reactions'}
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
  chapterId: string
}

function PhotoDialog({ photo, event, onClose, chapterId }: PhotoDialogProps) {
  const { user } = useUser()
  const addReaction = useMutation(api.photos.addReaction)
  const removeReaction = useMutation(api.photos.removeReaction)
  
  // Get user's reaction to this photo
  const userReaction = useQuery(
    api.photos.getUserReaction,
    photo && user ? { photoId: photo._id, userId: user.id } : "skip"
  )
  
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
  
  const handleReaction = async (reactionType: "like" | "love" | "wow" | "laugh") => {
    if (!user) return
    
    try {
      if (userReaction?.reaction_type === reactionType) {
        // Remove reaction if clicking the same one
        await removeReaction({ photoId: photo._id, userId: user.id })
        toast({ title: "Reaction removed" })
      } else {
        // Add or update reaction
        await addReaction({
          photoId: photo._id,
          userId: user.id,
          chapterId,
          reactionType,
        })
        toast({ title: "Reaction added" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update reaction", variant: "destructive" })
    }
  }
  
  const handleDownload = async () => {
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `photo-${photo._id}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast({ title: "Download started" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to download photo", variant: "destructive" })
    }
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event ? `Photo from ${event.title}` : "Photo",
          url: photo.url,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(photo.url)
        toast({ title: "Link copied to clipboard" })
      } catch (error) {
        toast({ title: "Error", description: "Failed to copy link", variant: "destructive" })
      }
    }
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
        
        {/* Reactions */}
        <PhotoReactions
          photo={photo}
          userReaction={userReaction}
          onReaction={handleReaction}
          canReact={!!user}
        />
        
        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
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

interface PhotoReactionsProps {
  photo: Photo
  userReaction: any
  onReaction: (type: "like" | "love" | "wow" | "laugh") => void
  canReact: boolean
}

function PhotoReactions({ photo, userReaction, onReaction, canReact }: PhotoReactionsProps) {
  const reactions = [
    { type: "like" as const, icon: Heart, label: "Like", color: "text-red-500" },
    { type: "love" as const, icon: Heart, label: "Love", color: "text-pink-500" },
    { type: "wow" as const, icon: Zap, label: "Wow", color: "text-yellow-500" },
    { type: "laugh" as const, icon: Laugh, label: "Laugh", color: "text-blue-500" },
  ]
  
  return (
    <div className="flex flex-wrap items-center gap-4">
      {reactions.map(({ type, icon: Icon, label, color }) => {
        const count = photo.reactions?.counts[type] || 0
        const isActive = userReaction?.reaction_type === type
        
        return (
          <Button
            key={type}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-2 ${isActive ? color : ""}`}
            onClick={() => canReact && onReaction(type)}
            disabled={!canReact}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {count > 0 && (
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
            )}
          </Button>
        )
      })}
    </div>
  )
} 