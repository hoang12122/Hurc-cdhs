
import { SystemLogsClient } from '@/components/admin/system-logs-client';
import { getSystemLogs } from "@/lib/actions/system.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { hasPermission } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default async function SystemLogsPage() {
  const canViewLogs = await hasPermission('settings:manage');

  if (!canViewLogs) {
    // Or render an access denied component
    // For simplicity, we redirect. In a real app, a dedicated component is better.
    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>You do not have permission to view system logs. Please contact an administrator.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  // Fetch initial data on the server
  const initialLogs = await getSystemLogs();
  const initialUsers = await getUsers();
  
  return (
    <SystemLogsClient initialLogs={initialLogs} initialUsers={initialUsers} />
  );
}
