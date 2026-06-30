export type ModuleRuntimeMode = 'in-app' | 'remote-ready' | 'remote';
export type ModuleCriticality = 'core' | 'business' | 'supporting' | 'experimental';

export interface AppModuleContract {
  id: string;
  name: string;
  routePrefix: string;
  owner: string;
  runtimeMode: ModuleRuntimeMode;
  criticality: ModuleCriticality;
  dataBoundary: 'authDb' | 'opsDb' | 'metroDb' | 'aiDb' | 'mixed' | 'none';
  allowedInboundEvents: string[];
  allowedOutboundEvents: string[];
  productionReadiness: 'ready' | 'needs-data' | 'needs-migration' | 'needs-validation';
}

export const APP_MODULE_REGISTRY: AppModuleContract[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    routePrefix: '/dashboard',
    owner: 'Operations',
    runtimeMode: 'in-app',
    criticality: 'core',
    dataBoundary: 'mixed',
    allowedInboundEvents: [],
    allowedOutboundEvents: [],
    productionReadiness: 'needs-validation',
  },
  {
    id: 'dnf',
    name: 'DNF Management',
    routePrefix: '/dnf',
    owner: 'Maintenance / Engineering',
    runtimeMode: 'in-app',
    criticality: 'core',
    dataBoundary: 'opsDb',
    allowedInboundEvents: ['inspection:create-dnf'],
    allowedOutboundEvents: ['dnf:created'],
    productionReadiness: 'needs-validation',
  },
  {
    id: 'hazards',
    name: 'Hazard Management',
    routePrefix: '/hazards',
    owner: 'Safety',
    runtimeMode: 'in-app',
    criticality: 'core',
    dataBoundary: 'opsDb',
    allowedInboundEvents: [],
    allowedOutboundEvents: ['hazard:created'],
    productionReadiness: 'needs-validation',
  },
  {
    id: 'inspections',
    name: 'Inspection Management',
    routePrefix: '/inspections',
    owner: 'Maintenance / Safety',
    runtimeMode: 'in-app',
    criticality: 'business',
    dataBoundary: 'opsDb',
    allowedInboundEvents: [],
    allowedOutboundEvents: ['inspection:create-dnf'],
    productionReadiness: 'needs-validation',
  },
  {
    id: 'asset-360',
    name: 'Asset 360 Digital Twin',
    routePrefix: '/asset-360',
    owner: 'Asset Management',
    runtimeMode: 'in-app',
    criticality: 'business',
    dataBoundary: 'mixed',
    allowedInboundEvents: ['asset:open-360'],
    allowedOutboundEvents: ['ai-lab:open-incident-learning'],
    productionReadiness: 'needs-data',
  },
  {
    id: 'ai-lab',
    name: 'AI Knowledge Lab',
    routePrefix: '/ai-lab',
    owner: 'Engineering / AI',
    runtimeMode: 'in-app',
    criticality: 'supporting',
    dataBoundary: 'mixed',
    allowedInboundEvents: ['ai-lab:open-incident-learning'],
    allowedOutboundEvents: [],
    productionReadiness: 'needs-validation',
  },
  {
    id: 'rail-network',
    name: 'Rail Network',
    routePrefix: '/rail-network',
    owner: 'Infrastructure / GIS',
    runtimeMode: 'in-app',
    criticality: 'supporting',
    dataBoundary: 'metroDb',
    allowedInboundEvents: [],
    allowedOutboundEvents: ['asset:open-360'],
    productionReadiness: 'needs-data',
  },
  {
    id: 'spatial-twin',
    name: 'GIS/BIM Twin',
    routePrefix: '/spatial-twin',
    owner: 'Infrastructure / BIM',
    runtimeMode: 'in-app',
    criticality: 'supporting',
    dataBoundary: 'metroDb',
    allowedInboundEvents: [],
    allowedOutboundEvents: ['asset:open-360'],
    productionReadiness: 'needs-data',
  },
  {
    id: 'example-module',
    name: 'Example Module Scaffold',
    routePrefix: '/example-module',
    owner: 'Developer Guide',
    runtimeMode: 'in-app',
    criticality: 'experimental',
    dataBoundary: 'none',
    allowedInboundEvents: [],
    allowedOutboundEvents: [],
    productionReadiness: 'ready',
  },
];

export function getModuleByRoute(pathname: string) {
  return APP_MODULE_REGISTRY.find((moduleContract) => pathname.startsWith(moduleContract.routePrefix));
}

export function getModulesByRuntimeMode(runtimeMode: ModuleRuntimeMode) {
  return APP_MODULE_REGISTRY.filter((moduleContract) => moduleContract.runtimeMode === runtimeMode);
}

export function getModulesRequiringProductionWork() {
  return APP_MODULE_REGISTRY.filter((moduleContract) => moduleContract.productionReadiness !== 'ready');
}
