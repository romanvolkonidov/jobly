'use client';

import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import Image from 'next/image';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
}

interface ViewCompanyProps {
  userId: string;
  onEdit?: () => void; // Make onEdit optional
  initialData?: BusinessData | null;
}

interface BusinessData {
  id?: string;
  logo: string | null;
  name: string;
  description: string;
  registrationNumber: string;
  website: string;
  industry: string;
  email: string;
  phone: string;
  yearEstablished: string;
  size: string;
  taxId?: string;
  locations?: string[]; // Add locations array
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

const ViewCompanyComponent: React.FC<ViewCompanyProps> = ({
  onEdit,
  userId,
  initialData = null,
}) => {
  const [data, setData] = useState<BusinessData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
   
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (response.ok) {
          setProfile(await response.json());
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
   
    fetchProfile();
   }, [userId]);
   
   useEffect(() => {
    if (!userId) return;
   
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/companies/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch company');
        const company = await response.json();
        setData(company);
      } catch (error) {
        console.error('Error loading company:', error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
   
    if (!initialData) {
      fetchData();
    } else {
      setData(initialData);
      setIsLoading(false);
    }
   }, [initialData, userId]);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!data?.id) return (  // Only check for id instead of name and description
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <p className="text-gray-600">No company profile available.</p>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50"
        >
          <Edit className="w-4 h-4" /> Create Company Profile
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 -mx-8 p-8">
        <div className="flex items-center gap-8">
          {data.logo && (
            <div className="relative w-24 h-24">
              <Image
                src={data.logo}
                alt="Company Logo"
                fill
                className="rounded-lg border-4 border-white object-cover"
              />
            </div>
          )}
          <div className="text-white flex-grow">
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <h2 className="text-xl mt-1 opacity-90">{data.industry}</h2>
            <div className="mt-2 text-sm opacity-75">
              {data.yearEstablished && `Est. ${data.yearEstablished}`}
              {data.locations && data.locations[0] && ` • ${data.locations[0]}`}
            </div>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {data.description && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              About Us
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
              {data.description}
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              {data.email && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-gray-800">{data.email}</p>
                </div>
              )}
              {data.phone && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="text-gray-800">{data.phone}</p>
                </div>
              )}
              {data.website && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Website</h3>
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {data.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Company Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Size</h3>
                <p className="text-gray-800">{data.size}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Registration Number
                </h3>
                <p className="text-gray-800">{data.registrationNumber}</p>
              </div>
              {data.taxId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tax ID</h3>
                  <p className="text-gray-800">{data.taxId}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {data.socialMedia && Object.values(data.socialMedia).some(Boolean) && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Social Media
            </h2>
            <div className="flex flex-wrap gap-4">
              {data.socialMedia.linkedin && (
                <a
                  href={data.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                >
                  LinkedIn
                </a>
              )}
              {data.socialMedia.twitter && (
                <a
                  href={data.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                >
                  Twitter
                </a>
              )}
              {data.socialMedia.facebook && (
                <a
                  href={data.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                >
                  Facebook
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ViewCompanyComponent;