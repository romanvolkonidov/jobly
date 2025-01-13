import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Plus, X, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";

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

interface ResumeFormData {
  id?: string;
  title: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  skills: string[];
  languages: string[];
}

interface ResumeFormProps {
  onCancel: () => void;
}

export default function ResumeForm({ onCancel }: ResumeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal']));
  const [formData, setFormData] = useState<ResumeFormData>({
    title: '',
    summary: '',
    education: [] as Education[],
    experience: [] as Experience[],
    certifications: [] as Certification[],
    skills: [] as string[],
    languages: [] as string[]
  });

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      const response = await fetch('/api/resumes');
      if (!response.ok) throw new Error('Failed to fetch resume');
      const resumes = await response.json();
      if (resumes.length > 0) {
        setFormData(resumes[0]);
      }
    } catch (error) {
      toast.error('Failed to load resume data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save resume');
      const updatedResume = await response.json();
      setFormData(updatedResume);
      toast.success('Resume saved successfully!');
      onCancel(); // Call onCancel to return to ViewResume
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = useCallback((section: string, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    // Prevent toggling if clicking on or within form controls
    if (target.closest('input, textarea, select, button, label')) {
      return;
    }
    
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.has(section) ? newSet.delete(section) : newSet.add(section);
      return newSet;
    });
  }, []);

  const addItem = useCallback((type: 'education' | 'experience' | 'certification') => {
    const baseItem = {
      id: Date.now().toString(),
    };

    let newItem: Education | Experience | Certification;
    switch (type) {
      case 'education':
        newItem = {
          ...baseItem,
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: ''
        } as Education;
        setFormData(prev => ({
          ...prev,
          education: [...prev.education, newItem as Education]
        }));
        break;
        case 'experience':
          newItem = {
            ...baseItem,
            title: '',
            company: '',
            location: '', 
            startDate: '',
            endDate: '',
            current: false,
            description: ''
          } as Experience;
          break;
        setFormData(prev => ({
          ...prev,
          experience: [...prev.experience, newItem as Experience]
        }));
        break;
      case 'certification':
        newItem = {
          ...baseItem,
          name: '',
          issuer: '',
          issueDate: '',
          expiryDate: '',
          credentialId: ''
        } as Certification;
        setFormData(prev => ({
          ...prev,
          certifications: [...prev.certifications, newItem as Certification]
        }));
        break;
    }
  }, []);

  const updateItem = useCallback((
    type: 'education' | 'experience' | 'certification',
    id: string,
    updates: Partial<Education | Experience | Certification>
  ) => {
    const key = type === 'certification' ? 'certifications' : `${type}` as keyof ResumeFormData;
    
    setFormData(prev => {
      const items = prev[key] as Array<Education | Experience | Certification>;
      return {
        ...prev,
        [key]: items.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      };
    });
  }, []);

  const removeItem = useCallback((type: 'education' | 'experience' | 'certification', id: string) => {
    let key: keyof ResumeFormData;
    switch (type) {
      case 'education':
        key = 'education';
        break;
      case 'experience':
        key = 'experience';
        break;
      case 'certification':
        key = 'certifications';
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter(item => item.id !== id)
    }));
  }, []);

  const handleInputChange = useCallback((field: keyof ResumeFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTextAreaChange = useCallback((type: 'education' | 'experience' | 'certification', id: string, value: string) => {
    const key = type === 'certification' ? 'certifications' : `${type}` as keyof ResumeFormData;
    setFormData(prev => ({
      ...prev,
      [key]: (prev[key] as Array<{ id: string; description: string }>).map(item => 
        item.id === id ? { ...item, description: value } : item
      )
    }));
  }, []);

  // Helper components
  const Section = useMemo(() => {
    const SectionComponent = ({ title, children, name }: { title: string; children: React.ReactNode; name: string }) => (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
          onClick={e => toggleSection(name, e)}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          {expandedSections.has(name) ? <ChevronUp /> : <ChevronDown />}
        </div>
        <div className="section-content">
          {children}
        </div>
      </Card>
    );
    SectionComponent.displayName = 'Section';
    return SectionComponent;
  }, [expandedSections, toggleSection]);

  const Field = useMemo(() => {
    const FieldComponent = ({ label, value }: { label: string; value: string | null }) => (
      <div className="space-y-1 mb-4">
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="p-2 bg-gray-50 rounded-md">{value || 'Not provided'}</div>
      </div>
    );
    FieldComponent.displayName = 'Field';
    return FieldComponent;
  }, []);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Resume</h2>
      </div>

      <div className="space-y-6">
        <Section title="Professional Info" name="personal">
          <CardContent className={expandedSections.has('personal') ? 'block' : 'hidden'}>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Professional Title</label>
                <div onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Summary</label>
                <div onClick={e => e.stopPropagation()}>
                  <textarea
                    value={formData.summary}
                    onChange={e => handleInputChange('summary', e.target.value)}
                    className="w-full p-2 border rounded-md h-32"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Section>

        {/* Education Section */}
        <Section title="Education" name="education">
          <CardContent className={expandedSections.has('education') ? 'block' : 'hidden'}>
            <div className="p-4 space-y-4">
              {formData.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-lg relative">
                  <button
                    onClick={() => removeItem('education', edu.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid gap-4">
                    <div onClick={e => e.stopPropagation()}>
                      <input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={e => updateItem('education', edu.id, { institution: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={e => updateItem('education', edu.id, { degree: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={e => updateItem('education', edu.id, { field: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={edu.startDate}
                        onChange={e => updateItem('education', edu.id, { startDate: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="date"
                        value={edu.endDate}
                        onChange={e => updateItem('education', edu.id, { endDate: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div onClick={e => e.stopPropagation()}>
                      <textarea
                        placeholder="Description"
                        value={edu.description}
                        onChange={e => handleTextAreaChange('education', edu.id, e.target.value)}
                        className="w-full p-2 border rounded-md h-24"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem('education')}
                className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded-md w-full justify-center border border-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>
          </CardContent>
        </Section>

        {/* Experience Section */}
        <Section title="Work Experience" name="experience">
          <CardContent className={expandedSections.has('experience') ? 'block' : 'hidden'}>
            <div className="p-4 space-y-4">
              {formData.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border rounded-lg relative">
                  <button
                    onClick={() => removeItem('experience', exp.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={e => updateItem('experience', exp.id, { title: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        placeholder="Company"
                        value={exp.company}
                        onChange={e => updateItem('experience', exp.id, { company: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <input
                      placeholder="Location"
                      value={exp.location}
                      onChange={e => updateItem('experience', exp.id, { location: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={e => updateItem('experience', exp.id, { startDate: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <div className="flex gap-4">
                        <input
                          type="date"
                          value={exp.endDate}
                          onChange={e => updateItem('experience', exp.id, { endDate: e.target.value })}
                          disabled={exp.current}
                          className="w-full p-2 border rounded-md"
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={e => updateItem('experience', exp.id, { current: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          Current
                        </label>
                      </div>
                    </div>
                    <textarea
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) => handleTextAreaChange('experience', exp.id, e.target.value)}
                      className="w-full p-2 border rounded-md h-24"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem('experience')}
                className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded-md w-full justify-center border border-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
          </CardContent>
        </Section>

        {/* Certifications Section */}
        <Section title="Certifications" name="certifications">
          <CardContent className={expandedSections.has('certifications') ? 'block' : 'hidden'}>
            <div className="p-4 space-y-4">
              {formData.certifications.map((cert) => (
                <div key={cert.id} className="p-4 border rounded-lg relative">
                  <button
                    onClick={() => removeItem('certification', cert.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="Certification Name"
                        value={cert.name}
                        onChange={e => updateItem('certification', cert.id, { name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        placeholder="Issuing Organization"
                        value={cert.issuer}
                        onChange={e => updateItem('certification', cert.id, { issuer: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={cert.issueDate}
                        onChange={e => updateItem('certification', cert.id, { issueDate: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="date"
                        value={cert.expiryDate}
                        onChange={e => updateItem('certification', cert.id, { expiryDate: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <input
                      placeholder="Credential ID"
                      value={cert.credentialId}
                      onChange={e => updateItem('certification', cert.id, { credentialId: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem('certification')}
                className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded-md w-full justify-center border border-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Certification
              </button>
            </div>
          </CardContent>
        </Section>

        {/* Skills & Languages */}
        <Section title="Skills & Languages" name="skills">
          <CardContent className={expandedSections.has('skills') ? 'block' : 'hidden'}>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Skills (comma-separated)</label>
                <div onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={e => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Languages (comma-separated)</label>
                <div onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={formData.languages.join(', ')}
                    onChange={e => handleInputChange('languages', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., English, Spanish, French"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Section>

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => {
              fetchResumeData();
              onCancel();
            }}
            disabled={isSubmitting}
            className="px-6 py-2 text-gray-600 border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}