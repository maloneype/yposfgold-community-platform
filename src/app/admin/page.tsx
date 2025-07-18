"use client"

import { useRouter } from "next/navigation"
import { Shield, Users, Calendar, Megaphone, ImageIcon, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"

export default function AdminPage() {
  const router = useRouter()

  const adminSections = [
    {
      title: "User Management",
      description: "Add, edit, or remove users and send invitations",
      icon: <Users className="h-8 w-8 mb-2" />,
      path: "/admin/users",
    },
    {
      title: "Events Management",
      description: "Create and manage events, including Cvent integration",
      icon: <Calendar className="h-8 w-8 mb-2" />,
      path: "/admin/events",
    },
    {
      title: "Announcements",
      description: "Post and manage announcements for the chapter",
      icon: <Megaphone className="h-8 w-8 mb-2" />,
      path: "/admin/announcements",
    },
    {
      title: "Photos Management",
      description: "Manage uploaded photos and their event associations",
      icon: <ImageIcon className="h-8 w-8 mb-2" />,
      path: "/admin/photos",
    },
    {
      title: "Analytics Dashboard",
      description: "View user engagement and platform usage statistics",
      icon: <BarChart className="h-8 w-8 mb-2" />,
      path: "/admin/analytics",
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Shield className="mr-2 h-6 w-6" /> Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your chapter's content and users
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminSections.map((section) => (
              <Card key={section.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center">{section.icon}</div>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {section.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button onClick={() => router.push(section.path)}>
                    {section.title === "Analytics Dashboard" ? "View Analytics" : `Manage ${section.title.split(" ")[0]}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 