import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@/components/ui/dialog';
import  Button  from '@/src/components/ui/Button';
import { Task } from '@/src/types/task';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { validateFile } from '@/src/lib/uploadFile';
import { X, MapPin, Building, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';

interface VacancyModalProps {
  vacancy: Task;
  onClose: () => void;
}

export const VacancyModal = ({ vacancy, onClose }: VacancyModalProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const goToProfileResume = () => {
    localStorage.setItem('expandProfileSection', 'resume');
    // Close the modal before navigation
    onClose();
    router.push('/profile');
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [files, setFiles] = useState<{ cv?: File; coverLetterFile?: File }>({});

  const requiredDocs = vacancy.requiredDocuments as {
    cv: boolean;
    coverLetter: boolean;
    certificates: boolean;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        validateFile(file);
        setFiles(prev => ({
          ...prev,
          [e.target.name]: file
        }));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid file';
        toast.error(message);
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleSubmit = async () => {
    if (!session) {
      toast.error('Please sign in to apply');
      return;
    }

    if (requiredDocs.cv && !files.cv) {
      toast.error('CV is required');
      return;
    }

    if (requiredDocs.coverLetter && !coverLetter && !files.coverLetterFile) {
      toast.error('Cover letter is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('vacancyId', vacancy.id);
      if (files.cv) formData.append('cv', files.cv);
      if (files.coverLetterFile) {
        formData.append('coverLetterFile', files.coverLetterFile);
      } else if (coverLetter) {
        formData.append('coverLetter', coverLetter);
      }

      const response = await fetch('/api/applications/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit application');

      toast.success('Application submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose} className="max-w-3xl">
      <div className="relative p-6">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="pr-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-semibold">{vacancy.title}</h2>
            <Badge variant={vacancy.status === 'open' ? 'default' : 'secondary'}>
              {vacancy.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              <span>{vacancy.employmentType}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{vacancy.isRemote ? 'Remote' : vacancy.location}</span>
            </div>
            {vacancy.applicationDeadline && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {new Date(vacancy.applicationDeadline).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Posted: {new Date(vacancy.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Salary Range Card */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">Salary Range</h3>
            <p className="text-2xl font-bold text-green-700">
              {vacancy.salaryMin && vacancy.salaryMax
                ? `KES ${vacancy.salaryMin.toLocaleString()} - ${vacancy.salaryMax.toLocaleString()}`
                : 'Negotiable'}
            </p>
          </div>

          {/* Rest of the content */}
          <div className="space-y-6 divide-y">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="whitespace-pre-wrap">{vacancy.description}</p>
            </div>

            {vacancy.responsibilities && (
              <div>
                <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
                <p className="whitespace-pre-wrap">{vacancy.responsibilities}</p>
              </div>
            )}

            {vacancy.qualifications && (
              <div>
                <h3 className="text-lg font-medium mb-2">Qualifications</h3>
                <p className="whitespace-pre-wrap">{vacancy.qualifications}</p>
              </div>
            )}

            {vacancy.benefits && (
              <div>
                <h3 className="text-lg font-medium mb-2">Benefits</h3>
                <p className="whitespace-pre-wrap">{vacancy.benefits}</p>
              </div>
            )}
          </div>

          {/* Application section */}
          {session ? (
            <div className="space-y-4 border-t pt-4">
              {requiredDocs.cv && (
                <div>
                  <label className="block mb-2">
                    CV (Required)
                    <input
                      type="file"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="mt-1 block w-full"
                    />
                  </label>
                  <button 
                    onClick={goToProfileResume}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Or complete your profile resume
                  </button>
                </div>
              )}

              {requiredDocs.coverLetter && (
                <div>
                  <label className="block mb-2">
                    Cover Letter (Required)
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="mt-1 block w-full border rounded-md p-2"
                      rows={6}
                      placeholder="Type your cover letter here..."
                    />
                  </label>
                  <div className="mt-2">
                    <label className="block">
                      Or upload cover letter file:
                      <input
                        type="file"
                        name="coverLetterFile"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="mt-1 block w-full"
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Ready to Apply?</h3>
              <p className="text-gray-600 mb-4">Please sign in to submit your application</p>
              <Button onClick={() => router.push('/signin')}>
                Sign In to Apply
              </Button>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
