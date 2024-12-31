// src/components/auth/AuthForm.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import Link from 'next/link';
import { authStyles } from '@/src/styles/auth.styles';
import { validatePassword } from '@/src/utils/validation';

interface FormData {
 name: string;
 email: string;
 password: string;
}

interface AuthFormProps {
  defaultView?: 'login' | 'register';
  onSuccess?: () => void;
}

const AuthForm = ({ defaultView = 'register' }: AuthFormProps) => {
 const [formType, setFormType] = useState<'login' | 'register'>(defaultView);
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState('');
 const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
 const [formData, setFormData] = useState<FormData>({
   name: '',
   email: '',
   password: '',
 });

 const validateForm = () => {
   if (formType === 'register' && !formData.name.trim()) {
     setMessage('Name is required');
     setMessageType('error');
     return false;
   }
   if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
     setMessage('Valid email is required');
     setMessageType('error');
     return false;
   }
   
   const passwordValidation = validatePassword(formData.password);
   if (!passwordValidation.isValid) {
     setMessage(passwordValidation.errors.join('\n'));
     setMessageType('error');
     return false;
   }
   
   return true;
 };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (loading) return;
   
   setLoading(true);
   setMessage('');

   try {
     const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
     if (!csrfToken) throw new Error('CSRF token not found');

     const endpoint = formType === 'register' ? '/api/auth/register' : '/api/auth/login';
     
     const response = await fetch(endpoint, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'x-csrf-token': csrfToken
       },
       body: JSON.stringify({
         email: formData.email,
         password: formData.password,
         ...(formType === 'register' ? { name: formData.name } : {})
       })
     });
     
     const data = await response.json();

     if (!response.ok) {
       throw new Error(data.error || data.message || 'Authentication failed');
     }

     if (formType === 'register') {
       setMessageType('success');
       setMessage('Please check your email to verify your account');
     } else {
       window.location.href = '/';
     }

   } catch (error) {
     console.error('Authentication error:', error);
     setMessageType('error');
     setMessage(error instanceof Error ? error.message : 'Authentication failed');
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className={authStyles.container}>
     <Card className={authStyles.wrapper}>
       <div className={authStyles.formContainer}>
         <h1 className={authStyles.title}>
           {formType === 'register' ? 'Create Account' : 'Welcome Back'}
         </h1>

         {message && (
           <div className={authStyles.message(messageType || 'error')}>
             {message}
             {message.includes('verify your email') && (
               <button
                 onClick={async () => {
                   try {
                     const response = await fetch('/api/auth/resend-verification', {
                       method: 'POST',
                       headers: {
                         'Content-Type': 'application/json',
                         'x-csrf-token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                       },
                       body: JSON.stringify({ email: formData.email })
                     });
                     
                     if (response.ok) {
                       setMessage('Verification email sent. Please check your inbox.');
                       setMessageType('success');
                     }
                   } catch {
                     setMessage('Failed to send verification email. Please try again.');
                     setMessageType('error');
                   }
                 }}
                 className={`${authStyles.link} ml-2`}
               >
                 Resend verification email
               </button>
             )}
           </div>
         )}

         <form onSubmit={handleSubmit} className={authStyles.form}>
           {formType === 'register' && (
             <div>
               <label htmlFor="name" className={authStyles.label}>
                 Full Name
               </label>
               <input
                 id="name"
                 type="text"
                 value={formData.name}
                 onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                 className={authStyles.input}
                 disabled={loading}
               />
             </div>
           )}

           <div>
             <label htmlFor="email" className={authStyles.label}>
               Email
             </label>
             <input
               id="email"
               type="email"
               value={formData.email}
               onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
               className={authStyles.input}
               disabled={loading}
             />
           </div>

           <div>
             <label htmlFor="password" className={authStyles.label}>
               Password
             </label>
             <input
               id="password"
               type="password"
               value={formData.password}
               onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
               className={authStyles.input}
               disabled={loading}
             />
           </div>

           {formType === 'login' && (
             <div className="text-right">
               <Link href="/auth/forgot-password" className={authStyles.link}>
                 Forgot password?
               </Link>
             </div>
           )}

           <button
             type="submit"
             disabled={loading}
             className={authStyles.button}
           >
             {loading 
               ? 'Please wait...' 
               : formType === 'register' 
                 ? 'Create Account' 
                 : 'Sign In'}
           </button>
         </form>

         <p className="text-center text-sm text-gray-600 mt-4">
           {formType === 'register' 
             ? 'Already have an account?' 
             : "Don't have an account?"}{' '}
           <button
             type="button"
             onClick={() => {
               if (loading) return;
               setFormType(formType === 'register' ? 'login' : 'register');
               setMessage('');
               setMessageType(null);
               setFormData({
                 name: '',
                 email: '',
                 password: '',
               });
             }}
             className={authStyles.link}
             disabled={loading}
           >
             {formType === 'register' ? 'Sign In' : 'Create One'}
           </button>
         </p>
       </div>
     </Card>
   </div>
 );
};

export default AuthForm;
