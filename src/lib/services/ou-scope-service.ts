// src/lib/services/ou-scope-service.ts
import { OrganizationService } from './organization-service';
import { getInternalUsers } from './user-service';
import { authDb, IS_DATABASE_OFFLINE } from '../prisma';

/**
 * Service providing OU hierarchy helpers for OU-scoped RBAC.
 * All methods are stateless and use OrganizationService as the data source.
 */
export class OUScopeService {
  /** Returns ancestor OU IDs from the immediate parent to the root. */
  static async getOUAncestors(ouId: string): Promise<string[]> {
    const allOUs = await OrganizationService.getOrganizationalUnits();
    const ouMap = new Map(allOUs.map(ou => [ou.id, ou]));

    const ancestors: string[] = [];
    let current = ouMap.get(ouId);

    while (current?.parentId && current.parentId !== 'null' && current.parentId !== '') {
      ancestors.push(current.parentId);
      current = ouMap.get(current.parentId);
    }

    return ancestors;
  }

  /** Returns all descendant OU IDs recursively. */
  static async getOUDescendants(ouId: string): Promise<string[]> {
    const allOUs = await OrganizationService.getOrganizationalUnits();
    const childrenMap = new Map<string, string[]>();

    for (const ou of allOUs) {
      if (ou.parentId && ou.parentId !== 'null' && ou.parentId !== '') {
        const siblings = childrenMap.get(ou.parentId) || [];
        siblings.push(ou.id);
        childrenMap.set(ou.parentId, siblings);
      }
    }

    const descendants: string[] = [];
    const queue = [ouId];
    let index = 0;

    while (index < queue.length) {
      const currentId = queue[index++];
      const children = childrenMap.get(currentId) || [];
      for (const childId of children) {
        descendants.push(childId);
        queue.push(childId);
      }
    }

    return descendants;
  }

  /** Returns true when target OU equals or is below the user's OU. */
  static async isOUInScope(
    userOuId: string | null | undefined,
    targetOuId: string | null | undefined,
  ): Promise<boolean> {
    if (!userOuId || !targetOuId) return false;
    if (userOuId === targetOuId) return true;

    const descendants = await this.getOUDescendants(userOuId);
    return descendants.includes(targetOuId);
  }

  /** Returns user IDs in the OU and all descendants. */
  static async getUsersInScope(userOuId: string | null | undefined): Promise<string[]> {
    if (!userOuId) return [];

    const scopeOuIds = await this.getOUWithDescendantIds(userOuId);
    if (!IS_DATABASE_OFFLINE) {
      try {
        const users = await authDb.user.findMany({
          where: { ouId: { in: scopeOuIds } },
          select: { id: true },
        });
        return users.map(user => user.id);
      } catch {
        console.warn('[OU-SCOPE] Direct scoped user query failed; using offline-compatible fallback.');
      }
    }

    const users = await getInternalUsers();
    const allowedOus = new Set(scopeOuIds);
    return users
      .filter(user => user.ouId && allowedOus.has(user.ouId))
      .map(user => user.id);
  }

  /** Returns the full human-readable OU path. */
  static async getOUScopePath(ouId: string): Promise<string> {
    const allOUs = await OrganizationService.getOrganizationalUnits();
    const ouMap = new Map(allOUs.map(ou => [ou.id, ou]));
    const target = ouMap.get(ouId);
    if (!target) return '';

    const ouChain: string[] = [];
    let current = target;
    while (current) {
      ouChain.unshift(current.name);
      if (current.parentId && current.parentId !== 'null' && current.parentId !== '') {
        const parent = ouMap.get(current.parentId);
        if (!parent) break;
        current = parent;
      } else {
        break;
      }
    }

    return ouChain.join(' > ');
  }

  /** Returns the root OU ID plus all descendant IDs. */
  static async getOUWithDescendantIds(ouId: string): Promise<string[]> {
    const descendants = await this.getOUDescendants(ouId);
    return [ouId, ...descendants];
  }
}
