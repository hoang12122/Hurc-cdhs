import type {
  ExampleModuleItemContract,
  ValidateExampleModuleTitleResult,
} from '../../../contracts/example-module/v1';

export async function listExampleModuleItemsV1(): Promise<ExampleModuleItemContract[]> {
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

export async function validateExampleModuleTitleV1(
  title: string,
): Promise<ValidateExampleModuleTitleResult> {
  const safeTitle = String(title || '').trim();
  if (!safeTitle) {
    return { success: false, message: 'Tiêu đề không được để trống.' };
  }

  return { success: true, title: safeTitle };
}
