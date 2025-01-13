import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoPlayer } from './VideoPlayer';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

interface PortfolioSectionProps {

  portfolioImages: string[];

  portfolioVideo: string | null;

  uploadError: string | null;

  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "portfolio") => Promise<void>;

  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;

  onRemoveImage: (imageUrl: string) => Promise<void>;

  onRemoveVideo: () => Promise<void>;

}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    // Add onClick to the overlay to close when clicking outside
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Stop propagation to prevent closing when clicking the image */}
      <div 
        className="relative max-w-4xl w-full bg-white rounded-lg"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 z-50"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="relative h-[80vh]">
          <Image
            src={imageUrl}
            alt="Portfolio item"
            fill
            className="object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolioVideo,
  uploadError,
  onVideoUpload,
  onRemoveImage,
  onRemoveVideo
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingType, setUploadingType] = useState<'image' | 'video' | null>(null);
  const [removingImage, setRemovingImage] = useState<string | null>(null);
  const [removingVideo, setRemovingVideo] = useState(false);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/profile/portfolio-image');
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        setPortfolioImages(data.portfolioImages || []);
        setFetchError(null); // Clear error when successful
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

  // Add keyboard handler for ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="mb-8">
      {fetchError && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
          {fetchError}
        </div>
      )}
      
      <div>
          <h3 className="text-lg font-medium mb-2">Introduction Video</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add a brief video introduction to personally connect with potential clients. 
            Share your expertise, approach, and what makes your services unique.
          </p>
          
          {portfolioVideo ? (
            <div className="relative">
              <VideoPlayer src={portfolioVideo} />
              <button
                onClick={onRemoveVideo}
                disabled={removingVideo}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
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
            <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={onVideoUpload}
                disabled={isUploading}
              />
              <div className="text-center">
                <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Upload a 2-minute introduction video</p>
                <p className="text-sm text-gray-400 mt-1">Max size: 100MB</p>
              </div>
            </label>
          )}
        </div>
        
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Portfolio</h2>
        <p className="text-gray-600 mb-6">
          Showcase your best work and credentials. You can include work samples, project results, 
          certifications, client testimonials, awards, or any other materials that demonstrate 
          your expertise and experience.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Portfolio Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioImages.map((img, index) => (
              <div key={index} className="relative group aspect-square">
                <Image
                  src={img}
                  alt={`Portfolio ${index + 1}`}
                  fill
                  className={`rounded-lg object-cover transition-opacity duration-200 cursor-pointer ${
                    removingImage === img ? 'opacity-50' : ''
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
                <button
                  onClick={() => onRemoveImage(img)}
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
              <label className="flex items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <div className="text-center p-4">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Add Image</p>
                  <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                </div>
              </label>
            )}
          </div>
        </div>


      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

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

export default PortfolioSection;