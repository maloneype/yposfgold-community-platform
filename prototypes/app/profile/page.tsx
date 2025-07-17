"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Edit,
  Save,
  X,
  Home,
  Calendar,
  Users,
  Megaphone,
  ImageIcon,
  Shield,
  LogOut,
  Bell,
  Settings,
} from "lucide-react"
import { ThemeProvider } from "../components/theme-provider"
import { ThemeToggle } from "../components/theme-toggle"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar: string
  role: "member" | "spouse"
  title?: string
  company?: string
  hobbies: string[]
  isOptedInDirectory: boolean
}

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Anderson",
    email: "john.anderson@email.com",
    phone: "+1 (555) 987-6543",
    avatar: "https://ui-avatars.com/api/?name=John+Anderson&background=007BFF&color=fff&size=128",
    role: "member",
    title: "CEO",
    company: "Global Innovations Inc.",
    hobbies: ["Skiing", "Reading", "Mentoring", "Travel"],
    isOptedInDirectory: true,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editableProfile, setEditableProfile] = useState<UserProfile>(profile)

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling, revert changes
      setEditableProfile(profile)
    }
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    setProfile(editableProfile)
    setIsEditing(false)
    // In a real app, you would send `editableProfile` to your backend
    console.log("Profile saved:", editableProfile)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setEditableProfile((prev) => ({ ...prev, [id]: value }))
  }

  const handleHobbiesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableProfile((prev) => ({
      ...prev,
      hobbies: e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }))
  }

  const handleToggleOptIn = (checked: boolean) => {
    setEditableProfile((prev) => ({ ...prev, isOptedInDirectory: checked }))
  }

  const currentUser = {
    name: "John Anderson",
    email: "john.anderson@email.com",
    avatar: "https://ui-avatars.com/api/?name=John+Anderson&background=007BFF&color=fff&size=40",
    role: "Chapter Member",
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
                className="text-sm font-medium text-primary hover:text-primary transition-colors"
                aria-current="page"
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
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

        <Card className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleEditToggle}>
              {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
              <span className="sr-only">{isEditing ? "Cancel editing" : "Edit profile"}</span>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={`${profile.firstName}'s avatar`} />
                <AvatarFallback className="text-5xl">
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Input
                  id="avatar"
                  placeholder="New avatar URL"
                  value={editableProfile.avatar}
                  onChange={handleInputChange}
                  className="w-full max-w-xs"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={isEditing ? editableProfile.firstName : profile.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={isEditing ? editableProfile.lastName : profile.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editableProfile.email : profile.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={isEditing ? editableProfile.phone || "" : profile.phone || "N/A"}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={isEditing ? editableProfile.title || "" : profile.title || "N/A"}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={isEditing ? editableProfile.company || "" : profile.company || "N/A"}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hobbies">Hobbies / Interests (comma-separated)</Label>
              <Textarea
                id="hobbies"
                value={isEditing ? editableProfile.hobbies.join(", ") : profile.hobbies.join(", ")}
                onChange={handleHobbiesChange}
                readOnly={!isEditing}
                rows={3}
              />
              {!isEditing && profile.hobbies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.hobbies.map((hobby, index) => (
                    <Badge key={index} variant="secondary">
                      {hobby}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="opt-in" className="text-base">
                  Include in Member Directory
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow other chapter members to see your profile in the directory.
                </p>
              </div>
              <Switch
                id="opt-in"
                checked={isEditing ? editableProfile.isOptedInDirectory : profile.isOptedInDirectory}
                onCheckedChange={handleToggleOptIn}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <Button onClick={handleSave} className="w-full btn-orange-accent">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Optional: Change Password Section */}
        <Card className="bg-white shadow-md mt-8">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button className="w-full btn-orange-accent">Update Password</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function ProfilePageWithProvider() {
  return (
    <ThemeProvider>
      <ProfilePage />
    </ThemeProvider>
  )
}
