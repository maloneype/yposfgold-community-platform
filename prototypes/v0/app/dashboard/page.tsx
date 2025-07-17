// v0 prototype dashboard/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/placeholder-logo.svg" alt="YPO Logo" className="h-8 w-8" />
            <span className="font-bold text-xl">YPO SF Gold</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-sm font-medium hover:underline" href="/dashboard">
              Dashboard
            </Link>
            <Link className="text-sm font-medium hover:underline" href="/events">
              Events
            </Link>
            <Link className="text-sm font-medium hover:underline" href="/directory">
              Directory
            </Link>
            <Link className="text-sm font-medium hover:underline" href="/photos">
              Photos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <img
                src="/placeholder-user.jpg"
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
              />
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button>New Announcement</Button>
            </div>
            <Tabs defaultValue="announcements" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>
              <TabsContent value="announcements" className="mt-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>New Board Members</CardTitle>
                      <CardDescription>Posted July 15, 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Congratulations to our newly elected board members! We're excited to welcome Jane Smith as Chapter Chair,
                        John Doe as Learning Officer, and Alice Johnson as Membership Officer.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <img
                          src="/placeholder-user.jpg"
                          alt="Jane Smith"
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <img
                          src="/placeholder-user.jpg"
                          alt="John Doe"
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <img
                          src="/placeholder-user.jpg"
                          alt="Alice Johnson"
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">Read More</Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Annual Survey</CardTitle>
                      <CardDescription>Posted July 10, 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Please complete the annual member satisfaction survey by July 31. Your feedback helps us improve the chapter
                        experience for everyone.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button>Take Survey</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="events" className="mt-6">
                <div className="grid gap-6">
                  <Card>
                    <div className="md:grid md:grid-cols-3">
                      <div className="md:col-span-1">
                        <img
                          src="/placeholder.jpg"
                          alt="Event Image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 p-6">
                        <h3 className="text-2xl font-bold">Monthly Dinner</h3>
                        <p className="text-muted-foreground mt-2">July 30, 2025 • 7:00 PM</p>
                        <p className="mt-4">
                          Join us for our monthly dinner at The Ritz-Carlton. Our guest speaker will be
                          renowned entrepreneur and author, Mark Williams.
                        </p>
                        <div className="mt-6 flex gap-4">
                          <Button>Register</Button>
                          <Button variant="outline">Add to Calendar</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="md:grid md:grid-cols-3">
                      <div className="md:col-span-1">
                        <img
                          src="/placeholder.jpg"
                          alt="Event Image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 p-6">
                        <h3 className="text-2xl font-bold">Leadership Workshop</h3>
                        <p className="text-muted-foreground mt-2">August 5, 2025 • 9:00 AM</p>
                        <p className="mt-4">
                          A full-day workshop focused on developing leadership skills and strategies
                          for navigating complex business challenges.
                        </p>
                        <div className="mt-6 flex gap-4">
                          <Button>Register</Button>
                          <Button variant="outline">Add to Calendar</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="members" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <img
                          src="/placeholder-user.jpg"
                          alt="Member Photo"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                        <h3 className="mt-4 font-bold">Jane Smith</h3>
                        <p className="text-sm text-muted-foreground">CEO, Innovative Tech Solutions</p>
                        <p className="mt-2 text-sm">Member since 2020</p>
                        <Button variant="outline" className="mt-4 w-full">View Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <img
                          src="/placeholder-user.jpg"
                          alt="Member Photo"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                        <h3 className="mt-4 font-bold">John Doe</h3>
                        <p className="text-sm text-muted-foreground">Founder, Global Ventures</p>
                        <p className="mt-2 text-sm">Member since 2018</p>
                        <Button variant="outline" className="mt-4 w-full">View Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <img
                          src="/placeholder-user.jpg"
                          alt="Member Photo"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                        <h3 className="mt-4 font-bold">Alice Johnson</h3>
                        <p className="text-sm text-muted-foreground">President, Johnson Enterprises</p>
                        <p className="mt-2 text-sm">Member since 2019</p>
                        <Button variant="outline" className="mt-4 w-full">View Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <img src="/placeholder-logo.svg" alt="YPO Logo" className="h-6 w-6" />
            <span className="text-sm font-medium">YPO SF Gold Chapter</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Young Presidents' Organization. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 