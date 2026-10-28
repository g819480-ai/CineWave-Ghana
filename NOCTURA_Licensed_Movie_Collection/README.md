# NOCTURA Licensed Movie Collection

This package is a legal-review starter for a NOCTURA movie catalogue. It is designed to be added to an existing NOCTURA website without replacing the live site.

## Included files

- `movies.js` — movie metadata and commercial status
- `download_videos.py` — downloads verified public-domain video files into `videos/`
- `RIGHTS_AND_SETUP.md` — rights and compliance notes
- `create_zip.py` — assembles the distributable ZIP package

## How to use it in your existing website

1. Copy the `NOCTURA_Licensed_Movie_Collection` folder to a staging folder or local project.
2. Import the catalogue into your site before your app script:
   ```html
   <script src="/assets/movies.js"></script>
   ```
3. Only render titles where `enabled === true`:
   ```javascript
   const publicCatalog = NOCTURA_MOVIE_CATALOG.filter(item => item.enabled);
   ```
4. Keep all `PENDING RIGHTS CHECK` entries excluded from the player and public UI.
5. Use the `download_videos.py` script for local validation only.

## Important

This package is for review and site integration testing only. Do not publish or replace the live NOCTURA site without explicit approval.
