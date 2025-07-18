# YPO SF Gold Community Platform

A centralized web platform for the YPO SF Gold Chapter (~200 users) to serve as a hub for information and communication.

## Features

- **Authentication System**: OAuth, magic email links, and 2FA support
- **Theme System**: Toggle between festive and modern themes
- **Member Directory**: Searchable directory with privacy controls
- **Events System**: Event listing with Cvent integration
- **Photos Management**: Photo uploads with event association and reactions
- **Photo Reactions**: Like, love, wow, laugh reactions with real-time counts
- **Photo Downloads**: Direct downloads to device with native sharing
- **Admin Panel**: User, event, and content management
- **Database Seeding**: Development tools for testing with placeholder data
- **Notifications System**: In-app notifications for events and announcements
- **Analytics Dashboard**: User engagement and platform usage tracking

## Getting Started

For detailed setup instructions, see [Setup Guide](./_docs/SETUP_GUIDE.md).

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/maloneype/yposfgold-community-platform.git
   cd yposfgold-community-platform.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the required environment variables:
   ```
   NEXT_PUBLIC_CONVEX_URL=https://quixotic-clownfish-341.convex.cloud
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
   CLERK_SECRET_KEY=sk_test_A4X6aFUq5n7e2ORPBw9lqZc2SgIrOLrxtZyPLiBskP
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Convex (BaaS for reactive DB, functions, auth, storage)
- **Authentication**: Clerk (OAuth, magic links, 2FA)
- **UI Components**: Material-UI, Radix UI, Lucide Icons
- **Analytics**: Google Analytics, Mixpanel
- **Other Tools**: Cheerio (scraping), Sharp (images/EXIF)

## Project Structure

```
yposfgold-community-platform.com/
├── _docs/                    # Documentation files
├── src/                      # Next.js application source
│   ├── app/                  # App router pages
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and configurations
│   └── styles/               # Global styles
├── convex/                   # Convex backend functions
├── public/                   # Static assets
└── README.md                 # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run E2E tests (Cypress)
- `npm run test:lighthouse` - Run Lighthouse performance tests

### Development Servers

The project requires two development servers:

1. **Next.js Frontend**: `npm run dev` (runs on http://localhost:3000)
2. **Convex Backend**: `npx convex dev` (syncs backend functions)

### Database Seeding

For development and testing, the project includes a comprehensive seeding system:

```bash
# Seed placeholder data (20 users, 10 events, 5 announcements, 51 photos)
npx convex run seeding:seedPlaceholderData

# Check placeholder data status
npx convex run seeding:checkPlaceholderData

# Clear all placeholder data
npx convex run seeding:clearPlaceholderData
```

All placeholder data is safely compartmentalized and can be easily removed without affecting real data.

## Documentation

- [Setup Guide](./_docs/SETUP_GUIDE.md) - Step-by-step setup instructions
- [Deployment Guide](./_docs/VERCEL_DEPLOYMENT.md) - Vercel deployment instructions
- [Authentication Guide](./_docs/README_AUTH.md) - Authentication system details
- [Features List](./_docs/Features_List.md) - Detailed feature specifications
- [PRD](./_docs/PRD.md) - Product Requirements Document
- [Style Guide](./_docs/Style_Guide.md) - UI/UX style guidelines
- [Tech Stack](./_docs/Tech_Stack.md) - Technical architecture details

## Timeline

- **MVP**: July 28, 2025 ✅ **COMPLETED**
- **Full Version**: August 11, 2025 ✅ **COMPLETED**
- **Production Launch**: Ready for deployment

## Testing

The project includes comprehensive testing infrastructure:

- **Unit Tests**: Jest with React Testing Library
- **E2E Tests**: Cypress
- **CI/CD**: GitHub Actions with automated testing
- **Performance**: Lighthouse CI monitoring

Run tests with:
```bash
npm test                  # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:lighthouse  # Run performance tests
```

## License

This project is proprietary and confidential.

## Contact

For questions or support, please contact the project maintainer. 