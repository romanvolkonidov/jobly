import { prisma } from '@/src/lib/prisma';
import { notFound } from 'next/navigation';
import ProfileContent from '@/src/components/profile/ProfileContent';
import { cache } from 'react';

// Cache the user fetch to prevent multiple database calls
const getUser = cache(async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        imageUrl: true,
        rating: true,
        reviewCount: true,
        aboutMe: true,
        portfolioImages: true,
        portfolioVideo: true,
        skills: true,
        languages: true,
        locations: true,
        completedTasks: true,
        yearsExperience: true,
        taskRating: true,
      },
    });

    if (!user) return null;
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
});

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const user = await getUser(params.userId);

  if (!user) {
    notFound();
  }

  // Ensure all required fields have default values
  const userData = {
    ...user,
    imageUrl: user.imageUrl || null,
    rating: user.rating || null,
    reviewCount: user.reviewCount || 0,
    aboutMe: user.aboutMe || null,
    portfolioImages: user.portfolioImages || [],
    portfolioVideo: user.portfolioVideo || null,
    skills: user.skills || [],
    languages: user.languages || [],
    locations: user.locations || [],
    completedTasks: user.completedTasks || 0,
    yearsExperience: user.yearsExperience || null,
    taskRating: user.taskRating || null,
  };

  return <ProfileContent initialData={userData} userId={params.userId} />;
}

// Add revalidation to prevent stale data
export const revalidate = 60; // Revalidate every 60 seconds
