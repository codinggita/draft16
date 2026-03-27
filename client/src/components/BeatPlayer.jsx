import React, { useRef, useState, useEffect } from 'react';
import { useAudioEngine } from '../hooks/useAudioEngine';

// Utility format: 65 -> "1:05"
const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const BeatPlayer = ({ beatUrl, beatSource = 'upload' }) => {
  const { audioRef, play, pause, seek, isPlaying, duration } = useAudioEngine(beatUrl);

  // UI time — driven by rAF, frozen during drag to prevent jitter
  const [uiTime, setUiTime] = useState(0);

  // --- NEW: Loop Controls State ---
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopStart, setLoopStart] = useState(null);
  const [loopEnd, setLoopEnd] = useState(null);
  const [loopStartInput, setLoopStartInput] = useState('');
  const [loopEndInput, setLoopEndInput] = useState('');
  const [loopError, setLoopError] = useState('');

  // Sync state to ref for zero-latency rAF execution
  const loopStateRef = useRef({ enabled: false, start: null, end: null });
  useEffect(() => {
    loopStateRef.current = { enabled: loopEnabled, start: loopStart, end: loopEnd };
  }, [loopEnabled, loopStart, loopEnd]);

  // --- Helpers for parsing ---
  const formatTimeInput = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      if (digits.length === 0) return '';
      return digits.padStart(1, '0');
    }
    const m = digits.slice(0, digits.length - 2);
    const s = digits.slice(-2);
    return `${parseInt(m)}:${s}`;
  };

  const parseTime = (str) => {
    if (!str || !str.includes(':')) return 0;
    const [m, s] = str.split(':').map(Number);
    return (m || 0) * 60 + (s || 0);
  };

  const handleApplyLoop = () => {
    setLoopError('');
    const start = parseTime(loopStartInput);
    const end = parseTime(loopEndInput);
    
    if (loopStartInput === '' || loopEndInput === '') {
       setLoopError("Please enter both start and end times.");
       return;
    }
    if (start < 0 || isNaN(start)) {
       setLoopError("Invalid start time.");
       return;
    }
    if (end <= start || isNaN(end)) {
       setLoopError("End must be after start.");
       return;
    }
    if (duration > 0 && end > duration) {
       setLoopError("End time exceeds track duration.");
       return;
    }

    setLoopStart(start);
    setLoopEnd(end);
    setLoopEnabled(true); // Auto-enable loop automatically
  };

  const handleClearLoop = () => {
    setLoopStart(null);
    setLoopEnd(null);
    setLoopEnabled(false);
    setLoopStartInput('');
    setLoopEndInput('');
    setLoopError('');
  };

  // Ref (not state) so the rAF callback always reads the live value
  // without needing to re-register on every state change.
  const isSeekingRef = useRef(false);
  const seekBarRef = useRef(null);
  const playheadRef = useRef(null); // direct DOM mutation — no state re-render
  const requestRef = useRef();

  // ── 60fps paint loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      // isSeekingRef guard prevents looping while active drag
      if (audioRef.current && !isSeekingRef.current) {
        const t = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 0;

        // --- Loop Logic with EPSILON guard ---
        const { enabled, start, end } = loopStateRef.current;
        const EPSILON = 0.05; // 50ms buffer to reliably catch loop end
        if (enabled && start !== null && end !== null && start < end) {
          if (t >= end - EPSILON) {
            audioRef.current.currentTime = start;
            // Immediate paint for this frame to hide jitter
            setUiTime(start);
            if (playheadRef.current && dur > 0) {
              playheadRef.current.style.left = `${(start / dur) * 100}%`;
            }
            requestRef.current = requestAnimationFrame(tick);
            return;
          }
        }

        // Update timestamp display via React state (lightweight number)
        setUiTime(t);

        // Move playhead via direct DOM mutation — zero React overhead
        if (playheadRef.current && dur > 0) {
          playheadRef.current.style.left = `${(t / dur) * 100}%`;
        }
      }
      requestRef.current = requestAnimationFrame(tick);
    };
    requestRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // mount-once; ref reads are always fresh

  // ── Seek helpers ──────────────────────────────────────────────────────────
  /** Convert a PointerEvent's clientX into a playback time value */
  const pointerToTime = (e) => {
    const bar = seekBarRef.current;
    if (!bar || !duration) return 0;
    const { left, width } = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - left) / width));
    return ratio * duration;
  };

  const handlePointerDown = (e) => {
    // setPointerCapture keeps pointermove/pointerup firing even if cursor
    // leaves the element during fast drags
    e.currentTarget.setPointerCapture(e.pointerId);
    isSeekingRef.current = true;
    
    const t = pointerToTime(e);
    setUiTime(t); // immediate visual jump on click
    if (playheadRef.current && duration > 0) {
      playheadRef.current.style.left = `${(t / duration) * 100}%`;
    }
  };

  const handlePointerMove = (e) => {
    if (!isSeekingRef.current) return;
    
    const t = pointerToTime(e);
    setUiTime(t); // smooth preview — rAF is frozen
    if (playheadRef.current && duration > 0) {
      playheadRef.current.style.left = `${(t / duration) * 100}%`;
    }
  };

  const handlePointerUp = (e) => {
    if (!isSeekingRef.current) return;
    const t = pointerToTime(e);
    setUiTime(t);
    // Snap playhead to committed position immediately
    if (playheadRef.current && duration > 0) {
      playheadRef.current.style.left = `${(t / duration) * 100}%`;
    }
    seek(t);                      // commit the seek to native audio
    isSeekingRef.current = false; // re-open rAF gate
  };

  const handlePlayPause = () => {
    if (isPlaying) pause();
    else play();
  };

  // Fallback if no track is loaded yet
  if (!beatUrl) {
    return (
      <div className="w-full bg-slate-900 border-b border-slate-800 p-4 text-slate-500 font-medium tracking-wide flex justify-center items-center text-sm shadow-sm">
        No beat loaded. Upload an instrumental to begin.
      </div>
    );
  }

  const progress = duration ? (uiTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 flex flex-col justify-center shadow-md z-50">
      <div className="max-w-[1500px] w-full mx-auto flex items-center gap-6 px-6 py-4">

        {/* Play / Pause button */}
        <button
          onClick={handlePlayPause}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] shrink-0"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 fill-current text-indigo-400" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 fill-current text-white translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Current time + seekbar + duration */}
        <div className="flex items-center gap-4 flex-1">
          <span className="text-slate-400 font-mono text-xs w-12 text-right select-none tracking-wider">
            {formatTime(uiTime)}
          </span>

          {/* Custom seekbar ------------------------------------------------ */}
          <div
            ref={seekBarRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: 'none' }}
            className="relative flex-1 h-3 rounded-full bg-slate-800 border border-slate-700/50 cursor-pointer group"
          >
            {/* Filled track */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-indigo-500 group-hover:bg-indigo-400 group-hover:shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all pointer-events-none"
              style={{ width: `${progress}%` }}
            />
            {/* Loop Region Highlight */}
            {loopEnabled && loopStart !== null && loopEnd !== null && duration > 0 && (
              <div 
                className="absolute inset-y-0 rounded-full bg-indigo-300/30 border-x border-indigo-400/50 pointer-events-none"
                style={{
                  left: `${(loopStart / duration) * 100}%`,
                  width: `${((loopEnd - loopStart) / duration) * 100}%`
                }}
              />
            )}
            {/* Playhead — thin vertical line, mutated directly by rAF */}
            <div
              ref={playheadRef}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
              style={{ left: `${progress}%` }}
            >
              {/* Vertical line */}
              <div className="w-0.5 h-5 bg-white/90 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
            </div>
            {/* Drag thumb — circle, appears on hover */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%` }}
            />
          </div>
          {/* -------------------------------------------------------------- */}

          <span className="text-slate-500 font-mono text-xs w-12 select-none tracking-wider">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Loop UI Controls Block */}
      {(beatSource === 'upload' || beatSource === 'external') && (
        <div className="max-w-[1500px] w-full mx-auto px-6 pb-4">
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-800/50 rounded-lg text-sm border border-slate-700/50">
            <span className="font-medium text-slate-300 mr-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Loop Area
            </span>
            
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded p-1">
               <span className="text-slate-500 pl-1 text-xs uppercase tracking-wider font-bold">Start</span>
               <input
                 type="text"
                 value={loopStartInput}
                 onChange={(e) => setLoopStartInput(formatTimeInput(e.target.value))}
                 onBlur={handleApplyLoop}
                 onKeyDown={(e) => e.key === 'Enter' && handleApplyLoop()}
                 placeholder="0:00"
                 className="w-12 text-center bg-transparent outline-none text-slate-200 font-mono focus:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-all"
               />
               <button
                  title="Use current time"
                  onClick={() => {
                    const t = audioRef.current ? audioRef.current.currentTime : 0;
                    setLoopStartInput(formatTime(t));
                    // We do not auto-apply here if the other input is empty, but if it's there we can apply
                    setLoopStart(t);
                    // We simulate apply logic but handle it independently
                  }}
                  className="text-slate-500 hover:text-indigo-400 px-1.5 transition-colors"
               >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded p-1">
               <span className="text-slate-500 pl-1 text-xs uppercase tracking-wider font-bold">End</span>
               <input
                 type="text"
                 value={loopEndInput}
                 onChange={(e) => setLoopEndInput(formatTimeInput(e.target.value))}
                 onBlur={handleApplyLoop}
                 onKeyDown={(e) => e.key === 'Enter' && handleApplyLoop()}
                 placeholder="0:00"
                 className="w-12 text-center bg-transparent outline-none text-slate-200 font-mono focus:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-all"
               />
               <button
                  title="Use current time"
                  onClick={() => {
                    const t = audioRef.current ? audioRef.current.currentTime : 0;
                    setLoopEndInput(formatTime(t));
                    setLoopEnd(t);
                  }}
                  className="text-slate-500 hover:text-indigo-400 px-1.5 transition-colors"
               >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => {
                   if (loopEnabled) {
                      setLoopEnabled(false);
                   } else {
                      handleApplyLoop();
                   }
                }}
                className={`px-4 py-1.5 rounded transition-all font-medium text-sm flex items-center gap-2 ${
                  loopEnabled 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)] hover:shadow-[0_0_16px_rgba(99,102,241,0.25)]' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:shadow-[0_0_8px_rgba(255,255,255,0.05)]'
                }`}
              >
                {loopEnabled && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>}
                {loopEnabled ? 'Looping' : 'Enable'}
              </button>
              
              <button 
                onClick={handleClearLoop}
                className="px-3 py-1.5 bg-slate-800/50 text-slate-400 border border-transparent rounded hover:bg-slate-800 hover:text-slate-300 transition-colors text-sm"
                title="Clear Loop"
              >
                Clear
              </button>
            </div>
            
            {loopError && (
              <div className="w-full text-rose-500/90 text-xs font-medium ml-2">{loopError}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BeatPlayer;
