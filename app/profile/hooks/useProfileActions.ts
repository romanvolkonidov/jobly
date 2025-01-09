// app/profile/hooks/useProfileActions.ts
import { useState } from 'react';
import { ProfileActionsProps } from './types';

export function useProfileActions({ 
  setUser, aboutMe, setPortfolioImages, setPortfolioVideo 
}: ProfileActionsProps) {
  const [editingAbout, setEditingAbout] = useState(false);

  const handleAboutMeSubmit = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aboutMe }),
        credentials: 'include',
      });

      if (response.status === 401) return;
      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      setUser(data);
      setEditingAbout(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const handleSkillsSubmit = async (newSkills: string[]) => {
    try {
      const response = await fetch('/api/profile/skillsSave', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: newSkills }),
        credentials: 'include',
      });
  
      if (response.status === 401) return;
      if (!response.ok) throw new Error('Failed to save skills');
      
      const data = await response.json();
      setUser(data); // Add this line to update client state
      
    } catch (error) {
      console.error('Failed to save skills:', error);
      throw error;
    }
  };

  const handleRemovePortfolioImage = async (imageUrl: string) => {
    try {
      const response = await fetch('/api/profile/portfolio-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
        credentials: 'include',
      });

      if (response.status === 401) return;
      if (!response.ok) throw new Error('Failed to remove image');

      setPortfolioImages(prev => prev.filter(img => img !== imageUrl));
    } catch (error) {
      console.error('Failed to remove image:', error);
      throw error;
    }
  };

  const handleRemoveVideo = async () => {
    try {
      const response = await fetch('/api/profile/portfolio-video', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.status === 401) return;
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove video');
      }

      setPortfolioVideo(null);
    } catch (error) {
      console.error('Failed to remove video:', error);
      throw error;
    }
  };

  return {
    editingAbout,
    setEditingAbout,
    handleAboutMeSubmit,
    handleSkillsSubmit,
    handleRemovePortfolioImage,
    handleRemoveVideo
  };
}