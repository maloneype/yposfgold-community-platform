# Features List for YPO SF Gold Chapter Management Platform

## Theme: Core Platform
### Epic: Authentication & Security
- **User Story**: As a user, I can sign up/login securely to access the platform so that I can manage my profile and view chapter content.
  - **Tasks**: 
    - [ ] Implement Convex auth with OAuth (Google/Facebook), magic email links, and optional TOTP 2FA (skip for OAuth if provider-enforced).
    - [ ] Implement 2FA skip for OAuth (provider-enforced) per v0 flow sims.
    - [ ] Add end-to-end encryption for all profile data using Web Crypto API.
    - [ ] Set persistent sessions to 90 days with revocation on anomalies (e.g., IP change).

### Epic: Theme & UI
- **User Story**: As a user, I can toggle between festive and modern themes so that I can personalize my experience.
  - **Tasks**: 
    - [ ] Implement theme toggle with Material-UI ThemeProvider and Tailwind CSS vars.
    - [ ] Define festive theme (pastels, Poppins/Lora, animations) and modern theme (grays, Inter, minimal).
    - [ ] Ensure theme consistency across all pages (admin, directory, events).
    - [ ] Generate wireframes with v0 for login, dashboard, admin panel.
    - [ ] Ensure mobile-first responsiveness per v0 outputs.

## Theme: Member Management
### Epic: Directory & Profiles
- **User Story**: As a member, I can view and edit my profile and search the directory so that I can connect with others.
  - **Tasks**: 
    - [ ] Implement real-time search by first/last name with autocomplete.
    - [ ] Display profile fields: photo, email, phone, hobbies, role (member/spouse), officer title (read-only).
    - [ ] Add opt-in privacy toggle during registration.
    - [ ] Allow profile editing with validation (email regex, phone auto-dash).

### Epic: Events Listing
- **User Story**: As a user, I can view events and add them to my calendar so that I can stay informed and attend.
  - **Tasks**: 
    - [ ] Implement YPO URL scraper in Convex actions for event data.
    - [ ] Create admin interface for Cvent URL scrape or manual entry (edit before save).
    - [ ] Design event list with alternating photo/description layout.
    - [ ] Add “Register” button linking to Cvent and “Add to Calendar” button generating .ics file.

### Epic: Photos Management
- **User Story**: As a user, I can upload photos to associate with events so that I can share memories.
  - **Tasks**: 
    - [ ] Enable uploads from native apps (Android/iPhone Photos, Mac Photos).
    - [ ] Support multiple uploads at once.
    - [ ] Auto-tag with date/GPS metadata and group by event (miscellaneous folder if no match).
    - [ ] Optimize high-res/live photos (<2MB) using Sharp.

### Epic: Admin Panel
- **User Story**: As an admin, I can manage users, events, and announcements so that I can maintain the platform.
  - **Tasks**: 
    - [ ] Add/remove/edit users (email, phone, photo, officer title, member/spouse).
    - [ ] Send invitation emails (single/multiple with magic links).
    - [ ] Create/manage events (main/small/community-led types).
    - [ ] Post announcements with text/image/video and reorder list.

## Theme: Integrations & Enhancements
### Epic: Notifications & Analytics
- **User Story**: As a user, I can set notification preferences and track usage so that I stay updated and improve the platform.
  - **Tasks**: 
    - [ ] Add notification preferences (email/push) in profiles.
    - [ ] Notify on event create/edit if opted-in.
    - [ ] Integrate Google Analytics and Mixpanel for tracking.
    - [ ] Admin option to trigger notifications during event creation.

### Epic: Future Integrations
- **User Story**: As an admin, I can integrate future tools so that the platform evolves.
  - **Tasks**: 
    - [ ] Plan Stripe/PayPal for payment processing (future phase).
    - [ ] Explore Cvent API for event management (not phase 1).
    - [ ] Add Zoom for virtual events.
    - [ ] Use Google Drive for file storage.
    - [ ] Note Zapier/Slack as future automation/community options.

Last Updated: July 16, 2025