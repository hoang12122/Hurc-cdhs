// This page is obsolete and has been removed. Its functionality is now in /admin/maintenance-standards.
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function DeprecatedMaintenanceStandardsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin/maintenance-standards'); }, [router]);
  return null;
}
