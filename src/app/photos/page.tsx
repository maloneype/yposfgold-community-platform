"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/lib/convex"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { Upload, ImageIcon } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { APP_CONFIG } from "@/lib/constants"
import { PhotoUploader } from "@/components/photos/photo-uploader"
import { PhotoGallery } from "@/components/photos/photo-gallery"

export default function PhotosPage() {
  const [activeTab, setActiveTab] = useState<string>("gallery")
  const [refreshGallery, setRefreshGallery] = useState<number>(0)
  
  // Get chapter ID from constants
  const chapterId = APP_CONFIG.CHAPTER_ID
  const userId = "current-user-id"
  
  // Fetch upcoming events for the event selector
  const upcomingEvents = useQuery(api.events.listUpcoming, { chapterId }) || []
  
  const handleUploadComplete = (photoIds: string[]) => {
    // Refresh the gallery when uploads complete
    setRefreshGallery(prev => prev + 1)
    
    // Switch to gallery tab
    setActiveTab("gallery")
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Photos</h1>
            {activeTab === "gallery" && (
              <Button onClick={() => setActiveTab("upload")}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photos
              </Button>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="mt-6">
              <PhotoGallery key={`gallery-${refreshGallery}`} chapterId={chapterId} />
            </TabsContent>
            
            <TabsContent value="upload" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Photos</CardTitle>
                    <CardDescription>
                      Upload photos from your device. Photos will be automatically tagged with date and location metadata.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PhotoUploader
                      chapterId={chapterId}
                      userId={userId}
                      onUploadComplete={handleUploadComplete}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upload to Event</CardTitle>
                    <CardDescription>
                      Associate your photos with a specific event.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingEvents.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Select an event to associate your photos with:
                        </p>
                        <div className="space-y-2">
                          {upcomingEvents.map(event => (
                            <Card key={event._id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(event.start_time).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveTab("upload")}
                                  >
                                    Select
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/60" />
                        <h3 className="mt-4 text-lg font-medium">No upcoming events</h3>
                        <p className="text-muted-foreground">
                          There are no upcoming events to associate photos with.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </MainLayout>
  )
} 