import { config } from 'dotenv';
import { Resend } from 'resend';

// Load environment variables
const result = config();

if (result.error) {
  console.error('❌ Failed to load .env file');
  process.exit(1);
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is missing in .env');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'romanvolkonidov@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
    });

    console.log('✅ Email sent successfully:', data);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

testEmail();
