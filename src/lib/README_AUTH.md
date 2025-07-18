# Authentication Setup for YPO SF Gold Community Platform

This document provides details about the authentication setup for the YPO SF Gold Community Platform using Clerk and Convex.

## Clerk Configuration

The platform uses [Clerk](https://clerk.com) for authentication. Here are the key configuration details:

### API URLs

- **Frontend API URL**: `https://precise-raptor-97.clerk.accounts.dev`
- **Backend API URL**: `https://api.clerk.com`
- **JWKS URL**: `https://precise-raptor-97.clerk.accounts.dev/.well-known/jwks.json`

### API Keys

- **Publishable Key**: `pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA`
- **Secret Key**: Keep this secure and never expose it in client-side code

### Environment Variables

The following environment variables should be set:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### JWT Template for Convex

Create a JWT template in Clerk with the following claims:

```json
{
  "userId": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "name": "{{user.first_name}} {{user.last_name}}"
}
```

## Integration with Convex

The platform uses [Convex](https://convex.dev) as the backend. Here's how Clerk is integrated with Convex:

### Authentication Flow

1. User signs in using Clerk
2. Clerk issues a JWT token
3. The JWT token is verified using the JWKS URL
4. The verified claims are used to authenticate the user in Convex

### Key Files

- **`src/lib/clerk.ts`**: Contains Clerk configuration options
- **`src/middleware.ts`**: Sets up the Clerk middleware for Next.js
- **`convex/auth.ts`**: Contains session management functions
- **`convex/clerk.ts`**: Contains functions for verifying Clerk tokens and syncing users

## Local Development

For local development, create a `.env.local` file in the `yposfgold-community-platform` directory with the following variables:

```
# Convex
NEXT_PUBLIC_CONVEX_URL=https://quixotic-clownfish-341.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Production Deployment

For production deployment, set the environment variables in your Vercel project settings. See [VERCEL_DEPLOYMENT.md](../../VERCEL_DEPLOYMENT.md) for more details.

## Troubleshooting

If you encounter authentication issues:

1. **JWT Verification Errors**:
   - Check that the JWKS URL is correct
   - Verify that the JWT template in Clerk is properly configured
   - Ensure the Clerk API keys are correct

2. **Session Management Issues**:
   - Check the session duration settings in Clerk
   - Verify that the session token is being properly stored and retrieved

3. **Redirect Issues**:
   - Make sure the redirect URLs are properly configured in Clerk
   - Check that the environment variables for the redirect URLs are set correctly

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Next.js Authentication Documentation](https://nextjs.org/docs/authentication) 