let catalogue = [];
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/catalogue.json');
    catalogue = await res.json();
    initHero();
    renderSections(catalogue);
    renderContinueWatching();
    renderWatchlist();
  } catch (err) { console.error(err); }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target)) document.getElementById('searchResults').style.display = 'none';
    });
  }
});

function initHero() {
  const f = catalogue.find(item => item.isFeatured) || catalogue[0];
  if (!f) return;
  document.getElementById('heroBillboard').style.backgroundImage = 'url(' + (f.backdrop || f.poster) + ')';
  document.getElementById('heroTitle').innerText = f.title;
  document.getElementById('heroDesc').innerText = f.synopsis;
  document.getElementById('heroYear').innerText = f.year;
  document.getElementById('heroRating').innerText = f.rating;
  document.getElementById('heroDuration').innerText = f.duration;
  document.getElementById('heroBadge').innerText = f.industry;
  document.getElementById('heroPlayBtn').href = '/watch.html?id=' + f.id;
  document.getElementById('heroDetailsBtn').onclick = () => openDetails(f.id);
}

function renderSections(items) {
  const gh = document.getElementById('ghanaianRow');
  const gen = document.getElementById('generalRow');
  gh.innerHTML = ''; gen.innerHTML = '';
  items.filter(i => i.industry === 'Ghanaian Cinema').forEach(item => gh.appendChild(createCard(item)));
  items.forEach(item => gen.appendChild(createCard(item)));
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = '<div class="card-img-wrapper" onclick="openDetails(\'' + item.id + '\')"><img src="' + item.poster + '" alt="' + item.title + '" loading="lazy"></div><div class="card-content"><div class="card-title">' + item.title + '</div><div class="card-sub"><span>' + item.year + '</span><span>' + item.rating + '</span></div></div>';
  return card;
}

function handleSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  const d = document.getElementById('searchResults');
  if (q.length < 2) { d.style.display = 'none'; return; }
  const res = catalogue.filter(m => m.title.toLowerCase().includes(q) || (m.cast && m.cast.some(c => c.toLowerCase().includes(q))));
  d.innerHTML = '';
  if (res.length === 0) d.innerHTML = '<div style="padding:10px; color:#888;">No results</div>';
  else {
    res.slice(0, 5).forEach(m => {
      const a = document.createElement('a');
      a.className = 'search-item';
      a.href = '/watch.html?id=' + m.id;
      a.innerHTML = '<img src="' + m.poster + '"><div><div style="font-weight:600; font-size:0.85rem;">' + m.title + '</div><div style="font-size:0.75rem; color:#aaa;">' + m.industry + '</div></div>';
      d.appendChild(a);
    });
  }
  d.style.display = 'flex';
}

function filterByIndustry(ind) {
  document.getElementById('filterIndustry').value = ind;
  applyFilters();
}

function applyFilters() {
  const ind = document.getElementById('filterIndustry').value;
  const gen = document.getElementById('filterGenre').value;
  let f = catalogue;
  if (ind !== 'all') f = f.filter(x => x.industry === ind);
  if (gen !== 'all') f = f.filter(x => x.genres.includes(gen));
  renderSections(f);
}

function openDetails(id) {
  const item = catalogue.find(i => i.id === id);
  if (!item) return;
  const m = document.getElementById('infoModal');
  const inL = JSON.parse(localStorage.getItem('sh_watchlist') || '[]').includes(id);
  document.getElementById('modalContent').innerHTML = '<h2 style="font-size:1.8rem;">' + item.title + '</h2><div style="color:#aaa; margin:6px 0 12px 0;">' + item.year + ' | ' + item.rating + ' | ' + item.industry + '</div><p style="line-height:1.6;">' + item.synopsis + '</p><div style="margin-top:10px; color:#aaa;">Starring: ' + (item.cast ? item.cast.join(', ') : 'N/A') + '</div><div style="display:flex; gap:10px; margin-top:20px;"><a href="/watch.html?id=' + item.id + '" class="btn btn-primary">▶ Watch Now</a><button class="btn btn-secondary" onclick="toggleWatchlist(\'' + item.id + '\')">' + (inL ? '✓ In Watchlist' : '+ Watchlist') + '</button></div>';
  m.style.display = 'flex';
}

function closeModal() { document.getElementById('infoModal').style.display = 'none'; }

function toggleWatchlist(id) {
  let l = JSON.parse(localStorage.getItem('sh_watchlist') || '[]');
  l = l.includes(id) ? l.filter(i => i !== id) : [...l, id];
  localStorage.setItem('sh_watchlist', JSON.stringify(l));
  renderWatchlist();
  openDetails(id);
}

function renderWatchlist() {
  const l = JSON.parse(localStorage.getItem('sh_watchlist') || '[]');
  const s = document.getElementById('watchlist-section');
  const r = document.getElementById('watchlistRow');
  if (!l.length) { s.style.display = 'none'; return; }
  s.style.display = 'block'; r.innerHTML = '';
  catalogue.filter(i => l.includes(i.id)).forEach(i => r.appendChild(createCard(i)));
}

function renderContinueWatching() {
  const h = JSON.parse(localStorage.getItem('sh_history') || '{}');
  const ids = Object.keys(h);
  const s = document.getElementById('continue-section');
  const r = document.getElementById('continueRow');
  if (!ids.length) { s.style.display = 'none'; return; }
  s.style.display = 'block'; r.innerHTML = '';
  ids.forEach(id => {
    const item = catalogue.find(i => i.id === id);
    if (item) {
      const c = createCard(item);
      const p = document.createElement('div');
      p.style.cssText = 'height:3px; background:#e50914; width:' + (h[id].percent || 0) + '%; margin-top:4px;';
      c.appendChild(p);
      r.appendChild(c);
    }
  });
}
