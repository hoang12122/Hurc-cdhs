'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    // Always redirect to dashboard in bypass mode
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
