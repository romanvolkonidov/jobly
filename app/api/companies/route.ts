// app/api/companies/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '@/app/api/auth/auth-options';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      logo,
      name,
      description,
      registrationNumber,
      website,
      industry,
      email,
      phone,
      yearEstablished,
      size,
      taxId,
      socialMedia,
      locations
    } = body;

    const company = await prisma.company.create({
      data: {
        userId: session.user.id,
        logo,
        name,
        description,
        registrationNumber,
        website,
        industry,
        email,
        phone,
        yearEstablished: yearEstablished ? parseInt(yearEstablished) : null,
        size,
        taxId,
        socialMedia,
        locations
      }
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('[COMPANY_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const companies = await prisma.company.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
      }
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const companies = await prisma.company.findMany({
      where: { userId: session.user.id }
    });

    if (!companies.length) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const company = await prisma.company.update({
      where: { id: companies[0].id },
      data: {
        ...body,
        yearEstablished: body.yearEstablished ? parseInt(body.yearEstablished) : null
      }
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('[COMPANY_PUT]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}