# Planning Checklist for YPO SF Gold Chapter Management Platform

This checklist contains exhaustive questions to define the project upfront, grouped by category. Status: (Completed), (In Progress), (Pending). Last updated: July 16, 2025. Resume from In Progress categories.

## Category 1: Business & Project Overview (Completed)
- What is the high-level vision for the platform beyond the described features? (e.g., Future expansions like forums?) Answer: Solve lack of central hub; outperform Chapter Pro by 20x UX; scalable multi-tenant; future forums/notifications/calendar.
- Who are the key stakeholders? (e.g., Chapter leaders, members—how many users expected?) Answer: ~100 members, ~100 spouses, officers (chapter_chair, etc.), chapter manager (admin).
- What are the success metrics? (e.g., 80% member adoption, <5% downtime.) Answer: 95% opt-in/registration within 3 months; 50+ user feedback; 70% monthly active; 99.9% uptime; 80% feature use; zero privacy issues; 50% admin time cut.
- Timeline: When do you want MVP live? Full version? Answer: MVP July 28, 2025; full August 11, 2025; driven by September calendar.
- Budget constraints? (e.g., Free tiers for hosting?) Answer: Free tiers (Netlify/Heroku/Convex).
- Risks: (e.g., Data privacy issues with member info?) Answer: Privacy (opt-in); YPO scraper changes; Cvent integration.

## Category 2: User Roles & Permissions (Completed)
- List all user roles: (e.g., Admin: Full access; Member: View/edit own profile; Guest: View events?) Answer: Admin (chapter manager, possibly officers), members, spouses, guest (public events).
- For each role, what can they do? (e.g., Admin: Post announcements, approve photos.) Answer: Admin: Post announcements, create/modify events, manage users; Members/Spouses: View/edit own profile, download contacts, upload photos; Guest: View public events; Officers: Placeholder for future pages.
- Authentication details: (e.g., Email/password, social login? 2FA?) Answer: Convex auth with OAuth, magic links, 2FA TOTP, persistent sessions (90 days)—no SMS.
- Privacy: How to handle sensitive data like phones/emails? (Visible to all members? Opt-in?) Answer: Visible via "I agree" opt-in during registration; meet highest privacy/security standards (GDPR).

## Category 3: Functional Requirements (Features Breakdown) (Completed)
- Announcements: How posted? (Text, images? Notifications via email/push?) Answer: Chapter manager posts text, image, or video; dynamic list (add/delete/edit/reorder); notifications TBD.
- Events: Listing format? (Calendar view? RSVPs?) Answer: Alternating photo/description; metadata (title, location with Maps link, time, description); admin Cvent URL scrape or manual; "Register" to Cvent, "Add to Calendar" (.ics).
- Directory: Search by name/company? Profile fields? (Photo, email, phone, bio?) Answer: Search by first/last name (real-time); fields: photo, email, mobile phone, officer role, member/spouse indicator.
- Photos Page: Upload process? (Multiple at once? Auto-event tagging via metadata like date/GPS?) Answer: Upload from native apps (Android/iPhone/Mac Photos); multiple; auto-tag date/GPS, group by event (miscellaneous if no match); optimize high-res/live (<2MB).
- Admin Panel: What controls? (e.g., User management, event approval.) Answer: Add/remove/edit users (email, phone, photo); send invitations; create/manage events (main/small/community-led); post announcements; no approval.
- Profile Editing: What fields editable? Validation rules? (e.g., Phone format.) Answer: Photo, email, phone (auto-dash, valid 10-digit), hobbies; validation (email regex).
- Other: Any integrations? (e.g., Google Calendar for events?) Answer: Future: Stripe/PayPal, Cvent API; current: Mailchimp, Google Analytics/Mixpanel, Zoom, Google Drive, Google Maps (.ics), Zapier/Slack.

## Category 4: Non-Functional Requirements (Completed)
- Security: End-to-end encryption specifics? (e.g., For messages or all data? Compliance like GDPR?) Answer: All profile data (users/admin); GDPR (consent, 72-hour breach notification).
- Performance: Expected load? (e.g., 100 concurrent users.) Answer: Up to 100 concurrent.
- Scalability: Cloud hosting? (e.g., AWS/Vercel.) Answer: Convex (serverless, auto-scales).
- Accessibility: WCAG compliance? (e.g., Alt text for photos.) Answer: WCAG AA (alt text, ARIA).
- Mobile Responsiveness: Must work on phones? Answer: Yes, mobile-first.
- Reliability: Backup strategy? Error logging? Answer: Daily Convex snapshots, Sentry for logs, 99.9% uptime.

## Category 5: Data Model & Technical Details (Completed)
- Database Schema: Key entities? (e.g., Users: {id, photoUrl, email, phone}; Events: {id, date, photos[]}.)
  - Answer (Preliminary): 
    | Entity         | Description                           | Key Fields                                      | Indexes/Relations            |
    |----------------|---------------------------------------|-------------------------------------------------|------------------------------|
    | Users          | Member/spouse/admin profiles          | id (string), chapter_id (string), email (string, unique), phone (string, optional), photo_url (string), hobbies_passions (string), role (enum: 'member', 'spouse', 'officer', 'admin'), officer_title (string, optional), opt_in (boolean), notification_preferences (array<string>), created_at/updated_at (number) | Indexes: email, role, chapter_id; Relations: To Events/Photos (via IDs) |
    | Announcements  | Admin-posted content                  | id (string), chapter_id (string), title (string), text (string), media_urls (array<string>), order (number), created_by (string), created_at/updated_at (number) | Indexes: chapter_id, order; Relations: To Users (created_by) |
    | Events         | Admin-created events                  | id (string), chapter_id (string), title (string), description (string), location (string), start_time/end_time (number), photo_url (string), cvent_link (string), type (enum: 'main', 'small', 'community_led'), created_by (string), created_at/updated_at (number) | Indexes: chapter_id, start_time; Relations: To Photos (event_id) |
    | Photos         | User uploads with auto-tagging        | id (string), chapter_id (string), url (string), metadata (object: {date: number, gps: {lat: number, lon: number}}), event_id (string), uploaded_by (string), created_at (number) | Indexes: chapter_id, event_id, created_at; Relations: To Events (event_id), Users (uploaded_by) |
    | Sessions/Auth Logs | Track logins/sessions for audits     | id (string), user_id (string), token (string, hashed), device_ip (string), expires_at (number), created_at (number) | Indexes: user_id |
    | Audit Logs     | GDPR/privacy audit trail              | id (string), user_id (string), action (string), details (object), timestamp (number) | Indexes: user_id, timestamp |
- Photo Metadata: How to extract/associate? (e.g., Use date to match event.) Answer: Extract with Sharp/EXIF.js in Convex actions; associate by matching date/GPS to Events (group by event_id; miscellaneous if no match).
- Tech Preferences: Any must-use tools? (e.g., Avoid certain stacks?) Answer: Must-use: Convex, Next.js, Tailwind/Material-UI/shadcn; Avoid: SMS for 2FA/notifications.
- Deployment: Where? (e.g., Vercel for ease.) Answer: Hybrid—Squarespace (static landing), Vercel (dynamic app), Convex (backend/DB).

## Category 6: UI/UX Design (In Progress)
- Theme: Colors, fonts, branding? (e.g., YPO logo integration?) Answer: Colors: #007BFF (primary), #FF7F50 (accents); Fonts: Poppins/Lora (festive), Inter (modern); Branding: YPO logo in header (placeholder).
- Wireframes: High-level sketches? (Describe or link if you have.) Answer: v0 prototypes for login (multi-step auth), dashboard (announcements/events/directory), admin (user/event management); describe layouts in PRD.md.
- User Flows: (e.g., Login -> Dashboard -> Directory.) Answer: Login (OAuth/magic) -> Consent/2FA -> Dashboard (announcements/events) -> Directory (search/profiles).
- Error Handling: User-friendly messages? Answer: Toast notifications (e.g., "Invalid email" in theme colors).

## Category 7: Development Workflow & Tools (Pending)
- How will you use Grok 4? (e.g., For planning, code gen.)
- Cursor Specifics: Any custom rules beyond my draft?
- Testing: Types? (Unit, e2e with Cypress?)
- CI/CD: GitHub Actions?

## Category 8: Maintenance & Post-Launch (Pending)
- How to handle updates? (e.g., Bug reports via platform?)
- Analytics: Track usage? (e.g., Google Analytics.)
- Documentation: Who maintains? (You + AI agents.)