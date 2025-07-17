# Product Requirements Document (PRD) for YPO SF Gold Chapter Management Platform

## 1. Overview
- Purpose: A centralized web platform for the YPO SF Gold Chapter (~200 users: 100 members, 100 spouses) to serve as a hub for information and communication. Features include announcements (chapter-scoped with media), events listing (YPO URL scraper for data, Cvent links—no native registration), member directory (searchable profiles with photo/email/phone; opt-in sharing), photos page (uploads with EXIF metadata for event association), admin panel (URL imports, manual entry, user management), profile editing (update pre-populated data), authentication (passwordless/magic email links, OAuth social logins, 2FA TOTP, persistent sessions), and theme toggle (festive/modern). Solves lack of central hub, outperforming Chapter Pro (clunky tool for 200 chapters) by being 20x better in UX. Multi-tenant for scalability; agile for iterations (e.g., future forums, notifications, calendar integrations). Mobile-first, accessible (WCAG), secure (GDPR-ready, end-to-end encryption).
- Target Users: Members (~100), spouses (~100, similar UX), officers/board (all members; roles like chapter_chair, learning_officer), chapter manager (non-member admin for events/announcements).
- Assumptions & Constraints: Cost-effective (free tiers); initial 200 users, low traffic; built on previous project patterns (vibe-coded lessons).
- Success Metrics: 95% opt-in/registration (activate/share data within 3 months); positive feedback (surveys from 50+ users); 70% monthly active users; 99.9% uptime; 80% feature interaction; zero privacy complaints; 50% admin time reduction vs. Chapter Pro.
- Timeline: MVP live by July 28, 2025 (2 weeks from July 14); full version by August 11, 2025. Driven by September chapter calendar start.
- Constraints: Cost-effective (free tiers); initial 200 users, low traffic.
- Risks/Dependencies: Privacy (opt-in process); YPO scraper changes (manual fallback); Cvent integration.

## 2. Features
- **Announcements**: Posted by chapter manager (main admin); text, image, or video (e.g., member showcase); dynamic list (add, delete, edit, reorder).
- **Events Listing**: Alternating photo/description layout; metadata (title, location with Google Maps link, time, full description); admin inputs via Cvent URL scrape or manual; "Register" to Cvent, "Add to Calendar" (.ics with location/link).
- **Member Directory**: Search by first/last name (real-time suggestions); profile fields: photo, email, mobile phone, officer role, member/spouse indicator; opt-in sharing.
- **Photos Page**: Upload from native apps (Android/iPhone Photos, Mac Photos); multiple at once; auto-tag with date/GPS; group by event (miscellaneous folder if no match); reduce high-res/live photo size (<2MB).
- **Admin Panel**: Add/remove/edit users (email, phone, photo); send invitations (single/multiple); create/manage events (main/small/community-led); post announcements with media; no event approval.
- **Profile Editing**: Update photo, email, phone (auto-dash, valid format), hobbies/passions (open field); validation (email regex, phone 10-digit); officer title/role read-only.
- **Authentication**: OAuth (Google/Facebook, skip 2FA if provider-enforced), magic email with TOTP 2FA, 90-day persistent sessions (revoke on anomalies). [IMPLEMENTED]
- **Theme Toggle**: Festive (pastels, Poppins/Lora, animations) and modern (grays, Inter, minimal). [IMPLEMENTED]
- **Notifications**: In-app notifications for events and announcements; notification preferences in user profiles; notification bell with unread count; admin option to trigger notifications. [IMPLEMENTED]
- **Other Integrations**: Future: Stripe/PayPal (payment processing), Cvent API (event management—not phase 1); current: Mailchimp (newsletters), Google Analytics/Mixpanel (tracking), Zoom (virtual events), Google Drive (file storage), Google Maps (.ics embeds), Zapier/Slack (future).
- **UI Enhancements**: UI includes theme toggle (festive/modern) with v0-generated wireframes for login, dashboard, and admin panel, ensuring mobile-first design. [IMPLEMENTED]

## 3. Non-Functional Requirements
- **Security**: End-to-end encryption for all profile data (users/admin panel); GDPR compliance (consent logs, 72-hour breach notification, export/delete rights); Convex auth (JWT, OAuth, magic links, TOTP 2FA, 90-day sessions with revocation on anomalies/IP change); minimize UX friction in 2FA: Skip app 2FA for OAuth if provider-enforced (e.g., Google); require TOTP for email/magic links, balancing security and ease. [IMPLEMENTED]
- **Performance**: <2s load times; expected load up to 100 concurrent users.
- **Scalability**: Cloud hosting with Convex (serverless, auto-scales); Docker for portability; future multi-tenant expansion.
- **Accessibility**: WCAG AA compliance (alt text for photos, ARIA labels, keyboard navigation, high contrast).
- **Mobile Responsiveness**: Mobile-first/native design (responsive, touch-friendly, optimized for phones). [IMPLEMENTED]
- **Reliability**: 99.9% uptime target; daily Convex DB snapshots (free, export .json weekly to Google Drive); error logging with Sentry (free tier, 5k errors/month); monitoring with Convex dashboard/Pingdom (free tier); auto-failover via Convex.

## 4. Roadmap & Milestones
- **MVP**: Live by July 28, 2025 (2 weeks from July 14); includes auth, directory, events/announcements, photos, admin basic controls, profile edit, theme toggle.
  - Progress: Authentication, theme system, and basic UI components implemented. Core foundation in place.
- **Full Version**: By August 11, 2025; adds advanced admin (e.g., bulk invites), notifications, integrations (Stripe, Zoom).
- **Future**: Calendar sync, forums, enhanced analytics.
- **Driving Factor**: Align with September 2025 chapter calendar.

## 5. Risks & Dependencies
- **Risks**: Privacy (opt-in enforcement); YPO scraper changes (manual fallback); Cvent API access delays.
- **Dependencies**: YPO portal for imports; Cvent for registration links; Google Drive for file storage.

## 6. Implementation Status (as of July 28, 2025)
- **Completed**:
  - Project setup (GitHub repository, Next.js with TypeScript, Tailwind CSS, Material-UI, shadcn/ui)
  - Convex backend configuration with schema for users, events, announcements, photos, sessions, and audit logs
  - Theme system with toggle between festive and modern themes
  - Authentication with Clerk (OAuth, magic links, 2FA TOTP, persistent sessions)
  - Core UI components (layout, dashboard, profile, settings pages)
  - Member directory with search functionality
  - Events listing with Cvent integration
  - Photo upload and management
  - Admin panel for user and content management (users, events, announcements, photos)
  - Notifications system with preferences, notification bell, and event notifications
- **In Progress**:
  - Analytics dashboard
- **Pending**:
  - Advanced integrations (Stripe, Zoom, etc.)

Last Updated: July 28, 2025