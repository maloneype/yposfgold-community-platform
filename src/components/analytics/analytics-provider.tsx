'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { initAnalytics, trackPageView } from '@/lib/analytics';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const [sessionId] = useState(() => uuidv4());
  
  // Convex mutations for analytics tracking
  const trackPageViewMutation = useMutation(api.analytics.trackPageView);
  const updateUserActivityMutation = useMutation(api.analytics.updateUserActivity);
  
  // Initialize third-party analytics services
  useEffect(() => {
    initAnalytics();
  }, []);
  
  // Track page views in both third-party services and our database
  useEffect(() => {
    if (pathname) {
      // Track in third-party services
      trackPageView(pathname);
      
      // Track in our database if we have chapter info
      // In a real app, you'd get the chapter_id from context or user data
      const chapter_id = "default_chapter"; // Replace with actual chapter_id
      
      // Get browser info
      const browser = navigator.userAgent;
      const os = navigator.platform;
      const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
      
      // Track page view in Convex
      trackPageViewMutation({
        chapter_id,
        user_id: isSignedIn ? user.id : undefined,
        page_path: pathname,
        session_id: sessionId,
        device_info: {
          browser,
          os,
          device_type: deviceType
        }
      });
      
      // Update user activity if signed in
      if (isSignedIn) {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        updateUserActivityMutation({
          chapter_id,
          user_id: user.id,
          date: today,
          session_duration: 0, // Just visiting, not tracking duration yet
          features_used: [], // No features used yet on page visit
          pages_visited: [pathname] // Convert to array
        });
      }
    }
  }, [pathname, isSignedIn, user, sessionId, trackPageViewMutation, updateUserActivityMutation]);
  
  return <>{children}</>;
} 