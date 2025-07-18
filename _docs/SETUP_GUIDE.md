# Setup Guide for YPO SF Gold Community Platform

This guide will help you set up the YPO SF Gold Community Platform for local development.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Git

## Project Structure

This project is a Next.js application with a clean root-level structure.

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd yposfgold-community-platform.com
   ```

2. **Create environment file**:
   Create a `.env.local` file in the root directory with the following content:

   ```
   NEXT_PUBLIC_CONVEX_URL=https://quixotic-clownfish-341.convex.cloud
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
   CLERK_SECRET_KEY=sk_test_A4X6aFUq5n7e2ORPBw9lqZc2SgIrOLrxtZyPLiBskP
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/directory
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/directory
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Start the Convex backend** (in a separate terminal):
   ```bash
   npx convex dev
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Testing

The project includes comprehensive testing infrastructure:

### Unit Tests
```bash
npm test                  # Run all unit tests
npm run test:watch        # Run tests in watch mode
```

### E2E Tests
```bash
npm run test:e2e         # Run Cypress E2E tests
```

### Performance Tests
```bash
npm run test:lighthouse  # Run Lighthouse performance tests
```

### CI/CD
The project includes GitHub Actions workflows that automatically:
- Run all tests on pull requests
- Build and deploy to staging/production
- Run security scans and dependency checks
- Monitor performance with Lighthouse CI

## Authentication Setup

The project uses Clerk for authentication. The configuration is already set up with the following details:

- Frontend API URL: https://precise-raptor-97.clerk.accounts.dev
- Backend API URL: https://api.clerk.com
- JWKS URL: https://precise-raptor-97.clerk.accounts.dev/.well-known/jwks.json
- Publishable Key: pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA

## Backend Setup

The project uses Convex for the backend. The configuration is already set up with the following details:

- Convex URL: https://quixotic-clownfish-341.convex.cloud

## Troubleshooting

If you encounter any issues during setup:

1. **Middleware error with Clerk**:
   - Ensure you're using the correct import in `src/middleware.ts`:
   ```typescript
   import { clerkMiddleware } from "@clerk/nextjs/server";
   ```

2. **Environment variables not loading**:
   - Make sure your `.env.local` file is in the correct location (in the root directory)
   - Restart the development server after adding or changing environment variables

3. **Build errors**:
   - Check for any dependency issues by running `npm install` again
   - Clear the `.next` directory and try building again

4. **Multiple lockfiles warning**:
   - If you see warnings about multiple lockfiles, you can safely remove the `package-lock.json` file if you're using pnpm as your package manager

## Project Features

The YPO SF Gold Community Platform includes the following features:

1. **Authentication System**
   - OAuth and magic email links via Clerk
   - TOTP 2FA support
   - Persistent sessions (90 days)

2. **Member Directory**
   - Real-time search functionality
   - User profile cards with contact information
   - Opt-in privacy filtering

3. **Events System**
   - Events listing with Cvent URL integration
   - Calendar (.ics) file generation
   - Event filtering by type

4. **Photos Management**
   - Photo upload with multiple file support
   - Photo gallery with event grouping
   - Metadata extraction

5. **Admin Panel**
   - User management
   - Announcements management
   - Photos management

6. **Notifications System**
   - Notification preferences
   - Notification bell with unread count
   - Event notifications 