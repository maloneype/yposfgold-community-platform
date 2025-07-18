// Environment variable validation
const requiredEnvVars = [
  'NEXT_PUBLIC_CONVEX_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_ENABLE_ANALYTICS',
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_MIXPANEL_TOKEN',
  'NEXT_PUBLIC_CHAPTER_ID',
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_APP_VERSION',
  'NEXT_PUBLIC_ENVIRONMENT',
] as const;

// Validate required environment variables
function validateEnvVars() {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars);
    console.warn('Make sure your .env.local file is properly configured');
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
}

// Validate environment variables on module load (only in production)
if (process.env.NODE_ENV === 'production') {
  validateEnvVars();
}

// Environment Configuration
export const ENV_CONFIG = {
  // Core Configuration
  CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || 'https://quixotic-clownfish-341.convex.cloud',
  CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA',
  
  // Application Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'YPO SF Gold Community Platform',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  
  // Chapter Configuration
  CHAPTER_ID: process.env.NEXT_PUBLIC_CHAPTER_ID || 'chapter1',
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_PHOTO_UPLOAD: process.env.NEXT_PUBLIC_ENABLE_PHOTO_UPLOAD !== 'false',
  ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
  ENABLE_ANALYTICS_DASHBOARD: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_DASHBOARD !== 'false',
  
  // Analytics Configuration
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  
  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'), // 5MB default
  ALLOWED_FILE_TYPES: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  
  // Third-party API Keys
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  CVENT_API_KEY: process.env.NEXT_PUBLIC_CVENT_API_KEY,
  
  // Development Configuration
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

// App Constants
export const APP_CONFIG = {
  // Chapter Configuration
  CHAPTER_ID: ENV_CONFIG.CHAPTER_ID,
  CHAPTER_NAME: "YPO SF Gold Chapter",
  
  // Placeholder Images
  PLACEHOLDER_USER_AVATAR: "/placeholder-user.jpg",
  PLACEHOLDER_IMAGE: "/placeholder.jpg",
  PLACEHOLDER_LOGO: "/placeholder-logo.svg",
  
  // Contact Information
  CONTACT_EMAIL: "contact@yposfgold.com",
  SUPPORT_EMAIL: "support@yposfgold.com",
  
  // API Configuration
  MAX_UPLOAD_SIZE: ENV_CONFIG.MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES: ENV_CONFIG.ALLOWED_FILE_TYPES,
  
  // UI Configuration
  NOTIFICATION_TIMEOUT: 3000, // 3 seconds
  ITEMS_PER_PAGE: 20,
  SEARCH_DEBOUNCE_MS: 300,
  
  // User Roles
  USER_ROLES: {
    ADMIN: "admin",
    MEMBER: "member",
    SPOUSE: "spouse",
    OFFICER: "officer",
    GUEST: "guest"
  } as const,
  
  // Event Types
  EVENT_TYPES: {
    MAIN: "main",
    SMALL: "small",
    COMMUNITY_LED: "community_led"
  } as const,
  
  // Notification Types
  NOTIFICATION_TYPES: {
    EVENTS: "events",
    ANNOUNCEMENTS: "announcements",
    DIRECT_MESSAGES: "directMessages"
  } as const,
  
  // Theme Configuration
  THEMES: {
    MODERN: "modern",
    FESTIVE: "festive"
  } as const,
  
  // Analytics Events
  ANALYTICS_EVENTS: {
    PAGE_VIEW: "page_view",
    FEATURE_USAGE: "feature_usage",
    USER_ACTIVITY: "user_activity",
    PHOTO_UPLOAD: "photo_upload",
    EVENT_REGISTRATION: "event_registration",
    DIRECTORY_SEARCH: "directory_search",
    PROFILE_UPDATE: "profile_update",
    NOTIFICATION_CLICK: "notification_click",
  } as const,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    THEME: "theme",
    USER_PREFERENCES: "user_preferences",
    RECENT_SEARCHES: "recent_searches",
    ANALYTICS_OPT_OUT: "analytics_opt_out",
  } as const,
  
  // API Endpoints
  API_ENDPOINTS: {
    CONVEX_URL: ENV_CONFIG.CONVEX_URL,
    CLERK_FRONTEND_API: `https://${ENV_CONFIG.CLERK_PUBLISHABLE_KEY.split('_')[2]}.clerk.accounts.dev`,
  } as const,
  
  // Validation Rules
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    MIN_PASSWORD_LENGTH: 8,
    MAX_BIO_LENGTH: 500,
    MAX_TITLE_LENGTH: 100,
  } as const,
  
  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    INVALID_FILE_TYPE: "Invalid file type. Please upload an image file.",
    FILE_TOO_LARGE: `File size exceeds ${ENV_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB limit.`,
    REQUIRED_FIELD: "This field is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_PHONE: "Please enter a valid phone number.",
  } as const,
  
  // Success Messages
  SUCCESS_MESSAGES: {
    PROFILE_UPDATED: "Profile updated successfully!",
    PHOTO_UPLOADED: "Photo uploaded successfully!",
    NOTIFICATION_SENT: "Notification sent successfully!",
    EVENT_CREATED: "Event created successfully!",
    ANNOUNCEMENT_CREATED: "Announcement created successfully!",
    INVITATION_SENT: "Invitation sent successfully!",
  } as const,
} as const;

// Type exports for type safety
export type UserRole = typeof APP_CONFIG.USER_ROLES[keyof typeof APP_CONFIG.USER_ROLES];
export type EventType = typeof APP_CONFIG.EVENT_TYPES[keyof typeof APP_CONFIG.EVENT_TYPES];
export type NotificationType = typeof APP_CONFIG.NOTIFICATION_TYPES[keyof typeof APP_CONFIG.NOTIFICATION_TYPES];
export type ThemeType = typeof APP_CONFIG.THEMES[keyof typeof APP_CONFIG.THEMES];
export type AnalyticsEvent = typeof APP_CONFIG.ANALYTICS_EVENTS[keyof typeof APP_CONFIG.ANALYTICS_EVENTS];

// Utility functions
export const isValidEmail = (email: string): boolean => {
  return APP_CONFIG.VALIDATION.EMAIL_REGEX.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return APP_CONFIG.VALIDATION.PHONE_REGEX.test(phone);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isFeatureEnabled = (feature: keyof typeof ENV_CONFIG): boolean => {
  return Boolean(ENV_CONFIG[feature]);
};

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    environment: ENV_CONFIG.ENVIRONMENT,
    version: ENV_CONFIG.APP_VERSION,
    buildTime: new Date().toISOString(),
    features: {
      analytics: ENV_CONFIG.ENABLE_ANALYTICS,
      photoUpload: ENV_CONFIG.ENABLE_PHOTO_UPLOAD,
      notifications: ENV_CONFIG.ENABLE_NOTIFICATIONS,
      analyticsDashboard: ENV_CONFIG.ENABLE_ANALYTICS_DASHBOARD,
    },
  };
}; 