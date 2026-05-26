// src/lib/services/organization-service.ts
import { dbProvider } from './db-wrapper';
import { getInternalUsers } from './user-service';

export interface Forest {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tree {
  id: string;
  name: string;
  description?: string;
  forestId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChildDomain {
  id: string;
  name: string;
  description?: string;
  treeId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationalUnit {
  id: string;
  name: string;
  description?: string;
  domainId: string;
  parentId?: string; // recursive parent relation
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Service to manage Active Directory-style hierarchy
 */
export class OrganizationService {
  // Forest Actions
  static async getForests(): Promise<Forest[]> {
    return await dbProvider.findMany<Forest>('Forest');
  }

  static async createForest(data: Omit<Forest, 'id'>): Promise<Forest> {
    return await dbProvider.create<Forest>('Forest', data);
  }

  static async updateForest(id: string, data: Partial<Forest>): Promise<Forest> {
    return await dbProvider.update<Forest>('Forest', id, data);
  }

  static async deleteForest(id: string): Promise<void> {
    // Cascade-like deletion for JSON fallback safety
    const trees = await this.getTrees(id);
    for (const tree of trees) {
      await this.deleteTree(tree.id);
    }
    await dbProvider.delete('Forest', id);
  }

  // Tree Actions
  static async getTrees(forestId?: string): Promise<Tree[]> {
    const trees = await dbProvider.findMany<Tree>('Tree');
    if (forestId) {
      return trees.filter(t => t.forestId === forestId);
    }
    return trees;
  }

  static async createTree(data: Omit<Tree, 'id'>): Promise<Tree> {
    return await dbProvider.create<Tree>('Tree', data);
  }

  static async updateTree(id: string, data: Partial<Tree>): Promise<Tree> {
    return await dbProvider.update<Tree>('Tree', id, data);
  }

  static async deleteTree(id: string): Promise<void> {
    const domains = await this.getChildDomains(id);
    for (const domain of domains) {
      await this.deleteChildDomain(domain.id);
    }
    await dbProvider.delete('Tree', id);
  }

  // ChildDomain Actions
  static async getChildDomains(treeId?: string): Promise<ChildDomain[]> {
    const domains = await dbProvider.findMany<ChildDomain>('ChildDomain');
    if (treeId) {
      return domains.filter(d => d.treeId === treeId);
    }
    return domains;
  }

  static async createChildDomain(data: Omit<ChildDomain, 'id'>): Promise<ChildDomain> {
    return await dbProvider.create<ChildDomain>('ChildDomain', data);
  }

  static async updateChildDomain(id: string, data: Partial<ChildDomain>): Promise<ChildDomain> {
    return await dbProvider.update<ChildDomain>('ChildDomain', id, data);
  }

  static async deleteChildDomain(id: string): Promise<void> {
    const ous = await this.getOrganizationalUnits(id);
    for (const ou of ous) {
      await this.deleteOrganizationalUnit(ou.id);
    }
    await dbProvider.delete('ChildDomain', id);
  }

  static async getOrganizationalUnits(domainId?: string): Promise<OrganizationalUnit[]> {
    const ous = await dbProvider.findMany<OrganizationalUnit>('OrganizationalUnit');
    
    // Fetch categories and map them to virtual OUs dynamically
    try {
      const [locations, responsibleUnits, subsystems] = await Promise.all([
        dbProvider.findMany<any>('PatrolLocation'),
        dbProvider.findMany<any>('ResponsibleUnit'),
        dbProvider.findMany<any>('Subsystem')
      ]);

      const defaultDomain = domainId || (ous[0]?.domainId) || 'domain-default';

      // 1. Virtual categories parent OUs
      const categoryParents: OrganizationalUnit[] = [
        {
          id: 'ou-category-locations',
          name: 'Danh mục Vị trí (Locations)',
          description: 'Các đơn vị phân cấp theo địa lý và vị trí tuần tra',
          domainId: defaultDomain,
          parentId: ous[0]?.parentId || undefined
        },
        {
          id: 'ou-category-responsible-units',
          name: 'Danh mục Đơn vị chịu trách nhiệm (Responsible Units)',
          description: 'Các đội/phòng chịu trách nhiệm nghiệp vụ',
          domainId: defaultDomain,
          parentId: ous[0]?.parentId || undefined
        },
        {
          id: 'ou-category-subsystems',
          name: 'Danh mục Hệ thống (Subsystems)',
          description: 'Các hệ thống kỹ thuật metro chuyên ngành',
          domainId: defaultDomain,
          parentId: ous[0]?.parentId || undefined
        }
      ];

      // 2. Map locations to OUs
      const locationOus: OrganizationalUnit[] = locations.map(loc => ({
        id: `ou-loc-${loc.id}`,
        name: `Vị trí: ${loc.label}`,
        description: `Vị trí tuần tra liên kết từ danh mục`,
        domainId: defaultDomain,
        parentId: 'ou-category-locations'
      }));

      // 3. Map responsible units to OUs
      const unitOus: OrganizationalUnit[] = responsibleUnits.map(unit => ({
        id: `ou-unit-${unit.id}`,
        name: `Đơn vị: ${unit.name}`,
        description: `Đơn vị chịu trách nhiệm liên kết từ danh mục`,
        domainId: defaultDomain,
        parentId: 'ou-category-responsible-units'
      }));

      // 4. Map subsystems to OUs
      const subsystemOus: OrganizationalUnit[] = subsystems.map(sub => {
        const labelVi = sub.label?.vi || sub.label_vi || sub.id;
        return {
          id: `ou-sub-${sub.id}`,
          name: `Hệ thống: ${labelVi}`,
          description: `Hệ thống kỹ thuật liên kết từ danh mục`,
          domainId: defaultDomain,
          parentId: 'ou-category-subsystems'
        };
      });

      // Merge virtual OUs into standard OUs list
      const mergedOus = [
        ...ous,
        ...categoryParents,
        ...locationOus,
        ...unitOus,
        ...subsystemOus
      ];

      if (domainId) {
        return mergedOus.filter(o => o.domainId === domainId);
      }
      return mergedOus;
    } catch (e) {
      console.warn('[ORGANIZATION-SERVICE] Failed to fetch category items for dynamic OUs, returning standard OUs only:', e);
      if (domainId) {
        return ous.filter(o => o.domainId === domainId);
      }
      return ous;
    }
  }

  static async createOrganizationalUnit(data: Omit<OrganizationalUnit, 'id'>): Promise<OrganizationalUnit> {
    return await dbProvider.create<OrganizationalUnit>('OrganizationalUnit', data);
  }

  static async updateOrganizationalUnit(id: string, data: Partial<OrganizationalUnit>): Promise<OrganizationalUnit> {
    return await dbProvider.update<OrganizationalUnit>('OrganizationalUnit', id, data);
  }

  static async deleteOrganizationalUnit(id: string): Promise<void> {
    // Re-assign child OUs or delete them
    const allOus = await this.getOrganizationalUnits();
    const childOus = allOus.filter(o => o.parentId === id);
    for (const child of childOus) {
      await this.deleteOrganizationalUnit(child.id);
    }

    // Set user ouId to null for deleted OUs
    const users = await getInternalUsers();
    const affectedUsers = users.filter((u: any) => u.ouId === id);
    for (const user of affectedUsers) {
      await dbProvider.update('User', user.id, { ouId: null });
    }

    await dbProvider.delete('OrganizationalUnit', id);
  }

  /**
   * Constructs the complete nested AD structure down to OUs & Users
   */
  static async getTreeStructure(): Promise<any[]> {
    const forests = await this.getForests();
    const trees = await this.getTrees();
    const domains = await this.getChildDomains();
    const ous = await this.getOrganizationalUnits();
    const users = await getInternalUsers();

    // Map each Forest
    return forests.map(forest => {
      const forestTrees = trees.filter(t => t.forestId === forest.id);
      return {
        id: forest.id,
        name: forest.name,
        type: 'forest',
        description: forest.description,
        children: forestTrees.map(tree => {
          const treeDomains = domains.filter(d => d.treeId === tree.id);
          return {
            id: tree.id,
            name: tree.name,
            type: 'tree',
            description: tree.description,
            children: treeDomains.map(domain => {
              const domainOus = ous.filter(o => o.domainId === domain.id);
              
              // Build recursive OU tree under the domain root
              const buildOuTree = (parentId: string | null | undefined): any[] => {
                const levelOus = domainOus.filter(o => {
                  if (!parentId) {
                    return !o.parentId || o.parentId === 'null' || o.parentId === '';
                  }
                  return o.parentId === parentId;
                });
                return levelOus.map(ou => {
                  const subOusAndUsers = [
                    ...buildOuTree(ou.id),
                    ...users
                      .filter((u: any) => u.ouId === ou.id)
                      .map((u: any) => ({
                        id: u.id,
                        name: u.name,
                        email: u.email,
                        role: u.role,
                        type: 'user',
                        status: u.status,
                      }))
                  ];
                  return {
                    id: ou.id,
                    name: ou.name,
                    type: 'ou',
                    description: ou.description,
                    children: subOusAndUsers
                  };
                });
              };

              // First layer OUs (root OUs under this domain)
              const rootOus = buildOuTree(null);

              return {
                id: domain.id,
                name: domain.name,
                type: 'domain',
                description: domain.description,
                children: rootOus
              };
            })
          };
        })
      };
    });
  }

  /**
   * Seed a standard AD hierarchy if databases are empty
   */
  static async seedDefaultOrganization(): Promise<boolean> {
    const existing = await this.getForests();
    if (existing.length > 0) {
      return false; // already seeded
    }

    try {
      // 1. Create Forest
      const forest = await this.createForest({
        name: 'Forest (Rừng hệ thống)',
        description: 'Rừng định danh trung tâm điều hành đường sắt đô thị (HURC No.1 CDHS Forest)',
      });

      // 2. Create Tree
      const tree = await this.createTree({
        name: 'Tree (Cây thư mục / Domain Root)',
        description: 'Cây thư mục gốc - cdhs.hurc1.com.vn',
        forestId: forest.id
      });

      // 3. Create Child Domain
      const domain = await this.createChildDomain({
        name: 'Child Domain (Miền con)',
        description: 'Miền con quản trị nhân sự & nghiệp vụ vận hành metro',
        treeId: tree.id
      });

      // 4. Create Root OU (Đơn vị tổ chức)
      const rootOu = await this.createOrganizationalUnit({
        name: 'Organizational Units (OU gốc / Đơn vị tổ chức)',
        description: 'OU gốc chứa toàn bộ các đơn vị tổ chức của doanh nghiệp',
        domainId: domain.id,
        parentId: undefined
      });

      // 5. Create Departement OU & Branch OU
      const deptOu = await this.createOrganizationalUnit({
        name: 'OU Phòng ban (Marketing, IT, Nhân sự...)',
        description: 'Khối phòng ban chức năng hành chính',
        domainId: domain.id,
        parentId: rootOu.id
      });

      const branchOu = await this.createOrganizationalUnit({
        name: 'OU Chi nhánh (Hà Nội, TP.HCM...)',
        description: 'Khối chi nhánh địa lý và ga vận hành',
        domainId: domain.id,
        parentId: rootOu.id
      });

      // 6. Create sub-OUs inside Dept OU
      const itOu = await this.createOrganizationalUnit({
        name: 'Công nghệ thông tin (IT)',
        description: 'Phòng IT hạ tầng, mạng và phần mềm điều khiển',
        domainId: domain.id,
        parentId: deptOu.id
      });

      const hrOu = await this.createOrganizationalUnit({
        name: 'Nhân sự (HR)',
        description: 'Ban tuyển dụng và đào tạo nhân sự Metro',
        domainId: domain.id,
        parentId: deptOu.id
      });

      // 7. Create sub-OUs inside Branch OU
      const hnOu = await this.createOrganizationalUnit({
        name: 'Chi nhánh Hà Nội',
        description: 'Ban điều hành ga và trung tâm vận hành Hà Nội',
        domainId: domain.id,
        parentId: branchOu.id
      });

      const hcmOu = await this.createOrganizationalUnit({
        name: 'Chi nhánh TP.HCM',
        description: 'Ban điều hành ga và trung tâm vận hành TP.HCM',
        domainId: domain.id,
        parentId: branchOu.id
      });

      // 8. Assign existing users to seed OUs
      const users = await getInternalUsers();
      if (users.length > 0) {
        // Assign the first few users to IT and Hanoi/HCM
        const itUsers = users.slice(0, 2);
        const hnUsers = users.slice(2, 4);
        const hcmUsers = users.slice(4);

        for (const u of itUsers) {
          await dbProvider.update('User', u.id, { ouId: itOu.id, department: 'IT' });
        }
        for (const u of hnUsers) {
          await dbProvider.update('User', u.id, { ouId: hnOu.id, department: 'Chi nhánh Hà Nội' });
        }
        for (const u of hcmUsers) {
          await dbProvider.update('User', u.id, { ouId: hcmOu.id, department: 'Chi nhánh TP.HCM' });
        }
      }

      return true;
    } catch (e) {
      console.error('Failed to seed AD structure:', e);
      return false;
    }
  }
}
