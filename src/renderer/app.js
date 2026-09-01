const trends = [
  { topic: '#koaslife', title: 'Kehidupan koas & jaga malam', category: 'Medical', platform: 'TikTok', score: 94, growth: 184, engagement: 91, status: 'Rising', audience: 'Medical students', tags: ['koas', 'jaga malam', 'dokter muda'] },
  { topic: 'burnout nakes', title: 'Burnout tenaga kesehatan', category: 'Health', platform: 'Instagram', score: 91, growth: 126, engagement: 88, status: 'Hot', audience: 'Health workers', tags: ['burnout', 'nakes', 'mental health'] },
  { topic: '#anakperawat', title: 'POV anak keperawatan', category: 'Nursing', platform: 'TikTok', score: 89, growth: 113, engagement: 93, status: 'Rising', audience: 'Nursing students', tags: ['perawat', 'mahasiswa', 'POV'] },
  { topic: 'AI untuk belajar medis', title: 'AI sebagai study buddy kesehatan', category: 'Health Education', platform: 'YouTube', score: 86, growth: 98, engagement: 84, status: 'Rising', audience: 'Health students', tags: ['AI', 'study', 'medical education'] },
  { topic: '#farmasistudent', title: 'Realita praktikum farmasi', category: 'Pharmacy', platform: 'TikTok', score: 83, growth: 82, engagement: 89, status: 'Warm', audience: 'Pharmacy students', tags: ['farmasi', 'praktikum', 'kampus'] },
  { topic: 'sleep debt mahasiswa', title: 'Kurang tidur dan performa belajar', category: 'Health', platform: 'Instagram', score: 79, growth: 67, engagement: 81, status: 'Warm', audience: 'College students', tags: ['tidur', 'belajar', 'kesehatan'] },
  { topic: '#doktergigi', title: 'Behind the scenes mahasiswa kedokteran gigi', category: 'Medical', platform: 'TikTok', score: 76, growth: 54, engagement: 86, status: 'Warm', audience: 'Dental students', tags: ['dentistry', 'student life'] },
  { topic: 'microlearning kesehatan', title: 'Belajar anatomi 60 detik', category: 'Health Education', platform: 'YouTube', score: 72, growth: 41, engagement: 78, status: 'Steady', audience: 'Health students', tags: ['anatomi', 'microlearning'] }
];

const state = { query: '', platform: 'All', category: 'All', sort: 'score', view: 'dashboard', saved: new Set() };
const $ = (id) => document.getElementById(id);

function filteredTrends() {
  let list = trends.filter(t => {
    const text = [t.topic, t.title, t.category, t.audience, ...t.tags].join(' ').toLowerCase();
    return (!state.query || text.includes(state.query)) && (state.platform === 'All' || t.platform === state.platform) && (state.category === 'All' || t.category === state.category);
  });
  if (state.view === 'saved') list = list.filter(t => state.saved.has(t.topic));
  return list.sort((a, b) => b[state.sort] - a[state.sort]);
}

function render() {
  const rows = filteredTrends();
  $('trendTable').innerHTML = rows.length ? rows.map((t, i) => `
    <article class="trend-row">
      <div class="rank">${String(i + 1).padStart(2, '0')}</div>
      <div class="trend-main"><div class="topic">${t.topic}</div><strong>${t.title}</strong><div class="tags">${t.tags.slice(0,2).map(x => `<span>${x}</span>`).join('')}</div></div>
      <div class="platform"><span>${t.platform}</span><small>${t.category}</small></div>
      <div class="growth"><strong>+${t.growth}%</strong><small>growth</small></div>
      <div class="score"><strong>${t.score}</strong><small>score</small></div>
      <div class="trend-status ${t.status.toLowerCase()}"><i></i>${t.status}</div>
      <button class="save-btn ${state.saved.has(t.topic) ? 'saved' : ''}" data-save="${t.topic}" aria-label="Save trend">${state.saved.has(t.topic) ? '★' : '☆'}</button>
    </article>`).join('') : '<div class="empty">No signals match your filters.</div>';
  $('savedCount').textContent = state.saved.size;
  $('savedMetric').textContent = state.saved.size;
}

function setView(view) {
  state.view = view;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  if (view === 'saved') {
    $('pageTitle').textContent = 'Saved research'; $('headline').textContent = 'Your research shelf'; $('sectionTitle').textContent = 'Saved signals';
  } else if (view === 'discover') {
    $('pageTitle').textContent = 'Discover'; $('headline').textContent = 'Find the next conversation'; $('sectionTitle').textContent = 'Discover signals';
  } else {
    $('pageTitle').textContent = 'Overview'; $('headline').textContent = "What's moving in health?"; $('sectionTitle').textContent = 'Trending signals';
  }
  render();
}

document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => {
  if (btn.dataset.filter) { state.category = btn.dataset.filter; $('categoryFilter').value = state.category; setView('dashboard'); }
  else setView(btn.dataset.view);
}));
$('searchInput').addEventListener('input', e => { state.query = e.target.value.toLowerCase(); render(); });
$('platformFilter').addEventListener('change', e => { state.platform = e.target.value; render(); });
$('categoryFilter').addEventListener('change', e => { state.category = e.target.value; render(); });
$('sortFilter').addEventListener('change', e => { state.sort = e.target.value; render(); });
$('refreshBtn').addEventListener('click', () => { $('toast').textContent = 'Signals refreshed · local dataset updated'; $('toast').classList.add('show'); setTimeout(() => $('toast').classList.remove('show'), 2200); render(); });
$('trendTable').addEventListener('click', e => { const btn = e.target.closest('[data-save]'); if (!btn) return; const key = btn.dataset.save; state.saved.has(key) ? state.saved.delete(key) : state.saved.add(key); render(); });
render();
