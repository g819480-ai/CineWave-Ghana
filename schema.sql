PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS movies (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, category_label TEXT, year INTEGER, rating TEXT DEFAULT 'NR', duration TEXT DEFAULT '', creator TEXT DEFAULT '', poster_url TEXT DEFAULT '', stream_type TEXT NOT NULL DEFAULT 'not-configured', stream_url TEXT DEFAULT '', archive_id TEXT DEFAULT '', synopsis TEXT DEFAULT '', subtitles_json TEXT NOT NULL DEFAULT '[]', featured INTEGER NOT NULL DEFAULT 0, rights_verified INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_movies_public ON movies(published, rights_verified, featured, updated_at);
CREATE TABLE IF NOT EXISTS ad_settings (id INTEGER PRIMARY KEY CHECK(id=1), publisher_id TEXT DEFAULT '', home_slot TEXT DEFAULT '', player_slot TEXT DEFAULT '', enabled INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT '');
INSERT OR IGNORE INTO ad_settings (id,publisher_id,home_slot,player_slot,enabled,updated_at) VALUES (1,'','','',0,'');
