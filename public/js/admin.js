let adminCat = [];
function verifyAuth() {
  if (document.getElementById('adminKeyInput').value === 'admin2026') {
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    fetch('/catalogue.json').then(r => r.json()).then(d => { adminCat = d; renderAdmin(); });
  } else alert('Unauthorized');
}

function renderAdmin() {
  const list = document.getElementById('adminItemList'); list.innerHTML = '';
  adminCat.forEach((m, idx) => {
    const div = document.createElement('div');
    div.style.cssText = 'background:#18181c; padding:10px; border-radius:4px; display:flex; justify-content:space-between; border:1px solid #333;';
    div.innerHTML = '<span>' + m.title + ' (' + m.year + ') - ' + m.industry + '</span><button class="btn btn-secondary" onclick="delItem(' + idx + ')">Delete</button>';
    list.appendChild(div);
  });
}

function addMediaItem() {
  const id = document.getElementById('m_id').value.trim();
  const title = document.getElementById('m_title').value.trim();
  const streamUrl = document.getElementById('m_streamUrl').value.trim();
  if (!id || !title || !streamUrl) return alert('ID, Title and Stream URL required');
  adminCat.push({
    id, title, type: document.getElementById('m_type').value,
    industry: document.getElementById('m_industry').value,
    year: parseInt(document.getElementById('m_year').value, 10),
    rating: '16+', duration: '120m', genres: ['Drama'],
    synopsis: document.getElementById('m_synopsis').value,
    poster: document.getElementById('m_poster').value || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
    backdrop: document.getElementById('m_poster').value || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80',
    cast: document.getElementById('m_cast').value.split(',').map(s=>s.trim()).filter(Boolean),
    isFeatured: false, sourceType: document.getElementById('m_sourceType').value,
    streamUrl, subtitles: [], introStart: 0, introEnd: 0
  });
  renderAdmin();
  alert('Added. Click "Export catalogue.json" to save.');
}

function delItem(i) { adminCat.splice(i, 1); renderAdmin(); }

function exportCatalogueJSON() {
  const a = document.createElement('a');
  a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(adminCat, null, 2));
  a.download = 'catalogue.json';
  document.body.appendChild(a); a.click(); a.remove();
}
