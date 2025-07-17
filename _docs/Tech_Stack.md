# Tech Stack for YPO SF Gold Platform

## Frontend
- **Framework**: Next.js (React 18, SSR/SEO, mobile-first routing).
- **UI Libraries**: Material-UI + Tailwind CSS (utility classes, responsive design), Framer Motion (animations), shadcn/ui (customizable components via copy-paste), v0 (Vercel AI UI generator for rapid prototyping, outputting React/shadcn/Tailwind code).
- **State Management**: React Context API.
- **HTTP**: Axios.
- **Theme**: Dual toggle (festive: pastels #00FF7F green/#E6E6FF lavender, Poppins/Lora fonts, gentle animations; modern: #F0F5F5 gray/#007BFF blue, Inter font, minimal); CSS variables for portability.

## Backend & DB
- **Platform**: Convex (BaaS for reactive DB, functions, auth, storage; free Starter tier, TypeScript code, real-time sync).
- **Auth/Security**: Convex built-in (JWT, OAuth for Google/Facebook, magic links, TOTP 2FA optional for email, 90-day persistent sessions with revocation on anomalies/IP change), end-to-end encryption (HTTPS/Web Crypto).
- **Scraping**: Cheerio (in Convex actions for YPO URLs).
- **Images**: Sharp (EXIF extraction, resizing/conversion in Convex Storage).
- **Storage**: Convex Storage (uploads), Google Drive (future file sharing).

## Testing & Deployment
- **Testing**: Jest, React Testing Library, Supertest.
- **Deployment**: Hybrid—Squarespace for static landing (yposfgold.com, branding/login redirect), Vercel for dynamic app subdomain (app.yposfgold.com, Next.js frontend), Convex for backend/DB (serverless auto-deploy).
- **CI/CD**: GitHub Actions.
- **Monitoring**: Convex dashboard, Pingdom (free tier).

## Decisions
- **Convex over Heroku/Postgres**: Simpler, free tier, real-time; Postgres-like structure via Convex tables.
- **v0/shadcn/ui**: Rapid prototyping, customizable components alongside Material-UI/Tailwind.
- **Auth**: Convex over Auth0 for low-friction (push-based 2FA optional, no SMS).

Last Updated: July 15, 2025