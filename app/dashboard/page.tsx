"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "../components/theme-provider"
import { ThemeToggle } from "../components/theme-toggle"
import {
  Search,
  Calendar,
  Users,
  Bell,
  Settings,
  Play,
  Phone,
  Mail,
  User,
  Crown,
  UserCheck,
  Megaphone,
  ChevronRight,
  Home,
  ImageIcon,
  Shield,
  LogOut,
  MapPin,
  Clock,
  ExternalLink,
  Download,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Types for our data structures
interface Announcement {
  id: string
  author: {
    name: string
    avatar: string
    role: string
  }
  content: string
  media?: {
    type: "image" | "video"
    url: string
    alt?: string
  }
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
  title: string // Added for new layout
}

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
}

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar: string
  role: "member" | "spouse"
  title?: string
  company?: string
  hobbies?: string[]
  isOptedIn: boolean
}

// Mock data
const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=007BFF&color=fff&size=40",
      role: "Chapter Chair",
    },
    title: "Upcoming Networking Event Venue Change",
    content:
      "Exciting news! Our upcoming networking event has been moved to the beautiful Ritz-Carlton downtown. Looking forward to seeing everyone there! 🎉",
    media: {
      type: "image",
      url: "/placeholder.svg?height=300&width=500",
      alt: "Ritz-Carlton event venue",
    },
    timestamp: "2024-03-10T10:00:00Z",
    likes: 24,
    comments: 8,
    isLiked: false,
  },
  {
    id: "2",
    author: {
      name: "Michael Chen",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=00FF7F&color=fff&size=40",
      role: "Learning Chair",
    },
    title: "Leadership Workshop This Friday!",
    content:
      "Don't miss our leadership workshop this Friday! We have an amazing speaker lined up who will share insights on digital transformation in today's business landscape.",
    media: {
      type: "video",
      url: "/placeholder.svg?height=200&width=400",
      alt: "Leadership workshop preview",
    },
    timestamp: "2024-03-09T15:30:00Z",
    likes: 18,
    comments: 12,
    isLiked: true,
  },
  {
    id: "3",
    author: {
      name: "Emily Rodriguez",
      avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=E6E6FF&color=333&size=40",
      role: "Social Chair",
    },
    title: "Thank You for Attending Wine Tasting!",
    content:
      "Thank you to everyone who attended last night's wine tasting event! The feedback has been incredible. Already planning our next social gathering! 🍷",
    timestamp: "2024-03-08T20:00:00Z",
    likes: 31,
    comments: 15,
    isLiked: false,
  },
]

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
    datetime: "2024-03-15T09:00:00",
    image: "/placeholder.svg?height=200&width=300",
    registrationUrl: "https://cvent.com/events/leadership-summit-2024",
    calendarUrl: "/events/leadership-summit.ics",
    attendees: 87,
    maxAttendees: 150,
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
    datetime: "2024-03-08T18:30:00",
    image: "/placeholder.svg?height=200&width=300",
    registrationUrl: "https://cvent.com/events/networking-mixer-q1",
    calendarUrl: "/events/networking-mixer.ics",
    attendees: 42,
    maxAttendees: 80,
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
    datetime: "2024-03-22T10:00:00",
    image: "/placeholder.svg?height=200&width=300",
    registrationUrl: "https://cvent.com/events/family-zoo-day",
    calendarUrl: "/events/family-zoo-day.ics",
    attendees: 28,
    maxAttendees: 60,
  },
]

const mockMembers: Member[] = [
  {
    id: "1",
    firstName: "Alexander",
    lastName: "Thompson",
    email: "alex.thompson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://ui-avatars.com/api/?name=Alexander+Thompson&background=007BFF&color=fff&size=80",
    role: "member",
    title: "CEO",
    company: "TechVision Inc.",
    hobbies: ["Golf", "Sailing", "Photography"],
    isOptedIn: true,
  },
  {
    id: "2",
    firstName: "Isabella",
    lastName: "Martinez",
    email: "isabella.martinez@email.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://ui-avatars.com/api/?name=Isabella+Martinez&background=00FF7F&color=fff&size=80",
    role: "member",
    title: "Founder & President",
    company: "GreenTech Solutions",
    hobbies: ["Tennis", "Cooking", "Travel"],
    isOptedIn: true,
  },
  {
    id: "3",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@email.com",
    avatar: "https://ui-avatars.com/api/?name=David+Kim&background=E6E6FF&color=333&size=80",
    role: "member",
    title: "Managing Director",
    company: "Financial Partners LLC",
    hobbies: ["Marathon Running", "Wine Collecting"],
    isOptedIn: true,
  },
  {
    id: "4",
    firstName: "Sophie",
    lastName: "Chen",
    email: "sophie.chen@email.com",
    avatar: "https://ui-avatars.com/api/?name=Sophie+Chen&background=FFC107&color=333&size=80",
    role: "spouse",
    hobbies: ["Art", "Yoga", "Volunteering"],
    isOptedIn: true,
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "Williams",
    email: "robert.williams@email.com",
    phone: "+1 (555) 345-6789",
    avatar: "https://ui-avatars.com/api/?name=Robert+Williams&background=6B7280&color=fff&size=80",
    role: "member",
    title: "Chief Innovation Officer",
    company: "Digital Dynamics",
    hobbies: ["Skiing", "Chess", "Mentoring"],
    isOptedIn: false,
  },
]

function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [currentUser] = useState({
    name: "John Anderson",
    email: "john.anderson@email.com",
    avatar: "https://ui-avatars.com/api/?name=John+Anderson&background=007BFF&color=fff&size=40",
    role: "Chapter Member",
  })
  const { toast } = useToast()

  // Debounce search query for directory preview
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])

  // Filter members for directory preview based on debounced search query
  const filteredMembersPreview = mockMembers
    .filter((m) => m.isOptedIn)
    .filter((member) => {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase()
      return (
        member.firstName.toLowerCase().includes(lowerCaseQuery) ||
        member.lastName.toLowerCase().includes(lowerCaseQuery) ||
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(lowerCaseQuery)
      )
    })
    .slice(0, 3) // Show only top 3 for preview

  // Simulate real-time updates for announcements
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random like updates
      setAnnouncements((prev) =>
        prev.map((announcement) => ({
          ...announcement,
          likes: announcement.likes + (Math.random() > 0.8 ? 1 : 0),
        })),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleLikeAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === id
          ? {
              ...announcement,
              isLiked: !announcement.isLiked,
              likes: announcement.isLiked ? announcement.likes - 1 : announcement.likes + 1,
            }
          : announcement,
      ),
    )
  }

  const formatDateBadge = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatEventDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return {
      date: date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    }
  }

  const handleEventRegistration = (eventTitle: string, registrationUrl: string) => {
    toast({
      title: "Opening Registration",
      description: `Redirecting to registration for ${eventTitle}`,
    })
    // In a real app, this would open the Cvent link
    console.log("Opening registration:", registrationUrl)
  }

  const handleAddToCalendar = (eventTitle: string, calendarUrl: string) => {
    toast({
      title: "Calendar Event",
      description: `Adding ${eventTitle} to your calendar`,
    })
    // In a real app, this would trigger .ics file download
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
                className="text-sm font-medium text-primary hover:text-primary transition-colors"
                aria-current="page"
              >
                <Home className="h-4 w-4 inline-block mr-1" /> Home
              </Link>
              <Link
                href="/dashboard#announcements"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Megaphone className="h-4 w-4 inline-block mr-1" /> Announcements
              </Link>
              <Link href="/events" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Announcements & Events */}
          <div className="lg:col-span-2 space-y-8">
            {/* Announcements Section */}
            <section id="announcements" aria-labelledby="announcements-heading">
              <div className="flex items-center justify-between mb-6">
                <h2 id="announcements-heading" className="text-2xl font-bold text-foreground">
                  Chapter Announcements
                </h2>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </Badge>
              </div>

              <div className="space-y-6">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="bg-white shadow-md overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {/* Announcement Media */}
                      <div className="relative aspect-video md:aspect-square md:col-span-1">
                        {announcement.media && announcement.media.type === "image" ? (
                          <Image
                            src={announcement.media.url || "/placeholder.svg"}
                            alt={announcement.media.alt || "Announcement media"}
                            fill
                            className="object-cover"
                          />
                        ) : announcement.media && announcement.media.type === "video" ? (
                          <div className="relative bg-muted/50 aspect-video flex items-center justify-center">
                            <Button variant="ghost" size="lg" className="absolute inset-0 w-full h-full">
                              <Play className="h-12 w-12 text-primary" />
                              <span className="sr-only">Play video</span>
                            </Button>
                            <Image
                              src={announcement.media.url || "/placeholder.svg"}
                              alt={announcement.media.alt || "Video thumbnail"}
                              width={400}
                              height={200}
                              className="w-full h-full object-cover opacity-50"
                            />
                          </div>
                        ) : (
                          <div className="bg-muted/50 flex items-center justify-center h-full">
                            <Megaphone className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Announcement Content */}
                      <div className="p-6 md:col-span-2 flex flex-col justify-between relative">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-primary">{announcement.title}</h3>
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">{announcement.content}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <Link
                            href={`/announcements/${announcement.id}`}
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Click to view details <ChevronRight className="h-4 w-4" />
                          </Link>
                          <Badge variant="secondary" className="absolute bottom-4 right-4">
                            {formatDateBadge(announcement.timestamp)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Upcoming Events Section */}
            <section id="events" aria-labelledby="events-heading">
              <div className="flex items-center justify-between mb-6">
                <h2 id="events-heading" className="text-2xl font-bold text-foreground">
                  Upcoming Events
                </h2>
                <Link href="/events" className="text-sm font-medium text-primary hover:underline">
                  View All Events <ChevronRight className="h-4 w-4 inline-block ml-1" />
                </Link>
              </div>

              <div className="space-y-8">
                {mockEvents.slice(0, 3).map((event, index) => (
                  <Card key={event.id} className="bg-white shadow-md overflow-hidden">
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-0 ${index % 2 === 1 ? "md:grid-flow-col-dense" : ""}`}
                    >
                      {/* Event Image */}
                      <div className={`relative aspect-video md:aspect-square ${index % 2 === 1 ? "md:order-2" : ""}`}>
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={`${event.title} event image`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary/90 text-primary-foreground">
                            {event.attendees}/{event.maxAttendees || "∞"} attending
                          </Badge>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className={`p-6 flex flex-col justify-between ${index % 2 === 1 ? "md:order-1" : ""}`}>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-foreground">{event.location.name}</p>
                                <Link
                                  href={event.location.mapsUrl}
                                  className="text-sm text-primary hover:underline inline-flex items-center space-x-1"
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
                                <p className="font-medium text-foreground">
                                  {formatEventDateTime(event.datetime).date}
                                </p>
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatEventDateTime(event.datetime).time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
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
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Directory Preview */}
          <div className="space-y-6">
            <section aria-labelledby="directory-heading">
              <div className="flex items-center justify-between mb-6">
                <h2 id="directory-heading" className="text-2xl font-bold text-foreground">
                  Member Directory
                </h2>
                <Link href="/community" className="text-sm font-medium text-primary hover:underline">
                  View All Members <ChevronRight className="h-4 w-4 inline-block ml-1" />
                </Link>
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search members by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  aria-label="Search members by first or last name"
                />
              </div>

              {/* Members List Preview */}
              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {filteredMembersPreview.length > 0 ? (
                  filteredMembersPreview.map((member) => (
                    <Card key={member.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage
                              src={member.avatar || "/placeholder.svg"}
                              alt={`${member.firstName} ${member.lastName}'s avatar`}
                            />
                            <AvatarFallback>
                              {member.firstName[0]}
                              {member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-primary truncate">
                                {member.firstName} {member.lastName}
                              </h3>
                              {member.role === "member" ? (
                                <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" title="Chapter Member" />
                              ) : (
                                <UserCheck className="h-4 w-4 text-blue-500 flex-shrink-0" title="Spouse" />
                              )}
                            </div>

                            {member.title && member.company && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {member.title} at {member.company}
                              </p>
                            )}

                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <Link href={`mailto:${member.email}`} className="text-primary hover:underline truncate">
                                  {member.email}
                                </Link>
                              </div>

                              {member.phone && (
                                <div className="flex items-center space-x-2 text-sm">
                                  <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <Link href={`tel:${member.phone}`} className="text-primary hover:underline">
                                    {member.phone}
                                  </Link>
                                </div>
                              )}
                            </div>

                            {member.hobbies && member.hobbies.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-muted-foreground mb-1">Interests:</p>
                                <div className="flex flex-wrap gap-1">
                                  {member.hobbies.slice(0, 3).map((hobby, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {hobby}
                                    </Badge>
                                  ))}
                                  {member.hobbies.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{member.hobbies.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-white shadow-md">
                    <CardContent className="p-8 text-center">
                      <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No members found</h3>
                      <p className="text-muted-foreground text-sm">
                        {searchQuery
                          ? `No members match "${searchQuery}". Try a different search term.`
                          : "No members have opted in to directory sharing yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {filteredMembersPreview.length > 0 && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Showing {filteredMembersPreview.length} of {mockMembers.filter((m) => m.isOptedIn).length} members
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  )
}

export default function DashboardPageWithProvider() {
  return (
    <ThemeProvider>
      <DashboardPage />
    </ThemeProvider>
  )
}
