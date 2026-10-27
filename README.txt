CINEWAVE GHANA — R2 STREAMING UPGRADE
=====================================

STATUS
------
The upgrade is complete on the upgrade/r2-streaming branch. Local API, security,
upload, streaming, download, subtitle, browser and responsive tests passed.
It has NOT been deployed to your live Cloudflare account. Live uploads and
downloads must be tested after you deploy. Nothing was pushed to GitHub for you.

WHAT IS INCLUDED
----------------
- Dark, responsive CineWave Ghana catalogue with hero, poster rows and search.
- Free visitor playback: no registration, login or profile selection.
- Movie details, native MP4/WebM player, direct downloads and WebVTT subtitles.
- Existing external MP4, embed and Archive source types remain available.
- Browser-only My List and Continue Watching. These do not sync between devices
  and are erased if browser data is cleared.
- Existing signed-cookie admin authentication and D1 catalogue/ad functionality.
- Admin add, edit, draft, publish/unpublish and permanent delete workflows.
- Admin-only multipart uploads to the existing private R2 bucket.
- 32 MiB upload parts, three attempts per part, file limits and type/signature
  checks. Video: MP4/WebM up to 20 GiB. Posters: JPEG/PNG/WebP up to 10 MiB.
  Subtitles: valid WebVTT up to 5 MiB. At most 12 subtitle tracks per movie.
- Byte-range streaming, HEAD requests and attachment downloads.
- Public media routes only serve movies that are both published and rights
  verified. Private R2 object keys are hidden from visitor API responses.
- Old uploaded files are removed when replaced or when their movie is deleted.
  External URLs are never deleted.

ARCHITECTURE
------------
Browser -> Cloudflare Worker -> D1 (catalogue and upload metadata)
                            -> private R2 (movies, posters and subtitles)

The R2 bucket stays private. Do not enable a public bucket URL and do not put
R2 credentials in JavaScript or GitHub. The existing MOVIES_BUCKET binding is
used. No R2 CORS setup or visitor account is required because media goes through
same-origin Worker routes.

IMPORTANT: CONFIRM THE WORKER NAME
----------------------------------
The supplied wrangler.toml says name = "cinewave-ghana", but the current URL
you provided begins with "cinewave-gh1". Before deploying, open the existing
Worker in the Cloudflare dashboard and compare its exact name with wrangler.toml.
If the dashboard Worker is named cinewave-gh1, change the name in wrangler.toml
to cinewave-gh1. Otherwise the deploy could target a different Worker.

DEPLOY USING AN IPHONE (NO TERMINAL)
------------------------------------
1. Back up first.
   Keep the original CineWave-Ghana-main.zip somewhere safe. In Cloudflare, open
   D1, select cinewave-ghana-db, and use its export/backup option if available.
   Do not skip the database backup if the catalogue matters to you.

2. Put the upgraded files in GitHub.
   Open your CineWave-Ghana repository in Safari. If you cannot see Add file,
   use the browser menu to request the desktop website. Choose Add file >
   Upload files and upload the CONTENTS of the extracted upgrade folder at the
   repository root. Do not create a second nested CineWave-Ghana folder.
   Replace worker.js, schema.sql, wrangler.toml, package files and README.txt;
   add public/, migrations/ and tests/. Remove the old root index.html and
   admin.html only after confirming the new versions exist inside public/.
   Never upload .dev.vars, .env, node_modules, .wrangler or real passwords.

3. Apply the D1 migration ONCE, before deploying the Worker.
   In Cloudflare, open D1 > cinewave-ghana-db > Console. Open the supplied
   migrations/0002_add_r2_media.sql file, copy all of its SQL, paste it into the
   Console and run it once. It only adds poster_key, video_key and upload
   session metadata; it does not drop tables or delete movies.
   If you see "duplicate column name", stop rather than repeatedly running it;
   check whether the migration was already applied.

4. Preserve the existing admin secrets.
   Open Workers & Pages > your Worker > Settings > Variables and Secrets.
   Confirm ADMIN_PASSWORD and SESSION_SECRET still exist as secrets. Keep their
   existing values; changing SESSION_SECRET signs out current admin sessions.
   Never move these values into wrangler.toml, public files or GitHub.

5. Confirm the bindings.
   The D1 binding must be DB for cinewave-ghana-db. The R2 binding must be
   MOVIES_BUCKET for the private cinewave-movies bucket. These are already in
   wrangler.toml; compare them with the existing Worker before deploying.

6. Connect GitHub to the existing Worker.
   In Workers & Pages, select the existing Worker, then Settings > Builds >
   Connect. Select the GitHub repository and your intended production branch.
   Use:
     Build command:  npm run check
     Deploy command: npx wrangler deploy
     Root directory: leave blank when wrangler.toml is at the repository root
   Save the connection. A new commit to the production branch starts the build.
   Watch Deployments / build history and read the log if it fails.

TERMINAL ALTERNATIVE (COMPUTER)
-------------------------------
Run these from the extracted project directory after confirming the Worker name:

  npm install
  npx wrangler login
  npx wrangler d1 export cinewave-ghana-db --remote --output=cinewave-backup.sql
  npx wrangler d1 execute cinewave-ghana-db --remote --file=migrations/0002_add_r2_media.sql
  npm run check
  npx wrangler deploy --dry-run
  npx wrangler deploy

Run the migration command exactly once. Do not run schema.sql against the remote
existing database; schema.sql is for initializing a fresh LOCAL database.

PRODUCTION TEST CHECKLIST
-------------------------
Use only a small movie file you own or are authorized to distribute.

1. Open the visitor site in a private browser window. Confirm there is no visitor
   login/profile gate and that existing published movies still appear.
2. Open /admin.html and sign in. Add a draft with poster, MP4/WebM and one .vtt
   subtitle. Keep the admin page open until all uploads and the save finish.
3. Confirm the draft is not visible in the visitor catalogue and its media URL
   returns 404. Then publish it with rights verification enabled.
4. Open the movie on the visitor site. Play it, seek forward/backward, select the
   subtitle language and use Download. Confirm the downloaded file plays.
5. Reload and confirm My List and Continue Watching remain in that same browser.
6. Edit the title, unpublish it and confirm visitor playback stops. Publish it
   again, then delete the test movie and confirm its uploaded R2 objects vanish.
7. Repeat the visitor and admin checks on your iPhone and a desktop if possible.

Only after these live checks pass should you consider production uploads,
streaming and downloads verified.

USING THE ADMIN STUDIO
----------------------
- Drafts may be saved before publishing. Publishing requires verified rights and
  a configured video source.
- An uploaded poster takes priority over an external poster URL.
- For private R2 playback, choose "Upload to private R2 · stream & download".
- Add only subtitle languages actually supplied for that movie. A genuine .vtt
  file begins with WEBVTT. Third-party embed players control their own subtitles.
- Removing a movie is permanent and removes its uploaded R2 media. External
  video/poster/subtitle URLs are not affected.
- If an upload is interrupted, cancel the editor upload where possible. Check
  the R2 dashboard for abandoned multipart uploads and remove them manually.
- Keep movies in Standard R2 storage unless you understand Infrequent Access
  retrieval charges.

LOCAL DEVELOPMENT AND TESTS
---------------------------
Requirements: Node.js, npm, Python 3 with requests/Pillow, FFmpeg, and Chromium.

  npm install
  npx wrangler d1 execute cinewave-ghana-db --local --file=schema.sql

Create a LOCAL-ONLY .dev.vars file (already excluded by .gitignore):

  ADMIN_PASSWORD=local-test-password
  SESSION_SECRET=replace-with-a-long-random-local-value

Start Wrangler in one terminal:

  npm run dev

Then use another terminal:

  npm run check
  npm run test:api

For the browser suite, keep the API test movie and run:

  python3 tests/api-smoke.py --keep
  npx playwright install chromium
  npm run test:browser

The browser test finds the kept "CineWave API Test Updated" movie automatically.
Optional environment variables: BASE_URL, ADMIN_PASSWORD, PROGRESS_MOVIE_ID,
CHROMIUM_PATH and SCREENSHOT_DIR. Tests are for the local runtime by default;
do not point them at production unless you intentionally want to create/delete
test data there.

CLOUDFLARE COSTS (CHECK CURRENT PRICING)
----------------------------------------
Visitors do not pay CineWave, but Cloudflare usage can cost the site owner.
As documented by Cloudflare when this guide was written:

- R2 Standard storage: $0.015/GB-month after the 10 GB-month monthly free tier.
- R2 Class A operations: $4.50/million after 1 million free per month.
- R2 Class B operations: $0.36/million after 10 million free per month.
- R2 internet egress is free. Multipart uploads generate multiple Class A
  operations, and streaming/range reads generate Class B operations.
- R2 Infrequent Access additionally charges $0.01/GB retrieved and has a 30-day
  minimum storage duration. Standard storage is the safer default for streaming.
- Workers and D1 limits/charges are separate. Workers Free includes 100,000
  requests per day; static asset requests are free and unlimited. Workers Paid
  starts at $5/month and has its own included usage. Check D1 pricing separately.
- Cloudflare Free/Pro accounts have a 100 MB maximum incoming request body.
  This project uses 32 MiB parts so a whole movie is never sent in one request.

Official pages:
  https://developers.cloudflare.com/r2/pricing/
  https://developers.cloudflare.com/workers/platform/pricing/
  https://developers.cloudflare.com/workers/platform/limits/

TROUBLESHOOTING
---------------
- "R2 is not configured": check MOVIES_BUCKET and the exact bucket name.
- "Database is not configured": check the DB binding and database ID.
- Upload immediately fails after deployment: confirm the D1 migration ran once.
- 401 on admin actions: sign in again; sessions last eight hours.
- 403 on an admin mutation: use the same site origin, not a different preview or
  custom-domain address for the admin page and API.
- 413 during upload: confirm the code is using 32 MiB parts, not a single PUT.
- Video does not seek: test the supplied production MP4 through the range checks
  above and confirm the live Worker deployment is the upgraded version.
- Subtitles do not appear: use genuine WebVTT and a browser that supports text
  tracks. Embedded third-party players manage subtitles independently.

RIGHTS AND SECURITY
-------------------
Only upload movies and artwork you own or are authorized to distribute. The
rights checkbox is an operational safeguard, not a substitute for permission.
Keep the R2 bucket private, rotate secrets if they are ever exposed, and never
commit .dev.vars, .env, exported databases or Cloudflare API tokens.
