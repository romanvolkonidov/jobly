// src/components/profile/ProfileHeader.tsx
import Image from 'next/image';
import { Camera, StarIcon } from 'lucide-react';
import { User } from '@prisma/client';

interface ProfileHeaderProps {
  user: User | null;
  imageUrl: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'portfolio') => Promise<void>;
}

export const ProfileHeader = ({ user, imageUrl, onImageUpload }: ProfileHeaderProps) => (
  <div className="flex flex-col items-center mb-8">
    <div className="relative w-32 h-32 mb-4">
    <Image
  src={imageUrl || '/default-avatar.png'}
  alt={user ? `${user.firstName} ${user.lastName}` : 'Profile'}
  fill
  className="rounded-full object-cover"
/>
      <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => onImageUpload(e, 'profile')}
        />
        <Camera className="w-4 h-4" />
      </label>
    </div>
    {user && (
    <h1 className="text-2xl font-semibold mb-2">
      {`${user.firstName} ${user.lastName}`}
    </h1>
  )}
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
);