
"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import * as React from 'react';

const LoginFormSkeleton = () => (
  <Card className="w-full max-w-md shadow-xl">
    <CardHeader className="text-center">
        <Skeleton className="mx-auto mb-4 h-12 w-12" />
        <Skeleton className="mx-auto h-8 w-48" />
        <Skeleton className="mx-auto mt-2 h-5 w-64" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

const LoginForm = dynamic(() => import('@/components/auth/login-form').then(mod => mod.LoginForm), {
  ssr: false,
  loading: () => <LoginFormSkeleton />
});


export default function LoginClient() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
