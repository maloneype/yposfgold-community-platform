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
9. Notifications system (for events and announcements)

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

## Implementation Status (July 29, 2025)
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
   - Created theme-specific styling with CSS variables
   - Added theme persistence using localStorage

4. **UI Component Library**
   - Created core UI components (Button, Popover, ScrollArea, Checkbox) following shadcn/ui patterns
   - Implemented theme-aware styling with proper color variables
   - Used the specified color palette (#007BFF, #FF7F50, etc.)
   - Applied typography rules based on theme (Poppins/Lora for festive, Inter for modern)

5. **Core UI Components**
   - Built main layout with header and footer
   - Created dashboard with mock data display
   - Developed profile and settings pages
   - Added security settings for session management

6. **Member Directory**
   - Implemented real-time search functionality by name, email, title, and hobbies
   - Created user profile cards with contact information
   - Added opt-in privacy filtering
   - Designed responsive grid layout for desktop and mobile

7. **Events System**
   - Built events listing with alternating photo/description layout
   - Implemented Cvent URL integration for registration
   - Created calendar (.ics) file generation for adding to personal calendars
   - Developed event filtering by type and search functionality
   - Added admin interface for event management with Cvent URL scraping

8. **Photos Management**
   - Implemented photo upload with multiple file support
   - Added progress tracking for uploads
   - Created photo gallery with event grouping
   - Built metadata extraction for date/GPS data
   - Designed responsive grid layout with modal view for photos

9. **Admin Panel**
   - Created main admin dashboard with navigation to different admin sections
   - Implemented user management (add/edit/remove users)
   - Added invitation system for sending magic links to new users
   - Built announcements management with reordering functionality
   - Developed photos management with event association
   - Designed responsive layouts for all admin interfaces

10. **Notifications System**
    - Created notification preferences in user profiles
    - Implemented notification bell in header with unread count
    - Built notification popover with mark-as-read functionality
    - Added event notifications for creation and updates
    - Implemented admin option to toggle notifications during event creation
    - Developed backend infrastructure for notification storage and delivery

11. **Analytics Dashboard** (in progress)
    - Planning implementation of user engagement tracking
    - Designing dashboard interface for platform usage statistics
    - Integrating Google Analytics and Mixpanel for data collection

## Areas for Improvement

We've identified several areas that need attention to ensure complete conformance with the style guide and technical requirements:

1. **Global CSS Integration**
   - The globals.css file needs to be properly integrated into the project structure
   - CSS variables should be consistently applied across all components

2. **Font Configuration**
   - Fonts need to be properly loaded via Next.js font optimization
   - Typography should be consistent across all components and themes

3. **Component Library Consistency**
   - All components should follow the same pattern and style
   - Documentation should be added for all components

4. **Theme Toggle Integration**
   - The theme toggle should be added to the header component
   - Theme preferences should be synced with user profiles in the database

## Next Steps

In our next development phase, we will focus on:

1. Addressing the identified areas for improvement to ensure complete conformance with the style guide
2. Completing the analytics dashboard implementation
3. Preparing for the full version release with thorough testing and optimization

Last Updated: July 29, 2025