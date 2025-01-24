'use client';
import { Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProfileContent } from './ProfileContent';
import { ProfileSkeleton } from '@/src/components/skeletons/ProfileSkeleton';

// Prefetch data URLs
const PREFETCH_URLS = [
  '/api/profile',
  '/api/resumes',
  '/api/companies',
  '/api/categories',
  '/api/profile/portfolio-image',
  '/api/profile/location'
];

export default function ProfilePage() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login');
    },
  });

  // Prefetch resources
  useEffect(() => {
    // Prefetch API data
    PREFETCH_URLS.forEach(url => {
      fetch(url, { priority: 'high' });
    });

    // Prefetch related pages
    router.prefetch('/settings');
    router.prefetch('/dashboard');
  }, [router]);

  if (status === "loading") {
    return <ProfileSkeleton />;
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}