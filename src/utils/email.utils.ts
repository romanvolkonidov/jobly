// src/utils/email.utils.ts
//this file works in the following way: it sends emails using the nodemailer package
import { createTransport } from 'nodemailer';
import { tokens } from '@/src/styles/tokens';

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // For port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
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