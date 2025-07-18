# Environment Setup Guide

This guide explains how to set up environment variables for the YPO SF Gold Community Platform across different environments.

## Local Development

Create a `.env.local` file in the root directory with the following variables:

```env
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://quixotic-clownfish-341.convex.cloud

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_A4X6aFUq5n7e2ORPBw9lqZc2SgIrOLrxtZyPLiBskP

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/directory
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/directory

# Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token_here

# Application Configuration
NEXT_PUBLIC_APP_NAME=YPO SF Gold Community Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_CHAPTER_ID=chapter1

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development
```

## Production Environment

For production deployment (Vercel), set the following environment variables:

### Required Variables

```env
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://quixotic-clownfish-341.convex.cloud

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_A4X6aFUq5n7e2ORPBw9lqZc2SgIrOLrxtZyPLiBskP

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/directory
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/directory

# Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Application Configuration
NEXT_PUBLIC_APP_NAME=YPO SF Gold Community Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_CHAPTER_ID=chapter1

# Production Configuration
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
```

### Optional Variables

```env
# Email Service (for invitations)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=5242880  # 5MB in bytes
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Feature Flags
NEXT_PUBLIC_ENABLE_PHOTO_UPLOAD=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS_DASHBOARD=true

# Third-party Integrations
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_CVENT_API_KEY=your_cvent_api_key_here

# Monitoring and Logging
SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_SENTRY_DSN=your_public_sentry_dsn_here

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token_here
```

## Testing Environment

For testing, create a `.env.test` file:

```env
# Test Configuration
NODE_ENV=test
NEXT_PUBLIC_ENVIRONMENT=test

# Mock Services
NEXT_PUBLIC_CONVEX_URL=https://mock-convex-url.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_mock_key
CLERK_SECRET_KEY=sk_test_mock_secret

# Disable Analytics in Tests
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Environment Variable Descriptions

### Required Variables

- `NEXT_PUBLIC_CONVEX_URL`: URL for the Convex backend
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key for authentication
- `CLERK_SECRET_KEY`: Clerk secret key (server-side only)
- `NEXT_PUBLIC_CLERK_*_URL`: Clerk redirect URLs

### Optional Variables

- `NEXT_PUBLIC_ENABLE_ANALYTICS`: Enable/disable analytics tracking
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics measurement ID
- `NEXT_PUBLIC_MIXPANEL_TOKEN`: Mixpanel project token
- `SENDGRID_API_KEY`: SendGrid API key for email invitations
- `SENTRY_DSN`: Sentry DSN for error tracking
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key for location features

## Security Considerations

1. **Never commit sensitive keys to version control**
2. **Use environment-specific keys** (test keys for development, production keys for production)
3. **Rotate keys regularly** especially for production environments
4. **Use Vercel's environment variable encryption** for production secrets
5. **Validate environment variables** at application startup

## Setting Up in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with appropriate scope:
   - `Production`: For production builds
   - `Preview`: For preview builds
   - `Development`: For local development

## Validation

The application includes environment variable validation. If required variables are missing, the application will show an error message during startup.

## Troubleshooting

### Common Issues

1. **"Environment variable not found"**: Check variable names and spelling
2. **"Clerk authentication failed"**: Verify Clerk keys are correct
3. **"Convex connection failed"**: Check Convex URL and deployment status
4. **"Analytics not working"**: Verify analytics keys and enable flag

### Debug Commands

```bash
# Check environment variables
npm run env-check

# Run with debug logging
DEBUG=* npm run dev

# Test environment setup
npm run test:env
```

## Development Commands

```bash
# Copy example environment file
cp .env.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

Last Updated: January 2025 