import React from 'react';

/**
 * Extracts the YouTube video ID from a watch URL or short URL.
 * Supports:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 */
const getYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
};

/**
 * YouTubePlayer — renders a YouTube video as an embedded iframe.
 * Used exclusively when beatSource === 'youtube'.
 * Never feeds YouTube URLs into HTMLAudioElement.
 */
const YouTubePlayer = ({ url }) => {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <div className="w-full flex items-center justify-center h-16 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 text-sm">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
      className="w-full rounded-lg mt-2"
      style={{ height: '260px', border: 'none' }}
      allow="autoplay; encrypted-media; fullscreen"
      allowFullScreen
      title="YouTube Beat Player"
    />
  );
};

export default YouTubePlayer;
