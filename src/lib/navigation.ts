

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
  { path: '/tasks', label: { en: 'Tasks / Projects', vi: 'Công việc & Dự án' }, icon: ShieldCheck, exact: false },
  { path: '/inspections', label: { en: 'Inspections', vi: 'Danh sách Kiểm Tra' }, icon: ClipboardList, exact: false },
  { path: '/dnf', label: { en: 'Incidents (DNF)', vi: 'Quản lý Sự cố (DNF)' }, icon: FileWarning, exact: false },
  { path: '/hazards', label: { en: 'Hazard Management', vi: 'Quản lý Mối nguy' }, icon: ShieldAlert, exact: false },
  { path: '/improvements', label: { en: 'Improvements', vi: 'Quản lý Cải tiến' }, icon: Lightbulb, exact: false },
  { path: '/ai-lab', label: { en: 'AI Knowledge Lab', vi: 'AI Knowledge Lab' }, icon: BrainCircuit, exact: true },
  { path: '/metro/assets', label: { en: 'Metro Expert', vi: 'Chuyên gia Metro' }, icon: MetroIcon, exact: false },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
   { path: '/admin', label: { en: 'Admin Hub', vi: 'Quản trị Hệ thống' }, icon: LayoutDashboard, permission: 'settings:manage', exact: true },
];

export const USER_NAV_ITEMS: NavItem[] = [
  { path: '/profile', label: { en: 'Profile', vi: 'Hồ Sơ' }, icon: UserCircle },
];
