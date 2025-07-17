"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Phone,
  Mail,
  User,
  Crown,
  UserCheck,
  Home,
  Calendar,
  Megaphone,
  ImageIcon,
  Shield,
  LogOut,
  Bell,
  Settings,
  Users,
} from "lucide-react"
import { ThemeProvider } from "../components/theme-provider"
import { ThemeToggle } from "../components/theme-toggle"

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
  {
    id: "6",
    firstName: "Olivia",
    lastName: "Davis",
    email: "olivia.davis@email.com",
    avatar: "https://ui-avatars.com/api/?name=Olivia+Davis&background=FF6347&color=fff&size=80",
    role: "member",
    title: "Marketing Director",
    company: "Brand Builders",
    hobbies: ["Hiking", "Reading", "Gardening"],
    isOptedIn: true,
  },
  {
    id: "7",
    firstName: "William",
    lastName: "Miller",
    email: "william.miller@email.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://ui-avatars.com/api/?name=William+Miller&background=4682B4&color=fff&size=80",
    role: "member",
    title: "Operations Manager",
    company: "Logistics Pro",
    hobbies: ["Fishing", "Camping", "Woodworking"],
    isOptedIn: true,
  },
  {
    id: "8",
    firstName: "Sophia",
    lastName: "Wilson",
    email: "sophia.wilson@email.com",
    avatar: "https://ui-avatars.com/api/?name=Sophia+Wilson&background=DA70D6&color=fff&size=80",
    role: "spouse",
    hobbies: ["Painting", "Yoga", "Baking"],
    isOptedIn: true,
  },
]

function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [currentUser] = useState({
    name: "John Anderson",
    email: "john.anderson@email.com",
    avatar: "https://ui-avatars.com/api/?name=John+Anderson&background=007BFF&color=fff&size=40",
    role: "Chapter Member",
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])

  const filteredMembers = mockMembers
    .filter((m) => m.isOptedIn) // Only show opted-in members in the main directory
    .filter((member) => {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase()
      return (
        member.firstName.toLowerCase().includes(lowerCaseQuery) ||
        member.lastName.toLowerCase().includes(lowerCaseQuery) ||
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(lowerCaseQuery) ||
        (member.title && member.title.toLowerCase().includes(lowerCaseQuery)) ||
        (member.company && member.company.toLowerCase().includes(lowerCaseQuery)) ||
        (member.hobbies && member.hobbies.some((hobby) => hobby.toLowerCase().includes(lowerCaseQuery)))
      )
    })

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
              <Link href="/events" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                <Calendar className="h-4 w-4 inline-block mr-1" /> Events
              </Link>
              <Link href="/photos" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                <ImageIcon className="h-4 w-4 inline-block mr-1" /> Photos
              </Link>
              <Link
                href="/community"
                className="text-sm font-medium text-primary hover:text-primary transition-colors"
                aria-current="page"
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
        <section aria-labelledby="directory-heading">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h1 id="directory-heading" className="text-3xl font-bold text-foreground">
              Member Directory
            </h1>
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search members by name, company, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 w-full"
                aria-label="Search members by first name, last name, title, company, or hobbies"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <Card key={member.id} className="bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={`${member.firstName} ${member.lastName}'s avatar`}
                      />
                      <AvatarFallback className="text-4xl">
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-xl text-primary">
                        {member.firstName} {member.lastName}
                      </h3>
                      {member.role === "member" ? (
                        <Crown className="h-5 w-5 text-yellow-500 flex-shrink-0" title="Chapter Member" />
                      ) : (
                        <UserCheck className="h-5 w-5 text-blue-500 flex-shrink-0" title="Spouse" />
                      )}
                    </div>

                    {member.title && member.company && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {member.title} at {member.company}
                      </p>
                    )}

                    <div className="space-y-2 mb-4 w-full">
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Link href={`mailto:${member.email}`} className="text-primary hover:underline truncate">
                          {member.email}
                        </Link>
                      </div>

                      {member.phone && (
                        <div className="flex items-center justify-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <Link href={`tel:${member.phone}`} className="text-primary hover:underline">
                            {member.phone}
                          </Link>
                        </div>
                      )}
                    </div>

                    {member.hobbies && member.hobbies.length > 0 && (
                      <div className="mt-auto pt-4 border-t border-border w-full">
                        <p className="text-xs text-muted-foreground mb-2">Interests:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {member.hobbies.map((hobby, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {hobby}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No members found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `No members match "${searchQuery}". Try a different search term.`
                    : "No members have opted in to directory sharing yet or meet the current criteria."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default function CommunityPageWithProvider() {
  return (
    <ThemeProvider>
      <CommunityPage />
    </ThemeProvider>
  )
}
