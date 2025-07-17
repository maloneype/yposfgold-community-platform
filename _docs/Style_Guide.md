# UI/UX Style Guide

## Theme Portability and Toggle
- **Modular Design**: Themes defined as JS objects (e.g., festive.js, modern.js) with CSS vars for colors/typography/shadows. Add new themes (e.g., "holiday") by creating files and registering in a theme switcher module.
- **Toggle Mechanism**: Use Material-UI ThemeProvider + Tailwind CSS classes/dark mode; user selects via profile setting, persisted in Convex DB/localStorage. Switch triggers re-render with new vars.
- **Consistency**: Root-level provider applies theme globally to all components/pages (including admin panels, directory, events). No per-component overrides needed; test for uniform application.
- **Extensibility**: Easy to add themes later (e.g., import new object, update registry); supports dynamic loading for future expansions.

## Colors
- **Primary**: #007BFF (YPO Blue)
- **Secondary**: #FF7F50 (Coral Orange, for accents like Admin links)
- **Festive**: #00FF7F (Spring Green), #E6E6FF (Lavender), #FFC107 (Amber)
- **Modern**: #F0F5F5 (Light Gray), #007BFF (Blue)

## Typography
- **Festive**: Headings (Poppins, 24px bold), Body (Lora, 16px)
- **Modern**: All text (Inter, 16px)
- **Fallback**: ui-sans-serif (headings), ui-serif (body) with font-display: swap

## Components
- **Buttons**: Rounded corners (border-radius: 8px), Hover: Scale 1.05 (transition: 0.2s), Disabled: Opacity 0.5
- **Cards**: Solid white (#FFFFFF) with soft shadow (box-shadow: 0 2px 4px rgba(0,0,0,0.1)), Padding: 16px
- **Inputs**: Border: 1px solid #ccc, Focus: #007BFF outline

## Responsiveness
- **Mobile-First**: Breakpoints at 768px (sm), 1024px (md); touch-friendly (min 48px buttons)
- **Accessibility**: Alt text for all images, ARIA labels, WCAG AA (contrast ratio 4.5:1)

## Preferred Vibe-Coded Inspiration
- Subtle gradients (white to #E6E6FF blue for festive, #F0F5F5 for modern)
- Card layouts: Image left/text right, bold blue titles, gray body, date badge bottom right
- Navigation: Tabs (Home/Announcements/Events/Photos/Profile/Admin/Logout) with orange #FF7F50 accent on Admin
- Avoid glassmorphism/translucency for readability/consistency with vibe-coded inspiration

Last Updated: July 16, 2025