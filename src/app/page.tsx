'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is not "logged in", redirect to login.
    if (!user) {
      router.replace('/login');
    } 
    // Otherwise, redirect to the dashboard.
    else {
      router.replace('/dashboard');
    }
  }, [router, user]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
