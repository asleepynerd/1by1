import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const posts = await prisma.post.findMany({
    where: { parentId: null },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, image: true } },
      replies: {
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, name: true, image: true } },
          likes: userId ? { where: { userId } } : false,
        },
      },
      likes: userId ? { where: { userId } } : false,
      _count: { select: { likes: true } },
    },
  });
  const withLikes = posts.map(post => ({
    ...post,
    liked: !!(post.likes && post.likes.length > 0),
    likeCount: post._count.likes,
    replies: post.replies.map(reply => ({
      ...reply,
      liked: !!(reply.likes && reply.likes.length > 0),
      likeCount: reply.likes ? reply.likes.length : 0,
    })),
  }));
  return new Response(JSON.stringify({ posts: withLikes }), { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { content, parentId } = await req.json();
  if (!content || typeof content !== 'string' || content.length > 500) {
    return new Response(JSON.stringify({ error: 'Invalid content' }), { status: 400 });
  }
  const post = await prisma.post.create({
    data: {
      userId: session.user.id,
      content,
      parentId: parentId || null,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      replies: true,
      likes: true,
    },
  });
  return new Response(JSON.stringify({ post }), { status: 201 });
} 