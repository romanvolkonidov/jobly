import { Resend } from 'resend';

const mockTokens = {
  typography: {
    fontFamily: {
      primary: 'Arial, sans-serif'
    }
  },
  colors: {
    gray: {
      900: '#111827'
    },
    primary: {
      blue: '#2563eb'
    },
    white: '#ffffff'
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem'
  },
  borderRadius: {
    md: '0.375rem'
  }
};

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  try {
    console.log('Sending email to:', to);
    const result = await resend.emails.send({
      from: 'Jobly <onboarding@resend.dev>',
      to,
      subject,
      html: `
        <div style="font-family: ${mockTokens.typography.fontFamily.primary}; color: ${mockTokens.colors.gray[900]};">
          ${html}
        </div>
      `
    });
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;
  
  await sendEmail({
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
        "
      >
        Verify Email
      </a>
    `
  });
};