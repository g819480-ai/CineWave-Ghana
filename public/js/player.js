let currentMedia = null, currentHls = null, intro = { start: 0, end: 0 };
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const ep = parseInt(params.get('ep') || '1', 10);
  const s = parseInt(params.get('s') || '1', 10);
  if (!id) return showError('No media ID specified.');

  try {
    const res = await fetch('/catalogue.json');
    const cat = await res.json();
    currentMedia = cat.find(i => i.id === id);
    if (!currentMedia) return showError('Title not found.');
    document.getElementById('nowPlayingTitle').innerText = currentMedia.title;

    if (currentMedia.type === 'series') {
      setupSeriesUI(s, ep);
      const targetEp = currentMedia.seasons.find(x => x.seasonNumber === s)?.episodes.find(e => e.episodeNumber === ep);
      if (targetEp) loadSource(targetEp.sourceType, targetEp.streamUrl, targetEp.introStart, targetEp.introEnd, id);
    } else {
      loadSource(currentMedia.sourceType, currentMedia.streamUrl, currentMedia.introStart, currentMedia.introEnd, id);
    }
  } catch (e) { showError('Player failure: ' + e.message); }
});

function loadSource(type, url, start = 0, end = 0, mediaId) {
  const v = document.getElementById('custom-video');
  const f = document.getElementById('iframe-player');
  const btn = document.getElementById('skipIntroBtn');
  intro = { start, end }; btn.style.display = 'none';

  if (currentHls) { currentHls.destroy(); currentHls = null; }

  if (type === 'youtube') {
    v.style.display = 'none'; f.style.display = 'block'; f.src = url; return;
  }

  f.style.display = 'none'; v.style.display = 'block';

  if (type === 'hls') {
    if (Hls.isSupported()) {
      currentHls = new Hls(); currentHls.loadSource(url); currentHls.attachMedia(v);
    } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
      v.src = url;
    }
  } else { v.src = url; }

  const hist = JSON.parse(localStorage.getItem('sh_history') || '{}');
  if (hist[mediaId]?.time) v.currentTime = hist[mediaId].time;

  v.ontimeupdate = () => {
    if (intro.end > 0 && v.currentTime >= intro.start && v.currentTime < intro.end) btn.style.display = 'block';
    else btn.style.display = 'none';
    if (v.duration > 0) {
      hist[mediaId] = { time: v.currentTime, percent: Math.round((v.currentTime / v.duration) * 100) };
      localStorage.setItem('sh_history', JSON.stringify(hist));
    }
  };
  v.play().catch(() => {});
}

function skipIntro() {
  const v = document.getElementById('custom-video');
  if (intro.end > 0) { v.currentTime = intro.end; document.getElementById('skipIntroBtn').style.display = 'none'; }
}

function setupSeriesUI(sNum, epNum) {
  document.getElementById('seriesSidebar').style.display = 'block';
  document.getElementById('mediaTitle').innerText = currentMedia.title;
  document.getElementById('mediaDesc').innerText = currentMedia.synopsis;
  const sel = document.getElementById('seasonSelector');
  sel.innerHTML = '';
  currentMedia.seasons.forEach(s => {
    const o = document.createElement('option'); o.value = s.seasonNumber; o.innerText = 'Season ' + s.seasonNumber;
    if (s.seasonNumber === sNum) o.selected = true; sel.appendChild(o);
  });
  renderEpisodes(sNum, epNum);
}

function renderEpisodes(sNum, epNum) {
  const s = currentMedia.seasons.find(x => x.seasonNumber === sNum);
  const l = document.getElementById('episodesList'); l.innerHTML = '';
  if (!s) return;
  s.episodes.forEach(ep => {
    const d = document.createElement('div');
    d.className = 'episode-card ' + (ep.episodeNumber === epNum ? 'active' : '');
    d.onclick = () => { window.location.search = '?id=' + currentMedia.id + '&s=' + sNum + '&ep=' + ep.episodeNumber; };
    d.innerHTML = '<img src="' + ep.thumbnail + '" class="ep-thumbnail"><div class="ep-details"><div class="ep-title">' + ep.title + '</div><div class="ep-desc">' + ep.synopsis + '</div></div>';
    l.appendChild(d);
  });
}

function changeSeason() {
  const s = parseInt(document.getElementById('seasonSelector').value, 10);
  window.location.search = '?id=' + currentMedia.id + '&s=' + s + '&ep=1';
}

function showError(msg) {
  document.getElementById('playerError').style.display = 'flex';
  document.getElementById('playerErrorMessage').innerText = msg;
}
