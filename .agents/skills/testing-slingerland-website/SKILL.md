# Testing the Slingerland Website

## Overview
The Slingerland Literacy Institute website is a static single-page HTML site using Tailwind CSS (CDN), jsPDF, and Firebase. It uses Vite as a dev server/builder.

## Local Setup
```bash
cd /home/ubuntu/repos/Slingerland
npm install
npm run dev
```
The dev server runs on http://localhost:5173 (or next available port).

To build for production:
```bash
npm run build
```
Output goes to `dist/` directory.

## Deployment
- Build first with `npm run build`
- Deploy the `dist/` folder as a static frontend
- The site is entirely client-side — no backend needed

## Key Test Flows

### 1. Navigation & Smooth Scrolling
- Click nav links (Home, Approach, Classes & Cert, Schools & Tutors, Shop, About Us)
- Verify smooth scroll to the correct section
- The header is fixed at the top with `scroll-padding-top: 5rem` to offset the fixed header

### 2. Mobile Hamburger Menu
- Use DevTools device emulation (not just window resize — window resize may not trigger CSS breakpoints)
- The mobile breakpoint is `lg:hidden` which means < 1024px viewport width
- Click the hamburger icon (≡) to open; it should show an X close icon
- All nav links should appear in the dropdown
- Clicking a nav link should close the menu and scroll to that section

### 3. PDF Downloads
- Scroll to "Instructor & Parent Resources" section
- Click any "Download PDF" link
- A PDF file should be generated client-side via jsPDF and downloaded
- The PDF content comes from hidden textareas in the DOM (`#markdown-downloads`)

### 4. FAQ Accordion
- Located in the "Approach" section
- Uses native `<details>/<summary>` HTML elements
- Click a question to expand/collapse; animation is CSS-based

### 5. Lead Capture Form
- Located in the "Shop & Donate" section
- **Note:** Firebase is configured with a demo projectId by default
- Without real Firebase credentials, form submission will show an error
- This is a known limitation for the prototype stage

### 6. Admin Dashboard
- At the bottom of the page, there's an "Admin Access: View Lead Database" link
- This opens a modal that reads leads from Firestore
- Same Firebase limitation applies — won't work without real credentials

## Known Limitations
- Firebase uses demo config — lead form and admin dashboard won't work without real credentials
- Tailwind CSS uses CDN (not build-step) — acceptable for prototype
- No favicon configured
- XSS risk in admin dashboard innerHTML — should be sanitized before production

## Devin Secrets Needed
- No secrets needed for basic testing (the site is static)
- Firebase credentials would be needed to test the lead capture form and admin dashboard in the future
