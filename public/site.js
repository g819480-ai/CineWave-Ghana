const $ = id => document.getElementById(id);

const icons = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3a7.5 7.5 0 015.91 12.81l4.39 4.39 1.41-1.41-4.39-4.39A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94c.04-.31.06-.62.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.6-.18l-2.39.96a7.13 7.13 0 00-1.63-.94L14.5 2.5a.5.5 0 00-.5-.5h-3.99a.5.5 0 00-.5.5l-.35 2.41c-.58.23-1.12.55-1.63.94l-2.39-.96a.5.5 0 00-.6.18L2.71 9.84a.5.5 0 00.12.64l2.03 1.58c-.04.31-.06.62-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32c.13.22.4.3.6.18l2.39-.96c.51.39 1.05.71 1.63.94l.35 2.41a.5.5 0 00.5.5h3.99a.5.5 0 00.5-.5l.35-2.41c.58-.23 1.12-.55 1.63-.94l2.39.96c.2.12.47.04.6-.18l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8a3.5 3.5 0 010 7.5z"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l8 7.25V20a1 1 0 01-1 1h-4v-7H9v7H5a1 1 0 01-1-1v-9.25L12 3.5zm-7 8.25L12 4.9l7 6.85V19h-3v-7H8v7H5v-7.25z"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5A1.5 1.5 0 018.5 3h7A1.5 1.5 0 0117 4.5v15.2a.5.5 0 01-.76.43L12 17.5l-4.24 2.63A.5.5 0 017 19.7V4.5zm2 .5v12.2l3.24-2.01a.5.5 0 01.52 0L15 17.2V5H9z"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5L8 5.5z"/></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.55 15.15L5.7 11.3l-1.4 1.4 5.25 5.25 10.15-10.15-1.4-1.4z"/></svg>'
};

const DEFAULT_FILMS = [
  { id: 'ghana-echo', title: 'Ghana Echoes', year: 2024, genre: 'Drama', category: 'ghanaian', kind: 'Movie', featured: true, poster: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80', description: 'A young radio host navigates memory, ambition and love across Accra.', rating: '8.8', certificate: 'PG-13', language: 'English', duration: '1h 49m', creator: 'Aisha Mensah', status: 'new' },
  { id: 'sunset-plaza', title: 'Sunset Plaza', year: 2023, genre: 'Thriller', category: 'international', kind: 'Movie', featured: true, poster: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80', description: 'A city reporter uncovers a conspiracy after a luxury complex blackout.', rating: '8.5', certificate: 'PG-13', language: 'English', duration: '2h 03m', creator: 'M. Okafor', status: 'featured' },
  { id: 'midnight-market', title: 'Midnight Market', year: 2022, genre: 'Crime', category: 'nollywood', kind: 'Series', featured: true, poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1600&q=80', description: 'A sharp young negotiator battles organized crime through a neon-lit market.', rating: '8.4', certificate: 'TV-14', language: 'English', duration: '45m', creator: 'J. Osei', status: 'featured' },
  { id: 'gold-cocoa', title: 'Gold in the Cocoa', year: 2024, genre: 'Documentary', category: 'ghanaian', kind: 'Movie', featured: false, poster: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80', description: 'A poetic portrait of farmers, trade and resilience across the cocoa belt.', rating: '8.9', certificate: 'G', language: 'English', duration: '1h 26m', creator: 'N. Agyeman', status: 'new' },
  { id: 'lagoon-signal', title: 'Lagoon Signal', year: 2021, genre: 'Sci-Fi', category: 'hollywood', kind: 'Movie', featured: true, poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1526374965328-f4c5f7a6f6d8?auto=format&fit=crop&w=1600&q=80', description: 'An unexpected signal from the Atlantic changes the fate of a coastal town.', rating: '8.6', certificate: 'PG-13', language: 'English', duration: '2h 11m', creator: 'L. Appiah', status: 'trending' },
  { id: 'last-crow', title: 'Last Crow of Adaklu', year: 2023, genre: 'Adventure', category: 'ghanaian', kind: 'Movie', featured: false, poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', description: 'A teenager rides the last storm across a mythic valley in search of home.', rating: '8.3', certificate: 'PG', language: 'Ewe', duration: '1h 40m', creator: 'K. Awuah', status: 'trending' },
  { id: 'nairobi-night', title: 'Nairobi Night', year: 2024, genre: 'Mystery', category: 'international', kind: 'Series', featured: false, poster: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80', description: 'Investigators uncover a hidden network of secrets beneath the city lights.', rating: '8.7', certificate: 'TV-MA', language: 'English', duration: '52m', creator: 'L. Karanja', status: 'new' },
  { id: 'diamond-hour', title: 'Diamond Hour', year: 2022, genre: 'Romance', category: 'bollywood', kind: 'Movie', featured: false, poster: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1600&q=80', description: 'A wedding planner falls for the story behind an old family heirloom.', rating: '8.1', certificate: 'PG', language: 'Hindi', duration: '2h 04m', creator: 'K. Sharma', status: 'new' },
  { id: 'deep-signal', title: 'Deep Signal', year: 2025, genre: 'Action', category: 'hollywood', kind: 'Movie', featured: true, poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80', description: 'A signal technician uncovers a covert operation beneath the ocean floor.', rating: '8.8', certificate: 'PG-13', language: 'English', duration: '2h 18m', creator: 'R. Mendez', status: 'featured' },
  { id: 'saffron-bay', title: 'Saffron Bay', year: 2024, genre: 'Drama', category: 'international', kind: 'Movie', featured: false, poster: 'https://images.unsplash.com/photo-1529205539405-b38d7c6f57f8?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1494996937319-344454492b37?auto=format&fit=crop&w=1600&q=80', description: 'Three sisters reconnect on a storm-battered coast and choose courage.', rating: '8.2', certificate: 'PG', language: 'French', duration: '1h 52m', creator: 'L. Moreau', status: 'new' },
  { id: 'red-garden', title: 'Red Garden', year: 2020, genre: 'Mystery', category: 'international', kind: 'Series', featured: false, poster: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', description: 'An old estate opens its doors to the truth behind a vanished family.', rating: '8.6', certificate: 'TV-14', language: 'English', duration: '48m', creator: 'E. Woods', status: 'featured' },
  { id: 'rain-city', title: 'Rain City', year: 2024, genre: 'Romance', category: 'ghanaian', kind: 'Series', featured: true, poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', backdrop: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80', description: 'A pair of twenty-somethings meet, drift apart and rediscover each other in Accra.', rating: '8.7', certificate: 'TV-14', language: 'English', duration: '43m', creator: 'D. Ofori', status: 'featured' }
];

const $categoryLabels = [
  { key: 'all', label: 'All picks' },
  { key: 'featured', label: 'Featured' },
  { key: 'ghanaian', label: 'Ghanaian' },
  { key: 'nollywood', label: 'Nollywood' },
  { key: 'hollywood', label: 'Hollywood' },
  { key: 'bollywood', label: 'Bollywood' },
  { key: 'international', label: 'International' },
  { key: 'series', label: 'Series' }
];

const state = {
  films: DEFAULT_FILMS,
  myList: new Set(readStore('cinewave-my-list', [])),
  progress: readStore('cinewave-progress', {}),
  heroFilm: null,
  activeFilm: null,
  activeVideo: null,
  activeFilter: 'all',
  viewMode: 'wide',
  toastTimer: null
};

const byId = id => state.films.find(f => f.id === id);

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast('Browser storage is unavailable. This change will last only for this visit.');
  }
}

function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = icons[el.dataset.icon] || '';
  });
}

function showToast(message) {
  clearTimeout(state.toastTimer);
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  state.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function safeCssUrl(value) {
  return encodeURI(String(value || '')).replace(/["'()\\]/g, c => encodeURIComponent(c));
}

function fallbackPoster(title = 'CineWave') {
  const safe = esc(String(title).slice(0, 30));
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#111317"/><rect x="70" y="80" width="660" height="1040" rx="18" fill="#1a1e26"/><circle cx="400" cy="438" r="152" fill="#ff5c68" opacity="0.8"/><path d="M300 566h200v120H300zm0 150h200v120H300z" fill="#f5f5f5" opacity="0.85"/><text x="400" y="1010" text-anchor="middle" fill="#f5f5f5" font-family="Arial, sans-serif" font-size="56" font-weight="700">${safe}</text></svg>`);
}

function normalizeApiMovie(m) {
  const title = String(m.title || m.name || 'Untitled');
  const category = String(m.category || m.category_label || 'open');
  return {
    id: String(m.id),
    title,
    year: m.year || new Date().getFullYear(),
    genre: String(m.genre || m.category_label || 'Drama'),
    category: category.toLowerCase(),
    kind: String(m.kind || m.type || 'Movie'),
    featured: !!m.featured,
    poster: m.poster || fallbackPoster(title),
    backdrop: m.backdrop || m.poster || fallbackPoster(title),
    description: String(m.description || m.synopsis || 'A compelling story worth watching.'),
    rating: String(m.rating || 'NR'),
    certificate: String(m.certificate || 'PG'),
    language: String(m.language || 'English'),
    duration: String(m.duration || '1h 50m'),
    creator: String(m.creator || m.director || 'CineWave'),
    status: String(m.status || 'featured')
  };
}

function visibleFilms() {
  const searchQuery = $('search')?.value.trim().toLowerCase() || '';
  return state.films.filter(f => {
    const matchesFilter = state.activeFilter === 'all'
      ? true
      : state.activeFilter === 'featured'
        ? !!f.featured
        : state.activeFilter === 'series'
          ? f.kind === 'Series'
          : f.category === state.activeFilter;

    const haystack = `${f.title} ${f.genre} ${f.creator} ${f.category}`.toLowerCase();
    const matchesSearch = !searchQuery || haystack.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });
}

function renderCategoryChips() {
  const container = $('categoryStrip');
  if (!container) return;
  container.innerHTML = $categoryLabels.map(({ key, label }) => `
    <button class="chip ${state.activeFilter === key ? 'is-active' : ''}" type="button" data-filter="${key}">${label}</button>
  `).join('');
}

function renderSpotlightCards() {
  const cards = [
    { title: 'Free & instant', body: 'No signup, no profile wall, just press play.' },
    { title: 'Curated library', body: 'Ghanaian, Nollywood, Bollywood and world cinema.' },
    { title: 'Resume anytime', body: 'Continue from the last point you watched.' }
  ];
  const container = document.querySelector('.spotlight-strip');
  if (!container) return;
  container.innerHTML = cards.map(item => `
    <article class="spotlight-card">
      <span class="spotlight-eyebrow">CineWave</span>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.body)}</p>
    </article>
  `).join('');
}

function cardMarkup(f, withProgress = false) {
  const saved = state.progress[f.id] || null;
  const percent = saved && saved.duration ? Math.min(100, Math.max(0, (saved.position / saved.duration) * 100)) : 0;
  const listed = state.myList.has(f.id);
  const progressMarkup = withProgress && saved && saved.duration
    ? `<div class="progress-track"><span style="width:${percent}%"></span></div>`
    : '';

  return `
    <article class="movie-card ${state.viewMode === 'compact' ? 'compact' : ''}" data-id="${esc(f.id)}">
      <button class="movie-poster-button" type="button" data-info="${esc(f.id)}" aria-label="Open details for ${esc(f.title)}">
        <img src="${esc(f.poster || fallbackPoster(f.title))}" alt="${esc(f.title)} poster" loading="lazy">
      </button>
      <div class="movie-info">
        <div class="movie-topline">
          <h3>${esc(f.title)}</h3>
          <button class="mini-action" type="button" data-list="${esc(f.id)}" aria-label="Toggle ${esc(f.title)} in My List">${listed ? '✓' : '+'}</button>
        </div>
        <div class="movie-meta">
          <span class="movie-year">${esc(f.year)}</span>
          <span class="movie-badge">${esc(f.kind || 'Movie')}</span>
        </div>
        ${progressMarkup}
      </div>
    </article>
  `;
}

function rowMarkup(id, title, items, withProgress = false) {
  if (!items.length) return '';
  return `
    <section class="row-section" id="${esc(id)}">
      <div class="row-heading">
        <h2>${esc(title)}</h2>
        <span>${items.length} titles</span>
      </div>
      <div class="rail-wrap">
        <div class="rail">${items.map(f => cardMarkup(f, withProgress)).join('')}</div>
      </div>
    </section>
  `;
}

function renderContinue() {
  const continueItems = Object.entries(state.progress)
    .sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0))
    .map(([id]) => byId(id))
    .filter(Boolean);

  const section = $('continue-section');
  const container = $('continueRail');
  if (!section || !container) return;

  if (!continueItems.length) {
    section.hidden = true;
    container.innerHTML = '';
    return;
  }

  section.hidden = false;
  container.innerHTML = continueItems.map(f => cardMarkup(f, true)).join('');
}

function renderMyList() {
  const items = [...state.myList].map(id => byId(id)).filter(Boolean);
  const container = $('myListContent');
  if (!container) return;
  container.innerHTML = items.length
    ? `<div class="rail-wrap"><div class="rail">${items.map(f => cardMarkup(f)).join('')}</div></div>`
    : '<p class="empty-state"><strong>Keep everything you love in one place.</strong><br>Tap the + on any title to save it here.</p>';
}

function renderRows() {
  const visible = visibleFilms();
  const featured = visible.filter(f => f.featured).slice(0, 8);
  const latest = visible.filter(f => f.status === 'new').slice(0, 6);
  const trending = visible.filter(f => f.status === 'trending').slice(0, 6);
  const dynamicRows = $('dynamicRows');
  if (!dynamicRows) return;

  const rows = [];
  if (featured.length) rows.push({ id: 'featured-row', title: 'Featured today', items: featured });
  if (trending.length) rows.push({ id: 'trending-row', title: 'Trending now', items: trending });
  if (latest.length) rows.push({ id: 'latest-row', title: 'Fresh additions', items: latest });

  dynamicRows.innerHTML = rows.map(row => rowMarkup(row.id, row.title, row.items)).join('');
  if (!rows.length) {
    dynamicRows.innerHTML = '<div class="empty-state"><strong>No titles match this filter.</strong><br>Try another category or clear your search.</div>';
  }
}

function renderSearch() {
  const q = $('search')?.value.trim().toLowerCase() || '';
  const panel = $('searchResults');
  const rail = $('searchRail');
  if (!panel || !rail) return;

  const matches = visibleFilms();
  panel.hidden = !q;
  rail.innerHTML = q ? `<div class="rail-wrap"><div class="rail">${matches.map(f => cardMarkup(f)).join('')}</div></div>` : '';
  $('searchHeading').textContent = q ? `Search results for “${q}”` : 'Search results';
}

function updateHero() {
  const heroFilm = state.films.find(f => f.featured) || state.films[0] || null;
  state.heroFilm = heroFilm;
  if (!heroFilm) return;

  const heroTitle = $('heroTitle');
  const heroDescription = $('heroDescription');
  const heroPoster = $('heroPoster');
  const heroBackdrop = $('heroBackdrop');
  const heroPosterWrap = $('heroPosterWrap');

  if (heroTitle) heroTitle.innerHTML = `${esc(heroFilm.title.split(' ')[0] || 'STORIES')}<br><em>MOVE YOU.</em>`;
  if (heroDescription) heroDescription.textContent = heroFilm.description;
  if (heroPoster) heroPoster.src = heroFilm.poster || fallbackPoster(heroFilm.title);
  if (heroBackdrop) heroBackdrop.style.backgroundImage = `linear-gradient(90deg, rgba(9, 10, 15, 0.9), rgba(9, 10, 15, 0.42) 42%, rgba(9, 10, 15, 0.8)), url('${safeCssUrl(heroFilm.backdrop || heroFilm.poster)}')`;
  if (heroPosterWrap) heroPosterWrap.hidden = false;
}

function updateDetails() {
  if (!state.activeFilm) return;
  const detailsVisual = $('detailsVisual');
  const detailsTitle = $('dialogTitle');
  const detailsMeta = $('detailsMeta');
  const detailsDescription = $('detailsDescription');
  const detailsGrid = $('detailsGrid');
  const detailsList = $('detailsList');

  if (detailsVisual) detailsVisual.style.backgroundImage = `linear-gradient(0deg, rgba(10,10,12,0.18), rgba(10,10,12,0.18)), url('${safeCssUrl(state.activeFilm.backdrop || state.activeFilm.poster)}')`;
  if (detailsTitle) detailsTitle.textContent = state.activeFilm.title;
  if (detailsMeta) detailsMeta.innerHTML = [state.activeFilm.genre, state.activeFilm.year, state.activeFilm.duration, state.activeFilm.certificate].map(item => `<span>${esc(item)}</span>`).join('');
  if (detailsDescription) detailsDescription.textContent = state.activeFilm.description;
  if (detailsGrid) {
    detailsGrid.innerHTML = `
      <div><strong>Genre</strong><span>${esc(state.activeFilm.genre)}</span></div>
      <div><strong>Director</strong><span>${esc(state.activeFilm.creator)}</span></div>
      <div><strong>Language</strong><span>${esc(state.activeFilm.language)}</span></div>
      <div><strong>Status</strong><span>${esc(state.activeFilm.status || 'Featured')}</span></div>
    `;
  }
  if (detailsList) {
    const listed = state.myList.has(state.activeFilm.id);
    detailsList.innerHTML = `${listed ? icons.check : icons.plus}${listed ? 'In My List' : 'Add to My List'}`;
  }
}

function openDetails(id, autoplay = false) {
  const film = byId(id);
  if (!film) return;
  state.activeFilm = film;
  updateDetails();
  const dialog = $('detailsDialog');
  if (dialog) dialog.showModal();
  if (autoplay) openPlayer(id);
}

function closePlayer() {
  if (!state.activeVideo) return;
  const currentTime = state.activeVideo.currentTime || 0;
  const duration = state.activeVideo.duration || 0;
  if (duration > 0 && currentTime > 20) {
    state.progress[state.activeFilm.id] = { position: currentTime, duration, updatedAt: Date.now() };
    writeStore('cinewave-progress', state.progress);
  }
  state.activeVideo.pause();
  state.activeVideo = null;
  $('watchFrame').innerHTML = '';
  const dialog = $('playerDialog');
  if (dialog && dialog.open) dialog.close();
  renderContinue();
}

function openPlayer(id) {
  const film = byId(id);
  if (!film) return;
  state.activeFilm = film;
  if ($('detailsDialog') && $('detailsDialog').open) $('detailsDialog').close();
  $('watchTitle').textContent = film.title;
  $('watchFrame').innerHTML = `
    <video controls autoplay playsinline preload="metadata" poster="${safeCssUrl(film.poster || fallbackPoster(film.title))}">
      <source src="${safeCssUrl(film.backdrop || film.poster || fallbackPoster(film.title))}" type="video/mp4">
    </video>
  `;
  state.activeVideo = $('watchFrame').querySelector('video');
  const dialog = $('playerDialog');
  if (dialog) dialog.showModal();
  if (state.activeVideo) {
    state.activeVideo.addEventListener('pause', () => {
      if (state.activeFilm) {
        const position = state.activeVideo.currentTime || 0;
        const duration = state.activeVideo.duration || 0;
        state.progress[state.activeFilm.id] = { position, duration, updatedAt: Date.now() };
        writeStore('cinewave-progress', state.progress);
      }
    }, { once: true });
  }
}

function toggleList(id) {
  const film = byId(id);
  if (!film) return;
  if (state.myList.has(id)) {
    state.myList.delete(id);
    showToast(`${film.title} removed from My List.`);
  } else {
    state.myList.add(id);
    showToast(`${film.title} added to My List.`);
  }
  writeStore('cinewave-my-list', [...state.myList]);
  renderMyList();
  renderContinue();
  if (state.activeFilm) updateDetails();
}

function clearSearch() {
  $('search').value = '';
  renderSearch();
  renderRows();
}

function renderAll() {
  renderCategoryChips();
  renderSpotlightCards();
  renderContinue();
  renderRows();
  renderMyList();
  renderSearch();
  updateHero();
  hydrateIcons();
}

async function loadApiMovies() {
  try {
    const response = await fetch('/api/movies', { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!response.ok) throw new Error('Catalog unavailable');
    const data = await response.json();
    if (Array.isArray(data) && data.length) {
      state.films = data.map(normalizeApiMovie);
      writeStore('cinewave-api-movies', state.films);
    }
  } catch {
    const cached = readStore('cinewave-api-movies', null);
    if (Array.isArray(cached) && cached.length) {
      state.films = cached.map(normalizeApiMovie);
    }
  }
  renderAll();
}

async function loadAds() {
  try {
    const response = await fetch('/api/ads', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    if (!data || !data.enabled || !/^ca-pub-[0-9]+$/.test(String(data.publisher_id || ''))) return;
    const ad = $('homeAd');
    if (ad) ad.textContent = 'Sponsored';
  } catch {
    // no ad config, ignore silently
  }
}

document.addEventListener('click', event => {
  const playButton = event.target.closest('[data-play]');
  const infoButton = event.target.closest('[data-info]');
  const listButton = event.target.closest('[data-list]');
  const filterButton = event.target.closest('[data-filter]');
  const viewButton = event.target.closest('[data-view]');

  if (playButton) {
    openPlayer(playButton.dataset.play);
  }

  if (infoButton) {
    openDetails(infoButton.dataset.info);
  }

  if (listButton) {
    toggleList(listButton.dataset.list);
  }

  if (filterButton) {
    state.activeFilter = filterButton.dataset.filter || 'all';
    renderCategoryChips();
    renderRows();
    renderSearch();
  }

  if (viewButton) {
    state.viewMode = viewButton.dataset.view || 'wide';
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.view === state.viewMode);
    });
    renderRows();
    renderMyList();
    renderContinue();
  }
});

$('heroPlay')?.addEventListener('click', () => state.heroFilm && openPlayer(state.heroFilm.id));
$('heroInfo')?.addEventListener('click', () => state.heroFilm && openDetails(state.heroFilm.id));
$('detailsClose')?.addEventListener('click', () => $('detailsDialog').close());
$('playerClose')?.addEventListener('click', closePlayer);
$('detailsPlay')?.addEventListener('click', () => state.activeFilm && openPlayer(state.activeFilm.id));
$('detailsList')?.addEventListener('click', () => state.activeFilm && toggleList(state.activeFilm.id));
$('clearData')?.addEventListener('click', () => {
  state.myList.clear();
  state.progress = {};
  writeStore('cinewave-my-list', []);
  writeStore('cinewave-progress', {});
  renderMyList();
  renderContinue();
  showToast('Viewing data cleared from this browser.');
});
$('clearSearch')?.addEventListener('click', clearSearch);
$('newsletterButton')?.addEventListener('click', () => showToast('Alerts are ready for your upcoming launch list.'));
$('mobileSearch')?.addEventListener('click', () => $('search')?.focus());
$('search')?.addEventListener('input', () => {
  renderRows();
  renderSearch();
});
$('subtitleLanguage')?.addEventListener('change', () => {
  if (!state.activeVideo) return;
  const selected = $('subtitleLanguage').value;
  for (const track of state.activeVideo.textTracks || []) {
    track.mode = selected !== 'off' && track.language === selected ? 'showing' : 'hidden';
  }
});

let previousScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const header = $('siteHeader');
  if (!header) return;
  header.classList.toggle('scrolled', y > 24);
  header.classList.toggle('header-hidden', y > 220 && y > previousScroll);
  previousScroll = y;
});

loadApiMovies();
loadAds();
