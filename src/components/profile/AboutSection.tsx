import toast from 'react-hot-toast';
import { useState } from 'react';

interface AboutSectionProps {
  aboutMe: string;
  editingAbout: boolean;
  setEditingAbout: (editing: boolean) => void;
  setAboutMe: (text: string) => void;
  onSubmit: () => Promise<void>;
}

export const AboutSection = ({
  aboutMe,
  editingAbout,
  setEditingAbout,
  setAboutMe,
  onSubmit
}: AboutSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    toast.promise(
      onSubmit(),
      {
        loading: 'Saving...',
        success: () => {
          setEditingAbout(false);
          return 'Saved successfully!';
        },
        error: 'Failed to save'
      }
    ).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">About Me</h2>
      {editingAbout ? (
        <div className="space-y-4">
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            placeholder="Tell others about yourself! Share your skills, experience, and what you enjoy doing."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditingAbout(false)}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
          <p>{aboutMe || 'Click to add a description about yourself'}</p>
        </div>
      )}
    </div>
  );
};