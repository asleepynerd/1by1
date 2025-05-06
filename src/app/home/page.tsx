import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { HomeContent } from '@/components/HomeContent';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }
  if (!session.user?.name) {
    redirect('/onboarding');
  }

  return <HomeContent />;
} 