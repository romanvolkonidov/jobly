// app/profile/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { User } from '@prisma/client';
import { ProfileHeader } from '@/src/components/profile/ProfileHeader';
import { AboutSection } from '@/src/components/profile/AboutSection';
import { PortfolioSection } from '@/src/components/profile/PortfolioSection';

const MAX_IMAGES = 20;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_VIDEO_DURATION = 120; // 2 minutes in seconds

function ProfileContent() {
  const [user, setUser] = useState<User | null>(null);
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutMe, setAboutMe] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [portfolioVideo, setPortfolioVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile data');
      
      const data = await response.json();
      setUser(data);
      setAboutMe(data.aboutMe || '');
      setImageUrl(data.imageUrl || '');
      setPortfolioImages(data.portfolioImages || []);
      setPortfolioVideo(data.portfolioVideo || null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'portfolio') => {
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
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      
      if (type === 'profile') {
        setImageUrl(data.imageUrl);
      } else {
        setPortfolioImages(prev => [...prev, data.imageUrl]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      setUploadError(null);
      console.log('Starting video upload, file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
  
      if (file.size > MAX_VIDEO_SIZE) {
        setUploadError('Video must be less than 100MB');
        return;
      }
  
      const video = document.createElement('video');
      video.preload = 'metadata';
  
      const videoURL = URL.createObjectURL(file);
      video.src = videoURL;
  
      try {
        const checkDuration = new Promise((resolve, reject) => {
          video.onloadedmetadata = () => resolve(video.duration);
          video.onerror = (e) => reject(`Error loading video: ${e}`);
        });
  
        const duration = await checkDuration as number;
        console.log('Video duration:', duration);
        
        if (duration > MAX_VIDEO_DURATION) {
          setUploadError('Video must be no longer than 2 minutes');
          return;
        }
  
        const formData = new FormData();
        formData.append('video', file);
  
        console.log('Sending video to server...');
        const response = await fetch('/api/upload/video', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
  
        console.log('Server response status:', response.status);
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Server error:', data);
          throw new Error(data.error || 'Failed to upload video');
        }
  
        console.log('Upload successful:', data);
        setPortfolioVideo(data.videoUrl);
      } finally {
        URL.revokeObjectURL(videoURL);
      }
    } catch (error) {
      console.error('Video upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const handleRemovePortfolioImage = async (imageUrl: string) => {
    try {
      await fetch('/api/profile/portfolio-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
        credentials: 'include'
      });
      
      setPortfolioImages(prev => prev.filter(img => img !== imageUrl));
    } catch (error) {
      console.error('Error removing image:', error);
      setUploadError('Failed to remove image');
    }
  };

  const handleRemoveVideo = async () => {
    try {
      await fetch('/api/profile/portfolio-video', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      setPortfolioVideo(null);
    } catch (error) {
      console.error('Error removing video:', error);
      setUploadError('Failed to remove video');
    }
  };

  const handleAboutMeSubmit = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aboutMe }),
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      setEditingAbout(false);
    } catch (error) {
      console.error('Error updating about me:', error);
      setError('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileHeader
        user={user}
        imageUrl={imageUrl}
        onImageUpload={handleImageUpload}
      />
      
      <AboutSection
        aboutMe={aboutMe}
        editingAbout={editingAbout}
        setEditingAbout={setEditingAbout}
        setAboutMe={setAboutMe}
        onSubmit={handleAboutMeSubmit}
      />
      
      <PortfolioSection
        portfolioImages={portfolioImages}
        portfolioVideo={portfolioVideo}
        uploadError={uploadError}
        onImageUpload={handleImageUpload}
        onVideoUpload={handleVideoUpload}
        onRemoveImage={handleRemovePortfolioImage}
        onRemoveVideo={handleRemoveVideo}
      />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-pulse text-gray-600">Loading profile...</div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}