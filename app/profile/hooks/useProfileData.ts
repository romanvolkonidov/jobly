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

interface Resume {
 id: string;
 title: string;
 summary: string;
 education: Education[];
 experience: Experience[];
 certifications: Certification[];
 skills: string[];
 languages: string[];
 resumeUrl?: string;
}

interface Education {
 id: string;
 institution: string;
 degree: string;
 field: string;
 startDate: string;
 endDate: string;
 description: string;
}

interface Experience {
 id: string; 
 title: string;
 company: string;
 location: string;
 startDate: string;
 endDate: string;
 current: boolean;
 description: string;
}

interface Certification {
 id: string;
 name: string;
 issuer: string;
 issueDate: string;
 expiryDate?: string;
 credentialId?: string;
}

export function useProfileData() {
 const [skills, setSkills] = useState<string[]>([]);
 const [languages, setLanguages] = useState<string[]>([]);
 const [locations, setLocations] = useState<LocationData[]>([]);
 const { data: session, status } = useSession();
 const [user, setUser] = useState<User | null>(null);
 const [aboutMe, setAboutMe] = useState('');
 const [imageUrl, setImageUrl] = useState('');
 const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
 const [portfolioVideo, setPortfolioVideo] = useState<string | null>(null);
 const [resume, setResume] = useState<Resume | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const fetchUserData = useCallback(async () => {
   if (!session?.user?.id) return;
   
   try {
     setIsLoading(true);
     const [profileResponse, resumeResponse] = await Promise.all([
       fetch('/api/profile', { credentials: 'include' }),
       fetch(`/api/resumes/user/${session.user.id}`, { credentials: 'include' })
     ]);

     if (!profileResponse.ok) throw new Error('Failed to fetch profile data');
     const profileData = await profileResponse.json();
     const resumeData = await resumeResponse.json();

     setUser(profileData);
     setAboutMe(profileData.aboutMe || '');
     setImageUrl(profileData.imageUrl || '');
     setSkills(profileData.skills || []);
     setLanguages(profileData.languages || []);
     setLocations(profileData.locations || []);
     setPortfolioImages(profileData.portfolioImages || []);
     setPortfolioVideo(profileData.portfolioVideo || null);
     setResume(resumeData);

   } catch (err) {
     setError(err instanceof Error ? err.message : 'An error occurred');
   } finally {
     setIsLoading(false);
   }
 }, [session?.user?.id]);

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
   resume,
   setResume,
   isLoading,
   error,
 };
}