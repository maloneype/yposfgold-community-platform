"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Megaphone,
  Calendar,
  Users,
  Home,
  ImageIcon,
  User,
  Shield,
  LogOut,
  Bell,
  Settings,
  Trash,
  Edit,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeProvider } from "../components/theme-provider"
import { ThemeToggle } from "../components/theme-toggle"

interface Announcement {
  id: string
  title: string
  content: string
  mediaUrl?: string
  mediaType?: "image" | "video"
  date: string
  status: "Draft" | "Published" | "Archived"
}

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Chapter Meeting Reminder",
    content:
      "Our monthly chapter meeting is scheduled for next Tuesday at 6 PM. Please check your email for the agenda.",
    date: "2025-07-10",
    status: "Published",
  },
  {
    id: "2",
    title: "New Member Welcome Event",
    content: "Join us in welcoming our newest members at a special reception next month. Details to follow.",
    mediaUrl: "/placeholder.svg?height=200&width=300",
    mediaType: "image",
    date: "2025-07-05",
    status: "Published",
  },
  {
    id: "3",
    title: "Call for Volunteers: Annual Gala",
    content: "We are looking for volunteers to help organize our annual gala. Your support is greatly appreciated!",
    date: "2025-06-28",
    status: "Draft",
  },
]

function AdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [newAnnouncement, setNewAnnouncement] = useState<Omit<Announcement, "id" | "date" | "status">>({
    title: "",
    content: "",
    mediaUrl: "",
    mediaType: undefined,
  })
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null)
  const [currentUser] = useState({
    name: "John Anderson",
    email: "john.anderson@email.com",
    avatar: "https://ui-avatars.com/api/?name=John+Anderson&background=007BFF&color=fff&size=40",
    role: "Chapter Admin",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewAnnouncement((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string, field: keyof Omit<Announcement, "id" | "date" | "status">) => {
    setNewAnnouncement((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert("Title and content are required!")
      return
    }

    const announcementToAdd: Announcement = {
      id: Date.now().toString(),
      ...newAnnouncement,
      date: new Date().toISOString().split("T")[0], // Current date
      status: "Published", // Default status
    }

    setAnnouncements((prev) => [announcementToAdd, ...prev])
    setNewAnnouncement({ title: "", content: "", mediaUrl: "", mediaType: undefined }) // Reset form
  }

  const handleEditAnnouncement = (id: string) => {
    const announcementToEdit = announcements.find((ann) => ann.id === id)
    if (announcementToEdit) {
      setEditingAnnouncementId(id)
      setNewAnnouncement({
        title: announcementToEdit.title,
        content: announcementToEdit.content,
        mediaUrl: announcementToEdit.mediaUrl || "",
        mediaType: announcementToEdit.mediaType,
      })
    }
  }

  const handleUpdateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAnnouncementId) return

    setAnnouncements((prev) =>
      prev.map((ann) =>
        ann.id === editingAnnouncementId
          ? {
              ...ann,
              title: newAnnouncement.title,
              content: newAnnouncement.content,
              mediaUrl: newAnnouncement.mediaUrl,
              mediaType: newAnnouncement.mediaType,
            }
          : ann,
      ),
    )
    setEditingAnnouncementId(null)
    setNewAnnouncement({ title: "", content: "", mediaUrl: "", mediaType: undefined })
  }

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id))
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Published":
        return "default"
      case "Draft":
        return "secondary"
      case "Archived":
        return "outline"
      default:
        return "secondary"
    }
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
                className="text-sm font-medium text-primary hover:text-primary transition-colors"
                aria-current="page"
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
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create/Edit Announcement Form */}
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>{editingAnnouncementId ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={editingAnnouncementId ? handleUpdateAnnouncement : handleAddAnnouncement}
                className="space-y-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newAnnouncement.title}
                    onChange={handleInputChange}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newAnnouncement.content}
                    onChange={handleInputChange}
                    placeholder="Write your announcement here..."
                    rows={5}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mediaUrl">Media URL (Optional)</Label>
                  <Input
                    id="mediaUrl"
                    value={newAnnouncement.mediaUrl}
                    onChange={handleInputChange}
                    placeholder="e.g., /images/event.jpg or /videos/promo.mp4"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mediaType">Media Type (Optional)</Label>
                  <Select
                    value={newAnnouncement.mediaType || ""}
                    onValueChange={(value: "image" | "video") => handleSelectChange(value, "mediaType")}
                  >
                    <SelectTrigger id="mediaType">
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full btn-orange-accent">
                  {editingAnnouncementId ? "Update Announcement" : "Publish Announcement"}
                </Button>
                {editingAnnouncementId && (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setEditingAnnouncementId(null)}
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Recent Announcements List */}
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Announcements
                <Link
                  href="/dashboard#announcements"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View Live Feed <ChevronRight className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-md p-4 flex items-start gap-4">
                    {announcement.mediaUrl && (
                      <Image
                        src={announcement.mediaUrl || "/placeholder.svg"}
                        alt="Announcement media"
                        width={80}
                        height={60}
                        className="rounded-md object-cover flex-shrink-0 aspect-[4/3]"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <Badge variant={getStatusVariant(announcement.status)} className="text-xs">
                          {announcement.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>Published: {announcement.date}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditAnnouncement(announcement.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                            <Trash className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No announcements created yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function AdminPageWithProvider() {
  return (
    <ThemeProvider>
      <AdminPage />
    </ThemeProvider>
  )
}
