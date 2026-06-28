import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { Client } from 'pg';

type GeometryType = 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';

type GeoJsonFeature = {
  type: 'Feature';
  id?: string | number;
  properties?: Record<string, unknown>;
  geometry?: {
    type: GeometryType;
    coordinates: unknown;
  };
};

type GeoJsonFeatureCollection = {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
};

type BimIndexFile = {
  model: {
    name: string;
    modelType: string;
    sourceUrl?: string;
    version?: string;
    discipline?: string;
    stationCode?: string;
    lineCode?: string;
    status?: string;
  };
  elements: Array<{
    globalId?: string;
    name?: string;
    elementType?: string;
    assetCode?: string;
    stationCode?: string;
    properties?: Record<string, unknown>;
    boundingBox?: Record<string, unknown>;
  }>;
};

type ImportArgs = {
  dryRun: boolean;
  gisPath: string;
  bimPath: string;
};

const DEFAULT_GIS_PATH = 'data/import/gis/stations-m1.geojson';
const DEFAULT_BIM_PATH = 'data/import/bim/ben-thanh-bim-index.json';

function parseArgs(): ImportArgs {
  const args = process.argv.slice(2);
  const getArgValue = (name: string, fallback: string) => {
    const index = args.indexOf(name);
    if (index >= 0 && args[index + 1]) return args[index + 1];
    return fallback;
  };

  return {
    dryRun: !args.includes('--commit'),
    gisPath: getArgValue('--gis', DEFAULT_GIS_PATH),
    bimPath: getArgValue('--bim', DEFAULT_BIM_PATH),
  };
}

async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.resolve(process.cwd(), relativePath);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function validateCoordinates(value: unknown, context: string) {
  assert(Array.isArray(value), `${context}: coordinates phải là array.`);
  assert(value.length > 0, `${context}: coordinates không được rỗng.`);
}

function validateGeoJson(data: GeoJsonFeatureCollection) {
  assert(data?.type === 'FeatureCollection', 'GIS: file phải có type = FeatureCollection.');
  assert(Array.isArray(data.features), 'GIS: features phải là array.');
  assert(data.features.length > 0, 'GIS: features không được rỗng.');

  const allowedTypes = new Set<GeometryType>(['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon']);

  data.features.forEach((feature, index) => {
    assert(feature?.type === 'Feature', `GIS feature #${index + 1}: type phải là Feature.`);
    assert(feature.geometry, `GIS feature #${index + 1}: thiếu geometry.`);
    assert(allowedTypes.has(feature.geometry.type), `GIS feature #${index + 1}: geometry type không hợp lệ.`);
    validateCoordinates(feature.geometry.coordinates, `GIS feature #${index + 1}`);
    assert(feature.properties && typeof feature.properties === 'object', `GIS feature #${index + 1}: thiếu properties.`);
  });
}

function validateBimIndex(data: BimIndexFile) {
  assert(data?.model, 'BIM: thiếu object model.');
  assert(typeof data.model.name === 'string' && data.model.name.trim().length > 0, 'BIM: model.name bắt buộc.');
  assert(typeof data.model.modelType === 'string' && data.model.modelType.trim().length > 0, 'BIM: model.modelType bắt buộc.');
  assert(Array.isArray(data.elements), 'BIM: elements phải là array.');
  assert(data.elements.length > 0, 'BIM: elements không được rỗng.');

  data.elements.forEach((element, index) => {
    assert(element.globalId || element.assetCode || element.name, `BIM element #${index + 1}: cần có globalId, assetCode hoặc name để nhận diện.`);
    assert(element.elementType, `BIM element #${index + 1}: thiếu elementType.`);
  });
}

async function findIdByCode(client: Client, table: string, code: string | undefined | null): Promise<string | null> {
  if (!code) return null;
  const result = await client.query(`SELECT id FROM ${table} WHERE code = $1 LIMIT 1`, [code]);
  return result.rows[0]?.id || null;
}

async function commitGeoJson(client: Client, data: GeoJsonFeatureCollection, sourcePath: string) {
  const layerId = crypto.randomUUID();
  const now = new Date();
  const layerName = `Imported GIS - ${path.basename(sourcePath)}`;

  await client.query(
    `INSERT INTO metro_gis_layers (id, name, layer_type, source_type, crs, visible, metadata, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9)`,
    [layerId, layerName, 'station', 'geojson', 'EPSG:4326', true, JSON.stringify({ sourcePath }), now, now],
  );

  for (const feature of data.features) {
    const properties = feature.properties || {};
    const lineId = await findIdByCode(client, 'metro_rail_lines', String(properties.lineCode || ''));
    const stationId = await findIdByCode(client, 'metro_rail_stations', String(properties.stationCode || ''));
    const assetId = await findIdByCode(client, 'metro_assets', String(properties.assetCode || ''));

    await client.query(
      `INSERT INTO metro_gis_features
       (id, layer_id, external_id, name, geometry_type, geometry, properties, asset_id, station_id, line_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10, $11, $12)`,
      [
        crypto.randomUUID(),
        layerId,
        feature.id ? String(feature.id) : null,
        typeof properties.name === 'string' ? properties.name : null,
        feature.geometry?.type,
        JSON.stringify(feature.geometry),
        JSON.stringify(properties),
        assetId,
        stationId,
        lineId,
        now,
        now,
      ],
    );
  }
}

async function commitBimIndex(client: Client, data: BimIndexFile, sourcePath: string) {
  const now = new Date();
  const lineId = await findIdByCode(client, 'metro_rail_lines', data.model.lineCode);
  const stationId = await findIdByCode(client, 'metro_rail_stations', data.model.stationCode);
  const modelId = crypto.randomUUID();

  await client.query(
    `INSERT INTO metro_bim_models
     (id, name, model_type, source_url, version, discipline, line_id, station_id, status, metadata, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12)`,
    [
      modelId,
      data.model.name,
      data.model.modelType,
      data.model.sourceUrl || null,
      data.model.version || null,
      data.model.discipline || null,
      lineId,
      stationId,
      data.model.status || 'draft',
      JSON.stringify({ sourcePath }),
      now,
      now,
    ],
  );

  for (const element of data.elements) {
    const assetId = await findIdByCode(client, 'metro_assets', element.assetCode);
    const elementId = crypto.randomUUID();

    await client.query(
      `INSERT INTO metro_bim_elements
       (id, model_id, global_id, name, element_type, asset_id, properties, bounding_box, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10)`,
      [
        elementId,
        modelId,
        element.globalId || null,
        element.name || null,
        element.elementType || null,
        assetId,
        JSON.stringify(element.properties || {}),
        JSON.stringify(element.boundingBox || null),
        now,
        now,
      ],
    );

    if (assetId) {
      await client.query(
        `INSERT INTO metro_asset_spatial_links
         (id, asset_id, bim_element_id, link_type, confidence, note, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [crypto.randomUUID(), assetId, elementId, 'digital_twin', 1, 'Imported from BIM index', now, now],
      );
    }
  }
}

async function main() {
  const args = parseArgs();
  const geoJson = await readJsonFile<GeoJsonFeatureCollection>(args.gisPath);
  const bimIndex = await readJsonFile<BimIndexFile>(args.bimPath);

  validateGeoJson(geoJson);
  validateBimIndex(bimIndex);

  const summary = {
    mode: args.dryRun ? 'dry-run' : 'commit',
    gisPath: args.gisPath,
    gisFeatureCount: geoJson.features.length,
    bimPath: args.bimPath,
    bimModelName: bimIndex.model.name,
    bimElementCount: bimIndex.elements.length,
  };

  console.log('[GIS/BIM IMPORT] Validation passed:', JSON.stringify(summary, null, 2));

  if (args.dryRun) {
    console.log('[GIS/BIM IMPORT] Dry-run only. Không ghi dữ liệu vào database.');
    return;
  }

  const databaseUrl = process.env.METRO_DATABASE_URL;
  assert(databaseUrl, 'METRO_DATABASE_URL bắt buộc khi chạy --commit.');

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query('BEGIN');
    await commitGeoJson(client, geoJson, args.gisPath);
    await commitBimIndex(client, bimIndex, args.bimPath);
    await client.query('COMMIT');
    console.log('[GIS/BIM IMPORT] Import committed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[GIS/BIM IMPORT] Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
