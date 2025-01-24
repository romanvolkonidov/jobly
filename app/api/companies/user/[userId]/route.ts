//app/api/companies/user/[userId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const company = await prisma.company.findFirst({
      where: {
        userId: params.userId,
      },
    });

    if (!company) {
      return new NextResponse(null, { status: 404 });  // Return 404 instead of empty object
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return new NextResponse(null, { status: 500 });
  }
}
