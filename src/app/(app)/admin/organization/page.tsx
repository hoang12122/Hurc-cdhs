// src/app/(app)/admin/organization/page.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Network, FolderGit2, Globe2, FolderTree, User as UserIcon, 
  ChevronRight, ChevronDown, Plus, Trash2, Edit, RefreshCw, 
  ShieldAlert, UserCheck, Layers, Settings, Undo2, MapPin, 
  Building2, SlidersHorizontal, ShieldCheck, CheckSquare, PlusCircle,
  Database
} from "lucide-react";
import { ROLE_SUPER_ADMIN, SYSTEM_PERMISSIONS, type SystemPermission, type Role, type ResponsibleUnit, type Subsystem, type PatrolLocation } from "@/lib/constants";
import { 
  getOrganizationTree, 
  getOUList, 
  upsertOrganizationalUnit, 
  deleteOrganizationalUnit, 
  seedOrganization,
  upsertForest,
  deleteForest,
  upsertTree,
  deleteTree,
  upsertDomain,
  deleteDomain
} from "@/lib/actions/organization.actions";
import { addRole, updateRole, deleteRole, getRoles } from "@/lib/actions/role.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { 
  addResponsibleUnit, updateResponsibleUnit, deleteResponsibleUnit, getResponsibleUnits,
  addSubsystem, updateSubsystem, deleteSubsystem, getSubsystems,
  addLocation, updateLocation, deleteLocation, getLocations
} from "@/lib/actions/category.actions";
import { undoLastChange } from "@/lib/actions/system.actions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface TreeNode {
  id: string;
  name: string;
  type: 'forest' | 'tree' | 'domain' | 'ou' | 'user';
  description?: string;
  email?: string;
  role?: string;
  status?: string;
  children?: TreeNode[];
}

export default function IntegratedADConsolePage() {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();
  
  // URL tab syncing
  const [activeTab, setActiveTab] = React.useState(searchParams.get("tab") || "hierarchy");

  // Global loading
  const [loading, setLoading] = React.useState(true);

  // Stats Counters
  const [stats, setStats] = React.useState({
    totalOUs: 0,
    totalRoles: 0,
    totalLocations: 0,
    totalSystems: 0,
    totalUnits: 0,
    totalUsers: 0
  });

  // ==========================================
  // STATE 1: AD HIERARCHY STATE
  // ==========================================
  const [treeData, setTreeData] = React.useState<TreeNode[]>([]);
  const [ouList, setOuList] = React.useState<any[]>([]);
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = React.useState<TreeNode | null>(null);

  // Dialog state for AD Nodes
  const [isADDialogOpen, setIsADDialogOpen] = React.useState(false);
  const [adDialogMode, setAdDialogMode] = React.useState<'create' | 'edit'>('create');
  const [adDialogNodeType, setAdDialogNodeType] = React.useState<'forest' | 'tree' | 'domain' | 'ou'>('ou');
  const [adDialogTarget, setAdDialogTarget] = React.useState<{
    id?: string;
    name: string;
    description: string;
    forestId?: string;
    treeId?: string;
    domainId?: string;
    parentId?: string;
  }>({ name: "", description: "" });

  // ==========================================
  // STATE 2: ROLES STATE
  // ==========================================
  const [rolesData, setRolesData] = React.useState<Role[]>([]);
  const [usersData, setUsersData] = React.useState<any[]>([]);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  
  // Custom permissions dialog state
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = React.useState(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = React.useState<Role | null>(null);
  const [currentPermissions, setCurrentPermissions] = React.useState<string[]>([]);
  
  // Role Form Fields
  const [roleFormId, setRoleFormId] = React.useState("");
  const [roleFormName, setRoleFormName] = React.useState("");
  const [roleFormDescription, setRoleFormDescription] = React.useState("");

  // ==========================================
  // STATE 3: CATEGORIES STATE
  // ==========================================
  const [locations, setLocations] = React.useState<PatrolLocation[]>([]);
  const [responsibleUnits, setResponsibleUnits] = React.useState<ResponsibleUnit[]>([]);
  const [subsystems, setSubsystems] = React.useState<Subsystem[]>([]);
  const [categorySubTab, setCategorySubTab] = React.useState("locations");

  // Category Dialog state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [categoryType, setCategoryType] = React.useState<'location' | 'unit' | 'subsystem'>('location');
  const [categoryMode, setCategoryMode] = React.useState<'create' | 'edit'>('create');
  
  // Category Fields
  const [catFieldId, setCatFieldId] = React.useState("");
  const [catFieldLabel, setCatFieldLabel] = React.useState("");
  const [catFieldLabelEn, setCatFieldLabelEn] = React.useState("");

  // Permissions validation
  const currentUserRole = currentUser?.role;
  const isSuperAdmin = currentUserRole === ROLE_SUPER_ADMIN;
  const isAuthorized = isSuperAdmin || currentUser?.permissions?.some(p => ['organization:manage', 'roles:manage', 'settings:manage'].includes(p));

  // Sync tab with URL query param
  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("tab", val);
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  // ==========================================
  // DATA INGESTION ENGINE
  // ==========================================
  const loadAllData = React.useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch AD Hierarchy Data
      const [tree, ous] = await Promise.all([
        getOrganizationTree(),
        getOUList()
      ]);
      
      const actualTree = (tree && typeof tree === 'object' && 'error' in tree) ? [] : (tree || []) as TreeNode[];
      setTreeData(actualTree);
      setOuList(ous || []);

      // Auto expand root node on initial load
      if (Object.keys(expandedNodes).length === 0 && actualTree.length > 0) {
        const autoExpand: Record<string, boolean> = {};
        actualTree.forEach(f => {
          autoExpand[f.id] = true;
          f.children?.forEach(t => {
            autoExpand[t.id] = true;
          });
        });
        setExpandedNodes(autoExpand);
      }

      // 2. Fetch Roles and Users Data
      const [roles, users] = await Promise.all([getRoles(), getUsers()]);
      setRolesData(roles || []);
      setUsersData(users || []);

      // 3. Fetch Category Data
      const [locs, units, subs] = await Promise.all([
        getLocations(),
        getResponsibleUnits(),
        getSubsystems()
      ]);
      setLocations(locs || []);
      setResponsibleUnits(units || []);
      setSubsystems(subs || []);

      // Update counters
      let ouCount = ous?.length || 0;
      let userCount = users?.length || 0;
      setStats({
        totalOUs: ouCount,
        totalRoles: roles?.length || 0,
        totalLocations: locs?.length || 0,
        totalSystems: subs?.length || 0,
        totalUnits: units?.length || 0,
        totalUsers: userCount
      });

    } catch (e: any) {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Tải dữ liệu thất bại" : "Failed to load data",
        description: e.message
      });
    } finally {
      setLoading(false);
    }
  }, [locale, toast, expandedNodes]);

  React.useEffect(() => {
    loadAllData();
  }, []);

  // Collapse/Expand toggle
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Node Selection
  const handleSelectNode = (node: TreeNode) => {
    setSelectedNode(node);
  };

  // AD Seeding
  const handleSeed = async () => {
    setLoading(true);
    const res = await seedOrganization();
    if (res.success) {
      toast({
        title: locale === 'vi' ? "Thành công" : "Success",
        description: res.message
      });
      await loadAllData();
    } else {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi" : "Error",
        description: res.message || res.error
      });
    }
    setLoading(false);
  };

  // Traversal helper to find users recursively
  const getAllUsersUnderNode = (node: TreeNode): any[] => {
    const list: any[] = [];
    const traverse = (n: TreeNode) => {
      if (n.type === 'user') {
        list.push(n);
      }
      if (n.children) {
        n.children.forEach(traverse);
      }
    };
    traverse(node);
    return list;
  };

  // ==========================================
  // ACTION ENGINE: UNIFIED ROLLBACK (UNDO)
  // ==========================================
  const handleUnifiedUndo = async () => {
    setLoading(true);
    let success = false;
    let modelName = "";

    try {
      let undoRes: any = null;
      if (activeTab === "hierarchy") {
        undoRes = await undoLastChange('ActiveDirectory');
        modelName = locale === 'vi' ? "Cơ cấu tổ chức AD" : "AD organizational hierarchy";
      } else if (activeTab === "roles") {
        undoRes = await undoLastChange('Role');
        modelName = locale === 'vi' ? "Vai trò & Quyền hạn" : "Roles & permissions";
      } else if (activeTab === "categories") {
        if (categorySubTab === "locations") {
          undoRes = await undoLastChange('PatrolLocation');
          modelName = locale === 'vi' ? "Danh mục Vị trí" : "Locations list";
        } else if (categorySubTab === "responsible-units") {
          undoRes = await undoLastChange('ResponsibleUnit');
          modelName = locale === 'vi' ? "Danh mục Đơn vị chuyên trách" : "Responsible units list";
        } else if (categorySubTab === "subsystems") {
          undoRes = await undoLastChange('Subsystem');
          modelName = locale === 'vi' ? "Danh mục Phân hệ" : "Subsystems list";
        }
      }
      success = !!undoRes?.success;

      if (success) {
        toast({
          title: locale === 'vi' ? "Hoàn tác thành công" : "Undo successful",
          description: locale === 'vi' ? `Đã đưa ${modelName} quay lại phiên bản trước.` : `Restored ${modelName} to its prior state.`
        });
        await loadAllData();
      } else {
        toast({
          title: locale === 'vi' ? "Không có gì để hoàn tác" : "Nothing to undo",
          description: locale === 'vi' ? "Không tìm thấy phiên bản lưu trữ gần đây." : "No recent backup state detected."
        });
      }
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi hoàn tác",
        description: e.message
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CRUD ENGINE 1: AD HIERARCHY
  // ==========================================
  const openADNodeDialog = (mode: 'create' | 'edit', type: 'forest' | 'tree' | 'domain' | 'ou' = 'ou', node?: TreeNode) => {
    setAdDialogMode(mode);
    setAdDialogNodeType(type);
    
    if (mode === 'create') {
      let defaultForestId = treeData[0]?.id || "";
      let defaultTreeId = treeData[0]?.children?.[0]?.id || "";
      let defaultDomainId = treeData[0]?.children?.[0]?.children?.[0]?.id || "";
      let defaultParentId = "";
      
      if (selectedNode) {
        if (selectedNode.type === 'forest') {
          defaultForestId = selectedNode.id;
        } else if (selectedNode.type === 'tree') {
          defaultTreeId = selectedNode.id;
          const foundForest = treeData.find(f => f.children?.some(t => t.id === selectedNode.id));
          if (foundForest) defaultForestId = foundForest.id;
        } else if (selectedNode.type === 'domain') {
          defaultDomainId = selectedNode.id;
          for (const f of treeData) {
            const foundTree = f.children?.find(t => t.children?.some(d => d.id === selectedNode.id));
            if (foundTree) {
              defaultTreeId = foundTree.id;
              defaultForestId = f.id;
              break;
            }
          }
        } else if (selectedNode.type === 'ou') {
          defaultParentId = selectedNode.id;
          for (const f of treeData) {
            if (f.children) {
              for (const t of f.children) {
                if (t.children) {
                  for (const d of t.children) {
                    const checkOus = (ouNodes: TreeNode[]): boolean => {
                      return ouNodes.some(o => o.id === selectedNode.id || (o.children && checkOus(o.children)));
                    };
                    if (d.children && checkOus(d.children)) {
                      defaultDomainId = d.id;
                      defaultTreeId = t.id;
                      defaultForestId = f.id;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }

      setAdDialogTarget({
        name: "",
        description: "",
        forestId: defaultForestId,
        treeId: defaultTreeId,
        domainId: defaultDomainId,
        parentId: defaultParentId
      });
    } else if (mode === 'edit' && node) {
      let defaultForestId = "";
      let defaultTreeId = "";
      let defaultDomainId = "";
      let defaultParentId = "";

      if (type === 'tree') {
        const foundForest = treeData.find(f => f.children?.some(t => t.id === node.id));
        if (foundForest) defaultForestId = foundForest.id;
      } else if (type === 'domain') {
        for (const f of treeData) {
          const foundTree = f.children?.find(t => t.children?.some(d => d.id === node.id));
          if (foundTree) {
            defaultTreeId = foundTree.id;
            break;
          }
        }
      } else if (type === 'ou') {
        const ouInfo = ouList.find(o => o.id === node.id);
        if (ouInfo) {
          defaultDomainId = ouInfo.domainId || "";
          defaultParentId = ouInfo.parentId || "";
        }
      }

      setAdDialogTarget({
        id: node.id,
        name: node.name,
        description: node.description || "",
        forestId: defaultForestId,
        treeId: defaultTreeId,
        domainId: defaultDomainId,
        parentId: defaultParentId
      });
    }
    setIsADDialogOpen(true);
  };

  const handleSubmitADNode = async () => {
    if (!adDialogTarget.name.trim()) {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi nhập liệu" : "Input Error",
        description: locale === 'vi' ? "Vui lòng nhập tên đối tượng." : "Please enter a name."
      });
      return;
    }

    setLoading(true);
    let res: { success: boolean; error?: string } = { success: false, error: "Loại đối tượng không xác định" };

    if (adDialogNodeType === 'forest') {
      res = await upsertForest({
        id: adDialogTarget.id,
        name: adDialogTarget.name,
        description: adDialogTarget.description
      });
    } else if (adDialogNodeType === 'tree') {
      if (!adDialogTarget.forestId) {
        toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng chọn Rừng trực thuộc." });
        setLoading(false);
        return;
      }
      res = await upsertTree({
        id: adDialogTarget.id,
        name: adDialogTarget.name,
        description: adDialogTarget.description,
        forestId: adDialogTarget.forestId
      });
    } else if (adDialogNodeType === 'domain') {
      if (!adDialogTarget.treeId) {
        toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng chọn Cây trực thuộc." });
        setLoading(false);
        return;
      }
      res = await upsertDomain({
        id: adDialogTarget.id,
        name: adDialogTarget.name,
        description: adDialogTarget.description,
        treeId: adDialogTarget.treeId
      });
    } else if (adDialogNodeType === 'ou') {
      if (!adDialogTarget.domainId) {
        toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng chọn Miền con trực thuộc." });
        setLoading(false);
        return;
      }
      res = await upsertOrganizationalUnit({
        id: adDialogTarget.id,
        name: adDialogTarget.name,
        description: adDialogTarget.description,
        domainId: adDialogTarget.domainId,
        parentId: adDialogTarget.parentId || undefined
      });
    }

    if (res.success) {
      toast({
        title: locale === 'vi' ? "Thành công" : "Success",
        description: locale === 'vi' ? "Đã lưu đối tượng thành công!" : "Saved AD object successfully."
      });
      setIsADDialogOpen(false);
      await loadAllData();
      if (selectedNode && selectedNode.id === adDialogTarget.id) {
        setSelectedNode(prev => prev ? { ...prev, name: adDialogTarget.name, description: adDialogTarget.description } : null);
      }
    } else {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi thao tác" : "Action failed",
        description: res.error
      });
    }
    setLoading(false);
  };

  const handleDeleteADNode = async (type: TreeNode['type'], id: string) => {
    let confirmMsg = locale === 'vi' 
      ? "Bạn có chắc chắn muốn xóa đối tượng này và các cấp con trực thuộc không? Người dùng trực thuộc sẽ bị gỡ bỏ cấu trúc." 
      : "Are you sure you want to delete this node and all of its descendants? Resident users will be detached.";
      
    if (!confirm(confirmMsg)) return;

    setLoading(true);
    let res: { success: boolean; error?: string } = { success: false, error: "Không thể thực hiện xóa" };

    if (type === 'forest') {
      res = await deleteForest(id);
    } else if (type === 'tree') {
      res = await deleteTree(id);
    } else if (type === 'domain') {
      res = await deleteDomain(id);
    } else if (type === 'ou') {
      res = await deleteOrganizationalUnit(id);
    }

    if (res.success) {
      toast({
        title: locale === 'vi' ? "Thành công" : "Success",
        description: locale === 'vi' ? "Đã xóa đối tượng AD thành công." : "Node deleted successfully."
      });
      setSelectedNode(null);
      await loadAllData();
    } else {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi" : "Error",
        description: res.error
      });
    }
    setLoading(false);
  };

  // Node styling helpers for AD tree
  const getNodeColor = (type: TreeNode['type'], isSelected: boolean) => {
    if (isSelected) return "border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-primary";
    
    switch (type) {
      case 'forest': return "border-blue-500/20 hover:border-blue-400 text-blue-400 bg-blue-950/20";
      case 'tree': return "border-emerald-500/20 hover:border-emerald-400 text-emerald-400 bg-emerald-950/20";
      case 'domain': return "border-violet-500/20 hover:border-violet-400 text-violet-400 bg-violet-950/20";
      case 'ou': return "border-amber-500/20 hover:border-amber-400 text-amber-400 bg-amber-950/20";
      case 'user': return "border-slate-800/30 hover:border-slate-500 text-slate-300 bg-slate-900/10";
    }
  };

  const getNodeIcon = (type: TreeNode['type']) => {
    switch (type) {
      case 'forest': return <Network className="h-4 w-4" />;
      case 'tree': return <FolderGit2 className="h-4 w-4" />;
      case 'domain': return <Globe2 className="h-4 w-4" />;
      case 'ou': return <FolderTree className="h-4 w-4" />;
      case 'user': return <UserIcon className="h-4 w-4 text-slate-400" />;
    }
  };

  const getLabelByType = (type: TreeNode['type']) => {
    switch (type) {
      case 'forest': return locale === 'vi' ? "Rừng hệ thống" : "Forest Root";
      case 'tree': return locale === 'vi' ? "Cây thư mục" : "Tree Root";
      case 'domain': return locale === 'vi' ? "Miền con" : "Child Domain";
      case 'ou': return locale === 'vi' ? "Đơn vị tổ chức" : "Organizational Unit";
      case 'user': return locale === 'vi' ? "Người dùng" : "User Account";
    }
  };

  // Render AD Tree recursively
  const renderTreeNodes = (nodes: TreeNode[]) => {
    return nodes.map(node => {
      const isExpanded = !!expandedNodes[node.id];
      const hasChildren = node.children && node.children.length > 0;
      const isSelected = selectedNode?.id === node.id;
      
      return (
        <div key={node.id} className="flex flex-col ml-4">
          <div 
            onClick={() => handleSelectNode(node)}
            className={`flex items-center gap-2 p-2.5 my-1 rounded-lg border backdrop-blur-sm cursor-pointer transition-all duration-300 ${getNodeColor(node.type, isSelected)}`}
          >
            {hasChildren ? (
              <button 
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 rounded hover:bg-slate-800 transition-colors"
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <div className="w-4.5" />
            )}
            
            {getNodeIcon(node.type)}
            <span className="font-medium text-sm font-sans truncate">{node.name}</span>
            {node.type !== 'user' && node.children && (
              <span className="text-[10px] opacity-60 ml-auto mr-1 bg-black/30 px-1.5 py-0.5 rounded-full">
                {node.children.length}
              </span>
            )}
          </div>
          
          {hasChildren && isExpanded && (
            <div className="border-l border-slate-800/80 ml-2 transition-all">
              {renderTreeNodes(node.children!)}
            </div>
          )}
        </div>
      );
    });
  };

  // ==========================================
  // CRUD ENGINE 2: ROLES & SYSTEM PERMISSIONS
  // ==========================================
  const handleOpenAddRoleDialog = () => {
    setEditingRole(null);
    setRoleFormId("");
    setRoleFormName("");
    setRoleFormDescription("");
    setIsRoleDialogOpen(true);
  };

  const handleOpenEditRoleDialog = (role: Role) => {
    setEditingRole(role);
    setRoleFormId(role.id);
    setRoleFormName(role.name);
    setRoleFormDescription(role.description);
    setIsRoleDialogOpen(true);
  };

  const onSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleFormId.trim() || !roleFormName.trim() || !roleFormDescription.trim()) {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Thiếu thông tin" : "Missing Info",
        description: locale === 'vi' ? "Vui lòng nhập đầy đủ các trường bắt buộc." : "All fields are required."
      });
      return;
    }

    setLoading(true);
    const roleWithPermissions = {
      id: roleFormId,
      name: roleFormName,
      description: roleFormDescription,
      permissions: editingRole?.permissions || []
    };

    if (editingRole) {
      await updateRole({ ...editingRole, ...roleWithPermissions });
      toast({ title: locale === 'vi' ? "Cập nhật vai trò thành công!" : "Role updated successfully!" });
    } else {
      if (rolesData.some(r => r.id === roleFormId)) {
        toast({ variant: "destructive", title: locale === 'vi' ? "Mã vai trò đã tồn tại!" : "Role ID already exists!" });
        setLoading(false);
        return;
      }
      await addRole(roleWithPermissions);
      toast({ title: locale === 'vi' ? "Tạo vai trò thành công!" : "Role added successfully!" });
    }
    
    setIsRoleDialogOpen(false);
    await loadAllData();
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm(locale === 'vi' ? "Xác nhận xóa vai trò này?" : "Confirm deleting this role?")) return;
    setLoading(true);
    await deleteRole(roleId);
    toast({ title: locale === 'vi' ? "Đã xóa vai trò!" : "Role deleted!" });
    await loadAllData();
  };

  const handleOpenPermissionsDialog = (role: Role) => {
    setSelectedRoleForPermissions(role);
    setCurrentPermissions(role.permissions || []);
    setIsPermissionsDialogOpen(true);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean | string) => {
    setCurrentPermissions(prev =>
      checked
        ? [...prev, permissionId]
        : prev.filter(p => p !== permissionId)
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleForPermissions) return;
    setLoading(true);
    const updatedRole = { ...selectedRoleForPermissions, permissions: currentPermissions };
    await updateRole(updatedRole);
    toast({
      title: locale === 'vi' ? "Đã cập nhật quyền!" : "Permissions updated!",
      description: locale === 'vi' 
        ? `Đã cập nhật quyền hạn thành công cho vai trò: ${selectedRoleForPermissions.name}`
        : `Access control saved for role: ${selectedRoleForPermissions.name}`
    });
    setIsPermissionsDialogOpen(false);
    await loadAllData();
  };

  const groupedSystemPermissions = React.useMemo(() => 
    SYSTEM_PERMISSIONS.reduce((acc, perm) => {
      const groupLabel = perm.group[locale];
      if (!acc[groupLabel]) {
        acc[groupLabel] = [];
      }
      acc[groupLabel].push(perm);
      return acc;
    }, {} as Record<string, SystemPermission[]>), 
  [locale]);

  // ==========================================
  // CRUD ENGINE 3: DYNAMIC BUSINESS CATEGORIES
  // ==========================================
  const handleOpenCatDialog = (type: 'location' | 'unit' | 'subsystem', mode: 'create' | 'edit', item?: any) => {
    setCategoryType(type);
    setCategoryMode(mode);
    
    if (mode === 'create') {
      setCatFieldId("");
      setCatFieldLabel("");
      setCatFieldLabelEn("");
    } else if (mode === 'edit' && item) {
      setCatFieldId(item.id);
      if (type === 'location' || type === 'unit') {
        setCatFieldLabel(item.label || item.name || "");
      } else if (type === 'subsystem') {
        setCatFieldLabel(item.label.vi || "");
        setCatFieldLabelEn(item.label.en || "");
      }
    }
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!catFieldId.trim() || !catFieldLabel.trim()) {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi nhập liệu" : "Input Error",
        description: locale === 'vi' ? "Mã và Tên hiển thị không được bỏ trống." : "ID and label cannot be blank."
      });
      return;
    }

    setLoading(true);

    if (categoryType === 'location') {
      const payload: PatrolLocation = { id: catFieldId, label: catFieldLabel };
      if (categoryMode === 'create') {
        if (locations.some(l => l.id === catFieldId)) {
          toast({ variant: "destructive", title: locale === 'vi' ? "Mã vị trí đã tồn tại." : "Location ID exists." });
          setLoading(false);
          return;
        }
        await addLocation(payload);
        toast({ title: locale === 'vi' ? "Đã tạo vị trí mới." : "Location created." });
      } else {
        await updateLocation(payload);
        toast({ title: locale === 'vi' ? "Đã cập nhật vị trí." : "Location updated." });
      }
    } 
    else if (categoryType === 'unit') {
      if (categoryMode === 'create') {
        if (responsibleUnits.some(u => u.name === catFieldLabel)) {
          toast({ variant: "destructive", title: locale === 'vi' ? "Tên đơn vị này đã tồn tại." : "Unit name exists." });
          setLoading(false);
          return;
        }
        await addResponsibleUnit({ name: catFieldLabel });
        toast({ title: locale === 'vi' ? "Đã thêm đơn vị chịu trách nhiệm." : "Unit created." });
      } else {
        await updateResponsibleUnit({ id: catFieldId, name: catFieldLabel });
        toast({ title: locale === 'vi' ? "Đã cập nhật đơn vị chịu trách nhiệm." : "Unit updated." });
      }
    } 
    else if (categoryType === 'subsystem') {
      if (!catFieldLabelEn.trim()) {
        toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng nhập tên tiếng Anh." });
        setLoading(false);
        return;
      }
      const payload: Subsystem = { 
        id: catFieldId, 
        label: { vi: catFieldLabel, en: catFieldLabelEn } 
      };

      if (categoryMode === 'create') {
        if (subsystems.some(s => s.id === catFieldId)) {
          toast({ variant: "destructive", title: locale === 'vi' ? "Mã hệ thống đã tồn tại." : "System ID exists." });
          setLoading(false);
          return;
        }
        await addSubsystem(payload);
        toast({ title: locale === 'vi' ? "Đã thêm phân hệ mới." : "Subsystem created." });
      } else {
        await updateSubsystem(payload);
        toast({ title: locale === 'vi' ? "Đã cập nhật phân hệ." : "Subsystem updated." });
      }
    }

    setIsCategoryDialogOpen(false);
    await loadAllData();
  };

  const handleDeleteCategory = async (type: 'location' | 'unit' | 'subsystem', id: string) => {
    if (!confirm(locale === 'vi' ? "Bạn có chắc chắn muốn xóa bản ghi này? Các mối liên hệ sẽ được dọn sạch." : "Confirm deletion? All referencing users will be swept clean.")) return;
    setLoading(true);

    if (type === 'location') {
      await deleteLocation(id);
    } else if (type === 'unit') {
      await deleteResponsibleUnit(id);
    } else if (type === 'subsystem') {
      await deleteSubsystem(id);
    }

    toast({ title: locale === 'vi' ? "Đã xóa bản ghi thành công." : "Record deleted successfully." });
    await loadAllData();
  };

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh]">
        <Card className="w-full max-w-md p-8 text-center glass-card border-red-500/20">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4 animate-bounce" />
          <CardTitle className="text-2xl text-destructive mb-4">
            {locale === 'vi' ? "Từ chối truy cập" : "Access Denied"}
          </CardTitle>
          <CardDescription>
            {locale === 'vi' 
              ? "Bạn không có quyền quản lý và cấu hình phân quyền Active Directory." 
              : "You do not have administrative clearance to access Active Directory console."}
          </CardDescription>
          <Button asChild className="mt-6 shadow-glow">
            <Link href="/dashboard">
              {locale === 'vi' ? 'Quay lại Bảng điều khiển' : 'Back to Dashboard'}
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  // AD inspector selection Resident member loading
  const inspectorUsers = selectedNode ? getAllUsersUnderNode(selectedNode) : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Title Hub & Stat Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2.5">
            <Layers className="h-8 w-8 text-primary animate-pulse" />
            {locale === 'vi' ? "Trung tâm Vận hành & Phân quyền AD" : "Active Directory & RBAC Console"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {locale === 'vi'
              ? "Hợp nhất quản trị cơ cấu AD, Vai trò bảo trì, phân quyền hệ thống và danh mục động."
              : "Unified Active Directory structures, graded roles, granular access controls, and business categories."}
          </p>
        </div>
        
        {/* Unified Top-Right Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {treeData.length === 0 && (
            <Button variant="outline" onClick={handleSeed} className="border-amber-500/30 text-amber-400 hover:bg-amber-950/20 gap-1 animate-pulse">
              <RefreshCw className="h-4 w-4" />
              {locale === 'vi' ? "Khởi tạo Dữ liệu Mẫu" : "Seed Sample Data"}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUnifiedUndo} 
            disabled={loading}
            className="gap-1 border-amber-500/30 text-amber-400 hover:bg-amber-950/20 backdrop-blur-sm"
          >
            <Undo2 className="h-4 w-4" />
            {locale === 'vi' ? "Hoàn tác (Rollback)" : "Rollback"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={loadAllData} disabled={loading} className="gap-1 backdrop-blur-sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {locale === 'vi' ? "Đồng bộ lại" : "Resync"}
          </Button>

          {activeTab === "hierarchy" && (
            <Button 
              onClick={() => openADNodeDialog('create', 'ou')} 
              className="bg-primary hover:bg-primary/95 text-white gap-1 shadow-glow"
            >
              <Plus className="h-4 w-4" />
              {locale === 'vi' ? "Thêm đối tượng AD" : "Add AD Object"}
            </Button>
          )}

          {activeTab === "roles" && (
            <Button 
              onClick={handleOpenAddRoleDialog}
              className="bg-primary hover:bg-primary/95 text-white gap-1 shadow-glow"
            >
              <PlusCircle className="h-4 w-4" />
              {locale === 'vi' ? "Thêm Vai trò" : "Add Role"}
            </Button>
          )}

          {activeTab === "categories" && (
            <Button 
              onClick={() => handleOpenCatDialog(categorySubTab as any, 'create')}
              className="bg-primary hover:bg-primary/95 text-white gap-1 shadow-glow"
            >
              <PlusCircle className="h-4 w-4" />
              {locale === 'vi' ? "Thêm Danh mục" : "Add Category Item"}
            </Button>
          )}
        </div>
      </div>

      {/* Modern Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-slate-950/20 border-slate-900 shadow-inner backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950/40 text-blue-400"><FolderTree className="h-5 w-5" /></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">{locale === 'vi' ? 'Đơn vị OU' : 'Active OUs'}</span>
              <span className="text-xl font-bold text-slate-100">{stats.totalOUs}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-950/20 border-slate-900 shadow-inner backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400"><ShieldCheck className="h-5 w-5" /></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">{locale === 'vi' ? 'Vai trò' : 'Graded Roles'}</span>
              <span className="text-xl font-bold text-slate-100">{stats.totalRoles}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/20 border-slate-900 shadow-inner backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/40 text-amber-400"><MapPin className="h-5 w-5" /></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">{locale === 'vi' ? 'Ga/Vị trí' : 'Stations'}</span>
              <span className="text-xl font-bold text-slate-100">{stats.totalLocations}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/20 border-slate-900 shadow-inner backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950/40 text-purple-400"><SlidersHorizontal className="h-5 w-5" /></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">{locale === 'vi' ? 'Phân hệ' : 'Subsystems'}</span>
              <span className="text-xl font-bold text-slate-100">{stats.totalSystems}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/20 border-slate-900 shadow-inner backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-950/40 text-violet-400"><Building2 className="h-5 w-5" /></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">{locale === 'vi' ? 'Phân xưởng' : 'Workshops'}</span>
              <span className="text-xl font-bold text-slate-100">{stats.totalUnits}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/20 border-slate-900 shadow-inner backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 text-slate-400"><UserCheck className="h-5 w-5" /></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">{locale === 'vi' ? 'Kỹ sư AD' : 'AD Users'}</span>
              <span className="text-xl font-bold text-slate-100">{stats.totalUsers}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Integrated Tab Switcher */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full lg:w-[650px] bg-slate-950/80 border border-slate-900 p-1 rounded-xl">
          <TabsTrigger value="hierarchy" className="gap-2 text-xs md:text-sm transition-all duration-300">
            <Network className="h-4 w-4" />
            {locale === 'vi' ? "Cơ cấu Tổ chức AD" : "AD Tree Hierarchy"}
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2 text-xs md:text-sm transition-all duration-300">
            <ShieldCheck className="h-4 w-4" />
            {locale === 'vi' ? "Vai trò & Phân quyền" : "Roles & RBAC"}
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 text-xs md:text-sm transition-all duration-300">
            <Database className="h-4 w-4" />
            {locale === 'vi' ? "Danh mục Nghiệp vụ" : "Business Categories"}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: AD HIERARCHY TREE */}
        <TabsContent value="hierarchy" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left tree view */}
            <Card className="lg:col-span-5 bg-slate-950/40 border-slate-900 backdrop-blur-md shadow-2xl h-[65vh] flex flex-col">
              <CardHeader className="py-4 border-b border-slate-900">
                <CardTitle className="text-base font-semibold flex items-center gap-1.5 text-slate-300">
                  <FolderTree className="h-4 w-4 text-primary" />
                  {locale === 'vi' ? "Cấu trúc Thư mục AD" : "AD Directory Tree"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'vi' ? "Quản lý rừng hệ thống, domain và đơn vị tổ chức động" : "Explore and configure recursive forest trees and dynamic OUs"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {loading && treeData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs">{locale === 'vi' ? "Đang tải dữ liệu AD..." : "Loading AD Directory..."}</span>
                  </div>
                ) : (
                  <div className="-ml-4">
                    {renderTreeNodes(treeData)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right inspector detail */}
            <Card className="lg:col-span-7 bg-slate-950/40 border-slate-900 backdrop-blur-md shadow-2xl h-[65vh] flex flex-col">
              <CardHeader className="py-4 border-b border-slate-900">
                <CardTitle className="text-base font-semibold flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Settings className="h-4 w-4 text-slate-400" />
                    {locale === 'vi' ? "Chi tiết Cấu trúc & Nhân sự" : "Resident Details & Inspector"}
                  </span>
                  {selectedNode && (
                    <Badge variant="outline" className="text-[10px] uppercase font-bold border-slate-700 bg-slate-950 px-2 py-0.5">
                      {getLabelByType(selectedNode.type)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                {!selectedNode ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                    <Network className="h-12 w-12 stroke-[1.5] text-slate-700" />
                    <span className="text-sm font-sans">{locale === 'vi' ? "Bấm chọn một nút trên cơ cấu cây bên trái để bắt đầu kiểm tra" : "Select an active node to inspect metadata"}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/60 shadow-inner">
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <h2 className="text-xl font-bold font-sans text-slate-200 truncate">{selectedNode.name}</h2>
                        <span className="text-xs text-slate-500 font-mono select-all truncate">ID: {selectedNode.id}</span>
                        {selectedNode.description && (
                          <p className="text-sm text-slate-400 mt-2 italic">“{selectedNode.description}”</p>
                        )}
                      </div>
                      
                      {['forest', 'tree', 'domain', 'ou'].includes(selectedNode.type) && isSuperAdmin && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openADNodeDialog('edit', selectedNode.type as any, selectedNode)}
                            className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800 text-xs px-2.5"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1 text-primary" />
                            {locale === 'vi' ? "Sửa" : "Edit"}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteADNode(selectedNode.type, selectedNode.id)}
                            className="h-8 bg-destructive hover:bg-destructive/90 text-xs px-2.5"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            {locale === 'vi' ? "Xóa" : "Delete"}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Member Listing under node hierarchy */}
                    <div className="flex flex-col gap-3">
                      <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                        <UserCheck className="h-4 w-4 text-emerald-400" />
                        {locale === 'vi' 
                          ? `Nhân sự kỹ sư trực thuộc (${inspectorUsers.length})` 
                          : `Resident & Descendant Staff (${inspectorUsers.length})`}
                      </h3>
                      
                      {inspectorUsers.length === 0 ? (
                        <div className="p-6 text-center border border-dashed border-slate-850 rounded-xl text-slate-500 text-xs">
                          {locale === 'vi' ? "Không có nhân sự trực thuộc đơn vị này." : "No resident users found."}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[30vh] overflow-y-auto pr-1">
                          {inspectorUsers.map(usr => (
                            <div 
                              key={usr.id} 
                              className="flex items-center gap-3 p-3 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:bg-slate-900/40 transition-colors"
                            >
                              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700 shadow-inner">
                                {usr.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium text-slate-300 truncate">{usr.name}</span>
                                <span className="text-[11px] text-slate-500 font-mono truncate">{usr.email}</span>
                              </div>
                              <Badge variant="outline" className={`ml-auto text-[9px] uppercase px-1.5 py-0.2 border-slate-800 bg-slate-950 text-slate-400`}>
                                {usr.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: ROLES & RBAC */}
        <TabsContent value="roles" className="mt-6">
          <Card className="bg-slate-950/40 border-slate-900 shadow-2xl backdrop-blur-md">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  {locale === 'vi' ? "Danh sách Vai trò Hệ thống" : "Granular Roles Registry"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'vi' ? "Cấu hình vai trò bảo trì và điều phối ma trận quyền bảo mật" : "Define user access categories and authorize precise permission configurations"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-900 hover:bg-transparent">
                    <TableHead>{locale === 'vi' ? "ID Vai trò" : "Role ID"}</TableHead>
                    <TableHead>{locale === 'vi' ? "Tên Vai trò" : "Role Name"}</TableHead>
                    <TableHead>{locale === 'vi' ? "Quyền hạn được Gán" : "Permissions Assigned"}</TableHead>
                    <TableHead>{locale === 'vi' ? "Thành viên sử dụng" : "Active Users"}</TableHead>
                    <TableHead>{locale === 'vi' ? "Mô tả kỹ thuật" : "Technical Description"}</TableHead>
                    <TableHead className="text-right">{locale === 'vi' ? "Hành động" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesData.map(role => (
                    <TableRow key={role.id} className="border-slate-900 hover:bg-slate-950/20">
                      <TableCell className="font-mono text-xs text-primary">{role.id}</TableCell>
                      <TableCell className="font-semibold text-slate-300">{role.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded">
                          {role.permissions?.length || 0} {locale === 'vi' ? 'quyền' : 'permissions'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-400">
                        {usersData.filter(u => u.role === role.id).length}
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs max-w-xs truncate">{role.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end items-center">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEditRoleDialog(role)}>
                            <Edit className="h-4 w-4 text-slate-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleOpenPermissionsDialog(role)}
                            className="h-8 text-xs border-slate-800 text-slate-300 hover:bg-slate-900"
                          >
                            <CheckSquare className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                            {locale === 'vi' ? "Cấp quyền" : "Permissions"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: BUSINESS CATEGORIES */}
        <TabsContent value="categories" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Category Side Switcher */}
            <Card className="lg:col-span-3 bg-slate-950/40 border-slate-900 backdrop-blur-md">
              <CardHeader className="p-4 border-b border-slate-900">
                <CardTitle className="text-sm font-bold text-slate-400">{locale === 'vi' ? "Danh mục Nghiệp vụ" : "Category Sub-lists"}</CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex flex-col gap-1">
                <button
                  onClick={() => setCategorySubTab("locations")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-200 ${categorySubTab === 'locations' ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'text-slate-400 hover:bg-slate-900/60'}`}
                >
                  <MapPin className="h-4 w-4" />
                  {locale === 'vi' ? "Ga & Vị trí" : "Stations & Locations"}
                </button>
                <button
                  onClick={() => setCategorySubTab("responsible-units")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-200 ${categorySubTab === 'responsible-units' ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'text-slate-400 hover:bg-slate-900/60'}`}
                >
                  <Building2 className="h-4 w-4" />
                  {locale === 'vi' ? "Đơn vị Chuyên trách" : "Responsible Units"}
                </button>
                <button
                  onClick={() => setCategorySubTab("subsystems")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-200 ${categorySubTab === 'subsystems' ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'text-slate-400 hover:bg-slate-900/60'}`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {locale === 'vi' ? "Phân hệ Kỹ thuật" : "Technical Subsystems"}
                </button>
              </CardContent>
            </Card>

            {/* Category Listing Grid */}
            <Card className="lg:col-span-9 bg-slate-950/40 border-slate-900 backdrop-blur-md h-[55vh] flex flex-col">
              <CardContent className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                
                {/* 1. Locations Table */}
                {categorySubTab === "locations" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-slate-300 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-amber-400" />
                      {locale === 'vi' ? "Quản lý Vị trí Ga hành khách" : "Patrol Locations & Stations"}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-900 hover:bg-transparent">
                          <TableHead>ID</TableHead>
                          <TableHead>{locale === 'vi' ? "Tên hiển thị (AD ou-loc)" : "Station Label"}</TableHead>
                          <TableHead className="text-right">{locale === 'vi' ? "Hành động" : "Actions"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {locations.map(item => (
                          <TableRow key={item.id} className="border-slate-900 hover:bg-slate-950/10">
                            <TableCell className="font-mono text-xs text-primary">{item.id}</TableCell>
                            <TableCell className="font-medium text-slate-300">{item.label}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenCatDialog('location', 'edit', item)}>
                                  <Edit className="h-4 w-4 text-slate-400" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory('location', item.id)} className="text-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* 2. Responsible Units Table */}
                {categorySubTab === "responsible-units" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-slate-300 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-emerald-400" />
                      {locale === 'vi' ? "Quản lý Đơn vị/Phân xưởng Chuyên trách" : "Responsible Teams & Departments"}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-900 hover:bg-transparent">
                          <TableHead>ID</TableHead>
                          <TableHead>{locale === 'vi' ? "Tên Đội nhóm" : "Department Name"}</TableHead>
                          <TableHead className="text-right">{locale === 'vi' ? "Hành động" : "Actions"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {responsibleUnits.map(item => (
                          <TableRow key={item.id} className="border-slate-900 hover:bg-slate-950/10">
                            <TableCell className="font-mono text-xs text-primary">{item.id}</TableCell>
                            <TableCell className="font-medium text-slate-300">{item.name}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenCatDialog('unit', 'edit', item)}>
                                  <Edit className="h-4 w-4 text-slate-400" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory('unit', item.id)} className="text-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* 3. Subsystems Table */}
                {categorySubTab === "subsystems" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-slate-300 flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-purple-400" />
                      {locale === 'vi' ? "Quản lý Phân hệ/Hệ thống kỹ thuật" : "Engineering Subsystems"}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-900 hover:bg-transparent">
                          <TableHead>ID</TableHead>
                          <TableHead>{locale === 'vi' ? "Tiếng Việt" : "Vietnamese Name"}</TableHead>
                          <TableHead>{locale === 'vi' ? "Tiếng Anh" : "English Name"}</TableHead>
                          <TableHead className="text-right">{locale === 'vi' ? "Hành động" : "Actions"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subsystems.map(item => (
                          <TableRow key={item.id} className="border-slate-900 hover:bg-slate-950/10">
                            <TableCell className="font-mono text-xs text-primary">{item.id}</TableCell>
                            <TableCell className="font-medium text-slate-300">{item.label.vi}</TableCell>
                            <TableCell className="font-medium text-slate-400">{item.label.en}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenCatDialog('subsystem', 'edit', item)}>
                                  <Edit className="h-4 w-4 text-slate-400" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory('subsystem', item.id)} className="text-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ==========================================
          DIALOG 1: AD NODE DIALOG (Forest, Tree, Domain, OU)
          ========================================== */}
      <Dialog open={isADDialogOpen} onOpenChange={setIsADDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-950 border border-slate-900 text-slate-100 shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-primary" />
              {adDialogMode === 'create' 
                ? (locale === 'vi' ? "Khởi tạo đối tượng Active Directory" : "Create AD Object")
                : (locale === 'vi' ? "Chỉnh sửa đối tượng Active Directory" : "Edit AD Object")}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              {locale === 'vi' 
                ? "Thiết lập cấu trúc thư mục phân quyền bảo mật cho người dùng."
                : "Configure security organizational path mapping details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-sm">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="node_type" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Phân cấp đối tượng (Type)" : "AD Object Type"}</Label>
              <select
                id="node_type"
                value={adDialogNodeType}
                disabled={adDialogMode === 'edit'}
                onChange={(e) => setAdDialogNodeType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm disabled:opacity-50"
              >
                <option value="forest">{locale === 'vi' ? "Forest (Rừng hệ thống)" : "Forest Root"}</option>
                <option value="tree">{locale === 'vi' ? "Tree (Cây thư mục)" : "Tree Root"}</option>
                <option value="domain">{locale === 'vi' ? "Child Domain (Miền con)" : "Child Domain"}</option>
                <option value="ou">{locale === 'vi' ? "Organizational Unit (OU)" : "Organizational Unit (OU)"}</option>
              </select>
            </div>

            {adDialogNodeType === 'tree' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tree_forestId" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Rừng trực thuộc" : "Target Forest"}</Label>
                <select
                  id="tree_forestId"
                  value={adDialogTarget.forestId || ""}
                  onChange={(e) => setAdDialogTarget(prev => ({ ...prev, forestId: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm"
                >
                  <option value="">{locale === 'vi' ? "-- Chọn Rừng hệ thống --" : "-- Select Forest --"}</option>
                  {treeData.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            )}

            {adDialogNodeType === 'domain' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="domain_treeId" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Cây thư mục trực thuộc" : "Target Tree"}</Label>
                <select
                  id="domain_treeId"
                  value={adDialogTarget.treeId || ""}
                  onChange={(e) => setAdDialogTarget(prev => ({ ...prev, treeId: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm"
                >
                  <option value="">{locale === 'vi' ? "-- Chọn Cây thư mục --" : "-- Select Tree --"}</option>
                  {treeData.flatMap(f => f.children || []).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            {adDialogNodeType === 'ou' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ou_domainId" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Miền con (Domain) trực thuộc" : "Target Child Domain"}</Label>
                  <select
                    id="ou_domainId"
                    value={adDialogTarget.domainId || ""}
                    onChange={(e) => setAdDialogTarget(prev => ({ ...prev, domainId: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm"
                  >
                    <option value="">{locale === 'vi' ? "-- Chọn Miền con --" : "-- Select Child Domain --"}</option>
                    {treeData.flatMap(f => f.children || []).flatMap(t => t.children || []).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ou_parentId" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Đơn vị OU Cha (Tùy chọn)" : "Parent OU (Optional)"}</Label>
                  <select
                    id="ou_parentId"
                    value={adDialogTarget.parentId || ""}
                    onChange={(e) => setAdDialogTarget(prev => ({ ...prev, parentId: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm"
                  >
                    <option value="">{locale === 'vi' ? "-- Tên miền gốc (Root OU) --" : "-- None (Root OU) --"}</option>
                    {ouList.filter(o => o.id !== adDialogTarget.id).map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="node_id_disp" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Định danh ID" : "AD Unique ID"}</Label>
              <Input
                id="node_id_disp"
                value={adDialogTarget.id || ""}
                disabled={adDialogMode === 'edit'}
                placeholder="Ví dụ: ou-phong-ktat"
                onChange={(e) => setAdDialogTarget(prev => ({ ...prev, id: e.target.value }))}
                className="bg-slate-950 border-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="node_name" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Tên đối tượng" : "Object Label"}</Label>
              <Input
                id="node_name"
                value={adDialogTarget.name}
                placeholder="Ví dụ: Phòng Kỹ thuật"
                onChange={(e) => setAdDialogTarget(prev => ({ ...prev, name: e.target.value }))}
                className="bg-slate-950 border-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="node_desc" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Mô tả nghiệp vụ" : "Description"}</Label>
              <Textarea
                id="node_desc"
                value={adDialogTarget.description}
                onChange={(e) => setAdDialogTarget(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-950 border-slate-800 text-xs min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsADDialogOpen(false)}>
              {locale === 'vi' ? "Hủy" : "Cancel"}
            </Button>
            <Button type="button" onClick={handleSubmitADNode}>
              {locale === 'vi' ? "Lưu lại" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==========================================
          DIALOG 2: ROLE CREATION/EDIT DIALOG
          ========================================== */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="bg-slate-950 border border-slate-900 text-slate-100 shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {editingRole ? (locale === 'vi' ? "Chỉnh sửa Vai trò" : "Edit Graded Role") : (locale === 'vi' ? "Thêm Vai trò mới" : "Create New Graded Role")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmitRole} className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="r_id" className="text-xs text-slate-400">{locale === 'vi' ? "ID Vai trò" : "Role Unique ID"}</Label>
              <Input 
                id="r_id" 
                value={roleFormId} 
                disabled={!!editingRole} 
                onChange={(e) => setRoleFormId(e.target.value)} 
                className="bg-slate-950 border-slate-800"
                placeholder="Ví dụ: ROLE_L2_ELECTRICIAN"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="r_name" className="text-xs text-slate-400">{locale === 'vi' ? "Tên Vai trò" : "Role Name"}</Label>
              <Input 
                id="r_name" 
                value={roleFormName} 
                onChange={(e) => setRoleFormName(e.target.value)} 
                className="bg-slate-950 border-slate-800"
                placeholder="Ví dụ: Kỹ thuật viên Điện L2"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="r_desc" className="text-xs text-slate-400">{locale === 'vi' ? "Mô tả kỹ thuật" : "Role Description"}</Label>
              <Textarea 
                id="r_desc" 
                value={roleFormDescription} 
                onChange={(e) => setRoleFormDescription(e.target.value)} 
                className="bg-slate-950 border-slate-800 min-h-[90px]"
                placeholder="Nghiệm vụ sửa chữa, bảo trì kỹ thuật..."
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>{locale === 'vi' ? "Hủy" : "Cancel"}</Button>
              <Button type="submit">{locale === 'vi' ? "Lưu lại" : "Save role"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==========================================
          DIALOG 3: DYNAMIC PERMISSIONS MATRIX CONFIG DIALOG
          ========================================== */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-slate-950 border border-slate-900 text-slate-100 shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-emerald-400" />
              {selectedRoleForPermissions ? (locale === 'vi' ? `Cấp quyền cho: ${selectedRoleForPermissions.name}` : `Access Control Grid: ${selectedRoleForPermissions.name}`) : ""}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              {locale === 'vi' ? "Đánh dấu chọn các quyền hệ thống tương thích với ma trận bảo trì" : "Select corresponding permissions for this graded maintenance role"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[55vh] p-1 pr-3">
            <div className="space-y-6 py-2">
              {Object.entries(groupedSystemPermissions).map(([groupName, permissionsInGroup]) => (
                <div key={groupName} className="p-4 rounded-lg bg-slate-950/60 border border-slate-900">
                  <h3 className="text-sm font-bold mb-3 border-b border-slate-900 pb-1 text-slate-300">{groupName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {permissionsInGroup.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-2.5 py-1">
                        <Checkbox
                          id={`perm-${permission.id}`}
                          checked={currentPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                        />
                        <Label htmlFor={`perm-${permission.id}`} className="text-xs text-slate-300 font-normal cursor-pointer select-none">
                          {permission.label[locale]} <span className="text-[10px] text-muted-foreground font-mono">({permission.id})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter className="border-t border-slate-900 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>{locale === 'vi' ? "Hủy" : "Cancel"}</Button>
            <Button type="button" onClick={handleSavePermissions}>{locale === 'vi' ? "Lưu Quyền" : "Save permissions"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==========================================
          DIALOG 4: CATEGORY CRUD DIALOG
          ========================================== */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="bg-slate-950 border border-slate-900 text-slate-100 shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              {categoryMode === 'create' ? (locale === 'vi' ? "Thêm mới Danh mục" : "Add Category Item") : (locale === 'vi' ? "Chỉnh sửa Danh mục" : "Edit Category Item")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat_id" className="text-xs text-slate-400">ID / Mã định danh</Label>
              <Input
                id="cat_id"
                value={catFieldId}
                disabled={categoryMode === 'edit'}
                placeholder="Ví dụ: ga_ben_thanh hoặc sub_power"
                onChange={(e) => setCatFieldId(e.target.value)}
                className="bg-slate-950 border-slate-800 font-mono text-xs text-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat_lbl" className="text-xs text-slate-400">
                {categoryType === 'subsystem' ? (locale === 'vi' ? "Tên tiếng Việt" : "Vietnamese Name") : (locale === 'vi' ? "Tên hiển thị" : "Display Name")}
              </Label>
              <Input
                id="cat_lbl"
                value={catFieldLabel}
                placeholder="Ví dụ: Ga Bến Thành"
                onChange={(e) => setCatFieldLabel(e.target.value)}
                className="bg-slate-950 border-slate-800"
              />
            </div>

            {categoryType === 'subsystem' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cat_lbl_en" className="text-xs text-slate-400">
                  {locale === 'vi' ? "Tên tiếng Anh" : "English Name"}
                </Label>
                <Input
                  id="cat_lbl_en"
                  value={catFieldLabelEn}
                  placeholder="Ví dụ: Ben Thanh Station"
                  onChange={(e) => setCatFieldLabelEn(e.target.value)}
                  className="bg-slate-950 border-slate-800"
                />
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>{locale === 'vi' ? "Hủy" : "Cancel"}</Button>
            <Button type="button" onClick={handleSaveCategory}>{locale === 'vi' ? "Lưu lại" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
