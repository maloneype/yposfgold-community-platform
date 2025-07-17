# Features List

## Theme: Core Platform
### Epic: Authentication & Security
  #### User Story: As a user, I can login easily and securely so access is convenient without compromising safety.
    ##### Tasks:
      - [ ] Implement JWT base with RBAC.
      - [ ] Add E2E encryption for data transmission.
      - [ ] Integrate social logins (Google/Facebook via OAuth/Auth0).
      - [ ] Add passwordless magic email links for simple login.
      - [ ] Incorporate 2FA (e.g., TOTP via authenticator apps).
      - [ ] Enable persistent sessions (1-year refresh token unless logged out; secure with HTTP-only cookies, revoke on anomalies like IP change).
      - [ ] During registration, include "I agree" step to opt-in and unlock pre-populated data (phone/email/photo) for chapter sharing; users can update photo.

## Theme: Member Management
### Epic: Directory & Profiles
  - User Story: As a member, view/search directory with photos/email/phone (only for opted-in users).
  - Tasks: [ ] Build searchable list; [ ] Enable profile edits; [ ] Pre-populate data but require opt-in to share.

## Theme: Events & Announcements
### Epic: Events Listing
  - User Story: As a user, I can view events with links to Cvent registration pages.
  - Tasks: [ ] Implement YPO URL scraper to pull event data; [ ] Add Cvent links; [ ] Admin (chapter manager) posts/updates events/announcements.

## (And so on—expanded later from checklist.)
