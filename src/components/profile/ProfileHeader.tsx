import Image from 'next/image';
import { Camera, StarIcon } from 'lucide-react';
import { User } from '@prisma/client';
import { useState } from 'react';

interface ProfileHeaderProps {
  user: User | null;
  imageUrl: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'portfolio') => Promise<void>;
  isLoading?: boolean;
}

export const ProfileHeader = ({ 
  user, 
  imageUrl, 
  onImageUpload, 
  isLoading = false 
}: ProfileHeaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      await onImageUpload(e, 'profile');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mb-8 animate-pulse">
        <div className="relative w-32 h-32 mb-4 bg-gray-200 rounded-full" />
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-6 h-6 bg-gray-200 rounded" />
          ))}
          <div className="ml-2 w-12 h-6 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative w-32 h-32 mb-4">
        <div className={`relative w-full h-full ${isUploading ? 'opacity-50' : ''}`}>
          <Image
            src={imageUrl || '/default-avatar.png'}
            alt={user ? `${user.firstName} ${user.lastName}` : 'Profile'}
            fill
            priority={true} // Prioritize loading
            sizes="128px"
            className="rounded-full object-cover transition-opacity duration-200"
            loading="eager" // Load immediately
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>
        <label 
          className={`absolute bottom-0 right-0 p-2 rounded-full transition-all duration-200 ${
            isUploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
          }`}
        >
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Camera className="w-4 h-4 text-white" />
          )}
        </label>
      </div>

      {user && (
        <h1 className="text-2xl font-semibold mb-2 transition-opacity duration-200">
          {`${user.firstName} ${user.lastName}`}
        </h1>
      )}

      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={`w-6 h-6 transition-colors duration-200 ${
              user?.rating && index < user.rating
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-gray-600 transition-opacity duration-200">
          ({user?.rating?.toFixed(1) || '0.0'})
        </span>
      </div>

      {isUploading && (
        <div className="mt-2 text-sm text-blue-600 animate-pulse">
          Uploading profile picture...
        </div>
      )}
    </div>
  );
};