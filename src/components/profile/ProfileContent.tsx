'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Briefcase, Award } from 'lucide-react';
import { Suspense } from 'react';
import ViewResume from './ViewResume';
import ViewCompany from './ViewCompany';

interface ProfileContentProps {
  initialData: {
    firstName: string;
    lastName: string;
    imageUrl: string | null;
    rating: number | null;
    reviewCount: number;
    aboutMe: string | null;
    portfolioImages: string[];
    portfolioVideo: string | null;
    skills: string[];
    languages: string[];
    locations: any[];
    completedTasks: number;
    yearsExperience: number | null;
    taskRating: number | null;
  };
  userId: string;
}

export default function ProfileContent({ initialData, userId }: ProfileContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          <Image
            src={initialData.imageUrl || '/default-avatar.png'}
            alt={`${initialData.firstName} ${initialData.lastName}`}
            width={120}
            height={120}
            className="rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {initialData.firstName} {initialData.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>{initialData.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-gray-500">({initialData.reviewCount} reviews)</span>
            </div>
            {initialData.completedTasks > 0 && (
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{initialData.completedTasks} tasks completed</span>
              </div>
            )}
            {initialData.yearsExperience && (
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Award className="w-4 h-4" />
                <span>{initialData.yearsExperience} years of experience</span>
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
          {initialData.aboutMe && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600 whitespace-pre-line">{initialData.aboutMe}</p>
            </div>
          )}

          {/* Portfolio Section */}
          {(initialData.portfolioImages?.length > 0 || initialData.portfolioVideo) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
              {initialData.portfolioVideo && (
                <div className="mb-4">
                  <video
                    src={initialData.portfolioVideo}
                    controls
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              {initialData.portfolioImages && initialData.portfolioImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {initialData.portfolioImages.map((image, index) => (
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
          {initialData.skills && initialData.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {initialData.skills.map((skill, index) => (
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
          {initialData.languages && initialData.languages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {initialData.languages.map((language, index) => (
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
          {initialData.locations && initialData.locations.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Locations</h2>
              <div className="space-y-2">
                {initialData.locations.map((location: any, index) => (
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

      {/* Resume Section */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Professional Resume</h2>
            <Link
              href={`/api/resumes/download/${userId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              target="_blank"
            >
              Download PDF
            </Link>
          </div>
          <Suspense fallback={<div>Loading resume...</div>}>
            <ViewResume userId={userId} />
          </Suspense>
        </div>
      </div>

      {/* Company Profile Section */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Organization Profile</h2>
          <Suspense fallback={<div>Loading company profile...</div>}>
            <ViewCompany userId={userId} initialData={null} /> {/* Add initialData={null} */}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
