import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

/**
 * AudioEngineContext provides a centralized single source of truth for audio playback.
 * It abstracts away the differences between an HTMLAudioElement (uploaded files) 
 * and a YouTube Iframe API player.
 */
const AudioEngineContext = createContext(null);

export const useAudioEngine = () => {
  const context = useContext(AudioEngineContext);
  if (!context) {
    throw new Error('useAudioEngine must be used within an AudioEngineProvider');
  }
  return context;
};

export const AudioEngineProvider = ({ children }) => {
  // --- STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sourceType, setSourceType] = useState(null); // 'audio' | 'youtube' | null

  // --- REFS ---
  // We use refs to hold the actual player instances outside of the React render cycle
  const audioRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const animationRef = useRef(null);

  // --- SYNC LOOP (requestAnimationFrame) ---
  const cancelSync = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const syncTime = useCallback(() => {
    if (!isPlaying) return;

    if (sourceType === 'audio' && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    } else if (sourceType === 'youtube' && ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
      // YouTube's getCurrentTime can be slightly delayed, but we poll it continuously
      setCurrentTime(ytPlayerRef.current.getCurrentTime());
    }

    // Recursively call for the next frame
    animationRef.current = requestAnimationFrame(syncTime);
  }, [isPlaying, sourceType]);

  // Start/Stop syncing loop whenever play state changes
  useEffect(() => {
    cancelSync();
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(syncTime);
    }
    return () => cancelSync();
  }, [isPlaying, syncTime, cancelSync]);

  // --- API METHODS ---

  /**
   * Loads a new source into the engine.
   * @param {string} type - 'audio' | 'youtube'
   * @param {string} url - Audio URL (if type === 'audio')
   * @param {object} ytPlayerInstance - YouTube player ref (if type === 'youtube' and using react-youtube)
   */
  const loadSource = useCallback((type, url = null, ytPlayerInstance = null) => {
    // Reset State
    setSourceType(type);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    cancelSync();

    if (type === 'audio') {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      const audio = audioRef.current;
      audio.src = url;
      audio.load();

      // Audio Event Listeners (One-time setup)
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(audio.duration); // Pin to end
      };
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);

    } else if (type === 'youtube') {
      if (ytPlayerInstance) {
        ytPlayerRef.current = ytPlayerInstance;
        // If the video is already loaded, get its duration immediately
        if (typeof ytPlayerInstance.getDuration === 'function') {
          setDuration(ytPlayerInstance.getDuration() || 0);
        }
      }
      
      // Stop underlying native audio if it was running previously
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    }
  }, [cancelSync]);

  const play = useCallback(() => {
    if (!sourceType) return;

    if (sourceType === 'audio' && audioRef.current) {
      audioRef.current.play().catch(console.error);
    } else if (sourceType === 'youtube' && ytPlayerRef.current && ytPlayerRef.current.playVideo) {
      ytPlayerRef.current.playVideo();
    }
    // Note: State `isPlaying` relies on the native event listeners, 
    // but we cautiously trigger it here for immediate UI responsiveness.
    setIsPlaying(true);
  }, [sourceType]);

  const pause = useCallback(() => {
    if (!sourceType) return;

    if (sourceType === 'audio' && audioRef.current) {
      audioRef.current.pause();
    } else if (sourceType === 'youtube' && ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
      ytPlayerRef.current.pauseVideo();
    }
    setIsPlaying(false);
  }, [sourceType]);

  const seek = useCallback((time) => {
    if (!sourceType) return;

    // Immediately update local state to avoid visual lag
    setCurrentTime(time);

    if (sourceType === 'audio' && audioRef.current) {
      audioRef.current.currentTime = time;
    } else if (sourceType === 'youtube' && ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      ytPlayerRef.current.seekTo(time, true); // true = allow seeking ahead of buffered video
    }
  }, [sourceType]);

  // --- YOUTUBE SPECIFIC HANDLERS ---
  // Expose these handlers to be attached to your YouTube Iframe wrapper component
  const onYtReady = useCallback((event) => {
    const player = event.target;
    ytPlayerRef.current = player;
    setDuration(player.getDuration() || 0);
  }, []);

  const onYtStateChange = useCallback((event) => {
    // YouTube Player States:
    // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(event.target.getDuration() || 0);
    } else if (event.data === 2) {
      setIsPlaying(false);
    } else if (event.data === 0) {
      setIsPlaying(false);
      if (ytPlayerRef.current) {
         setCurrentTime(ytPlayerRef.current.getDuration() || 0);
      }
    }
  }, []);

  // --- CONTEXT VALUE ---
  const value = {
    // State
    isPlaying,
    currentTime,
    duration,
    sourceType,
    // Operations
    play,
    pause,
    seek,
    loadSource,
    // YT Bindings
    ytHandlers: {
      onReady: onYtReady,
      onStateChange: onYtStateChange
    }
  };

  return (
    <AudioEngineContext.Provider value={value}>
      {children}
    </AudioEngineContext.Provider>
  );
};
