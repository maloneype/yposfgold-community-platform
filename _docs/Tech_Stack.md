# Tech Stack for YPO SF Gold Platform

## Frontend
- Framework: Next.js (with React 18; built-in routing/SSR for better mobile performance and SEO on public pages like events).
- UI Library: Material-UI 5 (for components like directories/forms) + Tailwind CSS 3 (utility classes; mobile-first utilities emphasized, e.g., sm: breakpoints).
- Animations: Framer Motion 12 (for festive theme effects).
- State: React Context API.
- HTTP: Axios.
- Theme: Dual toggle (festive: Poppins/Lora fonts, pastels, watercolor animations; modern: Inter font, grays/blues, minimal). Use CSS custom properties for dynamic switching.

## Backend
- Runtime: Node.js 18.
- Framework: Express 4.
- Database: PostgreSQL (relational for structured multi-tenant data; free on Heroku—preferred over MongoDB for ACID transactions in user/event management).
- Auth: JWT 9 base, enhanced with Auth0 or Firebase Auth (for Google/Facebook OAuth, magic email links, 2FA support; free tiers). Persistent sessions via long-lived refresh tokens (1-year exp, secure storage in HTTP-only cookies).
- Scraping: Cheerio (for YPO event imports to link to Cvent).
- Images: Sharp (processing/optimization, EXIF for metadata).
- Other: Multer for uploads.

## Security & Tools
- Encryption: End-to-end via HTTPS + client-side libs (e.g., Web Crypto API).
- Testing: Jest (multi-config: standard/fast), React Testing Library, Supertest.
- Deployment: Netlify (frontend, free CDN), Heroku (backend/DB, free tier).
- CI/CD: GitHub Actions.
- Monitoring: Heroku metrics.

## Decisions on Differences
- DB: Postgres over Mongo—better for relations (e.g., users <-> events <-> photos), multi-tenant queries.
- Frontend: Next.js + Material-UI + Tailwind hybrid—Next for power, Material for speed, Tailwind for custom themes.
- Auth Enhancements: Auth0/Firebase for user-friendly features (social/magic links/2FA)—secure, scalable.