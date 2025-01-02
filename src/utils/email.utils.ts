import { Resend } from 'resend';

const sendEmailInternal = async ({ to, subject, html }: {
  to: string;
  subject: string;
  html: string;
}) => {
  console.log('Email function called with:', { to, subject });

  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY');
    throw new Error('RESEND_API_KEY not configured');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    console.log('Calling Resend API...');
    const result = await resend.emails.send({
      from: 'Jobly <onboarding@resend.dev>',
      to,
      subject,
      html: `<div style="font-family: Arial, sans-serif">${html}</div>`
    });
    
    console.log('Resend API response:', result);
    return result;
  } catch (error) {
    console.error('Resend API error:', error);
    throw error;
  }
};

export const sendEmail = sendEmailInternal;

export const sendVerificationEmail = async (email: string, token: string) => {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error('Missing NEXT_PUBLIC_APP_URL');
    throw new Error('NEXT_PUBLIC_APP_URL not configured');
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;
  console.log('Sending verification email with URL:', verifyUrl);
  
  return sendEmailInternal({
    to: email,
    subject: 'Verify your Jobly account',
    html: `
      <h2>Welcome to Jobly!</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a 
        href="${verifyUrl}" 
        style="
          background: #2563eb;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          display: inline-block;
          margin: 16px 0;
        "
      >
        Verify Email
      </a>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });
};