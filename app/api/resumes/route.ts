import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/src/lib/prisma';
import { authOptions } from "@/app/api/auth/auth-options";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

const parseDate = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString();
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { id, title, summary, education, experience, certifications, skills, languages } = body;

    const cleanedExperience = experience.map((exp: Experience) => {
      const { resumeId, createdAt, updatedAt, ...rest } = exp as any;
      return {
        ...rest,
        startDate: parseDate(exp.startDate) || new Date().toISOString(),
        endDate: exp.current ? null : parseDate(exp.endDate)
      };
    });

    const cleanedCertifications = certifications.map((cert: Certification) => {
      const { resumeId, createdAt, updatedAt, ...rest } = cert as any;
      return {
        ...rest,
        issueDate: parseDate(cert.issueDate) || new Date().toISOString(),
        expiryDate: parseDate(cert.expiryDate)
      };
    });

    const cleanedEducation = education.map((edu: any) => {
      const { resumeId, createdAt, updatedAt, ...rest } = edu;
      return {
        ...rest,
        startDate: parseDate(edu.startDate) || new Date().toISOString(),
        endDate: parseDate(edu.endDate)
      };
    });

    const resume = await prisma.resume.upsert({
      where: { id: id || '' },
      update: {
        title,
        summary,
        skills,
        languages,
        education: {
          deleteMany: {},
          create: cleanedEducation
        },
        experience: {
          deleteMany: {},
          create: cleanedExperience
        },
        certifications: {
          deleteMany: {},
          create: cleanedCertifications
        }
      },
      create: {
        userId: session.user.id,
        title,
        summary,
        skills,
        languages,
        education: { create: cleanedEducation },
        experience: { create: cleanedExperience },
        certifications: { create: cleanedCertifications }
      },
      include: {
        education: true,
        experience: true,
        certifications: true
      }
    });

    return NextResponse.json(resume);
  } catch (error) {
    console.error('[RESUME_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const resumes = await prisma.resume.findMany({
      where: { userId: session.user.id },
      include: {
        education: true,
        experience: true,
        certifications: true
      }
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error('[RESUMES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}