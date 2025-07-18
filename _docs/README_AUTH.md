# Authentication Guide for YPO SF Gold Community Platform

This guide provides detailed information about the authentication system used in the YPO SF Gold Community Platform.

## Authentication Provider: Clerk

The platform uses [Clerk](https://clerk.com) for authentication, which provides a comprehensive solution for user management, authentication, and session handling.

## Configuration Details

- **Frontend API URL**: `https://precise-raptor-97.clerk.accounts.dev`
- **Backend API URL**: `https://api.clerk.com`
- **JWKS URL**: `https://precise-raptor-97.clerk.accounts.dev/.well-known/jwks.json`
- **Publishable Key**: `pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA`

## Authentication Features

1. **Multiple Authentication Methods**:
   - Email/Password
   - Magic email links
   - OAuth providers (Google, GitHub, etc.)

2. **Two-Factor Authentication (2FA)**:
   - TOTP (Time-based One-Time Password) support
   - Configuration managed via Clerk

3. **Persistent Sessions**:
   - Sessions last for 90 days
   - Session management via Clerk

4. **Protected Routes**:
   - Middleware-based route protection
   - Public routes defined in `src/middleware.ts`

## Integration with Convex

Clerk is integrated with Convex to provide authenticated backend access:

1. **JWT Template**:
   A JWT template is configured in Clerk with the following claims:
   ```json
   {
     "userId": "{{user.id}}",
     "email": "{{user.primary_email_address}}",
     "name": "{{user.first_name}} {{user.last_name}}"
   }
   ```

2. **Token Verification**:
   Convex verifies the JWT token using the JWKS URL:
   `https://precise-raptor-97.clerk.accounts.dev/.well-known/jwks.json`

3. **User Synchronization**:
   When a user signs up or logs in, their information is synchronized with the Convex database.

## Authentication Flow

1. **Sign Up**:
   - User navigates to `/sign-up`
   - User creates an account using their preferred method
   - After successful sign-up, user is redirected to `/directory`

2. **Sign In**:
   - User navigates to `/sign-in`
   - User logs in using their credentials
   - After successful sign-in, user is redirected to `/directory`

3. **Session Management**:
   - Sessions are stored in the Convex database in the `sessions` table
   - Users can view and manage their active sessions in settings

4. **Sign Out**:
   - User clicks sign out
   - Session is invalidated
   - User is redirected to the home page

## Environment Variables

The following environment variables are required for authentication:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_A4X6aFUq5n7e2ORPBw9lqZc2SgIrOLrxtZyPLiBskP
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/directory
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/directory
```

## Code Structure

1. **Middleware**:
   - Located at `src/middleware.ts`
   - Defines protected and public routes
   - Handles authentication checks

2. **Clerk Configuration**:
   - Located at `src/lib/clerk.ts`
   - Defines Clerk options and session settings

3. **Providers**:
   - Located at `src/app/providers.tsx`
   - Sets up the Clerk provider for the application

4. **Auth Pages**:
   - Sign In: `src/app/sign-in/[[...sign-in]]/page.tsx`
   - Sign Up: `src/app/sign-up/[[...sign-up]]/page.tsx`

## Troubleshooting

1. **Middleware Import Error**:
   If you encounter an error with the Clerk middleware import, ensure you're using:
   ```typescript
   import { clerkMiddleware } from "@clerk/nextjs/server";
   ```

2. **Authentication Failed**:
   - Check that your environment variables are correctly set
   - Verify that your Clerk application is properly configured
   - Ensure the JWT template for Convex is set up correctly

3. **Session Issues**:
   - Check the session configuration in `src/lib/clerk.ts`
   - Verify that the session duration is set correctly

4. **JWT Verification Failed**:
   - Ensure the JWKS URL is correct
   - Check that the JWT template is properly configured

## Security Considerations

1. **Environment Variables**:
   - Keep your `CLERK_SECRET_KEY` secure
   - Never expose it in client-side code

2. **Session Management**:
   - Sessions are stored securely
   - Users can revoke sessions if needed

3. **2FA**:
   - Encourage users to enable 2FA for enhanced security
   - Provide clear instructions for setting up 2FA 