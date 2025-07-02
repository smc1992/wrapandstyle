'use client'

import React from 'react';

interface VideoPlayerProps {
  url: string;
  className?: string;
}

const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getVimeoId = (url: string): string | null => {
  const regExp = /^.*(vimeo.com\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2]) ? match[2] : null;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, className }) => {
  if (!url) return null;

  const youtubeId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);

  let embedUrl = '';
  if (youtubeId) {
    embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
  } else if (vimeoId) {
    embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
  }

  if (!embedUrl) {
    return (
      <div className="text-red-500 bg-red-100 p-4 rounded-lg">
        Ungültige oder nicht unterstützte Video-URL.
      </div>
    );
  }

  return (
    <div className={`aspect-video w-full overflow-hidden rounded-lg shadow-lg ${className}`}>
      <iframe
        src={embedUrl}
        title="Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
};
