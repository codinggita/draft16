import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService';
import { setToken } from '../utils/auth';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const data = await signup({ username, email, password });
      setToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-73px)] p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-md" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '32px' }}>
        <h2 className="font-display text-3xl font-bold text-center mb-8 tracking-tight" style={{ color: 'var(--text-main)' }}>Create Account</h2>
        
        {error && (
          <div className="p-3 rounded-lg mb-6 text-sm text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg outline-none transition-all"
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-focus)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg outline-none transition-all"
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-focus)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg outline-none transition-all"
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-focus)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              placeholder="Create a password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-lg font-medium text-white transition-all"
            style={{ background: loading ? '#818cf8' : 'var(--accent-focus)', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent-focus)' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
