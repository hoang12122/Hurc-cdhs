import type {
  ExampleModuleItemContract,
  ValidateExampleModuleTitleResult,
} from '../../../../backend/contracts/example-module/v1';

export interface ExampleModuleClient {
  listItems(): Promise<ExampleModuleItemContract[]>;
  validateTitle(title: string): Promise<ValidateExampleModuleTitleResult>;
}

export function createLegacyCompatibleExampleModuleClient(
  adapter: ExampleModuleClient,
): ExampleModuleClient {
  return adapter;
}
