// src/components/profile/PortfolioSection.tsx
import React from 'react';
import Image from 'next/image';
import { X, Upload, Video } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface PortfolioSectionProps {
  portfolioImages: string[];
  portfolioVideo: string | null;
  uploadError: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'portfolio') => Promise<void>;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveImage: (imageUrl: string) => Promise<void>;
  onRemoveVideo: () => Promise<void>;
}

export const PortfolioSection = ({
  portfolioImages,
  portfolioVideo,
  uploadError,
  onImageUpload,
  onVideoUpload,
  onRemoveImage,
  onRemoveVideo
}: PortfolioSectionProps) => {
  return (
    <div className="mb-8">
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
                className="rounded-lg object-cover"
              />
              <button
                onClick={() => onRemoveImage(img)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {portfolioImages.length < 20 && (
            <label className="flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 aspect-square">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => onImageUpload(e, 'portfolio')}
              />
              <div className="text-center p-4">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Add Image</p>
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
              onClick={onRemoveVideo}
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
              onChange={onVideoUpload}
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
  );
};