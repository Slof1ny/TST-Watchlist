const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8585;

// Ensure data directory exists
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const WATCHLISTS_FILE = path.join(DATA_DIR, 'watchlists.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
  if (!fs.existsSync(WATCHLISTS_FILE)) fs.writeFileSync(WATCHLISTS_FILE, '[]');
}
ensureDataFiles();

// CORS (not strictly needed if same origin, but harmless)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json());

// Serve the single HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Simple healthcheck
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Users endpoints
app.post('/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    const name = (req.body && req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const user = { id: Date.now().toString(), name };
    users.push(user);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/users', (_req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Failed to read users' });
  }
});

// Watchlist endpoints
app.post('/watchlist', (req, res) => {
  try {
    const lists = JSON.parse(fs.readFileSync(WATCHLISTS_FILE, 'utf-8'));
    const { userId, movieId } = req.body || {};
    if (!userId || !movieId) return res.status(400).json({ error: 'userId and movieId required' });
    lists.push({ userId, movieId });
    fs.writeFileSync(WATCHLISTS_FILE, JSON.stringify(lists, null, 2));
    res.json({ status: 'added' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update watchlist' });
  }
});

app.get('/watchlist/:userId', (req, res) => {
  try {
    const lists = JSON.parse(fs.readFileSync(WATCHLISTS_FILE, 'utf-8'));
    res.json(lists.filter(l => l.userId === req.params.userId));
  } catch (e) {
    res.status(500).json({ error: 'Failed to read watchlist' });
  }
});

// Integration endpoint combining with movie service
const MOVIE_SERVICE = process.env.MOVIE_SERVICE || 'https://joan.tugastst.my.id';
app.get('/watchlist/:userId/full', async (req, res) => {
  try {
    const lists = JSON.parse(fs.readFileSync(WATCHLISTS_FILE, 'utf-8'))
      .filter(l => l.userId === req.params.userId);
    if (lists.length === 0) return res.json([]);

    const movieResponse = await axios.get(`${MOVIE_SERVICE}/movies`, { timeout: 5000 });
    const movies = (movieResponse.data && Array.isArray(movieResponse.data.data)) ? movieResponse.data.data : [];

    const detailed = lists.map(l => ({
      userId: l.userId,
      movieId: l.movieId,
      movie: movies.find(m => m.id === Number(l.movieId)) || null,
    }));
    res.json(detailed);
  } catch (err) {
    res.status(502).json({ error: 'Movie service unreachable', detail: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Watchlist service + frontend running on port ${PORT}`);
});
