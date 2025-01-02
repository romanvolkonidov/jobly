import { Resend } from 'resend';

const mockTokens = {
 typography: { primary: 'Arial, sans-serif' },
 colors: {
   gray: { 900: '#111827' },
   primary: { blue: '#2563eb' },
   white: '#ffffff'
 },
 spacing: { sm: '0.5rem', md: '1rem' },
 borderRadius: { md: '0.375rem' }
};

if (!process.env.RESEND_API_KEY) {
 console.error('❌ RESEND_API_KEY missing');
 throw new Error('RESEND_API_KEY not configured');
}

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailParams = {
 to: string;
 subject: string;
 html: string;
};

const sendEmailInternal = async ({ to, subject, html }: EmailParams) => {
 console.log('📧 Sending email:', { to, subject });
 
 try {
   const result = await resend.emails.send({
     from: 'Jobly <onboarding@resend.dev>',
     to,
     subject,
     html: `
       <div style="font-family: ${mockTokens.typography.primary}; color: ${mockTokens.colors.gray[900]};">
         ${html}
       </div>
     `
   });
   console.log('✅ Email sent:', result);
   return result;
 } catch (error) {
   console.error('❌ Email failed:', error);
   throw error;
 }
};

export const sendEmail = sendEmailInternal;

export const sendVerificationEmail = async (email: string, token: string) => {
 if (!process.env.NEXT_PUBLIC_APP_URL) {
   console.error('❌ NEXT_PUBLIC_APP_URL missing');
   throw new Error('NEXT_PUBLIC_APP_URL not configured');
 }

 console.log('📨 Starting verification:', { email });
 const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;
 
 return sendEmailInternal({
   to: email,
   subject: 'Verify your Jobly account',
   html: `
     <h2>Welcome to Jobly!</h2>
     <p>Please verify your email by clicking the link below:</p>
     <a 
       href="${verifyUrl}" 
       style="
         background-color: ${mockTokens.colors.primary.blue}; 
         color: ${mockTokens.colors.white};
         padding: ${mockTokens.spacing.sm} ${mockTokens.spacing.md};
         border-radius: ${mockTokens.borderRadius.md};
         text-decoration: none;
         display: inline-block;
         margin: ${mockTokens.spacing.md} 0;
       "
     >
       Verify Email
     </a>
   `
 });
};