import { Link } from 'react-router-dom';

const SessionCard = ({ session, onDelete }) => {

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      onDelete(session._id);
    }
  };
  const formattedDate = new Date(session.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-lg border border-transparent dark:border-white/10 hover:shadow-xl hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full bg-white/70 dark:bg-slate-800/40">
      <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2 truncate group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
        {session.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-6 text-sm">
        <span className="text-slate-500 dark:text-slate-400">{formattedDate}</span>
        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
        <span className="text-indigo-600 dark:text-cyan-400 font-medium">{session.bpm} BPM</span>
      </div>
      
      <div className="mt-auto flex gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
        <Link 
          to={`/sessions/${session._id}`}
          className="flex-1 text-center bg-slate-800 dark:bg-white/10 text-white py-2.5 rounded-lg hover:bg-slate-700 dark:hover:bg-white/20 transition-all text-sm font-medium shadow-sm hover:shadow-md"
        >
          Open
        </Link>
        <button 
          onClick={handleDelete}
          className="flex-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 py-2.5 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-medium border border-transparent hover:border-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
