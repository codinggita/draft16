import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Core Audio Engine strictly for precise HTMLAudioElement playback.
 * 
 * @param {string} url - The URL of the uploaded audio file
 * @returns {object} API to control playback and access native refs
 */
export function useAudioEngine(url) {
  const audioRef = useRef(null);
  
  // Strict State: We only track transport state and duration.
  // Current time is deliberately excluded from React state to prevent 60fps React thrashing.
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // Initialize and clean up the native HTMLAudioElement
  useEffect(() => {
    if (!url) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    // Attempt to clear previous src if it changes
    audio.pause();
    audio.src = url;
    audio.load();

    // Native event bindings
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, [url]);

  // Command API
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Playback failed:", err);
      });
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const seek = useCallback((time) => {
    if (audioRef.current && isFinite(time)) {
      audioRef.current.currentTime = time;
    }
  }, []);

  return {
    audioRef,    // Direct native ref for ultra-fast rAF reads
    play,
    pause,
    seek,
    isPlaying,
    duration
  };
}
