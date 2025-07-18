"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useQuery } from "convex/react"
import { api } from "@/lib/convex"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Download,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MainLayout } from "@/components/layout/main-layout"
import { APP_CONFIG } from "@/lib/constants"
import { downloadIcsFile } from "@/lib/utils/calendar"

interface Event {
  _id: string;
  _creationTime: number;
  chapter_id: string;
  title: string;
  description: string;
  location: string;
  start_time: number;
  end_time: number;
  photo_url?: string;
  cvent_link?: string;
  type: "main" | "small" | "community_led";
  created_by: string;
  created_at: number;
  updated_at: number;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const { toast } = useToast()
  
  // Get chapter ID from constants
  const chapterId = APP_CONFIG.CHAPTER_ID
  
  // Fetch events from Convex
  const events = useQuery(api.events.listByChapter, { chapterId }) || []

  // Filter events based on search query and type
  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = 
      filterType === "all" || 
      event.type === filterType
    
    return matchesSearch && matchesType
  })

  const formatEventDateTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    }
  }

  const formatDateBadge = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleEventRegistration = (event: Event) => {
    if (event.cvent_link) {
      toast({
        title: "Opening Registration",
        description: `Redirecting to registration for ${event.title}`,
      })
      window.open(event.cvent_link, "_blank")
    } else {
      toast({
        title: "Registration Unavailable",
        description: "No registration link available for this event",
        variant: "destructive",
      })
    }
  }

  const handleAddToCalendar = (event: Event) => {
    toast({
      title: "Calendar Event",
      description: `Adding ${event.title} to your calendar`,
    })
    
    downloadIcsFile({
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: event.start_time,
      endTime: event.end_time,
      url: event.cvent_link,
    })
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Events</h1>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterType === "main" ? "default" : "outline"}
                onClick={() => setFilterType("main")}
                size="sm"
              >
                Main
              </Button>
              <Button
                variant={filterType === "small" ? "default" : "outline"}
                onClick={() => setFilterType("small")}
                size="sm"
              >
                Small
              </Button>
              <Button
                variant={filterType === "community_led" ? "default" : "outline"}
                onClick={() => setFilterType("community_led")}
                size="sm"
              >
                Community Led
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                const { date, time } = formatEventDateTime(event.start_time)
                const isEven = index % 2 === 0
                
                return (
                  <Card key={event._id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                        <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                          <Image
                            src={event.photo_url || "/placeholder.jpg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary text-white font-bold px-3 py-1">
                              {formatDateBadge(event.start_time)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="w-full md:w-2/3 p-6">
                          <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold">{event.title}</h2>
                            <Badge variant="outline" className="capitalize">
                              {event.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                          
                          <p className="mt-4 line-clamp-3">{event.description}</p>
                          
                          <div className="mt-6 flex flex-wrap gap-3">
                            <Button 
                              onClick={() => handleEventRegistration(event)}
                              className="flex items-center"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Register
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => handleAddToCalendar(event)}
                              className="flex items-center"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Add to Calendar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterType !== "all"
                    ? "Try adjusting your search or filters"
                    : "Check back soon for upcoming events"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </MainLayout>
  )
} 