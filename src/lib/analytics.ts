import ReactGA from 'react-ga4';
import mixpanel from 'mixpanel-browser';
import { api } from './convex';
import { useMutation, useQuery } from 'convex/react';

// Replace with your actual tracking IDs
const GA_TRACKING_ID = 'G-XXXXXXXXXX';
const MIXPANEL_TOKEN = 'your_mixpanel_token';

// Initialize analytics services
export const initAnalytics = () => {
  // Only initialize in production or if explicitly enabled in development
  if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true')) {
    // Initialize Google Analytics
    ReactGA.initialize(GA_TRACKING_ID);
    
    // Initialize Mixpanel
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV !== 'production',
      ignore_dnt: false // Respect Do Not Track settings
    });
    
    console.log('Analytics services initialized');
  }
};

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true')) {
    // Google Analytics page view
    ReactGA.send({ hitType: "pageview", page: path });
    
    // Mixpanel page view
    mixpanel.track('Page View', { path });
  }
};

// Track events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true')) {
    // Google Analytics event
    ReactGA.event({
      category,
      action,
      label,
      value
    });
    
    // Mixpanel event
    mixpanel.track(action, {
      category,
      label,
      value
    });
  }
};

// Set user identity
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true')) {
    // Google Analytics user ID
    ReactGA.set({ userId });
    
    // Mixpanel user identity
    mixpanel.identify(userId);
    
    // Set user properties if provided
    if (userProperties) {
      mixpanel.people.set(userProperties);
    }
  }
};

// Track feature usage
export const trackFeatureUsage = (feature: string, details?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true')) {
    // Track as event in Google Analytics
    ReactGA.event({
      category: 'Feature',
      action: 'Use',
      label: feature
    });
    
    // Mixpanel track with more details
    mixpanel.track('Feature Used', {
      feature,
      ...details
    });
  }
};

// Hook to use analytics in components
export const useAnalyticsData = () => {
  // Use queries for fetching data
  const userActivity = useQuery(api.analytics.getUserActivity);
  const featureUsage = useQuery(api.analytics.getFeatureUsage);
  const pageViews = useQuery(api.analytics.getPageViews);
  const allAnalyticsData = useQuery(api.analytics.getAllAnalyticsData);
  
  // Use mutations for tracking
  const trackPageViewMutation = useMutation(api.analytics.trackPageView);
  const trackFeatureUsageMutation = useMutation(api.analytics.trackFeatureUsage);
  const updateUserActivityMutation = useMutation(api.analytics.updateUserActivity);
  
  return {
    // Queries
    userActivity,
    featureUsage,
    pageViews,
    allAnalyticsData,
    
    // Mutations
    trackPageView: trackPageViewMutation,
    trackFeatureUsage: trackFeatureUsageMutation,
    updateUserActivity: updateUserActivityMutation,
  };
}; 