// src/lib/services/__tests__/ou-scope-service.test.ts
import { OUScopeService } from '../ou-scope-service';
import { OrganizationService } from '../organization-service';

/**
 * Basic sanity checks for OU‑Scope helpers.
 * Run with:  npx jest src/lib/services/__tests__/ou-scope-service.test.ts
 */
describe('OUScopeService', () => {
  const getRootOu = async () => {
    const ous = await OrganizationService.getOrganizationalUnits();
    return ous.find(o => o.id === 'ou-cdhs-root')!;
  };

  test('getOUAncestors returns empty array for root OU', async () => {
    const root = await getRootOu();
    const ancestors = await OUScopeService.getOUAncestors(root.id);
    expect(ancestors).toEqual([]);
  });

  test('getOUDescendants includes children & grandchildren', async () => {
    const root = await getRootOu();
    const descendants = await OUScopeService.getOUDescendants(root.id);
    expect(descendants).toContain('ou-infra');
    expect(descendants).toContain('ou-track-civil');
  });

  test('isOUInScope works for parent‑child relationship', async () => {
    const root = await getRootOu();
    const child = await OUScopeService.getOUDescendants(root.id).then(d => d[0]);
    const inScope = await OUScopeService.isOUInScope(root.id, child);
    expect(inScope).toBe(true);
  });

  test('getUsersInScope returns users belonging to OU hierarchy', async () => {
    const root = await getRootOu();
    const users = await OUScopeService.getUsersInScope(root.id);
    expect(users).toContain('user-admin-new');
  });
});
