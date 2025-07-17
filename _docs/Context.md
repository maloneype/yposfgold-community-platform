# Context.md: Essential Project Context for YPO SF Gold Chapter Management Platform

This document serves as a comprehensive, self-contained summary of the project context, designed for seamless continuation in a new chat thread with Grok 4 or another LLM. It includes roles, process, artifacts, planning status, and key decisions. Last updated: July 14, 2025 (based on current date). Use this to pick up where we left off, as chat context windows may limit recall.

## 1. Roles and Interaction Style
- **Grok's Role**: I am Grok 4, acting as a world-class software engineer and teacher/coach. I guide the project through structured planning, provide feedback/suggestions (e.g., on tech choices, security), generate/update artifacts, and ensure best practices (e.g., agile workflows, clean code, security). I respond to user inputs/random thoughts by integrating them immediately, updating documents, and circling back to the process without shying away from deeper analysis.
- **User's Role**: You (the user) provide project details, answers to questions, random thoughts, and decisions (e.g., tech switches). I confirm updates and resume systematically.
- **Interaction**: Conversations are iterative and voice-mode friendly (concise, no full read-backs). User shares thoughts; I summarize, update artifacts, and advance the checklist. Handle tangents by parking them if off-topic, but integrate relevant ones (e.g., auth enhancements). All documentation in Markdown; commit to GitHub repo "ypo-sf-gold-platform" after tasks.

## 2. Project Overview and Vision
- **Purpose**: Build a centralized web app for YPO SF Gold Chapter (~200 users: 100 members, 100 spouses) as a hub for information/communication. Features: Announcements (chapter-scoped, media, real-time sync), events listing (YPO URL scraper for data, Cvent links—no native registration), member directory (searchable profiles with photo/email/phone; opt-in sharing), photos page (uploads with EXIF metadata for event association), admin panel (URL imports, manual entry, user management), profile editing (update pre-populated data), authentication (passwordless/magic email links, OAuth social logins, 2FA TOTP, persistent sessions up to 90 days with revocation), theme toggle (festive/modern).
- **Vision**: Solve lack of central hub, outperforming Chapter Pro (clunky tool for 200 chapters) by being 20x better in UX. Multi-tenant for scalability to other chapters; agile for iterations (e.g., future forums, notifications, calendar integrations). Mobile-first, accessible (WCAG), secure (GDPR-ready, end-to-end encryption).
- **User Roles/Stakeholders**: Members (~100), spouses (~100, similar UX), officers/board (all members; roles like chapter_chair, learning_officer), chapter manager (non-member admin for events/announcements).
- **Success Metrics**: 95% opt-in/registration (activate/share data within 3 months); positive feedback (surveys from 50+ users); 70% monthly active users; 99.9% uptime; 80% feature interaction; zero privacy complaints; 50% admin time reduction vs. Chapter Pro.
- **Timeline**: MVP live by July 28, 2025 (2 weeks from July 14); full version by August 11, 2025. Driven by September chapter calendar start.
- **Constraints**: Cost-effective (free tiers); initial 200 users, low traffic.
- **Risks/Dependencies**: Privacy (opt-in process); YPO scraper changes (manual fallback); Cvent integration.

## 3. Workflow and Process
- **Overall Approach**: Agile-inspired, from high-level abstraction (vision/PRD) to mid-level (features/architecture) to detailed (stories/tasks). Use roll-ups: Tasks (checklists) → User Stories ("As [role], I [action] so [benefit]") → Epics/Features → Themes/Modules → Roadmap. Checkpoints after epics (e.g., code review).
- **Planning Checklist**: Exhaustive questions grouped by category to define everything upfront. Current status: Completed Category 4 (Non-Functional Requirements). Resume at Category 5 (Data Model & Technical Details). Answer category questions, then update artifacts.
  - Category 1-4: Completed (vision, roles, requirements, non-functional).
  - Category 5: Next (schema, metadata, tech preferences, deployment).
- **Development Practices**: Best practices (DRY code, ESLint, testing with Jest/RTL/Supertest, CI/CD with GitHub Actions). Use Grok for planning/ideation/reviews; Cursor for coding/scripts. Commit to GitHub after tasks (Conventional Commits, e.g., "feat(auth): Add login"); branches (main/develop/feature/); issues for tasks.
- **Cursor Setup**: Rules for AI prompts (follow stack, document code, mobile-first). Notepads for common prompts (e.g., generate component, review code).
- **Updates Mechanism**: User inputs → I integrate/update artifacts → Confirm changes → Resume checklist.

## 4. Tech Stack
- **Frontend**: Next.js (React 18, SSR/SEO), Material-UI + Tailwind CSS, Framer Motion (animations), React Context API, Axios. Theme toggle (festive/modern).
- **Backend & DB**: Convex (BaaS for reactive DB, functions, auth, storage; free Starter tier, real-time sync, TypeScript code).
- **Auth/Security**: Convex built-in (JWT, OAuth for Google/Facebook, magic links, 2FA TOTP, persistent sessions 90 days with revocation on anomalies/IP change), end-to-end encryption (HTTPS/Web Crypto).
- **Other**: Cheerio (scraping in Convex actions), Sharp (images/EXIF), Convex Storage (uploads).
- **Testing/Deployment**: Jest, React Testing Library, Supertest. Vercel/Netlify for frontend; Convex for backend/DB (serverless auto-deploy). CI/CD: GitHub Actions. Monitoring: Convex dashboard.
- **Portability**: Docker for backend/local dev; Convex code-based for easy export/migration.
- **Decisions**: Convex over Heroku/Postgres for simplicity, free tier, real-time. Postgres-like structure via Convex tables.

## 5. Artifacts Maintained
All in Markdown; store in GitHub /docs/ folder. Update as needed.
- **PRD.md**: Overview, features, non-functional, roadmap, risks.
- **Tech_Stack.md**: Stack details, decisions, portability.
- **Style_Guide.md**: UI/UX specs (colors, typography, components, responsiveness).
- **Features_List.md**: Hierarchical epics/stories/tasks.
- **Context.md**: This file—for continuity in new chats.

## 6. Current Status and Next Steps
- **Progress**: Planning Checklist Categories 1-4 complete; Category 5 ready (data model next).
- **Next**: Answer Category 5 questions to define schema/metadata/tech/deployment; then proceed to UI/UX or code. If resuming, provide answers or new thoughts—I’ll update artifacts and continue.