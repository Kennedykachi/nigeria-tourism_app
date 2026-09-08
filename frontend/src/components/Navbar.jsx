import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-teal-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          🌍 NaijaExplore
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-teal-200">Home</Link>
          {user ? (
            <>
              <span className="text-teal-200">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="hover:text-teal-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-teal-200">Login</Link>
              <Link to="/register" className="hover:text-teal-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;