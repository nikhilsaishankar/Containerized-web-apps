// =============================================
// TournamentX — Main App Logic
// =============================================

const SPORT_ICONS = {
  Football: '⚽', Basketball: '🏀', Cricket: '🏏',
  Tennis: '🎾', Volleyball: '🏐', Hockey: '🏑'
};

let state = { tournaments: [], currentPage: 'dashboard', activeModal: null };

// ---- API ----
const api = {
  get: (url) => fetch(url).then(r => r.json()),
  post: (url, data) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  put: (url, data) => fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  del: (url) => fetch(url, { method: 'DELETE' }).then(r => r.json())
};

// ---- NAVIGATION ----
function navigate(page) {
  state.currentPage = page;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === `page-${page}`));

  const titles = { dashboard: ['Dashboard', 'Overview of all tournaments'], tournaments: ['Tournaments', 'Manage your tournaments'], matches: ['Matches', 'All scheduled & completed matches'], standings: ['Standings', 'Team rankings & points'] };
  document.getElementById('pageTitle').textContent = titles[page][0];
  document.getElementById('pageSub').textContent = titles[page][1];
  document.getElementById('addBtn').textContent = page === 'matches' ? '+ Add Match' : (page === 'tournaments' ? '+ New Tournament' : '+ New Tournament');

  renderPage(page);
}

// ---- RENDER PAGE ----
function renderPage(page) {
  if (page === 'dashboard') renderDashboard();
  else if (page === 'tournaments') renderTournaments();
  else if (page === 'matches') renderMatches();
  else if (page === 'standings') renderStandings();
}

// ---- DASHBOARD ----
function renderDashboard() {
  const ts = state.tournaments;
  const allMatches = ts.flatMap(t => t.matches.map(m => ({ ...m, tournamentName: t.name })));
  const completed = allMatches.filter(m => m.status === 'completed');
  const upcoming = allMatches.filter(m => m.status === 'upcoming');

  const statsConfig = [
    { label: 'Tournaments', value: ts.length, icon: '🏆', color: 'var(--accent)' },
    { label: 'Active', value: ts.filter(t => t.status === 'ongoing').length, icon: '⚡', color: 'var(--accent3)' },
    { label: 'Matches Played', value: completed.length, icon: '✅', color: 'var(--accent2)' },
    { label: 'Upcoming', value: upcoming.length, icon: '📅', color: '#a78bfa' }
  ];

  document.getElementById('statsRow').innerHTML = statsConfig.map(s => `
    <div class="stat-card" style="--accent-color:${s.color}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-icon">${s.icon}</div>
    </div>`).join('');

  const active = ts.filter(t => t.status !== 'completed');
  document.getElementById('activeTournamentsList').innerHTML = active.length ? active.map(t => `
    <div class="match-item" onclick="navigate('tournaments')">
      <div>
        <div style="font-weight:600;font-size:14px">${t.name}</div>
        <div style="font-size:12px;color:var(--text3);margin-top:3px">${SPORT_ICONS[t.sport] || '🏅'} ${t.sport} · ${t.teams.length} teams</div>
      </div>
      <span class="t-status status-${t.status}">${t.status}</span>
    </div>`).join('')
    : '<div class="empty-state"><div class="empty-icon">🏆</div><p>No active tournaments</p></div>';

  const recent = completed.slice(-5).reverse();
  document.getElementById('recentMatchesList').innerHTML = recent.length ? recent.map(m => `
    <div class="match-item">
      <div class="match-teams">
        <span class="match-team">${m.team1}</span>
        <div class="match-score">
          <span class="score-num">${m.score1}</span>
          <span class="score-sep">–</span>
          <span class="score-num">${m.score2}</span>
        </div>
        <span class="match-team right">${m.team2}</span>
      </div>
      <span style="font-size:11px;color:var(--text3);margin-left:12px">${m.tournamentName}</span>
    </div>`).join('')
    : '<div class="empty-state"><div class="empty-icon">⚽</div><p>No completed matches</p></div>';
}

// ---- TOURNAMENTS ----
function renderTournaments() {
  const ts = state.tournaments;
  document.getElementById('tournamentCards').innerHTML = ts.length ? ts.map(t => `
    <div class="t-card">
      <div class="t-card-header">
        <div class="t-sport-badge">${SPORT_ICONS[t.sport] || '🏅'} ${t.sport}</div>
        <div class="t-name">${t.name}</div>
        <span class="t-status status-${t.status}">${t.status}</span>
      </div>
      <div class="t-card-body">
        <div class="t-teams">${t.teams.map(team => `<span class="team-chip">${team}</span>`).join('')}</div>
        <div class="t-meta">
          <span>🎯 ${t.matches.length} matches</span>
          <span>✅ ${t.matches.filter(m => m.status === 'completed').length} completed</span>
        </div>
      </div>
      <div class="t-card-actions">
        <button class="btn-sm btn-add-match" onclick="openAddMatchModal(${t.id})">+ Add Match</button>
        <button class="btn-sm btn-del" onclick="deleteTournament(${t.id})">Delete</button>
      </div>
    </div>`).join('')
    : '<div class="empty-state"><div class="empty-icon">🏆</div><p>No tournaments yet. Create one!</p></div>';
}

// ---- MATCHES ----
function renderMatches() {
  populateMatchFilters();
  const tFilter = document.getElementById('matchTournamentFilter').value;
  const sFilter = document.getElementById('matchStatusFilter').value;

  let filtered = state.tournaments;
  if (tFilter) filtered = filtered.filter(t => t.id === parseInt(tFilter));

  const html = filtered.map(t => {
    let matches = t.matches;
    if (sFilter) matches = matches.filter(m => m.status === sFilter);
    if (!matches.length) return '';
    return `
      <div class="matches-card">
        <div class="matches-card-header">
          ${SPORT_ICONS[t.sport] || '🏅'} ${t.name}
          <span class="t-status status-${t.status}" style="margin-left:auto">${t.status}</span>
        </div>
        ${matches.map(m => `
          <div class="match-item">
            <div class="match-teams">
              <span class="match-team">${m.team1}</span>
              <div class="match-score">
                <span class="score-num">${m.score1}</span>
                <span class="score-sep">–</span>
                <span class="score-num">${m.score2}</span>
              </div>
              <span class="match-team right">${m.team2}</span>
            </div>
            <span class="match-date">${m.date}</span>
            <span class="t-status status-${m.status}" style="margin-right:10px">${m.status}</span>
            <div class="match-actions">
              ${m.status !== 'completed' ? `<button class="btn-sm btn-score" onclick="openScoreModal(${t.id},${m.id},'${m.team1}','${m.team2}',${m.score1},${m.score2})">Update Score</button>` : ''}
            </div>
          </div>`).join('')}
      </div>`;
  }).join('');

  document.getElementById('matchesList').innerHTML = html || '<div class="empty-state"><div class="empty-icon">⚽</div><p>No matches found</p></div>';
}

function populateMatchFilters() {
  const sel = document.getElementById('matchTournamentFilter');
  const existing = Array.from(sel.options).map(o => o.value);
  state.tournaments.forEach(t => {
    if (!existing.includes(String(t.id))) {
      const opt = document.createElement('option');
      opt.value = t.id; opt.textContent = t.name;
      sel.appendChild(opt);
    }
  });
}

// ---- STANDINGS ----
function renderStandings() {
  const sel = document.getElementById('standingsTournamentFilter');
  // Repopulate
  sel.innerHTML = '<option value="">Select Tournament</option>';
  state.tournaments.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id; opt.textContent = t.name;
    sel.appendChild(opt);
  });

  const tid = sel.value ? parseInt(sel.value) : (state.tournaments[0]?.id);
  if (tid) { sel.value = tid; computeStandings(tid); }
}

function computeStandings(tid) {
  const t = state.tournaments.find(t => t.id === parseInt(tid));
  if (!t) return;

  const pts = {};
  t.teams.forEach(team => pts[team] = { team, played: 0, won: 0, drawn: 0, lost: 0, pts: 0 });

  t.matches.filter(m => m.status === 'completed').forEach(m => {
    if (!pts[m.team1]) pts[m.team1] = { team: m.team1, played: 0, won: 0, drawn: 0, lost: 0, pts: 0 };
    if (!pts[m.team2]) pts[m.team2] = { team: m.team2, played: 0, won: 0, drawn: 0, lost: 0, pts: 0 };
    pts[m.team1].played++; pts[m.team2].played++;
    if (m.score1 > m.score2) { pts[m.team1].won++; pts[m.team1].pts += 3; pts[m.team2].lost++; }
    else if (m.score1 < m.score2) { pts[m.team2].won++; pts[m.team2].pts += 3; pts[m.team1].lost++; }
    else { pts[m.team1].drawn++; pts[m.team1].pts++; pts[m.team2].drawn++; pts[m.team2].pts++; }
  });

  const rows = Object.values(pts).sort((a, b) => b.pts - a.pts);

  document.getElementById('standingsTable').innerHTML = `
    <div class="standings-table">
      <div class="standings-header">
        <div>#</div><div>Team</div><div>P</div><div>W</div><div>D</div><div>L</div><div>Pts</div>
      </div>
      ${rows.map((r, i) => `
        <div class="standings-row">
          <div class="standings-pos ${i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : ''}">${i + 1}</div>
          <div class="standings-team">${r.team}</div>
          <div>${r.played}</div><div>${r.won}</div><div>${r.drawn}</div><div>${r.lost}</div>
          <div class="standings-pts">${r.pts}</div>
        </div>`).join('')}
    </div>`;
}

// ---- MODALS ----
function openModal(id) {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function openAddMatchModal(tid) {
  const t = state.tournaments.find(t => t.id === tid);
  document.getElementById('matchTournamentId').value = tid;
  const t1 = document.getElementById('matchTeam1');
  const t2 = document.getElementById('matchTeam2');
  t1.innerHTML = t.teams.map(t => `<option>${t}</option>`).join('');
  t2.innerHTML = t.teams.map(t => `<option>${t}</option>`).join('');
  document.getElementById('matchDate').value = new Date().toISOString().split('T')[0];
  openModal('addMatchModal');
}

function openScoreModal(tid, mid, t1, t2, s1, s2) {
  document.getElementById('scoreTournamentId').value = tid;
  document.getElementById('scoreMatchId').value = mid;
  document.getElementById('scoreLabel1').textContent = t1;
  document.getElementById('scoreLabel2').textContent = t2;
  document.getElementById('score1').value = s1;
  document.getElementById('score2').value = s2;
  openModal('updateScoreModal');
}

// ---- ACTIONS ----
async function loadTournaments() {
  state.tournaments = await api.get('/api/tournaments');
  renderPage(state.currentPage);
}

async function createTournament() {
  const name = document.getElementById('tName').value.trim();
  const sport = document.getElementById('tSport').value;
  const teamsRaw = document.getElementById('tTeams').value;
  if (!name) return alert('Please enter a tournament name');
  const teams = teamsRaw ? teamsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  await api.post('/api/tournaments', { name, sport, teams });
  closeModal();
  document.getElementById('tName').value = '';
  document.getElementById('tTeams').value = '';
  await loadTournaments();
}

async function deleteTournament(id) {
  if (!confirm('Delete this tournament?')) return;
  await api.del(`/api/tournaments/${id}`);
  await loadTournaments();
}

async function addMatch() {
  const tid = document.getElementById('matchTournamentId').value;
  const team1 = document.getElementById('matchTeam1').value;
  const team2 = document.getElementById('matchTeam2').value;
  const date = document.getElementById('matchDate').value;
  if (team1 === team2) return alert('Teams must be different');
  await api.post(`/api/tournaments/${tid}/matches`, { team1, team2, date });
  closeModal();
  await loadTournaments();
}

async function updateScore() {
  const tid = document.getElementById('scoreTournamentId').value;
  const mid = document.getElementById('scoreMatchId').value;
  const score1 = parseInt(document.getElementById('score1').value) || 0;
  const score2 = parseInt(document.getElementById('score2').value) || 0;
  await api.put(`/api/tournaments/${tid}/matches/${mid}`, { score1, score2, status: 'completed' });
  closeModal();
  await loadTournaments();
}

// ---- EVENTS ----
document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.page)));

document.getElementById('addBtn').addEventListener('click', () => {
  if (state.currentPage === 'matches') {
    if (state.tournaments.length === 0) return alert('Create a tournament first!');
    openAddMatchModal(state.tournaments[0].id);
  } else {
    openModal('addTournamentModal');
  }
});

['closeAddModal', 'cancelAddModal', 'closeMatchModal', 'cancelMatchModal', 'closeScoreModal', 'cancelScoreModal'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', closeModal);
});

document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

document.getElementById('saveTournament').addEventListener('click', createTournament);
document.getElementById('saveMatch').addEventListener('click', addMatch);
document.getElementById('saveScore').addEventListener('click', updateScore);

document.getElementById('matchTournamentFilter').addEventListener('change', renderMatches);
document.getElementById('matchStatusFilter').addEventListener('change', renderMatches);
document.getElementById('standingsTournamentFilter').addEventListener('change', (e) => computeStandings(e.target.value));

// ---- INIT ----
loadTournaments();
