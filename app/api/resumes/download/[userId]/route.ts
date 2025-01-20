import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import PDFDocument from 'pdfkit';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const resume = await prisma.resume.findFirst({
      where: { userId: params.userId },
      include: {
        education: true,
        experience: true,
        certifications: true,
      },
    });

    if (!resume) {
      return new NextResponse('Resume not found', { status: 404 });
    }

    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {});

    // Add content to PDF
    doc.fontSize(20).text('Professional Resume', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('Summary');
    doc.fontSize(12).text(resume.summary || 'No summary provided');
    doc.moveDown();

    if (resume.experience?.length > 0) {
      doc.fontSize(16).text('Experience');
      resume.experience.forEach((exp) => {
        doc.fontSize(14).text(exp.title);
        doc.fontSize(12).text(`${exp.company} • ${exp.location}`);
        doc.fontSize(10).text(exp.description ?? 'No description provided');
        doc.moveDown();
      });
    }

    if (resume.education?.length > 0) {
      doc.fontSize(16).text('Education');
      resume.education.forEach((edu) => {
        doc.fontSize(14).text(edu.institution);
        doc.fontSize(12).text(`${edu.degree} in ${edu.field}`);
        doc.fontSize(10).text(edu.description ?? 'No description provided');
        doc.moveDown();
      });
    }

    doc.end();

    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}
