import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import SessionCard from '../components/SessionCard';
import { getToken } from '../utils/auth';
import useSessions from '../hooks/useSessions';

const Dashboard = () => {
  const navigate = useNavigate();
  const { sessions, sortedSessions, loading, error, query, setQuery, sortOption, setSortOption, removeSession } = useSessions();

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-73px)] p-6 md:p-10 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="font-display text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Your Sessions</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Manage your songwriting drafts and studio takes.</p>
          </div>
          <Link 
            to="/session/new"
            className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all w-full md:w-auto text-center"
          >
            Create New Session
          </Link>
        </div>

        {/* Search + Sort */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full glass-panel border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-auto glass-panel border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-sm appearance-none pr-10"
              style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="292.4" height="292.4"><path fill="%239CA3AF" d="M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-5 0-9.3 1.8-12.9 5.4A17.6 17.6 0 0 0 0 82.2c0 5 1.8 9.3 5.4 12.9l128 127.9c3.6 3.6 7.8 5.4 12.8 5.4s9.2-1.8 12.8-5.4L287 95c3.5-3.5 5.4-7.8 5.4-12.8 0-5-1.9-9.2-5.5-12.8z"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
            >
              <option value="newest" className="bg-white dark:bg-slate-800">Newest</option>
              <option value="oldest" className="bg-white dark:bg-slate-800">Oldest</option>
              <option value="az" className="bg-white dark:bg-slate-800">A–Z</option>
              <option value="za" className="bg-white dark:bg-slate-800">Z–A</option>
            </select>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="glass-panel rounded-2xl p-6 text-center border border-red-200 dark:border-red-900 shadow-sm mt-8">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center border border-slate-200 dark:border-white/5 shadow-md mt-8">
            <div className="text-6xl mb-6 flex justify-center">🎙️</div>
            <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">No sessions yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">Start your next hit by creating a new session. Upload a beat, set the BPM, and write your draft.</p>
            <Link 
              to="/session/new"
              className="inline-block bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-full font-semibold hover:bg-slate-700 dark:hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Writing
            </Link>
          </div>
        ) : sortedSessions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center border border-slate-200 dark:border-white/5 shadow-md mt-8">
            <h3 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No matching sessions</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSessions.map((session) => (
              <SessionCard key={session._id} session={session} onDelete={removeSession} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;

