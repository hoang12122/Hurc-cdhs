// src/lib/services/organization-service.ts
import { dbProvider } from './db-wrapper';
import { 
  getInternalUsers,
  getInternalRoles,
  createInternalRole,
  updateInternalRole
} from './user-service';
import { 
  ROLE_SUPER_ADMIN, 
  ROLE_ADMIN_PKTAT, 
  ROLE_L3_SPECIALIST, 
  ROLE_L2_TECHNICIAN, 
  ROLE_L1_OPERATOR 
} from '../constants';

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
    try {
      // 1. Clean up any existing AD structure first to ensure no conflicts or duplicates
      const existingForests = await this.getForests();
      for (const forest of existingForests) {
        await this.deleteForest(forest.id);
      }

      // 2. Seed / Upsert Graded Roles
      const gradedRoles = [
        {
          id: ROLE_SUPER_ADMIN,
          name: 'Super Admin',
          description: 'Quản trị viên Cấp cao: Toàn quyền quản trị hệ thống, hạ tầng AD và chính sách bảo mật tối cao.',
          permissions: ['*']
        },
        {
          id: ROLE_ADMIN_PKTAT,
          name: 'Admin (P.KTAT)',
          description: 'Kiểm soát viên Phòng Kỹ thuật An toàn: Giám sát chất lượng bảo trì toàn diện, phê duyệt quy chuẩn bảo dưỡng, đại tu và kiểm soát an toàn hệ thống.',
          permissions: [
            'inspections:create',
            'inspections:view_all',
            'inspections:edit_all',
            'inspections:delete',
            'inspections:assign',
            'inspections:approve',
            'dnf:create',
            'dnf:view_all',
            'dnf:edit_all',
            'dnf:delete',
            'dnf:manage_status',
            'dnf:import',
            'corrective_actions:create',
            'corrective_actions:view_all',
            'corrective_actions:edit_all',
            'corrective_actions:delete',
            'corrective_actions:assign',
            'corrective_actions:verify',
            'hazard:create',
            'hazard:view_all',
            'hazard:assess',
            'hazard:edit_all',
            'hazard:delete',
            'hazard:manage_status',
            'improvements:create',
            'improvements:view_all',
            'improvements:edit_all',
            'improvements:delete',
            'reports:view',
            'reports:manage',
            'users:manage',
            'roles:manage',
            'checklist_templates:manage',
            'settings:manage',
            'ai:use',
            'ai:vision',
            'organization:view',
            'organization:manage',
            'users:view_scoped',
            'users:manage_scoped'
          ]
        },
        {
          id: ROLE_L3_SPECIALIST,
          name: 'Chuyên viên (L3)',
          description: 'Chuyên viên Vận hành & Bảo trì (Cấp độ 3): Lập kế hoạch, phân công công tác tuần tra/bảo trì cấp 3 trong phạm vi OU trực thuộc. Giám sát kỹ thuật và phê duyệt hoàn thành.',
          permissions: [
            'users:view_scoped',
            'users:manage_scoped',
            'inspections:assign',
            'inspections:approve',
            'corrective_actions:assign',
            'corrective_actions:verify',
            'hazard:assess',
            'hazard:manage_status',
            'inspections:view_all',
            'corrective_actions:view_all',
            'hazard:view_all',
            'dnf:view_all',
            'dnf:manage_status',
            'ai:use'
          ]
        },
        {
          id: ROLE_L2_TECHNICIAN,
          name: 'Kỹ thuật viên (L2)',
          description: 'Kỹ thuật viên Hiện trường (Cấp độ 2): Trực tiếp thực hiện bảo dưỡng định kỳ tuần/tháng, xử lý sự cố DNF và thực hiện hành động khắc phục lỗi chuyên sâu.',
          permissions: [
            'inspections:create',
            'inspections:view_all',
            'dnf:create',
            'dnf:view_all',
            'corrective_actions:create',
            'corrective_actions:view_all',
            'hazard:create',
            'hazard:view_all',
            'ai:use',
            'ai:vision'
          ]
        },
        {
          id: ROLE_L1_OPERATOR,
          name: 'Nhân viên (L1)',
          description: 'Nhân viên Tuần tra & Vận hành (Cấp độ 1): Thực hiện bảo dưỡng cấp 1 (hàng ngày), tuần tra trực quan hiện trường phát hiện mối nguy (Hazard) và báo cáo hỏng hóc cơ bản.',
          permissions: [
            'inspections:create',
            'inspections:view_all',
            'dnf:create',
            'dnf:view_all',
            'hazard:create',
            'hazard:view_all',
            'ai:use'
          ]
        }
      ];

      const currentRoles = await getInternalRoles();
      for (const r of gradedRoles) {
        const found = currentRoles.find((cr: any) => cr.id === r.id);
        if (found) {
          await updateInternalRole(r.id, {
            name: r.name,
            description: r.description,
            permissions: r.permissions
          });
        } else {
          await createInternalRole(r);
        }
      }

      // 3. Create Forest
      const forest = await this.createForest({
        id: 'forest-metro-root',
        name: 'HURC Metro System Forest',
        description: 'Rừng định danh trung tâm điều hành đường sắt đô thị (HURC No.1 CDHS Forest)',
      } as any);

      // 4. Create Tree
      const tree = await this.createTree({
        id: 'tree-metro-root',
        name: 'HURC Maintenance & Operations Tree',
        description: 'Cây thư mục gốc quản trị bảo trì - cdhs.hurc1.com.vn',
        forestId: forest.id
      } as any);

      // 5. Create Child Domain
      const domain = await this.createChildDomain({
        id: 'domain-metro-root',
        name: 'maint.hurc.vn',
        description: 'Miền con quản trị nhân sự & nghiệp vụ vận hành bảo trì Metro',
        treeId: tree.id
      } as any);

      // 6. Create nested OUs (Forest -> Tree -> Domain -> nested OUs)
      // Level 1: Root OU
      const ouRoot = await this.createOrganizationalUnit({
        id: 'ou-cdhs-root',
        name: 'Xí nghiệp Bảo trì Thiết bị',
        description: 'Đơn vị tổ chức đầu não chịu trách nhiệm toàn bộ công tác bảo trì, bảo dưỡng hạ tầng, thông tin tín hiệu và đầu máy toa xe Metro (CDHS Maintenance Enterprise).',
        domainId: domain.id,
        parentId: undefined
      } as any);

      // Level 2: Phân xưởng
      const ouInfra = await this.createOrganizationalUnit({
        id: 'ou-infra',
        name: 'Phân xưởng Bảo trì Hạ tầng',
        description: 'Phòng ban chịu trách nhiệm bảo dưỡng hệ thống cơ sở hạ tầng đường sắt đô thị (đường ray, kiến trúc ga, cung cấp điện).',
        domainId: domain.id,
        parentId: ouRoot.id
      } as any);

      const ouSigTelecom = await this.createOrganizationalUnit({
        id: 'ou-sig-telecom',
        name: 'Phân xưởng Thông tin Tín hiệu',
        description: 'Phòng ban phụ trách hệ thống chạy tàu tự động, thông tin tín hiệu điều khiển trung tâm OCC và viễn thông ga.',
        domainId: domain.id,
        parentId: ouRoot.id
      } as any);

      const ouRollingStock = await this.createOrganizationalUnit({
        id: 'ou-rolling-stock',
        name: 'Phân xưởng Đầu máy Toa xe',
        description: 'Phân xưởng bảo dưỡng, sửa chữa định kỳ và đại tu toàn bộ đội tàu, đầu máy và các toa xe vận hành trên tuyến.',
        domainId: domain.id,
        parentId: ouRoot.id
      } as any);

      // Level 3: Đội under Infra
      const ouTrackCivil = await this.createOrganizationalUnit({
        id: 'ou-track-civil',
        name: 'Đội Bảo trì Đường ray & Kiến trúc',
        description: 'Đội phụ trách tuần tra ray, căn chỉnh khổ đường và duy tu kiến trúc tầng trên.',
        domainId: domain.id,
        parentId: ouInfra.id
      } as any);

      const ouPowerSupply = await this.createOrganizationalUnit({
        id: 'ou-power-supply',
        name: 'Đội Cung cấp Điện',
        description: 'Đội vận hành trạm biến áp trung thế, hệ thống điện lưới và ray thứ ba cung cấp điện chạy tàu.',
        domainId: domain.id,
        parentId: ouInfra.id
      } as any);

      // Level 4: Tổ under Track Civil
      const ouL1TrackPatrol = await this.createOrganizationalUnit({
        id: 'ou-l1-track-patrol',
        name: 'Tổ tuần tra ray Cát Linh - Hà Đông',
        description: 'Tổ bảo trì L1 (hàng ngày): tuần tra trực quan tuyến đường ray, phát hiện mối nguy nứt/gãy ray cơ bản.',
        domainId: domain.id,
        parentId: ouTrackCivil.id
      } as any);

      const ouL2TrackMaint = await this.createOrganizationalUnit({
        id: 'ou-l2-track-maint',
        name: 'Đội Kỹ thuật Ray chuyên sâu',
        description: 'Tổ bảo trì L2 (định kỳ): mài ray, căn chỉnh hình học ray bằng thiết bị đo đạc chuyên nghiệp.',
        domainId: domain.id,
        parentId: ouTrackCivil.id
      } as any);

      // Level 4: Tổ under Power Supply
      const ouL1StationPower = await this.createOrganizationalUnit({
        id: 'ou-l1-station-power',
        name: 'Tổ vận hành trạm ga',
        description: 'Tổ bảo trì L1 (hàng ngày): ghi chỉ số điện kế, kiểm tra trực quan tủ điện hạ thế và thiết bị chiếu sáng ga.',
        domainId: domain.id,
        parentId: ouPowerSupply.id
      } as any);

      const ouL2PowerGrid = await this.createOrganizationalUnit({
        id: 'ou-l2-power-grid',
        name: 'Tổ bảo dưỡng thiết bị điện chuyên sâu',
        description: 'Tổ bảo trì L2 (định kỳ): bảo dưỡng máy biến áp, tủ ngắt mạch chân không VCB trạm biến áp chính.',
        domainId: domain.id,
        parentId: ouPowerSupply.id
      } as any);

      // Level 3: Đội under SigTelecom
      const ouSignaling = await this.createOrganizationalUnit({
        id: 'ou-signaling',
        name: 'Đội Kỹ thuật Tín hiệu',
        description: 'Đội chuyên trách hệ thống tín hiệu điều khiển chạy tàu tự động (ATC/CBTC).',
        domainId: domain.id,
        parentId: ouSigTelecom.id
      } as any);

      const ouTelecom = await this.createOrganizationalUnit({
        id: 'ou-telecom',
        name: 'Đội Kỹ thuật Viễn thông',
        description: 'Đội phụ trách mạng truyền dẫn quang, hệ thống camera giám sát CCTV, phát thanh hành khách PA và thông tin nội bộ.',
        domainId: domain.id,
        parentId: ouSigTelecom.id
      } as any);

      // Level 4: Tổ under Signaling
      const ouL1TrainControl = await this.createOrganizationalUnit({
        id: 'ou-l1-train-control',
        name: 'Tổ tuần tra thiết bị chạy tàu',
        description: 'Tổ bảo trì L1 (hàng ngày): kiểm tra hiển thị đèn tín hiệu ga, bộ đếm trục và máy chuyển ghi hiện trường.',
        domainId: domain.id,
        parentId: ouSignaling.id
      } as any);

      const ouL2AtcSignaling = await this.createOrganizationalUnit({
        id: 'ou-l2-atc-signaling',
        name: 'Tổ bảo dưỡng chuyên sâu tín hiệu',
        description: 'Tổ bảo trì L2 (định kỳ): căn chỉnh máy chuyển ghi, đo điện áp mạch vòng, kiểm thử phần mềm ATO/ATP trên tàu.',
        domainId: domain.id,
        parentId: ouSignaling.id
      } as any);

      // Level 4: Tổ under Telecom
      const ouL2Telecom = await this.createOrganizationalUnit({
        id: 'ou-l2-telecom',
        name: 'Tổ bảo trì viễn thông ga',
        description: 'Tổ bảo trì L2 (định kỳ): vệ sinh camera, kiểm định bộ đàm cầm tay, cấu hình tổng đài PABX ga.',
        domainId: domain.id,
        parentId: ouTelecom.id
      } as any);

      // Level 3: Đội under Rolling Stock
      const ouRollingStockTeam = await this.createOrganizationalUnit({
        id: 'ou-rolling-stock-team',
        name: 'Đội Kỹ thuật Toa xe',
        description: 'Đội phụ trách kiểm định, bảo trì hệ thống cơ khí và điện khí của các đoàn tàu metro.',
        domainId: domain.id,
        parentId: ouRollingStock.id
      } as any);

      // Level 4: Tổ under Rolling Stock Team
      const ouL2BrakeServicing = await this.createOrganizationalUnit({
        id: 'ou-l2-brake-servicing',
        name: 'Tổ sửa chữa cơ cấu phanh hãm',
        description: 'Tổ bảo trì L2 (định kỳ): siêu âm đĩa phanh, thay thế má phanh mòn và kiểm thử lực phanh thủy lực.',
        domainId: domain.id,
        parentId: ouRollingStockTeam.id
      } as any);

      const ouL2CabinPower = await this.createOrganizationalUnit({
        id: 'ou-l2-cabin-power',
        name: 'Tổ bảo dưỡng điện toa xe',
        description: 'Tổ bảo trì L2 (định kỳ): kiểm tra ắc quy dự phòng, hệ thống điều hòa không khí HVAC cabin tàu và bảng mạch hiển thị thông tin.',
        domainId: domain.id,
        parentId: ouRollingStockTeam.id
      } as any);

      // ==========================================
      // XÍ NGHIỆP VẬN HÀNH (Operations Enterprise)
      // ==========================================
      // Level 1: Root OU for Operations
      const ouOpsRoot = await this.createOrganizationalUnit({
        id: 'ou-ops-root',
        name: 'Xí nghiệp Vận hành',
        description: 'Đơn vị tổ chức đầu não chịu trách nhiệm toàn bộ công tác điều hành chạy tàu, bán vé và phục vụ hành khách ga Metro (Operations Enterprise).',
        domainId: domain.id,
        parentId: undefined
      } as any);

      // Level 2: Các bộ phận under Operations
      const ouOcc = await this.createOrganizationalUnit({
        id: 'ou-occ',
        name: 'Trung tâm Điều độ OCC',
        description: 'Trung tâm kiểm soát điều khiển chạy tàu, cung cấp điện và thông tin tín hiệu toàn mạng lưới đường sắt đô thị (OCC Dispatch Center).',
        domainId: domain.id,
        parentId: ouOpsRoot.id
      } as any);

      const ouStations = await this.createOrganizationalUnit({
        id: 'ou-stations',
        name: 'Đội Vận hành Ga',
        description: 'Đội quản lý toàn bộ các ga hành khách, dịch vụ bán vé, an ninh ga và đón tiễn tàu.',
        domainId: domain.id,
        parentId: ouOpsRoot.id
      } as any);

      const ouDrivers = await this.createOrganizationalUnit({
        id: 'ou-drivers',
        name: 'Đội Vận hành Tàu',
        description: 'Đội quản lý lực lượng lái tàu chính tuyến và lái tàu dồn dịch trong Depot.',
        domainId: domain.id,
        parentId: ouOpsRoot.id
      } as any);

      // Level 3: Tổ under OCC
      const ouDispatcherTrain = await this.createOrganizationalUnit({
        id: 'ou-dispatcher-train',
        name: 'Tổ điều độ chạy tàu (Train Dispatcher)',
        description: 'Tổ kiểm soát lộ trình tàu chạy trực tuyến, điều phối giãn cách và tốc độ các đoàn tàu hiện trường.',
        domainId: domain.id,
        parentId: ouOcc.id
      } as any);

      const ouDispatcherPower = await this.createOrganizationalUnit({
        id: 'ou-dispatcher-power',
        name: 'Tổ điều độ cung cấp điện (Power Dispatcher)',
        description: 'Tổ giám sát và ngắt tủ điện ngầm, cung cấp điện chạy tàu và điện ga an toàn.',
        domainId: domain.id,
        parentId: ouOcc.id
      } as any);

      // Level 3: Nhóm ga under Stations (Working Locations)
      const ouStationCatLinh = await this.createOrganizationalUnit({
        id: 'ou-station-catlinh',
        name: 'Nhóm ga Cát Linh (Terminal Station)',
        description: 'Tổ vận hành tại ga đầu tuyến Cát Linh: Trưởng ga, Trực ban và Nhân viên bán vé ga.',
        domainId: domain.id,
        parentId: ouStations.id
      } as any);

      const ouStationPhungKhoang = await this.createOrganizationalUnit({
        id: 'ou-station-phungkhoang',
        name: 'Nhóm ga Phùng Khoang (Intermediate Station)',
        description: 'Tổ vận hành tại ga trung gian Phùng Khoang.',
        domainId: domain.id,
        parentId: ouStations.id
      } as any);

      const ouStationYenNghia = await this.createOrganizationalUnit({
        id: 'ou-station-yennghia',
        name: 'Nhóm ga Yên Nghĩa (Terminal Station & Depot)',
        description: 'Tổ vận hành tại ga cuối Yên Nghĩa và phụ cận khu vực Depot.',
        domainId: domain.id,
        parentId: ouStations.id
      } as any);

      // Level 3: Tổ under Train Driving (Drivers)
      const ouDriverMain = await this.createOrganizationalUnit({
        id: 'ou-driver-main',
        name: 'Tổ lái tàu chính Tuyến Cát Linh - Hà Đông',
        description: 'Tổ lái tàu chính chịu trách nhiệm trực tiếp điều khiển các đoàn tàu đón trả khách an toàn.',
        domainId: domain.id,
        parentId: ouDrivers.id
      } as any);

      const ouDriverDepot = await this.createOrganizationalUnit({
        id: 'ou-driver-depot',
        name: 'Tổ lái tàu dồn dịch Depot',
        description: 'Tổ lái tàu chuyên dụng dồn tàu vào xưởng sửa chữa, khu vực đỗ xe và chạy thử trong khu vực Depot.',
        domainId: domain.id,
        parentId: ouDrivers.id
      } as any);

      // 7. Assign existing users to seeded OUs & Roles
      const users = await getInternalUsers();
      for (const u of users) {
        if (u.email === 'nhhoang@hurc.vn') {
          await dbProvider.update('User', u.id, { 
            ouId: ouRoot.id, 
            department: 'Xí nghiệp Bảo trì Thiết bị',
            role: ROLE_SUPER_ADMIN
          });
        } else {
          // Dynamic allocation to support BOTH Maintenance and Operations Branches!
          const emailLower = u.email.toLowerCase();
          const nameLower = u.name.toLowerCase();

          if (emailLower.includes('dispatcher') || nameLower.includes('điều độ') || nameLower.includes('occ')) {
            // OCC Dispatchers -> Specialist L3
            await dbProvider.update('User', u.id, {
              ouId: ouDispatcherTrain.id,
              department: 'Tổ điều độ chạy tàu',
              role: ROLE_L3_SPECIALIST
            });
          } else if (emailLower.includes('driver') || nameLower.includes('lái tàu')) {
            // Train Drivers -> Technician L2
            await dbProvider.update('User', u.id, {
              ouId: ouDriverMain.id,
              department: 'Tổ lái tàu chính Tuyến Cát Linh - Hà Đông',
              role: ROLE_L2_TECHNICIAN
            });
          } else if (emailLower.includes('station') || nameLower.includes('trưởng ga') || nameLower.includes('trực ban')) {
            // Station Masters -> Technician L2
            await dbProvider.update('User', u.id, {
              ouId: ouStationCatLinh.id,
              department: 'Nhóm ga Cát Linh',
              role: ROLE_L2_TECHNICIAN
            });
          } else if (emailLower.includes('operator') || nameLower.includes('bán vé') || nameLower.includes('nhân viên ga')) {
            // Station Staff -> Operator L1
            await dbProvider.update('User', u.id, {
              ouId: ouStationCatLinh.id,
              department: 'Nhóm ga Cát Linh',
              role: ROLE_L1_OPERATOR
            });
          } else if (emailLower.includes('specialist') || nameLower.includes('chuyên viên')) {
            // Maintenance Specialists -> Specialist L3
            await dbProvider.update('User', u.id, {
              ouId: ouInfra.id,
              department: 'Phân xưởng Bảo trì Hạ tầng',
              role: ROLE_L3_SPECIALIST
            });
          } else if (emailLower.includes('tech') || nameLower.includes('kỹ thuật viên')) {
            // Maintenance Technicians -> Technician L2
            await dbProvider.update('User', u.id, {
              ouId: ouL2PowerGrid.id,
              department: 'Tổ bảo dưỡng thiết bị điện chuyên sâu',
              role: ROLE_L2_TECHNICIAN
            });
          } else if (emailLower.includes('operator') || nameLower.includes('nhân viên bảo trì')) {
            // Maintenance Operators -> Operator L1
            await dbProvider.update('User', u.id, {
              ouId: ouL1TrackPatrol.id,
              department: 'Tổ tuần tra ray Cát Linh - Hà Đông',
              role: ROLE_L1_OPERATOR
            });
          } else if ((u.role as string) === 'Admin') {
            await dbProvider.update('User', u.id, {
              ouId: ouRoot.id,
              department: 'Phòng Kỹ thuật An toàn',
              role: ROLE_ADMIN_PKTAT
            });
          }
        }
      }

      return true;
    } catch (e) {
      console.error('Failed to seed AD structure:', e);
      return false;
    }
  }
}
