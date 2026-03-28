// This page is obsolete and has been removed. Its contents were moved to /admin/settings.
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function DeprecatedSettingsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin/settings'); }, [router]);
  return null;
}
