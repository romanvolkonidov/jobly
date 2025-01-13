import React, { useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { FileText, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import ResumeForm from './ResumeForm';
import BusinessForm from './BusinessForm';

const ProfileActions = () => {
  const [expandedSection, setExpandedSection] = useState<'resume' | 'business' | null>(null);

  const toggleSection = (section: 'resume' | 'business') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div>
      {/* Cards Container */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Resume Card */}
        <Card className="relative overflow-hidden">
          <CardContent 
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={() => toggleSection('resume')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Enhance Your Professional Profile
                  </h3>
                  <p className="text-gray-600">
                    Stand out by adding your professional experience and
                    qualifications. A complete profile can help you win more
                    projects and build trust with clients.
                  </p>
                </div>
              </div>
              {expandedSection === 'resume' ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Card */}
        <Card className="relative overflow-hidden">
          <CardContent 
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={() => toggleSection('business')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Fill out Your Business Profile
                  </h3>
                  <p className="text-gray-600">
                    Do you own or represent a company? Let other know! Represent your company on the marketplace. Choose  between
                    personal and business accounts as you are offering or requesting
                    services.
                  </p>
                </div>
              </div>
              {expandedSection === 'business' ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expanded Forms Container */}
      {expandedSection && (
        <div className="border rounded-lg mt-4">
          <CardContent className="p-6">
            {expandedSection === 'resume' ? <ResumeForm /> : <BusinessForm />}
          </CardContent>
        </div>
      )}
    </div>
  );
};

export default ProfileActions;  