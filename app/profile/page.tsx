// app/profile/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { User } from '@prisma/client';
import { StarIcon, X, Upload, Video, Camera } from 'lucide-react';

const MAX_IMAGES = 20;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_VIDEO_DURATION = 120; // 2 minutes in seconds

const VideoPlayer = ({ src }: { src: string }) => {
  const [error] = useState(false);

  return error ? (
    <div className="bg-red-50 text-red-600 p-4 rounded">
      Failed to load video. Please try uploading again.
    </div>
  ) : (
    <div
      style={{
        width: '320px', // Similar width to YouTube thumbnails
        height: '180px', // 16:9 aspect ratio
        margin: '0 auto',
        borderRadius: '8px', // Rounded corners like YouTube
        overflow: 'hidden', // Ensures clean edges
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for a polished look
      }}
    >
<video
  src={src}
  controls
  playsInline
  preload="metadata" // Preload only metadata for faster initial load
  muted // Required for autoplay or mobile compatibility
  className="w-full h-full rounded-lg"
  style={{
    display: 'block',
    objectFit: 'cover', // Ensures video fits neatly
  }}
  onError={() => console.error('Error loading video')}
/>



    </div>
  );
};



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
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={imageUrl || '/default-avatar.png'}
            alt="Profile"
            fill
            className="rounded-full object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'profile')}
            />
            <Camera className="w-4 h-4" />
          </label>
        </div>

        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <StarIcon
              key={index}
              className={`w-6 h-6 ${
                user?.rating && index < user.rating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-gray-600">
            ({user?.rating?.toFixed(1) || '0.0'})
          </span>
        </div>
      </div>

      {/* About Me */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">About Me</h2>
        {editingAbout ? (
          <div className="space-y-4">
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
              placeholder="Tell others about yourself! Share your skills, experience, and what you enjoy doing. No formal education? No problem - your practical skills and enthusiasm matter most!"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingAbout(false)}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAboutMeSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setEditingAbout(true)}
            className="cursor-pointer p-4 border rounded-md hover:bg-gray-50"
          >
            <p>{aboutMe || 'Click to add a description about yourself'}</p>
          </div>
        )}
      </div>

      {/* Portfolio Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
        
        {/* Images */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioImages.map((img, index) => (
              <div key={index} className="relative group">
                <Image
                  src={img}
                  alt={`Portfolio ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <button
                  onClick={() => handleRemovePortfolioImage(img)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {portfolioImages.length < MAX_IMAGES && (
              <label className="flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'portfolio')}
                />
                <div className="text-center p-4">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Add Image</p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Video */}
        <div>
          <h3 className="text-lg font-medium mb-2">Introduction Video</h3>
          {portfolioVideo ? (
            <div className="relative">
              <VideoPlayer src={portfolioVideo} />
              <button
                onClick={handleRemoveVideo}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 p-8">
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleVideoUpload}
              />
              <div className="text-center">
                <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Upload a 2-minute introduction video</p>
                <p className="text-sm text-gray-400 mt-1">Max size: 100MB</p>
              </div>
            </label>
          )}
        </div>

        {uploadError && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
            {uploadError}
          </div>
        )}
      </div>
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