"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useAction } from "convex/react"
import { api } from "@/lib/convex"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MainLayout } from "@/components/layout/main-layout"
import { APP_CONFIG } from "@/lib/constants"
import { Loader2, Plus, Calendar, Trash, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface EventFormData {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  photoUrl: string;
  cventLink: string;
  type: "main" | "small" | "community_led";
  sendNotifications: boolean;
}

const initialFormData: EventFormData = {
  title: "",
  description: "",
  location: "",
  startTime: "",
  endTime: "",
  photoUrl: "/placeholder.jpg",
  cventLink: "",
  type: "main",
  sendNotifications: true,
}

export default function AdminEventsPage() {
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [isScrapingCvent, setIsScrapingCvent] = useState(false)
  const [cventUrlToScrape, setCventUrlToScrape] = useState("")
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()
  
  // In a real implementation, you would get the chapter ID from context or user session
  const chapterId = APP_CONFIG.CHAPTER_ID
  // In a real implementation, you would get the user ID from auth context
  const userId = "admin-user-id"
  
  // Fetch events from Convex
  const events = useQuery(api.events.listByChapter, { chapterId }) || []
  
  // Mutations and actions
  const createEvent = useMutation(api.events.create)
  const updateEvent = useMutation(api.events.update)
  const deleteEvent = useMutation(api.events.remove)
  const scrapeCventEvent = useAction(api.events.scrapeCventEvent)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleScrapeCvent = async () => {
    if (!cventUrlToScrape) {
      toast({
        title: "Error",
        description: "Please enter a Cvent URL to scrape",
        variant: "destructive",
      })
      return
    }
    
    setIsScrapingCvent(true)
    
    try {
      const scrapedData = await scrapeCventEvent({ cventUrl: cventUrlToScrape })
      
      // Format dates for form inputs
      const startDate = new Date(scrapedData.startTime)
      const endDate = new Date(scrapedData.endTime)
      
      const formatDateForInput = (date: Date) => {
        return date.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
      }
      
      setFormData({
        title: scrapedData.title,
        description: scrapedData.description,
        location: scrapedData.location,
        startTime: formatDateForInput(startDate),
        endTime: formatDateForInput(endDate),
        photoUrl: scrapedData.photoUrl,
        cventLink: scrapedData.cventLink,
        type: scrapedData.type,
        sendNotifications: scrapedData.sendNotifications || true, // Ensure sendNotifications is set
      })
      
      toast({
        title: "Success",
        description: "Event data scraped successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scrape event data",
        variant: "destructive",
      })
    } finally {
      setIsScrapingCvent(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.location || !formData.startTime || !formData.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    
    setIsCreatingEvent(true)
    
    try {
      await createEvent({
        chapterId,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startTime: new Date(formData.startTime).getTime(),
        endTime: new Date(formData.endTime).getTime(),
        photoUrl: formData.photoUrl,
        cventLink: formData.cventLink || undefined,
        type: formData.type,
        createdBy: userId,
        sendNotifications: formData.sendNotifications,
      })
      
      toast({
        title: "Success",
        description: "Event created successfully",
      })
      
      // Reset form
      setFormData(initialFormData)
      setCventUrlToScrape("")
      
      // Refresh events list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      })
    } finally {
      setIsCreatingEvent(false)
    }
  }
  
  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId)
    setIsDeleteDialogOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!eventToDelete) return
    
    try {
      await deleteEvent({ id: eventToDelete })
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      })
      
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
      
      // Refresh events list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    }
  }
  
  const formatEventDateTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Manage Events</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
              <CardDescription>Add a new event to the calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cventUrl">Cvent URL (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cventUrl"
                      placeholder="https://cvent.com/events/example-event"
                      value={cventUrlToScrape}
                      onChange={(e) => setCventUrlToScrape(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleScrapeCvent} 
                      disabled={isScrapingCvent || !cventUrlToScrape}
                    >
                      {isScrapingCvent ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scraping...
                        </>
                      ) : (
                        "Scrape Data"
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Paste a Cvent URL to automatically extract event details
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Annual Leadership Summit"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Event Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleSelectChange(value, "type")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Main</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="community_led">Community Led</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Date & Time *</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Date & Time *</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Grand Hyatt Hotel, 123 Main St, San Francisco"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cventLink">Registration Link (Optional)</Label>
                      <Input
                        id="cventLink"
                        name="cventLink"
                        placeholder="https://cvent.com/events/example-event"
                        value={formData.cventLink}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="photoUrl">Photo URL (Optional)</Label>
                      <Input
                        id="photoUrl"
                        name="photoUrl"
                        placeholder="/placeholder.jpg"
                        value={formData.photoUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Detailed description of the event..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="sendNotifications"
                      checked={formData.sendNotifications}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, sendNotifications: checked === true }))
                      }
                    />
                    <Label htmlFor="sendNotifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Send notifications to members
                    </Label>
                  </div>

                  <Button type="submit" disabled={isCreatingEvent} className="w-full">
                    {isCreatingEvent ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Existing Events</h2>
            
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event._id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            <Badge variant="outline" className="capitalize">
                              {event.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatEventDateTime(event.start_time)}
                          </p>
                          <p className="text-sm line-clamp-2 mt-1">
                            {event.description}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          {event.cvent_link && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(event.cvent_link, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View Registration</span>
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteClick(event._id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">No events yet</h3>
                  <p className="text-muted-foreground">
                    Create your first event using the form above
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
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
      
      <Toaster />
    </MainLayout>
  )
} 