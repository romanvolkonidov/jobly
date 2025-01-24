import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { FileText, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import ResumeForm from './ResumeForm';
import ViewResume from './ViewResume';
import BusinessForm from './BusinessForm';
import ViewCompany from './ViewCompany';
import { useSession } from 'next-auth/react';

export default function ProfileActions() {
 const { data: session } = useSession();
 const [expandedSection, setExpandedSection] = useState<string | null>(null);
 const [isEditingResume, setIsEditingResume] = useState(false);
 const [isEditingCompany, setIsEditingCompany] = useState(false);

 useEffect(() => {
   const sectionToExpand = localStorage.getItem('expandProfileSection');
   if (sectionToExpand) {
     setExpandedSection(sectionToExpand);
     setTimeout(() => {
       const element = document.getElementById(`profile-section-${sectionToExpand}`);
       if (element) {
         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
       }
     }, 100);
     localStorage.removeItem('expandProfileSection');
   }
 }, []);

 const toggleSection = (section: 'resume' | 'business') => {
   if (section !== expandedSection) {
     setExpandedSection(section);
     setIsEditingResume(false);
     setIsEditingCompany(false);
   } else {
     setExpandedSection(null);
     setIsEditingResume(false);
     setIsEditingCompany(false);
   }
 };

 return (
   <div>
     <div className="grid md:grid-cols-2 gap-6 mb-6">
       <Card id="profile-section-resume" className="relative overflow-hidden">
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
                 <h3 className="text-lg font-semibold mb-2">Enhance Your Professional Profile</h3>
                 <p className="text-gray-600">
                   Stand out by adding your professional experience and qualifications. A complete profile can help you win more projects and build trust with clients.
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
                 <h3 className="text-lg font-semibold mb-2">Fill out Your Business Profile</h3>
                 <p className="text-gray-600">
                   Do you own or represent a company? Let other know! Represent your company on the marketplace. Choose between personal and business accounts as you are offering or requesting services.
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

     {expandedSection && (
       <div className="border rounded-lg mt-4">
         <CardContent className="p-6">
           {expandedSection === 'resume' ? (
             isEditingResume ? (
               <ResumeForm onCancel={() => setIsEditingResume(false)} />
             ) : (
               <ViewResume 
                 userId={session?.user?.id} 
                 onEdit={() => setIsEditingResume(true)} 
               />
             )
           ) : (
             isEditingCompany ? (
               <BusinessForm onCancel={() => setIsEditingCompany(false)} />
             ) : session?.user?.id ? (
               <ViewCompany 
                 userId={session.user.id}
                 onEdit={() => setIsEditingCompany(true)}
               />
             ) : null
           )}
         </CardContent>
       </div>
     )}
   </div>
 );
}