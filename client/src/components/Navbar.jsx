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

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'var(--bg-base)',
      borderBottom: '1px solid var(--border-subtle)',
      color: 'var(--text-main)',
    }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="font-display transition-opacity hover:opacity-75 flex items-center"
          style={{ color: 'var(--text-main)', letterSpacing: '-0.05em', fontWeight: 800, fontSize: '28px' }}
        >
          Draft<span style={{ color: 'var(--accent-focus)', fontWeight: 800, marginLeft: '0.04em' }}>16</span>
        </Link>
        
        <div className="flex gap-6 items-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium transition-colors"
                style={{ color: isActive('/dashboard') ? 'var(--accent-focus)' : 'var(--text-muted)' }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium transition-colors"
                style={{ color: isActive('/login') ? 'var(--accent-focus)' : 'var(--text-muted)' }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-opacity"
                style={{ background: 'var(--accent-focus)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Get Started
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md transition-colors text-sm leading-none flex items-center justify-center"
            style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'transparent' }}
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
