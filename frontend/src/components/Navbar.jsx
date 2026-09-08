import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-teal-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          🌍 NaijaExplore
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-teal-200">Home</Link>
          <Link to="/login" className="hover:text-teal-200">Login</Link>
          <Link to="/register" className="hover:text-teal-200">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;