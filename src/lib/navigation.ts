

import type { NavItem } from '@/lib/constants';
import { 
    LayoutGrid, 
    ClipboardList, 
    FileWarning, 
    ShieldAlert, 
    Lightbulb, 
    ListTodo,
    Users, 
    ShieldCheck, 
    ListChecks, 
    SlidersHorizontal, 
    History, 
    Settings,
    UserCircle,
    LayoutDashboard,
    ShieldAlert as SecurityIcon,
    BrainCircuit,
    TrainFront as MetroIcon
} from 'lucide-react';

export const MAIN_NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: { en: 'Dashboard', vi: 'Bảng điều khiển' }, icon: LayoutGrid, exact: true },
  { path: '/tasks', label: { en: 'Task Management', vi: 'Quản lý Công việc' }, icon: ListTodo, exact: true },
  { path: '/inspections', label: { en: 'Inspections', vi: 'Danh sách Kiểm Tra' }, icon: ClipboardList, exact: false },
  { path: '/dnf', label: { en: 'Incidents (DNF)', vi: 'Quản lý Sự cố (DNF)' }, icon: FileWarning, exact: false },
  { path: '/hazards', label: { en: 'Hazard Management', vi: 'Quản lý Mối nguy' }, icon: ShieldAlert, exact: false },
  { path: '/improvements', label: { en: 'Improvements', vi: 'Quản lý Cải tiến' }, icon: Lightbulb, exact: false },
  { path: '/ai-lab', label: { en: 'AI Knowledge Lab', vi: 'AI Knowledge Lab' }, icon: BrainCircuit, exact: true },
  { path: '/metro/assets', label: { en: 'Metro Expert', vi: 'Chuyên gia Metro' }, icon: MetroIcon, exact: false },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
   { path: '/admin', label: { en: 'Admin Hub', vi: 'Trung tâm Quản trị' }, icon: LayoutDashboard, permission: 'settings:manage', exact: true },
   { path: '/admin/security', label: { en: 'Security Hub', vi: 'Trung tâm Bảo mật' }, icon: SecurityIcon, permission: 'settings:manage' },
   { path: '/admin/users', label: { en: 'User Management', vi: 'Quản lý Người dùng' }, icon: Users, permission: 'users:manage' },
   { path: '/admin/roles', label: { en: 'Role Management', vi: 'Quản lý Vai trò' }, icon: ShieldCheck, permission: 'roles:manage' },
   { path: '/admin/maintenance-standards', label: {en: 'Maintenance Standards', vi: 'Định mức Bảo trì'}, icon: ListChecks, permission: 'checklist_templates:manage' },
   { path: '/admin/categories', label: {en: 'Category Management', vi: 'Quản lý Danh mục'}, icon: SlidersHorizontal, permission: 'settings:manage' },
   { path: '/admin/system-logs', label: { en: 'System Logs', vi: 'Nhật ký Hệ thống' }, icon: History, permission: 'settings:manage' },
   { path: '/admin/settings', label: { en: 'System Settings', vi: 'Cài đặt Hệ thống' }, icon: Settings, permission: 'settings:manage' },
];

export const USER_NAV_ITEMS: NavItem[] = [
  { path: '/profile', label: { en: 'Profile', vi: 'Hồ Sơ' }, icon: UserCircle },
];
