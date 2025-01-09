// ProfileContent.tsx
import { useState } from 'react';
import { useProfileData } from './hooks/useProfileData';
import { useMediaUpload } from './hooks/useMediaUpload';
import { useProfileActions } from './hooks/useProfileActions';
import { ProfileHeader } from '@/src/components/profile/ProfileHeader';
import { AboutSection } from '@/src/components/profile/AboutSection';
import { PortfolioSection } from '@/src/components/profile/PortfolioSection';
import SkillsSection from '@/src/components/profile/SkillsSection';
import LocationSection from '@/src/components/profile/LocationSection';
import type { LocationData } from '@/src/types/location';

export function ProfileContent() {
  const [editingAbout, setEditingAbout] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);

  const {
    user,
    setUser,
    aboutMe,
    setAboutMe,
    imageUrl,
    setImageUrl,
    skills,
    setSkills,
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
    handleSkillsSubmit,
    handleRemovePortfolioImage,
    handleRemoveVideo,
  } = useProfileActions({
    setUser,
    aboutMe,
    setPortfolioImages,
    setPortfolioVideo
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
      <LocationSection
        initialLocation={location}
        onLocationSelect={async (locationData) => {
          try {
            const response = await fetch('/api/profile/location', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(locationData),
            });
            if (!response.ok) throw new Error('Failed to update location');
            const updatedUser = await response.json();
            setUser(updatedUser);
            setLocation(locationData);
          } catch (error) {
            console.error('Failed to update location:', error);
            throw error;
          }
        }}
        allowedCountries={['US', 'CA']}
      />
      <SkillsSection 
        selectedSkills={skills} 
        onSkillsChange={async (newSkills) => {
          try {
            await handleSkillsSubmit(newSkills);
            setSkills(newSkills);
          } catch (error) {
            throw error;
          }
        }} 
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