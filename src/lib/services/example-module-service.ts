export interface ExampleModuleItem {
  id: string;
  title: string;
  status: 'draft' | 'reviewed';
  owner: string;
  updatedAt: string;
}

export async function listExampleModuleItems(): Promise<ExampleModuleItem[]> {
  return [
    {
      id: 'example-001',
      title: 'Kiểm tra cấu trúc module mới',
      status: 'draft',
      owner: 'Developer Guide',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
}

export async function validateExampleModuleTitle(title: string) {
  const safeTitle = String(title || '').trim();
  if (!safeTitle) {
    return { success: false, message: 'Tiêu đề không được để trống.' };
  }

  return { success: true, title: safeTitle };
}
