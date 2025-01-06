'use client';
import { useState } from 'react';
import { useProfileData } from './hooks/useProfileData';
import { useMediaUpload } from './hooks/useMediaUpload';
import { useProfileActions } from './hooks/useProfileActions';
import { ProfileHeader } from '@/src/components/profile/ProfileHeader';
import { AboutSection } from '@/src/components/profile/AboutSection';
import { PortfolioSection } from '@/src/components/profile/PortfolioSection';



export function ProfileContent() {
  const [editingAbout, setEditingAbout] = useState(false);

  const {
    user,
    setUser,
    aboutMe,
    setAboutMe,
    imageUrl,
    setImageUrl,
    portfolioImages,
    setPortfolioImages,
    portfolioVideo,
    setPortfolioVideo,
    isLoading,
    error,
  } = useProfileData();

  const { uploadError, handleImageUpload, handleVideoUpload } = useMediaUpload({
    portfolioImages,
    setPortfolioImages,
    setImageUrl,
    setPortfolioVideo,
    setUser,
  });

  const {
    handleAboutMeSubmit,
    handleRemovePortfolioImage,
    handleRemoveVideo,
  } = useProfileActions({
    setUser,
    aboutMe,
    setPortfolioImages, // Add these missing props
    setPortfolioVideo   // Add these missing props
  });

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