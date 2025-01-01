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
    </div>
  );
};