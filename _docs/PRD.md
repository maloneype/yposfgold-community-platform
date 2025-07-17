# Product Requirements Document (PRD) for YPO SF Gold Chapter Management Platform

## 1. Overview
- Purpose: A centralized platform for YPO SF Gold Chapter (~200 users: 100 members, 100 spouses) to streamline communication and information access, including announcements, event listings (with links to Cvent for registration, using a scraper for YPO event data), member directory (profiles with photo/email/phone), photos page (uploads with metadata-based event association), admin panel, profile editing, authentication, and end-to-end encryption. Designed for scalability (multi-tenant architecture) and extensibility for future expansions like forums, following an agile approach to iteratively surpass third-party solutions like Chapter Pro.
- Target Users: Members (~100), spouses (~100, similar UX to members), officers (including board members, all chapter members), and chapter manager (non-member, full-time employee acting as administrator for events/announcements).
- Assumptions & Constraints: Use cost-effective tools (free Starter tier on Convex for backend/DB); build on previous project patterns; initial scale for 200 users; integrates with Cvent for event registration (no native registration); scraper for YPO event data with manual entry fallback.
- Success Metrics: 95% opt-in/registration rate (members/spouses activate accounts and agree to share pre-populated data like phone/email/photo, within 3 months of launch); positive user feedback (e.g., "This solves key problems like finding events or contacts," via surveys/testimonials from 50+ users); 70% monthly active users; 99.9% uptime; 80% feature interaction (e.g., events/directory); zero privacy complaints; admin time reduction (e.g., 50% less for managing events vs. Chapter Pro).

## 2. Features
- High-Level Features: Announcements (chapter-scoped, media support, real-time sync via Convex); Events Listing (scraped YPO data, Cvent links, types like members_only); Directory (searchable profiles, opt-in sharing); Photos (uploads, EXIF metadata for event linking, stored in Convex Storage); Admin Panel (URL imports, manual entry, user management); Profile Editing; Theme Toggle (festive/modern).
- User Stories: (To be expanded; e.g., "As a member, I can toggle themes for personalized UX.")

## 3. Non-Functional Requirements
- Security: Convex built-in auth (JWT, with public endpoints), RBAC, end-to-end encryption (libs like crypto-js), GDPR-ready (consent for photos/data, opt-in sharing). Incorporate 2FA (TOTP), social logins (Google/Facebook OAuth), magic email links, persistent sessions (1-year unless logged out, revoke on anomalies).
- Performance: <2s load times; handle 200 users with Convex's automatic scaling.
- Tech Stack: See Tech_Stack.md.
- Accessibility: WCAG compliance (ARIA, high contrast).
- Mobile: Mobile-first design (responsive, touch-friendly, optimized for phones).

## 4. Roadmap & Milestones
- MVP: Auth, directory, events/announcements, photos—target live by July 28, 2025 (2 weeks from July 14, 2025).
- Full Version: Enhancements like advanced admin tools, theme toggle—target live by August 11, 2025 (2 weeks after MVP).
- Driving Factor: Align with beginning of chapter calendar in September 2025.
- Future: Calendar integrations, notifications, forums.

## 5. Risks & Dependencies
- Risks: Data privacy (member info, opt-in process); YPO scraping changes (fallback to manual).
- Dependencies: YPO portal access for imports; Cvent for registration links.
