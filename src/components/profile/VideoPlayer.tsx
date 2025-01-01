// src/components/profile/VideoPlayer.tsx
import React, { useState, useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle different mobile play/pause events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Attempt to load video metadata
    video.load();

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      // Create a playback promise
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Playback error:', error);
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        Failed to load video. Please try uploading again.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[320px] aspect-video mx-auto rounded-lg overflow-hidden shadow-lg relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        preload="metadata"
        onClick={handleClick}
        onError={() => setError(true)}
        // Mobile-specific attributes
        playsInline={true}
        webkit-playsinline="true"
        x-webkit-airplay="allow"
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        // Video source
        src={src}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <button
          className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center"
          onClick={handleClick}
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};