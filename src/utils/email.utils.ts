import { Resend } from 'resend';
import { tokens } from '@/src/styles/tokens';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;
  
  await resend.emails.send({
    from: 'Jobly <onboarding@resend.dev>',
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