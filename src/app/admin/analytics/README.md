# Analytics Dashboard

This directory contains the implementation of the YPO SF Gold Chapter Management Platform's analytics dashboard.

## Overview

The analytics dashboard provides insights into user engagement and platform usage statistics. It integrates with both third-party analytics services (Google Analytics and Mixpanel) and our own database to track and visualize user activity.

## Features

- **User Activity Tracking**: Monitor active users and new user registrations over time
- **Feature Usage Analysis**: Understand which features are most popular among users
- **Page Views Statistics**: Track which pages receive the most traffic
- **Data Visualization**: Interactive charts and graphs for easy data interpretation

## Implementation Details

### Data Collection

We collect analytics data through multiple channels:

1. **Third-Party Services**:
   - Google Analytics 4: For page views, events, and user demographics
   - Mixpanel: For detailed feature usage and user behavior tracking

2. **Internal Database**:
   - `page_views` table: Records every page view with user and device information
   - `feature_usage` table: Tracks specific feature interactions
   - `user_activity` table: Aggregates daily user activity metrics

### Components

- **AnalyticsProvider**: Initializes analytics services and tracks page views automatically
- **useAnalytics Hook**: Custom hook for tracking feature usage and custom events
- **Analytics Dashboard**: Admin interface for visualizing analytics data

### Convex Functions

- `trackPageView`: Records page view data in our database
- `trackFeatureUsage`: Logs feature usage events
- `updateUserActivity`: Updates daily user activity aggregates
- `getUserActivity`, `getFeatureUsage`, `getPageViews`: Query functions for retrieving analytics data
- `getAllAnalyticsData`: Combines all analytics data for the dashboard

## Usage

### Tracking Page Views

Page views are automatically tracked by the `AnalyticsProvider` component, which is included in the app's providers.

### Tracking Feature Usage

```tsx
import { useAnalytics } from '@/hooks/use-analytics';

function MyComponent() {
  const { trackFeature } = useAnalytics();
  
  const handleButtonClick = () => {
    // Track feature usage when button is clicked
    trackFeature('download_calendar', { action: 'click', eventId: '123' });
    
    // Perform the actual action
    downloadCalendar();
  };
  
  return <button onClick={handleButtonClick}>Download Calendar</button>;
}
```

### Tracking Custom Events

```tsx
import { useAnalytics } from '@/hooks/use-analytics';

function MyComponent() {
  const { trackCustomEvent } = useAnalytics();
  
  const handleFormSubmit = () => {
    // Track custom event
    trackCustomEvent('Form', 'Submit', 'Registration Form', 1);
    
    // Submit the form
    submitForm();
  };
  
  return <form onSubmit={handleFormSubmit}>...</form>;
}
```

## Future Enhancements

- Real-time analytics updates using Convex's reactive queries
- User segmentation for more targeted analysis
- Custom report generation and export functionality
- Anomaly detection for unusual usage patterns
- Integration with notification system for important analytics alerts 