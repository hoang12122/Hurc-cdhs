// src/lib/actions/organization.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { OrganizationService, type OrganizationalUnit } from '../services/organization-service';
import { requireAuth, requirePermission } from '@/lib/auth-enforcer';
import { OUScopeService } from '../services/ou-scope-service';

/**
 * Action to retrieve the complete Active Directory tree structure
 */
export async function getOrganizationTree() {
  try {
    await requireAuth();
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
    await requireAuth();
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
    await requirePermission('organization:manage');

    // Cycle detection & Infinite Loop prevention
    if (data.id) {
      if (data.id.startsWith('ou-category-') || data.id.startsWith('ou-loc-') || data.id.startsWith('ou-unit-') || data.id.startsWith('ou-sub-')) {
        return { success: false, error: 'Không thể sửa đổi Đơn vị tổ chức ảo liên kết từ danh mục.' };
      }
      if (data.parentId) {
        if (data.parentId === data.id) {
          return { success: false, error: 'Đơn vị tổ chức cha không thể là chính nó.' };
        }
        const descendants = await OUScopeService.getOUDescendants(data.id);
        if (descendants.includes(data.parentId)) {
          return { success: false, error: 'Đơn vị tổ chức cha không thể là đơn vị con trực thuộc (tránh vòng lặp vô hạn).' };
        }
      }
    }
    
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
    await requirePermission('organization:manage');
    if (id.startsWith('ou-category-') || id.startsWith('ou-loc-') || id.startsWith('ou-unit-') || id.startsWith('ou-sub-')) {
      return { success: false, error: 'Không thể xóa Đơn vị tổ chức ảo liên kết từ danh mục.' };
    }
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
    await requirePermission('organization:manage');
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

/**
 * Forest CRUD Actions
 */
export async function upsertForest(data: { id?: string; name: string; description?: string }) {
  try {
    await requirePermission('organization:manage');
    if (data.id) {
      const { id, ...updateData } = data;
      await OrganizationService.updateForest(id, updateData);
    } else {
      await OrganizationService.createForest({
        name: data.name,
        description: data.description
      });
    }
    revalidatePath('/admin/organization');
    return { success: true };
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] upsertForest failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

export async function deleteForest(id: string) {
  try {
    await requirePermission('organization:manage');
    await OrganizationService.deleteForest(id);
    revalidatePath('/admin/organization');
    return { success: true };
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] deleteForest failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

/**
 * Tree CRUD Actions
 */
export async function upsertTree(data: { id?: string; name: string; description?: string; forestId: string }) {
  try {
    await requirePermission('organization:manage');
    if (data.id) {
      const { id, ...updateData } = data;
      await OrganizationService.updateTree(id, updateData);
    } else {
      await OrganizationService.createTree({
        name: data.name,
        description: data.description,
        forestId: data.forestId
      });
    }
    revalidatePath('/admin/organization');
    return { success: true };
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] upsertTree failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

export async function deleteTree(id: string) {
  try {
    await requirePermission('organization:manage');
    await OrganizationService.deleteTree(id);
    revalidatePath('/admin/organization');
    return { success: true };
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] deleteTree failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

/**
 * Child Domain CRUD Actions
 */
export async function upsertDomain(data: { id?: string; name: string; description?: string; treeId: string }) {
  try {
    await requirePermission('organization:manage');
    if (data.id) {
      const { id, ...updateData } = data;
      await OrganizationService.updateChildDomain(id, updateData);
    } else {
      await OrganizationService.createChildDomain({
        name: data.name,
        description: data.description,
        treeId: data.treeId
      });
    }
    revalidatePath('/admin/organization');
    return { success: true };
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] upsertDomain failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

export async function deleteDomain(id: string) {
  try {
    await requirePermission('organization:manage');
    await OrganizationService.deleteChildDomain(id);
    revalidatePath('/admin/organization');
    return { success: true };
  } catch (error: any) {
    console.error('[ORGANIZATION-ACTION] deleteDomain failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}
