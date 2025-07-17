"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Users,
  Search,
  Home,
  Megaphone,
  ImageIcon,
  User,
  Shield,
  LogOut,
  Bell,
  Settings,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeProvider } from "../components/theme-provider"
import { ThemeToggle } from "../components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Event {
  id: string
  title: string
  description: string
  location: {
    name: string
    address: string
    mapsUrl: string
  }
  datetime: string
  image: string
  registrationUrl: string
  calendarUrl: string
  attendees: number
  maxAttendees?: number
  category: string
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Annual Leadership Summit",
    description:
      "Join us for our flagship leadership event featuring keynote speakers, interactive workshops, and networking opportunities with fellow YPO members from across the region.",
    location: {
      name: "Grand Hyatt Hotel",
      address: "123 Business District, Downtown",
      mapsUrl: "https://maps.google.com/?q=Grand+Hyatt+Hotel+Downtown",
    },
    datetime: "2025-03-15T09:00:00",
    image: "/placeholder.svg?height=200&width=300",
    registrationUrl: "https://cvent.com/events/leadership-summit-2024",
    calendarUrl: "/events/leadership-summit.ics",
    attendees: 87,
    maxAttendees: 150,
    category: "Leadership",
  },
  {
    id: "2",
    title: "Quarterly Networking Mixer",
    description:
      "Connect with fellow members in a relaxed atmosphere. Enjoy cocktails, appetizers, and meaningful conversations that could lead to your next business opportunity.",
    location: {
      name: "Rooftop Lounge at The Metropolitan",
      address: "456 Skyline Avenue, Midtown",
      mapsUrl: "https://maps.google.com/?q=Metropolitan+Rooftop+Lounge",
    },
    datetime: "2025-03-08T18:30:00",
    image: "/placeholder.svg?height=200&width=300",
    registrationUrl: "https://cvent.com/events/networking-mixer-q1",
    calendarUrl: "/events/networking-mixer.ics",
    attendees: 42,
    maxAttendees: 80,
    category: "Networking",
  },
  {
    id: "3",
    title: "Family Day at the Zoo",
    description:
      "Bring your families for a fun-filled day at the city zoo! Special behind-the-scenes tours, educational activities for kids, and a picnic lunch included.",
    location: {
      name: "City Zoo & Botanical Gardens",
      address: "789 Nature Park Drive",
      mapsUrl: "https://maps.google.com/?q=City+Zoo+Botanical+Gardens",
    },
    datetime: "2025-03-22T10:00:00",
    image: "/placeholder.svg?height=200&width=300",
    registrationUrl: "https://cvent.com/events/family-zoo-day",
    calendarUrl: "/events/family-zoo-day.ics",
    attendees: 28,
    maxAttendees: 60,
    category: "Social",
  },
  {
    id: "4",
    title: "Digital Transformation Workshop",
    description:
      "Explore the latest strategies and tools for digital transformation in this intensive one-day workshop.",
    location: {
      name: "Online Webinar",
      address: "Zoom Link Provided",
      mapsUrl: "#",
    },
    datetime: "2025-04-01T14:00:00",
    image: "/placeholder.svg?height=200&width=300",
    registrationUrl: "#",
    calendarUrl: "#",
    attendees: 75,
    maxAttendees: 100,
    category: "Learning",
  },
  {
    id: "5",
    title: "Annual Charity Golf Tournament",
    description:
      "Tee off for a good cause! Join us for our annual charity golf tournament, followed by a dinner and awards ceremony.",
    location: {
      name: "Green Valley Golf Club",
      address: "100 Golf Course Rd, Countryside",
      mapsUrl: "https://maps.google.com/?q=Green+Valley+Golf+Club",
    },
    datetime: "2025-05-10T08:00:00",
    image: "/placeholder.svg?height=200&width=300",
    registrationUrl: "#",
    calendarUrl: "#",
    attendees: 50,
    maxAttendees: 70,
    category: "Social",
  },
]

function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const { toast } = useToast()

  const currentUser = {
    name: "John Anderson",
    email: "john.anderson@email.com",
    avatar: "https://ui-avatars.com/api/?name=John+Anderson&background=007BFF&color=fff&size=40",
    role: "Chapter Member",
  }

  const categories = ["All", ...new Set(mockEvents.map((event) => event.category))]

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "All" || event.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const formatEventDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return {
      date: date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    }
  }

  const formatDateBadge = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleEventRegistration = (eventTitle: string, registrationUrl: string) => {
    toast({
      title: "Opening Registration",
      description: `Redirecting to registration for ${eventTitle}`,
    })
    console.log("Opening registration:", registrationUrl)
  }

  const handleAddToCalendar = (eventTitle: string, calendarUrl: string) => {
    toast({
      title: "Calendar Event",
      description: `Adding ${eventTitle} to your calendar`,
    })
    console.log("Adding to calendar:", calendarUrl)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="https://via.placeholder.com/100x30?text=YPO+Logo"
                  alt="YPO Chapter Management Logo"
                  width={100}
                  height={30}
                  className="h-8 w-auto"
                  priority
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-foreground">Chapter Dashboard</h1>
                  <p className="text-xs text-muted-foreground">Young Presidents' Organization</p>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4 inline-block mr-1" /> Home
              </Link>
              <Link
                href="/dashboard#announcements"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Megaphone className="h-4 w-4 inline-block mr-1" /> Announcements
              </Link>
              <Link
                href="/events"
                className="text-sm font-medium text-primary hover:text-primary transition-colors"
                aria-current="page"
              >
                <Calendar className="h-4 w-4 inline-block mr-1" /> Events
              </Link>
              <Link href="/photos" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                <ImageIcon className="h-4 w-4 inline-block mr-1" /> Photos
              </Link>
              <Link
                href="/community"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Users className="h-4 w-4 inline-block mr-1" /> Community
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <User className="h-4 w-4 inline-block mr-1" /> Profile
              </Link>
              <Link
                href="/admin"
                className="text-sm font-medium text-[var(--orange-accent)] hover:text-[var(--orange-accent)]/80 transition-colors"
              >
                <Shield className="h-4 w-4 inline-block mr-1" /> Admin
              </Link>
              <Link href="/logout" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                <LogOut className="h-4 w-4 inline-block mr-1" /> Logout
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                <span className="sr-only">Notifications</span>
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={`${currentUser.name}'s avatar`} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.role}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Profile settings</span>
                </Button>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" role="main">
        <section aria-labelledby="events-heading">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h1 id="events-heading" className="text-3xl font-bold text-foreground">
              Chapter Events
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 w-full"
                  aria-label="Search events by title, description, or location"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filterCategory === category ? "default" : "outline"}
                    onClick={() => setFilterCategory(category)}
                    className={filterCategory === category ? "btn-orange-accent" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card key={event.id} className="bg-white shadow-md overflow-hidden flex flex-col">
                  <div className="relative aspect-video">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={`${event.title} event image`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary/90 text-primary-foreground">
                        {event.attendees}/{event.maxAttendees || "∞"} attending
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm mb-4 flex-grow line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground text-sm">{event.location.name}</p>
                          <Link
                            href={event.location.mapsUrl}
                            className="text-xs text-primary hover:underline inline-flex items-center space-x-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{event.location.address}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {formatEventDateTime(event.datetime).date}
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatEventDateTime(event.datetime).time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-border">
                      <Button
                        onClick={() => handleEventRegistration(event.title, event.registrationUrl)}
                        className="flex-1 transition-all duration-200 hover:scale-[1.02] btn-orange-accent"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Register Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAddToCalendar(event.title, event.calendarUrl)}
                        className="flex-1 transition-all duration-200 hover:scale-[1.02]"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Add to Calendar
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {formatDateBadge(event.datetime)}
                        </Badge>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterCategory !== "All"
                    ? `No events match your current search or filter criteria.`
                    : `There are no upcoming events at the moment. Please check back later!`}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Toaster />
    </div>
  )
}

export default function EventsPageWithProvider() {
  return (
    <ThemeProvider>
      <EventsPage />
    </ThemeProvider>
  )
}
