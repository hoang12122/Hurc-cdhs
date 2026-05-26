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
import { undoLastChange } from "@/lib/actions/system.actions";
import { 
  Network, 
  FolderGit2, 
  Globe2, 
  FolderTree, 
  User as UserIcon, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  ShieldAlert, 
  UserCheck, 
  Layers,
  Settings,
  Undo2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROLE_SUPER_ADMIN } from "@/lib/constants";
import Link from "next/link";

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

export default function OrganizationPage() {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const currentUserRole = currentUser?.role;

  // State
  const [treeData, setTreeData] = React.useState<TreeNode[]>([]);
  const [ouList, setOuList] = React.useState<any[]>([]);
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = React.useState<TreeNode | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Dialog State for CRUD
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');
  const [dialogNodeType, setDialogNodeType] = React.useState<'forest' | 'tree' | 'domain' | 'ou'>('ou');
  const [dialogTarget, setDialogTarget] = React.useState<{
    id?: string;
    name: string;
    description: string;
    forestId?: string;
    treeId?: string;
    domainId?: string;
    parentId?: string;
  }>({ name: "", description: "" });

  const isSuperAdmin = currentUserRole === ROLE_SUPER_ADMIN;

  // Load Data
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [tree, ous] = await Promise.all([
        getOrganizationTree(),
        getOUList()
      ]);
      
      if (tree && typeof tree === 'object' && 'error' in tree) {
        toast({
          variant: "destructive",
          title: locale === 'vi' ? "Lỗi máy chủ" : "Server Error",
          description: (tree as any).error
        });
        setTreeData([]);
      } else {
        setTreeData((tree || []) as TreeNode[]);
      }
      
      setOuList(ous);
      
      // Auto expand first few nodes if empty expanded list
      const actualTree = (tree && typeof tree === 'object' && 'error' in tree) ? [] : (tree || []) as TreeNode[];
      if (Object.keys(expandedNodes).length === 0 && actualTree.length > 0) {
        const autoExpand: Record<string, boolean> = {};
        const expandFirst = (node: TreeNode, depth = 0) => {
          if (depth < 3) {
            autoExpand[node.id] = true;
            if (node.children) {
              node.children.forEach(c => expandFirst(c, depth + 1));
            }
          }
        };
        actualTree.forEach(f => expandFirst(f as TreeNode));
        setExpandedNodes(autoExpand);
      }
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
    loadData();
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
      await loadData();
    } else {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi" : "Error",
        description: res.message || res.error
      });
    }
    setLoading(false);
  };

  // Collect all users under a node recursively
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

  // Open Dialog for Generic Creation/Editing
  const openNodeDialog = (mode: 'create' | 'edit', type: 'forest' | 'tree' | 'domain' | 'ou' = 'ou', node?: TreeNode) => {
    setDialogMode(mode);
    setDialogNodeType(type);
    
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

      setDialogTarget({
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

      setDialogTarget({
        id: node.id,
        name: node.name,
        description: node.description || "",
        forestId: defaultForestId,
        treeId: defaultTreeId,
        domainId: defaultDomainId,
        parentId: defaultParentId
      });
    }
    setIsDialogOpen(true);
  };

  // Submit Node CRUD
  const handleSubmitNode = async () => {
    if (!dialogTarget.name.trim()) {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi nhập liệu" : "Input Error",
        description: locale === 'vi' ? "Vui lòng nhập tên đối tượng." : "Please enter a name."
      });
      return;
    }

    setLoading(true);
    let res: { success: boolean; error?: string } = { success: false, error: "Loại đối tượng không xác định" };

    if (dialogNodeType === 'forest') {
      res = await upsertForest({
        id: dialogTarget.id,
        name: dialogTarget.name,
        description: dialogTarget.description
      });
    } else if (dialogNodeType === 'tree') {
      if (!dialogTarget.forestId) {
        toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng chọn Rừng trực thuộc." });
        setLoading(false);
        return;
      }
      res = await upsertTree({
        id: dialogTarget.id,
        name: dialogTarget.name,
        description: dialogTarget.description,
        forestId: dialogTarget.forestId
      });
    } else if (dialogNodeType === 'domain') {
      if (!dialogTarget.treeId) {
        toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng chọn Cây trực thuộc." });
        setLoading(false);
        return;
      }
      res = await upsertDomain({
        id: dialogTarget.id,
        name: dialogTarget.name,
        description: dialogTarget.description,
        treeId: dialogTarget.treeId
      });
    } else if (dialogNodeType === 'ou') {
      if (!dialogTarget.domainId) {
        toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng chọn Miền con trực thuộc." });
        setLoading(false);
        return;
      }
      res = await upsertOrganizationalUnit({
        id: dialogTarget.id,
        name: dialogTarget.name,
        description: dialogTarget.description,
        domainId: dialogTarget.domainId,
        parentId: dialogTarget.parentId || undefined
      });
    }

    if (res.success) {
      toast({
        title: locale === 'vi' ? "Thành công" : "Success",
        description: locale === 'vi' ? "Đã lưu đối tượng thành công!" : "Saved AD object successfully."
      });
      setIsDialogOpen(false);
      await loadData();
      if (selectedNode && selectedNode.id === dialogTarget.id) {
        setSelectedNode(prev => prev ? { ...prev, name: dialogTarget.name, description: dialogTarget.description } : null);
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

  // Delete Node
  const handleDeleteNode = async (type: TreeNode['type'], id: string) => {
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
      await loadData();
    } else {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi" : "Error",
        description: res.error
      });
    }
    setLoading(false);
  };

  // Rollback Action
  const handleUndo = async () => {
    setLoading(true);
    try {
      const res = await undoLastChange('ActiveDirectory');
      if (res && res.success) {
        toast({
          title: locale === 'vi' ? "Đã hoàn tác thành công" : "Undo completed successfully",
          description: locale === 'vi' ? "Cơ cấu tổ chức đã được hoàn tác về phiên bản trước." : "Reversed to the previous organizational version."
        });
        await loadData();
      } else {
        toast({
          title: locale === 'vi' ? "Không có gì để hoàn tác" : "Nothing to undo"
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

  // Node Color / Icon Helpers
  const getNodeColor = (type: TreeNode['type'], isSelected: boolean) => {
    if (isSelected) return "border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-primary";
    
    switch (type) {
      case 'forest': return "border-blue-500/30 hover:border-blue-400 text-blue-400 bg-blue-950/20";
      case 'tree': return "border-emerald-500/30 hover:border-emerald-400 text-emerald-400 bg-emerald-950/20";
      case 'domain': return "border-violet-500/30 hover:border-violet-400 text-violet-400 bg-violet-950/20";
      case 'ou': return "border-amber-500/30 hover:border-amber-400 text-amber-400 bg-amber-950/20";
      case 'user': return "border-slate-700/30 hover:border-slate-500 text-slate-300 bg-slate-900/20";
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

  // Render Tree recursively
  const renderTreeNodes = (nodes: TreeNode[]) => {
    return nodes.map(node => {
      const isExpanded = !!expandedNodes[node.id];
      const hasChildren = node.children && node.children.length > 0;
      const isSelected = selectedNode?.id === node.id;
      
      return (
        <div key={node.id} className="flex flex-col ml-4">
          <div 
            onClick={() => handleSelectNode(node)}
            className={`flex items-center gap-2 p-2 my-1 rounded-lg border backdrop-blur-sm cursor-pointer transition-all duration-300 ${getNodeColor(node.type, isSelected)}`}
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

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh]">
        <Card className="w-full max-w-md p-8 text-center glass-card border-red-500/20">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4 animate-bounce" />
          <CardTitle className="text-2xl text-destructive mb-4">
            {locale === 'vi' ? "Từ chối truy cập" : "Access Denied"}
          </CardTitle>
          <CardDescription>
            {locale === 'vi' 
              ? "Chỉ Quản trị viên cấp cao mới có quyền truy cập trang quản trị cơ cấu tổ chức Active Directory." 
              : "Only Super Administrators can access the Active Directory structure administration panel."}
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

  // Right Inspector details
  const inspectorUsers = selectedNode ? getAllUsersUnderNode(selectedNode) : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Title Hub */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Layers className="h-8 w-8 text-primary" />
            {locale === 'vi' ? "Quản lý Vai trò & Cơ cấu AD" : "AD Roles & Hierarchy"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {locale === 'vi'
              ? "Thiết lập phân quyền và cơ cấu tổ chức sâu chuẩn Active Directory (Forest -> Tree -> Domain -> OU -> User)."
              : "Set up authorization and deep organizational tree mapping matching Active Directory standard."}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {treeData.length === 0 && (
            <Button variant="outline" onClick={handleSeed} className="border-amber-500/30 text-amber-400 hover:bg-amber-950/20 gap-1 animate-pulse">
              <RefreshCw className="h-4 w-4" />
              {locale === 'vi' ? "Khởi tạo Dữ liệu Mẫu" : "Seed Sample Data"}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUndo} 
            disabled={loading}
            className="gap-1 backdrop-blur-sm border-amber-500/30 text-amber-400 hover:bg-amber-950/20"
          >
            <Undo2 className="h-4 w-4" />
            {locale === 'vi' ? "Hoàn tác (Rollback)" : "Rollback"}
          </Button>
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="gap-1 backdrop-blur-sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {locale === 'vi' ? "Làm mới" : "Reload"}
          </Button>
          {isSuperAdmin && (
            <Button 
              onClick={() => openNodeDialog('create', 'ou')} 
              className="bg-primary hover:bg-primary/95 text-white gap-1 shadow-glow"
            >
              <Plus className="h-4 w-4" />
              {locale === 'vi' ? "Thêm đối tượng AD" : "Add AD Object"}
            </Button>
          )}
        </div>
      </div>

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Tree Explorer */}
        <Card className="lg:col-span-5 bg-slate-950/40 border-slate-900 backdrop-blur-md shadow-2xl h-[70vh] flex flex-col">
          <CardHeader className="py-4 border-b border-slate-900">
            <CardTitle className="text-base font-semibold flex items-center gap-1.5 text-slate-300">
              <FolderTree className="h-4 w-4 text-primary" />
              {locale === 'vi' ? "Cấu trúc Thư mục AD" : "AD Directory Tree"}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'vi' ? "Khám phá cây thư mục đệ quy của hệ thống" : "Explore recursive active directory structure"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {loading && treeData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="text-xs">{locale === 'vi' ? "Đang tải dữ liệu AD..." : "Loading AD Directory..."}</span>
              </div>
            ) : treeData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
                <ShieldAlert className="h-10 w-10 text-amber-500 mb-2" />
                <span className="text-sm font-semibold">{locale === 'vi' ? "Chưa có dữ liệu Active Directory" : "No Active Directory Data"}</span>
                <span className="text-xs mt-1 text-slate-500">
                  {locale === 'vi' ? "Hãy nhấn nút 'Khởi tạo Dữ liệu Mẫu' phía trên để bắt đầu." : "Click 'Seed Sample Data' button above to start."}
                </span>
                <Button onClick={handleSeed} className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium">
                  {locale === 'vi' ? "Tạo ngay" : "Create Now"}
                </Button>
              </div>
            ) : (
              <div className="-ml-4">
                {renderTreeNodes(treeData)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Inspector Panel */}
        <Card className="lg:col-span-7 bg-slate-950/40 border-slate-900 backdrop-blur-md shadow-2xl h-[70vh] flex flex-col">
          <CardHeader className="py-4 border-b border-slate-900">
            <CardTitle className="text-base font-semibold flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-slate-400" />
                {locale === 'vi' ? "Chi tiết Phân lớp & Quyền" : "Node Details & Inspector"}
              </span>
              {selectedNode && (
                <Badge variant="outline" className="text-[10px] uppercase font-bold border-slate-700 bg-slate-950/80 px-2 py-0.5">
                  {getLabelByType(selectedNode.type)}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'vi' ? "Bấm vào bất kỳ nút nào trên cây AD để xem thông tin" : "Click on any node in the tree to inspect"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
            {!selectedNode ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                <Network className="h-12 w-12 stroke-[1.5] text-slate-700" />
                <span className="text-sm font-sans">{locale === 'vi' ? "Chọn một đối tượng để kiểm tra chi tiết" : "Select an object to inspect"}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Node Summary Row */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 shadow-inner backdrop-blur-sm">
                  <div className="flex flex-col gap-1 col-span-8 overflow-hidden">
                    <h2 className="text-xl font-bold font-sans text-slate-200 truncate">{selectedNode.name}</h2>
                    <span className="text-xs text-slate-400 font-mono select-all truncate">ID: {selectedNode.id}</span>
                    {selectedNode.description && (
                      <p className="text-sm text-slate-400 mt-2 italic">“{selectedNode.description}”</p>
                    )}
                  </div>
                  
                  {['forest', 'tree', 'domain', 'ou'].includes(selectedNode.type) && isSuperAdmin && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openNodeDialog('edit', selectedNode.type as any, selectedNode)}
                        className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800/80 text-xs px-2.5"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1 text-primary" />
                        {locale === 'vi' ? "Sửa" : "Edit"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteNode(selectedNode.type, selectedNode.id)}
                        className="h-8 shadow-glow-destructive bg-destructive hover:bg-destructive/90 text-xs px-2.5"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        {locale === 'vi' ? "Xóa" : "Delete"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Node Metadata & Subsystems list */}
                {selectedNode.type === 'user' && (
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/10 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 font-medium">{locale === 'vi' ? "Địa chỉ Email" : "Email Address"}</span>
                      <span className="text-slate-200 font-mono select-all">{selectedNode.email}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 font-medium">{locale === 'vi' ? "Vai trò hệ thống" : "System Role"}</span>
                      <span className="text-slate-200">{selectedNode.role}</span>
                    </div>
                  </div>
                )}

                {/* Dynamic Users under Node */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                    <UserCheck className="h-4 w-4 text-emerald-400" />
                    {locale === 'vi' 
                      ? `Thành viên & Nhân viên trực thuộc (${inspectorUsers.length})` 
                      : `Resident & Descendant Members (${inspectorUsers.length})`}
                  </h3>
                  
                  {inspectorUsers.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                      {locale === 'vi' ? "Không tìm thấy người dùng trực thuộc đơn vị này." : "No users reside in this node hierarchy."}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[30vh] overflow-y-auto custom-scrollbar pr-1">
                      {inspectorUsers.map(usr => (
                        <div 
                          key={usr.id} 
                          className="flex items-center gap-3 p-3 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:bg-slate-900/40 transition-colors"
                        >
                          <div className="h-8 w-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 font-bold border border-slate-700/50 shadow-inner">
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

      {/* Dialog for Node CRUD */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-950 border border-slate-900 text-slate-100 shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-primary" />
              {dialogMode === 'create' 
                ? (locale === 'vi' ? "Khởi tạo đối tượng Active Directory" : "Create AD Object")
                : (locale === 'vi' ? "Chỉnh sửa đối tượng Active Directory" : "Edit AD Object")}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              {locale === 'vi' 
                ? "Thiết lập các thông số cơ cấu thư mục phân quyền bảo mật cho người dùng."
                : "Configure security organizational path mapping details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-sm">
            {/* Object Type Selector (Only on create) */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="node_type" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Phân cấp đối tượng (Type)" : "AD Object Type"}</Label>
              <select
                id="node_type"
                value={dialogNodeType}
                disabled={dialogMode === 'edit'}
                onChange={(e) => setDialogNodeType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm disabled:opacity-50"
              >
                <option value="forest">{locale === 'vi' ? "Forest (Rừng hệ thống)" : "Forest Root"}</option>
                <option value="tree">{locale === 'vi' ? "Tree (Cây thư mục)" : "Tree Root"}</option>
                <option value="domain">{locale === 'vi' ? "Child Domain (Miền con)" : "Child Domain"}</option>
                <option value="ou">{locale === 'vi' ? "Organizational Unit (OU)" : "Organizational Unit (OU)"}</option>
              </select>
            </div>

            {/* Parent Forest Selector (Only for trees) */}
            {dialogNodeType === 'tree' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tree_forestId" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Rừng trực thuộc" : "Target Forest"}</Label>
                <select
                  id="tree_forestId"
                  value={dialogTarget.forestId || ""}
                  onChange={(e) => setDialogTarget(prev => ({ ...prev, forestId: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm"
                >
                  <option value="">{locale === 'vi' ? "-- Chọn Rừng hệ thống --" : "-- Select Forest --"}</option>
                  {treeData.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Parent Tree Selector (Only for domains) */}
            {dialogNodeType === 'domain' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="domain_treeId" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Cây thư mục trực thuộc" : "Target Tree"}</Label>
                <select
                  id="domain_treeId"
                  value={dialogTarget.treeId || ""}
                  onChange={(e) => setDialogTarget(prev => ({ ...prev, treeId: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm"
                >
                  <option value="">{locale === 'vi' ? "-- Chọn Cây gốc --" : "-- Select Tree --"}</option>
                  {treeData.flatMap(f => f.children || []).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Parent Domain Selector (Only for OUs) */}
            {dialogNodeType === 'ou' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ou_domainId" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Miền con trực thuộc" : "Target Child Domain"}</Label>
                  <select
                    id="ou_domainId"
                    value={dialogTarget.domainId || ""}
                    onChange={(e) => setDialogTarget(prev => ({ ...prev, domainId: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm"
                  >
                    <option value="">{locale === 'vi' ? "-- Chọn Miền con --" : "-- Select Domain --"}</option>
                    {treeData.flatMap(f => f.children || []).flatMap(t => t.children || []).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ou_parentId" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Đơn vị tổ chức cha (Nếu có)" : "Parent OU (Recursive)"}</Label>
                  <select
                    id="ou_parentId"
                    value={dialogTarget.parentId || ""}
                    onChange={(e) => setDialogTarget(prev => ({ ...prev, parentId: e.target.value || undefined }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm"
                  >
                    <option value="">{locale === 'vi' ? "[OU gốc - Root Level OU]" : "[Root Level OU]"}</option>
                    {ouList.filter(o => o.id !== dialogTarget.id).map(o => (
                      <option key={o.id} value={o.id}>
                        {o.pathName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="node_name" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Tên đối tượng" : "Object Name"}</Label>
              <Input
                id="node_name"
                value={dialogTarget.name}
                onChange={(e) => setDialogTarget(prev => ({ ...prev, name: e.target.value }))}
                placeholder={locale === 'vi' ? "Nhập tên..." : "Enter name..."}
                className="border-slate-800 bg-slate-950/80 focus:border-primary"
              />
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="node_description" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Mô tả / Ghi chú" : "Description"}</Label>
              <Input
                id="node_description"
                value={dialogTarget.description}
                onChange={(e) => setDialogTarget(prev => ({ ...prev, description: e.target.value }))}
                placeholder={locale === 'vi' ? "Mô tả vai trò hoặc chức năng..." : "Details on usage..."}
                className="border-slate-800 bg-slate-950/80 focus:border-primary"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 md:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-850 bg-slate-950 text-slate-300 hover:bg-slate-800"
            >
              {locale === 'vi' ? "Hủy bỏ" : "Cancel"}
            </Button>
            <Button 
              onClick={handleSubmitNode}
              className="bg-primary hover:bg-primary/95 text-white shadow-glow"
            >
              {locale === 'vi' ? "Lưu lại" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
