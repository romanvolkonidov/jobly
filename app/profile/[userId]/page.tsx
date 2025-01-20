import { prisma } from '@/src/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, Briefcase, Globe, Award } from 'lucide-react';

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
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

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          <Image
            src={user.imageUrl || '/default-avatar.png'}
            alt={`${user.firstName} ${user.lastName}`}
            width={120}
            height={120}
            className="rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>{user.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-gray-500">({user.reviewCount} reviews)</span>
            </div>

            {user.completedTasks > 0 && (
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{user.completedTasks} tasks completed</span>
              </div>
            )}

            {user.yearsExperience && (
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Award className="w-4 h-4" />
                <span>{user.yearsExperience} years of experience</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* About Section */}
          {user.aboutMe && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600 whitespace-pre-line">{user.aboutMe}</p>
            </div>
          )}

          {/* Portfolio Section */}
          {(user.portfolioImages?.length > 0 || user.portfolioVideo) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
              {user.portfolioVideo && (
                <div className="mb-4">
                  <video
                    src={user.portfolioVideo}
                    controls
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              {user.portfolioImages && user.portfolioImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {user.portfolioImages.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Portfolio item ${index + 1}`}
                      width={300}
                      height={300}
                      className="rounded-lg object-cover aspect-square"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills Section */}
          {user.skills && user.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {user.languages && user.languages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Locations Section */}
          {user.locations && user.locations.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Locations</h2>
              <div className="space-y-2">
                {user.locations.map((location: any, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{location.address}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
