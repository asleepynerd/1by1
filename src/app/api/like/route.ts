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
  const { postId } = await req.json();
  if (!postId || typeof postId !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid postId' }), { status: 400 });
  }
  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });
  if (existing) {
    await prisma.like.delete({
      where: { id: existing.id },
    });
    return new Response(JSON.stringify({ liked: false }), { status: 200 });
  } else {
    await prisma.like.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });
    return new Response(JSON.stringify({ liked: true }), { status: 200 });
  }
} 