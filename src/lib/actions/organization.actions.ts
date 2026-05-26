// src/lib/actions/organization.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { OrganizationService, type OrganizationalUnit } from '../services/organization-service';

/**
 * Action to retrieve the complete Active Directory tree structure
 */
export async function getOrganizationTree() {
  try {
    return await OrganizationService.getTreeStructure();
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] getOrganizationTree failed:', error);
    return { error: error.message || 'Unknown error inside getTreeStructure', stack: error.stack };
  }
}

/**
 * Action to get a flattened list of OUs with indentation level for dropdown selectors
 */
export async function getOUList() {
  try {
    const allOus = await OrganizationService.getOrganizationalUnits();
    
    // Sort recursively to build indented list
    const result: Array<{ id: string; name: string; level: number; parentId?: string; pathName: string }> = [];
    
    const traverse = (parentId: string | undefined | null, level: number, currentPath: string) => {
      const children = allOus.filter(ou => ou.parentId === parentId);
      for (const child of children) {
        const nextPath = currentPath ? `${currentPath} > ${child.name}` : child.name;
        result.push({
          id: child.id,
          name: child.name,
          level,
          parentId: child.parentId,
          pathName: nextPath
        });
        traverse(child.id, level + 1, nextPath);
      }
    };
    
    // Start traverse from root level OUs (those whose parentId is null/undefined or not in allOus)
    const rootOus = allOus.filter(ou => !ou.parentId || !allOus.some(o => o.id === ou.parentId));
    for (const root of rootOus) {
      result.push({
        id: root.id,
        name: root.name,
        level: 0,
        parentId: root.parentId,
        pathName: root.name
      });
      traverse(root.id, 1, root.name);
    }
    
    return result;
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] getOUList failed:', error);
    return [];
  }
}

/**
 * Action to create or update an Organizational Unit (OU)
 */
export async function upsertOrganizationalUnit(
  data: { id?: string; name: string; description?: string; domainId: string; parentId?: string }
) {
  try {
    if (data.id) {
      const { id, ...updateData } = data;
      await OrganizationService.updateOrganizationalUnit(id, updateData);
    } else {
      await OrganizationService.createOrganizationalUnit({
        name: data.name,
        description: data.description,
        domainId: data.domainId,
        parentId: data.parentId || undefined
      });
    }
    
    revalidatePath('/admin/organization');
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] upsertOrganizationalUnit failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

/**
 * Action to delete an Organizational Unit (OU)
 */
export async function deleteOrganizationalUnit(id: string) {
  try {
    await OrganizationService.deleteOrganizationalUnit(id);
    
    revalidatePath('/admin/organization');
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] deleteOrganizationalUnit failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

/**
 * Action to seed default AD organization structure if databases are empty
 */
export async function seedOrganization() {
  try {
    const forests = await OrganizationService.getForests();
    if (forests.length > 0) {
      revalidatePath('/admin/organization');
      revalidatePath('/admin/users');
      return { success: true, message: 'Cơ cấu tổ chức Active Directory đã tồn tại sẵn trong hệ thống!' };
    }
    
    const seeded = await OrganizationService.seedDefaultOrganization();
    if (seeded) {
      revalidatePath('/admin/organization');
      revalidatePath('/admin/users');
      return { success: true, message: 'Đã tạo cấu trúc Active Directory mẫu thành công!' };
    }
    return { success: false, message: 'Không thể tạo cơ cấu tổ chức.' };
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] seedOrganization failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}
