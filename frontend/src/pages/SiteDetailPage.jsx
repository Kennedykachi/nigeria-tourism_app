import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function SiteDetailPage() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [guides, setGuides] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [siteRes, guidesRes, hotelsRes, restaurantsRes] = await Promise.all([
          api.get(`/tourist-sites/${id}`),
          api.get(`/tourist-sites/${id}/guides`),
          api.get(`/tourist-sites/${id}/hotels`),
          api.get(`/tourist-sites/${id}/restaurants`),
        ]);
        setSite(siteRes.data);
        setGuides(guidesRes.data);
        setHotels(hotelsRes.data);
        setRestaurants(restaurantsRes.data);
        setError('');
      } catch (err) {
        setError('Failed to load site details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!site) return <div className="text-center py-10">Site not found.</div>;

  return (
    <div>
      <Link to="/" className="text-teal-700 hover:underline mb-4 inline-block">
        ← Back to all sites
      </Link>

      <h1 className="text-4xl font-bold text-teal-900 mb-4">{site.name}</h1>
      <p className="text-gray-600">
        {site.city}, {site.state}
      </p>

      <img
        src={site.image_url}
        alt={site.name}
        className="w-full max-h-96 object-cover rounded-lg my-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-teal-800 mb-2">About</h2>
          <p>{site.description}</p>
          {site.unique_features && (
            <>
              <h3 className="font-semibold mt-4">Unique Features</h3>
              <p>{site.unique_features}</p>
            </>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-teal-800 mb-2">Visitor Info</h2>
          <ul className="space-y-2">
            <li><strong>Entry Fee:</strong> ₦{site.entry_fee}</li>
            {site.distance_from_city_center_km && (
              <li><strong>Distance from City Center:</strong> {site.distance_from_city_center_km} km</li>
            )}
            {site.transportation_options && (
              <li><strong>Transportation:</strong> {site.transportation_options}</li>
            )}
            {site.best_time_to_visit && (
              <li><strong>Best Time to Visit:</strong> {site.best_time_to_visit}</li>
            )}
            {site.map_url && (
              <li>
                <a
                  href={site.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 hover:underline"
                >
                  View on Google Maps →
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Tour Guides */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-teal-800 mb-4">Tour Guides</h2>
        {guides.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{guide.name}</h3>
                <p className="text-sm text-gray-600">Rating: {guide.rating} ⭐</p>
                <p className="text-sm">Price: ₦{guide.price_per_hour}/hour</p>
                {guide.contact_info && <p className="text-sm">Contact: {guide.contact_info}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No guides available for this site.</p>
        )}
      </section>

      {/* Hotels */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-teal-800 mb-4">Nearby Hotels</h2>
        {hotels.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{hotel.name}</h3>
                <p className="text-sm text-gray-600">Rating: {hotel.rating} ⭐</p>
                <p className="text-sm">Price Range: {hotel.price_range}</p>
                <p className="text-sm">Distance: {hotel.distance_km} km</p>
                {hotel.contact_info && <p className="text-sm">Contact: {hotel.contact_info}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hotels listed nearby.</p>
        )}
      </section>

      {/* Restaurants */}
      <section>
        <h2 className="text-2xl font-semibold text-teal-800 mb-4">Nearby Restaurants</h2>
        {restaurants.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((rest) => (
              <div key={rest.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{rest.name}</h3>
                <p className="text-sm text-gray-600">Cuisine: {rest.cuisine_type}</p>
                <p className="text-sm">Price Range: {rest.price_range}</p>
                <p className="text-sm">Distance: {rest.distance_km} km</p>
                {rest.contact_info && <p className="text-sm">Contact: {rest.contact_info}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No restaurants listed nearby.</p>
        )}
      </section>
    </div>
  );
}

export default SiteDetailPage;