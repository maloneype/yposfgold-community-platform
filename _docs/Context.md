# Context for YPO SF Gold Chapter Management Platform

## Project Background
The Young Presidents' Organization (YPO) SF Gold Chapter needs a centralized web platform to serve as a hub for chapter information and communication. Currently, they use disparate tools like email, WhatsApp, and Chapter Pro (a clunky platform serving 200+ chapters). The goal is to create a 20x better UX with a custom platform focused solely on their chapter's needs.

## User Base
- ~100 members (chapter participants)
- ~100 spouses (similar access as members)
- Officers/board (all members with special roles like chapter_chair)
- Chapter manager (non-member admin for events/announcements)

## Core Needs
1. Announcements posting (chapter-wide with media)
2. Events listing (with Cvent registration links)
3. Member directory (searchable with opt-in privacy)
4. Photos sharing (with event association)
5. Admin panel (for content/user management)
6. Profile management (update personal info)
7. Authentication (secure, easy access)
8. Theme options (festive/modern toggle)

## Technical Approach
- Next.js frontend (React 18) with TypeScript
- Material-UI + Tailwind CSS + shadcn/ui for components
- Convex backend/DB (reactive queries/mutations/actions)
- Authentication via Convex (OAuth, magic links, 2FA)
- Mobile-first, accessible design
- Secure, GDPR-compliant data handling

## Timeline
- MVP: July 28, 2025
- Full Version: August 11, 2025
- Driven by September chapter calendar start

## Implementation Status (July 28, 2025)
We have successfully implemented the core foundation of the platform:

1. **Project Setup**
   - Created GitHub repository structure
   - Initialized Next.js with TypeScript
   - Configured Tailwind CSS, Material-UI, and shadcn/ui
   - Set up Convex backend with schema for all required entities

2. **Authentication System**
   - Implemented Clerk for OAuth and magic email links
   - Added TOTP 2FA support
   - Configured persistent sessions (90 days)
   - Created sign-in, sign-up, and session management pages

3. **Theme System**
   - Developed toggle between festive and modern themes
   - Implemented theme context provider
   - Created theme-specific styling with Material-UI ThemeProvider

4. **Core UI Components**
   - Built main layout with header and footer
   - Created dashboard with mock data display
   - Developed profile and settings pages
   - Added security settings for session management

Next steps include completing the member directory with search functionality, implementing the events listing with Cvent integration, building the photo upload and management system, and finalizing the admin panel for comprehensive user and content management.

Last Updated: July 28, 2025