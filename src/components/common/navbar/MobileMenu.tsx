'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { withLazyLoading } from '@/src/components/common/Performance';
import { useRouter } from 'next/navigation';

interface MobileMenuProps {
 closeAction: () => void;
 imageUrl: string;
}

function MobileMenu({ closeAction, imageUrl }: MobileMenuProps) {
 const router = useRouter();
 const { data: session } = useSession();
 const isAuthenticated = !!session;

 const handleNavigation = (path: string) => {
   closeAction();
   setTimeout(() => {
     router.push(path);
   }, 300); // Match animation duration
 };

 return (
   <motion.div
     initial={{ x: '100%' }}
     animate={{ x: 0 }}
     exit={{ x: '100%' }}
     transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
     className="fixed inset-0 z-50 bg-white overflow-y-auto p-6"
   >
     <div className="flex justify-between mb-8">
       {isAuthenticated && (
         <div className="flex flex-col items-center">
           <Image
             src={imageUrl}
             alt="Profile Picture"
             width={160}
             height={160}
             className="rounded-lg mb-3"
             priority
           />
           <span className="text-xl font-semibold text-center">
             {session?.user?.name || 'User'}
           </span>
         </div>
       )}
       <button
         onClick={closeAction}
         className="h-fit text-gray-600 hover:text-gray-900 focus:outline-none"
       >
         ✕
       </button>
     </div>

     <nav className="space-y-4">
       <button 
         onClick={() => handleNavigation('/tasks')} 
         className="w-full text-left p-4 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
       >
         Find Tasks
       </button>
       
       {isAuthenticated && (
         <button 
           onClick={() => handleNavigation('/projects')} 
           className="w-full text-left p-4 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
         >
           My Projects
         </button>
       )}
       
       <button 
         onClick={() => handleNavigation('/categories')} 
         className="w-full text-left p-4 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
       >
         Create a task
       </button>

       <div className="pt-4 border-t border-gray-200">
         {isAuthenticated ? (
           <>
             <button 
               onClick={() => handleNavigation('/profile')} 
               className="w-full text-left p-4 text-md text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
             >
               Profile
             </button>
             <button 
               onClick={() => handleNavigation('/settings')} 
               className="w-full text-left p-4 text-md text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
             >
               Settings
             </button>
             <button 
               onClick={() => handleNavigation('/auth/logout')} 
               className="w-full text-left p-4 text-md text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
             >
               Logout
             </button>
           </>
         ) : (
           <div className="space-y-2">
             <button 
               onClick={() => handleNavigation('/auth/login')} 
               className="w-full p-4 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
             >
               Login
             </button>
             <button 
               onClick={() => handleNavigation('/auth/signup')} 
               className="w-full p-4 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
             >
               Sign Up
             </button>
           </div>
         )}
       </div>
     </nav>
   </motion.div>
 );
}

export default withLazyLoading(MobileMenu);