# NOCTURA homepage loading repair

This is a focused frontend patch for the current repository layout.

## What was wrong

- `public/index.html` loaded `public/site.js` as a JavaScript file.
- The repository's `public/site.js` currently contains CSS, not JavaScript.
- The homepage therefore cannot run the code that fills the featured title and renders the catalogue.

## Apply these files

Replace these two files in the GitHub repository:

1. `public/index.html`
2. `public/site.js`

Keep the existing:
- `public/css/main.css`
- `public/licensed_catalog.js`
- `worker.js`
- `wrangler.toml`
- D1 database and R2 bucket configuration

Commit the changes, then let Cloudflare Pages/Workers deploy the updated project.

## Important playback note

This patch makes the existing local catalogue render and stops the permanent loading state. It does not create movie streams. Existing catalogue entries need a real, authorized video source before their Play buttons can work. The UI deliberately labels titles without a stream source as playback unavailable instead of pretending they can play.
