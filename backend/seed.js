// seed.js
const db = require('./database');

// Sample Nigerian tourist sites
const touristSites = [
  {
    name: 'Olumo Rock',
    description: 'A massive outcrop of granite rocks in Abeokuta, Ogun State. It served as a fortress for the Egba people during wars.',
    state: 'Ogun',
    city: 'Abeokuta',
    latitude: 7.1667,
    longitude: 3.35,
    image_url: 'https://picsum.photos/seed/olumo/800/400',
    entry_fee: 1000,
    best_time_to_visit: 'November to March'
  },
  {
    name: 'Yankari National Park',
    description: 'A large wildlife park in Bauchi State with natural warm springs and diverse wildlife including elephants.',
    state: 'Bauchi',
    city: 'Bauchi',
    latitude: 9.75,
    longitude: 10.5,
    image_url: 'https://picsum.photos/seed/yankari/800/400',
    entry_fee: 2000,
    best_time_to_visit: 'December to April'
  },
  {
    name: 'Obudu Mountain Resort',
    description: 'A ranch and resort on the Obudu Plateau in Cross River State with cable cars and breathtaking views.',
    state: 'Cross River',
    city: 'Obudu',
    latitude: 6.5,
    longitude: 9.25,
    image_url: 'https://picsum.photos/seed/obudu/800/400',
    entry_fee: 3000,
    best_time_to_visit: 'October to February'
  },
  {
    name: 'Lekki Conservation Centre',
    description: 'A nature reserve in Lagos with a canopy walkway, wetlands, and diverse flora and fauna.',
    state: 'Lagos',
    city: 'Lekki',
    latitude: 6.4333,
    longitude: 3.5333,
    image_url: 'https://picsum.photos/seed/lekki/800/400',
    entry_fee: 1500,
    best_time_to_visit: 'November to February'
  },
  {
    name: 'Zuma Rock',
    description: 'A large monolith located in Niger State, often called the gateway to Abuja. It is a significant natural landmark.',
    state: 'Niger',
    city: 'Suleja',
    latitude: 9.0833,
    longitude: 7.1667,
    image_url: 'https://picsum.photos/seed/zuma/800/400',
    entry_fee: 500,
    best_time_to_visit: 'Year round'
  }
];

// Insert tourist sites
db.serialize(() => {
  // Clear existing data first (optional)
  db.run('DELETE FROM tourist_sites');
  db.run('DELETE FROM tour_guides');
  db.run('DELETE FROM hotels');
  db.run('DELETE FROM restaurants');

  const insertSite = db.prepare(`
    INSERT INTO tourist_sites 
    (name, description, state, city, latitude, longitude, image_url, entry_fee, best_time_to_visit) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  touristSites.forEach(site => {
    insertSite.run(
      site.name,
      site.description,
      site.state,
      site.city,
      site.latitude,
      site.longitude,
      site.image_url,
      site.entry_fee,
      site.best_time_to_visit,
      function(err) {
        if (err) console.error('Error inserting site:', err);
        else console.log(`Inserted site: ${site.name} (id: ${this.lastID})`);
      }
    );
  });
  insertSite.finalize();

  // Add some tour guides, hotels, restaurants (linked to site IDs)
  // We'll assume site IDs 1-5 in order inserted
  const tourGuides = [
    { site_id: 1, name: 'Adebayo Johnson', price_per_hour: 5000, rating: 4.8, contact_info: '08012345678' },
    { site_id: 1, name: 'Bola Cole', price_per_hour: 4500, rating: 4.5, contact_info: '08098765432' },
    { site_id: 2, name: 'Chioma Okafor', price_per_hour: 6000, rating: 4.7, contact_info: '08123456789' },
    { site_id: 3, name: 'Emeka Nwosu', price_per_hour: 5500, rating: 4.6, contact_info: '09011223344' },
    { site_id: 4, name: 'Funke Adeyemi', price_per_hour: 4000, rating: 4.4, contact_info: '08055667788' }
  ];

  const insertGuide = db.prepare(`
    INSERT INTO tour_guides (site_id, name, price_per_hour, rating, contact_info) 
    VALUES (?, ?, ?, ?, ?)
  `);

  tourGuides.forEach(guide => {
    insertGuide.run(
      guide.site_id,
      guide.name,
      guide.price_per_hour,
      guide.rating,
      guide.contact_info,
      function(err) {
        if (err) console.error('Error inserting guide:', err);
        else console.log(`Inserted guide: ${guide.name}`);
      }
    );
  });
  insertGuide.finalize();

  const hotels = [
    { site_id: 1, name: 'Olumo Rock Hotel', price_range: '₦15,000 - ₦35,000', rating: 4.2, distance_km: 1.5, contact_info: '08011112222' },
    { site_id: 2, name: 'Yankari Safari Lodge', price_range: '₦20,000 - ₦50,000', rating: 4.0, distance_km: 0.5, contact_info: '08033334444' },
    { site_id: 3, name: 'Obudu Mountain Hotel', price_range: '₦25,000 - ₦60,000', rating: 4.5, distance_km: 0.2, contact_info: '08055556666' },
    { site_id: 4, name: 'Lekki Suites', price_range: '₦10,000 - ₦30,000', rating: 4.3, distance_km: 2.0, contact_info: '08077778888' }
  ];

  const insertHotel = db.prepare(`
    INSERT INTO hotels (site_id, name, price_range, rating, distance_km, contact_info) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  hotels.forEach(hotel => {
    insertHotel.run(
      hotel.site_id,
      hotel.name,
      hotel.price_range,
      hotel.rating,
      hotel.distance_km,
      hotel.contact_info,
      function(err) {
        if (err) console.error('Error inserting hotel:', err);
        else console.log(`Inserted hotel: ${hotel.name}`);
      }
    );
  });
  insertHotel.finalize();

  const restaurants = [
    { site_id: 1, name: 'Abeokuta Kitchen', cuisine_type: 'Nigerian, Continental', price_range: '₦2,000 - ₦8,000', rating: 4.1, distance_km: 1.2, contact_info: '08099990000' },
    { site_id: 2, name: 'Safari Grill', cuisine_type: 'African, Grills', price_range: '₦3,000 - ₦10,000', rating: 4.0, distance_km: 0.8, contact_info: '08088887777' },
    { site_id: 3, name: 'Mountain View Restaurant', cuisine_type: 'Continental, Nigerian', price_range: '₦4,000 - ₦12,000', rating: 4.4, distance_km: 0.3, contact_info: '08066665555' },
    { site_id: 4, name: 'Lekki Garden Restaurant', cuisine_type: 'Nigerian, Asian, Continental', price_range: '₦3,000 - ₦12,000', rating: 4.3, distance_km: 1.5, contact_info: '08044443333' }
  ];

  const insertRestaurant = db.prepare(`
    INSERT INTO restaurants (site_id, name, cuisine_type, price_range, rating, distance_km, contact_info) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  restaurants.forEach(rest => {
    insertRestaurant.run(
      rest.site_id,
      rest.name,
      rest.cuisine_type,
      rest.price_range,
      rest.rating,
      rest.distance_km,
      rest.contact_info,
      function(err) {
        if (err) console.error('Error inserting restaurant:', err);
        else console.log(`Inserted restaurant: ${rest.name}`);
      }
    );
  });
  insertRestaurant.finalize();

  console.log('Database seeding complete!');
  db.close();
});