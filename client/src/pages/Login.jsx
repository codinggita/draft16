import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { setToken } from '../utils/auth';

const Login = () => {
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
      const data = await login({ email, password });
      setToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[calc(100vh-73px)] overflow-hidden p-6">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-12 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md z-10">
        <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white text-center mb-8 tracking-tight">Welcome Back</h2>
        
        {error && <div className="bg-red-50/80 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-sm shadow-inner"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-sm shadow-inner"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 mt-2 rounded-xl font-medium text-white shadow-lg transition-all duration-300 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/25 hover:-translate-y-0.5'}`}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mt-8">
          Don't have an account? <Link to="/signup" className="font-semibold text-indigo-600 dark:text-cyan-400 hover:underline transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
