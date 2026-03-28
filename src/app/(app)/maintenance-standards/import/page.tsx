// This page is obsolete and has been removed. Its functionality is now in /admin/maintenance-standards/import.
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function DeprecatedMaintenanceStandardsImportPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin/maintenance-standards/import'); }, [router]);
  return null;
}
