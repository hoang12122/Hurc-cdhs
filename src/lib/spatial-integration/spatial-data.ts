export type SpatialLayerType = 'station' | 'alignment' | 'tunnel' | 'viaduct' | 'risk_zone' | 'asset';
export type SpatialSourceType = 'geojson' | 'wms' | 'wmts' | 'arcgis' | 'postgis';
export type BimModelType = 'ifc' | 'gltf' | 'glb' | 'revit' | 'point_cloud';

export interface SpatialCoordinate {
  longitude: number;
  latitude: number;
  elevationMeters?: number;
}

export interface SpatialFeature {
  id: string;
  name: string;
  layerType: SpatialLayerType;
  coordinates: SpatialCoordinate[];
  assetCode?: string;
  stationCode?: string;
  lineCode?: string;
  properties?: Record<string, string | number | boolean>;
}

export interface BimElementLink {
  id: string;
  globalId: string;
  name: string;
  elementType: string;
  assetCode?: string;
  stationCode?: string;
  discipline: string;
  status: 'mapped' | 'pending' | 'review';
}

export interface BimModelRegistryItem {
  id: string;
  name: string;
  modelType: BimModelType;
  stationCode?: string;
  lineCode?: string;
  discipline: string;
  version: string;
  status: 'draft' | 'approved' | 'as_built';
  sourceUrl?: string;
  elements: BimElementLink[];
}

export const GIS_INTEGRATION_LAYERS = [
  {
    id: 'gis-layer-alignment-m1',
    name: 'Tim tuyến M1 - GeoJSON',
    layerType: 'alignment' as SpatialLayerType,
    sourceType: 'geojson' as SpatialSourceType,
    crs: 'EPSG:4326',
    note: 'Dữ liệu mẫu; khi nghiệm thu cần thay bằng dữ liệu GIS chính thức.',
  },
  {
    id: 'gis-layer-stations-m1',
    name: 'Nhà ga M1 - Point Layer',
    layerType: 'station' as SpatialLayerType,
    sourceType: 'geojson' as SpatialSourceType,
    crs: 'EPSG:4326',
    note: 'Các điểm ga phục vụ liên kết Asset 360/DNF/Hazard.',
  },
  {
    id: 'gis-layer-risk-zone',
    name: 'Vùng rủi ro khai thác',
    layerType: 'risk_zone' as SpatialLayerType,
    sourceType: 'geojson' as SpatialSourceType,
    crs: 'EPSG:4326',
    note: 'Dùng để chồng lớp mối nguy, ngập nước, xây dựng, sự cố kỹ thuật.',
  },
];

export const SAMPLE_SPATIAL_FEATURES: SpatialFeature[] = [
  {
    id: 'feature-m1-alignment-core',
    name: 'Tim tuyến M1 - đoạn trung tâm đến Thủ Đức',
    layerType: 'alignment',
    lineCode: 'M1',
    coordinates: [
      { longitude: 106.70098, latitude: 10.7722 },
      { longitude: 106.7077, latitude: 10.7769 },
      { longitude: 106.7164, latitude: 10.7892 },
      { longitude: 106.7302, latitude: 10.8016 },
      { longitude: 106.7548, latitude: 10.8192 },
      { longitude: 106.7798, latitude: 10.8433 },
    ],
    properties: {
      source: 'schematic-demo',
      replaceWith: 'official GIS alignment',
    },
  },
  {
    id: 'feature-station-ben-thanh',
    name: 'Ga Bến Thành',
    layerType: 'station',
    stationCode: 'M1-BT',
    lineCode: 'M1',
    coordinates: [{ longitude: 106.70098, latitude: 10.7722, elevationMeters: 0 }],
    properties: { interchange: true, underground: true },
  },
  {
    id: 'feature-station-ba-son',
    name: 'Ga Ba Son',
    layerType: 'station',
    stationCode: 'M1-BS',
    lineCode: 'M1',
    coordinates: [{ longitude: 106.7077, latitude: 10.7769, elevationMeters: 0 }],
    properties: { interchange: false, underground: true },
  },
  {
    id: 'feature-station-tan-cang',
    name: 'Ga Tân Cảng',
    layerType: 'station',
    stationCode: 'M1-TC',
    lineCode: 'M1',
    coordinates: [{ longitude: 106.7164, latitude: 10.7892, elevationMeters: 0 }],
    properties: { elevated: true },
  },
  {
    id: 'feature-station-cong-nghe-cao',
    name: 'Ga Công nghệ cao',
    layerType: 'station',
    stationCode: 'M1-CNC',
    lineCode: 'M1',
    coordinates: [{ longitude: 106.7798, latitude: 10.8433, elevationMeters: 0 }],
    properties: { elevated: true },
  },
  {
    id: 'feature-risk-flood-platform',
    name: 'Vùng cần theo dõi ngập/nước mưa tại lối vào ga',
    layerType: 'risk_zone',
    stationCode: 'M1-BT',
    lineCode: 'M1',
    coordinates: [
      { longitude: 106.6998, latitude: 10.7715 },
      { longitude: 106.7021, latitude: 10.7715 },
      { longitude: 106.7021, latitude: 10.7732 },
      { longitude: 106.6998, latitude: 10.7732 },
      { longitude: 106.6998, latitude: 10.7715 },
    ],
    properties: { hazardCategory: 'weather', priority: 'medium' },
  },
];

export const BIM_MODEL_REGISTRY: BimModelRegistryItem[] = [
  {
    id: 'bim-ben-thanh-station-ifc',
    name: 'BIM Ga Bến Thành - As-built tổng hợp',
    modelType: 'ifc',
    stationCode: 'M1-BT',
    lineCode: 'M1',
    discipline: 'architecture_structure_mep',
    version: 'as-built-demo-001',
    status: 'draft',
    sourceUrl: '/bim/ben-thanh/demo.ifc',
    elements: [
      {
        id: 'bim-el-psd-bt-p01',
        globalId: 'IFC-PSD-BT-P01-DEMO',
        name: 'PSD Platform Door P01',
        elementType: 'platform_screen_door',
        assetCode: 'PSD-BT-P01',
        stationCode: 'M1-BT',
        discipline: 'railway_system',
        status: 'mapped',
      },
      {
        id: 'bim-el-afc-bt-g01',
        globalId: 'IFC-AFC-BT-G01-DEMO',
        name: 'AFC Gate G01',
        elementType: 'afc_gate',
        assetCode: 'AFC-BT-G01',
        stationCode: 'M1-BT',
        discipline: 'railway_system',
        status: 'mapped',
      },
      {
        id: 'bim-el-room-bt-signal',
        globalId: 'IFC-ROOM-BT-SIGNAL-DEMO',
        name: 'Phòng thiết bị tín hiệu',
        elementType: 'technical_room',
        stationCode: 'M1-BT',
        discipline: 'mep',
        status: 'review',
      },
    ],
  },
  {
    id: 'bim-tan-cang-gltf',
    name: 'BIM Ga Tân Cảng - mô hình nhẹ cho web',
    modelType: 'gltf',
    stationCode: 'M1-TC',
    lineCode: 'M1',
    discipline: 'civil_railway_system',
    version: 'web-demo-001',
    status: 'draft',
    sourceUrl: '/bim/tan-cang/demo.glb',
    elements: [
      {
        id: 'bim-el-track-tc-01',
        globalId: 'GLTF-TRACK-TC-01-DEMO',
        name: 'Track segment TC-01',
        elementType: 'track',
        stationCode: 'M1-TC',
        discipline: 'track',
        status: 'pending',
      },
    ],
  },
];

export const SPATIAL_INTEGRATION_FLOW = [
  {
    id: 'source',
    title: 'Nguồn dữ liệu',
    description: 'Nhận GeoJSON/WMS/WMTS/ArcGIS/PostGIS cho GIS và IFC/glTF/glb/Revit/Point Cloud cho BIM.',
  },
  {
    id: 'normalize',
    title: 'Chuẩn hóa',
    description: 'Chuẩn hóa hệ tọa độ, mã tuyến, mã ga, mã tài sản và mã phần tử BIM.',
  },
  {
    id: 'link',
    title: 'Liên kết tài sản',
    description: 'Gắn Asset 360 với GIS Feature và BIM Element thông qua AssetSpatialLink.',
  },
  {
    id: 'operate',
    title: 'Vận hành',
    description: 'Hiển thị cảnh báo DNF/Hazard/Telemetry trực tiếp trên bản đồ và mô hình BIM.',
  },
];

export function projectGeoToCanvas(coordinate: SpatialCoordinate) {
  const minLon = 106.695;
  const maxLon = 106.79;
  const minLat = 10.768;
  const maxLat = 10.848;

  const x = ((coordinate.longitude - minLon) / (maxLon - minLon)) * 100;
  const y = 100 - ((coordinate.latitude - minLat) / (maxLat - minLat)) * 100;

  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  };
}
