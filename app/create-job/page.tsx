'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CreateVacancyPage() {
  const [formData, setFormData] = useState({
    title: '',
    employmentType: '',
    location: '',
    isRemote: false,
    description: '',
    responsibilities: '',
    qualifications: '',
    skills: '',
    benefits: '',
    salaryMin: '',
    salaryMax: '',
    applicationDeadline: '',
    requiredDocuments: {
      cv: true,
      coverLetter: false,
      certificates: false,
    },
    languages: {
      english: true,
      other: '',
    },
  });

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/vacancies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create vacancy');

      toast.success('Vacancy posted successfully!');
      router.push('/dashboard/vacancies');
    } catch (error) {
      toast.error('Failed to post vacancy');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6">Post a Vacancy</h1>

        <div className="space-y-6">
          {/* Basic Details */}
          <section>
            <h2 className="text-xl font-medium mb-4">Basic Details</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-3 border rounded"
              />

              <select
                value={formData.employmentType}
                onChange={(e) =>
                  setFormData({ ...formData, employmentType: e.target.value })
                }
                className="w-full p-3 border rounded"
              >
                <option value="">Select Employment Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="flex-1 p-3 border rounded"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isRemote}
                    onChange={(e) =>
                      setFormData({ ...formData, isRemote: e.target.checked })
                    }
                  />
                  Remote Available
                </label>
              </div>
            </div>
          </section>

          {/* Job Details */}
          <section>
            <h2 className="text-xl font-medium mb-4">Job Details</h2>
            <div className="space-y-4">
              <textarea
                placeholder="Job Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border rounded min-h-[100px]"
              />

              <textarea
                placeholder="Key Responsibilities"
                value={formData.responsibilities}
                onChange={(e) =>
                  setFormData({ ...formData, responsibilities: e.target.value })
                }
                className="w-full p-3 border rounded min-h-[100px]"
              />

              <textarea
                placeholder="Required Qualifications"
                value={formData.qualifications}
                onChange={(e) =>
                  setFormData({ ...formData, qualifications: e.target.value })
                }
                className="w-full p-3 border rounded min-h-[100px]"
              />
            </div>
          </section>

          {/* Compensation */}
          <section>
            <h2 className="text-xl font-medium mb-4">Compensation</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Minimum Salary"
                  value={formData.salaryMin}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMin: e.target.value })
                  }
                  className="flex-1 p-3 border rounded"
                />
                <input
                  type="number"
                  placeholder="Maximum Salary"
                  value={formData.salaryMax}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMax: e.target.value })
                  }
                  className="flex-1 p-3 border rounded"
                />
              </div>

              <textarea
                placeholder="Benefits & Perks"
                value={formData.benefits}
                onChange={(e) =>
                  setFormData({ ...formData, benefits: e.target.value })
                }
                className="w-full p-3 border rounded"
              />
            </div>
          </section>

          {/* Application Requirements */}
          <section>
            <h2 className="text-xl font-medium mb-4">
              Application Requirements
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requiredDocuments.cv}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requiredDocuments: {
                          ...formData.requiredDocuments,
                          cv: e.target.checked,
                        },
                      })
                    }
                  />
                  CV Required
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requiredDocuments.coverLetter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requiredDocuments: {
                          ...formData.requiredDocuments,
                          coverLetter: e.target.checked,
                        },
                      })
                    }
                  />
                  Cover Letter
                </label>
              </div>

              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    applicationDeadline: e.target.value,
                  })
                }
                className="w-full p-3 border rounded"
              />
            </div>
          </section>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
            >
              Post Vacancy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
