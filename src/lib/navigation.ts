import type { NavItem } from '@/lib/constants';
import { 
    LayoutGrid, 
    ClipboardList, 
    FileWarning, 
    ShieldAlert, 
    Lightbulb, 
    UserCircle,
    LayoutDashboard,
    BrainCircuit,
    TrainFront as MetroIcon,
    Network,
    MapPinned,
    Workflow,
    GitCompare
} from 'lucide-react';

export const MAIN_NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: { en: 'Dashboard', vi: 'Bảng điều khiển' }, icon: LayoutGrid, exact: true },
  { path: '/tasks', label: { en: 'Tasks / Projects', vi: 'Công việc & Dự án' }, icon: LayoutDashboard, exact: false },
  { path: '/inspections', label: { en: 'Inspections', vi: 'Danh sách Kiểm Tra' }, icon: ClipboardList, exact: false },
  { path: '/dnf', label: { en: 'Incidents (DNF)', vi: 'Quản lý Sự cố (DNF)' }, icon: FileWarning, exact: false },
  { path: '/hazards', label: { en: 'Hazard Management', vi: 'Quản lý Mối nguy' }, icon: ShieldAlert, exact: false },
  { path: '/fracas-risk-management', label: { en: 'FRACAS / Risk Management', vi: 'FRACAS / Quản lý rủi ro' }, icon: Workflow, exact: true },
  { path: '/fracas-risk-management/shamma-benchmark', label: { en: 'Shamma Benchmark', vi: 'Đối chiếu Shamma' }, icon: GitCompare, exact: true },
  { path: '/improvements', label: { en: 'Improvements', vi: 'Quản lý Cải tiến' }, icon: Lightbulb, exact: false },
  { path: '/asset-360', label: { en: 'Asset 360', vi: 'Tài sản 360 (Digital Twin)' }, icon: LayoutDashboard, exact: false },
  { path: '/rail-network', label: { en: 'Rail Network', vi: 'Mạng tuyến Metro' }, icon: Network, exact: true },
  { path: '/spatial-twin', label: { en: 'GIS/BIM Twin', vi: 'GIS/BIM Twin' }, icon: MapPinned, exact: true },
  { path: '/ai-lab', label: { en: 'AI Knowledge Lab', vi: 'AI Knowledge Lab' }, icon: BrainCircuit, exact: true },
  { path: '/ai-lab/incident-memory', label: { en: 'Incident Memory Approval', vi: 'Phê duyệt Incident Memory' }, icon: BrainCircuit, exact: true },
  { path: '/metro/assets', label: { en: 'Metro Expert', vi: 'Chuyên gia Metro' }, icon: MetroIcon, exact: false },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { path: '/admin', label: { en: 'Admin Hub', vi: 'Quản trị Hệ thống' }, icon: LayoutDashboard, permission: 'settings:manage', exact: true },
  { path: '/admin/ai-governance', label: { en: 'AI Governance', vi: 'Quản trị AI' }, icon: BrainCircuit, permission: 'admin:system', exact: true },
];

export const USER_NAV_ITEMS: NavItem[] = [
  { path: '/profile', label: { en: 'Profile', vi: 'Hồ Sơ' }, icon: UserCircle },
];
