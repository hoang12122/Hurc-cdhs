'use client';

import * as React from 'react';
import { getExampleModuleItems, submitExampleModuleTitle } from '@/lib/actions/example-module.actions';
import type { ExampleModuleItem } from '@/lib/services/example-module-service';

export function useExampleModuleWorkflow() {
  const [items, setItems] = React.useState<ExampleModuleItem[]>([]);
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    let alive = true;
    getExampleModuleItems().then((data) => {
      if (alive) setItems(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  const submit = () => {
    startTransition(async () => {
      const result = await submitExampleModuleTitle(title);
      setMessage(result.success ? 'Dữ liệu hợp lệ. Có thể nối service ghi DB tại đây.' : result.message || 'Không hợp lệ.');
    });
  };

  return { items, title, setTitle, message, isPending, submit };
}
