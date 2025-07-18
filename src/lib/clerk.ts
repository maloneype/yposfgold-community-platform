import { ClerkProvider, SignIn, SignUp } from '@clerk/nextjs';

// Configure Clerk options here
export const clerkOptions = {
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/directory',
  afterSignUpUrl: '/directory',
  // 90 days in seconds
  tokenCache: {
    enabled: true,
    maxAge: 90 * 24 * 60 * 60, // 90 days in seconds
  },
};

// Session token expiration (90 days)
export const sessionOptions = {
  // 90 days in seconds
  sessionDurationInSeconds: 90 * 24 * 60 * 60,
}; 