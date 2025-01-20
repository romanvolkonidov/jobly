import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import puppeteer from 'puppeteer';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; userId: string } }
) {
  try {
    const { type, userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        resumes: type === 'resume' ? true : false,
        companies: type === 'company' ? true : false,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = type === 'resume' 
      ? generateResumeHtml(user.resumes?.[0])
      : generateCompanyHtml(user.companies?.[0]);

    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}-${user.firstName}-${user.lastName}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new NextResponse('PDF generation failed', { status: 500 });
  }
}

function generateResumeHtml(resume: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Add your PDF styles here */
        </style>
      </head>
      <body>
        <!-- Add your resume template here -->
      </body>
    </html>
  `;
}

function generateCompanyHtml(company: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Add your PDF styles here */
        </style>
      </head>
      <body>
        <!-- Add your company profile template here -->
      </body>
    </html>
  `;
}
