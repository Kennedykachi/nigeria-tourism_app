import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import StateDropdown from '../components/StateDropdown';

function HomePage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category) params.category = category;
        if (state) params.state = state;
        if (search) params.search = search;
        const response = await api.get('/tourist-sites', { params });
        setSites(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load tourist sites. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, [category, state, search]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-800 mb-4">Discover Nigeria</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by site name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <CategoryFilter selected={category} onSelect={setCategory} />
        <StateDropdown selected={state} onSelect={setState} />
      </div>

      {loading && <div className="text-center py-10">Loading...</div>}
      {error && <div className="text-center py-10 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Link
              key={site.id}
              to={`/sites/${site.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={site.image_url}
                alt={site.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-teal-800">{site.name}</h2>
                <p className="text-gray-600">{site.state}</p>
                <p className="text-gray-500 mt-2">
                  Entry Fee: ₦{site.entry_fee}
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {site.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;