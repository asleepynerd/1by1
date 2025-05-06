import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ isFirstUser: userCount === 0 });
  } catch (error) {
    console.error('Error checking first user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 