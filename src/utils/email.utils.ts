// src/utils/email.utils.ts

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
  await transporter.sendMail({
    from: `"${process.env.SENDER_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: ${tokens.typography.fontFamily.primary}; color: ${tokens.colors.gray[900]};">
        ${html}
      </div>
    `
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
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