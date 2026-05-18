
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.SystemLogScalarFieldEnum = {
  id: 'id',
  timestamp: 'timestamp',
  userId: 'userId',
  userName: 'userName',
  action: 'action',
  level: 'level',
  details: 'details',
  category: 'category',
  deletedAt: 'deletedAt'
};

exports.Prisma.ResponsibleUnitScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.SubsystemScalarFieldEnum = {
  id: 'id',
  label: 'label'
};

exports.Prisma.PatrolLocationScalarFieldEnum = {
  id: 'id',
  label: 'label'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  entityId: 'entityId',
  senderId: 'senderId',
  senderName: 'senderName',
  timestamp: 'timestamp',
  content: 'content'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  message: 'message',
  type: 'type',
  timestamp: 'timestamp',
  isRead: 'isRead',
  link: 'link'
};

exports.Prisma.MaintenanceStandardScalarFieldEnum = {
  id: 'id',
  name: 'name',
  name_en: 'name_en',
  description: 'description',
  frequency: 'frequency',
  scheduledTime: 'scheduledTime',
  locationIds: 'locationIds',
  recipientId: 'recipientId',
  abbreviation: 'abbreviation',
  estimatedDurationHours: 'estimatedDurationHours',
  deletedAt: 'deletedAt'
};

exports.Prisma.MaintenanceStandardItemScalarFieldEnum = {
  id: 'id',
  standardId: 'standardId',
  itemCode: 'itemCode',
  itemText: 'itemText',
  criteria: 'criteria',
  unit: 'unit',
  standardQuantity: 'standardQuantity',
  toleranceOperator: 'toleranceOperator',
  toleranceValue: 'toleranceValue',
  requiredTools: 'requiredTools'
};

exports.Prisma.InspectionDetailScalarFieldEnum = {
  id: 'id',
  title: 'title',
  areaIds: 'areaIds',
  inspector: 'inspector',
  date: 'date',
  status: 'status',
  checklistTemplateId: 'checklistTemplateId',
  checklistItems: 'checklistItems',
  generalNotes: 'generalNotes',
  approvalComments: 'approvalComments',
  lastStatusUpdateBy: 'lastStatusUpdateBy',
  lastStatusUpdateAt: 'lastStatusUpdateAt',
  scheduledStartDate: 'scheduledStartDate',
  scheduledFinishDate: 'scheduledFinishDate',
  estimatedDurationHours: 'estimatedDurationHours',
  isArchived: 'isArchived',
  deletedAt: 'deletedAt'
};

exports.Prisma.DnfDocumentScalarFieldEnum = {
  id: 'id',
  failureReportNo: 'failureReportNo',
  locationOfFailure: 'locationOfFailure',
  failedComponentEquipmentLRUTrainNumber: 'failedComponentEquipmentLRUTrainNumber',
  subsystemIds: 'subsystemIds',
  descriptionOfFailure: 'descriptionOfFailure',
  impactAssessment: 'impactAssessment',
  staffWhoIdentifiedFailure: 'staffWhoIdentifiedFailure',
  dateTimeOfFailureOccurrence: 'dateTimeOfFailureOccurrence',
  methodOfFailureDetection: 'methodOfFailureDetection',
  hazardLevelId: 'hazardLevelId',
  status: 'status',
  attachments: 'attachments',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  statusHistory: 'statusHistory',
  isArchived: 'isArchived',
  resolutionDetails: 'resolutionDetails',
  assignedTo: 'assignedTo',
  priority: 'priority',
  completedDate: 'completedDate',
  originatingInspectionId: 'originatingInspectionId',
  originatingFindingId: 'originatingFindingId',
  immediateAction: 'immediateAction',
  problemResettable: 'problemResettable',
  trainServiceAffected: 'trainServiceAffected',
  trainWithdrawn: 'trainWithdrawn',
  systemRestoredTime: 'systemRestoredTime',
  disruptionDuration: 'disruptionDuration',
  trainKm: 'trainKm',
  rectificationParty: 'rectificationParty',
  deletedAt: 'deletedAt'
};

exports.Prisma.CorrectiveActionScalarFieldEnum = {
  id: 'id',
  dnfId: 'dnfId',
  description: 'description',
  responsiblePersonOrUnit: 'responsiblePersonOrUnit',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  completedAt: 'completedAt',
  status: 'status',
  dateTimeNotified: 'dateTimeNotified',
  dateTimeArrival: 'dateTimeArrival',
  diagnosisTime: 'diagnosisTime',
  repairTime: 'repairTime',
  verificationTime: 'verificationTime',
  totalDownTime: 'totalDownTime'
};

exports.Prisma.HazardRecordScalarFieldEnum = {
  id: 'id',
  description: 'description',
  systemGroup: 'systemGroup',
  locationIds: 'locationIds',
  source: 'source',
  potentialConsequence: 'potentialConsequence',
  identifiedBy: 'identifiedBy',
  identificationDate: 'identificationDate',
  severityId: 'severityId',
  likelihoodId: 'likelihoodId',
  riskLevelId: 'riskLevelId',
  currentControls: 'currentControls',
  proposedActions: 'proposedActions',
  suggestedActions: 'suggestedActions',
  responsiblePersonOrUnit: 'responsiblePersonOrUnit',
  coordinatingUnits: 'coordinatingUnits',
  dueDate: 'dueDate',
  status: 'status',
  closureDetails: 'closureDetails',
  verificationDetails: 'verificationDetails',
  attachments: 'attachments',
  linkedDnfId: 'linkedDnfId',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  deletedAt: 'deletedAt',
  statusHistory: 'statusHistory'
};

exports.Prisma.ImprovementScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  status: 'status',
  submittedBy: 'submittedBy',
  createdById: 'createdById',
  submissionDate: 'submissionDate',
  updatedAt: 'updatedAt',
  benefitAnalysis: 'benefitAnalysis',
  estimatedCost: 'estimatedCost',
  attachments: 'attachments'
};

exports.Prisma.SystemStateScalarFieldEnum = {
  id: 'id',
  lastSchedulerRun: 'lastSchedulerRun',
  aiModelConfig: 'aiModelConfig'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  SystemLog: 'SystemLog',
  ResponsibleUnit: 'ResponsibleUnit',
  Subsystem: 'Subsystem',
  PatrolLocation: 'PatrolLocation',
  Comment: 'Comment',
  Notification: 'Notification',
  MaintenanceStandard: 'MaintenanceStandard',
  MaintenanceStandardItem: 'MaintenanceStandardItem',
  InspectionDetail: 'InspectionDetail',
  DnfDocument: 'DnfDocument',
  CorrectiveAction: 'CorrectiveAction',
  HazardRecord: 'HazardRecord',
  Improvement: 'Improvement',
  SystemState: 'SystemState'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
