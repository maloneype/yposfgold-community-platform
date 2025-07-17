# UI/UX Style Guide

## Colors
- Festive: Pastels (greens #00FF7F, blues #007BFF, lavenders #E6E6FF, golds #FFD700, corals #FF7F50).
- Modern: Grays (#F0F5F5), blues (#007BFF primary).

## Typography
- Festive: Headings: Poppins (bold, 24-32px); Body: Lora (16px).
- Modern: All: Inter (16px headings bold, 14px body).

## Components
- Buttons: Festive (rounded 16px radius, hover scale 1.05 with color shift); Modern (sharp 4px radius, quick fade). Mobile: Minimum 48px height for touch targets.
- Cards (e.g., profiles/events): Soft shadows festive, sharp modern. Mobile: Stack vertically, swipe for navigation.
- Animations: Festive (gentle float 20s); Modern (none or 0.2s transitions).
- Toggle: User setting in profile, stored in localStorage or DB.

## Responsiveness
- Mobile-first: Design starts at <768px (phone), scales up to tablet/desktop. Use Tailwind's mobile utilities; test on emulators for phone usability (e.g., easy scrolling, no zoom needed).
- Accessibility: Contrast >4.5:1, ARIA for all; keyboard + touch navigation.
