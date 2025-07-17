"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  MegaphoneIcon,
  SearchIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MapPinIcon,
  ClockIcon,
  PlusIcon,
} from "lucide-react"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const announcements = [
    {
      id: 1,
      title: "New Chapter President Announced",
      description:
        "We are thrilled to announce John Doe as our new Chapter President. John brings a wealth of experience and a strong vision for our community.",
      date: "July 15, 2025",
      link: "#",
      image: "/placeholder.svg?height=200&width=300",
      category: "Leadership",
    },
    {
      id: 2,
      title: "Annual Gala Dinner Save the Date",
      description:
        "Mark your calendars for our annual gala dinner on October 20th! More details on venue and speakers to follow soon.",
      date: "July 10, 2025",
      link: "#",
      image: "/placeholder.svg?height=200&width=300",
      category: "Events",
    },
    {
      id: 3,
      title: "Member Spotlight: Jane Smith",
      description:
        "This month, we feature Jane Smith, CEO of Innovate Corp, and her journey in entrepreneurship. Read her inspiring story.",
      date: "July 5, 2025",
      link: "#",
      image: "/placeholder.svg?height=200&width=300",
      category: "Members",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Leadership Summit 2025",
      location: "San Francisco, CA",
      time: "Aug 10, 2025 - Aug 12, 2025",
      description:
        "Join us for an exclusive leadership summit featuring industry leaders and networking opportunities.",
      image: "/placeholder.svg?height=200&width=300",
      link: "#",
      calendarLink: "#",
    },
    {
      id: 2,
      title: "Innovation Workshop",
      location: "Virtual",
      time: "Sep 5, 2025, 10:00 AM PST",
      description: "A hands-on workshop exploring the latest trends in technology and innovation.",
      image: "/placeholder.svg?height=200&width=300",
      link: "#",
      calendarLink: "#",
    },
  ]

  const members = [
    { id: 1, name: "Alice Johnson", title: "CEO, Tech Solutions", avatar: "/placeholder-user.jpg" },
    { id: 2, name: "Bob Williams", title: "Founder, Creative Agency", avatar: "/placeholder-user.jpg" },
    { id: 3, name: "Charlie Brown", title: "Director, Finance Group", avatar: "/placeholder-user.jpg" },
    { id: 4, name: "Diana Prince", title: "VP, Global Marketing", avatar: "/placeholder-user.jpg" },
  ]

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 shrink-0 border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80 md:px-6">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Image src="/placeholder-logo.svg" alt="YPO Logo" width={32} height={32} className="h-8 w-8" />
          <span className="sr-only">YPO Chapter</span>
        </Link>
        <nav className="hidden flex-row items-center gap-5 text-sm font-medium md:flex">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-900 dark:text-gray-50">
            <HomeIcon className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/events"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <CalendarIcon className="h-4 w-4" />
            Events
          </Link>
          <Link
            href="/community"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <UsersIcon className="h-4 w-4" />
            Community
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <MegaphoneIcon className="h-4 w-4" />
            Admin
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <UsersIcon className="h-4 w-4" />
            Profile
          </Link>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <HomeIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Announcements Feed */}
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Chapter Announcements
                <Link href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  View All <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex flex-col md:flex-row gap-4 items-start">
                  {announcement.image && (
                    <Image
                      src={announcement.image || "/placeholder.svg"}
                      alt={announcement.title}
                      width={150}
                      height={100}
                      className="rounded-md object-cover aspect-[3/2] w-full md:w-[150px]"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {announcement.date}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{announcement.description}</p>
                    <Link
                      href={announcement.link}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      Read More <ExternalLinkIcon className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Events
                <Link href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  View All <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {upcomingEvents.map((event, index) => (
                <div key={event.id}>
                  <div
                    className={`flex flex-col gap-4 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start`}
                  >
                    {event.image && (
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={120}
                        height={80}
                        className="rounded-md object-cover aspect-[3/2] w-full md:w-[120px]"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <MapPinIcon className="h-4 w-4 mr-1" /> {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <ClockIcon className="h-4 w-4 mr-1" /> {event.time}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{event.description}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={event.link}>Register</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={event.calendarLink} className="flex items-center gap-1">
                            Add to Calendar <PlusIcon className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < upcomingEvents.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Member Directory Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Member Directory
                <Link href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  View All <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search members..."
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid gap-4">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Image
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover aspect-square"
                      />
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">No members found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
