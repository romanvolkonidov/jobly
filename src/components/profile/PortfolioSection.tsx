import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoPlayer } from './VideoPlayer';

interface PortfolioSectionProps {
  portfolioImages?: string[];
  portfolioVideo: string | null;
  uploadError: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'portfolio') => Promise<void>;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveImage: (imageUrl: string) => Promise<void>;
  onRemoveVideo: () => Promise<void>;
}

export const PortfolioSection = ({
  portfolioVideo,
  uploadError,
  onVideoUpload,
  onRemoveImage,
  onRemoveVideo
}: PortfolioSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingType, setUploadingType] = useState<'image' | 'video' | null>(null);
  const [removingImage, setRemovingImage] = useState<string | null>(null);
  const [removingVideo, setRemovingVideo] = useState(false);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/profile/portfolio-image');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setPortfolioImages(data.portfolioImages || []);
        setFetchError(null);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        setFetchError('Failed to load portfolio images');
      }
    };
  
    fetchImages();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setIsUploading(true);
    setUploadingType('image');

    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const response = await fetch('/api/profile/portfolio-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.imageUrl) {
        setPortfolioImages(prev => [...prev, data.imageUrl]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadingType(null);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setUploadingType('video');
    try {
      await onVideoUpload(e);
    } finally {
      setIsUploading(false);
      setUploadingType(null);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    setRemovingImage(imageUrl);
    try {
      await onRemoveImage(imageUrl);
      setPortfolioImages(prev => prev.filter(img => img !== imageUrl));
    } finally {
      setRemovingImage(null);
    }
  };

  const handleRemoveVideo = async () => {
    setRemovingVideo(true);
    try {
      await onRemoveVideo();
    } finally {
      setRemovingVideo(false);
    }
  };


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/profile/portfolio-image');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setPortfolioImages(data.portfolioImages || []);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        // Optionally set an error state here
      }
    };
  
    fetchImages();
  }, []);

  return (
    
    <div className="mb-8">
      {fetchError && (
  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
    {fetchError}
  </div>
)}
      <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {portfolioImages.map((img, index) => (
            <div key={index} className="relative group aspect-square">
              <Image
                src={img}
                alt={`Portfolio ${index + 1}`}
                fill
                className={`rounded-lg object-cover transition-opacity duration-200 ${
                  removingImage === img ? 'opacity-50' : ''
                }`}
              />
              <button
                onClick={() => handleRemoveImage(img)}
                disabled={removingImage === img}
                className={`absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                  transition-all duration-200 ${
                    removingImage === img
                      ? 'opacity-100 cursor-not-allowed'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                aria-label="Remove image"
              >
                {removingImage === img ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
          {portfolioImages.length < 20 && (
            <label className={`flex items-center justify-center border-2 border-dashed rounded-lg 
              transition-all duration-200 ${
                isUploading && uploadingType === 'image'
                  ? 'bg-gray-50 cursor-wait'
                  : 'cursor-pointer hover:bg-gray-50'
              }`}
            >
  <input
    type="file"
    className="hidden"
    accept="image/*"
    onChange={handleImageUpload} // Remove the type parameter
    disabled={isUploading}
  />
              <div className="text-center p-4">
                {isUploading && uploadingType === 'image' ? (
                  <>
                    <div className="w-8 h-8 mx-auto mb-2 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                    <p className="text-sm text-gray-500">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Add Image</p>
                  </>
                )}
              </div>
            </label>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Introduction Video</h3>
        {portfolioVideo ? (
          <div className="relative">
            <VideoPlayer src={portfolioVideo} />
            <button
              onClick={handleRemoveVideo}
              disabled={removingVideo}
              className={`absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full 
                transition-all duration-200 ${
                  removingVideo 
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-red-600'
                }`}
              aria-label="Remove video"
            >
              {removingVideo ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
          </div>
        ) : (
          <label className={`flex items-center justify-center border-2 border-dashed rounded-lg 
            transition-all duration-200 ${
              isUploading && uploadingType === 'video'
                ? 'bg-gray-50 cursor-wait'
                : 'cursor-pointer hover:bg-gray-50'
            } p-8`}
          >
            <input
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={isUploading}
            />
            <div className="text-center">
              {isUploading && uploadingType === 'video' ? (
                <>
                  <div className="w-12 h-12 mx-auto mb-2 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  <p className="text-gray-500">Uploading video...</p>
                  <p className="text-sm text-gray-400 mt-1">Please wait...</p>
                </>
              ) : (
                <>
                  <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Upload a 2-minute introduction video</p>
                  <p className="text-sm text-gray-400 mt-1">Max size: 100MB</p>
                </>
              )}
            </div>
          </label>
        )}
      </div>

      {uploadError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 p-4 bg-red-50 text-red-600 rounded-md flex items-center"
          role="alert"
        >
          <span className="mr-2">⚠️</span>
          {uploadError}
        </motion.div>
      )}

      {isUploading && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-600 rounded-md flex items-center" role="status">
          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          {uploadingType === 'image' ? 'Uploading image...' : 'Uploading video...'}
        </div>
      )}
    </div>
  );
};