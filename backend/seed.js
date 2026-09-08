const db = require('./database');
const bcrypt = require('bcryptjs');

// Clear existing data
db.serialize(() => {
  // Delete in order to respect foreign keys (though we don't enforce them)
  db.run('DELETE FROM tour_guides');
  db.run('DELETE FROM hotels');
  db.run('DELETE FROM restaurants');
  db.run('DELETE FROM tourist_sites');
  db.run('DELETE FROM users');

  // Insert tourist sites with all new fields
  const touristSites = [
    {
      name: 'Olumo Rock',
      description: 'A massive outcrop of granite rocks in Abeokuta, Ogun State. It served as a fortress for the Egba people during wars.',
      unique_features: 'Ancient caves, carvings, panoramic view of Abeokuta, elevator to the top.',
      state: 'Ogun',
      city: 'Abeokuta',
      latitude: 7.1667,
      longitude: 3.35,
      category: 'mountains-rocks',
      image_url: 'https://picsum.photos/seed/olumo/800/400',
      entry_fee: 1000,
      distance_from_city_center_km: 2.5,
      transportation_options: 'Taxi, Keke Napep, Motorcycle (Okada)',
      map_url: 'https://goo.gl/maps/example1',
      best_time_to_visit: 'November to March'
    },
    {
      name: 'Yankari National Park',
      description: 'A large wildlife park in Bauchi State with natural warm springs and diverse wildlife including elephants.',
      unique_features: 'Wikki Warm Springs, safari drives, elephants, baboons, waterbucks.',
      state: 'Bauchi',
      city: 'Bauchi',
      latitude: 9.75,
      longitude: 10.5,
      category: 'woodlands',
      image_url: 'https://picsum.photos/seed/yankari/800/400',
      entry_fee: 2000,
      distance_from_city_center_km: 110,
      transportation_options: 'Private car, tour bus, motorbike',
      map_url: 'https://goo.gl/maps/example2',
      best_time_to_visit: 'December to April'
    },
    {
      name: 'Obudu Mountain Resort',
      description: 'A ranch and resort on the Obudu Plateau in Cross River State with cable cars and breathtaking views.',
      unique_features: 'Cable car, canopy walkway, mountain climate, waterfalls.',
      state: 'Cross River',
      city: 'Obudu',
      latitude: 6.5,
      longitude: 9.25,
      category: 'mountains-rocks',
      image_url: 'https://picsum.photos/seed/obudu/800/400',
      entry_fee: 3000,
      distance_from_city_center_km: 75,
      transportation_options: 'Private car, taxi from Obudu town',
      map_url: 'https://goo.gl/maps/example3',
      best_time_to_visit: 'October to February'
    },
    {
      name: 'Lekki Conservation Centre',
      description: 'A nature reserve in Lagos with a canopy walkway, wetlands, and diverse flora and fauna.',
      unique_features: 'Longest canopy walkway in Africa, bird watching, monkeys, nature trails.',
      state: 'Lagos',
      city: 'Lekki',
      latitude: 6.4333,
      longitude: 3.5333,
      category: 'woodlands',
      image_url: 'https://picsum.photos/seed/lekki/800/400',
      entry_fee: 1500,
      distance_from_city_center_km: 30,
      transportation_options: 'Uber, Bolt, taxi, Keke Napep',
      map_url: 'https://goo.gl/maps/example4',
      best_time_to_visit: 'November to February'
    },
    {
      name: 'Zuma Rock',
      description: 'A large monolith located in Niger State, often called the gateway to Abuja. It is a significant natural landmark.',
      unique_features: 'Giant rock formation, scenic views, hiking opportunities.',
      state: 'Niger',
      city: 'Suleja',
      latitude: 9.0833,
      longitude: 7.1667,
      category: 'mountains-rocks',
      image_url: 'https://picsum.photos/seed/zuma/800/400',
      entry_fee: 500,
      distance_from_city_center_km: 20,
      transportation_options: 'Taxi, bus from Abuja',
      map_url: 'https://goo.gl/maps/example5',
      best_time_to_visit: 'Year round'
    },
    {
      name: 'Bar Beach',
      description: 'A popular beach along Victoria Island in Lagos, known for its lively atmosphere and recreational activities.',
      unique_features: 'Horse riding, beach soccer, food stalls, sunset views.',
      state: 'Lagos',
      city: 'Victoria Island',
      latitude: 6.4227,
      longitude: 3.4097,
      category: 'beaches',
      image_url: 'https://picsum.photos/seed/barbeach/800/400',
      entry_fee: 0,
      distance_from_city_center_km: 5,
      transportation_options: 'Uber, Bolt, taxi, walking',
      map_url: 'https://goo.gl/maps/example6',
      best_time_to_visit: 'November to March'
    },
    {
      name: 'Erin Ijesha Waterfall',
      description: 'A seven-step waterfall in Osun State, also known as Olumirin Waterfall.',
      unique_features: 'Seven cascading levels, cool natural pools, hiking trails.',
      state: 'Osun',
      city: 'Ilesa',
      latitude: 7.55,
      longitude: 4.8833,
      category: 'waterfalls',
      image_url: 'https://picsum.photos/seed/erinijesha/800/400',
      entry_fee: 500,
      distance_from_city_center_km: 15,
      transportation_options: 'Taxi, bus, motorbike',
      map_url: 'https://goo.gl/maps/example7',
      best_time_to_visit: 'May to October'
    },
    {
      name: 'Ogbunike Caves',
      description: 'A network of caves in Anambra State, used as a hiding place during the slave trade era.',
      unique_features: 'Spiritual significance, bat colonies, tunnels, natural springs.',
      state: 'Anambra',
      city: 'Ogbunike',
      latitude: 6.1833,
      longitude: 6.9333,
      category: 'caves',
      image_url: 'https://picsum.photos/seed/ogbunike/800/400',
      entry_fee: 1000,
      distance_from_city_center_km: 10,
      transportation_options: 'Taxi, minibus',
      map_url: 'https://goo.gl/maps/example8',
      best_time_to_visit: 'November to April'
    },
    {
      name: 'Ngwo Pine Forest',
      description: 'A serene pine forest with caves and waterfalls in Enugu State.',
      unique_features: 'Pine trees, caves, natural waterfall, picnic spots.',
      state: 'Enugu',
      city: 'Ngwo',
      latitude: 6.4167,
      longitude: 7.4167,
      category: 'woodlands',
      image_url: 'https://picsum.photos/seed/ngwopine/800/400',
      entry_fee: 300,
      distance_from_city_center_km: 12,
      transportation_options: 'Taxi, motorbike',
      map_url: 'https://goo.gl/maps/example9',
      best_time_to_visit: 'Year round'
    },
    {
      name: 'Tarkwa Bay Beach',
      description: 'A sheltered beach accessible by boat from Lagos, popular for swimming and water sports.',
      unique_features: 'Calm waters, boat rides, beach volleyball, local seafood.',
      state: 'Lagos',
      city: 'Lagos',
      latitude: 6.4019,
      longitude: 3.3969,
      category: 'beaches',
      image_url: 'https://picsum.photos/seed/tarkwa/800/400',
      entry_fee: 0,
      distance_from_city_center_km: 8,
      transportation_options: 'Boat from Tarzan Jetty',
      map_url: 'https://goo.gl/maps/example10',
      best_time_to_visit: 'November to March'
    }
  ];

  const insertSite = db.prepare(`
    INSERT INTO tourist_sites 
    (name, description, unique_features, state, city, latitude, longitude, category, image_url, entry_fee, distance_from_city_center_km, transportation_options, map_url, best_time_to_visit) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  touristSites.forEach(site => {
    insertSite.run(
      site.name,
      site.description,
      site.unique_features,
      site.state,
      site.city,
      site.latitude,
      site.longitude,
      site.category,
      site.image_url,
      site.entry_fee,
      site.distance_from_city_center_km,
      site.transportation_options,
      site.map_url,
      site.best_time_to_visit,
      function(err) {
        if (err) console.error('Error inserting site:', err);
        else console.log(`Inserted site: ${site.name} (id: ${this.lastID})`);
      }
    );
  });
  insertSite.finalize();

  // Insert tour guides
  const tourGuides = [
    { site_id: 1, name: 'Adebayo Johnson', price_per_hour: 5000, rating: 4.8, contact_info: '08012345678' },
    { site_id: 1, name: 'Bola Cole', price_per_hour: 4500, rating: 4.5, contact_info: '08098765432' },
    { site_id: 2, name: 'Chioma Okafor', price_per_hour: 6000, rating: 4.7, contact_info: '08123456789' },
    { site_id: 3, name: 'Emeka Nwosu', price_per_hour: 5500, rating: 4.6, contact_info: '09011223344' },
    { site_id: 4, name: 'Funke Adeyemi', price_per_hour: 4000, rating: 4.4, contact_info: '08055667788' },
    { site_id: 5, name: 'Ibrahim Musa', price_per_hour: 3500, rating: 4.2, contact_info: '08012349876' }
  ];

  const insertGuide = db.prepare(`
    INSERT INTO tour_guides (site_id, name, price_per_hour, rating, contact_info) 
    VALUES (?, ?, ?, ?, ?)
  `);

  tourGuides.forEach(guide => {
    insertGuide.run(guide.site_id, guide.name, guide.price_per_hour, guide.rating, guide.contact_info);
  });
  insertGuide.finalize();

  // Insert hotels
  const hotels = [
    { site_id: 1, name: 'Olumo Rock Hotel', price_range: '₦15,000 - ₦35,000', rating: 4.2, distance_km: 1.5, contact_info: '08011112222' },
    { site_id: 2, name: 'Yankari Safari Lodge', price_range: '₦20,000 - ₦50,000', rating: 4.0, distance_km: 0.5, contact_info: '08033334444' },
    { site_id: 3, name: 'Obudu Mountain Hotel', price_range: '₦25,000 - ₦60,000', rating: 4.5, distance_km: 0.2, contact_info: '08055556666' },
    { site_id: 4, name: 'Lekki Suites', price_range: '₦10,000 - ₦30,000', rating: 4.3, distance_km: 2.0, contact_info: '08077778888' },
    { site_id: 6, name: 'Eko Hotel & Suites', price_range: '₦50,000 - ₦150,000', rating: 4.6, distance_km: 3.0, contact_info: '08099990000' },
    { site_id: 7, name: 'Ilesa Guest House', price_range: '₦8,000 - ₦20,000', rating: 3.9, distance_km: 5.0, contact_info: '08088887777' }
  ];

  const insertHotel = db.prepare(`
    INSERT INTO hotels (site_id, name, price_range, rating, distance_km, contact_info) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  hotels.forEach(hotel => {
    insertHotel.run(hotel.site_id, hotel.name, hotel.price_range, hotel.rating, hotel.distance_km, hotel.contact_info);
  });
  insertHotel.finalize();

  // Insert restaurants
  const restaurants = [
    { site_id: 1, name: 'Abeokuta Kitchen', cuisine_type: 'Nigerian, Continental', price_range: '₦2,000 - ₦8,000', rating: 4.1, distance_km: 1.2, contact_info: '08099990000' },
    { site_id: 2, name: 'Safari Grill', cuisine_type: 'African, Grills', price_range: '₦3,000 - ₦10,000', rating: 4.0, distance_km: 0.8, contact_info: '08088887777' },
    { site_id: 3, name: 'Mountain View Restaurant', cuisine_type: 'Continental, Nigerian', price_range: '₦4,000 - ₦12,000', rating: 4.4, distance_km: 0.3, contact_info: '08066665555' },
    { site_id: 4, name: 'Lekki Garden Restaurant', cuisine_type: 'Nigerian, Asian, Continental', price_range: '₦3,000 - ₦12,000', rating: 4.3, distance_km: 1.5, contact_info: '08044443333' },
    { site_id: 6, name: 'Ocean Basket', cuisine_type: 'Seafood', price_range: '₦5,000 - ₦15,000', rating: 4.2, distance_km: 1.0, contact_info: '08022221111' },
    { site_id: 7, name: 'Ilesa Kitchen', cuisine_type: 'Nigerian', price_range: '₦1,500 - ₦5,000', rating: 4.0, distance_km: 3.0, contact_info: '08033332222' }
  ];

  const insertRestaurant = db.prepare(`
    INSERT INTO restaurants (site_id, name, cuisine_type, price_range, rating, distance_km, contact_info) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  restaurants.forEach(rest => {
    insertRestaurant.run(rest.site_id, rest.name, rest.cuisine_type, rest.price_range, rest.rating, rest.distance_km, rest.contact_info);
  });
  insertRestaurant.finalize();

  // Insert a demo user (password: password123)
  const passwordHash = bcrypt.hashSync('password123', 10);
  db.run('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', 
    ['Demo User', 'demo@example.com', passwordHash],
    (err) => {
      if (err) console.error('Error inserting user:', err);
      else console.log('Inserted demo user: demo@example.com / password123');
    }
  );

  console.log('Database seeding complete!');
  db.close();
});