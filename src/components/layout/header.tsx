'use client';

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";
import { NotificationBell } from "./notification-bell";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-mobile";

export function Header() {
  const { theme } = useTheme();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const handleLoginClick = () => {
    router.push('/sign-in');
  };
  
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary bg-surface shadow-sm transition-colors duration-300">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary hover:text-accent transition-colors duration-300">
            YPO SF Gold
          </Link>
          
          {isMobile ? (
            <div className="flex items-center gap-2">
              {isLoaded && isSignedIn && user?.id && (
                <NotificationBell userId={user.id} />
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isLoaded && isSignedIn ? (
                    <>
                      <DropdownMenuItem onClick={() => handleNavigation('/directory')}>
                        Directory
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation('/announcements')}>
                        Announcements
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation('/events')}>
                        Events
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation('/photos')}>
                        Photos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                        Profile
                      </DropdownMenuItem>
                      {user?.publicMetadata?.role === 'admin' && (
                        <DropdownMenuItem onClick={() => handleNavigation('/admin')} className="text-secondary">
                          Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <SignOutButton>
                          <Button variant="ghost" className="w-full text-destructive hover:bg-destructive hover:text-surface">
                            Sign Out
                          </Button>
                        </SignOutButton>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={handleLoginClick}>
                      Sign In
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {isLoaded && isSignedIn && user?.id && (
                <NotificationBell userId={user.id} />
              )}
              
              {isLoaded && isSignedIn ? (
                <>
                  <nav className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                      <Link href="/directory">Directory</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/announcements">Announcements</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/events">Events</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/photos">Photos</Link>
                    </Button>
                  </nav>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary hover:border-accent transition-colors duration-300">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                        <AvatarFallback>
                          {user?.fullName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                        Profile
                      </DropdownMenuItem>
                      {user?.publicMetadata?.role === 'admin' && (
                        <DropdownMenuItem onClick={() => handleNavigation('/admin')} className="text-secondary">
                          Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <SignOutButton>
                          <Button variant="ghost" className="w-full text-destructive hover:bg-destructive hover:text-surface">
                            Sign Out
                          </Button>
                        </SignOutButton>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button onClick={handleLoginClick} className="bg-primary text-surface hover:bg-accent">
                  Sign In
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 