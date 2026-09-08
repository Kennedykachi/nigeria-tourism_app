const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Nigeria Tourism API is running!' });
});

// Get all tourist sites
app.get('/api/tourist-sites', (req, res) => {
  db.all('SELECT * FROM tourist_sites', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single tourist site
app.get('/api/tourist-sites/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tourist_sites WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Site not found' });
      return;
    }
    res.json(row);
  });
});

// Get tour guides for a site
app.get('/api/tourist-sites/:id/guides', (req, res) => {
  const { id } = req.params;
  db.all(
    'SELECT * FROM tour_guides WHERE site_id = ?',
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get hotels near a site
app.get('/api/tourist-sites/:id/hotels', (req, res) => {
  const { id } = req.params;
  db.all(
    'SELECT * FROM hotels WHERE site_id = ? ORDER BY distance_km ASC',
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get restaurants near a site
app.get('/api/tourist-sites/:id/restaurants', (req, res) => {
  const { id } = req.params;
  db.all(
    'SELECT * FROM restaurants WHERE site_id = ? ORDER BY distance_km ASC',
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});