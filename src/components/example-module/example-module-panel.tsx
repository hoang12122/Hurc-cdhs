'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useExampleModuleWorkflow } from '@/components/example-module/use-example-module-workflow';

export function ExampleModulePanel() {
  const { items, title, setTitle, message, isPending, submit } = useExampleModuleWorkflow();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Example Module Scaffold</CardTitle>
          <CardDescription>Mẫu module chuẩn: UI tách khỏi hook, Server Action và Service Layer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nhập tiêu đề kiểm thử" />
            <Button onClick={submit} disabled={isPending}>{isPending ? 'Đang kiểm tra...' : 'Kiểm tra'}</Button>
          </div>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.owner} • {item.updatedAt}</p>
              </div>
              <Badge variant="outline">{item.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
