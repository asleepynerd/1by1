import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LandingPage } from '@/components/LandingPage';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/home');
  }

  return <LandingPage />;
}
