import { useCallback } from 'react';
import { trackEvent, trackFeatureUsage, identifyUser } from '@/lib/analytics';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useUser } from '@clerk/nextjs';

export function useAnalytics() {
  const { user, isSignedIn } = useUser();
  
  // Convex mutations
  const trackFeatureUsageMutation = useMutation(api.analytics.trackFeatureUsage);
  const updateUserActivityMutation = useMutation(api.analytics.updateUserActivity);
  
  // Track feature usage in both third-party services and our database
  const trackFeature = useCallback((feature: string, details?: Record<string, any>) => {
    // Track in third-party services
    trackFeatureUsage(feature, details);
    
    // Track in our database if user is signed in
    if (isSignedIn && user) {
      // In a real app, you'd get the chapter_id from context or user data
      const chapter_id = "default_chapter"; // Replace with actual chapter_id
      
      // Track feature usage in Convex
      trackFeatureUsageMutation({
        chapter_id,
        user_id: user.id,
        feature,
        action: details?.action || 'use',
        details
      });
      
      // Update user activity
      updateUserActivityMutation({
        chapter_id,
        user_id: user.id,
        feature_used: feature
      });
    }
  }, [isSignedIn, user, trackFeatureUsageMutation, updateUserActivityMutation]);
  
  // Track custom events
  const trackCustomEvent = useCallback((category: string, action: string, label?: string, value?: number) => {
    // Track in third-party services
    trackEvent(category, action, label, value);
    
    // For custom events, we might not track in our database unless needed
    // This could be expanded if needed
  }, []);
  
  // Identify user for analytics
  const identifyUserForAnalytics = useCallback((userId: string, userProperties?: Record<string, any>) => {
    // Identify in third-party services
    identifyUser(userId, userProperties);
    
    // We don't need to do anything special in our database for this
    // User identity is already tracked with each event
  }, []);
  
  return {
    trackFeature,
    trackCustomEvent,
    identifyUserForAnalytics
  };
} 