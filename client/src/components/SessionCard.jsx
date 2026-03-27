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
    <div
      className="flex flex-col h-full transition-colors duration-150 group"
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '20px',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-panel)'}
    >
      <h3 className="text-lg font-display font-bold mb-1 truncate transition-colors" style={{ color: 'var(--text-main)' }}>
        {session.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-6 text-sm">
        <span style={{ color: 'var(--text-muted)' }}>{formattedDate}</span>
        <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-subtle)' }} />
        <span className="font-medium" style={{ color: 'var(--accent-focus)' }}>{session.bpm} BPM</span>
      </div>
      
      <div className="mt-auto flex gap-3 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <Link 
          to={`/sessions/${session._id}`}
          className="flex-1 text-center py-2 rounded-lg text-sm font-medium transition-colors text-white"
          style={{ background: 'var(--accent-focus)' }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Open
        </Link>
        <button 
          onClick={handleDelete}
          className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
