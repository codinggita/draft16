import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createSession } from '../services/sessionService';

const NewSession = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [beatSource, setBeatSource] = useState('youtube');
  const [beatUrl, setBeatUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a session title');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const sessionData = {
        title,
        lyrics: '', // Start empty
        beatSource,
        beatUrl
      };

      const newSession = await createSession(sessionData);
      
      // Redirect straight to the editor for this new session
      navigate(`/sessions/${newSession._id}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating session');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[calc(100vh-73px)] overflow-hidden p-6 md:p-10">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="glass-panel p-8 sm:p-12 rounded-[2rem] shadow-2xl w-full max-w-xl z-10 border border-transparent dark:border-white/10">
        
        <div className="mb-8">
          <Link to="/dashboard" className="text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 text-sm font-semibold mb-6 inline-flex items-center gap-1 transition-colors">
            <span>&larr;</span> Back to Dashboard
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Start New Session</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Set up your workspace for a new track.</p>
        </div>

        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Song Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Thoughts"
              className="w-full p-4 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-sm shadow-inner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Beat Source</label>
            <select 
              value={beatSource}
              onChange={(e) => setBeatSource(e.target.value)}
              className="w-full p-4 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white transition-all backdrop-blur-sm shadow-inner appearance-none cursor-pointer"
              style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="292.4" height="292.4"><path fill="%239CA3AF" d="M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-5 0-9.3 1.8-12.9 5.4A17.6 17.6 0 0 0 0 82.2c0 5 1.8 9.3 5.4 12.9l128 127.9c3.6 3.6 7.8 5.4 12.8 5.4s9.2-1.8 12.8-5.4L287 95c3.5-3.5 5.4-7.8 5.4-12.8 0-5-1.9-9.2-5.5-12.8z"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.2rem top 50%', backgroundSize: '0.65rem auto' }}
            >
              <option value="youtube" className="bg-white dark:bg-slate-800">YouTube</option>
              <option value="upload" className="bg-white dark:bg-slate-800">Upload (Coming Soon)</option>
              <option value="external" className="bg-white dark:bg-slate-800">External Link</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Beat URL (Optional)</label>
            <input
              type="url"
              value={beatUrl}
              onChange={(e) => setBeatUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full p-4 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-sm shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 text-lg
              ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/25 hover:-translate-y-0.5'}`}
          >
            {loading ? 'Creating workspace...' : 'Create Session'}
          </button>
          
        </form>

      </div>
    </div>
  );
};

export default NewSession;
