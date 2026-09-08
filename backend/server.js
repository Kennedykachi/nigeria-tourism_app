const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// ---------- AUTH ROUTES ----------
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide name, email and password' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  db.run(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Email already registered' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordValid = bcrypt.compareSync(password, user.password_hash);
    if (!passwordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

// ---------- TOURIST SITES ROUTES ----------
app.get('/api/tourist-sites', (req, res) => {
  const { state, category, search } = req.query;
  let query = 'SELECT * FROM tourist_sites WHERE 1=1';
  const params = [];

  if (state) {
    query += ' AND state = ?';
    params.push(state);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/states', (req, res) => {
  db.all('SELECT DISTINCT state FROM tourist_sites ORDER BY state', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.state));
  });
});

app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM tourist_sites ORDER BY category', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.category));
  });
});

app.get('/api/tourist-sites/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tourist_sites WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Site not found' });
    res.json(row);
  });
});

app.get('/api/tourist-sites/:id/guides', (req, res) => {
  db.all('SELECT * FROM tour_guides WHERE site_id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/tourist-sites/:id/hotels', (req, res) => {
  db.all('SELECT * FROM hotels WHERE site_id = ? ORDER BY distance_km ASC', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/tourist-sites/:id/restaurants', (req, res) => {
  db.all('SELECT * FROM restaurants WHERE site_id = ? ORDER BY distance_km ASC', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});