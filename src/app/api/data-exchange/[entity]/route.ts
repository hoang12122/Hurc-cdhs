import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';
import { parseCsv, serializeCsv } from '@/lib/services/data-exchange/csv';
import {
  DNF_COLUMNS,
  HAZARD_COLUMNS,
  exportOperationalRecords,
  importOperationalRecords,
  type ExchangeEntity,
} from '@/lib/services/data-exchange/operational-exchange';

export const dynamic = 'force-dynamic';

function entityValue(raw: string): ExchangeEntity {
  if (raw === 'dnf' || raw === 'hazard') return raw;
  throw new Error('Unsupported entity. Use dnf or hazard.');
}

async function contextEntity(context: { params: Promise<{ entity: string }> }) {
  const params = await context.params;
  return entityValue(params.entity);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ entity: string }> },
) {
  try {
    const entity = await contextEntity(context);
    const user = await requirePermission(`${entity}:manage`);
    if (!checkRateLimit(`data-exchange-export:${entity}:${user.id}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many export requests.' }, { status: 429 });
    }
    const rows = await exportOperationalRecords(entity);
    const format = request.nextUrl.searchParams.get('format') ?? 'csv';
    if (format === 'json') {
      return NextResponse.json({ entity, exportedAt: new Date().toISOString(), count: rows.length, records: rows }, {
        headers: { 'cache-control': 'no-store' },
      });
    }
    if (format !== 'csv') return NextResponse.json({ error: 'format must be csv or json.' }, { status: 400 });
    const columns = entity === 'dnf' ? [...DNF_COLUMNS] : [...HAZARD_COLUMNS];
    const csv = serializeCsv(rows, columns);
    const filename = `${entity}-export-${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(csv, {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="${filename}"`,
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Data export failed.';
    return NextResponse.json({ error: message }, { status: message.startsWith('Unsupported') ? 400 : 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ entity: string }> },
) {
  try {
    const entity = await contextEntity(context);
    const user = await requirePermission(`${entity}:manage`);
    if (!checkRateLimit(`data-exchange-import:${entity}:${user.id}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many import requests.' }, { status: 429 });
    }
    const dryRun = request.nextUrl.searchParams.get('dryRun') !== 'false';
    const contentType = request.headers.get('content-type') ?? '';
    let rows: Array<Record<string, string>>;
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      if (!(file instanceof File)) return NextResponse.json({ error: 'CSV file is required.' }, { status: 400 });
      if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Import file exceeds 10MB.' }, { status: 413 });
      rows = parseCsv(await file.text(), 5_000);
    } else {
      const body = await request.json() as { records?: Array<Record<string, unknown>> };
      if (!Array.isArray(body.records)) return NextResponse.json({ error: 'records array is required.' }, { status: 400 });
      rows = body.records.map(record => Object.fromEntries(Object.entries(record).map(([key, value]) => [key, value === null || value === undefined ? '' : String(value)])));
    }
    const result = await importOperationalRecords(entity, rows, user.id, dryRun);
    return NextResponse.json(result, {
      status: result.rejected > 0 && result.validRows === 0 ? 422 : 200,
      headers: { 'cache-control': 'no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Data import failed.';
    return NextResponse.json({ error: message }, { status: message.startsWith('Unsupported') ? 400 : 500 });
  }
}
