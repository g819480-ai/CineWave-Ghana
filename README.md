# NOCTURA

A premium, mobile-friendly movie-streaming front-end prototype built for GitHub and Cloudflare Pages deployment.

## What is included
- Cinematic Netflix-inspired landing page with premium black + crimson aesthetic
- Category navigation for Home, Movies, Ghanaian Films, Nollywood, Hollywood, Bollywood, Korean Dramas, and My List
- Search, category filters, hero banner, and premium movie card layout
- Movie details modal and HTML5 video player with subtitle track demo
- Supporting pages for About, Contact, Privacy Policy, Terms, and Account
- Sample catalogue data clearly marked as examples until verified licensing is confirmed

## Local development
```bash
cd /path/to/project
python3 -m http.server 8080
```

Then open:
- http://localhost:8080/index.html

## Files to review
- `public/index.html` — homepage and primary UI
- `public/site.js` — catalog data, filters, list management, modal, and player interactions
- `public/styles.css` — design system and responsive layout
- `public/about.html` — brand overview page
- `public/contact.html` — contact form shell
- `public/privacy.html` — privacy policy page
- `public/terms.html` — terms page
- `public/account.html` — account flow shell
- `public/sample.vtt` — sample subtitle file for the player demo

## Deployment notes
This project is designed as a static front-end prototype for Cloudflare Pages. It does not bundle an authenticated backend, real billing, or licensed media storage. Before production launch, connect a secure backend with:
- verified movie metadata and licenses
- a real authentication provider for account access
- approved storage for video, posters, and subtitles
- Cloudflare R2 or an equivalent authorized provider for large media files
- environment variables for secrets and API keys

## Legal and compliance checklist
- Do not publish unverified titles or copyright-protected streams
- Do not hardcode secrets or credentials in frontend files
- Do not claim ad or payment approvals without an authorized provider
- Replace sample URLs and subtitles with approved media before launch

## Testing checklist
- Open the homepage on desktop and mobile viewport widths
- Confirm the search and category filters work
- Open a details modal and play the sample video
- Verify the subtitle track loads in the player
- Check My List interactions and continue-watching state in localStorage

## Important
This is a front-end prototype and not a live, licensed streaming platform. It is ready for design review and pre-launch testing, but production deployment requires legal rights review and a secure backend.
