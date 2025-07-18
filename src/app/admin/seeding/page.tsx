"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/lib/convex"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, Trash2, Sprout, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SeedingPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  // Queries
  const placeholderStatus = useQuery(api.seeding.checkPlaceholderData)
  
  // Mutations
  const seedData = useMutation(api.seeding.seedPlaceholderData)
  const clearData = useMutation(api.seeding.clearPlaceholderData)

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const result = await seedData()
      toast({
        title: "Seeding Complete",
        description: `Successfully created ${result.counts.users} users, ${result.counts.events} events, ${result.counts.announcements} announcements, and ${result.counts.photos} photos.`,
      })
    } catch (error) {
      toast({
        title: "Seeding Failed",
        description: "Failed to seed placeholder data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  const handleClear = async () => {
    setIsClearing(true)
    try {
      await clearData()
      toast({
        title: "Data Cleared",
        description: "All placeholder data has been successfully removed.",
      })
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear placeholder data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Database Seeding</h1>
        <p className="text-muted-foreground">
          Manage placeholder data for testing and development. All placeholder data is carefully 
          compartmentalized and can be easily removed without affecting real data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Placeholder Data Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {placeholderStatus ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {placeholderStatus.exists ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium">
                    {placeholderStatus.exists ? "Placeholder data exists" : "No placeholder data"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Users:</span>
                    <Badge variant="outline">{placeholderStatus.counts.users}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Events:</span>
                    <Badge variant="outline">{placeholderStatus.counts.events}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Announcements:</span>
                    <Badge variant="outline">{placeholderStatus.counts.announcements}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Photos:</span>
                    <Badge variant="outline">{placeholderStatus.counts.photos}</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading status...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSeed}
              disabled={isSeeding || isClearing}
              className="w-full"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                <>
                  <Sprout className="w-4 h-4 mr-2" />
                  Seed Database
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleClear}
              disabled={isSeeding || isClearing || !placeholderStatus?.exists}
              variant="destructive"
              className="w-full"
            >
              {isClearing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Clearing Data...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Placeholder Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Information Cards */}
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>What gets seeded:</strong> 5 main events, 3 small events, 2 community-led events, 
            5 announcements, 20 directory entries (10 members + 10 spouses with officer roles), 
            and approximately 50 photos with realistic reactions.
          </AlertDescription>
        </Alert>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Safety:</strong> All placeholder data uses a specific chapter ID 
            ("placeholder_chapter_ypo_sf_gold") making it completely separate from real data 
            and easily removable.
          </AlertDescription>
        </Alert>

        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Features included:</strong> The seeded data includes photo reactions, 
            event associations, user profiles with realistic information, and proper 
            metadata for testing all platform features.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
} 