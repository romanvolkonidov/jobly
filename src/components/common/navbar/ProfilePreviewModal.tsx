import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { VideoPlayer } from '@/src/components/profile/VideoPlayer';
import Image from 'next/image';
import Link from 'next/link';

interface ProfilePreviewModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePreviewModal = ({ userId, isOpen, onClose }: ProfilePreviewModalProps) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfileData();
    }
  }, [isOpen, userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch profile data');
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold">Profile Preview</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-gray-600">Loading profile...</div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center p-4">{error}</div>
          ) : profileData ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <Image
                  src={profileData.imageUrl || '/default-avatar.png'}
                  alt={profileData.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{profileData.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{profileData.rating?.toFixed(1) || '0.0'}</span>
                    <span className="ml-1 text-gray-600">({profileData.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              {profileData.aboutMe && (
                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-gray-600">{profileData.aboutMe}</p>
                </div>
              )}

              {/* Portfolio Images */}
              {profileData.portfolioImages?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Portfolio</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {profileData.portfolioImages.map((img: string, index: number) => (
                      <div key={index} className="aspect-square relative">
                        <Image
                          src={img}
                          alt={`Portfolio ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio Video */}
              {profileData.portfolioVideo && (
                <div>
                  <h4 className="font-medium mb-2">Introduction Video</h4>
                  <VideoPlayer src={profileData.portfolioVideo} />
                </div>
              )}

              {/* View Full Profile Link */}
              <div className="flex justify-center pt-4">
                <Link
                  href={`/profile/${userId}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">No profile data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreviewModal;