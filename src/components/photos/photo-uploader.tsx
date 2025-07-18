"use client"

import { useState, useRef } from "react"
import { useMutation, useAction } from "convex/react"
import { api } from "@/lib/convex"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X, Check } from "lucide-react"
import { uploadFileToConvex, validateImageFile } from "@/lib/utils/upload"

interface PhotoUploaderProps {
  chapterId: string
  userId: string
  eventId?: string
  onUploadComplete?: (photoIds: string[]) => void
}

export function PhotoUploader({ chapterId, userId, eventId, onUploadComplete }: PhotoUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  
  // Convex mutations and actions
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl)
  const storePhotoMetadata = useMutation(api.photos.storePhotoMetadata)
  const extractMetadata = useAction(api.photos.extractMetadata)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const newFiles = Array.from(e.target.files)
    const validFiles: File[] = []
    const invalidFiles: string[] = []
    
    newFiles.forEach(file => {
      const error = validateImageFile(file, 5) // 5MB max
      if (error) {
        invalidFiles.push(`${file.name} (${error})`)
      } else {
        validFiles.push(file)
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        setUploadStatus(prev => ({ ...prev, [file.name]: 'pending' }))
      }
    })
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid files",
        description: `${invalidFiles.length} file(s) couldn't be added: ${invalidFiles.join(', ')}`,
        variant: "destructive",
      })
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
  
  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
    setUploadStatus(prev => {
      const newStatus = { ...prev }
      delete newStatus[fileName]
      return newStatus
    })
  }
  
  const uploadFiles = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    const uploadedPhotoIds: string[] = []
    
    try {
      // Upload files one by one
      for (const file of files) {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }))
        
        try {
          const result = await uploadFileToConvex(file, {
            generateUploadUrl,
            storePhotoMetadata,
            extractMetadata,
            chapterId,
            userId,
            eventId,
            onProgress: (progress) => {
              setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
            }
          })
          
          uploadedPhotoIds.push(result.photoId)
          setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }))
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error)
          setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }))
        }
      }
      
      if (uploadedPhotoIds.length > 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${uploadedPhotoIds.length} photo${uploadedPhotoIds.length > 1 ? 's' : ''}`,
        })
        
        if (onUploadComplete) {
          onUploadComplete(uploadedPhotoIds)
        }
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading photos",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      
      // Clear successfully uploaded files
      setFiles(prev => 
        prev.filter(file => uploadStatus[file.name] !== 'success')
      )
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          className="w-full border-dashed border-2 h-24 flex flex-col items-center justify-center"
        >
          <Upload className="h-6 w-6 mb-2" />
          <span>Click to select photos</span>
          <span className="text-xs text-muted-foreground mt-1">
            Supports JPG, PNG, GIF up to 5MB
          </span>
        </Button>
        
        {files.length > 0 && (
          <div className="space-y-2 mt-2">
            {files.map(file => (
              <Card key={file.name} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {uploadStatus[file.name] === 'success' ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : uploadStatus[file.name] === 'error' ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : uploadStatus[file.name] === 'uploading' ? (
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/20" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {uploadStatus[file.name] === 'uploading' && (
                        <div className="w-24">
                          <Progress value={uploadProgress[file.name] || 0} className="h-2" />
                        </div>
                      )}
                      {uploadStatus[file.name] !== 'uploading' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.name)}
                          disabled={uploading}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {files.length > 0 && (
        <Button
          onClick={uploadFiles}
          disabled={uploading || files.length === 0}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload {files.length} Photo{files.length > 1 ? 's' : ''}
            </>
          )}
        </Button>
      )}
    </div>
  )
} 