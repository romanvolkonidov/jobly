// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User } from '@prisma/client';
import { StarIcon } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutMe, setAboutMe] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Fetch user data
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      setUser(data);
      setAboutMe(data.aboutMe || '');
      setImageUrl(data.imageUrl || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAboutMeSubmit = async () => {
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aboutMe }),
      });
      setEditingAbout(false);
    } catch (error) {
      console.error('Error updating about me:', error);
    }
  };

  const handleWorkerStatusChange = async () => {
    try {
      await fetch('/api/profile/worker-status', {
        method: 'PUT',
      });
      fetchUserData();
    } catch (error) {
      console.error('Error updating worker status:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={imageUrl || '/default-avatar.png'}
            alt="Profile"
            fill
            className="rounded-full object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            Edit
          </label>
        </div>

        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, index) => (
            <StarIcon
              key={index}
              className={`w-6 h-6 ${
                user?.rating && index < user.rating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-gray-600">
            ({user?.rating?.toFixed(1) || '0.0'})
          </span>
        </div>

        <div className="w-full max-w-md mb-6">
          {editingAbout ? (
            <div>
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={4}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setEditingAbout(false)}
                  className="px-4 py-2 text-gray-600 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAboutMeSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditingAbout(true)}
              className="cursor-pointer p-4 border rounded-md hover:bg-gray-50"
            >
              <h3 className="font-semibold mb-2">About Me</h3>
              <p>{aboutMe || 'Click to add a description about yourself'}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleWorkerStatusChange}
          className={`px-6 py-3 text-lg font-semibold rounded-md ${
            user?.isWorker
              ? 'bg-gray-200 text-gray-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {user?.isWorker ? 'Worker Status Active' : 'Become a Worker'}
        </button>
      </div>
    </div>
  );
}