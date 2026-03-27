import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { getToken, removeToken } from '../utils/auth';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!getToken();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  const navLinkClass = (path) => 
    `hover:text-indigo-600 dark:hover:text-cyan-400 font-medium transition-colors ${location.pathname === path ? 'text-indigo-600 dark:text-cyan-400' : ''}`;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-200 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-all">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-display font-bold text-2xl text-gradient tracking-tight hover:opacity-80 transition-opacity">
          Draft16
        </Link>
        
        <div className="flex gap-6 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
              <button 
                onClick={handleLogout} 
                className="hover:text-indigo-600 dark:hover:text-cyan-400 font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass('/login')}>Log in</Link>
              <Link to="/signup" className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-full shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all font-medium text-sm">
                Get Started
              </Link>
            </>
          )}

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5 flex items-center justify-center leading-none"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '🌞'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
