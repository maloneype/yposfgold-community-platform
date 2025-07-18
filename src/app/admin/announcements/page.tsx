"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/lib/convex"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MainLayout } from "@/components/layout/main-layout"
import { APP_CONFIG } from "@/lib/constants"
import { Loader2, Plus, Trash, Edit, ArrowUp, ArrowDown, Image as ImageIcon, Video } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface AnnouncementFormData {
  title: string;
  text: string;
  mediaUrls: string[];
}

const initialFormData: AnnouncementFormData = {
  title: "",
  text: "",
  mediaUrls: [],
}

export default function AdminAnnouncementsPage() {
  const [formData, setFormData] = useState<AnnouncementFormData>(initialFormData)
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false)
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false)
  const [announcementToEdit, setAnnouncementToEdit] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)
  const [mediaUrl, setMediaUrl] = useState("")
  
  const router = useRouter()
  const { toast } = useToast()
  
  // In a real implementation, you would get the chapter ID from context or user session
  const chapterId = APP_CONFIG.CHAPTER_ID
  const userId = "admin-user-id"
  
  // Fetch announcements from Convex
  const announcements = useQuery(api.announcements.listByChapter, { chapterId }) || []
  
  // Mutations
  const createAnnouncement = useMutation(api.announcements.create)
  const updateAnnouncement = useMutation(api.announcements.update)
  const deleteAnnouncement = useMutation(api.announcements.remove)
  const reorderAnnouncements = useMutation(api.announcements.reorder)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleAddMedia = () => {
    if (!mediaUrl) return
    
    setFormData(prev => ({
      ...prev,
      mediaUrls: [...prev.mediaUrls, mediaUrl],
    }))
    
    setMediaUrl("")
  }
  
  const handleRemoveMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.text) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    
    if (isEditingAnnouncement) {
      handleUpdateAnnouncement()
    } else {
      handleCreateAnnouncement()
    }
  }
  
  const handleCreateAnnouncement = async () => {
    setIsCreatingAnnouncement(true)
    
    try {
      await createAnnouncement({
        chapterId,
        title: formData.title,
        text: formData.text,
        mediaUrls: formData.mediaUrls.length > 0 ? formData.mediaUrls : undefined,
        createdBy: userId,
      })
      
      toast({
        title: "Success",
        description: "Announcement created successfully",
      })
      
      // Reset form
      setFormData(initialFormData)
      
      // Refresh announcements list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      })
    } finally {
      setIsCreatingAnnouncement(false)
    }
  }
  
  const handleEditClick = (announcementId: string) => {
    const announcement = announcements.find(a => a._id === announcementId)
    if (!announcement) return
    
    setAnnouncementToEdit(announcementId)
    setIsEditingAnnouncement(true)
    setFormData({
      title: announcement.title,
      text: announcement.text,
      mediaUrls: announcement.media_urls || [],
    })
  }
  
  const handleUpdateAnnouncement = async () => {
    if (!announcementToEdit) return
    
    setIsCreatingAnnouncement(true)
    
    try {
      await updateAnnouncement({
        id: announcementToEdit,
        title: formData.title,
        text: formData.text,
        mediaUrls: formData.mediaUrls.length > 0 ? formData.mediaUrls : undefined,
      })
      
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      })
      
      // Reset form and state
      setFormData(initialFormData)
      setAnnouncementToEdit(null)
      setIsEditingAnnouncement(false)
      
      // Refresh announcements list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive",
      })
    } finally {
      setIsCreatingAnnouncement(false)
    }
  }
  
  const handleCancelEdit = () => {
    setFormData(initialFormData)
    setAnnouncementToEdit(null)
    setIsEditingAnnouncement(false)
  }
  
  const handleDeleteClick = (announcementId: string) => {
    setAnnouncementToDelete(announcementId)
    setIsDeleteDialogOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!announcementToDelete) return
    
    try {
      await deleteAnnouncement({ id: announcementToDelete })
      
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      })
      
      setIsDeleteDialogOpen(false)
      setAnnouncementToDelete(null)
      
      // Refresh announcements list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      })
    }
  }
  
  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    
    try {
      const announcementId = announcements[index]._id
      const newOrder = announcements[index - 1].order
      
      await reorderAnnouncements({
        id: announcementId,
        newOrder,
      })
      
      // Refresh announcements list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder announcement",
        variant: "destructive",
      })
    }
  }
  
  const handleMoveDown = async (index: number) => {
    if (index === announcements.length - 1) return
    
    try {
      const announcementId = announcements[index]._id
      const newOrder = announcements[index + 1].order
      
      await reorderAnnouncements({
        id: announcementId,
        newOrder,
      })
      
      // Refresh announcements list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder announcement",
        variant: "destructive",
      })
    }
  }
  
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return
    
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    
    if (sourceIndex === destinationIndex) return
    
    try {
      const announcementId = announcements[sourceIndex]._id
      const newOrder = announcements[destinationIndex].order
      
      await reorderAnnouncements({
        id: announcementId,
        newOrder,
      })
      
      // Refresh announcements list
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder announcement",
        variant: "destructive",
      })
    }
  }
  
  const getMediaTypeIcon = (url: string) => {
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      return <ImageIcon className="h-4 w-4" />
    } else if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
      return <Video className="h-4 w-4" />
    } else {
      return <ImageIcon className="h-4 w-4" />
    }
  }
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Manage Announcements</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Announcement Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>{isEditingAnnouncement ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
                <CardDescription>
                  {isEditingAnnouncement ? "Update announcement information" : "Add a new announcement to the platform"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Announcement Title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text">Content *</Label>
                    <Textarea
                      id="text"
                      name="text"
                      placeholder="Announcement content..."
                      value={formData.text}
                      onChange={handleInputChange}
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Media (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Media URL (image or video)"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddMedia} disabled={!mediaUrl}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add URLs to images or videos to include in the announcement
                    </p>
                    
                    {formData.mediaUrls.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.mediaUrls.map((url, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                            <div className="flex items-center gap-2 truncate">
                              {getMediaTypeIcon(url)}
                              <span className="text-sm truncate">{url}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMedia(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    {isEditingAnnouncement && (
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={isCreatingAnnouncement}>
                      {isCreatingAnnouncement ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditingAnnouncement ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>{isEditingAnnouncement ? "Update Announcement" : "Create Announcement"}</>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Announcements List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>
                  Drag and drop to reorder announcements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No announcements found
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="announcements">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {announcements.map((announcement, index) => (
                            <Draggable
                              key={announcement._id}
                              draggableId={announcement._id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="border rounded-md p-4 bg-card"
                                >
                                  <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-start">
                                      <h3 className="font-medium">{announcement.title}</h3>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleMoveUp(index)}
                                          disabled={index === 0}
                                        >
                                          <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleMoveDown(index)}
                                          disabled={index === announcements.length - 1}
                                        >
                                          <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleEditClick(announcement._id)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500"
                                          onClick={() => handleDeleteClick(announcement._id)}
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {announcement.text.length > 100
                                        ? `${announcement.text.substring(0, 100)}...`
                                        : announcement.text}
                                    </p>
                                    {announcement.media_urls && announcement.media_urls.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {announcement.media_urls.map((url, i) => (
                                          <Badge key={i} variant="outline" className="flex items-center gap-1">
                                            {getMediaTypeIcon(url)}
                                            <span className="text-xs">Media {i + 1}</span>
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                    <div className="text-xs text-muted-foreground">
                                      Posted: {formatDate(announcement.created_at)}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
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