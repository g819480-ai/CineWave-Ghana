:root {
  --bg: #090b10;
  --bg-soft: #10161d;
  --panel: rgba(17, 20, 25, 0.96);
  --panel-strong: #141a20;
  --panel-alt: #1a2129;
  --line: rgba(255,255,255,0.08);
  --line-strong: rgba(255,255,255,0.18);
  --text: #f4f7fb;
  --muted: rgba(244,247,251,0.72);
  --accent: #ff5d5d;
  --accent-soft: rgba(255, 93, 93, 0.12);
  --success: #22c55e;
  --warning: #f59e0b;
  --shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
}

* { box-sizing: border-box; }
html { font-family: 'Urbanist', Arial, sans-serif; background: var(--bg); color: var(--text); }
body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 93, 93, 0.12), transparent 30%),
    linear-gradient(180deg, #090b10 0%, #111820 100%);
  color: var(--text);
  min-height: 100vh;
}
button, input, textarea, select { font: inherit; }
button { cursor: pointer; }
input, textarea, select {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  color: var(--text);
  padding: 0.82rem 0.9rem;
  outline: none;
}
input:focus, textarea:focus, select:focus {
  border-color: rgba(255, 93, 93, 0.7);
  box-shadow: 0 0 0 3px rgba(255, 93, 93, 0.12);
}
textarea { resize: vertical; }

.hidden { display: none !important; }
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

.auth-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}
.auth-card {
  width: min(440px, 100%);
  background: rgba(18, 22, 30, 0.9);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: var(--shadow);
}
.eyebrow {
  margin: 0 0 0.6rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.7rem;
  font-weight: 700;
}
.auth-card h1 {
  margin: 0 0 8px;
  font-family: 'Oswald', Arial, sans-serif;
  font-size: clamp(2.1rem, 4vw, 3rem);
  letter-spacing: 0.04em;
}
.muted {
  margin: 0 0 18px;
  color: var(--muted);
}
.auth-card input {
  margin-bottom: 12px;
}
.primary-btn, .ghost-btn, .upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.8rem 1.2rem;
  border: 1px solid transparent;
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-weight: 700;
}
.primary-btn {
  background: linear-gradient(135deg, #ff5d5d, #ff8a5b);
  color: #130d0d;
  box-shadow: 0 10px 22px rgba(255, 93, 93, 0.25);
}
.ghost-btn, .upload-btn {
  background: rgba(255,255,255,0.03);
  color: var(--text);
  border-color: var(--line);
}
.primary-btn:hover, .ghost-btn:hover, .upload-btn:hover { transform: translateY(-1px); }
.status-text { min-height: 1.2em; margin: 12px 0 0; color: #ffd3d3; }

.admin-shell {
  max-width: 1500px;
  margin: 0 auto;
  padding: 18px 20px 40px;
}
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 8px 20px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 24px;
}
.brand-block {
  display: flex;
  align-items: end;
  gap: 8px;
  font-family: 'Oswald', Arial, sans-serif;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.brand-mark {
  font-size: clamp(1.3rem, 2vw, 2rem);
  font-weight: 700;
}
.brand-sub {
  color: var(--muted);
  font-size: 0.68rem;
  letter-spacing: 0.2em;
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-nav a {
  color: var(--text);
  text-decoration: none;
  opacity: 0.8;
}

.admin-main {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 22px;
}
.sidebar, .content-panel, .catalog-panel {
  background: rgba(17, 20, 25, 0.9);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: var(--shadow);
}
.sidebar {
  padding: 18px;
}
.stats-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 16px;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 12px;
}
.stat-grid div {
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  border: 1px solid var(--line);
  padding: 12px 10px;
}
.stat-grid strong {
  display: block;
  font-size: 1.45rem;
  margin-bottom: 4px;
}
.stat-grid span {
  color: var(--muted);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.sidebar-actions {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}
.upload-btn {
  width: 100%;
  display: inline-flex;
}

.content-panel {
  padding: 20px 20px 24px;
}
.panel-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.panel-header h2, .catalog-toolbar h3 {
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2.25rem);
}
.catalog-form {
  display: grid;
  gap: 18px;
}
.field-grid {
  display: grid;
  gap: 16px;
}
.two-up { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.three-up { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.four-up { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.catalog-form label {
  display: block;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 600;
}
.catalog-form label span {
  display: inline-block;
  margin-bottom: 8px;
}
.toggle-box {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 50px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  padding: 0 14px;
}
.toggle-box input {
  width: 18px; height: 18px; accent-color: var(--accent); }
.toggle-box span { color: var(--text); font-weight: 600; }
.form-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.catalog-panel {
  margin-top: 24px;
  padding: 20px;
}
.catalog-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}
.toolbar-tools {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.toolbar-tools input, .toolbar-tools select {
  min-width: 180px;
}
.catalog-list {
  display: grid;
  gap: 12px;
}
.catalog-item {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 12px;
}
.catalog-item img {
  width: 96px;
  height: 128px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  border: 1px solid var(--line);
}
.catalog-item-info {
  min-width: 0;
}
.catalog-item-info h4 {
  margin: 0 0 6px;
  font-size: 1.06rem;
}
.catalog-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.catalog-item-meta span {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 5px 8px;
}
.catalog-item-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.catalog-item-actions button {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.02);
  color: var(--text);
  padding: 0.55rem 0.8rem;
}
.catalog-item-actions .danger-btn {
  border-color: rgba(255, 93, 93, 0.45);
  color: #ffd4d4;
}

@media (max-width: 980px) {
  .admin-main { grid-template-columns: 1fr; }
  .sidebar { order: 2; }
  .content-panel { order: 1; }
  .three-up, .four-up { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .two-up, .three-up, .four-up { grid-template-columns: 1fr; }
  .catalog-toolbar, .panel-header { flex-direction: column; align-items: stretch; }
  .catalog-item { grid-template-columns: 84px minmax(0, 1fr); }
  .catalog-item-actions { grid-column: 1 / -1; justify-content: flex-start; }
  .admin-header { flex-direction: column; align-items: flex-start; gap: 12px; }
}
