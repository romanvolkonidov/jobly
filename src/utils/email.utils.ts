import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY not configured');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmailInternal = async ({ to, subject, html }: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured');
  }

  try {
    const result = await resend.emails.send({
      from: 'Skill Spot <skillspot@rv2class.com>',
      to,
      subject,
      html: `<div style="font-family: Arial, sans-serif">${html}</div>`
    });
    
    console.log('Email sent:', { to, subject, result });
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export const sendEmail = sendEmailInternal;

export const sendVerificationEmail = async (email: string, code: string) => {
  return sendEmailInternal({
    to: email,
    subject: 'Verify your Skill Spot account',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to Skill Spot</h1>
          <p style="color: #4b5563; font-size: 16px;">Your Verification Code</p>
        </div>
        <div style="
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 30px;
        ">
          <div style="
            font-size: 32px;
            letter-spacing: 8px;
            font-weight: bold;
            background: #f8fafc;
            color: #1e40af;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          ">
            ${code}
          </div>
          <p style="color: #64748b; text-align: center; margin: 20px 0;">
            This code will expire in 15 minutes
          </p>
        </div>
        <div style="color: #6b7280; font-size: 14px; text-align: center;">
          <p>If you didn't request this verification, please ignore this email.</p>
          <p style="margin-top: 20px;">© ${new Date().getFullYear()} Skill Spot. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

export const sendResetCode = async (email: string, code: string) => {
  return sendEmailInternal({
    to: email,
    subject: 'Reset your Skill Spot password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Reset Your Password</h1>
          <p style="color: #4b5563; font-size: 16px;">Your Password Reset Code</p>
        </div>
        <div style="
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 30px;
        ">
          <div style="
            font-size: 32px;
            letter-spacing: 8px;
            font-weight: bold;
            background: #f8fafc;
            color: #1e40af;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          ">
            ${code}
          </div>
          <p style="color: #64748b; text-align: center; margin: 20px 0;">
            This code will expire in 15 minutes
          </p>
        </div>
        <div style="color: #6b7280; font-size: 14px; text-align: center;">
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p style="margin-top: 20px;">© ${new Date().getFullYear()} Skill Spot. All rights reserved.</p>
        </div>
      </div>
    `
  });
};