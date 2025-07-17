// v0 prototype page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/placeholder-logo.svg" alt="YPO Logo" className="h-8 w-8" />
            <span className="font-bold text-xl">YPO SF Gold</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-sm font-medium hover:underline" href="#">
              Home
            </Link>
            <Link className="text-sm font-medium hover:underline" href="#">
              Events
            </Link>
            <Link className="text-sm font-medium hover:underline" href="#">
              Directory
            </Link>
            <Link className="text-sm font-medium hover:underline" href="#">
              Photos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button>Sign In</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Welcome to the YPO SF Gold Community Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Your central hub for chapter information, events, and connections.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg">Sign Up</Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Stay informed about chapter activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-medium">Monthly Dinner</h3>
                      <p className="text-sm text-muted-foreground">July 30, 2025 • 7:00 PM</p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-medium">Leadership Workshop</h3>
                      <p className="text-sm text-muted-foreground">August 5, 2025 • 9:00 AM</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Family Picnic</h3>
                      <p className="text-sm text-muted-foreground">August 15, 2025 • 12:00 PM</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Events</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Latest updates from the chapter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-medium">New Board Members</h3>
                      <p className="text-sm text-muted-foreground">Congratulations to our newly elected board members!</p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-medium">Annual Survey</h3>
                      <p className="text-sm text-muted-foreground">Please complete the annual member satisfaction survey.</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Website Launch</h3>
                      <p className="text-sm text-muted-foreground">Welcome to our new community platform!</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Announcements</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Member Spotlight</CardTitle>
                  <CardDescription>Get to know your fellow members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src="/placeholder-user.jpg"
                      alt="Member Photo"
                      className="rounded-full h-24 w-24 object-cover"
                    />
                    <div className="text-center">
                      <h3 className="font-medium">Jane Smith</h3>
                      <p className="text-sm text-muted-foreground">CEO, Innovative Tech Solutions</p>
                      <p className="mt-2 text-sm">
                        Jane has been a YPO member for 5 years and recently launched her third successful startup.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Member Directory</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
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