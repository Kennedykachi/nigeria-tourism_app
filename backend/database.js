const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to database file
const db = new sqlite3.Database(
  path.join(__dirname, 'tourism.db'),
  (err) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to SQLite database');
      createTables();
    }
  }
);

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS tourist_sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      state TEXT,
      city TEXT,
      latitude REAL,
      longitude REAL,
      image_url TEXT,
      entry_fee INTEGER DEFAULT 0,
      best_time_to_visit TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tour_guides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER,
      name TEXT NOT NULL,
      price_per_hour INTEGER,
      rating REAL,
      contact_info TEXT,
      FOREIGN KEY (site_id) REFERENCES tourist_sites(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER,
      name TEXT NOT NULL,
      price_range TEXT,
      rating REAL,
      distance_km REAL,
      contact_info TEXT,
      FOREIGN KEY (site_id) REFERENCES tourist_sites(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER,
      name TEXT NOT NULL,
      cuisine_type TEXT,
      price_range TEXT,
      rating REAL,
      distance_km REAL,
      contact_info TEXT,
      FOREIGN KEY (site_id) REFERENCES tourist_sites(id)
    )
  `);

  console.log('Tables created successfully');
}

module.exports = db;