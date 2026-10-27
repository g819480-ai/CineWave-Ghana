const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const CHUNK_SIZE = 32 * 1024 * 1024;
const MAX_PARTS = 10000;
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...headers } });
const safeEq = (a, b) => { const x = new TextEncoder().encode(String(a)); const y = new TextEncoder().encode(String(b)); if (x.length !== y.length) return false; let n = 0; for (let i = 0; i < x.length; i++) n |= x[i] ^ y[i]; return n === 0; };
const b64u = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const uuidRe = "[a-f0-9-]{36}";
const keyRe = /^cinewave\/[a-f0-9-]{36}\/(video|poster|subtitle)\/[A-Za-z0-9._-]{1,120}$/i;

async function sign(value, secret) { const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return b64u(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))); }
async function makeCookie(env) { const payload = b64u(new TextEncoder().encode(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000, nonce: crypto.randomUUID() }))); return payload + "." + await sign(payload, env.SESSION_SECRET); }
async function authenticated(req, env) { const raw = (req.headers.get("cookie") || "").split(";").map(x => x.trim()).find(x => x.startsWith("cw_admin="))?.slice(9); if (!raw || !env.SESSION_SECRET) return false; const [payload, sig] = raw.split("."); if (!payload || !sig || !safeEq(sig, await sign(payload, env.SESSION_SECRET))) return false; try { const p = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)))); return Number(p.exp) > Date.now(); } catch { return false; } }
function originAllowed(req) { const origin = req.headers.get("origin"); if (!origin) return true; try { return new URL(origin).host === new URL(req.url).host; } catch { return false; } }
function validHttps(v) { if (!v) return true; try { return new URL(v).protocol === "https:"; } catch { return false; } }
async function readJson(req, maxBytes = 131072) { const length = Number(req.headers.get("content-length") || 0); if (length > maxBytes) throw Error("Request is too large."); const text = await req.text(); if (new TextEncoder().encode(text).byteLength > maxBytes) throw Error("Request is too large."); try { return JSON.parse(text); } catch { throw Error("Invalid JSON."); } }
function text(value, max, name) { if (value == null) return ""; if (typeof value !== "string" || value.length > max) throw Error(`${name} must be text no longer than ${max} characters.`); return value.trim(); }
function safeParseTracks(value) { try { const tracks = JSON.parse(value || "[]"); return Array.isArray(tracks) ? tracks : []; } catch { return []; } }
function cleanTrackId(value) { const id = String(value || ""); return /^[A-Za-z0-9_-]{1,64}$/.test(id) ? id : crypto.randomUUID(); }

function validMovie(m) {
  if (!m || typeof m !== "object") throw Error("Invalid movie data.");
  if (typeof m.title !== "string" || !m.title.trim() || m.title.length > 180) throw Error("A movie title is required (maximum 180 characters).");
  if (!/^[a-z0-9_-]{2,30}$/i.test(m.category || "")) throw Error("Invalid category.");
  text(m.category_label, 100, "Category label"); text(m.rating, 30, "Rating"); text(m.duration, 60, "Duration"); text(m.creator, 240, "Creator"); text(m.synopsis, 3000, "Description");
  if (m.year != null && (!Number.isInteger(Number(m.year)) || Number(m.year) < 1888 || Number(m.year) > 2100)) throw Error("Release year must be between 1888 and 2100.");
  if (!validHttps(m.poster_url) || !validHttps(m.stream_url)) throw Error("Poster and video URLs must use HTTPS.");
  if (!["not-configured", "r2", "mp4", "embed", "archive"].includes(m.stream_type)) throw Error("Invalid stream type.");
  if (m.video_key && !keyRe.test(m.video_key)) throw Error("Invalid uploaded video reference.");
  if (m.poster_key && !keyRe.test(m.poster_key)) throw Error("Invalid uploaded poster reference.");
  if (m.archive_id && !/^[A-Za-z0-9_.-]{1,180}$/.test(m.archive_id)) throw Error("Invalid Archive identifier.");
  if (!Array.isArray(m.subtitles || []) || (m.subtitles || []).length > 12) throw Error("Subtitles must be an array with at most 12 tracks.");
  for (const t of (m.subtitles || [])) {
    if (!t || typeof t !== "object") throw Error("Invalid subtitle track.");
    if (!/^[A-Za-z0-9-]{2,12}$/.test(t.lang || "")) throw Error("Each subtitle needs a valid language code.");
    text(t.label, 60, "Subtitle label"); t.id = cleanTrackId(t.id);
    if (!t.url && !t.key) throw Error("Each subtitle needs an uploaded file or HTTPS URL.");
    if (t.url && !validHttps(t.url)) throw Error("External subtitle URLs must use HTTPS.");
    if (t.key && !keyRe.test(t.key)) throw Error("Invalid uploaded subtitle reference.");
  }
  const configured = m.stream_type === "r2" ? !!m.video_key : m.stream_type === "archive" ? !!m.archive_id : !["not-configured"].includes(m.stream_type) && !!m.stream_url;
  if (m.published && (!m.rights_verified || m.stream_type === "not-configured" || !configured)) throw Error("A movie can only be published when rights are verified and a video source is configured.");
  return m;
}

const MOVIE_COLS = "id,title,category,category_label,year,rating,duration,creator,poster_url,poster_key,stream_type,stream_url,video_key,archive_id,synopsis,subtitles_json,featured,rights_verified,published,created_at,updated_at";
function movieFromRow(r, admin = false) {
  const tracks = safeParseTracks(r.subtitles_json);
  const base = { id: r.id, title: r.title, category: r.category, category_label: r.category_label, year: r.year, rating: r.rating, duration: r.duration, creator: r.creator, poster_url: r.poster_key ? `/api/posters/${r.id}` : r.poster_url, stream_type: r.stream_type, stream_url: r.stream_type === "r2" ? `/api/media/${r.id}` : r.stream_url, download_url: r.stream_type === "r2" ? `/api/media/${r.id}?download=1` : "", archive_id: r.archive_id, synopsis: r.synopsis, featured: !!r.featured, published: !!r.published, rights_verified: !!r.rights_verified };
  if (admin) return { ...base, poster_url: r.poster_url, stream_url: r.stream_url, video_key: r.video_key || "", poster_key: r.poster_key || "", subtitles: tracks };
  return { ...base, subtitles: tracks.map(t => ({ id: cleanTrackId(t.id), lang: t.lang, label: t.label || t.lang, url: t.key ? `/api/subtitles/${r.id}/${cleanTrackId(t.id)}` : t.url })) };
}
async function requireAdmin(req, env) { if (!await authenticated(req, env)) return json({ error: "Admin sign-in required." }, 401); return null; }
function requireBucket(env) { if (!env.MOVIES_BUCKET) throw Error("R2 is not configured. Bind cinewave-movies as MOVIES_BUCKET."); return env.MOVIES_BUCKET; }
function maxBytes(env, kind) { const fallback = kind === "video" ? 20 * 1024 ** 3 : kind === "poster" ? 10 * 1024 ** 2 : 5 * 1024 ** 2; const variable = kind === "video" ? env.MAX_VIDEO_BYTES : kind === "poster" ? env.MAX_POSTER_BYTES : env.MAX_SUBTITLE_BYTES; const value = Number(variable); return Number.isFinite(value) && value > 0 ? Math.min(value, fallback) : fallback; }
function safeFilename(name) { const cleaned = String(name || "").split(/[\\/]/).pop().normalize("NFKD").replace(/[^A-Za-z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^[-.]+/, ""); return cleaned.slice(-120) || "upload"; }
function uploadType(kind, filename, supplied) { const lower = filename.toLowerCase(); const ext = lower.split(".").pop(); const allowed = kind === "video" ? { mp4: "video/mp4", webm: "video/webm" } : kind === "poster" ? { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" } : { vtt: "text/vtt" }; if (!allowed[ext]) throw Error(kind === "video" ? "Video must be MP4 or WebM." : kind === "poster" ? "Poster must be JPEG, PNG, or WebP." : "Subtitles must be a .vtt WebVTT file."); const expected = allowed[ext]; if (supplied && supplied !== "application/octet-stream" && supplied !== "text/plain" && supplied !== expected) throw Error(`File type does not match its .${ext} extension.`); return expected; }
function signatureValid(kind, type, buffer) { const b = new Uint8Array(buffer); const ascii = (start, end) => String.fromCharCode(...b.slice(start, end)); if (kind === "subtitle") return new TextDecoder().decode(b).replace(/^\uFEFF/, "").startsWith("WEBVTT"); if (kind === "video") return type === "video/mp4" ? ascii(4, 8) === "ftyp" : b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3; if (type === "image/jpeg") return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff; if (type === "image/png") return ascii(0, 8) === "\x89PNG\r\n\x1a\n"; return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"; }
async function uploadSession(env, id) { return env.DB.prepare("SELECT * FROM upload_sessions WHERE id=?").bind(id).first(); }
async function verifyStoredMedia(env, m) { if (!m.video_key && !m.poster_key && !(m.subtitles || []).some(t => t.key)) return; const bucket = requireBucket(env); const checks = []; if (m.video_key) checks.push([m.video_key, "video/"]); if (m.poster_key) checks.push([m.poster_key, "image/"]); for (const t of m.subtitles || []) if (t.key) checks.push([t.key, "text/vtt"]); for (const [key, prefix] of checks) { const object = await bucket.head(key); if (!object) throw Error("An uploaded media file no longer exists. Upload it again."); const type = object.httpMetadata?.contentType || ""; if (!type.startsWith(prefix)) throw Error("An uploaded media file has an invalid stored content type."); } }
function collectKeys(row) { if (!row) return []; const keys = [row.video_key, row.poster_key].filter(Boolean); for (const track of safeParseTracks(row.subtitles_json)) if (track.key && keyRe.test(track.key)) keys.push(track.key); return [...new Set(keys)]; }
async function deleteKeys(env, keys) { if (!keys.length) return ""; try { await requireBucket(env).delete(keys); return ""; } catch { return "Database updated, but some old R2 files could not be removed. Check Worker logs and remove unused uploads from the R2 dashboard."; } }
function contentDisposition(filename, download) { const safe = safeFilename(filename || "cinewave-video"); return `${download ? "attachment" : "inline"}; filename="${safe.replace(/"/g, "")}"`; }
function parseRange(header, size) { if (!header) return null; const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim()); if (!match || (!match[1] && !match[2])) return { invalid: true }; let start, end; if (!match[1]) { const suffix = Number(match[2]); if (!suffix) return { invalid: true }; start = Math.max(0, size - suffix); end = size - 1; } else { start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1; } if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) return { invalid: true }; return { start, end, length: end - start + 1 }; }
async function serveMedia(req, env, row, download) { const bucket = requireBucket(env); const key = row.video_key; if (!key) return json({ error: "Video not found." }, 404); const head = await bucket.head(key); if (!head) return json({ error: "Video file not found." }, 404); const range = parseRange(req.headers.get("range"), head.size); if (range?.invalid) return new Response(null, { status: 416, headers: { "content-range": `bytes */${head.size}`, "accept-ranges": "bytes" } }); const headers = new Headers(); head.writeHttpMetadata(headers); headers.set("content-type", head.httpMetadata?.contentType || "video/mp4"); headers.set("accept-ranges", "bytes"); headers.set("etag", head.httpEtag); headers.set("x-content-type-options", "nosniff"); headers.set("cache-control", "private, max-age=0, must-revalidate"); headers.set("content-disposition", contentDisposition(head.key.split("/").pop(), download)); let body = null, status = 200; if (range) { headers.set("content-range", `bytes ${range.start}-${range.end}/${head.size}`); headers.set("content-length", String(range.length)); status = 206; if (req.method !== "HEAD") body = (await bucket.get(key, { range: { offset: range.start, length: range.length } }))?.body; } else { headers.set("content-length", String(head.size)); if (req.method !== "HEAD") body = (await bucket.get(key))?.body; } if (req.method !== "HEAD" && !body) return json({ error: "Video file not found." }, 404); return new Response(body, { status, headers }); }
async function serveAsset(req, env, key, fallbackType, download = false) { const bucket = requireBucket(env); const object = req.method === "HEAD" ? await bucket.head(key) : await bucket.get(key); if (!object) return json({ error: "File not found." }, 404); const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("content-type", object.httpMetadata?.contentType || fallbackType); headers.set("content-length", String(object.size)); headers.set("etag", object.httpEtag); headers.set("cache-control", "private, max-age=300"); headers.set("x-content-type-options", "nosniff"); if (download) headers.set("content-disposition", contentDisposition(key.split("/").pop(), true)); return new Response(req.method === "HEAD" ? null : object.body, { headers }); }
async function publicMediaRow(env, id) { return env.DB.prepare("SELECT id,video_key,poster_key,subtitles_json FROM movies WHERE id=? AND published=1 AND rights_verified=1").bind(id).first(); }

async function handle(req, env) {
  if (!env.DB) return json({ error: "Database is not configured. Create the D1 database and bind it as DB." }, 503);
  const url = new URL(req.url), p = url.pathname, method = req.method;
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS", "access-control-allow-headers": "content-type" } });
  if (p === "/api/movies" && method === "GET") { const rows = await env.DB.prepare(`SELECT ${MOVIE_COLS} FROM movies WHERE published=1 AND rights_verified=1 ORDER BY featured DESC, updated_at DESC`).all(); return json({ movies: (rows.results || []).map(r => movieFromRow(r)) }); }
  const media = p.match(new RegExp(`^/api/media/(${uuidRe})$`, "i"));
  if (media && ["GET", "HEAD"].includes(method)) { const row = await publicMediaRow(env, media[1]); return row ? serveMedia(req, env, row, url.searchParams.get("download") === "1") : json({ error: "Movie not found or not published." }, 404); }
  const poster = p.match(new RegExp(`^/api/posters/(${uuidRe})$`, "i"));
  if (poster && ["GET", "HEAD"].includes(method)) { const row = await publicMediaRow(env, poster[1]); return row?.poster_key ? serveAsset(req, env, row.poster_key, "image/jpeg") : json({ error: "Poster not found." }, 404); }
  const subtitle = p.match(new RegExp(`^/api/subtitles/(${uuidRe})/([A-Za-z0-9_-]{1,64})$`, "i"));
  if (subtitle && ["GET", "HEAD"].includes(method)) { const row = await publicMediaRow(env, subtitle[1]); const track = safeParseTracks(row?.subtitles_json).find(t => cleanTrackId(t.id) === subtitle[2] && t.key); return track ? serveAsset(req, env, track.key, "text/vtt; charset=utf-8") : json({ error: "Subtitle not found." }, 404); }
  if (p === "/api/ads" && method === "GET") { const a = await env.DB.prepare("SELECT publisher_id,home_slot,player_slot,enabled FROM ad_settings WHERE id=1").first(); return json({ enabled: !!a?.enabled, publisher_id: a?.publisher_id || "", home_slot: a?.home_slot || "", player_slot: a?.player_slot || "" }); }
  if (p === "/api/admin/login" && method === "POST") { if (!originAllowed(req)) return json({ error: "Origin not allowed." }, 403); if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ error: "Set ADMIN_PASSWORD and SESSION_SECRET Worker secrets first." }, 503); let body; try { body = await readJson(req, 4096); } catch (e) { return json({ error: e.message }, 400); } if (!safeEq(body.password || "", env.ADMIN_PASSWORD)) return json({ error: "Incorrect password." }, 401); const cookie = await makeCookie(env); return json({ ok: true }, 200, { "set-cookie": `cw_admin=${cookie}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800` }); }
  if (p === "/api/admin/logout" && method === "POST") { if (!originAllowed(req)) return json({ error: "Origin not allowed." }, 403); return json({ ok: true }, 200, { "set-cookie": "cw_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0" }); }
  if (p === "/api/admin/session" && method === "GET") { return json({ ok: true, authenticated: await authenticated(req, env) }); }
  if (p.startsWith("/api/admin/")) {
    if (!originAllowed(req)) return json({ error: "Origin not allowed." }, 403);
    const err = await requireAdmin(req, env); if (err) return err;
    if (p === "/api/admin/movies" && method === "GET") { const rows = await env.DB.prepare(`SELECT ${MOVIE_COLS} FROM movies ORDER BY updated_at DESC`).all(); return json({ movies: (rows.results || []).map(r => movieFromRow(r, true)) }); }
    if (p === "/api/admin/movies" && method === "POST") { let m; try { m = validMovie(await readJson(req)); await verifyStoredMedia(env, m); } catch (e) { return json({ error: e.message || "Invalid movie data." }, 400); } const id = crypto.randomUUID(), now = new Date().toISOString(); await env.DB.prepare(`INSERT INTO movies (${MOVIE_COLS}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id, m.title.trim(), m.category, m.category_label || m.category, m.year || null, m.rating || "NR", m.duration || "", m.creator || "", m.poster_url || "", m.poster_key || "", m.stream_type, m.stream_url || "", m.video_key || "", m.archive_id || "", m.synopsis || "", JSON.stringify(m.subtitles || []), m.featured ? 1 : 0, m.rights_verified ? 1 : 0, m.published ? 1 : 0, now, now).run(); return json({ ok: true, id }, 201); }
    const mm = p.match(new RegExp(`^/api/admin/movies/(${uuidRe})$`, "i"));
    if (mm && method === "PUT") { let m; try { m = validMovie(await readJson(req)); await verifyStoredMedia(env, m); } catch (e) { return json({ error: e.message || "Invalid movie data." }, 400); } const old = await env.DB.prepare(`SELECT ${MOVIE_COLS} FROM movies WHERE id=?`).bind(mm[1]).first(); if (!old) return json({ error: "Movie not found." }, 404); const now = new Date().toISOString(); await env.DB.prepare("UPDATE movies SET title=?,category=?,category_label=?,year=?,rating=?,duration=?,creator=?,poster_url=?,poster_key=?,stream_type=?,stream_url=?,video_key=?,archive_id=?,synopsis=?,subtitles_json=?,featured=?,rights_verified=?,published=?,updated_at=? WHERE id=?").bind(m.title.trim(), m.category, m.category_label || m.category, m.year || null, m.rating || "NR", m.duration || "", m.creator || "", m.poster_url || "", m.poster_key || "", m.stream_type, m.stream_url || "", m.video_key || "", m.archive_id || "", m.synopsis || "", JSON.stringify(m.subtitles || []), m.featured ? 1 : 0, m.rights_verified ? 1 : 0, m.published ? 1 : 0, now, mm[1]).run(); const nextKeys = [m.video_key, m.poster_key, ...(m.subtitles || []).map(t => t.key)].filter(Boolean); const warning = await deleteKeys(env, collectKeys(old).filter(k => !nextKeys.includes(k))); return json({ ok: true, warning }); }
    if (mm && method === "DELETE") { const old = await env.DB.prepare(`SELECT ${MOVIE_COLS} FROM movies WHERE id=?`).bind(mm[1]).first(); if (!old) return json({ error: "Movie not found." }, 404); await env.DB.prepare("DELETE FROM movies WHERE id=?").bind(mm[1]).run(); const warning = await deleteKeys(env, collectKeys(old)); return json({ ok: true, warning }); }
    if (p === "/api/admin/uploads/start" && method === "POST") {
      let body; try { body = await readJson(req, 8192); } catch (e) { return json({ error: e.message }, 400); }
      try {
        const bucket = requireBucket(env), kind = body.kind, size = Number(body.size);
        if (!["video", "poster", "subtitle"].includes(kind)) throw Error("Invalid upload kind.");
        if (!Number.isSafeInteger(size) || size < 1 || size > maxBytes(env, kind)) throw Error(`File is empty or exceeds the ${Math.floor(maxBytes(env, kind) / 1024 ** 2)} MiB limit.`);
        const filename = safeFilename(body.filename), contentType = uploadType(kind, filename, String(body.type || "").toLowerCase()), partCount = Math.ceil(size / CHUNK_SIZE);
        if (partCount > MAX_PARTS) throw Error("File needs too many upload parts.");
        const active = await env.DB.prepare("SELECT COUNT(*) AS count FROM upload_sessions WHERE status='uploading' AND created_at>?").bind(new Date(Date.now() - 86400000).toISOString()).first();
        if (Number(active?.count || 0) >= 20) throw Error("Too many unfinished uploads. Cancel an upload or try again tomorrow.");
        const id = crypto.randomUUID(), key = `cinewave/${id}/${kind}/${filename}`;
        const upload = await bucket.createMultipartUpload(key, { httpMetadata: { contentType, cacheControl: "private, max-age=0, must-revalidate" } });
        const now = new Date().toISOString();
        try { await env.DB.prepare("INSERT INTO upload_sessions (id,r2_upload_id,kind,object_key,filename,content_type,expected_size,chunk_size,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)").bind(id, upload.uploadId, kind, key, filename, contentType, size, CHUNK_SIZE, "uploading", now).run(); } catch (e) { await upload.abort(); throw e; }
        return json({ ok: true, id, key, chunk_size: CHUNK_SIZE, part_count: partCount, max_size: maxBytes(env, kind) }, 201);
      } catch (e) { return json({ error: e.message || "Upload could not be started." }, 400); }
    }
    const part = p.match(new RegExp(`^/api/admin/uploads/(${uuidRe})/(\\d{1,5})$`, "i"));
    if (part && method === "PUT") {
      const session = await uploadSession(env, part[1]);
      if (!session || session.status !== "uploading") return json({ error: "Upload session not found or already finished." }, 404);
      const partNumber = Number(part[2]), expectedParts = Math.ceil(session.expected_size / session.chunk_size);
      if (partNumber < 1 || partNumber > expectedParts) return json({ error: "Invalid upload part number." }, 400);
      const declared = Number(req.headers.get("content-length") || 0);
      if (declared > session.chunk_size) return json({ error: "Upload part is too large." }, 413);
      const buffer = await req.arrayBuffer();
      if (!buffer.byteLength || buffer.byteLength > session.chunk_size) return json({ error: "Upload part is empty or too large." }, 400);
      if (declared && declared !== buffer.byteLength) return json({ error: "Upload part size mismatch." }, 400);
      if (partNumber === 1 && !signatureValid(session.kind, session.content_type, buffer)) return json({ error: "File contents do not match the allowed file type." }, 400);
      try { const upload = requireBucket(env).resumeMultipartUpload(session.object_key, session.r2_upload_id); const uploaded = await upload.uploadPart(partNumber, buffer); return json({ ok: true, partNumber: uploaded.partNumber, etag: uploaded.etag }); } catch { return json({ error: "Upload part failed. Retry this part." }, 400); }
    }
    const upload = p.match(new RegExp(`^/api/admin/uploads/(${uuidRe})$`, "i"));
    if (upload && method === "POST") {
      const session = await uploadSession(env, upload[1]); if (!session || session.status !== "uploading") return json({ error: "Upload session not found or already finished." }, 404);
      let body; try { body = await readJson(req, 1048576); } catch (e) { return json({ error: e.message }, 400); }
      const parts = body.parts, expectedParts = Math.ceil(session.expected_size / session.chunk_size);
      if (!Array.isArray(parts) || parts.length !== expectedParts) return json({ error: `Expected ${expectedParts} upload parts.` }, 400);
      const ordered = [...parts].sort((a, b) => a.partNumber - b.partNumber);
      for (let i = 0; i < ordered.length; i++) if (ordered[i].partNumber !== i + 1 || typeof ordered[i].etag !== "string" || !ordered[i].etag || ordered[i].etag.length > 256) return json({ error: "Upload part list is invalid or incomplete." }, 400);
      try {
        const bucket = requireBucket(env), multipart = bucket.resumeMultipartUpload(session.object_key, session.r2_upload_id), object = await multipart.complete(ordered);
        if (object.size !== session.expected_size) { await bucket.delete(session.object_key); throw Error("Completed file size does not match the original file."); }
        await env.DB.prepare("UPDATE upload_sessions SET status='completed' WHERE id=?").bind(session.id).run();
        return json({ ok: true, key: session.object_key, filename: session.filename, size: object.size, content_type: session.content_type });
      } catch (e) { return json({ error: e.message || "Upload could not be completed." }, 400); }
    }
    if (upload && method === "DELETE") {
      const session = await uploadSession(env, upload[1]); if (!session) return json({ error: "Upload session not found." }, 404);
      try {
        const bucket = requireBucket(env);
        if (session.status === "uploading") await bucket.resumeMultipartUpload(session.object_key, session.r2_upload_id).abort();
        else if (session.status === "completed") { const used = await env.DB.prepare("SELECT id FROM movies WHERE video_key=? OR poster_key=? OR instr(subtitles_json, ?) > 0 LIMIT 1").bind(session.object_key, session.object_key, session.object_key).first(); if (used) return json({ error: "This file belongs to a saved movie. Edit or delete that movie instead." }, 409); await bucket.delete(session.object_key); }
        await env.DB.prepare("UPDATE upload_sessions SET status='cancelled' WHERE id=?").bind(session.id).run(); return json({ ok: true });
      } catch (e) { console.error("Upload cleanup failed", e); return json({ error: "Upload cleanup failed. Check Worker logs." }, 500); }
    }
    if (p === "/api/admin/ads" && method === "GET") { const a = await env.DB.prepare("SELECT publisher_id,home_slot,player_slot,enabled FROM ad_settings WHERE id=1").first(); return json({ publisher_id: a?.publisher_id || "", home_slot: a?.home_slot || "", player_slot: a?.player_slot || "", enabled: !!a?.enabled }); }
    if (p === "/api/admin/ads" && method === "PUT") { let a; try { a = await readJson(req, 8192); } catch (e) { return json({ error: e.message }, 400); } if (a.publisher_id && !/^ca-pub-\d+$/.test(a.publisher_id)) return json({ error: "Publisher ID must look like ca-pub- followed by digits." }, 400); for (const k of ["home_slot", "player_slot"]) if (a[k] && !/^\d+$/.test(String(a[k]))) return json({ error: "Ad slot IDs must contain digits only." }, 400); const enabled = !!a.enabled; if (enabled && (!a.publisher_id || !a.home_slot || !a.player_slot)) return json({ error: "Enter a publisher ID and both slot IDs before enabling ads." }, 400); await env.DB.prepare("INSERT INTO ad_settings (id,publisher_id,home_slot,player_slot,enabled,updated_at) VALUES (1,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET publisher_id=excluded.publisher_id,home_slot=excluded.home_slot,player_slot=excluded.player_slot,enabled=excluded.enabled,updated_at=excluded.updated_at").bind(a.publisher_id || "", String(a.home_slot || ""), String(a.player_slot || ""), enabled ? 1 : 0, new Date().toISOString()).run(); return json({ ok: true }); }
  }
  return json({ error: "Not found." }, 404);
}

export default { async fetch(req, env) { try { const url = new URL(req.url); const response = url.pathname.startsWith("/api/") ? await handle(req, env) : env.ASSETS ? await env.ASSETS.fetch(req) : new Response("CineWave assets binding missing", { status: 503 }); const headers = new Headers(response.headers); headers.set("x-content-type-options", "nosniff"); headers.set("referrer-policy", "strict-origin-when-cross-origin"); headers.set("x-frame-options", "SAMEORIGIN"); headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()"); return new Response(response.body, { status: response.status, statusText: response.statusText, headers }); } catch (e) { console.error("CineWave request failed", e); return json({ error: "Server error. Check Worker logs for details." }, 500); } } };
