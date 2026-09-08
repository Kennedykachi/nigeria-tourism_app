const sqlite3 = require('sqlite3').verbose();
const path = require('path');

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
  // Tourist Sites table
  db.run(`
    CREATE TABLE IF NOT EXISTS tourist_sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      unique_features TEXT,
      state TEXT,
      city TEXT,
      latitude REAL,
      longitude REAL,
      category TEXT,
      image_url TEXT,
      entry_fee INTEGER DEFAULT 0,
      distance_from_city_center_km REAL,
      transportation_options TEXT,
      map_url TEXT,
      best_time_to_visit TEXT
    )
  `);

  // Tour Guides table
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

  // Hotels table
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

  // Restaurants table
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

  // Users table (for authentication)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Tables created successfully');
}

module.exports = db;