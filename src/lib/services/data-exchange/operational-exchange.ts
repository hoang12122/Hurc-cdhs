import { randomUUID } from 'node:crypto';
import {
  createDnfInternal,
  getDnfByIdInternal,
  getDnfsInternal,
  updateDnfInternal,
} from '@/lib/services/dnf-service';
import {
  createInternalHazard,
  getInternalHazardById,
  getInternalHazards,
  updateInternalHazard,
} from '@/lib/services/ops-service';

export type ExchangeEntity = 'dnf' | 'hazard';

export interface ImportIssue {
  row: number;
  field?: string;
  code: string;
  message: string;
}

export interface ImportResult {
  entity: ExchangeEntity;
  dryRun: boolean;
  totalRows: number;
  validRows: number;
  created: number;
  updated: number;
  rejected: number;
  issues: ImportIssue[];
}

export const DNF_COLUMNS = [
  'id', 'failureReportNo', 'locationOfFailure', 'failedComponentEquipmentLRUTrainNumber',
  'subsystemIds', 'descriptionOfFailure', 'impactAssessment', 'staffWhoIdentifiedFailure',
  'dateTimeOfFailureOccurrence', 'methodOfFailureDetection', 'hazardLevelId', 'status',
  'priority', 'assignedTo', 'immediateAction', 'resolutionDetails', 'attachments',
] as const;

export const HAZARD_COLUMNS = [
  'id', 'description', 'systemGroup', 'locationIds', 'source', 'potentialConsequence',
  'identifiedBy', 'identificationDate', 'severityId', 'likelihoodId', 'riskLevelId',
  'currentControls', 'proposedActions', 'responsiblePersonOrUnit', 'coordinatingUnits',
  'dueDate', 'status', 'linkedDnfId', 'closureDetails', 'verificationDetails', 'attachments',
] as const;

const validId = (value: string) => /^[A-Za-z0-9._-]{3,100}$/.test(value);
const value = (row: Record<string, string>, key: string) => String(row[key] ?? '').trim();
const list = (raw: string) => raw.split(/[;|]/).map(item => item.trim()).filter(Boolean);

function dateValue(raw: string, required: boolean, field: string, rowNumber: number, issues: ImportIssue[]) {
  if (!raw) {
    if (required) issues.push({ row: rowNumber, field, code: 'REQUIRED', message: `${field} is required.` });
    return null;
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    issues.push({ row: rowNumber, field, code: 'INVALID_DATE', message: `${field} must be an ISO-8601 or valid date value.` });
    return null;
  }
  return date.toISOString();
}

function attachments(raw: string) {
  return list(raw).map(url => ({ url, name: url.split('/').pop() || 'attachment' }));
}

function cleanExportValue(raw: unknown): unknown {
  if (Array.isArray(raw)) {
    return raw.map(item => typeof item === 'object' && item && 'url' in item ? String((item as { url?: unknown }).url ?? '') : String(item)).filter(Boolean).join(';');
  }
  if (raw instanceof Date) return raw.toISOString();
  if (raw && typeof raw === 'object') return JSON.stringify(raw);
  return raw ?? '';
}

export async function exportOperationalRecords(entity: ExchangeEntity) {
  const records = entity === 'dnf' ? await getDnfsInternal() : await getInternalHazards();
  const columns = entity === 'dnf' ? DNF_COLUMNS : HAZARD_COLUMNS;
  return records.map(record => Object.fromEntries(columns.map(column => [column, cleanExportValue((record as Record<string, unknown>)[column])]))) as Array<Record<string, unknown>>;
}

function dnfPayload(row: Record<string, string>, rowNumber: number, issues: ImportIssue[]) {
  const description = value(row, 'descriptionOfFailure');
  const location = value(row, 'locationOfFailure');
  const occurredAt = dateValue(value(row, 'dateTimeOfFailureOccurrence'), true, 'dateTimeOfFailureOccurrence', rowNumber, issues);
  if (!description) issues.push({ row: rowNumber, field: 'descriptionOfFailure', code: 'REQUIRED', message: 'descriptionOfFailure is required.' });
  if (!location) issues.push({ row: rowNumber, field: 'locationOfFailure', code: 'REQUIRED', message: 'locationOfFailure is required.' });
  return {
    failureReportNo: value(row, 'failureReportNo') || undefined,
    locationOfFailure: location,
    failedComponentEquipmentLRUTrainNumber: value(row, 'failedComponentEquipmentLRUTrainNumber') || undefined,
    subsystemIds: list(value(row, 'subsystemIds')),
    descriptionOfFailure: description,
    impactAssessment: value(row, 'impactAssessment') || undefined,
    staffWhoIdentifiedFailure: value(row, 'staffWhoIdentifiedFailure') || 'Data Exchange Import',
    dateTimeOfFailureOccurrence: occurredAt,
    methodOfFailureDetection: value(row, 'methodOfFailureDetection') || 'Imported record',
    hazardLevelId: value(row, 'hazardLevelId') || 'low',
    status: value(row, 'status') || 'Mới',
    priority: value(row, 'priority') || 'Trung bình',
    assignedTo: value(row, 'assignedTo') || undefined,
    immediateAction: value(row, 'immediateAction') || undefined,
    resolutionDetails: value(row, 'resolutionDetails') || undefined,
    attachments: attachments(value(row, 'attachments')),
  };
}

function hazardPayload(row: Record<string, string>, rowNumber: number, issues: ImportIssue[]) {
  const description = value(row, 'description');
  const identificationDate = dateValue(value(row, 'identificationDate'), true, 'identificationDate', rowNumber, issues);
  const locations = list(value(row, 'locationIds'));
  const controls = value(row, 'currentControls');
  if (!description) issues.push({ row: rowNumber, field: 'description', code: 'REQUIRED', message: 'description is required.' });
  if (locations.length === 0) issues.push({ row: rowNumber, field: 'locationIds', code: 'REQUIRED', message: 'At least one locationId is required.' });
  if (!controls) issues.push({ row: rowNumber, field: 'currentControls', code: 'REQUIRED', message: 'currentControls is required.' });
  const dueDate = dateValue(value(row, 'dueDate'), false, 'dueDate', rowNumber, issues);
  return {
    description,
    systemGroup: value(row, 'systemGroup') || undefined,
    locationIds: locations,
    source: value(row, 'source') || 'Data Exchange Import',
    potentialConsequence: value(row, 'potentialConsequence') || undefined,
    identifiedBy: value(row, 'identifiedBy') || 'Data Exchange Import',
    identificationDate,
    severityId: value(row, 'severityId') || undefined,
    likelihoodId: value(row, 'likelihoodId') || undefined,
    riskLevelId: value(row, 'riskLevelId') || undefined,
    currentControls: controls,
    proposedActions: value(row, 'proposedActions') || undefined,
    responsiblePersonOrUnit: value(row, 'responsiblePersonOrUnit') || undefined,
    coordinatingUnits: list(value(row, 'coordinatingUnits')),
    dueDate,
    status: value(row, 'status') || 'Mới',
    linkedDnfId: value(row, 'linkedDnfId') || null,
    closureDetails: value(row, 'closureDetails') || undefined,
    verificationDetails: value(row, 'verificationDetails') || undefined,
    attachments: attachments(value(row, 'attachments')),
  };
}

export async function importOperationalRecords(
  entity: ExchangeEntity,
  rows: Array<Record<string, string>>,
  userId: string,
  dryRun = true,
): Promise<ImportResult> {
  if (rows.length > 5_000) throw new Error('Import is limited to 5,000 rows per request.');
  const result: ImportResult = { entity, dryRun, totalRows: rows.length, validRows: 0, created: 0, updated: 0, rejected: 0, issues: [] };

  for (let index = 0; index < rows.length; index += 1) {
    const rowNumber = index + 2;
    const rowIssues: ImportIssue[] = [];
    const idFromFile = value(rows[index], 'id');
    if (idFromFile && !validId(idFromFile)) rowIssues.push({ row: rowNumber, field: 'id', code: 'INVALID_ID', message: 'id contains unsupported characters.' });
    const payload = entity === 'dnf' ? dnfPayload(rows[index], rowNumber, rowIssues) : hazardPayload(rows[index], rowNumber, rowIssues);
    if (rowIssues.length > 0) {
      result.rejected += 1;
      result.issues.push(...rowIssues);
      continue;
    }

    result.validRows += 1;
    const existing = idFromFile
      ? entity === 'dnf' ? await getDnfByIdInternal(idFromFile) : await getInternalHazardById(idFromFile)
      : null;
    if (existing) {
      result.updated += 1;
      if (!dryRun) {
        if (entity === 'dnf') await updateDnfInternal(idFromFile, payload);
        else await updateInternalHazard(idFromFile, payload);
      }
    } else {
      result.created += 1;
      if (!dryRun) {
        if (entity === 'dnf') {
          const newId = idFromFile || `DNF-IMP-${randomUUID().slice(0, 8).toUpperCase()}`;
          await createDnfInternal(newId, payload, userId);
        } else {
          await createInternalHazard({ ...payload, id: idFromFile || `HZ-IMP-${randomUUID().slice(0, 8).toUpperCase()}` }, userId);
        }
      }
    }
  }
  return result;
}
