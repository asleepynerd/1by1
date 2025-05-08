import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // probably like 30 days i forgot math
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async session({ session, user }) {
      try {
        if (session.user) {
          session.user.id = user.id;
          if ('invitationCode' in user) {
            // @ts-expect-error: custom property from Prisma user
            session.user.invitationCode = user.invitationCode;
          }
        }
        return session;
      } catch (error) {
        console.error('Session error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async createUser({ user }) {
      // ok i might've actually done this correctly
      const invitationCode = (user as any).invitationCode;
      if (invitationCode) {
        const inviter = await prisma.user.findFirst({
          where: { invitationCode },
        });
        if (inviter) {
          await prisma.user.update({
            where: { id: user.id },
            data: { invitedById: inviter.id },
          });
          await prisma.user.update({
            where: { id: inviter.id },
            data: { hasInvited: true },
          });
        }
      }
    }
  }
}; 