import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { name, image } = await req.json();
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, image },
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 