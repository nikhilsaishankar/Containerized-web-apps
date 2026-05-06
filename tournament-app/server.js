const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());

// Production security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

let tournaments = [
  {
    id: 1, name: "Premier League 2025", sport: "Football", status: "ongoing",
    teams: ["Manchester City", "Arsenal", "Liverpool", "Chelsea"],
    matches: [
      { id: 1, team1: "Manchester City", team2: "Arsenal", score1: 3, score2: 1, date: "2025-04-10", status: "completed" },
      { id: 2, team1: "Liverpool", team2: "Chelsea", score1: 2, score2: 2, date: "2025-04-12", status: "completed" },
      { id: 3, team1: "Manchester City", team2: "Liverpool", score1: 0, score2: 0, date: "2025-05-20", status: "upcoming" }
    ]
  },
  {
    id: 2, name: "NBA Finals 2025", sport: "Basketball", status: "upcoming",
    teams: ["Lakers", "Celtics", "Warriors", "Heat"],
    matches: [
      { id: 4, team1: "Lakers", team2: "Celtics", score1: 0, score2: 0, date: "2025-06-01", status: "upcoming" },
      { id: 5, team1: "Warriors", team2: "Heat", score1: 0, score2: 0, date: "2025-06-03", status: "upcoming" }
    ]
  }
];
let nextTournamentId = 3;
let nextMatchId = 6;

app.get('/api/tournaments', (req, res) => res.json(tournaments));

app.post('/api/tournaments', (req, res) => {
  const { name, sport, teams } = req.body;
  const tournament = { id: nextTournamentId++, name, sport, status: 'upcoming', teams: teams || [], matches: [] };
  tournaments.push(tournament);
  res.json(tournament);
});

app.delete('/api/tournaments/:id', (req, res) => {
  tournaments = tournaments.filter(t => t.id !== parseInt(req.params.id));
  res.json({ success: true });
});

app.get('/api/tournaments/:id', (req, res) => {
  const t = tournaments.find(t => t.id === parseInt(req.params.id));
  t ? res.json(t) : res.status(404).json({ error: 'Not found' });
});

app.post('/api/tournaments/:id/matches', (req, res) => {
  const t = tournaments.find(t => t.id === parseInt(req.params.id));
  if (!t) return res.status(404).json({ error: 'Not found' });
  const match = { id: nextMatchId++, ...req.body, status: 'upcoming', score1: 0, score2: 0 };
  t.matches.push(match);
  res.json(match);
});

app.put('/api/tournaments/:tid/matches/:mid', (req, res) => {
  const t = tournaments.find(t => t.id === parseInt(req.params.tid));
  if (!t) return res.status(404).json({ error: 'Not found' });
  const idx = t.matches.findIndex(m => m.id === parseInt(req.params.mid));
  if (idx === -1) return res.status(404).json({ error: 'Match not found' });
  t.matches[idx] = { ...t.matches[idx], ...req.body };
  const allDone = t.matches.length > 0 && t.matches.every(m => m.status === 'completed');
  const anyOngoing = t.matches.some(m => m.status === 'completed');
  if (allDone) t.status = 'completed';
  else if (anyOngoing) t.status = 'ongoing';
  res.json(t.matches[idx]);
});

app.put('/api/tournaments/:id/status', (req, res) => {
  const t = tournaments.find(t => t.id === parseInt(req.params.id));
  if (!t) return res.status(404).json({ error: 'Not found' });
  t.status = req.body.status;
  res.json(t);
});

// SPA fallback — single wildcard, no duplicate
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, HOST, () => {
  console.log(`🏆 Tournament App running at http://localhost:${PORT}`);
  console.log(`🌐 Accessible on network: http://<YOUR_IP>:${PORT}`);
});
