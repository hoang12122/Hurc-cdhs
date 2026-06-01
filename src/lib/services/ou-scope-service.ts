// src/lib/services/ou-scope-service.ts
import { OrganizationService } from './organization-service';
import { getInternalUsers } from './user-service';

/**
 * Service providing OU hierarchy helpers for OU-scoped RBAC.
 * All methods are stateless and use OrganizationService as the data source.
 */
export class OUScopeService {
  /**
   * Returns an array of all ancestor OU IDs (parent, grandparent, …) up to the root OU.
   * The returned array is ordered from the immediate parent to the root.
   * @param ouId - The OU whose ancestors are requested.
   * @returns Array of ancestor OU IDs, empty if the OU has no parent or is not found.
   */
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

  /**
   * Returns an array of all descendant OU IDs (children, grandchildren, …) recursively.
   * @param ouId - The OU whose descendants are requested.
   * @returns Array of descendant OU IDs, empty if the OU has no children.
   */
  static async getOUDescendants(ouId: string): Promise<string[]> {
    const allOUs = await OrganizationService.getOrganizationalUnits();

    // Build a parent → children lookup for efficient traversal
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

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = childrenMap.get(currentId) || [];
      for (const childId of children) {
        descendants.push(childId);
        queue.push(childId);
      }
    }

    return descendants;
  }

  /**
   * Returns true if `targetOuId` equals `userOuId` OR is a descendant of `userOuId`.
   * Returns false when either argument is null / undefined.
   * @param userOuId  - The OU of the acting user (scope root).
   * @param targetOuId - The OU being checked against the user's scope.
   */
  static async isOUInScope(
    userOuId: string | null | undefined,
    targetOuId: string | null | undefined,
  ): Promise<boolean> {
    if (!userOuId || !targetOuId) return false;
    if (userOuId === targetOuId) return true;

    const descendants = await this.getOUDescendants(userOuId);
    return descendants.includes(targetOuId);
  }

  /**
   * Returns an array of user IDs that belong to the given OU or any of its descendant OUs.
   * If `userOuId` is null / undefined, returns an empty array.
   * @param userOuId - The root OU for the scope lookup.
   * @returns Array of user IDs within scope.
   */
  static async getUsersInScope(userOuId: string | null | undefined): Promise<string[]> {
    if (!userOuId) return [];

    const scopeOuIds = await this.getOUWithDescendantIds(userOuId);
    const users = await getInternalUsers();

    return users
      .filter((u: any) => u.ouId && scopeOuIds.includes(u.ouId))
      .map((u: any) => u.id);
  }

  /**
   * Returns the full human-readable path for an OU, e.g.
   * "Forest > Tree > Domain > OU Parent > OU".
   * @param ouId - The OU to build the path for.
   * @returns The assembled path string, or an empty string if the OU is not found.
   */
  static async getOUScopePath(ouId: string): Promise<string> {
    const allOUs = await OrganizationService.getOrganizationalUnits();

    const ouMap = new Map(allOUs.map((ou: any) => [ou.id, ou]));
    const target = ouMap.get(ouId);
    if (!target) return '';

    // Build OU chain from target up to root OU
    const ouChain: string[] = [];
    let current = target;
    while (current) {
      ouChain.unshift(current.name);
      if (current.parentId && current.parentId !== 'null' && current.parentId !== '') {
        current = ouMap.get(current.parentId)!;
      } else {
        break;
      }
    }

    return ouChain.join(' > ');
  }

  /**
   * Returns an array containing the given `ouId` itself plus all its descendant OU IDs.
   * Useful for building inclusive scope filters.
   * @param ouId - The root OU for the scope.
   * @returns Array of OU IDs including ouId and all descendants.
   */
  static async getOUWithDescendantIds(ouId: string): Promise<string[]> {
    const descendants = await this.getOUDescendants(ouId);
    return [ouId, ...descendants];
  }
}
