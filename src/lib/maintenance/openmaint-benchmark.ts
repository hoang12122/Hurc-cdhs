export type MaintenanceCapabilityPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type MaintenanceCapabilityStatus = 'covered' | 'partial' | 'gap' | 'planned';

export interface MaintenanceCapabilityBenchmark {
  id: string;
  name: string;
  openMaintReference: string;
  hurcCurrentCoverage: MaintenanceCapabilityStatus;
  priority: MaintenanceCapabilityPriority;
  recommendedAction: string;
  targetModules: string[];
}

export const OPENMAINT_BENCHMARK_CAPABILITIES: MaintenanceCapabilityBenchmark[] = [
  {
    id: 'asset-inventory',
    name: 'Space and Asset Inventory',
    openMaintReference: 'Inventory of real estate assets, plants, equipment and technical components.',
    hurcCurrentCoverage: 'partial',
    priority: 'P1',
    recommendedAction: 'Strengthen Asset 360 as the source of truth for asset hierarchy, status, documents and technical attributes.',
    targetModules: ['asset-360', 'rail-network', 'spatial-twin'],
  },
  {
    id: 'work-order',
    name: 'Work Order Lifecycle',
    openMaintReference: 'Facility maintenance processes for corrective and preventive maintenance.',
    hurcCurrentCoverage: 'partial',
    priority: 'P0',
    recommendedAction: 'Standardize a work order lifecycle linked to DNF, Inspection, Hazard, Asset, material usage and evidence attachments.',
    targetModules: ['dnf', 'inspections', 'hazards', 'tasks'],
  },
  {
    id: 'preventive-maintenance',
    name: 'Preventive Maintenance Planning',
    openMaintReference: 'Preventive maintenance management on sites and registered assets.',
    hurcCurrentCoverage: 'partial',
    priority: 'P0',
    recommendedAction: 'Add maintenance plan, frequency, checklist template, next due date, overdue alert and completion evidence contracts.',
    targetModules: ['inspections', 'asset-360'],
  },
  {
    id: 'inventory-materials',
    name: 'Logistic Management',
    openMaintReference: 'Warehouses, warehouse items and material handling for maintenance activities.',
    hurcCurrentCoverage: 'gap',
    priority: 'P1',
    recommendedAction: 'Add inventory and material usage capability for warehouse, stock item, issue, return and work order consumption.',
    targetModules: ['asset-360', 'tasks'],
  },
  {
    id: 'maintenance-cost',
    name: 'Economic Management',
    openMaintReference: 'Budgets, maintenance costs, suppliers, contracts, purchase orders and administrative cost tracking.',
    hurcCurrentCoverage: 'gap',
    priority: 'P1',
    recommendedAction: 'Add maintenance cost records linked to work order, material, labor, supplier, contract and budget code.',
    targetModules: ['dnf', 'tasks', 'asset-360'],
  },
  {
    id: 'energy-metering',
    name: 'Energy and Environment',
    openMaintReference: 'Energy information, consumption analysis and meter readings.',
    hurcCurrentCoverage: 'planned',
    priority: 'P2',
    recommendedAction: 'Add meter, meter reading, station/system consumption and abnormal consumption alert capability.',
    targetModules: ['rail-network', 'spatial-twin', 'dashboard'],
  },
  {
    id: 'gis-bim',
    name: 'GIS and BIM Support',
    openMaintReference: 'Asset georeference, 2D GIS layouts and 3D BIM model support.',
    hurcCurrentCoverage: 'covered',
    priority: 'P1',
    recommendedAction: 'Continue validating official GIS/BIM data and link assets to spatial entities before production acceptance.',
    targetModules: ['spatial-twin', 'rail-network', 'asset-360'],
  },
  {
    id: 'mobile-field',
    name: 'Mobile Field Operation',
    openMaintReference: 'Mobile access, attachments, relations, QR/barcode and field process execution.',
    hurcCurrentCoverage: 'partial',
    priority: 'P1',
    recommendedAction: 'Formalize QR scan, photo attachment, offline queue, sync status and field verification checklist.',
    targetModules: ['inspections', 'dnf', 'tasks'],
  },
  {
    id: 'external-integration',
    name: 'External System Integration',
    openMaintReference: 'Interoperability with external applications through webservices and connectors.',
    hurcCurrentCoverage: 'partial',
    priority: 'P1',
    recommendedAction: 'Implement approved adapters on top of Secure Integration Gateway for each real external system.',
    targetModules: ['ai-lab', 'asset-360', 'rail-network'],
  },
];

export function getMaintenanceCapabilityGaps() {
  return OPENMAINT_BENCHMARK_CAPABILITIES.filter((capability) => capability.hurcCurrentCoverage === 'gap');
}

export function getHighPriorityMaintenanceCapabilities() {
  return OPENMAINT_BENCHMARK_CAPABILITIES.filter((capability) => capability.priority === 'P0' || capability.priority === 'P1');
}

export function getMaintenanceCapabilitiesByModule(moduleId: string) {
  return OPENMAINT_BENCHMARK_CAPABILITIES.filter((capability) => capability.targetModules.includes(moduleId));
}
