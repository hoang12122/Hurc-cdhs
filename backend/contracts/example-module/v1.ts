export const EXAMPLE_MODULE_CONTRACT_VERSION = '1.0.0' as const;

export type ExampleModuleStatus = 'draft' | 'reviewed';

export interface ExampleModuleItemContract {
  id: string;
  title: string;
  status: ExampleModuleStatus;
  owner: string;
  updatedAt: string;
}

export interface ValidateExampleModuleTitleResult {
  success: boolean;
  message?: string;
  title?: string;
}
