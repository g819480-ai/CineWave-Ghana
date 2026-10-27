/* Browser verification against the local Wrangler runtime. */
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/home/kimi/.npm-global/lib/node_modules/playwright'); }
const { chromium } = playwright;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const base = (process.env.BASE_URL || 'http://127.0.0.1:8787').replace(/\/$/, '');
const adminPassword = process.env.ADMIN_PASSWORD || 'local-test-password';
const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cinewave-browser-'));
const posterFixture = path.join(fixtureDir, 'poster.png');
const videoFixture = path.join(fixtureDir, 'movie.mp4');
const subtitleFixture = path.join(fixtureDir, 'english.vtt');
fs.writeFileSync(posterFixture, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZrXcAAAAASUVORK5CYII=', 'base64'));
fs.writeFileSync(subtitleFixture, 'WEBVTT\n\n00:00.000 --> 00:04.000\nCineWave browser upload test\n');
execFileSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=320x180:rate=24', '-t', '4', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', videoFixture]);
const screenshotDir = process.env.SCREENSHOT_DIR || os.tmpdir();
const screenshot = name => path.join(screenshotDir, `cinewave-${name}.png`);
const executablePath = process.env.CHROMIUM_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
(async () => {
  const catalog = await (await fetch(base + '/api/movies')).json();
  const progressMovie = process.env.PROGRESS_MOVIE_ID || catalog.movies.find(movie => movie.title === 'CineWave API Test Updated' && movie.stream_type === 'r2')?.id;
  assert(progressMovie, 'Run python3 tests/api-smoke.py --keep first, or set PROGRESS_MOVIE_ID.');
  const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  const consoleErrors = [], pageErrors = [], notFound = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => { if (response.status() === 404 && response.url().startsWith(base)) notFound.push(response.url()); });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(`[data-play="${progressMovie}"]`);
  assert.equal(await page.title(), 'CineWave Ghana | Movies & Series');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Desktop has horizontal overflow');
  await page.screenshot({ path: screenshot('desktop'), fullPage: true });
  console.log('PASS desktop catalog and no horizontal overflow');

  await page.locator(`[data-list="${progressMovie}"]`).first().click();
  const list = await page.evaluate(() => JSON.parse(localStorage.getItem('cinewave:my-list:v1') || '[]'));
  assert(list.includes(progressMovie), 'My List was not stored locally');
  console.log('PASS My List persists in browser storage');

  await page.locator('#search').fill('CineWave API Test Updated');
  assert(await page.locator('#allGrid .movie-card').count() >= 1, 'Search returned no results');
  await page.locator('#clearSearch').click();
  console.log('PASS live search and clear');

  await page.locator(`[data-info="${progressMovie}"]`).first().click();
  await page.waitForSelector('#detailsDialog[open]');
  assert.equal(await page.locator('#dialogTitle').textContent(), 'CineWave API Test Updated');
  await page.locator('#detailsPlay').click();
  await page.waitForSelector('#playerDialog[open] video');
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v && v.readyState >= 1 && Number.isFinite(v.duration); });
  assert.equal(await page.locator('#subtitleLanguage option[value="en"]').count(), 1);
  await page.locator('#subtitleLanguage').selectOption('en');
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v && [...v.textTracks].some(t => t.language === 'en' && t.mode === 'showing'); });
  console.log('PASS movie details, native playback and English subtitle selection');

  await page.evaluate(() => { const v = document.querySelector('video'); v.playbackRate = 16; return v.play(); });
  await page.waitForFunction(() => document.querySelector('video')?.currentTime > 21, { timeout: 15000 });
  await page.evaluate(() => document.querySelector('video').pause());
  await page.screenshot({ path: screenshot('player') });
  await page.locator('#playerClose').click();
  await page.waitForSelector('#continue-section:not([hidden])');
  assert(await page.locator(`#continueRail [data-play="${progressMovie}"]`).count() === 1);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#continue-section:not([hidden])');
  console.log('PASS Continue Watching saved after playback and retained after reload');

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Mobile has horizontal overflow');
  assert(await page.locator('.mobile-nav').isVisible(), 'Mobile navigation is hidden');
  await page.screenshot({ path: screenshot('mobile'), fullPage: true });
  await page.locator('#mobileSearch').click();
  await page.locator('#search').fill('CineWave');
  assert(await page.locator('#allGrid .movie-card').count() >= 1);
  console.log('PASS 375px mobile layout, navigation and search');
  for (const width of [768, 1024]) { await page.setViewportSize({ width, height: 900 }); await page.goto(base, { waitUntil: 'domcontentloaded' }); assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px overflow`); }
  console.log('PASS 768px and 1024px responsive overflow checks');

  const admin = await context.newPage();
  admin.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  admin.on('pageerror', error => pageErrors.push(error.message));
  admin.on('response', response => { if (response.status() === 404 && response.url().startsWith(base)) notFound.push(response.url()); });
  await admin.setViewportSize({ width: 1440, height: 1000 });
  await admin.goto(base + '/admin.html', { waitUntil: 'domcontentloaded' });
  await admin.locator('#password').fill(adminPassword);
  await admin.locator('#loginButton').click();
  await admin.waitForSelector('#dashboard:not(.hidden)');
  assert(await admin.locator('#streamUrlField').isHidden(), 'External source field should be hidden when no source is configured');
  await admin.locator('#title').fill('Admin UI Upload Test');
  await admin.locator('#category').selectOption('ghana');
  await admin.locator('#categoryLabel').fill('Ghanaian Test Films');
  await admin.locator('#year').fill('2026');
  await admin.locator('#synopsis').fill('Created through the real admin upload form during local verification.');
  await admin.locator('#posterFile').setInputFiles(posterFixture);
  await admin.locator('#streamType').selectOption('r2');
  await admin.locator('#videoFile').setInputFiles(videoFixture);
  await admin.locator('#addSubtitle').click();
  await admin.locator('.subtitle-file').setInputFiles(subtitleFixture);
  await admin.locator('#rights').check();
  await admin.locator('#published').check();
  await admin.locator('#saveButton').click();
  await admin.waitForFunction(() => document.querySelector('#movieList')?.textContent.includes('Admin UI Upload Test'), { timeout: 90000 });
  await admin.waitForSelector('#uploadProgress', { state: 'hidden' });
  assert(await admin.locator('#movieList').textContent().then(text => text.includes('Admin UI Upload Test')));
  await admin.screenshot({ path: screenshot('admin'), fullPage: true });
  console.log('PASS admin login and complete poster/video/subtitle upload form');

  await admin.setViewportSize({ width: 375, height: 812 });
  await admin.goto(base + '/admin.html', { waitUntil: 'domcontentloaded' });
  assert(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Admin mobile overflow');
  await admin.screenshot({ path: screenshot('admin-mobile'), fullPage: true });
  console.log('PASS admin mobile layout');

  assert.deepEqual(pageErrors, [], 'Browser page errors: ' + pageErrors.join('\n'));
  assert.deepEqual(consoleErrors, [], 'Browser console errors: ' + consoleErrors.join('\n'));
  assert.deepEqual(notFound, [], 'Same-origin 404s: ' + notFound.join('\n'));
  console.log('PASS zero browser page errors, console errors and same-origin 404s');
  await browser.close();
  fs.rmSync(fixtureDir, { recursive: true, force: true });
})().catch(error => { console.error(error); process.exit(1); });
