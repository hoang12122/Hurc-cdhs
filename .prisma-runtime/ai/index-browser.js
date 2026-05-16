
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

exports.Prisma.AiAgentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  subsystem: 'subsystem',
  systemPrompt: 'systemPrompt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AiKnowledgeSnippetScalarFieldEnum = {
  id: 'id',
  content: 'content',
  source: 'source',
  tags: 'tags',
  createdAt: 'createdAt',
  agentId: 'agentId'
};

exports.Prisma.AiConversationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  userId: 'userId',
  agentId: 'agentId',
  state: 'state',
  mode: 'mode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AiConversationMessageScalarFieldEnum = {
  id: 'id',
  conversationId: 'conversationId',
  role: 'role',
  content: 'content',
  source: 'source',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.AiInsightScalarFieldEnum = {
  id: 'id',
  category: 'category',
  title: 'title',
  content: 'content',
  severity: 'severity',
  source: 'source',
  metadata: 'metadata',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.AiSyncLogScalarFieldEnum = {
  id: 'id',
  syncType: 'syncType',
  recordsSynced: 'recordsSynced',
  recordsFailed: 'recordsFailed',
  status: 'status',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt'
};

exports.Prisma.AiVerificationLogScalarFieldEnum = {
  id: 'id',
  targetId: 'targetId',
  targetType: 'targetType',
  targetDisplayCode: 'targetDisplayCode',
  targetVersion: 'targetVersion',
  sourceModule: 'sourceModule',
  aiProposedContent: 'aiProposedContent',
  finalContent: 'finalContent',
  status: 'status',
  riskLevel: 'riskLevel',
  requiredRole: 'requiredRole',
  verifiedBy: 'verifiedBy',
  verifiedAt: 'verifiedAt',
  modelVersion: 'modelVersion',
  isOrphan: 'isOrphan',
  createdAt: 'createdAt'
};

exports.Prisma.AiSafetyLogScalarFieldEnum = {
  id: 'id',
  timestamp: 'timestamp',
  eventId: 'eventId',
  userId: 'userId',
  targetType: 'targetType',
  targetId: 'targetId',
  action: 'action',
  riskLevel: 'riskLevel',
  details: 'details',
  isImmutable: 'isImmutable',
  isOrphan: 'isOrphan'
};

exports.Prisma.AiRequestLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  targetType: 'targetType',
  targetId: 'targetId',
  modelName: 'modelName',
  promptTokens: 'promptTokens',
  completionTokens: 'completionTokens',
  latencyMs: 'latencyMs',
  status: 'status',
  error: 'error',
  isOrphan: 'isOrphan',
  createdAt: 'createdAt'
};

exports.Prisma.TrustGraphNodeScalarFieldEnum = {
  id: 'id',
  sourceType: 'sourceType',
  sourceId: 'sourceId',
  sourceVersion: 'sourceVersion',
  label: 'label',
  metadata: 'metadata',
  riskScore: 'riskScore',
  riskLevel: 'riskLevel',
  lastRiskUpdate: 'lastRiskUpdate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TrustGraphEdgeScalarFieldEnum = {
  id: 'id',
  fromNodeId: 'fromNodeId',
  toNodeId: 'toNodeId',
  relationType: 'relationType',
  sourceType: 'sourceType',
  sourceId: 'sourceId',
  confidence: 'confidence',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.TrustGraphSyncLogScalarFieldEnum = {
  id: 'id',
  sourceType: 'sourceType',
  sourceId: 'sourceId',
  status: 'status',
  retryCount: 'retryCount',
  lastError: 'lastError',
  lastSyncedAt: 'lastSyncedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditConsistencyCheckLogScalarFieldEnum = {
  id: 'id',
  checkType: 'checkType',
  targetType: 'targetType',
  targetId: 'targetId',
  issueDetails: 'issueDetails',
  severity: 'severity',
  status: 'status',
  jobId: 'jobId',
  handlerId: 'handlerId',
  handledAt: 'handledAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GraphConsistencyLogScalarFieldEnum = {
  id: 'id',
  nodeOrEdgeId: 'nodeOrEdgeId',
  sourceType: 'sourceType',
  sourceId: 'sourceId',
  issueType: 'issueType',
  expectedVersion: 'expectedVersion',
  actualVersion: 'actualVersion',
  details: 'details',
  status: 'status',
  jobId: 'jobId',
  handlerId: 'handlerId',
  handledAt: 'handledAt',
  createdAt: 'createdAt'
};

exports.Prisma.IntegrityJobLogScalarFieldEnum = {
  id: 'id',
  jobType: 'jobType',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  totalRecordsChecked: 'totalRecordsChecked',
  totalIssuesFound: 'totalIssuesFound',
  status: 'status',
  reportSummary: 'reportSummary'
};

exports.Prisma.AiRiskReportScalarFieldEnum = {
  id: 'id',
  reportType: 'reportType',
  targetId: 'targetId',
  title: 'title',
  content: 'content',
  confidence: 'confidence',
  status: 'status',
  reviewedBy: 'reviewedBy',
  aiModel: 'aiModel',
  promptVersion: 'promptVersion',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AiReportAuditScalarFieldEnum = {
  id: 'id',
  reportId: 'reportId',
  reviewerId: 'reviewerId',
  action: 'action',
  previousContent: 'previousContent',
  newContent: 'newContent',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.PredictiveAlertScalarFieldEnum = {
  id: 'id',
  targetId: 'targetId',
  probability: 'probability',
  recommendation: 'recommendation',
  reasoning: 'reasoning',
  status: 'status',
  reviewedBy: 'reviewedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RiskScoreHistoryScalarFieldEnum = {
  id: 'id',
  nodeId: 'nodeId',
  score: 'score',
  level: 'level',
  factors: 'factors',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
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
  AiAgent: 'AiAgent',
  AiKnowledgeSnippet: 'AiKnowledgeSnippet',
  AiConversation: 'AiConversation',
  AiConversationMessage: 'AiConversationMessage',
  AiInsight: 'AiInsight',
  AiSyncLog: 'AiSyncLog',
  AiVerificationLog: 'AiVerificationLog',
  AiSafetyLog: 'AiSafetyLog',
  AiRequestLog: 'AiRequestLog',
  TrustGraphNode: 'TrustGraphNode',
  TrustGraphEdge: 'TrustGraphEdge',
  TrustGraphSyncLog: 'TrustGraphSyncLog',
  AuditConsistencyCheckLog: 'AuditConsistencyCheckLog',
  GraphConsistencyLog: 'GraphConsistencyLog',
  IntegrityJobLog: 'IntegrityJobLog',
  AiRiskReport: 'AiRiskReport',
  AiReportAudit: 'AiReportAudit',
  PredictiveAlert: 'PredictiveAlert',
  RiskScoreHistory: 'RiskScoreHistory'
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
