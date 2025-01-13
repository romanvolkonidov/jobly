import { useState } from 'react';
import { useProfileData } from './hooks/useProfileData';
import { useMediaUpload } from './hooks/useMediaUpload';
import { useProfileActions } from './hooks/useProfileActions';
import { ProfileHeader } from '@/src/components/profile/ProfileHeader';
import { AboutSection } from '@/src/components/profile/AboutSection';
import  PortfolioSection  from '@/src/components/profile/PortfolioSection';
import SkillsSection from '@/src/components/profile/SkillsSection';
import LanguageSection from '@/src/components/profile/LanguageSection';
import LocationSection from '@/src/components/profile/LocationSection';
import type { LocationData } from '@/src/types/location';
import ProfileActions from '@/src/components/profile/ProfileActions';

interface Props {

  initialLocations: LocationData[];

  onLocationSelect: (locationData: LocationData[]) => Promise<void>;

}

export function ProfileContent() {
  const [editingAbout, setEditingAbout] = useState(false);
  const [userLocations, setUserLocations] = useState<LocationData[]>([]);

  const {
    user,
    setUser,
    aboutMe,
    setAboutMe,
    imageUrl,
    setImageUrl,
    skills,
    setSkills,
    languages,
    setLanguages,
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
    handleLanguagesSubmit,
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
        initialLocations={userLocations}
        onLocationSelect={async (locationData: LocationData[]) => {
          try {
            const response = await fetch('/api/profile/location', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ locations: locationData }),
            });
            if (!response.ok) throw new Error('Failed to update location');
            const updatedUser = await response.json();
            setUser(updatedUser);
            setUserLocations(locationData);
          } catch (error) {
            console.error('Failed to update location:', error);
            throw error;
          }
        }}
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
      <LanguageSection 
        selectedLanguages={languages} 
        onLanguagesChange={async (newLanguages) => {
          try {
            await handleLanguagesSubmit(newLanguages);
            setLanguages(newLanguages);
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
      <ProfileActions />

    </div>
  );
}