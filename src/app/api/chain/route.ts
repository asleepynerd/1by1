import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      invitedBy: true,
      invitedUsers: true,
    },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  // i think it goes like inviter -> user -> all invitees ??? i dont fucking know
  const chain = [];
  if (user.invitedBy) {
    chain.push({ id: user.invitedBy.id, name: user.invitedBy.name || 'Inviter', image: user.invitedBy.image });
  }
  chain.push({ id: user.id, name: user.name || 'You', image: user.image, hasInvited: user.hasInvited });
  if (user.invitedUsers.length > 0) {
    user.invitedUsers.forEach(invitee => {
      chain.push({ id: invitee.id, name: invitee.name || 'Invitee', image: invitee.image });
    });
  }

  return new Response(JSON.stringify({ chain }), { status: 200 });
} 