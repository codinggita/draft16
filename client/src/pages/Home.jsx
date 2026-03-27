import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-73px)] overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="text-center px-4 z-10 max-w-3xl">
        <h1 className="font-display text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
          Where <span className="text-gradient">16s</span> Are Born.
        </h1>
        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
          The ultimate drafting workspace for lyricists. Write verses, record takes, play beats, and perfect your flow in a distraction-free environment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/signup" 
            className="w-full sm:w-auto bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          >
            Start Writing for Free
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto glass-panel px-8 py-4 rounded-full font-medium text-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
