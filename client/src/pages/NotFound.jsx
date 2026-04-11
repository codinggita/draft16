import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col justify-center items-center min-h-[calc(100vh-73px)] text-center p-6" style={{ background: 'var(--bg-main)' }}>
    <p className="text-7xl font-bold mb-4" style={{ color: 'var(--accent-primary)' }}>404</p>
    <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-main)' }}>Page not found</h1>
    <p className="mb-8" style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist or has been moved.</p>
    <Link
      to="/"
      className="px-6 py-3 rounded-lg font-medium text-white transition-all"
      style={{ background: 'var(--accent-primary)' }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;
