# Vercel Deployment Guide for YPO SF Gold Community Platform

## Project Structure

This project is a Next.js application with a clean root-level structure.

## Deployment Configuration

The project includes a `vercel.json` file at the root level with the following configuration:

```json
{
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_CONVEX_URL": "https://quixotic-clownfish-341.convex.cloud",
    "NEXT_PUBLIC_ENABLE_ANALYTICS": "true",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA"
  }
}
```

This configuration tells Vercel:
- The framework type (Next.js)
- What environment variables to use

## Environment Variables

Ensure the following environment variables are set in your Vercel project:

1. `NEXT_PUBLIC_CONVEX_URL`: Your Convex backend URL
2. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
3. `CLERK_SECRET_KEY`: Your Clerk secret key (set as a secret environment variable)
4. `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: `/sign-in`
5. `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: `/sign-up`
6. `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: `/directory`
7. `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: `/directory`
8. `NEXT_PUBLIC_ENABLE_ANALYTICS`: `true` (if using analytics)

## Local Development Setup

For local development, create a `.env.local` file in the root directory with the same environment variables.

## Clerk Authentication Setup

Clerk is configured with the following settings:

- Frontend API URL: https://precise-raptor-97.clerk.accounts.dev
- Backend API URL: https://api.clerk.com
- JWKS URL: https://precise-raptor-97.clerk.accounts.dev/.well-known/jwks.json

## Convex Backend Setup

Convex is configured with the following settings:

- Convex URL: https://quixotic-clownfish-341.convex.cloud
- JWT template for Clerk integration is configured in the Convex dashboard

## Troubleshooting

If you encounter deployment issues:

1. Verify that your `vercel.json` file is correctly configured
2. Check that all required environment variables are set
3. Ensure the Clerk middleware is correctly imported in `src/middleware.ts`
4. Check for any build errors in the Vercel deployment logs 