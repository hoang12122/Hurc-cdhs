'use server';

import { requirePermission } from '@/lib/auth-enforcer';
import { listExampleModuleItems, validateExampleModuleTitle } from '@/lib/services/example-module-service';

export async function getExampleModuleItems() {
  await requirePermission(null);
  return listExampleModuleItems();
}

export async function submitExampleModuleTitle(title: string) {
  await requirePermission(null);
  return validateExampleModuleTitle(title);
}
