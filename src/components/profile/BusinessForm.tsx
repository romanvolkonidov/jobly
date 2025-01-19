import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Plus, X, Upload, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";

interface BusinessForm {
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
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface BusinessFormProps {
  onCancel: () => void;
}

const BusinessForm = ({ onCancel }: BusinessFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic'])
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusinessForm>({
    logo: null,
    name: '',
    description: '',
    registrationNumber: '',
    website: '',
    industry: '',
    email: '',
    phone: '',
    yearEstablished: '',
    size: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  });

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }

      const companies = await response.json();
      if (companies.length > 0) {
        setFormData(companies[0]);
        setLogo(companies[0].logo || null);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load company data';
      console.error('Error fetching company data:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchCompanyData();
    return () => controller.abort();
  }, []);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      // First upload the logo
      const uploadResponse = await fetch('/api/companies/upload-logo', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload logo');
      }

      const { url } = await uploadResponse.json();
      
      // Update the logo in state and form data
      setLogo(url);
      setFormData(prev => ({ ...prev, logo: url }));
      
    } catch (error) {
      console.error('Failed to upload logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleTextAreaChange = useCallback((
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSocialMediaChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    platform: 'linkedin' | 'twitter' | 'facebook'
  ) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: e.target.value
      }
    }));
  }, []);

  const validateForm = useCallback(() => {
    const requiredFields = ['name', 'description', 'industry', 'email', 'phone', 'registrationNumber', 'size'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof BusinessForm]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        ...formData,
        logo,
        yearEstablished: formData.yearEstablished ? parseInt(formData.yearEstablished) : null,
      };
  
      const method = formData.id ? 'PUT' : 'POST';
      const response = await fetch('/api/companies', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
  
      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to save company profile');
      }
  
      const updatedCompany = await response.json();
      setFormData(updatedCompany);
      setLogo(updatedCompany.logo);
      toast.success('Company profile saved successfully!');
      onCancel(); // Call onCancel to return to ViewCompany
    } catch (error) {
      console.error('Failed to save company profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save company profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Section = useMemo(() => {
    const SectionComponent = ({ title, children, section }: { title: string; children: React.ReactNode; section: string }) => (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
          onClick={(e) => toggleSection(section, e)}
        >
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {expandedSections.has(section) ? <ChevronUp /> : <ChevronDown />}
        </div>
        <div className="section-content">
          {children}
        </div>
      </Card>
    );
    SectionComponent.displayName = 'Section';
    return SectionComponent;
  }, [expandedSections, toggleSection]);

  const FormField = useMemo(() => {
    const FormFieldComponent = ({ 
      label, 
      children, 
      required = false 
    }: { 
      label: string; 
      children: React.ReactNode;
      required?: boolean;
    }) => (
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
    FormFieldComponent.displayName = 'FormField';
    return FormFieldComponent;
  }, []);

  const DisplayField = useMemo(() => {
    const DisplayFieldComponent = ({ label, value }: { label: string; value: string | number | null }) => (
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="p-2 bg-gray-50 rounded-md">{value || 'Not provided'}</div>
      </div>
    );
    DisplayFieldComponent.displayName = 'DisplayField';
    return DisplayFieldComponent;
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Company Profile</h2>
      </div>

      <Section title="Basic Information" section="basic">
        <CardContent className={expandedSections.has('basic') ? 'block' : 'hidden'}>
          <div className="space-y-6 p-4">
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                {logo ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={logo}
                      alt="Company logo"
                      fill
                      sizes="128px"
                      className="object-cover rounded-lg border border-gray-200"
                      unoptimized={logo?.startsWith('http') || logo?.startsWith('/')}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogo(null);
                        setFormData(prev => ({ ...prev, logo: null }));
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isUploading}
                    />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Logo</span>
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <FormField label="Company Name" required>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Acme Corporation"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>

              <FormField label="Company Description" required>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleTextAreaChange}
                  placeholder="Describe your company's mission, values, and what makes it unique..."
                  className="w-full p-2 border rounded-md h-32 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Industry" required>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g., Technology"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                  />
                </FormField>
                
                <FormField label="Year Established">
                  <input
                    type="number"
                    name="yearEstablished"
                    value={formData.yearEstablished}
                    onChange={handleInputChange}
                    placeholder="e.g., 2020"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                  />
                </FormField>
              </div>
            </div>
          </div>
        </CardContent>
      </Section>

      <Section title="Contact Information" section="contact">
        <CardContent className={expandedSections.has('contact') ? 'block' : 'hidden'}>
          <div className="space-y-4 p-4">
            <div className="grid gap-4">
              <FormField label="Business Email" required>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g., contact@company.com"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>

              <FormField label="Business Phone" required>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +1 (555) 123-4567"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>

              <FormField label="Website URL">
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="e.g., https://www.company.com"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Section>

      <Section title="Legal Information" section="legal">
        <CardContent className={expandedSections.has('legal') ? 'block' : 'hidden'}>
          <div className="space-y-4 p-4">
            <div className="grid gap-4">
              <FormField label="Business Registration Number" required>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., LLC-123456"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>

              <FormField label="Company Size" required>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                >
                  <option value="">Select Company Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </FormField>

              <FormField label="Tax ID">
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="Tax ID (Optional)"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Section>

      <Section title="Social Media" section="social">
        <CardContent className={expandedSections.has('social') ? 'block' : 'hidden'}>
          <div className="space-y-4 p-4">
            <div className="grid gap-4">
              <FormField label="LinkedIn Company Page">
                <input
                  type="url"
                  value={formData.socialMedia?.linkedin || ''}
                  onChange={(e) => handleSocialMediaChange(e, 'linkedin')}
                  placeholder="e.g., https://linkedin.com/company/acme"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>

              <FormField label="Twitter Profile">
                <input
                  type="url"
                  value={formData.socialMedia?.twitter || ''}
                  onChange={(e) => handleSocialMediaChange(e, 'twitter')}
                  placeholder="e.g., https://twitter.com/acme"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>

              <FormField label="Facebook Page">
                <input
                  type="url"
                  value={formData.socialMedia?.facebook || ''}
                  onChange={(e) => handleSocialMediaChange(e, 'facebook')}
                  placeholder="e.g., https://facebook.com/acme"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Section>

      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={() => {
            fetchCompanyData();
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
          className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default memo(BusinessForm);