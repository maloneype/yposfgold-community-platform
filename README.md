# YPO SF Gold Community Platform

A centralized web platform for the YPO SF Gold Chapter (~200 users) to serve as a hub for information and communication.

## Features

- **Authentication System**: OAuth, magic email links, and 2FA support
- **Theme System**: Toggle between festive and modern themes
- **Member Directory**: Searchable directory with privacy controls
- **Events System**: Event listing with Cvent integration
- **Photos Management**: Photo uploads with event association
- **Admin Panel**: User, event, and content management
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
   NEXT_PUBLIC_CONVEX_URL=https://sincere-starfish-983.convex.cloud
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
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

### Development Servers

The project requires two development servers:

1. **Next.js Frontend**: `npm run dev` (runs on http://localhost:3000)
2. **Convex Backend**: `npx convex dev` (syncs backend functions)

## Documentation

- [Setup Guide](./_docs/SETUP_GUIDE.md) - Step-by-step setup instructions
- [Deployment Guide](./_docs/VERCEL_DEPLOYMENT.md) - Vercel deployment instructions
- [Authentication Guide](./_docs/README_AUTH.md) - Authentication system details
- [Features List](./_docs/Features_List.md) - Detailed feature specifications
- [PRD](./_docs/PRD.md) - Product Requirements Document
- [Style Guide](./_docs/Style_Guide.md) - UI/UX style guidelines
- [Tech Stack](./_docs/Tech_Stack.md) - Technical architecture details

## Timeline

- **MVP**: July 28, 2025 ✅
- **Full Version**: August 11, 2025
- **Production Launch**: September 2025

## License

This project is proprietary and confidential.

## Contact

For questions or support, please contact the project maintainer. 