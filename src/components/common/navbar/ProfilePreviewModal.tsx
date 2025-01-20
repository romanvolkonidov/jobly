import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface ProfileData {
 imageUrl: string;
 firstName: string;
 lastName: string;
 rating?: number;
 reviewCount: number;
 aboutMe?: string;
 portfolioImages?: string[];
 portfolioVideo?: string;
 title?: string;
 about?: string;
}

interface ProfilePreviewModalProps {
 userId: string;
 isOpen: boolean;
 onClose: () => void;
}

const ProfilePreviewModal = ({ userId, isOpen, onClose }: ProfilePreviewModalProps) => {
 const { data: userData, isLoading, error } = useQuery({
   queryKey: ['userProfile', userId],
   queryFn: async () => {
     const response = await fetch(`/api/profile/${userId}`);
     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.error || 'Failed to fetch profile');
     }
     return response.json();
   },
   enabled: isOpen && !!userId,
   retry: 1,
   staleTime: 5 * 60 * 1000, // Cache for 5 minutes
 });

 if (!isOpen) return null;

 return (
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
     <div className="bg-white rounded-lg p-6 relative max-w-md w-full mx-4">
       <button
         onClick={onClose}
         className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
       >
         <X className="w-5 h-5" />
       </button>

       {isLoading ? (
         <div className="flex flex-col items-center space-y-4">
           <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
           <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
           <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
         </div>
       ) : error ? (
         <div className="text-center p-4">
           <p className="text-red-500">
             {error instanceof Error ? error.message : 'Failed to load profile'}
           </p>
         </div>
       ) : userData ? (
         <div className="flex flex-col items-center">
           <Image
             src={userData.imageUrl || '/default-avatar.png'}
             alt={`${userData.firstName} ${userData.lastName}`}
             width={96}
             height={96}
             className="rounded-full mb-4"
           />
           <h3 className="text-xl font-semibold mb-2">
             {userData.firstName} {userData.lastName}
           </h3>
           {userData.rating !== null && (
             <div className="flex items-center gap-2 mb-2">
               <span className="text-yellow-500">★</span>
               <span>{userData.rating.toFixed(1)}</span>
               <span className="text-gray-500">({userData.reviewCount} reviews)</span>
             </div>
           )}
           {userData.aboutMe && (
             <p className="text-gray-700 text-sm text-center max-h-32 overflow-y-auto">
               {userData.aboutMe}
             </p>
           )}
           <Link
             href={`/profile/${userId}`}
             className="mt-4 text-blue-500 hover:text-blue-600"
             onClick={onClose}
           >
             View full profile
           </Link>
         </div>
       ) : null}
     </div>
   </div>
 );
};

export default ProfilePreviewModal;