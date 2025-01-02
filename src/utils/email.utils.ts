import { createTransport } from 'nodemailer';
import { tokens } from '@/src/styles/tokens';

const transporter = createTransport({
 host: "smtp.zoho.com",
 port: Number("465"),
 secure: true,
 auth: {
   user: "info@rv2class.com",
   pass: "US2B5pCK00V6"
 },
 logger: true,
 debug: true
});

transporter.verify((error) => {
 if (error) {
   console.error('SMTP connection error:', error);
 } else {
   console.log('SMTP server ready'); 
 }
});

interface SendEmailParams {
 to: string;
 subject: string;
 html: string;
}

interface NodemailerError extends Error {
 code?: string;
 command?: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
 console.log('Starting email send to:', to);
 console.log('Nodemailer config:', {
  host: "smtp.zoho.com",
  port: Number("465"),
  user: "info@rv2class.com",
  passLength: "US2B5pCK00V6"?.length
 });

 try {
   const result = await transporter.sendMail({
     from: `"${process.env.SENDER_NAME}" <${process.env.SMTP_USER}>`,
     to,
     subject,
     html: `
       <div style="font-family: ${tokens.typography.fontFamily.primary}; color: ${tokens.colors.gray[900]};">
         ${html}
       </div>
     `
   });
   console.log('Email sent:', result);
   return result;
 } catch (error: unknown) {
   if (error instanceof Error) {
     const nodeMailerError = error as NodemailerError;
     console.error('Email error details:', {
       message: nodeMailerError.message,
       name: nodeMailerError.name,
       stack: nodeMailerError.stack,
       code: nodeMailerError.code,
       command: nodeMailerError.command
     });
   } else {
     console.error('Unknown email error:', error);
   }
   throw error;
 }
};

export const sendVerificationEmail = async (email: string, token: string) => {
 const verifyUrl = `${"https://jobly-3ymo.onrender.com"}/auth/verify-email?token=${token}`;
 
 await sendEmail({
   to: email,
   subject: 'Verify your Jobly account',
   html: `
     <h2>Welcome to Jobly!</h2>
     <p>Please verify your email by clicking the link below:</p>
     <a 
       href="${verifyUrl}" 
       style="
         background-color: ${tokens.colors.primary.blue}; 
         color: ${tokens.colors.white};
         padding: ${tokens.spacing.sm} ${tokens.spacing.md};
         border-radius: ${tokens.borderRadius.md};
         text-decoration: none;
       "
     >
       Verify Email
     </a>
   `
 });
};