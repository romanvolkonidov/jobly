// useMediaUpload.ts
import { useState } from 'react';
import { MediaUploadProps } from './types';

const MAX_IMAGES = 20;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_VIDEO_DURATION = 120;

export function useMediaUpload({ 
  portfolioImages, setPortfolioImages, setImageUrl, setPortfolioVideo, setUser 
}: MediaUploadProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);


  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'portfolio'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadError(null);
      if (file.size > MAX_IMAGE_SIZE) {
        setUploadError('Image must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setUploadError('Only JPEG and PNG images are allowed');
        return;
      }
      if (type === 'portfolio' && portfolioImages.length >= MAX_IMAGES) {
        setUploadError(`Maximum ${MAX_IMAGES} images allowed`);
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.status === 401) return;
      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      if (type === 'profile') {
        setImageUrl(data.imageUrl);
        setUser((prev) => (prev ? { ...prev, imageUrl: data.imageUrl } : null));
      } else {
        setPortfolioImages(data.portfolioImages);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadError(null);
      if (file.size > MAX_VIDEO_SIZE) {
        setUploadError('Video must be less than 100MB');
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';
      const videoURL = URL.createObjectURL(file);
      video.src = videoURL;

      const duration = await new Promise<number>((resolve, reject) => {
        video.onloadedmetadata = () => resolve(video.duration);
        video.onerror = () => reject(new Error('Error loading video'));
      });

      if (duration > MAX_VIDEO_DURATION) {
        setUploadError('Video must be no longer than 2 minutes');
        return;
      }

      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.status === 401) return;
      if (!response.ok) throw new Error('Failed to upload video');

      const data = await response.json();
      setPortfolioVideo(data.videoUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  return { uploadError, handleImageUpload, handleVideoUpload };
}