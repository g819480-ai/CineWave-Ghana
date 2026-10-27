-- Run once against the existing cinewave-ghana-db before deploying this upgrade.
-- This is additive: it does not drop tables or remove existing movies.
ALTER TABLE movies ADD COLUMN poster_key TEXT NOT NULL DEFAULT '';
ALTER TABLE movies ADD COLUMN video_key TEXT NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS upload_sessions (
 id TEXT PRIMARY KEY,
 r2_upload_id TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('video','poster','subtitle')),
 object_key TEXT NOT NULL UNIQUE,
 filename TEXT NOT NULL,
 content_type TEXT NOT NULL,
 expected_size INTEGER NOT NULL,
 chunk_size INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'uploading' CHECK(status IN ('uploading','completed','cancelled')),
 created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_status ON upload_sessions(status, created_at);
