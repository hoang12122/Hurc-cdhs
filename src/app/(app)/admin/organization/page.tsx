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
  seedOrganization 
} from "@/lib/actions/organization.actions";
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
  Settings
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

  // Dialog State for OU CRUD
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');
  const [dialogTarget, setDialogTarget] = React.useState<{
    id?: string;
    name: string;
    description: string;
    domainId: string;
    parentId?: string;
  }>({ name: "", description: "", domainId: "", parentId: "" });

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

  // Open Dialog for OU Creation/Editing
  const openOuDialog = (mode: 'create' | 'edit', node?: TreeNode) => {
    if (mode === 'create') {
      // Set default values. Try to auto-resolve Domain Id if we selected a Domain or an OU in the tree
      let domainId = "";
      let parentId = "";
      
      if (selectedNode) {
        if (selectedNode.type === 'domain') {
          domainId = selectedNode.id;
        } else if (selectedNode.type === 'ou') {
          parentId = selectedNode.id;
          // Traverse up to find domainId of this OU
          const findDomainId = (nodes: TreeNode[], targetOuId: string): string | null => {
            for (const f of nodes) {
              if (f.children) {
                for (const t of f.children) {
                  if (t.children) {
                    for (const d of t.children) {
                      // Look into this domain's OUs recursively
                      const checkOus = (ouNodes: TreeNode[]): boolean => {
                        return ouNodes.some(o => o.id === targetOuId || (o.children && checkOus(o.children)));
                      };
                      if (d.children && checkOus(d.children)) {
                        return d.id;
                      }
                    }
                  }
                }
              }
            }
            return null;
          };
          domainId = findDomainId(treeData, selectedNode.id) || "";
        }
      }

      // If still empty, grab the first child domain in our tree
      if (!domainId && treeData.length > 0 && treeData[0].children?.[0]?.children?.[0]) {
        domainId = treeData[0].children[0].children[0].id;
      }

      setDialogTarget({ name: "", description: "", domainId, parentId });
      setDialogMode('create');
    } else if (mode === 'edit' && node) {
      // Find its domainId and parentId
      let domainId = "";
      let parentId = "";
      
      const ouInfo = ouList.find(o => o.id === node.id);
      if (ouInfo) {
        domainId = ouInfo.domainId || "";
        parentId = ouInfo.parentId || "";
      }

      setDialogTarget({
        id: node.id,
        name: node.name,
        description: node.description || "",
        domainId,
        parentId
      });
      setDialogMode('edit');
    }
    setIsDialogOpen(true);
  };

  // Submit OU CRUD
  const handleSubmitOu = async () => {
    if (!dialogTarget.name.trim()) {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi nhập liệu" : "Input Error",
        description: locale === 'vi' ? "Vui lòng nhập tên Đơn vị tổ chức." : "Please enter the OU name."
      });
      return;
    }
    if (!dialogTarget.domainId) {
      toast({
        variant: "destructive",
        title: locale === 'vi' ? "Lỗi nhập liệu" : "Input Error",
        description: locale === 'vi' ? "Không xác định được Miền con." : "Domain ID is missing."
      });
      return;
    }

    setLoading(true);
    const res = await upsertOrganizationalUnit(dialogTarget);
    if (res.success) {
      toast({
        title: locale === 'vi' ? "Thành công" : "Success",
        description: dialogMode === 'create' 
          ? (locale === 'vi' ? "Đã tạo Đơn vị tổ chức thành công." : "Created OU successfully.")
          : (locale === 'vi' ? "Đã cập nhật Đơn vị tổ chức thành công." : "Updated OU successfully.")
      });
      setIsDialogOpen(false);
      await loadData();
      // Keep selected node updated
      if (dialogMode === 'edit' && selectedNode?.id === dialogTarget.id) {
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

  // Delete OU
  const handleDeleteOu = async (id: string) => {
    if (!confirm(locale === 'vi' ? "Bạn có chắc chắn muốn xóa Đơn vị tổ chức này và tất cả các OU con của nó không? Người dùng trong các OU này sẽ bị gỡ bỏ đơn vị." : "Are you sure you want to delete this OU and all of its sub-OUs? Users inside will be detached.")) {
      return;
    }
    setLoading(true);
    const res = await deleteOrganizationalUnit(id);
    if (res.success) {
      toast({
        title: locale === 'vi' ? "Thành công" : "Success",
        description: locale === 'vi' ? "Đã xóa Đơn vị tổ chức." : "Deleted OU successfully."
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
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="gap-1 backdrop-blur-sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {locale === 'vi' ? "Làm mới" : "Reload"}
          </Button>
          {isSuperAdmin && treeData.length > 0 && (
            <Button 
              onClick={() => openOuDialog('create')} 
              className="bg-primary hover:bg-primary/95 text-white gap-1 shadow-glow"
            >
              <Plus className="h-4 w-4" />
              {locale === 'vi' ? "Thêm OU Mới" : "Create OU"}
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
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold font-sans text-slate-200">{selectedNode.name}</h2>
                    <span className="text-xs text-slate-400 font-mono select-all">ID: {selectedNode.id}</span>
                    {selectedNode.description && (
                      <p className="text-sm text-slate-400 mt-2 italic">“{selectedNode.description}”</p>
                    )}
                  </div>
                  
                  {selectedNode.type === 'ou' && isSuperAdmin && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openOuDialog('edit', selectedNode)}
                        className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800/80"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1" />
                        {locale === 'vi' ? "Sửa" : "Edit"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteOu(selectedNode.id)}
                        className="h-8 shadow-glow-destructive bg-destructive hover:bg-destructive/90"
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
                      <span className="text-slate-200 font-mono">{selectedNode.email}</span>
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

      {/* Dialog for OU Upsert */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-950 border border-slate-900 text-slate-100 shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-primary" />
              {dialogMode === 'create' 
                ? (locale === 'vi' ? "Tạo Đơn vị tổ chức (OU) mới" : "Create New OU")
                : (locale === 'vi' ? "Chỉnh sửa Đơn vị tổ chức (OU)" : "Edit OU Details")}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              {locale === 'vi' 
                ? "Thiết lập cấu trúc thư mục phân quyền bảo mật cho người dùng."
                : "Configure security organizational path mapping."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-sm">
            {/* Domain Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ou_domainId" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Miền con trực thuộc" : "Target Child Domain"}</Label>
              <select
                id="ou_domainId"
                value={dialogTarget.domainId}
                onChange={(e) => setDialogTarget(prev => ({ ...prev, domainId: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-primary text-sm"
              >
                <option value="">{locale === 'vi' ? "-- Chọn Miền con --" : "-- Select Domain --"}</option>
                {treeData.flatMap(f => f.children || []).flatMap(t => t.children || []).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Parent OU Field (Recursive relation) */}
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

            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ou_name" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Tên Đơn vị tổ chức (OU)" : "OU Name"}</Label>
              <Input
                id="ou_name"
                value={dialogTarget.name}
                onChange={(e) => setDialogTarget(prev => ({ ...prev, name: e.target.value }))}
                placeholder={locale === 'vi' ? "Ví dụ: OU Phòng ban, IT, Marketing..." : "e.g., Marketing, IT, HR"}
                className="border-slate-800 bg-slate-950/80 focus:border-primary"
              />
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ou_description" className="text-xs text-slate-400 font-medium">{locale === 'vi' ? "Mô tả / Ghi chú" : "Description"}</Label>
              <Input
                id="ou_description"
                value={dialogTarget.description}
                onChange={(e) => setDialogTarget(prev => ({ ...prev, description: e.target.value }))}
                placeholder={locale === 'vi' ? "Mô tả mục đích sử dụng..." : "Details on usage..."}
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
              onClick={handleSubmitOu}
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
