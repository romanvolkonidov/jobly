import { useState, useEffect, useCallback } from 'react';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import type { LocationData } from '@/src/types/location';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string | null;
      image?: string | null;
    }
  }
}

export function useProfileData() {
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const { status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [aboutMe, setAboutMe] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [portfolioVideo, setPortfolioVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile', { credentials: 'include' });
      if (response.status === 401) return;
      if (!response.ok) throw new Error('Failed to fetch profile data');

      const data = await response.json();
      if (!data) throw new Error('No user data received');

      setUser(data);
      setAboutMe(data.aboutMe || '');
      setImageUrl(data.imageUrl || '');
      setSkills(data.skills || []);
      setLanguages(data.languages || []);
      setLocations(data.locations || []);
      setPortfolioImages(data.portfolioImages || []);
      setPortfolioVideo(data.portfolioVideo || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, fetchUserData]);

  return {
    user,
    setUser,
    aboutMe,
    setAboutMe,
    imageUrl,
    skills,
    setSkills,
    languages,
    setLanguages,
    locations,
    setLocations,
    setImageUrl,
    portfolioImages,
    setPortfolioImages,
    portfolioVideo,
    setPortfolioVideo,
    isLoading,
    error,
  };
}