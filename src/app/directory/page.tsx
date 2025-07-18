"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useQuery } from "convex/react"
import { api } from "@/lib/convex"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Phone, Mail, User } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { APP_CONFIG } from "@/lib/constants"

interface Member {
  _id: string;
  _creationTime: number;
  chapter_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  photo_url?: string;
  hobbies_passions?: string;
  role: "member" | "spouse" | "officer" | "admin";
  officer_title?: string;
  opt_in: boolean;
  notification_preferences?: string[];
  created_at: number;
  updated_at: number;
}

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  
  // Get chapter ID from constants
  const chapterId = APP_CONFIG.CHAPTER_ID
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])
  
  // Fetch members from Convex using the search function
  const members = useQuery(api.users.searchUsers, { 
    chapterId, 
    searchQuery: debouncedSearchQuery,
  }) || []

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Member Directory</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search by name, email, title, or hobbies..."
              className="pl-10 w-full md:w-96"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length > 0 ? (
            members.map((member) => (
              <Card key={member._id} className="overflow-hidden hover:shadow-theme-md transition-shadow bg-theme-surface border-theme-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-theme-primary">
                      <AvatarImage src={member.photo_url || ''} alt={`${member.first_name} ${member.last_name}`} />
                      <AvatarFallback className="bg-theme-background text-theme-text-primary font-heading">
                        {member.first_name?.[0] || ''}
                        {member.last_name?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg text-theme-text-primary font-heading">{member.first_name} {member.last_name}</h3>
                      <div className="flex items-center text-sm text-theme-text-secondary">
                        <Badge variant={member.role === "member" ? "default" : "outline"} className="mr-2 bg-theme-primary text-theme-surface border-theme-primary font-body">
                          {member.role === "member" ? "Member" : "Spouse"}
                        </Badge>
                        {member.officer_title && (
                          <span className="text-theme-accent font-body">{member.officer_title}</span>
                        )}
                      </div>
                    </div>
                  </div>

                    <div className="mt-4 space-y-2 text-sm">
                      {member.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={`mailto:${member.email}`} className="hover:text-primary">
                            {member.email}
                          </a>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={`tel:${member.phone}`} className="hover:text-primary">
                            {member.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {member.hobbies_passions && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Hobbies & Passions</h4>
                        <p className="text-sm text-muted-foreground">{member.hobbies_passions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <User className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No members found</h3>
                <p className="text-muted-foreground">
                  {debouncedSearchQuery
                    ? "Try a different search term"
                    : "No members have opted in to the directory yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 