import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import Image from 'next/image';

interface Profile {
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  locations: string[];
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

interface ResumeData {
  title: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  skills: string[];
  languages: string[];
}

interface ViewResumeProps {
  onEdit: () => void;
  initialData?: ResumeData | null;
}

const ViewResume: React.FC<ViewResumeProps> = ({ onEdit, initialData = null }) => {
  const [data, setData] = useState<ResumeData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          setProfile(await response.json());
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    fetchProfile();
  }, []);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/resumes');
        if (!response.ok) throw new Error('Failed to fetch resume');
        const resumes = await response.json();
        if (resumes.length > 0) {
          setData(resumes[0]);
        }
      } catch (error) {
        console.error('Error loading resume:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!data) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <p className="text-gray-600">No resume data available.</p>
      <button
        onClick={onEdit}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
      >
        <Edit className="w-4 h-4" /> Create Resume
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 -mx-8 p-8">
        <div className="flex items-center gap-8">
          {profile?.imageUrl && (
            <img 
              src={profile.imageUrl} 
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
          )}
          <div className="text-white">
            <h1 className="text-3xl font-bold">{profile?.firstName} {profile?.lastName}</h1>
            <h2 className="text-xl mt-1 opacity-90">{data.title}</h2>
            <div className="mt-2 text-sm opacity-75">
              {profile?.email}
              {profile?.locations && profile.locations.length > 0 && ` • ${profile.locations[0]}`}
            </div>
          </div>
          <button
            onClick={onEdit}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20"
          >
            <Edit className="w-4 h-4" /> Edit Resume
          </button>
        </div>
      </div>

      <div className="mt-8">
        {data.summary && (
          <p className="text-gray-600 max-w-2xl mb-8">{data.summary}</p>
        )}

        {data.experience?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Professional Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="pl-4 border-l-2 border-gray-200">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg text-gray-900">{exp.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-gray-700">{exp.company} • {exp.location}</p>
                  <p className="mt-2 text-gray-600 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="pl-4 border-l-2 border-gray-200">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg text-gray-900">{edu.institution}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-gray-700">{edu.degree} in {edu.field}</p>
                  {edu.description && <p className="mt-2 text-gray-600">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuer}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
                  </p>
                  {cert.credentialId && <p className="text-sm text-gray-600 mt-1">ID: {cert.credentialId}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {(data.skills?.length > 0 || data.languages?.length > 0) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.skills?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.languages?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {data.languages.map((language, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ViewResume;