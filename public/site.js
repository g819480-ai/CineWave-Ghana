/* CineWave Ghana — cinematic catalog */
:root {
  --primitive-stone-950: oklch(.145 .005 65);
  --primitive-stone-900: oklch(.19 .008 65);
  --primitive-stone-800: oklch(.27 .01 65);
  --primitive-coral-500: oklch(.638 .225 20);
  --primitive-coral-600: oklch(.68 .205 20);
  --surface-page: #090a0e;
  --surface-raised: #111317;
  --surface-elevated: #171d25;
  --surface-soft: rgba(255,255,255,.04);
  --text-primary: #f8f8f8;
  --text-muted: rgba(255,255,255,.74);
  --line-soft: rgba(255,255,255,.08);
  --line-strong: rgba(255,255,255,.18);
  --shadow-soft: 0 18px 48px rgba(0,0,0,.35);
  --component-header-height: 82px;
  --component-page-gutter: 36px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 90px; }
body {
  margin: 0;
  min-width: 320px;
  min-height: 100dvh;
  overflow-x: clip;
  background: var(--surface-page);
  color: var(--text-primary);
  font-family: 'Urbanist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.5;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }
main { display: block; }
.hidden { display: none !important; }
.skip-link { position: absolute; left: -9999px; top: auto; }
.skip-link:focus { left: 20px; top: 20px; z-index: 9999; background: #fff; color: #000; padding: 10px 14px; border-radius: 8px; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px var(--component-page-gutter);
  background: rgba(7,8,10,.72);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line-soft);
}
.brand {
  display: inline-flex;
  align-items: end;
  gap: 4px;
  color: var(--text-primary);
  font-family: 'Oswald', Arial, sans-serif;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.brand span { font-size: clamp(1.15rem, 1.5vw, 1.9rem); font-weight: 700; }
.brand small { font-size: .58rem; letter-spacing: .22em; opacity: .8; }
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 18px;
}
.desktop-nav a {
  font-size: .8rem;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: rgba(255,255,255,.74);
  transition: color .2s ease;
}
.desktop-nav a:hover { color: #fff; }
.header-actions { display: flex; align-items: center; gap: 12px; }
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 42px;
  width: min(30vw, 420px);
  border-radius: 999px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  color: #fff;
}
.search-box input {
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  outline: 0;
  font-size: .94rem;
}
.search-box input::placeholder { color: rgba(255,255,255,.6); }
.admin-link {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  color: var(--text-primary);
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 620px;
  padding: calc(var(--component-header-height) + 30px) var(--component-page-gutter) 54px;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(9,10,14,.86), rgba(9,10,14,.34) 42%, rgba(9,10,14,.72));
  isolation: isolate;
}
.hero-backdrop {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: saturate(.82) contrast(1.08);
  transform: scale(1.06);
  z-index: -2;
}
.hero-grain {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.06), transparent 60%);
  opacity: .4;
  z-index: -1;
}
.hero-content, .hero-poster-wrap, .hero-scroll { position: relative; z-index: 1; }
.hero-content { max-width: 620px; }
.hero-kicker {
  margin: 0 0 12px;
  color: var(--primitive-coral-500);
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .24em;
  text-transform: uppercase;
}
.hero h1 {
  margin: 0 0 14px;
  font-family: 'Oswald', Arial, sans-serif;
  font-size: clamp(3.4rem, 7vw, 7rem);
  line-height: .9;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.hero h1 em { color: #ff6b72; font-style: normal; }
.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}
.hero-meta span {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.1);
  font-size: .7rem;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #f0f0f0;
}
.hero-description {
  max-width: 560px;
  margin: 0 0 26px;
  font-size: 1.06rem;
  color: rgba(255,255,255,.82);
}
.hero-actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: transform .2s ease, opacity .2s ease;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.button:hover { transform: translateY(-1px); }
.button-light { background: #fff; color: #0d0d12; }
.button-muted {
  background: rgba(255,255,255,.12);
  color: white;
}
.hero-poster-wrap {
  margin-left: auto;
  display: grid;
  place-items: center;
  gap: 10px;
  color: rgba(255,255,255,.8);
  letter-spacing: .18em;
  font-size: .58rem;
}
.hero-poster {
  width: min(28vw, 260px);
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: var(--shadow-soft);
}
.hero-scroll {
  position: absolute;
  left: 50%;
  bottom: 22px;
  translate: -50% 0;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: rgba(255,255,255,.78);
  letter-spacing: .18em;
  text-transform: uppercase;
  font-size: .62rem;
}
.hero-scroll i {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(255,255,255,.28);
  border-radius: 50%;
  position: relative;
}
.hero-scroll i::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 10px;
  width: 8px;
  height: 8px;
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
  transform: translateX(-50%) rotate(45deg);
}

.spotlight-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 28px var(--component-page-gutter) 0;
}
.spotlight-card {
  background: rgba(255,255,255,.03);
  border: 1px solid var(--line-soft);
  border-radius: 16px;
  padding: 20px 18px;
}
.spotlight-eyebrow {
  display: inline-block;
  font-size: .68rem;
  letter-spacing: .18em;
  color: #ff9a9a;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.spotlight-card h3 { margin: 0 0 8px; font-size: 1.3rem; }
.spotlight-card p { margin: 0; color: var(--text-muted); }

.discover-panel {
  padding: 36px var(--component-page-gutter) 0;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 16px;
}
.eyebrow-small {
  margin: 0 0 4px;
  color: #ff8d86;
  text-transform: uppercase;
  letter-spacing: .2em;
  font-size: .68rem;
}
.section-header h2 {
  margin: 0;
  font-size: clamp(1.8rem, 2vw, 2.6rem);
}
.view-toggle {
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255,255,255,.04);
  border: 1px solid var(--line-soft);
}
.toggle-btn {
  border: 0;
  background: transparent;
  color: #d8d8d8;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
}
.toggle-btn.is-active {
  background: #fff;
  color: #111;
}
.category-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.category-pill {
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.04);
  color: var(--text-primary);
  border-radius: 999px;
  padding: 9px 14px;
  font-weight: 600;
}
.category-pill.is-active {
  background: rgba(255,107,114,.12);
  border-color: rgba(255,107,114,.5);
}

.ad-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 26px var(--component-page-gutter) 0;
  min-height: 90px;
  background: linear-gradient(90deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  color: rgba(255,255,255,.55);
  letter-spacing: .2em;
  text-transform: uppercase;
  font-size: .7rem;
}

.catalog { padding: 24px var(--component-page-gutter) 80px; }
.row-section { margin-bottom: 28px; }
.row-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.row-heading h2 {
  margin: 0;
  font-size: clamp(1.3rem, 1.4vw, 1.8rem);
}
.row-heading span, .text-button {
  color: var(--text-muted);
  font-size: .8rem;
}
.text-button {
  border: 0;
  background: transparent;
  cursor: pointer;
}
.rail-wrap, #myListContent, #searchRail {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 18px;
}
.card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255,255,255,.02);
  border: 1px solid var(--line-soft);
  transition: transform .2s ease, border-color .2s ease;
}
.card:hover {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,.24);
}
.card-poster {
  aspect-ratio: 2/3;
  width: 100%;
  object-fit: cover;
  display: block;
}
.card-body {
  padding: 12px 12px 14px;
}
.card-title {
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-meta {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--text-muted);
  font-size: .76rem;
}
.card-progress {
  height: 4px;
  width: 100%;
  background: rgba(255,255,255,.08);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 10px;
}
.card-progress > span {
  display: block;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #ff5a5f, #ff7a59);
}

.search-results {
  margin-top: 8px;
}

.site-footer {
  padding: 18px var(--component-page-gutter) 56px;
  border-top: 1px solid var(--line-soft);
  color: var(--text-muted);
  text-align: center;
}
.footer-brand { justify-content: center; margin-bottom: 10px; }
.footer-actions { margin-top: 16px; }

.mobile-nav {
  display: none;
}

.details-dialog, .player-dialog {
  border: 0;
  padding: 0;
  background: transparent;
  max-width: 100vw;
  width: 100vw;
  height: 100vh;
}
.details-dialog::backdrop, .player-dialog::backdrop {
  background: rgba(0,0,0,.8);
}
.details-shell {
  position: relative;
  width: min(980px, calc(100vw - 32px));
  margin: 7vh auto;
  background: rgba(17,19,23,.96);
  border: 1px solid var(--line-soft);
  border-radius: 22px;
  display: grid;
  grid-template-columns: 1.1fr 1.4fr;
  overflow: hidden;
}
.details-visual {
  min-height: 460px;
  background-size: cover;
  background-position: center;
}
.details-copy {
  padding: 28px 24px 26px;
}
.eyebrow-small {
  margin: 0 0 10px;
  color: #ff9a9a;
  font-size: .72rem;
  letter-spacing: .18em;
  text-transform: uppercase;
}
#dialogTitle {
  margin: 0 0 10px;
  font-size: clamp(2rem, 3vw, 3rem);
}
.details-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--text-muted);
  margin-bottom: 14px;
}
.details-meta span {
  padding: 6px 8px;
  border-radius: 999px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  font-size: .72rem;
}
#detailsDescription {
  color: rgba(255,255,255,.8);
  line-height: 1.7;
  margin: 0 0 18px;
}
.details-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.info-chip {
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255,255,255,.03);
  border: 1px solid var(--line-soft);
  color: rgba(255,255,255,.7);
}
.icon-button {
  background: rgba(255,255,255,.08);
  color: #fff;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  text-align: center;
  cursor: pointer;
}
.dialog-close {
  position: absolute;
  top: 16px;
  right: 16px;
}

.player-shell {
  position: relative;
  width: min(1200px, calc(100vw - 32px));
  margin: 5vh auto;
  background: rgba(14,16,20,.96);
  border: 1px solid var(--line-soft);
  border-radius: 20px;
  overflow: hidden;
}
.player-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  border-bottom: 1px solid var(--line-soft);
}
.player-top span {
  display: block;
  color: rgba(255,255,255,.55);
  letter-spacing: .18em;
  text-transform: uppercase;
  font-size: .62rem;
}
.player-top strong {
  display: block;
  margin-top: 4px;
  font-size: 1.12rem;
}
.watch-frame {
  aspect-ratio: 16/9;
  background: #000;
}
.watch-frame video,
.watch-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
  background: #000;
}
.player-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px 18px;
  color: rgba(255,255,255,.78);
}
.player-controls select {
  background: rgba(255,255,255,.04);
  border: 1px solid var(--line-soft);
  color: white;
  padding: 8px 10px;
  border-radius: 8px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%) translateY(20px);
  background: rgba(17,19,23,.96);
  color: #fff;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 999px;
  padding: 10px 16px;
  opacity: 0;
  transition: opacity .2s ease, transform .2s ease;
  z-index: 100;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 860px) {
  .desktop-nav { display: none; }
  .search-box { width: min(66vw, 280px); }
  .spotlight-strip { grid-template-columns: 1fr; }
  .details-shell { grid-template-columns: 1fr; }
  .details-visual { min-height: 260px; }
}
@media (max-width: 640px) {
  .site-header { padding-inline: 14px; }
  .hero { min-height: 540px; padding: 110px 18px 42px; }
  .hero-poster-wrap { display: none; }
  .catalog, .discover-panel, .spotlight-strip { padding-left: 18px; padding-right: 18px; }
  .rail-wrap, #myListContent, #searchRail { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .mobile-nav {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    background: rgba(10,10,12,.9);
    border-top: 1px solid var(--line-soft);
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
    z-index: 30;
  }
  .mobile-nav a, .mobile-nav button {
    display: grid;
    place-items: center;
    color: #fff;
    border: none;
    background: transparent;
    gap: 4px;
    font-size: .7rem;
  }
  body { padding-bottom: 72px; }
}
