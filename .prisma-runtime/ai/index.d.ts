
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AiAgent
 * 
 */
export type AiAgent = $Result.DefaultSelection<Prisma.$AiAgentPayload>
/**
 * Model AiKnowledgeSnippet
 * 
 */
export type AiKnowledgeSnippet = $Result.DefaultSelection<Prisma.$AiKnowledgeSnippetPayload>
/**
 * Model AiConversation
 * 
 */
export type AiConversation = $Result.DefaultSelection<Prisma.$AiConversationPayload>
/**
 * Model AiConversationMessage
 * 
 */
export type AiConversationMessage = $Result.DefaultSelection<Prisma.$AiConversationMessagePayload>
/**
 * Model AiInsight
 * 
 */
export type AiInsight = $Result.DefaultSelection<Prisma.$AiInsightPayload>
/**
 * Model AiSyncLog
 * 
 */
export type AiSyncLog = $Result.DefaultSelection<Prisma.$AiSyncLogPayload>
/**
 * Model AiVerificationLog
 * 
 */
export type AiVerificationLog = $Result.DefaultSelection<Prisma.$AiVerificationLogPayload>
/**
 * Model AiSafetyLog
 * 
 */
export type AiSafetyLog = $Result.DefaultSelection<Prisma.$AiSafetyLogPayload>
/**
 * Model AiRequestLog
 * 
 */
export type AiRequestLog = $Result.DefaultSelection<Prisma.$AiRequestLogPayload>
/**
 * Model TrustGraphNode
 * 
 */
export type TrustGraphNode = $Result.DefaultSelection<Prisma.$TrustGraphNodePayload>
/**
 * Model TrustGraphEdge
 * 
 */
export type TrustGraphEdge = $Result.DefaultSelection<Prisma.$TrustGraphEdgePayload>
/**
 * Model TrustGraphSyncLog
 * 
 */
export type TrustGraphSyncLog = $Result.DefaultSelection<Prisma.$TrustGraphSyncLogPayload>
/**
 * Model AuditConsistencyCheckLog
 * 
 */
export type AuditConsistencyCheckLog = $Result.DefaultSelection<Prisma.$AuditConsistencyCheckLogPayload>
/**
 * Model GraphConsistencyLog
 * 
 */
export type GraphConsistencyLog = $Result.DefaultSelection<Prisma.$GraphConsistencyLogPayload>
/**
 * Model IntegrityJobLog
 * 
 */
export type IntegrityJobLog = $Result.DefaultSelection<Prisma.$IntegrityJobLogPayload>
/**
 * Model AiRiskReport
 * 
 */
export type AiRiskReport = $Result.DefaultSelection<Prisma.$AiRiskReportPayload>
/**
 * Model AiReportAudit
 * 
 */
export type AiReportAudit = $Result.DefaultSelection<Prisma.$AiReportAuditPayload>
/**
 * Model PredictiveAlert
 * 
 */
export type PredictiveAlert = $Result.DefaultSelection<Prisma.$PredictiveAlertPayload>
/**
 * Model RiskScoreHistory
 * 
 */
export type RiskScoreHistory = $Result.DefaultSelection<Prisma.$RiskScoreHistoryPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AiAgents
 * const aiAgents = await prisma.aiAgent.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more AiAgents
   * const aiAgents = await prisma.aiAgent.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.aiAgent`: Exposes CRUD operations for the **AiAgent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiAgents
    * const aiAgents = await prisma.aiAgent.findMany()
    * ```
    */
  get aiAgent(): Prisma.AiAgentDelegate<ExtArgs>;

  /**
   * `prisma.aiKnowledgeSnippet`: Exposes CRUD operations for the **AiKnowledgeSnippet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiKnowledgeSnippets
    * const aiKnowledgeSnippets = await prisma.aiKnowledgeSnippet.findMany()
    * ```
    */
  get aiKnowledgeSnippet(): Prisma.AiKnowledgeSnippetDelegate<ExtArgs>;

  /**
   * `prisma.aiConversation`: Exposes CRUD operations for the **AiConversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiConversations
    * const aiConversations = await prisma.aiConversation.findMany()
    * ```
    */
  get aiConversation(): Prisma.AiConversationDelegate<ExtArgs>;

  /**
   * `prisma.aiConversationMessage`: Exposes CRUD operations for the **AiConversationMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiConversationMessages
    * const aiConversationMessages = await prisma.aiConversationMessage.findMany()
    * ```
    */
  get aiConversationMessage(): Prisma.AiConversationMessageDelegate<ExtArgs>;

  /**
   * `prisma.aiInsight`: Exposes CRUD operations for the **AiInsight** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiInsights
    * const aiInsights = await prisma.aiInsight.findMany()
    * ```
    */
  get aiInsight(): Prisma.AiInsightDelegate<ExtArgs>;

  /**
   * `prisma.aiSyncLog`: Exposes CRUD operations for the **AiSyncLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiSyncLogs
    * const aiSyncLogs = await prisma.aiSyncLog.findMany()
    * ```
    */
  get aiSyncLog(): Prisma.AiSyncLogDelegate<ExtArgs>;

  /**
   * `prisma.aiVerificationLog`: Exposes CRUD operations for the **AiVerificationLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiVerificationLogs
    * const aiVerificationLogs = await prisma.aiVerificationLog.findMany()
    * ```
    */
  get aiVerificationLog(): Prisma.AiVerificationLogDelegate<ExtArgs>;

  /**
   * `prisma.aiSafetyLog`: Exposes CRUD operations for the **AiSafetyLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiSafetyLogs
    * const aiSafetyLogs = await prisma.aiSafetyLog.findMany()
    * ```
    */
  get aiSafetyLog(): Prisma.AiSafetyLogDelegate<ExtArgs>;

  /**
   * `prisma.aiRequestLog`: Exposes CRUD operations for the **AiRequestLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiRequestLogs
    * const aiRequestLogs = await prisma.aiRequestLog.findMany()
    * ```
    */
  get aiRequestLog(): Prisma.AiRequestLogDelegate<ExtArgs>;

  /**
   * `prisma.trustGraphNode`: Exposes CRUD operations for the **TrustGraphNode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrustGraphNodes
    * const trustGraphNodes = await prisma.trustGraphNode.findMany()
    * ```
    */
  get trustGraphNode(): Prisma.TrustGraphNodeDelegate<ExtArgs>;

  /**
   * `prisma.trustGraphEdge`: Exposes CRUD operations for the **TrustGraphEdge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrustGraphEdges
    * const trustGraphEdges = await prisma.trustGraphEdge.findMany()
    * ```
    */
  get trustGraphEdge(): Prisma.TrustGraphEdgeDelegate<ExtArgs>;

  /**
   * `prisma.trustGraphSyncLog`: Exposes CRUD operations for the **TrustGraphSyncLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrustGraphSyncLogs
    * const trustGraphSyncLogs = await prisma.trustGraphSyncLog.findMany()
    * ```
    */
  get trustGraphSyncLog(): Prisma.TrustGraphSyncLogDelegate<ExtArgs>;

  /**
   * `prisma.auditConsistencyCheckLog`: Exposes CRUD operations for the **AuditConsistencyCheckLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditConsistencyCheckLogs
    * const auditConsistencyCheckLogs = await prisma.auditConsistencyCheckLog.findMany()
    * ```
    */
  get auditConsistencyCheckLog(): Prisma.AuditConsistencyCheckLogDelegate<ExtArgs>;

  /**
   * `prisma.graphConsistencyLog`: Exposes CRUD operations for the **GraphConsistencyLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GraphConsistencyLogs
    * const graphConsistencyLogs = await prisma.graphConsistencyLog.findMany()
    * ```
    */
  get graphConsistencyLog(): Prisma.GraphConsistencyLogDelegate<ExtArgs>;

  /**
   * `prisma.integrityJobLog`: Exposes CRUD operations for the **IntegrityJobLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IntegrityJobLogs
    * const integrityJobLogs = await prisma.integrityJobLog.findMany()
    * ```
    */
  get integrityJobLog(): Prisma.IntegrityJobLogDelegate<ExtArgs>;

  /**
   * `prisma.aiRiskReport`: Exposes CRUD operations for the **AiRiskReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiRiskReports
    * const aiRiskReports = await prisma.aiRiskReport.findMany()
    * ```
    */
  get aiRiskReport(): Prisma.AiRiskReportDelegate<ExtArgs>;

  /**
   * `prisma.aiReportAudit`: Exposes CRUD operations for the **AiReportAudit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiReportAudits
    * const aiReportAudits = await prisma.aiReportAudit.findMany()
    * ```
    */
  get aiReportAudit(): Prisma.AiReportAuditDelegate<ExtArgs>;

  /**
   * `prisma.predictiveAlert`: Exposes CRUD operations for the **PredictiveAlert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PredictiveAlerts
    * const predictiveAlerts = await prisma.predictiveAlert.findMany()
    * ```
    */
  get predictiveAlert(): Prisma.PredictiveAlertDelegate<ExtArgs>;

  /**
   * `prisma.riskScoreHistory`: Exposes CRUD operations for the **RiskScoreHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RiskScoreHistories
    * const riskScoreHistories = await prisma.riskScoreHistory.findMany()
    * ```
    */
  get riskScoreHistory(): Prisma.RiskScoreHistoryDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "aiAgent" | "aiKnowledgeSnippet" | "aiConversation" | "aiConversationMessage" | "aiInsight" | "aiSyncLog" | "aiVerificationLog" | "aiSafetyLog" | "aiRequestLog" | "trustGraphNode" | "trustGraphEdge" | "trustGraphSyncLog" | "auditConsistencyCheckLog" | "graphConsistencyLog" | "integrityJobLog" | "aiRiskReport" | "aiReportAudit" | "predictiveAlert" | "riskScoreHistory"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AiAgent: {
        payload: Prisma.$AiAgentPayload<ExtArgs>
        fields: Prisma.AiAgentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiAgentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiAgentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload>
          }
          findFirst: {
            args: Prisma.AiAgentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiAgentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload>
          }
          findMany: {
            args: Prisma.AiAgentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload>[]
          }
          create: {
            args: Prisma.AiAgentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload>
          }
          createMany: {
            args: Prisma.AiAgentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiAgentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload>[]
          }
          delete: {
            args: Prisma.AiAgentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload>
          }
          update: {
            args: Prisma.AiAgentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload>
          }
          deleteMany: {
            args: Prisma.AiAgentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiAgentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiAgentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiAgentPayload>
          }
          aggregate: {
            args: Prisma.AiAgentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiAgent>
          }
          groupBy: {
            args: Prisma.AiAgentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiAgentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiAgentCountArgs<ExtArgs>
            result: $Utils.Optional<AiAgentCountAggregateOutputType> | number
          }
        }
      }
      AiKnowledgeSnippet: {
        payload: Prisma.$AiKnowledgeSnippetPayload<ExtArgs>
        fields: Prisma.AiKnowledgeSnippetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiKnowledgeSnippetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiKnowledgeSnippetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload>
          }
          findFirst: {
            args: Prisma.AiKnowledgeSnippetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiKnowledgeSnippetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload>
          }
          findMany: {
            args: Prisma.AiKnowledgeSnippetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload>[]
          }
          create: {
            args: Prisma.AiKnowledgeSnippetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload>
          }
          createMany: {
            args: Prisma.AiKnowledgeSnippetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiKnowledgeSnippetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload>[]
          }
          delete: {
            args: Prisma.AiKnowledgeSnippetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload>
          }
          update: {
            args: Prisma.AiKnowledgeSnippetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload>
          }
          deleteMany: {
            args: Prisma.AiKnowledgeSnippetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiKnowledgeSnippetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiKnowledgeSnippetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiKnowledgeSnippetPayload>
          }
          aggregate: {
            args: Prisma.AiKnowledgeSnippetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiKnowledgeSnippet>
          }
          groupBy: {
            args: Prisma.AiKnowledgeSnippetGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiKnowledgeSnippetGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiKnowledgeSnippetCountArgs<ExtArgs>
            result: $Utils.Optional<AiKnowledgeSnippetCountAggregateOutputType> | number
          }
        }
      }
      AiConversation: {
        payload: Prisma.$AiConversationPayload<ExtArgs>
        fields: Prisma.AiConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          findFirst: {
            args: Prisma.AiConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          findMany: {
            args: Prisma.AiConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>[]
          }
          create: {
            args: Prisma.AiConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          createMany: {
            args: Prisma.AiConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>[]
          }
          delete: {
            args: Prisma.AiConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          update: {
            args: Prisma.AiConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          deleteMany: {
            args: Prisma.AiConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          aggregate: {
            args: Prisma.AiConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiConversation>
          }
          groupBy: {
            args: Prisma.AiConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiConversationCountArgs<ExtArgs>
            result: $Utils.Optional<AiConversationCountAggregateOutputType> | number
          }
        }
      }
      AiConversationMessage: {
        payload: Prisma.$AiConversationMessagePayload<ExtArgs>
        fields: Prisma.AiConversationMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiConversationMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiConversationMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload>
          }
          findFirst: {
            args: Prisma.AiConversationMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiConversationMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload>
          }
          findMany: {
            args: Prisma.AiConversationMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload>[]
          }
          create: {
            args: Prisma.AiConversationMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload>
          }
          createMany: {
            args: Prisma.AiConversationMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiConversationMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload>[]
          }
          delete: {
            args: Prisma.AiConversationMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload>
          }
          update: {
            args: Prisma.AiConversationMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload>
          }
          deleteMany: {
            args: Prisma.AiConversationMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiConversationMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiConversationMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationMessagePayload>
          }
          aggregate: {
            args: Prisma.AiConversationMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiConversationMessage>
          }
          groupBy: {
            args: Prisma.AiConversationMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiConversationMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiConversationMessageCountArgs<ExtArgs>
            result: $Utils.Optional<AiConversationMessageCountAggregateOutputType> | number
          }
        }
      }
      AiInsight: {
        payload: Prisma.$AiInsightPayload<ExtArgs>
        fields: Prisma.AiInsightFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiInsightFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiInsightFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload>
          }
          findFirst: {
            args: Prisma.AiInsightFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiInsightFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload>
          }
          findMany: {
            args: Prisma.AiInsightFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload>[]
          }
          create: {
            args: Prisma.AiInsightCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload>
          }
          createMany: {
            args: Prisma.AiInsightCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiInsightCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload>[]
          }
          delete: {
            args: Prisma.AiInsightDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload>
          }
          update: {
            args: Prisma.AiInsightUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload>
          }
          deleteMany: {
            args: Prisma.AiInsightDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiInsightUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiInsightUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiInsightPayload>
          }
          aggregate: {
            args: Prisma.AiInsightAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiInsight>
          }
          groupBy: {
            args: Prisma.AiInsightGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiInsightGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiInsightCountArgs<ExtArgs>
            result: $Utils.Optional<AiInsightCountAggregateOutputType> | number
          }
        }
      }
      AiSyncLog: {
        payload: Prisma.$AiSyncLogPayload<ExtArgs>
        fields: Prisma.AiSyncLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiSyncLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiSyncLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload>
          }
          findFirst: {
            args: Prisma.AiSyncLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiSyncLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload>
          }
          findMany: {
            args: Prisma.AiSyncLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload>[]
          }
          create: {
            args: Prisma.AiSyncLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload>
          }
          createMany: {
            args: Prisma.AiSyncLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiSyncLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload>[]
          }
          delete: {
            args: Prisma.AiSyncLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload>
          }
          update: {
            args: Prisma.AiSyncLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload>
          }
          deleteMany: {
            args: Prisma.AiSyncLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiSyncLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiSyncLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSyncLogPayload>
          }
          aggregate: {
            args: Prisma.AiSyncLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiSyncLog>
          }
          groupBy: {
            args: Prisma.AiSyncLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiSyncLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiSyncLogCountArgs<ExtArgs>
            result: $Utils.Optional<AiSyncLogCountAggregateOutputType> | number
          }
        }
      }
      AiVerificationLog: {
        payload: Prisma.$AiVerificationLogPayload<ExtArgs>
        fields: Prisma.AiVerificationLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiVerificationLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiVerificationLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload>
          }
          findFirst: {
            args: Prisma.AiVerificationLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiVerificationLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload>
          }
          findMany: {
            args: Prisma.AiVerificationLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload>[]
          }
          create: {
            args: Prisma.AiVerificationLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload>
          }
          createMany: {
            args: Prisma.AiVerificationLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiVerificationLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload>[]
          }
          delete: {
            args: Prisma.AiVerificationLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload>
          }
          update: {
            args: Prisma.AiVerificationLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload>
          }
          deleteMany: {
            args: Prisma.AiVerificationLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiVerificationLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiVerificationLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiVerificationLogPayload>
          }
          aggregate: {
            args: Prisma.AiVerificationLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiVerificationLog>
          }
          groupBy: {
            args: Prisma.AiVerificationLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiVerificationLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiVerificationLogCountArgs<ExtArgs>
            result: $Utils.Optional<AiVerificationLogCountAggregateOutputType> | number
          }
        }
      }
      AiSafetyLog: {
        payload: Prisma.$AiSafetyLogPayload<ExtArgs>
        fields: Prisma.AiSafetyLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiSafetyLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiSafetyLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload>
          }
          findFirst: {
            args: Prisma.AiSafetyLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiSafetyLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload>
          }
          findMany: {
            args: Prisma.AiSafetyLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload>[]
          }
          create: {
            args: Prisma.AiSafetyLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload>
          }
          createMany: {
            args: Prisma.AiSafetyLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiSafetyLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload>[]
          }
          delete: {
            args: Prisma.AiSafetyLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload>
          }
          update: {
            args: Prisma.AiSafetyLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload>
          }
          deleteMany: {
            args: Prisma.AiSafetyLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiSafetyLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiSafetyLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSafetyLogPayload>
          }
          aggregate: {
            args: Prisma.AiSafetyLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiSafetyLog>
          }
          groupBy: {
            args: Prisma.AiSafetyLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiSafetyLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiSafetyLogCountArgs<ExtArgs>
            result: $Utils.Optional<AiSafetyLogCountAggregateOutputType> | number
          }
        }
      }
      AiRequestLog: {
        payload: Prisma.$AiRequestLogPayload<ExtArgs>
        fields: Prisma.AiRequestLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiRequestLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiRequestLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload>
          }
          findFirst: {
            args: Prisma.AiRequestLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiRequestLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload>
          }
          findMany: {
            args: Prisma.AiRequestLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload>[]
          }
          create: {
            args: Prisma.AiRequestLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload>
          }
          createMany: {
            args: Prisma.AiRequestLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiRequestLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload>[]
          }
          delete: {
            args: Prisma.AiRequestLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload>
          }
          update: {
            args: Prisma.AiRequestLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload>
          }
          deleteMany: {
            args: Prisma.AiRequestLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiRequestLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiRequestLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRequestLogPayload>
          }
          aggregate: {
            args: Prisma.AiRequestLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiRequestLog>
          }
          groupBy: {
            args: Prisma.AiRequestLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiRequestLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiRequestLogCountArgs<ExtArgs>
            result: $Utils.Optional<AiRequestLogCountAggregateOutputType> | number
          }
        }
      }
      TrustGraphNode: {
        payload: Prisma.$TrustGraphNodePayload<ExtArgs>
        fields: Prisma.TrustGraphNodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrustGraphNodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrustGraphNodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload>
          }
          findFirst: {
            args: Prisma.TrustGraphNodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrustGraphNodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload>
          }
          findMany: {
            args: Prisma.TrustGraphNodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload>[]
          }
          create: {
            args: Prisma.TrustGraphNodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload>
          }
          createMany: {
            args: Prisma.TrustGraphNodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrustGraphNodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload>[]
          }
          delete: {
            args: Prisma.TrustGraphNodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload>
          }
          update: {
            args: Prisma.TrustGraphNodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload>
          }
          deleteMany: {
            args: Prisma.TrustGraphNodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrustGraphNodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrustGraphNodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphNodePayload>
          }
          aggregate: {
            args: Prisma.TrustGraphNodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrustGraphNode>
          }
          groupBy: {
            args: Prisma.TrustGraphNodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrustGraphNodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrustGraphNodeCountArgs<ExtArgs>
            result: $Utils.Optional<TrustGraphNodeCountAggregateOutputType> | number
          }
        }
      }
      TrustGraphEdge: {
        payload: Prisma.$TrustGraphEdgePayload<ExtArgs>
        fields: Prisma.TrustGraphEdgeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrustGraphEdgeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrustGraphEdgeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload>
          }
          findFirst: {
            args: Prisma.TrustGraphEdgeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrustGraphEdgeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload>
          }
          findMany: {
            args: Prisma.TrustGraphEdgeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload>[]
          }
          create: {
            args: Prisma.TrustGraphEdgeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload>
          }
          createMany: {
            args: Prisma.TrustGraphEdgeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrustGraphEdgeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload>[]
          }
          delete: {
            args: Prisma.TrustGraphEdgeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload>
          }
          update: {
            args: Prisma.TrustGraphEdgeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload>
          }
          deleteMany: {
            args: Prisma.TrustGraphEdgeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrustGraphEdgeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrustGraphEdgeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphEdgePayload>
          }
          aggregate: {
            args: Prisma.TrustGraphEdgeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrustGraphEdge>
          }
          groupBy: {
            args: Prisma.TrustGraphEdgeGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrustGraphEdgeGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrustGraphEdgeCountArgs<ExtArgs>
            result: $Utils.Optional<TrustGraphEdgeCountAggregateOutputType> | number
          }
        }
      }
      TrustGraphSyncLog: {
        payload: Prisma.$TrustGraphSyncLogPayload<ExtArgs>
        fields: Prisma.TrustGraphSyncLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrustGraphSyncLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrustGraphSyncLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload>
          }
          findFirst: {
            args: Prisma.TrustGraphSyncLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrustGraphSyncLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload>
          }
          findMany: {
            args: Prisma.TrustGraphSyncLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload>[]
          }
          create: {
            args: Prisma.TrustGraphSyncLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload>
          }
          createMany: {
            args: Prisma.TrustGraphSyncLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrustGraphSyncLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload>[]
          }
          delete: {
            args: Prisma.TrustGraphSyncLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload>
          }
          update: {
            args: Prisma.TrustGraphSyncLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload>
          }
          deleteMany: {
            args: Prisma.TrustGraphSyncLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrustGraphSyncLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrustGraphSyncLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustGraphSyncLogPayload>
          }
          aggregate: {
            args: Prisma.TrustGraphSyncLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrustGraphSyncLog>
          }
          groupBy: {
            args: Prisma.TrustGraphSyncLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrustGraphSyncLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrustGraphSyncLogCountArgs<ExtArgs>
            result: $Utils.Optional<TrustGraphSyncLogCountAggregateOutputType> | number
          }
        }
      }
      AuditConsistencyCheckLog: {
        payload: Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>
        fields: Prisma.AuditConsistencyCheckLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditConsistencyCheckLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditConsistencyCheckLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload>
          }
          findFirst: {
            args: Prisma.AuditConsistencyCheckLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditConsistencyCheckLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload>
          }
          findMany: {
            args: Prisma.AuditConsistencyCheckLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload>[]
          }
          create: {
            args: Prisma.AuditConsistencyCheckLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload>
          }
          createMany: {
            args: Prisma.AuditConsistencyCheckLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditConsistencyCheckLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload>[]
          }
          delete: {
            args: Prisma.AuditConsistencyCheckLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload>
          }
          update: {
            args: Prisma.AuditConsistencyCheckLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditConsistencyCheckLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditConsistencyCheckLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditConsistencyCheckLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditConsistencyCheckLogPayload>
          }
          aggregate: {
            args: Prisma.AuditConsistencyCheckLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditConsistencyCheckLog>
          }
          groupBy: {
            args: Prisma.AuditConsistencyCheckLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditConsistencyCheckLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditConsistencyCheckLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditConsistencyCheckLogCountAggregateOutputType> | number
          }
        }
      }
      GraphConsistencyLog: {
        payload: Prisma.$GraphConsistencyLogPayload<ExtArgs>
        fields: Prisma.GraphConsistencyLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GraphConsistencyLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GraphConsistencyLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload>
          }
          findFirst: {
            args: Prisma.GraphConsistencyLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GraphConsistencyLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload>
          }
          findMany: {
            args: Prisma.GraphConsistencyLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload>[]
          }
          create: {
            args: Prisma.GraphConsistencyLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload>
          }
          createMany: {
            args: Prisma.GraphConsistencyLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GraphConsistencyLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload>[]
          }
          delete: {
            args: Prisma.GraphConsistencyLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload>
          }
          update: {
            args: Prisma.GraphConsistencyLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload>
          }
          deleteMany: {
            args: Prisma.GraphConsistencyLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GraphConsistencyLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GraphConsistencyLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraphConsistencyLogPayload>
          }
          aggregate: {
            args: Prisma.GraphConsistencyLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGraphConsistencyLog>
          }
          groupBy: {
            args: Prisma.GraphConsistencyLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<GraphConsistencyLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.GraphConsistencyLogCountArgs<ExtArgs>
            result: $Utils.Optional<GraphConsistencyLogCountAggregateOutputType> | number
          }
        }
      }
      IntegrityJobLog: {
        payload: Prisma.$IntegrityJobLogPayload<ExtArgs>
        fields: Prisma.IntegrityJobLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IntegrityJobLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IntegrityJobLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload>
          }
          findFirst: {
            args: Prisma.IntegrityJobLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IntegrityJobLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload>
          }
          findMany: {
            args: Prisma.IntegrityJobLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload>[]
          }
          create: {
            args: Prisma.IntegrityJobLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload>
          }
          createMany: {
            args: Prisma.IntegrityJobLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IntegrityJobLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload>[]
          }
          delete: {
            args: Prisma.IntegrityJobLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload>
          }
          update: {
            args: Prisma.IntegrityJobLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload>
          }
          deleteMany: {
            args: Prisma.IntegrityJobLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IntegrityJobLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IntegrityJobLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityJobLogPayload>
          }
          aggregate: {
            args: Prisma.IntegrityJobLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIntegrityJobLog>
          }
          groupBy: {
            args: Prisma.IntegrityJobLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<IntegrityJobLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.IntegrityJobLogCountArgs<ExtArgs>
            result: $Utils.Optional<IntegrityJobLogCountAggregateOutputType> | number
          }
        }
      }
      AiRiskReport: {
        payload: Prisma.$AiRiskReportPayload<ExtArgs>
        fields: Prisma.AiRiskReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiRiskReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiRiskReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload>
          }
          findFirst: {
            args: Prisma.AiRiskReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiRiskReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload>
          }
          findMany: {
            args: Prisma.AiRiskReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload>[]
          }
          create: {
            args: Prisma.AiRiskReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload>
          }
          createMany: {
            args: Prisma.AiRiskReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiRiskReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload>[]
          }
          delete: {
            args: Prisma.AiRiskReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload>
          }
          update: {
            args: Prisma.AiRiskReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload>
          }
          deleteMany: {
            args: Prisma.AiRiskReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiRiskReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiRiskReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiRiskReportPayload>
          }
          aggregate: {
            args: Prisma.AiRiskReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiRiskReport>
          }
          groupBy: {
            args: Prisma.AiRiskReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiRiskReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiRiskReportCountArgs<ExtArgs>
            result: $Utils.Optional<AiRiskReportCountAggregateOutputType> | number
          }
        }
      }
      AiReportAudit: {
        payload: Prisma.$AiReportAuditPayload<ExtArgs>
        fields: Prisma.AiReportAuditFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiReportAuditFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiReportAuditFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload>
          }
          findFirst: {
            args: Prisma.AiReportAuditFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiReportAuditFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload>
          }
          findMany: {
            args: Prisma.AiReportAuditFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload>[]
          }
          create: {
            args: Prisma.AiReportAuditCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload>
          }
          createMany: {
            args: Prisma.AiReportAuditCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiReportAuditCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload>[]
          }
          delete: {
            args: Prisma.AiReportAuditDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload>
          }
          update: {
            args: Prisma.AiReportAuditUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload>
          }
          deleteMany: {
            args: Prisma.AiReportAuditDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiReportAuditUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiReportAuditUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiReportAuditPayload>
          }
          aggregate: {
            args: Prisma.AiReportAuditAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiReportAudit>
          }
          groupBy: {
            args: Prisma.AiReportAuditGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiReportAuditGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiReportAuditCountArgs<ExtArgs>
            result: $Utils.Optional<AiReportAuditCountAggregateOutputType> | number
          }
        }
      }
      PredictiveAlert: {
        payload: Prisma.$PredictiveAlertPayload<ExtArgs>
        fields: Prisma.PredictiveAlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PredictiveAlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PredictiveAlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload>
          }
          findFirst: {
            args: Prisma.PredictiveAlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PredictiveAlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload>
          }
          findMany: {
            args: Prisma.PredictiveAlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload>[]
          }
          create: {
            args: Prisma.PredictiveAlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload>
          }
          createMany: {
            args: Prisma.PredictiveAlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PredictiveAlertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload>[]
          }
          delete: {
            args: Prisma.PredictiveAlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload>
          }
          update: {
            args: Prisma.PredictiveAlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload>
          }
          deleteMany: {
            args: Prisma.PredictiveAlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PredictiveAlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PredictiveAlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictiveAlertPayload>
          }
          aggregate: {
            args: Prisma.PredictiveAlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePredictiveAlert>
          }
          groupBy: {
            args: Prisma.PredictiveAlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<PredictiveAlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.PredictiveAlertCountArgs<ExtArgs>
            result: $Utils.Optional<PredictiveAlertCountAggregateOutputType> | number
          }
        }
      }
      RiskScoreHistory: {
        payload: Prisma.$RiskScoreHistoryPayload<ExtArgs>
        fields: Prisma.RiskScoreHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RiskScoreHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RiskScoreHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload>
          }
          findFirst: {
            args: Prisma.RiskScoreHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RiskScoreHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload>
          }
          findMany: {
            args: Prisma.RiskScoreHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload>[]
          }
          create: {
            args: Prisma.RiskScoreHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload>
          }
          createMany: {
            args: Prisma.RiskScoreHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RiskScoreHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload>[]
          }
          delete: {
            args: Prisma.RiskScoreHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload>
          }
          update: {
            args: Prisma.RiskScoreHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload>
          }
          deleteMany: {
            args: Prisma.RiskScoreHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RiskScoreHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RiskScoreHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskScoreHistoryPayload>
          }
          aggregate: {
            args: Prisma.RiskScoreHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRiskScoreHistory>
          }
          groupBy: {
            args: Prisma.RiskScoreHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<RiskScoreHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.RiskScoreHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<RiskScoreHistoryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AiConversationCountOutputType
   */

  export type AiConversationCountOutputType = {
    messages: number
  }

  export type AiConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | AiConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * AiConversationCountOutputType without action
   */
  export type AiConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationCountOutputType
     */
    select?: AiConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AiConversationCountOutputType without action
   */
  export type AiConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiConversationMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AiAgent
   */

  export type AggregateAiAgent = {
    _count: AiAgentCountAggregateOutputType | null
    _min: AiAgentMinAggregateOutputType | null
    _max: AiAgentMaxAggregateOutputType | null
  }

  export type AiAgentMinAggregateOutputType = {
    id: string | null
    name: string | null
    subsystem: string | null
    systemPrompt: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiAgentMaxAggregateOutputType = {
    id: string | null
    name: string | null
    subsystem: string | null
    systemPrompt: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiAgentCountAggregateOutputType = {
    id: number
    name: number
    subsystem: number
    systemPrompt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiAgentMinAggregateInputType = {
    id?: true
    name?: true
    subsystem?: true
    systemPrompt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiAgentMaxAggregateInputType = {
    id?: true
    name?: true
    subsystem?: true
    systemPrompt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiAgentCountAggregateInputType = {
    id?: true
    name?: true
    subsystem?: true
    systemPrompt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiAgentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiAgent to aggregate.
     */
    where?: AiAgentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiAgents to fetch.
     */
    orderBy?: AiAgentOrderByWithRelationInput | AiAgentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiAgentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiAgents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiAgents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiAgents
    **/
    _count?: true | AiAgentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiAgentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiAgentMaxAggregateInputType
  }

  export type GetAiAgentAggregateType<T extends AiAgentAggregateArgs> = {
        [P in keyof T & keyof AggregateAiAgent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiAgent[P]>
      : GetScalarType<T[P], AggregateAiAgent[P]>
  }




  export type AiAgentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiAgentWhereInput
    orderBy?: AiAgentOrderByWithAggregationInput | AiAgentOrderByWithAggregationInput[]
    by: AiAgentScalarFieldEnum[] | AiAgentScalarFieldEnum
    having?: AiAgentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiAgentCountAggregateInputType | true
    _min?: AiAgentMinAggregateInputType
    _max?: AiAgentMaxAggregateInputType
  }

  export type AiAgentGroupByOutputType = {
    id: string
    name: string
    subsystem: string
    systemPrompt: string
    createdAt: Date
    updatedAt: Date
    _count: AiAgentCountAggregateOutputType | null
    _min: AiAgentMinAggregateOutputType | null
    _max: AiAgentMaxAggregateOutputType | null
  }

  type GetAiAgentGroupByPayload<T extends AiAgentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiAgentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiAgentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiAgentGroupByOutputType[P]>
            : GetScalarType<T[P], AiAgentGroupByOutputType[P]>
        }
      >
    >


  export type AiAgentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    subsystem?: boolean
    systemPrompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiAgent"]>

  export type AiAgentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    subsystem?: boolean
    systemPrompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiAgent"]>

  export type AiAgentSelectScalar = {
    id?: boolean
    name?: boolean
    subsystem?: boolean
    systemPrompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $AiAgentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiAgent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      subsystem: string
      systemPrompt: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiAgent"]>
    composites: {}
  }

  type AiAgentGetPayload<S extends boolean | null | undefined | AiAgentDefaultArgs> = $Result.GetResult<Prisma.$AiAgentPayload, S>

  type AiAgentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiAgentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiAgentCountAggregateInputType | true
    }

  export interface AiAgentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiAgent'], meta: { name: 'AiAgent' } }
    /**
     * Find zero or one AiAgent that matches the filter.
     * @param {AiAgentFindUniqueArgs} args - Arguments to find a AiAgent
     * @example
     * // Get one AiAgent
     * const aiAgent = await prisma.aiAgent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiAgentFindUniqueArgs>(args: SelectSubset<T, AiAgentFindUniqueArgs<ExtArgs>>): Prisma__AiAgentClient<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiAgent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiAgentFindUniqueOrThrowArgs} args - Arguments to find a AiAgent
     * @example
     * // Get one AiAgent
     * const aiAgent = await prisma.aiAgent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiAgentFindUniqueOrThrowArgs>(args: SelectSubset<T, AiAgentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiAgentClient<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiAgent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiAgentFindFirstArgs} args - Arguments to find a AiAgent
     * @example
     * // Get one AiAgent
     * const aiAgent = await prisma.aiAgent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiAgentFindFirstArgs>(args?: SelectSubset<T, AiAgentFindFirstArgs<ExtArgs>>): Prisma__AiAgentClient<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiAgent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiAgentFindFirstOrThrowArgs} args - Arguments to find a AiAgent
     * @example
     * // Get one AiAgent
     * const aiAgent = await prisma.aiAgent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiAgentFindFirstOrThrowArgs>(args?: SelectSubset<T, AiAgentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiAgentClient<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiAgents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiAgentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiAgents
     * const aiAgents = await prisma.aiAgent.findMany()
     * 
     * // Get first 10 AiAgents
     * const aiAgents = await prisma.aiAgent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiAgentWithIdOnly = await prisma.aiAgent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiAgentFindManyArgs>(args?: SelectSubset<T, AiAgentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiAgent.
     * @param {AiAgentCreateArgs} args - Arguments to create a AiAgent.
     * @example
     * // Create one AiAgent
     * const AiAgent = await prisma.aiAgent.create({
     *   data: {
     *     // ... data to create a AiAgent
     *   }
     * })
     * 
     */
    create<T extends AiAgentCreateArgs>(args: SelectSubset<T, AiAgentCreateArgs<ExtArgs>>): Prisma__AiAgentClient<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiAgents.
     * @param {AiAgentCreateManyArgs} args - Arguments to create many AiAgents.
     * @example
     * // Create many AiAgents
     * const aiAgent = await prisma.aiAgent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiAgentCreateManyArgs>(args?: SelectSubset<T, AiAgentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiAgents and returns the data saved in the database.
     * @param {AiAgentCreateManyAndReturnArgs} args - Arguments to create many AiAgents.
     * @example
     * // Create many AiAgents
     * const aiAgent = await prisma.aiAgent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiAgents and only return the `id`
     * const aiAgentWithIdOnly = await prisma.aiAgent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiAgentCreateManyAndReturnArgs>(args?: SelectSubset<T, AiAgentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiAgent.
     * @param {AiAgentDeleteArgs} args - Arguments to delete one AiAgent.
     * @example
     * // Delete one AiAgent
     * const AiAgent = await prisma.aiAgent.delete({
     *   where: {
     *     // ... filter to delete one AiAgent
     *   }
     * })
     * 
     */
    delete<T extends AiAgentDeleteArgs>(args: SelectSubset<T, AiAgentDeleteArgs<ExtArgs>>): Prisma__AiAgentClient<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiAgent.
     * @param {AiAgentUpdateArgs} args - Arguments to update one AiAgent.
     * @example
     * // Update one AiAgent
     * const aiAgent = await prisma.aiAgent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiAgentUpdateArgs>(args: SelectSubset<T, AiAgentUpdateArgs<ExtArgs>>): Prisma__AiAgentClient<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiAgents.
     * @param {AiAgentDeleteManyArgs} args - Arguments to filter AiAgents to delete.
     * @example
     * // Delete a few AiAgents
     * const { count } = await prisma.aiAgent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiAgentDeleteManyArgs>(args?: SelectSubset<T, AiAgentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiAgents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiAgentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiAgents
     * const aiAgent = await prisma.aiAgent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiAgentUpdateManyArgs>(args: SelectSubset<T, AiAgentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiAgent.
     * @param {AiAgentUpsertArgs} args - Arguments to update or create a AiAgent.
     * @example
     * // Update or create a AiAgent
     * const aiAgent = await prisma.aiAgent.upsert({
     *   create: {
     *     // ... data to create a AiAgent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiAgent we want to update
     *   }
     * })
     */
    upsert<T extends AiAgentUpsertArgs>(args: SelectSubset<T, AiAgentUpsertArgs<ExtArgs>>): Prisma__AiAgentClient<$Result.GetResult<Prisma.$AiAgentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiAgents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiAgentCountArgs} args - Arguments to filter AiAgents to count.
     * @example
     * // Count the number of AiAgents
     * const count = await prisma.aiAgent.count({
     *   where: {
     *     // ... the filter for the AiAgents we want to count
     *   }
     * })
    **/
    count<T extends AiAgentCountArgs>(
      args?: Subset<T, AiAgentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiAgentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiAgent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiAgentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiAgentAggregateArgs>(args: Subset<T, AiAgentAggregateArgs>): Prisma.PrismaPromise<GetAiAgentAggregateType<T>>

    /**
     * Group by AiAgent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiAgentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiAgentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiAgentGroupByArgs['orderBy'] }
        : { orderBy?: AiAgentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiAgentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiAgentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiAgent model
   */
  readonly fields: AiAgentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiAgent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiAgentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiAgent model
   */ 
  interface AiAgentFieldRefs {
    readonly id: FieldRef<"AiAgent", 'String'>
    readonly name: FieldRef<"AiAgent", 'String'>
    readonly subsystem: FieldRef<"AiAgent", 'String'>
    readonly systemPrompt: FieldRef<"AiAgent", 'String'>
    readonly createdAt: FieldRef<"AiAgent", 'DateTime'>
    readonly updatedAt: FieldRef<"AiAgent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiAgent findUnique
   */
  export type AiAgentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
    /**
     * Filter, which AiAgent to fetch.
     */
    where: AiAgentWhereUniqueInput
  }

  /**
   * AiAgent findUniqueOrThrow
   */
  export type AiAgentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
    /**
     * Filter, which AiAgent to fetch.
     */
    where: AiAgentWhereUniqueInput
  }

  /**
   * AiAgent findFirst
   */
  export type AiAgentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
    /**
     * Filter, which AiAgent to fetch.
     */
    where?: AiAgentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiAgents to fetch.
     */
    orderBy?: AiAgentOrderByWithRelationInput | AiAgentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiAgents.
     */
    cursor?: AiAgentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiAgents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiAgents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiAgents.
     */
    distinct?: AiAgentScalarFieldEnum | AiAgentScalarFieldEnum[]
  }

  /**
   * AiAgent findFirstOrThrow
   */
  export type AiAgentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
    /**
     * Filter, which AiAgent to fetch.
     */
    where?: AiAgentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiAgents to fetch.
     */
    orderBy?: AiAgentOrderByWithRelationInput | AiAgentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiAgents.
     */
    cursor?: AiAgentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiAgents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiAgents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiAgents.
     */
    distinct?: AiAgentScalarFieldEnum | AiAgentScalarFieldEnum[]
  }

  /**
   * AiAgent findMany
   */
  export type AiAgentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
    /**
     * Filter, which AiAgents to fetch.
     */
    where?: AiAgentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiAgents to fetch.
     */
    orderBy?: AiAgentOrderByWithRelationInput | AiAgentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiAgents.
     */
    cursor?: AiAgentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiAgents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiAgents.
     */
    skip?: number
    distinct?: AiAgentScalarFieldEnum | AiAgentScalarFieldEnum[]
  }

  /**
   * AiAgent create
   */
  export type AiAgentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
    /**
     * The data needed to create a AiAgent.
     */
    data: XOR<AiAgentCreateInput, AiAgentUncheckedCreateInput>
  }

  /**
   * AiAgent createMany
   */
  export type AiAgentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiAgents.
     */
    data: AiAgentCreateManyInput | AiAgentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiAgent createManyAndReturn
   */
  export type AiAgentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiAgents.
     */
    data: AiAgentCreateManyInput | AiAgentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiAgent update
   */
  export type AiAgentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
    /**
     * The data needed to update a AiAgent.
     */
    data: XOR<AiAgentUpdateInput, AiAgentUncheckedUpdateInput>
    /**
     * Choose, which AiAgent to update.
     */
    where: AiAgentWhereUniqueInput
  }

  /**
   * AiAgent updateMany
   */
  export type AiAgentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiAgents.
     */
    data: XOR<AiAgentUpdateManyMutationInput, AiAgentUncheckedUpdateManyInput>
    /**
     * Filter which AiAgents to update
     */
    where?: AiAgentWhereInput
  }

  /**
   * AiAgent upsert
   */
  export type AiAgentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
    /**
     * The filter to search for the AiAgent to update in case it exists.
     */
    where: AiAgentWhereUniqueInput
    /**
     * In case the AiAgent found by the `where` argument doesn't exist, create a new AiAgent with this data.
     */
    create: XOR<AiAgentCreateInput, AiAgentUncheckedCreateInput>
    /**
     * In case the AiAgent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiAgentUpdateInput, AiAgentUncheckedUpdateInput>
  }

  /**
   * AiAgent delete
   */
  export type AiAgentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
    /**
     * Filter which AiAgent to delete.
     */
    where: AiAgentWhereUniqueInput
  }

  /**
   * AiAgent deleteMany
   */
  export type AiAgentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiAgents to delete
     */
    where?: AiAgentWhereInput
  }

  /**
   * AiAgent without action
   */
  export type AiAgentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiAgent
     */
    select?: AiAgentSelect<ExtArgs> | null
  }


  /**
   * Model AiKnowledgeSnippet
   */

  export type AggregateAiKnowledgeSnippet = {
    _count: AiKnowledgeSnippetCountAggregateOutputType | null
    _min: AiKnowledgeSnippetMinAggregateOutputType | null
    _max: AiKnowledgeSnippetMaxAggregateOutputType | null
  }

  export type AiKnowledgeSnippetMinAggregateOutputType = {
    id: string | null
    content: string | null
    source: string | null
    createdAt: Date | null
    agentId: string | null
  }

  export type AiKnowledgeSnippetMaxAggregateOutputType = {
    id: string | null
    content: string | null
    source: string | null
    createdAt: Date | null
    agentId: string | null
  }

  export type AiKnowledgeSnippetCountAggregateOutputType = {
    id: number
    content: number
    source: number
    tags: number
    createdAt: number
    agentId: number
    _all: number
  }


  export type AiKnowledgeSnippetMinAggregateInputType = {
    id?: true
    content?: true
    source?: true
    createdAt?: true
    agentId?: true
  }

  export type AiKnowledgeSnippetMaxAggregateInputType = {
    id?: true
    content?: true
    source?: true
    createdAt?: true
    agentId?: true
  }

  export type AiKnowledgeSnippetCountAggregateInputType = {
    id?: true
    content?: true
    source?: true
    tags?: true
    createdAt?: true
    agentId?: true
    _all?: true
  }

  export type AiKnowledgeSnippetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiKnowledgeSnippet to aggregate.
     */
    where?: AiKnowledgeSnippetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiKnowledgeSnippets to fetch.
     */
    orderBy?: AiKnowledgeSnippetOrderByWithRelationInput | AiKnowledgeSnippetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiKnowledgeSnippetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiKnowledgeSnippets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiKnowledgeSnippets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiKnowledgeSnippets
    **/
    _count?: true | AiKnowledgeSnippetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiKnowledgeSnippetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiKnowledgeSnippetMaxAggregateInputType
  }

  export type GetAiKnowledgeSnippetAggregateType<T extends AiKnowledgeSnippetAggregateArgs> = {
        [P in keyof T & keyof AggregateAiKnowledgeSnippet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiKnowledgeSnippet[P]>
      : GetScalarType<T[P], AggregateAiKnowledgeSnippet[P]>
  }




  export type AiKnowledgeSnippetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiKnowledgeSnippetWhereInput
    orderBy?: AiKnowledgeSnippetOrderByWithAggregationInput | AiKnowledgeSnippetOrderByWithAggregationInput[]
    by: AiKnowledgeSnippetScalarFieldEnum[] | AiKnowledgeSnippetScalarFieldEnum
    having?: AiKnowledgeSnippetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiKnowledgeSnippetCountAggregateInputType | true
    _min?: AiKnowledgeSnippetMinAggregateInputType
    _max?: AiKnowledgeSnippetMaxAggregateInputType
  }

  export type AiKnowledgeSnippetGroupByOutputType = {
    id: string
    content: string
    source: string
    tags: string[]
    createdAt: Date
    agentId: string | null
    _count: AiKnowledgeSnippetCountAggregateOutputType | null
    _min: AiKnowledgeSnippetMinAggregateOutputType | null
    _max: AiKnowledgeSnippetMaxAggregateOutputType | null
  }

  type GetAiKnowledgeSnippetGroupByPayload<T extends AiKnowledgeSnippetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiKnowledgeSnippetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiKnowledgeSnippetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiKnowledgeSnippetGroupByOutputType[P]>
            : GetScalarType<T[P], AiKnowledgeSnippetGroupByOutputType[P]>
        }
      >
    >


  export type AiKnowledgeSnippetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    source?: boolean
    tags?: boolean
    createdAt?: boolean
    agentId?: boolean
  }, ExtArgs["result"]["aiKnowledgeSnippet"]>

  export type AiKnowledgeSnippetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    source?: boolean
    tags?: boolean
    createdAt?: boolean
    agentId?: boolean
  }, ExtArgs["result"]["aiKnowledgeSnippet"]>

  export type AiKnowledgeSnippetSelectScalar = {
    id?: boolean
    content?: boolean
    source?: boolean
    tags?: boolean
    createdAt?: boolean
    agentId?: boolean
  }


  export type $AiKnowledgeSnippetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiKnowledgeSnippet"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      source: string
      tags: string[]
      createdAt: Date
      agentId: string | null
    }, ExtArgs["result"]["aiKnowledgeSnippet"]>
    composites: {}
  }

  type AiKnowledgeSnippetGetPayload<S extends boolean | null | undefined | AiKnowledgeSnippetDefaultArgs> = $Result.GetResult<Prisma.$AiKnowledgeSnippetPayload, S>

  type AiKnowledgeSnippetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiKnowledgeSnippetFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiKnowledgeSnippetCountAggregateInputType | true
    }

  export interface AiKnowledgeSnippetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiKnowledgeSnippet'], meta: { name: 'AiKnowledgeSnippet' } }
    /**
     * Find zero or one AiKnowledgeSnippet that matches the filter.
     * @param {AiKnowledgeSnippetFindUniqueArgs} args - Arguments to find a AiKnowledgeSnippet
     * @example
     * // Get one AiKnowledgeSnippet
     * const aiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiKnowledgeSnippetFindUniqueArgs>(args: SelectSubset<T, AiKnowledgeSnippetFindUniqueArgs<ExtArgs>>): Prisma__AiKnowledgeSnippetClient<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiKnowledgeSnippet that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiKnowledgeSnippetFindUniqueOrThrowArgs} args - Arguments to find a AiKnowledgeSnippet
     * @example
     * // Get one AiKnowledgeSnippet
     * const aiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiKnowledgeSnippetFindUniqueOrThrowArgs>(args: SelectSubset<T, AiKnowledgeSnippetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiKnowledgeSnippetClient<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiKnowledgeSnippet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiKnowledgeSnippetFindFirstArgs} args - Arguments to find a AiKnowledgeSnippet
     * @example
     * // Get one AiKnowledgeSnippet
     * const aiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiKnowledgeSnippetFindFirstArgs>(args?: SelectSubset<T, AiKnowledgeSnippetFindFirstArgs<ExtArgs>>): Prisma__AiKnowledgeSnippetClient<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiKnowledgeSnippet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiKnowledgeSnippetFindFirstOrThrowArgs} args - Arguments to find a AiKnowledgeSnippet
     * @example
     * // Get one AiKnowledgeSnippet
     * const aiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiKnowledgeSnippetFindFirstOrThrowArgs>(args?: SelectSubset<T, AiKnowledgeSnippetFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiKnowledgeSnippetClient<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiKnowledgeSnippets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiKnowledgeSnippetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiKnowledgeSnippets
     * const aiKnowledgeSnippets = await prisma.aiKnowledgeSnippet.findMany()
     * 
     * // Get first 10 AiKnowledgeSnippets
     * const aiKnowledgeSnippets = await prisma.aiKnowledgeSnippet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiKnowledgeSnippetWithIdOnly = await prisma.aiKnowledgeSnippet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiKnowledgeSnippetFindManyArgs>(args?: SelectSubset<T, AiKnowledgeSnippetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiKnowledgeSnippet.
     * @param {AiKnowledgeSnippetCreateArgs} args - Arguments to create a AiKnowledgeSnippet.
     * @example
     * // Create one AiKnowledgeSnippet
     * const AiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.create({
     *   data: {
     *     // ... data to create a AiKnowledgeSnippet
     *   }
     * })
     * 
     */
    create<T extends AiKnowledgeSnippetCreateArgs>(args: SelectSubset<T, AiKnowledgeSnippetCreateArgs<ExtArgs>>): Prisma__AiKnowledgeSnippetClient<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiKnowledgeSnippets.
     * @param {AiKnowledgeSnippetCreateManyArgs} args - Arguments to create many AiKnowledgeSnippets.
     * @example
     * // Create many AiKnowledgeSnippets
     * const aiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiKnowledgeSnippetCreateManyArgs>(args?: SelectSubset<T, AiKnowledgeSnippetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiKnowledgeSnippets and returns the data saved in the database.
     * @param {AiKnowledgeSnippetCreateManyAndReturnArgs} args - Arguments to create many AiKnowledgeSnippets.
     * @example
     * // Create many AiKnowledgeSnippets
     * const aiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiKnowledgeSnippets and only return the `id`
     * const aiKnowledgeSnippetWithIdOnly = await prisma.aiKnowledgeSnippet.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiKnowledgeSnippetCreateManyAndReturnArgs>(args?: SelectSubset<T, AiKnowledgeSnippetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiKnowledgeSnippet.
     * @param {AiKnowledgeSnippetDeleteArgs} args - Arguments to delete one AiKnowledgeSnippet.
     * @example
     * // Delete one AiKnowledgeSnippet
     * const AiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.delete({
     *   where: {
     *     // ... filter to delete one AiKnowledgeSnippet
     *   }
     * })
     * 
     */
    delete<T extends AiKnowledgeSnippetDeleteArgs>(args: SelectSubset<T, AiKnowledgeSnippetDeleteArgs<ExtArgs>>): Prisma__AiKnowledgeSnippetClient<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiKnowledgeSnippet.
     * @param {AiKnowledgeSnippetUpdateArgs} args - Arguments to update one AiKnowledgeSnippet.
     * @example
     * // Update one AiKnowledgeSnippet
     * const aiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiKnowledgeSnippetUpdateArgs>(args: SelectSubset<T, AiKnowledgeSnippetUpdateArgs<ExtArgs>>): Prisma__AiKnowledgeSnippetClient<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiKnowledgeSnippets.
     * @param {AiKnowledgeSnippetDeleteManyArgs} args - Arguments to filter AiKnowledgeSnippets to delete.
     * @example
     * // Delete a few AiKnowledgeSnippets
     * const { count } = await prisma.aiKnowledgeSnippet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiKnowledgeSnippetDeleteManyArgs>(args?: SelectSubset<T, AiKnowledgeSnippetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiKnowledgeSnippets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiKnowledgeSnippetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiKnowledgeSnippets
     * const aiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiKnowledgeSnippetUpdateManyArgs>(args: SelectSubset<T, AiKnowledgeSnippetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiKnowledgeSnippet.
     * @param {AiKnowledgeSnippetUpsertArgs} args - Arguments to update or create a AiKnowledgeSnippet.
     * @example
     * // Update or create a AiKnowledgeSnippet
     * const aiKnowledgeSnippet = await prisma.aiKnowledgeSnippet.upsert({
     *   create: {
     *     // ... data to create a AiKnowledgeSnippet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiKnowledgeSnippet we want to update
     *   }
     * })
     */
    upsert<T extends AiKnowledgeSnippetUpsertArgs>(args: SelectSubset<T, AiKnowledgeSnippetUpsertArgs<ExtArgs>>): Prisma__AiKnowledgeSnippetClient<$Result.GetResult<Prisma.$AiKnowledgeSnippetPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiKnowledgeSnippets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiKnowledgeSnippetCountArgs} args - Arguments to filter AiKnowledgeSnippets to count.
     * @example
     * // Count the number of AiKnowledgeSnippets
     * const count = await prisma.aiKnowledgeSnippet.count({
     *   where: {
     *     // ... the filter for the AiKnowledgeSnippets we want to count
     *   }
     * })
    **/
    count<T extends AiKnowledgeSnippetCountArgs>(
      args?: Subset<T, AiKnowledgeSnippetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiKnowledgeSnippetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiKnowledgeSnippet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiKnowledgeSnippetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiKnowledgeSnippetAggregateArgs>(args: Subset<T, AiKnowledgeSnippetAggregateArgs>): Prisma.PrismaPromise<GetAiKnowledgeSnippetAggregateType<T>>

    /**
     * Group by AiKnowledgeSnippet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiKnowledgeSnippetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiKnowledgeSnippetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiKnowledgeSnippetGroupByArgs['orderBy'] }
        : { orderBy?: AiKnowledgeSnippetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiKnowledgeSnippetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiKnowledgeSnippetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiKnowledgeSnippet model
   */
  readonly fields: AiKnowledgeSnippetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiKnowledgeSnippet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiKnowledgeSnippetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiKnowledgeSnippet model
   */ 
  interface AiKnowledgeSnippetFieldRefs {
    readonly id: FieldRef<"AiKnowledgeSnippet", 'String'>
    readonly content: FieldRef<"AiKnowledgeSnippet", 'String'>
    readonly source: FieldRef<"AiKnowledgeSnippet", 'String'>
    readonly tags: FieldRef<"AiKnowledgeSnippet", 'String[]'>
    readonly createdAt: FieldRef<"AiKnowledgeSnippet", 'DateTime'>
    readonly agentId: FieldRef<"AiKnowledgeSnippet", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AiKnowledgeSnippet findUnique
   */
  export type AiKnowledgeSnippetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
    /**
     * Filter, which AiKnowledgeSnippet to fetch.
     */
    where: AiKnowledgeSnippetWhereUniqueInput
  }

  /**
   * AiKnowledgeSnippet findUniqueOrThrow
   */
  export type AiKnowledgeSnippetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
    /**
     * Filter, which AiKnowledgeSnippet to fetch.
     */
    where: AiKnowledgeSnippetWhereUniqueInput
  }

  /**
   * AiKnowledgeSnippet findFirst
   */
  export type AiKnowledgeSnippetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
    /**
     * Filter, which AiKnowledgeSnippet to fetch.
     */
    where?: AiKnowledgeSnippetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiKnowledgeSnippets to fetch.
     */
    orderBy?: AiKnowledgeSnippetOrderByWithRelationInput | AiKnowledgeSnippetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiKnowledgeSnippets.
     */
    cursor?: AiKnowledgeSnippetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiKnowledgeSnippets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiKnowledgeSnippets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiKnowledgeSnippets.
     */
    distinct?: AiKnowledgeSnippetScalarFieldEnum | AiKnowledgeSnippetScalarFieldEnum[]
  }

  /**
   * AiKnowledgeSnippet findFirstOrThrow
   */
  export type AiKnowledgeSnippetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
    /**
     * Filter, which AiKnowledgeSnippet to fetch.
     */
    where?: AiKnowledgeSnippetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiKnowledgeSnippets to fetch.
     */
    orderBy?: AiKnowledgeSnippetOrderByWithRelationInput | AiKnowledgeSnippetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiKnowledgeSnippets.
     */
    cursor?: AiKnowledgeSnippetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiKnowledgeSnippets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiKnowledgeSnippets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiKnowledgeSnippets.
     */
    distinct?: AiKnowledgeSnippetScalarFieldEnum | AiKnowledgeSnippetScalarFieldEnum[]
  }

  /**
   * AiKnowledgeSnippet findMany
   */
  export type AiKnowledgeSnippetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
    /**
     * Filter, which AiKnowledgeSnippets to fetch.
     */
    where?: AiKnowledgeSnippetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiKnowledgeSnippets to fetch.
     */
    orderBy?: AiKnowledgeSnippetOrderByWithRelationInput | AiKnowledgeSnippetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiKnowledgeSnippets.
     */
    cursor?: AiKnowledgeSnippetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiKnowledgeSnippets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiKnowledgeSnippets.
     */
    skip?: number
    distinct?: AiKnowledgeSnippetScalarFieldEnum | AiKnowledgeSnippetScalarFieldEnum[]
  }

  /**
   * AiKnowledgeSnippet create
   */
  export type AiKnowledgeSnippetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
    /**
     * The data needed to create a AiKnowledgeSnippet.
     */
    data: XOR<AiKnowledgeSnippetCreateInput, AiKnowledgeSnippetUncheckedCreateInput>
  }

  /**
   * AiKnowledgeSnippet createMany
   */
  export type AiKnowledgeSnippetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiKnowledgeSnippets.
     */
    data: AiKnowledgeSnippetCreateManyInput | AiKnowledgeSnippetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiKnowledgeSnippet createManyAndReturn
   */
  export type AiKnowledgeSnippetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiKnowledgeSnippets.
     */
    data: AiKnowledgeSnippetCreateManyInput | AiKnowledgeSnippetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiKnowledgeSnippet update
   */
  export type AiKnowledgeSnippetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
    /**
     * The data needed to update a AiKnowledgeSnippet.
     */
    data: XOR<AiKnowledgeSnippetUpdateInput, AiKnowledgeSnippetUncheckedUpdateInput>
    /**
     * Choose, which AiKnowledgeSnippet to update.
     */
    where: AiKnowledgeSnippetWhereUniqueInput
  }

  /**
   * AiKnowledgeSnippet updateMany
   */
  export type AiKnowledgeSnippetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiKnowledgeSnippets.
     */
    data: XOR<AiKnowledgeSnippetUpdateManyMutationInput, AiKnowledgeSnippetUncheckedUpdateManyInput>
    /**
     * Filter which AiKnowledgeSnippets to update
     */
    where?: AiKnowledgeSnippetWhereInput
  }

  /**
   * AiKnowledgeSnippet upsert
   */
  export type AiKnowledgeSnippetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
    /**
     * The filter to search for the AiKnowledgeSnippet to update in case it exists.
     */
    where: AiKnowledgeSnippetWhereUniqueInput
    /**
     * In case the AiKnowledgeSnippet found by the `where` argument doesn't exist, create a new AiKnowledgeSnippet with this data.
     */
    create: XOR<AiKnowledgeSnippetCreateInput, AiKnowledgeSnippetUncheckedCreateInput>
    /**
     * In case the AiKnowledgeSnippet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiKnowledgeSnippetUpdateInput, AiKnowledgeSnippetUncheckedUpdateInput>
  }

  /**
   * AiKnowledgeSnippet delete
   */
  export type AiKnowledgeSnippetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
    /**
     * Filter which AiKnowledgeSnippet to delete.
     */
    where: AiKnowledgeSnippetWhereUniqueInput
  }

  /**
   * AiKnowledgeSnippet deleteMany
   */
  export type AiKnowledgeSnippetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiKnowledgeSnippets to delete
     */
    where?: AiKnowledgeSnippetWhereInput
  }

  /**
   * AiKnowledgeSnippet without action
   */
  export type AiKnowledgeSnippetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiKnowledgeSnippet
     */
    select?: AiKnowledgeSnippetSelect<ExtArgs> | null
  }


  /**
   * Model AiConversation
   */

  export type AggregateAiConversation = {
    _count: AiConversationCountAggregateOutputType | null
    _min: AiConversationMinAggregateOutputType | null
    _max: AiConversationMaxAggregateOutputType | null
  }

  export type AiConversationMinAggregateOutputType = {
    id: string | null
    title: string | null
    userId: string | null
    agentId: string | null
    mode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiConversationMaxAggregateOutputType = {
    id: string | null
    title: string | null
    userId: string | null
    agentId: string | null
    mode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiConversationCountAggregateOutputType = {
    id: number
    title: number
    userId: number
    agentId: number
    state: number
    mode: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiConversationMinAggregateInputType = {
    id?: true
    title?: true
    userId?: true
    agentId?: true
    mode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiConversationMaxAggregateInputType = {
    id?: true
    title?: true
    userId?: true
    agentId?: true
    mode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiConversationCountAggregateInputType = {
    id?: true
    title?: true
    userId?: true
    agentId?: true
    state?: true
    mode?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiConversation to aggregate.
     */
    where?: AiConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversations to fetch.
     */
    orderBy?: AiConversationOrderByWithRelationInput | AiConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiConversations
    **/
    _count?: true | AiConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiConversationMaxAggregateInputType
  }

  export type GetAiConversationAggregateType<T extends AiConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateAiConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiConversation[P]>
      : GetScalarType<T[P], AggregateAiConversation[P]>
  }




  export type AiConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiConversationWhereInput
    orderBy?: AiConversationOrderByWithAggregationInput | AiConversationOrderByWithAggregationInput[]
    by: AiConversationScalarFieldEnum[] | AiConversationScalarFieldEnum
    having?: AiConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiConversationCountAggregateInputType | true
    _min?: AiConversationMinAggregateInputType
    _max?: AiConversationMaxAggregateInputType
  }

  export type AiConversationGroupByOutputType = {
    id: string
    title: string | null
    userId: string
    agentId: string | null
    state: JsonValue | null
    mode: string
    createdAt: Date
    updatedAt: Date
    _count: AiConversationCountAggregateOutputType | null
    _min: AiConversationMinAggregateOutputType | null
    _max: AiConversationMaxAggregateOutputType | null
  }

  type GetAiConversationGroupByPayload<T extends AiConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiConversationGroupByOutputType[P]>
            : GetScalarType<T[P], AiConversationGroupByOutputType[P]>
        }
      >
    >


  export type AiConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    userId?: boolean
    agentId?: boolean
    state?: boolean
    mode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    messages?: boolean | AiConversation$messagesArgs<ExtArgs>
    _count?: boolean | AiConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiConversation"]>

  export type AiConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    userId?: boolean
    agentId?: boolean
    state?: boolean
    mode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiConversation"]>

  export type AiConversationSelectScalar = {
    id?: boolean
    title?: boolean
    userId?: boolean
    agentId?: boolean
    state?: boolean
    mode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AiConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | AiConversation$messagesArgs<ExtArgs>
    _count?: boolean | AiConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AiConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AiConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiConversation"
    objects: {
      messages: Prisma.$AiConversationMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      userId: string
      agentId: string | null
      state: Prisma.JsonValue | null
      mode: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiConversation"]>
    composites: {}
  }

  type AiConversationGetPayload<S extends boolean | null | undefined | AiConversationDefaultArgs> = $Result.GetResult<Prisma.$AiConversationPayload, S>

  type AiConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiConversationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiConversationCountAggregateInputType | true
    }

  export interface AiConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiConversation'], meta: { name: 'AiConversation' } }
    /**
     * Find zero or one AiConversation that matches the filter.
     * @param {AiConversationFindUniqueArgs} args - Arguments to find a AiConversation
     * @example
     * // Get one AiConversation
     * const aiConversation = await prisma.aiConversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiConversationFindUniqueArgs>(args: SelectSubset<T, AiConversationFindUniqueArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiConversation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiConversationFindUniqueOrThrowArgs} args - Arguments to find a AiConversation
     * @example
     * // Get one AiConversation
     * const aiConversation = await prisma.aiConversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, AiConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiConversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationFindFirstArgs} args - Arguments to find a AiConversation
     * @example
     * // Get one AiConversation
     * const aiConversation = await prisma.aiConversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiConversationFindFirstArgs>(args?: SelectSubset<T, AiConversationFindFirstArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiConversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationFindFirstOrThrowArgs} args - Arguments to find a AiConversation
     * @example
     * // Get one AiConversation
     * const aiConversation = await prisma.aiConversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, AiConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiConversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiConversations
     * const aiConversations = await prisma.aiConversation.findMany()
     * 
     * // Get first 10 AiConversations
     * const aiConversations = await prisma.aiConversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiConversationWithIdOnly = await prisma.aiConversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiConversationFindManyArgs>(args?: SelectSubset<T, AiConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiConversation.
     * @param {AiConversationCreateArgs} args - Arguments to create a AiConversation.
     * @example
     * // Create one AiConversation
     * const AiConversation = await prisma.aiConversation.create({
     *   data: {
     *     // ... data to create a AiConversation
     *   }
     * })
     * 
     */
    create<T extends AiConversationCreateArgs>(args: SelectSubset<T, AiConversationCreateArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiConversations.
     * @param {AiConversationCreateManyArgs} args - Arguments to create many AiConversations.
     * @example
     * // Create many AiConversations
     * const aiConversation = await prisma.aiConversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiConversationCreateManyArgs>(args?: SelectSubset<T, AiConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiConversations and returns the data saved in the database.
     * @param {AiConversationCreateManyAndReturnArgs} args - Arguments to create many AiConversations.
     * @example
     * // Create many AiConversations
     * const aiConversation = await prisma.aiConversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiConversations and only return the `id`
     * const aiConversationWithIdOnly = await prisma.aiConversation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, AiConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiConversation.
     * @param {AiConversationDeleteArgs} args - Arguments to delete one AiConversation.
     * @example
     * // Delete one AiConversation
     * const AiConversation = await prisma.aiConversation.delete({
     *   where: {
     *     // ... filter to delete one AiConversation
     *   }
     * })
     * 
     */
    delete<T extends AiConversationDeleteArgs>(args: SelectSubset<T, AiConversationDeleteArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiConversation.
     * @param {AiConversationUpdateArgs} args - Arguments to update one AiConversation.
     * @example
     * // Update one AiConversation
     * const aiConversation = await prisma.aiConversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiConversationUpdateArgs>(args: SelectSubset<T, AiConversationUpdateArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiConversations.
     * @param {AiConversationDeleteManyArgs} args - Arguments to filter AiConversations to delete.
     * @example
     * // Delete a few AiConversations
     * const { count } = await prisma.aiConversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiConversationDeleteManyArgs>(args?: SelectSubset<T, AiConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiConversations
     * const aiConversation = await prisma.aiConversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiConversationUpdateManyArgs>(args: SelectSubset<T, AiConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiConversation.
     * @param {AiConversationUpsertArgs} args - Arguments to update or create a AiConversation.
     * @example
     * // Update or create a AiConversation
     * const aiConversation = await prisma.aiConversation.upsert({
     *   create: {
     *     // ... data to create a AiConversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiConversation we want to update
     *   }
     * })
     */
    upsert<T extends AiConversationUpsertArgs>(args: SelectSubset<T, AiConversationUpsertArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationCountArgs} args - Arguments to filter AiConversations to count.
     * @example
     * // Count the number of AiConversations
     * const count = await prisma.aiConversation.count({
     *   where: {
     *     // ... the filter for the AiConversations we want to count
     *   }
     * })
    **/
    count<T extends AiConversationCountArgs>(
      args?: Subset<T, AiConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiConversationAggregateArgs>(args: Subset<T, AiConversationAggregateArgs>): Prisma.PrismaPromise<GetAiConversationAggregateType<T>>

    /**
     * Group by AiConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiConversationGroupByArgs['orderBy'] }
        : { orderBy?: AiConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiConversation model
   */
  readonly fields: AiConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiConversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends AiConversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, AiConversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiConversation model
   */ 
  interface AiConversationFieldRefs {
    readonly id: FieldRef<"AiConversation", 'String'>
    readonly title: FieldRef<"AiConversation", 'String'>
    readonly userId: FieldRef<"AiConversation", 'String'>
    readonly agentId: FieldRef<"AiConversation", 'String'>
    readonly state: FieldRef<"AiConversation", 'Json'>
    readonly mode: FieldRef<"AiConversation", 'String'>
    readonly createdAt: FieldRef<"AiConversation", 'DateTime'>
    readonly updatedAt: FieldRef<"AiConversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiConversation findUnique
   */
  export type AiConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversation to fetch.
     */
    where: AiConversationWhereUniqueInput
  }

  /**
   * AiConversation findUniqueOrThrow
   */
  export type AiConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversation to fetch.
     */
    where: AiConversationWhereUniqueInput
  }

  /**
   * AiConversation findFirst
   */
  export type AiConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversation to fetch.
     */
    where?: AiConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversations to fetch.
     */
    orderBy?: AiConversationOrderByWithRelationInput | AiConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiConversations.
     */
    cursor?: AiConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiConversations.
     */
    distinct?: AiConversationScalarFieldEnum | AiConversationScalarFieldEnum[]
  }

  /**
   * AiConversation findFirstOrThrow
   */
  export type AiConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversation to fetch.
     */
    where?: AiConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversations to fetch.
     */
    orderBy?: AiConversationOrderByWithRelationInput | AiConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiConversations.
     */
    cursor?: AiConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiConversations.
     */
    distinct?: AiConversationScalarFieldEnum | AiConversationScalarFieldEnum[]
  }

  /**
   * AiConversation findMany
   */
  export type AiConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversations to fetch.
     */
    where?: AiConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversations to fetch.
     */
    orderBy?: AiConversationOrderByWithRelationInput | AiConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiConversations.
     */
    cursor?: AiConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversations.
     */
    skip?: number
    distinct?: AiConversationScalarFieldEnum | AiConversationScalarFieldEnum[]
  }

  /**
   * AiConversation create
   */
  export type AiConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a AiConversation.
     */
    data: XOR<AiConversationCreateInput, AiConversationUncheckedCreateInput>
  }

  /**
   * AiConversation createMany
   */
  export type AiConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiConversations.
     */
    data: AiConversationCreateManyInput | AiConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiConversation createManyAndReturn
   */
  export type AiConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiConversations.
     */
    data: AiConversationCreateManyInput | AiConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiConversation update
   */
  export type AiConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a AiConversation.
     */
    data: XOR<AiConversationUpdateInput, AiConversationUncheckedUpdateInput>
    /**
     * Choose, which AiConversation to update.
     */
    where: AiConversationWhereUniqueInput
  }

  /**
   * AiConversation updateMany
   */
  export type AiConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiConversations.
     */
    data: XOR<AiConversationUpdateManyMutationInput, AiConversationUncheckedUpdateManyInput>
    /**
     * Filter which AiConversations to update
     */
    where?: AiConversationWhereInput
  }

  /**
   * AiConversation upsert
   */
  export type AiConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the AiConversation to update in case it exists.
     */
    where: AiConversationWhereUniqueInput
    /**
     * In case the AiConversation found by the `where` argument doesn't exist, create a new AiConversation with this data.
     */
    create: XOR<AiConversationCreateInput, AiConversationUncheckedCreateInput>
    /**
     * In case the AiConversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiConversationUpdateInput, AiConversationUncheckedUpdateInput>
  }

  /**
   * AiConversation delete
   */
  export type AiConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter which AiConversation to delete.
     */
    where: AiConversationWhereUniqueInput
  }

  /**
   * AiConversation deleteMany
   */
  export type AiConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiConversations to delete
     */
    where?: AiConversationWhereInput
  }

  /**
   * AiConversation.messages
   */
  export type AiConversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    where?: AiConversationMessageWhereInput
    orderBy?: AiConversationMessageOrderByWithRelationInput | AiConversationMessageOrderByWithRelationInput[]
    cursor?: AiConversationMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiConversationMessageScalarFieldEnum | AiConversationMessageScalarFieldEnum[]
  }

  /**
   * AiConversation without action
   */
  export type AiConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
  }


  /**
   * Model AiConversationMessage
   */

  export type AggregateAiConversationMessage = {
    _count: AiConversationMessageCountAggregateOutputType | null
    _min: AiConversationMessageMinAggregateOutputType | null
    _max: AiConversationMessageMaxAggregateOutputType | null
  }

  export type AiConversationMessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    content: string | null
    source: string | null
    createdAt: Date | null
  }

  export type AiConversationMessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    content: string | null
    source: string | null
    createdAt: Date | null
  }

  export type AiConversationMessageCountAggregateOutputType = {
    id: number
    conversationId: number
    role: number
    content: number
    source: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type AiConversationMessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    source?: true
    createdAt?: true
  }

  export type AiConversationMessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    source?: true
    createdAt?: true
  }

  export type AiConversationMessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    source?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type AiConversationMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiConversationMessage to aggregate.
     */
    where?: AiConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversationMessages to fetch.
     */
    orderBy?: AiConversationMessageOrderByWithRelationInput | AiConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiConversationMessages
    **/
    _count?: true | AiConversationMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiConversationMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiConversationMessageMaxAggregateInputType
  }

  export type GetAiConversationMessageAggregateType<T extends AiConversationMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateAiConversationMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiConversationMessage[P]>
      : GetScalarType<T[P], AggregateAiConversationMessage[P]>
  }




  export type AiConversationMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiConversationMessageWhereInput
    orderBy?: AiConversationMessageOrderByWithAggregationInput | AiConversationMessageOrderByWithAggregationInput[]
    by: AiConversationMessageScalarFieldEnum[] | AiConversationMessageScalarFieldEnum
    having?: AiConversationMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiConversationMessageCountAggregateInputType | true
    _min?: AiConversationMessageMinAggregateInputType
    _max?: AiConversationMessageMaxAggregateInputType
  }

  export type AiConversationMessageGroupByOutputType = {
    id: string
    conversationId: string
    role: string
    content: string
    source: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: AiConversationMessageCountAggregateOutputType | null
    _min: AiConversationMessageMinAggregateOutputType | null
    _max: AiConversationMessageMaxAggregateOutputType | null
  }

  type GetAiConversationMessageGroupByPayload<T extends AiConversationMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiConversationMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiConversationMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiConversationMessageGroupByOutputType[P]>
            : GetScalarType<T[P], AiConversationMessageGroupByOutputType[P]>
        }
      >
    >


  export type AiConversationMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    source?: boolean
    metadata?: boolean
    createdAt?: boolean
    conversation?: boolean | AiConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiConversationMessage"]>

  export type AiConversationMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    source?: boolean
    metadata?: boolean
    createdAt?: boolean
    conversation?: boolean | AiConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiConversationMessage"]>

  export type AiConversationMessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    source?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type AiConversationMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | AiConversationDefaultArgs<ExtArgs>
  }
  export type AiConversationMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | AiConversationDefaultArgs<ExtArgs>
  }

  export type $AiConversationMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiConversationMessage"
    objects: {
      conversation: Prisma.$AiConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      role: string
      content: string
      source: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["aiConversationMessage"]>
    composites: {}
  }

  type AiConversationMessageGetPayload<S extends boolean | null | undefined | AiConversationMessageDefaultArgs> = $Result.GetResult<Prisma.$AiConversationMessagePayload, S>

  type AiConversationMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiConversationMessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiConversationMessageCountAggregateInputType | true
    }

  export interface AiConversationMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiConversationMessage'], meta: { name: 'AiConversationMessage' } }
    /**
     * Find zero or one AiConversationMessage that matches the filter.
     * @param {AiConversationMessageFindUniqueArgs} args - Arguments to find a AiConversationMessage
     * @example
     * // Get one AiConversationMessage
     * const aiConversationMessage = await prisma.aiConversationMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiConversationMessageFindUniqueArgs>(args: SelectSubset<T, AiConversationMessageFindUniqueArgs<ExtArgs>>): Prisma__AiConversationMessageClient<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiConversationMessage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiConversationMessageFindUniqueOrThrowArgs} args - Arguments to find a AiConversationMessage
     * @example
     * // Get one AiConversationMessage
     * const aiConversationMessage = await prisma.aiConversationMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiConversationMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, AiConversationMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiConversationMessageClient<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiConversationMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationMessageFindFirstArgs} args - Arguments to find a AiConversationMessage
     * @example
     * // Get one AiConversationMessage
     * const aiConversationMessage = await prisma.aiConversationMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiConversationMessageFindFirstArgs>(args?: SelectSubset<T, AiConversationMessageFindFirstArgs<ExtArgs>>): Prisma__AiConversationMessageClient<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiConversationMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationMessageFindFirstOrThrowArgs} args - Arguments to find a AiConversationMessage
     * @example
     * // Get one AiConversationMessage
     * const aiConversationMessage = await prisma.aiConversationMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiConversationMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, AiConversationMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiConversationMessageClient<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiConversationMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiConversationMessages
     * const aiConversationMessages = await prisma.aiConversationMessage.findMany()
     * 
     * // Get first 10 AiConversationMessages
     * const aiConversationMessages = await prisma.aiConversationMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiConversationMessageWithIdOnly = await prisma.aiConversationMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiConversationMessageFindManyArgs>(args?: SelectSubset<T, AiConversationMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiConversationMessage.
     * @param {AiConversationMessageCreateArgs} args - Arguments to create a AiConversationMessage.
     * @example
     * // Create one AiConversationMessage
     * const AiConversationMessage = await prisma.aiConversationMessage.create({
     *   data: {
     *     // ... data to create a AiConversationMessage
     *   }
     * })
     * 
     */
    create<T extends AiConversationMessageCreateArgs>(args: SelectSubset<T, AiConversationMessageCreateArgs<ExtArgs>>): Prisma__AiConversationMessageClient<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiConversationMessages.
     * @param {AiConversationMessageCreateManyArgs} args - Arguments to create many AiConversationMessages.
     * @example
     * // Create many AiConversationMessages
     * const aiConversationMessage = await prisma.aiConversationMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiConversationMessageCreateManyArgs>(args?: SelectSubset<T, AiConversationMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiConversationMessages and returns the data saved in the database.
     * @param {AiConversationMessageCreateManyAndReturnArgs} args - Arguments to create many AiConversationMessages.
     * @example
     * // Create many AiConversationMessages
     * const aiConversationMessage = await prisma.aiConversationMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiConversationMessages and only return the `id`
     * const aiConversationMessageWithIdOnly = await prisma.aiConversationMessage.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiConversationMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, AiConversationMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiConversationMessage.
     * @param {AiConversationMessageDeleteArgs} args - Arguments to delete one AiConversationMessage.
     * @example
     * // Delete one AiConversationMessage
     * const AiConversationMessage = await prisma.aiConversationMessage.delete({
     *   where: {
     *     // ... filter to delete one AiConversationMessage
     *   }
     * })
     * 
     */
    delete<T extends AiConversationMessageDeleteArgs>(args: SelectSubset<T, AiConversationMessageDeleteArgs<ExtArgs>>): Prisma__AiConversationMessageClient<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiConversationMessage.
     * @param {AiConversationMessageUpdateArgs} args - Arguments to update one AiConversationMessage.
     * @example
     * // Update one AiConversationMessage
     * const aiConversationMessage = await prisma.aiConversationMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiConversationMessageUpdateArgs>(args: SelectSubset<T, AiConversationMessageUpdateArgs<ExtArgs>>): Prisma__AiConversationMessageClient<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiConversationMessages.
     * @param {AiConversationMessageDeleteManyArgs} args - Arguments to filter AiConversationMessages to delete.
     * @example
     * // Delete a few AiConversationMessages
     * const { count } = await prisma.aiConversationMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiConversationMessageDeleteManyArgs>(args?: SelectSubset<T, AiConversationMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiConversationMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiConversationMessages
     * const aiConversationMessage = await prisma.aiConversationMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiConversationMessageUpdateManyArgs>(args: SelectSubset<T, AiConversationMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiConversationMessage.
     * @param {AiConversationMessageUpsertArgs} args - Arguments to update or create a AiConversationMessage.
     * @example
     * // Update or create a AiConversationMessage
     * const aiConversationMessage = await prisma.aiConversationMessage.upsert({
     *   create: {
     *     // ... data to create a AiConversationMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiConversationMessage we want to update
     *   }
     * })
     */
    upsert<T extends AiConversationMessageUpsertArgs>(args: SelectSubset<T, AiConversationMessageUpsertArgs<ExtArgs>>): Prisma__AiConversationMessageClient<$Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiConversationMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationMessageCountArgs} args - Arguments to filter AiConversationMessages to count.
     * @example
     * // Count the number of AiConversationMessages
     * const count = await prisma.aiConversationMessage.count({
     *   where: {
     *     // ... the filter for the AiConversationMessages we want to count
     *   }
     * })
    **/
    count<T extends AiConversationMessageCountArgs>(
      args?: Subset<T, AiConversationMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiConversationMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiConversationMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiConversationMessageAggregateArgs>(args: Subset<T, AiConversationMessageAggregateArgs>): Prisma.PrismaPromise<GetAiConversationMessageAggregateType<T>>

    /**
     * Group by AiConversationMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiConversationMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiConversationMessageGroupByArgs['orderBy'] }
        : { orderBy?: AiConversationMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiConversationMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiConversationMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiConversationMessage model
   */
  readonly fields: AiConversationMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiConversationMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiConversationMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends AiConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AiConversationDefaultArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiConversationMessage model
   */ 
  interface AiConversationMessageFieldRefs {
    readonly id: FieldRef<"AiConversationMessage", 'String'>
    readonly conversationId: FieldRef<"AiConversationMessage", 'String'>
    readonly role: FieldRef<"AiConversationMessage", 'String'>
    readonly content: FieldRef<"AiConversationMessage", 'String'>
    readonly source: FieldRef<"AiConversationMessage", 'String'>
    readonly metadata: FieldRef<"AiConversationMessage", 'Json'>
    readonly createdAt: FieldRef<"AiConversationMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiConversationMessage findUnique
   */
  export type AiConversationMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiConversationMessage to fetch.
     */
    where: AiConversationMessageWhereUniqueInput
  }

  /**
   * AiConversationMessage findUniqueOrThrow
   */
  export type AiConversationMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiConversationMessage to fetch.
     */
    where: AiConversationMessageWhereUniqueInput
  }

  /**
   * AiConversationMessage findFirst
   */
  export type AiConversationMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiConversationMessage to fetch.
     */
    where?: AiConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversationMessages to fetch.
     */
    orderBy?: AiConversationMessageOrderByWithRelationInput | AiConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiConversationMessages.
     */
    cursor?: AiConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiConversationMessages.
     */
    distinct?: AiConversationMessageScalarFieldEnum | AiConversationMessageScalarFieldEnum[]
  }

  /**
   * AiConversationMessage findFirstOrThrow
   */
  export type AiConversationMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiConversationMessage to fetch.
     */
    where?: AiConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversationMessages to fetch.
     */
    orderBy?: AiConversationMessageOrderByWithRelationInput | AiConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiConversationMessages.
     */
    cursor?: AiConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiConversationMessages.
     */
    distinct?: AiConversationMessageScalarFieldEnum | AiConversationMessageScalarFieldEnum[]
  }

  /**
   * AiConversationMessage findMany
   */
  export type AiConversationMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiConversationMessages to fetch.
     */
    where?: AiConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversationMessages to fetch.
     */
    orderBy?: AiConversationMessageOrderByWithRelationInput | AiConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiConversationMessages.
     */
    cursor?: AiConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversationMessages.
     */
    skip?: number
    distinct?: AiConversationMessageScalarFieldEnum | AiConversationMessageScalarFieldEnum[]
  }

  /**
   * AiConversationMessage create
   */
  export type AiConversationMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a AiConversationMessage.
     */
    data: XOR<AiConversationMessageCreateInput, AiConversationMessageUncheckedCreateInput>
  }

  /**
   * AiConversationMessage createMany
   */
  export type AiConversationMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiConversationMessages.
     */
    data: AiConversationMessageCreateManyInput | AiConversationMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiConversationMessage createManyAndReturn
   */
  export type AiConversationMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiConversationMessages.
     */
    data: AiConversationMessageCreateManyInput | AiConversationMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiConversationMessage update
   */
  export type AiConversationMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a AiConversationMessage.
     */
    data: XOR<AiConversationMessageUpdateInput, AiConversationMessageUncheckedUpdateInput>
    /**
     * Choose, which AiConversationMessage to update.
     */
    where: AiConversationMessageWhereUniqueInput
  }

  /**
   * AiConversationMessage updateMany
   */
  export type AiConversationMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiConversationMessages.
     */
    data: XOR<AiConversationMessageUpdateManyMutationInput, AiConversationMessageUncheckedUpdateManyInput>
    /**
     * Filter which AiConversationMessages to update
     */
    where?: AiConversationMessageWhereInput
  }

  /**
   * AiConversationMessage upsert
   */
  export type AiConversationMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the AiConversationMessage to update in case it exists.
     */
    where: AiConversationMessageWhereUniqueInput
    /**
     * In case the AiConversationMessage found by the `where` argument doesn't exist, create a new AiConversationMessage with this data.
     */
    create: XOR<AiConversationMessageCreateInput, AiConversationMessageUncheckedCreateInput>
    /**
     * In case the AiConversationMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiConversationMessageUpdateInput, AiConversationMessageUncheckedUpdateInput>
  }

  /**
   * AiConversationMessage delete
   */
  export type AiConversationMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
    /**
     * Filter which AiConversationMessage to delete.
     */
    where: AiConversationMessageWhereUniqueInput
  }

  /**
   * AiConversationMessage deleteMany
   */
  export type AiConversationMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiConversationMessages to delete
     */
    where?: AiConversationMessageWhereInput
  }

  /**
   * AiConversationMessage without action
   */
  export type AiConversationMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationMessage
     */
    select?: AiConversationMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationMessageInclude<ExtArgs> | null
  }


  /**
   * Model AiInsight
   */

  export type AggregateAiInsight = {
    _count: AiInsightCountAggregateOutputType | null
    _min: AiInsightMinAggregateOutputType | null
    _max: AiInsightMaxAggregateOutputType | null
  }

  export type AiInsightMinAggregateOutputType = {
    id: string | null
    category: string | null
    title: string | null
    content: string | null
    severity: string | null
    source: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type AiInsightMaxAggregateOutputType = {
    id: string | null
    category: string | null
    title: string | null
    content: string | null
    severity: string | null
    source: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type AiInsightCountAggregateOutputType = {
    id: number
    category: number
    title: number
    content: number
    severity: number
    source: number
    metadata: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type AiInsightMinAggregateInputType = {
    id?: true
    category?: true
    title?: true
    content?: true
    severity?: true
    source?: true
    expiresAt?: true
    createdAt?: true
  }

  export type AiInsightMaxAggregateInputType = {
    id?: true
    category?: true
    title?: true
    content?: true
    severity?: true
    source?: true
    expiresAt?: true
    createdAt?: true
  }

  export type AiInsightCountAggregateInputType = {
    id?: true
    category?: true
    title?: true
    content?: true
    severity?: true
    source?: true
    metadata?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type AiInsightAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiInsight to aggregate.
     */
    where?: AiInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiInsights to fetch.
     */
    orderBy?: AiInsightOrderByWithRelationInput | AiInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiInsights
    **/
    _count?: true | AiInsightCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiInsightMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiInsightMaxAggregateInputType
  }

  export type GetAiInsightAggregateType<T extends AiInsightAggregateArgs> = {
        [P in keyof T & keyof AggregateAiInsight]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiInsight[P]>
      : GetScalarType<T[P], AggregateAiInsight[P]>
  }




  export type AiInsightGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiInsightWhereInput
    orderBy?: AiInsightOrderByWithAggregationInput | AiInsightOrderByWithAggregationInput[]
    by: AiInsightScalarFieldEnum[] | AiInsightScalarFieldEnum
    having?: AiInsightScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiInsightCountAggregateInputType | true
    _min?: AiInsightMinAggregateInputType
    _max?: AiInsightMaxAggregateInputType
  }

  export type AiInsightGroupByOutputType = {
    id: string
    category: string
    title: string
    content: string
    severity: string
    source: string
    metadata: JsonValue | null
    expiresAt: Date | null
    createdAt: Date
    _count: AiInsightCountAggregateOutputType | null
    _min: AiInsightMinAggregateOutputType | null
    _max: AiInsightMaxAggregateOutputType | null
  }

  type GetAiInsightGroupByPayload<T extends AiInsightGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiInsightGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiInsightGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiInsightGroupByOutputType[P]>
            : GetScalarType<T[P], AiInsightGroupByOutputType[P]>
        }
      >
    >


  export type AiInsightSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    category?: boolean
    title?: boolean
    content?: boolean
    severity?: boolean
    source?: boolean
    metadata?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiInsight"]>

  export type AiInsightSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    category?: boolean
    title?: boolean
    content?: boolean
    severity?: boolean
    source?: boolean
    metadata?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiInsight"]>

  export type AiInsightSelectScalar = {
    id?: boolean
    category?: boolean
    title?: boolean
    content?: boolean
    severity?: boolean
    source?: boolean
    metadata?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }


  export type $AiInsightPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiInsight"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      category: string
      title: string
      content: string
      severity: string
      source: string
      metadata: Prisma.JsonValue | null
      expiresAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["aiInsight"]>
    composites: {}
  }

  type AiInsightGetPayload<S extends boolean | null | undefined | AiInsightDefaultArgs> = $Result.GetResult<Prisma.$AiInsightPayload, S>

  type AiInsightCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiInsightFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiInsightCountAggregateInputType | true
    }

  export interface AiInsightDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiInsight'], meta: { name: 'AiInsight' } }
    /**
     * Find zero or one AiInsight that matches the filter.
     * @param {AiInsightFindUniqueArgs} args - Arguments to find a AiInsight
     * @example
     * // Get one AiInsight
     * const aiInsight = await prisma.aiInsight.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiInsightFindUniqueArgs>(args: SelectSubset<T, AiInsightFindUniqueArgs<ExtArgs>>): Prisma__AiInsightClient<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiInsight that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiInsightFindUniqueOrThrowArgs} args - Arguments to find a AiInsight
     * @example
     * // Get one AiInsight
     * const aiInsight = await prisma.aiInsight.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiInsightFindUniqueOrThrowArgs>(args: SelectSubset<T, AiInsightFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiInsightClient<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiInsight that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiInsightFindFirstArgs} args - Arguments to find a AiInsight
     * @example
     * // Get one AiInsight
     * const aiInsight = await prisma.aiInsight.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiInsightFindFirstArgs>(args?: SelectSubset<T, AiInsightFindFirstArgs<ExtArgs>>): Prisma__AiInsightClient<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiInsight that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiInsightFindFirstOrThrowArgs} args - Arguments to find a AiInsight
     * @example
     * // Get one AiInsight
     * const aiInsight = await prisma.aiInsight.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiInsightFindFirstOrThrowArgs>(args?: SelectSubset<T, AiInsightFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiInsightClient<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiInsights that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiInsightFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiInsights
     * const aiInsights = await prisma.aiInsight.findMany()
     * 
     * // Get first 10 AiInsights
     * const aiInsights = await prisma.aiInsight.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiInsightWithIdOnly = await prisma.aiInsight.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiInsightFindManyArgs>(args?: SelectSubset<T, AiInsightFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiInsight.
     * @param {AiInsightCreateArgs} args - Arguments to create a AiInsight.
     * @example
     * // Create one AiInsight
     * const AiInsight = await prisma.aiInsight.create({
     *   data: {
     *     // ... data to create a AiInsight
     *   }
     * })
     * 
     */
    create<T extends AiInsightCreateArgs>(args: SelectSubset<T, AiInsightCreateArgs<ExtArgs>>): Prisma__AiInsightClient<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiInsights.
     * @param {AiInsightCreateManyArgs} args - Arguments to create many AiInsights.
     * @example
     * // Create many AiInsights
     * const aiInsight = await prisma.aiInsight.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiInsightCreateManyArgs>(args?: SelectSubset<T, AiInsightCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiInsights and returns the data saved in the database.
     * @param {AiInsightCreateManyAndReturnArgs} args - Arguments to create many AiInsights.
     * @example
     * // Create many AiInsights
     * const aiInsight = await prisma.aiInsight.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiInsights and only return the `id`
     * const aiInsightWithIdOnly = await prisma.aiInsight.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiInsightCreateManyAndReturnArgs>(args?: SelectSubset<T, AiInsightCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiInsight.
     * @param {AiInsightDeleteArgs} args - Arguments to delete one AiInsight.
     * @example
     * // Delete one AiInsight
     * const AiInsight = await prisma.aiInsight.delete({
     *   where: {
     *     // ... filter to delete one AiInsight
     *   }
     * })
     * 
     */
    delete<T extends AiInsightDeleteArgs>(args: SelectSubset<T, AiInsightDeleteArgs<ExtArgs>>): Prisma__AiInsightClient<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiInsight.
     * @param {AiInsightUpdateArgs} args - Arguments to update one AiInsight.
     * @example
     * // Update one AiInsight
     * const aiInsight = await prisma.aiInsight.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiInsightUpdateArgs>(args: SelectSubset<T, AiInsightUpdateArgs<ExtArgs>>): Prisma__AiInsightClient<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiInsights.
     * @param {AiInsightDeleteManyArgs} args - Arguments to filter AiInsights to delete.
     * @example
     * // Delete a few AiInsights
     * const { count } = await prisma.aiInsight.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiInsightDeleteManyArgs>(args?: SelectSubset<T, AiInsightDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiInsights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiInsightUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiInsights
     * const aiInsight = await prisma.aiInsight.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiInsightUpdateManyArgs>(args: SelectSubset<T, AiInsightUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiInsight.
     * @param {AiInsightUpsertArgs} args - Arguments to update or create a AiInsight.
     * @example
     * // Update or create a AiInsight
     * const aiInsight = await prisma.aiInsight.upsert({
     *   create: {
     *     // ... data to create a AiInsight
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiInsight we want to update
     *   }
     * })
     */
    upsert<T extends AiInsightUpsertArgs>(args: SelectSubset<T, AiInsightUpsertArgs<ExtArgs>>): Prisma__AiInsightClient<$Result.GetResult<Prisma.$AiInsightPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiInsights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiInsightCountArgs} args - Arguments to filter AiInsights to count.
     * @example
     * // Count the number of AiInsights
     * const count = await prisma.aiInsight.count({
     *   where: {
     *     // ... the filter for the AiInsights we want to count
     *   }
     * })
    **/
    count<T extends AiInsightCountArgs>(
      args?: Subset<T, AiInsightCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiInsightCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiInsight.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiInsightAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiInsightAggregateArgs>(args: Subset<T, AiInsightAggregateArgs>): Prisma.PrismaPromise<GetAiInsightAggregateType<T>>

    /**
     * Group by AiInsight.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiInsightGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiInsightGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiInsightGroupByArgs['orderBy'] }
        : { orderBy?: AiInsightGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiInsightGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiInsightGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiInsight model
   */
  readonly fields: AiInsightFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiInsight.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiInsightClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiInsight model
   */ 
  interface AiInsightFieldRefs {
    readonly id: FieldRef<"AiInsight", 'String'>
    readonly category: FieldRef<"AiInsight", 'String'>
    readonly title: FieldRef<"AiInsight", 'String'>
    readonly content: FieldRef<"AiInsight", 'String'>
    readonly severity: FieldRef<"AiInsight", 'String'>
    readonly source: FieldRef<"AiInsight", 'String'>
    readonly metadata: FieldRef<"AiInsight", 'Json'>
    readonly expiresAt: FieldRef<"AiInsight", 'DateTime'>
    readonly createdAt: FieldRef<"AiInsight", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiInsight findUnique
   */
  export type AiInsightFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
    /**
     * Filter, which AiInsight to fetch.
     */
    where: AiInsightWhereUniqueInput
  }

  /**
   * AiInsight findUniqueOrThrow
   */
  export type AiInsightFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
    /**
     * Filter, which AiInsight to fetch.
     */
    where: AiInsightWhereUniqueInput
  }

  /**
   * AiInsight findFirst
   */
  export type AiInsightFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
    /**
     * Filter, which AiInsight to fetch.
     */
    where?: AiInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiInsights to fetch.
     */
    orderBy?: AiInsightOrderByWithRelationInput | AiInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiInsights.
     */
    cursor?: AiInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiInsights.
     */
    distinct?: AiInsightScalarFieldEnum | AiInsightScalarFieldEnum[]
  }

  /**
   * AiInsight findFirstOrThrow
   */
  export type AiInsightFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
    /**
     * Filter, which AiInsight to fetch.
     */
    where?: AiInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiInsights to fetch.
     */
    orderBy?: AiInsightOrderByWithRelationInput | AiInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiInsights.
     */
    cursor?: AiInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiInsights.
     */
    distinct?: AiInsightScalarFieldEnum | AiInsightScalarFieldEnum[]
  }

  /**
   * AiInsight findMany
   */
  export type AiInsightFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
    /**
     * Filter, which AiInsights to fetch.
     */
    where?: AiInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiInsights to fetch.
     */
    orderBy?: AiInsightOrderByWithRelationInput | AiInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiInsights.
     */
    cursor?: AiInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiInsights.
     */
    skip?: number
    distinct?: AiInsightScalarFieldEnum | AiInsightScalarFieldEnum[]
  }

  /**
   * AiInsight create
   */
  export type AiInsightCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
    /**
     * The data needed to create a AiInsight.
     */
    data: XOR<AiInsightCreateInput, AiInsightUncheckedCreateInput>
  }

  /**
   * AiInsight createMany
   */
  export type AiInsightCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiInsights.
     */
    data: AiInsightCreateManyInput | AiInsightCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiInsight createManyAndReturn
   */
  export type AiInsightCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiInsights.
     */
    data: AiInsightCreateManyInput | AiInsightCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiInsight update
   */
  export type AiInsightUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
    /**
     * The data needed to update a AiInsight.
     */
    data: XOR<AiInsightUpdateInput, AiInsightUncheckedUpdateInput>
    /**
     * Choose, which AiInsight to update.
     */
    where: AiInsightWhereUniqueInput
  }

  /**
   * AiInsight updateMany
   */
  export type AiInsightUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiInsights.
     */
    data: XOR<AiInsightUpdateManyMutationInput, AiInsightUncheckedUpdateManyInput>
    /**
     * Filter which AiInsights to update
     */
    where?: AiInsightWhereInput
  }

  /**
   * AiInsight upsert
   */
  export type AiInsightUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
    /**
     * The filter to search for the AiInsight to update in case it exists.
     */
    where: AiInsightWhereUniqueInput
    /**
     * In case the AiInsight found by the `where` argument doesn't exist, create a new AiInsight with this data.
     */
    create: XOR<AiInsightCreateInput, AiInsightUncheckedCreateInput>
    /**
     * In case the AiInsight was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiInsightUpdateInput, AiInsightUncheckedUpdateInput>
  }

  /**
   * AiInsight delete
   */
  export type AiInsightDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
    /**
     * Filter which AiInsight to delete.
     */
    where: AiInsightWhereUniqueInput
  }

  /**
   * AiInsight deleteMany
   */
  export type AiInsightDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiInsights to delete
     */
    where?: AiInsightWhereInput
  }

  /**
   * AiInsight without action
   */
  export type AiInsightDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiInsight
     */
    select?: AiInsightSelect<ExtArgs> | null
  }


  /**
   * Model AiSyncLog
   */

  export type AggregateAiSyncLog = {
    _count: AiSyncLogCountAggregateOutputType | null
    _avg: AiSyncLogAvgAggregateOutputType | null
    _sum: AiSyncLogSumAggregateOutputType | null
    _min: AiSyncLogMinAggregateOutputType | null
    _max: AiSyncLogMaxAggregateOutputType | null
  }

  export type AiSyncLogAvgAggregateOutputType = {
    recordsSynced: number | null
    recordsFailed: number | null
  }

  export type AiSyncLogSumAggregateOutputType = {
    recordsSynced: number | null
    recordsFailed: number | null
  }

  export type AiSyncLogMinAggregateOutputType = {
    id: string | null
    syncType: string | null
    recordsSynced: number | null
    recordsFailed: number | null
    status: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AiSyncLogMaxAggregateOutputType = {
    id: string | null
    syncType: string | null
    recordsSynced: number | null
    recordsFailed: number | null
    status: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AiSyncLogCountAggregateOutputType = {
    id: number
    syncType: number
    recordsSynced: number
    recordsFailed: number
    status: number
    errorMessage: number
    createdAt: number
    _all: number
  }


  export type AiSyncLogAvgAggregateInputType = {
    recordsSynced?: true
    recordsFailed?: true
  }

  export type AiSyncLogSumAggregateInputType = {
    recordsSynced?: true
    recordsFailed?: true
  }

  export type AiSyncLogMinAggregateInputType = {
    id?: true
    syncType?: true
    recordsSynced?: true
    recordsFailed?: true
    status?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AiSyncLogMaxAggregateInputType = {
    id?: true
    syncType?: true
    recordsSynced?: true
    recordsFailed?: true
    status?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AiSyncLogCountAggregateInputType = {
    id?: true
    syncType?: true
    recordsSynced?: true
    recordsFailed?: true
    status?: true
    errorMessage?: true
    createdAt?: true
    _all?: true
  }

  export type AiSyncLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiSyncLog to aggregate.
     */
    where?: AiSyncLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSyncLogs to fetch.
     */
    orderBy?: AiSyncLogOrderByWithRelationInput | AiSyncLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiSyncLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSyncLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSyncLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiSyncLogs
    **/
    _count?: true | AiSyncLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiSyncLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiSyncLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiSyncLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiSyncLogMaxAggregateInputType
  }

  export type GetAiSyncLogAggregateType<T extends AiSyncLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAiSyncLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiSyncLog[P]>
      : GetScalarType<T[P], AggregateAiSyncLog[P]>
  }




  export type AiSyncLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiSyncLogWhereInput
    orderBy?: AiSyncLogOrderByWithAggregationInput | AiSyncLogOrderByWithAggregationInput[]
    by: AiSyncLogScalarFieldEnum[] | AiSyncLogScalarFieldEnum
    having?: AiSyncLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiSyncLogCountAggregateInputType | true
    _avg?: AiSyncLogAvgAggregateInputType
    _sum?: AiSyncLogSumAggregateInputType
    _min?: AiSyncLogMinAggregateInputType
    _max?: AiSyncLogMaxAggregateInputType
  }

  export type AiSyncLogGroupByOutputType = {
    id: string
    syncType: string
    recordsSynced: number
    recordsFailed: number
    status: string
    errorMessage: string | null
    createdAt: Date
    _count: AiSyncLogCountAggregateOutputType | null
    _avg: AiSyncLogAvgAggregateOutputType | null
    _sum: AiSyncLogSumAggregateOutputType | null
    _min: AiSyncLogMinAggregateOutputType | null
    _max: AiSyncLogMaxAggregateOutputType | null
  }

  type GetAiSyncLogGroupByPayload<T extends AiSyncLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiSyncLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiSyncLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiSyncLogGroupByOutputType[P]>
            : GetScalarType<T[P], AiSyncLogGroupByOutputType[P]>
        }
      >
    >


  export type AiSyncLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    syncType?: boolean
    recordsSynced?: boolean
    recordsFailed?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiSyncLog"]>

  export type AiSyncLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    syncType?: boolean
    recordsSynced?: boolean
    recordsFailed?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiSyncLog"]>

  export type AiSyncLogSelectScalar = {
    id?: boolean
    syncType?: boolean
    recordsSynced?: boolean
    recordsFailed?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }


  export type $AiSyncLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiSyncLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      syncType: string
      recordsSynced: number
      recordsFailed: number
      status: string
      errorMessage: string | null
      createdAt: Date
    }, ExtArgs["result"]["aiSyncLog"]>
    composites: {}
  }

  type AiSyncLogGetPayload<S extends boolean | null | undefined | AiSyncLogDefaultArgs> = $Result.GetResult<Prisma.$AiSyncLogPayload, S>

  type AiSyncLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiSyncLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiSyncLogCountAggregateInputType | true
    }

  export interface AiSyncLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiSyncLog'], meta: { name: 'AiSyncLog' } }
    /**
     * Find zero or one AiSyncLog that matches the filter.
     * @param {AiSyncLogFindUniqueArgs} args - Arguments to find a AiSyncLog
     * @example
     * // Get one AiSyncLog
     * const aiSyncLog = await prisma.aiSyncLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiSyncLogFindUniqueArgs>(args: SelectSubset<T, AiSyncLogFindUniqueArgs<ExtArgs>>): Prisma__AiSyncLogClient<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiSyncLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiSyncLogFindUniqueOrThrowArgs} args - Arguments to find a AiSyncLog
     * @example
     * // Get one AiSyncLog
     * const aiSyncLog = await prisma.aiSyncLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiSyncLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AiSyncLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiSyncLogClient<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiSyncLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSyncLogFindFirstArgs} args - Arguments to find a AiSyncLog
     * @example
     * // Get one AiSyncLog
     * const aiSyncLog = await prisma.aiSyncLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiSyncLogFindFirstArgs>(args?: SelectSubset<T, AiSyncLogFindFirstArgs<ExtArgs>>): Prisma__AiSyncLogClient<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiSyncLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSyncLogFindFirstOrThrowArgs} args - Arguments to find a AiSyncLog
     * @example
     * // Get one AiSyncLog
     * const aiSyncLog = await prisma.aiSyncLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiSyncLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AiSyncLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiSyncLogClient<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiSyncLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSyncLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiSyncLogs
     * const aiSyncLogs = await prisma.aiSyncLog.findMany()
     * 
     * // Get first 10 AiSyncLogs
     * const aiSyncLogs = await prisma.aiSyncLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiSyncLogWithIdOnly = await prisma.aiSyncLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiSyncLogFindManyArgs>(args?: SelectSubset<T, AiSyncLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiSyncLog.
     * @param {AiSyncLogCreateArgs} args - Arguments to create a AiSyncLog.
     * @example
     * // Create one AiSyncLog
     * const AiSyncLog = await prisma.aiSyncLog.create({
     *   data: {
     *     // ... data to create a AiSyncLog
     *   }
     * })
     * 
     */
    create<T extends AiSyncLogCreateArgs>(args: SelectSubset<T, AiSyncLogCreateArgs<ExtArgs>>): Prisma__AiSyncLogClient<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiSyncLogs.
     * @param {AiSyncLogCreateManyArgs} args - Arguments to create many AiSyncLogs.
     * @example
     * // Create many AiSyncLogs
     * const aiSyncLog = await prisma.aiSyncLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiSyncLogCreateManyArgs>(args?: SelectSubset<T, AiSyncLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiSyncLogs and returns the data saved in the database.
     * @param {AiSyncLogCreateManyAndReturnArgs} args - Arguments to create many AiSyncLogs.
     * @example
     * // Create many AiSyncLogs
     * const aiSyncLog = await prisma.aiSyncLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiSyncLogs and only return the `id`
     * const aiSyncLogWithIdOnly = await prisma.aiSyncLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiSyncLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AiSyncLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiSyncLog.
     * @param {AiSyncLogDeleteArgs} args - Arguments to delete one AiSyncLog.
     * @example
     * // Delete one AiSyncLog
     * const AiSyncLog = await prisma.aiSyncLog.delete({
     *   where: {
     *     // ... filter to delete one AiSyncLog
     *   }
     * })
     * 
     */
    delete<T extends AiSyncLogDeleteArgs>(args: SelectSubset<T, AiSyncLogDeleteArgs<ExtArgs>>): Prisma__AiSyncLogClient<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiSyncLog.
     * @param {AiSyncLogUpdateArgs} args - Arguments to update one AiSyncLog.
     * @example
     * // Update one AiSyncLog
     * const aiSyncLog = await prisma.aiSyncLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiSyncLogUpdateArgs>(args: SelectSubset<T, AiSyncLogUpdateArgs<ExtArgs>>): Prisma__AiSyncLogClient<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiSyncLogs.
     * @param {AiSyncLogDeleteManyArgs} args - Arguments to filter AiSyncLogs to delete.
     * @example
     * // Delete a few AiSyncLogs
     * const { count } = await prisma.aiSyncLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiSyncLogDeleteManyArgs>(args?: SelectSubset<T, AiSyncLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiSyncLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSyncLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiSyncLogs
     * const aiSyncLog = await prisma.aiSyncLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiSyncLogUpdateManyArgs>(args: SelectSubset<T, AiSyncLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiSyncLog.
     * @param {AiSyncLogUpsertArgs} args - Arguments to update or create a AiSyncLog.
     * @example
     * // Update or create a AiSyncLog
     * const aiSyncLog = await prisma.aiSyncLog.upsert({
     *   create: {
     *     // ... data to create a AiSyncLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiSyncLog we want to update
     *   }
     * })
     */
    upsert<T extends AiSyncLogUpsertArgs>(args: SelectSubset<T, AiSyncLogUpsertArgs<ExtArgs>>): Prisma__AiSyncLogClient<$Result.GetResult<Prisma.$AiSyncLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiSyncLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSyncLogCountArgs} args - Arguments to filter AiSyncLogs to count.
     * @example
     * // Count the number of AiSyncLogs
     * const count = await prisma.aiSyncLog.count({
     *   where: {
     *     // ... the filter for the AiSyncLogs we want to count
     *   }
     * })
    **/
    count<T extends AiSyncLogCountArgs>(
      args?: Subset<T, AiSyncLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiSyncLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiSyncLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSyncLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiSyncLogAggregateArgs>(args: Subset<T, AiSyncLogAggregateArgs>): Prisma.PrismaPromise<GetAiSyncLogAggregateType<T>>

    /**
     * Group by AiSyncLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSyncLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiSyncLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiSyncLogGroupByArgs['orderBy'] }
        : { orderBy?: AiSyncLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiSyncLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiSyncLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiSyncLog model
   */
  readonly fields: AiSyncLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiSyncLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiSyncLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiSyncLog model
   */ 
  interface AiSyncLogFieldRefs {
    readonly id: FieldRef<"AiSyncLog", 'String'>
    readonly syncType: FieldRef<"AiSyncLog", 'String'>
    readonly recordsSynced: FieldRef<"AiSyncLog", 'Int'>
    readonly recordsFailed: FieldRef<"AiSyncLog", 'Int'>
    readonly status: FieldRef<"AiSyncLog", 'String'>
    readonly errorMessage: FieldRef<"AiSyncLog", 'String'>
    readonly createdAt: FieldRef<"AiSyncLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiSyncLog findUnique
   */
  export type AiSyncLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSyncLog to fetch.
     */
    where: AiSyncLogWhereUniqueInput
  }

  /**
   * AiSyncLog findUniqueOrThrow
   */
  export type AiSyncLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSyncLog to fetch.
     */
    where: AiSyncLogWhereUniqueInput
  }

  /**
   * AiSyncLog findFirst
   */
  export type AiSyncLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSyncLog to fetch.
     */
    where?: AiSyncLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSyncLogs to fetch.
     */
    orderBy?: AiSyncLogOrderByWithRelationInput | AiSyncLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiSyncLogs.
     */
    cursor?: AiSyncLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSyncLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSyncLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiSyncLogs.
     */
    distinct?: AiSyncLogScalarFieldEnum | AiSyncLogScalarFieldEnum[]
  }

  /**
   * AiSyncLog findFirstOrThrow
   */
  export type AiSyncLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSyncLog to fetch.
     */
    where?: AiSyncLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSyncLogs to fetch.
     */
    orderBy?: AiSyncLogOrderByWithRelationInput | AiSyncLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiSyncLogs.
     */
    cursor?: AiSyncLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSyncLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSyncLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiSyncLogs.
     */
    distinct?: AiSyncLogScalarFieldEnum | AiSyncLogScalarFieldEnum[]
  }

  /**
   * AiSyncLog findMany
   */
  export type AiSyncLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSyncLogs to fetch.
     */
    where?: AiSyncLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSyncLogs to fetch.
     */
    orderBy?: AiSyncLogOrderByWithRelationInput | AiSyncLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiSyncLogs.
     */
    cursor?: AiSyncLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSyncLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSyncLogs.
     */
    skip?: number
    distinct?: AiSyncLogScalarFieldEnum | AiSyncLogScalarFieldEnum[]
  }

  /**
   * AiSyncLog create
   */
  export type AiSyncLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AiSyncLog.
     */
    data: XOR<AiSyncLogCreateInput, AiSyncLogUncheckedCreateInput>
  }

  /**
   * AiSyncLog createMany
   */
  export type AiSyncLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiSyncLogs.
     */
    data: AiSyncLogCreateManyInput | AiSyncLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiSyncLog createManyAndReturn
   */
  export type AiSyncLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiSyncLogs.
     */
    data: AiSyncLogCreateManyInput | AiSyncLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiSyncLog update
   */
  export type AiSyncLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AiSyncLog.
     */
    data: XOR<AiSyncLogUpdateInput, AiSyncLogUncheckedUpdateInput>
    /**
     * Choose, which AiSyncLog to update.
     */
    where: AiSyncLogWhereUniqueInput
  }

  /**
   * AiSyncLog updateMany
   */
  export type AiSyncLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiSyncLogs.
     */
    data: XOR<AiSyncLogUpdateManyMutationInput, AiSyncLogUncheckedUpdateManyInput>
    /**
     * Filter which AiSyncLogs to update
     */
    where?: AiSyncLogWhereInput
  }

  /**
   * AiSyncLog upsert
   */
  export type AiSyncLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AiSyncLog to update in case it exists.
     */
    where: AiSyncLogWhereUniqueInput
    /**
     * In case the AiSyncLog found by the `where` argument doesn't exist, create a new AiSyncLog with this data.
     */
    create: XOR<AiSyncLogCreateInput, AiSyncLogUncheckedCreateInput>
    /**
     * In case the AiSyncLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiSyncLogUpdateInput, AiSyncLogUncheckedUpdateInput>
  }

  /**
   * AiSyncLog delete
   */
  export type AiSyncLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
    /**
     * Filter which AiSyncLog to delete.
     */
    where: AiSyncLogWhereUniqueInput
  }

  /**
   * AiSyncLog deleteMany
   */
  export type AiSyncLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiSyncLogs to delete
     */
    where?: AiSyncLogWhereInput
  }

  /**
   * AiSyncLog without action
   */
  export type AiSyncLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSyncLog
     */
    select?: AiSyncLogSelect<ExtArgs> | null
  }


  /**
   * Model AiVerificationLog
   */

  export type AggregateAiVerificationLog = {
    _count: AiVerificationLogCountAggregateOutputType | null
    _avg: AiVerificationLogAvgAggregateOutputType | null
    _sum: AiVerificationLogSumAggregateOutputType | null
    _min: AiVerificationLogMinAggregateOutputType | null
    _max: AiVerificationLogMaxAggregateOutputType | null
  }

  export type AiVerificationLogAvgAggregateOutputType = {
    targetVersion: number | null
  }

  export type AiVerificationLogSumAggregateOutputType = {
    targetVersion: number | null
  }

  export type AiVerificationLogMinAggregateOutputType = {
    id: string | null
    targetId: string | null
    targetType: string | null
    targetDisplayCode: string | null
    targetVersion: number | null
    sourceModule: string | null
    status: string | null
    riskLevel: string | null
    requiredRole: string | null
    verifiedBy: string | null
    verifiedAt: Date | null
    modelVersion: string | null
    isOrphan: boolean | null
    createdAt: Date | null
  }

  export type AiVerificationLogMaxAggregateOutputType = {
    id: string | null
    targetId: string | null
    targetType: string | null
    targetDisplayCode: string | null
    targetVersion: number | null
    sourceModule: string | null
    status: string | null
    riskLevel: string | null
    requiredRole: string | null
    verifiedBy: string | null
    verifiedAt: Date | null
    modelVersion: string | null
    isOrphan: boolean | null
    createdAt: Date | null
  }

  export type AiVerificationLogCountAggregateOutputType = {
    id: number
    targetId: number
    targetType: number
    targetDisplayCode: number
    targetVersion: number
    sourceModule: number
    aiProposedContent: number
    finalContent: number
    status: number
    riskLevel: number
    requiredRole: number
    verifiedBy: number
    verifiedAt: number
    modelVersion: number
    isOrphan: number
    createdAt: number
    _all: number
  }


  export type AiVerificationLogAvgAggregateInputType = {
    targetVersion?: true
  }

  export type AiVerificationLogSumAggregateInputType = {
    targetVersion?: true
  }

  export type AiVerificationLogMinAggregateInputType = {
    id?: true
    targetId?: true
    targetType?: true
    targetDisplayCode?: true
    targetVersion?: true
    sourceModule?: true
    status?: true
    riskLevel?: true
    requiredRole?: true
    verifiedBy?: true
    verifiedAt?: true
    modelVersion?: true
    isOrphan?: true
    createdAt?: true
  }

  export type AiVerificationLogMaxAggregateInputType = {
    id?: true
    targetId?: true
    targetType?: true
    targetDisplayCode?: true
    targetVersion?: true
    sourceModule?: true
    status?: true
    riskLevel?: true
    requiredRole?: true
    verifiedBy?: true
    verifiedAt?: true
    modelVersion?: true
    isOrphan?: true
    createdAt?: true
  }

  export type AiVerificationLogCountAggregateInputType = {
    id?: true
    targetId?: true
    targetType?: true
    targetDisplayCode?: true
    targetVersion?: true
    sourceModule?: true
    aiProposedContent?: true
    finalContent?: true
    status?: true
    riskLevel?: true
    requiredRole?: true
    verifiedBy?: true
    verifiedAt?: true
    modelVersion?: true
    isOrphan?: true
    createdAt?: true
    _all?: true
  }

  export type AiVerificationLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiVerificationLog to aggregate.
     */
    where?: AiVerificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiVerificationLogs to fetch.
     */
    orderBy?: AiVerificationLogOrderByWithRelationInput | AiVerificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiVerificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiVerificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiVerificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiVerificationLogs
    **/
    _count?: true | AiVerificationLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiVerificationLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiVerificationLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiVerificationLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiVerificationLogMaxAggregateInputType
  }

  export type GetAiVerificationLogAggregateType<T extends AiVerificationLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAiVerificationLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiVerificationLog[P]>
      : GetScalarType<T[P], AggregateAiVerificationLog[P]>
  }




  export type AiVerificationLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiVerificationLogWhereInput
    orderBy?: AiVerificationLogOrderByWithAggregationInput | AiVerificationLogOrderByWithAggregationInput[]
    by: AiVerificationLogScalarFieldEnum[] | AiVerificationLogScalarFieldEnum
    having?: AiVerificationLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiVerificationLogCountAggregateInputType | true
    _avg?: AiVerificationLogAvgAggregateInputType
    _sum?: AiVerificationLogSumAggregateInputType
    _min?: AiVerificationLogMinAggregateInputType
    _max?: AiVerificationLogMaxAggregateInputType
  }

  export type AiVerificationLogGroupByOutputType = {
    id: string
    targetId: string
    targetType: string
    targetDisplayCode: string | null
    targetVersion: number | null
    sourceModule: string
    aiProposedContent: JsonValue
    finalContent: JsonValue | null
    status: string
    riskLevel: string
    requiredRole: string
    verifiedBy: string | null
    verifiedAt: Date | null
    modelVersion: string | null
    isOrphan: boolean
    createdAt: Date
    _count: AiVerificationLogCountAggregateOutputType | null
    _avg: AiVerificationLogAvgAggregateOutputType | null
    _sum: AiVerificationLogSumAggregateOutputType | null
    _min: AiVerificationLogMinAggregateOutputType | null
    _max: AiVerificationLogMaxAggregateOutputType | null
  }

  type GetAiVerificationLogGroupByPayload<T extends AiVerificationLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiVerificationLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiVerificationLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiVerificationLogGroupByOutputType[P]>
            : GetScalarType<T[P], AiVerificationLogGroupByOutputType[P]>
        }
      >
    >


  export type AiVerificationLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    targetId?: boolean
    targetType?: boolean
    targetDisplayCode?: boolean
    targetVersion?: boolean
    sourceModule?: boolean
    aiProposedContent?: boolean
    finalContent?: boolean
    status?: boolean
    riskLevel?: boolean
    requiredRole?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    modelVersion?: boolean
    isOrphan?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiVerificationLog"]>

  export type AiVerificationLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    targetId?: boolean
    targetType?: boolean
    targetDisplayCode?: boolean
    targetVersion?: boolean
    sourceModule?: boolean
    aiProposedContent?: boolean
    finalContent?: boolean
    status?: boolean
    riskLevel?: boolean
    requiredRole?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    modelVersion?: boolean
    isOrphan?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiVerificationLog"]>

  export type AiVerificationLogSelectScalar = {
    id?: boolean
    targetId?: boolean
    targetType?: boolean
    targetDisplayCode?: boolean
    targetVersion?: boolean
    sourceModule?: boolean
    aiProposedContent?: boolean
    finalContent?: boolean
    status?: boolean
    riskLevel?: boolean
    requiredRole?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    modelVersion?: boolean
    isOrphan?: boolean
    createdAt?: boolean
  }


  export type $AiVerificationLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiVerificationLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      targetId: string
      targetType: string
      targetDisplayCode: string | null
      targetVersion: number | null
      sourceModule: string
      aiProposedContent: Prisma.JsonValue
      finalContent: Prisma.JsonValue | null
      status: string
      riskLevel: string
      requiredRole: string
      verifiedBy: string | null
      verifiedAt: Date | null
      modelVersion: string | null
      isOrphan: boolean
      createdAt: Date
    }, ExtArgs["result"]["aiVerificationLog"]>
    composites: {}
  }

  type AiVerificationLogGetPayload<S extends boolean | null | undefined | AiVerificationLogDefaultArgs> = $Result.GetResult<Prisma.$AiVerificationLogPayload, S>

  type AiVerificationLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiVerificationLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiVerificationLogCountAggregateInputType | true
    }

  export interface AiVerificationLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiVerificationLog'], meta: { name: 'AiVerificationLog' } }
    /**
     * Find zero or one AiVerificationLog that matches the filter.
     * @param {AiVerificationLogFindUniqueArgs} args - Arguments to find a AiVerificationLog
     * @example
     * // Get one AiVerificationLog
     * const aiVerificationLog = await prisma.aiVerificationLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiVerificationLogFindUniqueArgs>(args: SelectSubset<T, AiVerificationLogFindUniqueArgs<ExtArgs>>): Prisma__AiVerificationLogClient<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiVerificationLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiVerificationLogFindUniqueOrThrowArgs} args - Arguments to find a AiVerificationLog
     * @example
     * // Get one AiVerificationLog
     * const aiVerificationLog = await prisma.aiVerificationLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiVerificationLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AiVerificationLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiVerificationLogClient<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiVerificationLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiVerificationLogFindFirstArgs} args - Arguments to find a AiVerificationLog
     * @example
     * // Get one AiVerificationLog
     * const aiVerificationLog = await prisma.aiVerificationLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiVerificationLogFindFirstArgs>(args?: SelectSubset<T, AiVerificationLogFindFirstArgs<ExtArgs>>): Prisma__AiVerificationLogClient<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiVerificationLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiVerificationLogFindFirstOrThrowArgs} args - Arguments to find a AiVerificationLog
     * @example
     * // Get one AiVerificationLog
     * const aiVerificationLog = await prisma.aiVerificationLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiVerificationLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AiVerificationLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiVerificationLogClient<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiVerificationLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiVerificationLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiVerificationLogs
     * const aiVerificationLogs = await prisma.aiVerificationLog.findMany()
     * 
     * // Get first 10 AiVerificationLogs
     * const aiVerificationLogs = await prisma.aiVerificationLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiVerificationLogWithIdOnly = await prisma.aiVerificationLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiVerificationLogFindManyArgs>(args?: SelectSubset<T, AiVerificationLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiVerificationLog.
     * @param {AiVerificationLogCreateArgs} args - Arguments to create a AiVerificationLog.
     * @example
     * // Create one AiVerificationLog
     * const AiVerificationLog = await prisma.aiVerificationLog.create({
     *   data: {
     *     // ... data to create a AiVerificationLog
     *   }
     * })
     * 
     */
    create<T extends AiVerificationLogCreateArgs>(args: SelectSubset<T, AiVerificationLogCreateArgs<ExtArgs>>): Prisma__AiVerificationLogClient<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiVerificationLogs.
     * @param {AiVerificationLogCreateManyArgs} args - Arguments to create many AiVerificationLogs.
     * @example
     * // Create many AiVerificationLogs
     * const aiVerificationLog = await prisma.aiVerificationLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiVerificationLogCreateManyArgs>(args?: SelectSubset<T, AiVerificationLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiVerificationLogs and returns the data saved in the database.
     * @param {AiVerificationLogCreateManyAndReturnArgs} args - Arguments to create many AiVerificationLogs.
     * @example
     * // Create many AiVerificationLogs
     * const aiVerificationLog = await prisma.aiVerificationLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiVerificationLogs and only return the `id`
     * const aiVerificationLogWithIdOnly = await prisma.aiVerificationLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiVerificationLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AiVerificationLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiVerificationLog.
     * @param {AiVerificationLogDeleteArgs} args - Arguments to delete one AiVerificationLog.
     * @example
     * // Delete one AiVerificationLog
     * const AiVerificationLog = await prisma.aiVerificationLog.delete({
     *   where: {
     *     // ... filter to delete one AiVerificationLog
     *   }
     * })
     * 
     */
    delete<T extends AiVerificationLogDeleteArgs>(args: SelectSubset<T, AiVerificationLogDeleteArgs<ExtArgs>>): Prisma__AiVerificationLogClient<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiVerificationLog.
     * @param {AiVerificationLogUpdateArgs} args - Arguments to update one AiVerificationLog.
     * @example
     * // Update one AiVerificationLog
     * const aiVerificationLog = await prisma.aiVerificationLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiVerificationLogUpdateArgs>(args: SelectSubset<T, AiVerificationLogUpdateArgs<ExtArgs>>): Prisma__AiVerificationLogClient<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiVerificationLogs.
     * @param {AiVerificationLogDeleteManyArgs} args - Arguments to filter AiVerificationLogs to delete.
     * @example
     * // Delete a few AiVerificationLogs
     * const { count } = await prisma.aiVerificationLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiVerificationLogDeleteManyArgs>(args?: SelectSubset<T, AiVerificationLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiVerificationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiVerificationLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiVerificationLogs
     * const aiVerificationLog = await prisma.aiVerificationLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiVerificationLogUpdateManyArgs>(args: SelectSubset<T, AiVerificationLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiVerificationLog.
     * @param {AiVerificationLogUpsertArgs} args - Arguments to update or create a AiVerificationLog.
     * @example
     * // Update or create a AiVerificationLog
     * const aiVerificationLog = await prisma.aiVerificationLog.upsert({
     *   create: {
     *     // ... data to create a AiVerificationLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiVerificationLog we want to update
     *   }
     * })
     */
    upsert<T extends AiVerificationLogUpsertArgs>(args: SelectSubset<T, AiVerificationLogUpsertArgs<ExtArgs>>): Prisma__AiVerificationLogClient<$Result.GetResult<Prisma.$AiVerificationLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiVerificationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiVerificationLogCountArgs} args - Arguments to filter AiVerificationLogs to count.
     * @example
     * // Count the number of AiVerificationLogs
     * const count = await prisma.aiVerificationLog.count({
     *   where: {
     *     // ... the filter for the AiVerificationLogs we want to count
     *   }
     * })
    **/
    count<T extends AiVerificationLogCountArgs>(
      args?: Subset<T, AiVerificationLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiVerificationLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiVerificationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiVerificationLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiVerificationLogAggregateArgs>(args: Subset<T, AiVerificationLogAggregateArgs>): Prisma.PrismaPromise<GetAiVerificationLogAggregateType<T>>

    /**
     * Group by AiVerificationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiVerificationLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiVerificationLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiVerificationLogGroupByArgs['orderBy'] }
        : { orderBy?: AiVerificationLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiVerificationLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiVerificationLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiVerificationLog model
   */
  readonly fields: AiVerificationLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiVerificationLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiVerificationLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiVerificationLog model
   */ 
  interface AiVerificationLogFieldRefs {
    readonly id: FieldRef<"AiVerificationLog", 'String'>
    readonly targetId: FieldRef<"AiVerificationLog", 'String'>
    readonly targetType: FieldRef<"AiVerificationLog", 'String'>
    readonly targetDisplayCode: FieldRef<"AiVerificationLog", 'String'>
    readonly targetVersion: FieldRef<"AiVerificationLog", 'Int'>
    readonly sourceModule: FieldRef<"AiVerificationLog", 'String'>
    readonly aiProposedContent: FieldRef<"AiVerificationLog", 'Json'>
    readonly finalContent: FieldRef<"AiVerificationLog", 'Json'>
    readonly status: FieldRef<"AiVerificationLog", 'String'>
    readonly riskLevel: FieldRef<"AiVerificationLog", 'String'>
    readonly requiredRole: FieldRef<"AiVerificationLog", 'String'>
    readonly verifiedBy: FieldRef<"AiVerificationLog", 'String'>
    readonly verifiedAt: FieldRef<"AiVerificationLog", 'DateTime'>
    readonly modelVersion: FieldRef<"AiVerificationLog", 'String'>
    readonly isOrphan: FieldRef<"AiVerificationLog", 'Boolean'>
    readonly createdAt: FieldRef<"AiVerificationLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiVerificationLog findUnique
   */
  export type AiVerificationLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
    /**
     * Filter, which AiVerificationLog to fetch.
     */
    where: AiVerificationLogWhereUniqueInput
  }

  /**
   * AiVerificationLog findUniqueOrThrow
   */
  export type AiVerificationLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
    /**
     * Filter, which AiVerificationLog to fetch.
     */
    where: AiVerificationLogWhereUniqueInput
  }

  /**
   * AiVerificationLog findFirst
   */
  export type AiVerificationLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
    /**
     * Filter, which AiVerificationLog to fetch.
     */
    where?: AiVerificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiVerificationLogs to fetch.
     */
    orderBy?: AiVerificationLogOrderByWithRelationInput | AiVerificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiVerificationLogs.
     */
    cursor?: AiVerificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiVerificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiVerificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiVerificationLogs.
     */
    distinct?: AiVerificationLogScalarFieldEnum | AiVerificationLogScalarFieldEnum[]
  }

  /**
   * AiVerificationLog findFirstOrThrow
   */
  export type AiVerificationLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
    /**
     * Filter, which AiVerificationLog to fetch.
     */
    where?: AiVerificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiVerificationLogs to fetch.
     */
    orderBy?: AiVerificationLogOrderByWithRelationInput | AiVerificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiVerificationLogs.
     */
    cursor?: AiVerificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiVerificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiVerificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiVerificationLogs.
     */
    distinct?: AiVerificationLogScalarFieldEnum | AiVerificationLogScalarFieldEnum[]
  }

  /**
   * AiVerificationLog findMany
   */
  export type AiVerificationLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
    /**
     * Filter, which AiVerificationLogs to fetch.
     */
    where?: AiVerificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiVerificationLogs to fetch.
     */
    orderBy?: AiVerificationLogOrderByWithRelationInput | AiVerificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiVerificationLogs.
     */
    cursor?: AiVerificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiVerificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiVerificationLogs.
     */
    skip?: number
    distinct?: AiVerificationLogScalarFieldEnum | AiVerificationLogScalarFieldEnum[]
  }

  /**
   * AiVerificationLog create
   */
  export type AiVerificationLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AiVerificationLog.
     */
    data: XOR<AiVerificationLogCreateInput, AiVerificationLogUncheckedCreateInput>
  }

  /**
   * AiVerificationLog createMany
   */
  export type AiVerificationLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiVerificationLogs.
     */
    data: AiVerificationLogCreateManyInput | AiVerificationLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiVerificationLog createManyAndReturn
   */
  export type AiVerificationLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiVerificationLogs.
     */
    data: AiVerificationLogCreateManyInput | AiVerificationLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiVerificationLog update
   */
  export type AiVerificationLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AiVerificationLog.
     */
    data: XOR<AiVerificationLogUpdateInput, AiVerificationLogUncheckedUpdateInput>
    /**
     * Choose, which AiVerificationLog to update.
     */
    where: AiVerificationLogWhereUniqueInput
  }

  /**
   * AiVerificationLog updateMany
   */
  export type AiVerificationLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiVerificationLogs.
     */
    data: XOR<AiVerificationLogUpdateManyMutationInput, AiVerificationLogUncheckedUpdateManyInput>
    /**
     * Filter which AiVerificationLogs to update
     */
    where?: AiVerificationLogWhereInput
  }

  /**
   * AiVerificationLog upsert
   */
  export type AiVerificationLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AiVerificationLog to update in case it exists.
     */
    where: AiVerificationLogWhereUniqueInput
    /**
     * In case the AiVerificationLog found by the `where` argument doesn't exist, create a new AiVerificationLog with this data.
     */
    create: XOR<AiVerificationLogCreateInput, AiVerificationLogUncheckedCreateInput>
    /**
     * In case the AiVerificationLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiVerificationLogUpdateInput, AiVerificationLogUncheckedUpdateInput>
  }

  /**
   * AiVerificationLog delete
   */
  export type AiVerificationLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
    /**
     * Filter which AiVerificationLog to delete.
     */
    where: AiVerificationLogWhereUniqueInput
  }

  /**
   * AiVerificationLog deleteMany
   */
  export type AiVerificationLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiVerificationLogs to delete
     */
    where?: AiVerificationLogWhereInput
  }

  /**
   * AiVerificationLog without action
   */
  export type AiVerificationLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiVerificationLog
     */
    select?: AiVerificationLogSelect<ExtArgs> | null
  }


  /**
   * Model AiSafetyLog
   */

  export type AggregateAiSafetyLog = {
    _count: AiSafetyLogCountAggregateOutputType | null
    _min: AiSafetyLogMinAggregateOutputType | null
    _max: AiSafetyLogMaxAggregateOutputType | null
  }

  export type AiSafetyLogMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    eventId: string | null
    userId: string | null
    targetType: string | null
    targetId: string | null
    action: string | null
    riskLevel: string | null
    details: string | null
    isImmutable: boolean | null
    isOrphan: boolean | null
  }

  export type AiSafetyLogMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    eventId: string | null
    userId: string | null
    targetType: string | null
    targetId: string | null
    action: string | null
    riskLevel: string | null
    details: string | null
    isImmutable: boolean | null
    isOrphan: boolean | null
  }

  export type AiSafetyLogCountAggregateOutputType = {
    id: number
    timestamp: number
    eventId: number
    userId: number
    targetType: number
    targetId: number
    action: number
    riskLevel: number
    details: number
    isImmutable: number
    isOrphan: number
    _all: number
  }


  export type AiSafetyLogMinAggregateInputType = {
    id?: true
    timestamp?: true
    eventId?: true
    userId?: true
    targetType?: true
    targetId?: true
    action?: true
    riskLevel?: true
    details?: true
    isImmutable?: true
    isOrphan?: true
  }

  export type AiSafetyLogMaxAggregateInputType = {
    id?: true
    timestamp?: true
    eventId?: true
    userId?: true
    targetType?: true
    targetId?: true
    action?: true
    riskLevel?: true
    details?: true
    isImmutable?: true
    isOrphan?: true
  }

  export type AiSafetyLogCountAggregateInputType = {
    id?: true
    timestamp?: true
    eventId?: true
    userId?: true
    targetType?: true
    targetId?: true
    action?: true
    riskLevel?: true
    details?: true
    isImmutable?: true
    isOrphan?: true
    _all?: true
  }

  export type AiSafetyLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiSafetyLog to aggregate.
     */
    where?: AiSafetyLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSafetyLogs to fetch.
     */
    orderBy?: AiSafetyLogOrderByWithRelationInput | AiSafetyLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiSafetyLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSafetyLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSafetyLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiSafetyLogs
    **/
    _count?: true | AiSafetyLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiSafetyLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiSafetyLogMaxAggregateInputType
  }

  export type GetAiSafetyLogAggregateType<T extends AiSafetyLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAiSafetyLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiSafetyLog[P]>
      : GetScalarType<T[P], AggregateAiSafetyLog[P]>
  }




  export type AiSafetyLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiSafetyLogWhereInput
    orderBy?: AiSafetyLogOrderByWithAggregationInput | AiSafetyLogOrderByWithAggregationInput[]
    by: AiSafetyLogScalarFieldEnum[] | AiSafetyLogScalarFieldEnum
    having?: AiSafetyLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiSafetyLogCountAggregateInputType | true
    _min?: AiSafetyLogMinAggregateInputType
    _max?: AiSafetyLogMaxAggregateInputType
  }

  export type AiSafetyLogGroupByOutputType = {
    id: string
    timestamp: Date
    eventId: string
    userId: string
    targetType: string | null
    targetId: string | null
    action: string
    riskLevel: string
    details: string
    isImmutable: boolean
    isOrphan: boolean
    _count: AiSafetyLogCountAggregateOutputType | null
    _min: AiSafetyLogMinAggregateOutputType | null
    _max: AiSafetyLogMaxAggregateOutputType | null
  }

  type GetAiSafetyLogGroupByPayload<T extends AiSafetyLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiSafetyLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiSafetyLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiSafetyLogGroupByOutputType[P]>
            : GetScalarType<T[P], AiSafetyLogGroupByOutputType[P]>
        }
      >
    >


  export type AiSafetyLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    eventId?: boolean
    userId?: boolean
    targetType?: boolean
    targetId?: boolean
    action?: boolean
    riskLevel?: boolean
    details?: boolean
    isImmutable?: boolean
    isOrphan?: boolean
  }, ExtArgs["result"]["aiSafetyLog"]>

  export type AiSafetyLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    eventId?: boolean
    userId?: boolean
    targetType?: boolean
    targetId?: boolean
    action?: boolean
    riskLevel?: boolean
    details?: boolean
    isImmutable?: boolean
    isOrphan?: boolean
  }, ExtArgs["result"]["aiSafetyLog"]>

  export type AiSafetyLogSelectScalar = {
    id?: boolean
    timestamp?: boolean
    eventId?: boolean
    userId?: boolean
    targetType?: boolean
    targetId?: boolean
    action?: boolean
    riskLevel?: boolean
    details?: boolean
    isImmutable?: boolean
    isOrphan?: boolean
  }


  export type $AiSafetyLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiSafetyLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      eventId: string
      userId: string
      targetType: string | null
      targetId: string | null
      action: string
      riskLevel: string
      details: string
      isImmutable: boolean
      isOrphan: boolean
    }, ExtArgs["result"]["aiSafetyLog"]>
    composites: {}
  }

  type AiSafetyLogGetPayload<S extends boolean | null | undefined | AiSafetyLogDefaultArgs> = $Result.GetResult<Prisma.$AiSafetyLogPayload, S>

  type AiSafetyLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiSafetyLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiSafetyLogCountAggregateInputType | true
    }

  export interface AiSafetyLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiSafetyLog'], meta: { name: 'AiSafetyLog' } }
    /**
     * Find zero or one AiSafetyLog that matches the filter.
     * @param {AiSafetyLogFindUniqueArgs} args - Arguments to find a AiSafetyLog
     * @example
     * // Get one AiSafetyLog
     * const aiSafetyLog = await prisma.aiSafetyLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiSafetyLogFindUniqueArgs>(args: SelectSubset<T, AiSafetyLogFindUniqueArgs<ExtArgs>>): Prisma__AiSafetyLogClient<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiSafetyLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiSafetyLogFindUniqueOrThrowArgs} args - Arguments to find a AiSafetyLog
     * @example
     * // Get one AiSafetyLog
     * const aiSafetyLog = await prisma.aiSafetyLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiSafetyLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AiSafetyLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiSafetyLogClient<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiSafetyLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSafetyLogFindFirstArgs} args - Arguments to find a AiSafetyLog
     * @example
     * // Get one AiSafetyLog
     * const aiSafetyLog = await prisma.aiSafetyLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiSafetyLogFindFirstArgs>(args?: SelectSubset<T, AiSafetyLogFindFirstArgs<ExtArgs>>): Prisma__AiSafetyLogClient<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiSafetyLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSafetyLogFindFirstOrThrowArgs} args - Arguments to find a AiSafetyLog
     * @example
     * // Get one AiSafetyLog
     * const aiSafetyLog = await prisma.aiSafetyLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiSafetyLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AiSafetyLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiSafetyLogClient<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiSafetyLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSafetyLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiSafetyLogs
     * const aiSafetyLogs = await prisma.aiSafetyLog.findMany()
     * 
     * // Get first 10 AiSafetyLogs
     * const aiSafetyLogs = await prisma.aiSafetyLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiSafetyLogWithIdOnly = await prisma.aiSafetyLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiSafetyLogFindManyArgs>(args?: SelectSubset<T, AiSafetyLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiSafetyLog.
     * @param {AiSafetyLogCreateArgs} args - Arguments to create a AiSafetyLog.
     * @example
     * // Create one AiSafetyLog
     * const AiSafetyLog = await prisma.aiSafetyLog.create({
     *   data: {
     *     // ... data to create a AiSafetyLog
     *   }
     * })
     * 
     */
    create<T extends AiSafetyLogCreateArgs>(args: SelectSubset<T, AiSafetyLogCreateArgs<ExtArgs>>): Prisma__AiSafetyLogClient<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiSafetyLogs.
     * @param {AiSafetyLogCreateManyArgs} args - Arguments to create many AiSafetyLogs.
     * @example
     * // Create many AiSafetyLogs
     * const aiSafetyLog = await prisma.aiSafetyLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiSafetyLogCreateManyArgs>(args?: SelectSubset<T, AiSafetyLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiSafetyLogs and returns the data saved in the database.
     * @param {AiSafetyLogCreateManyAndReturnArgs} args - Arguments to create many AiSafetyLogs.
     * @example
     * // Create many AiSafetyLogs
     * const aiSafetyLog = await prisma.aiSafetyLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiSafetyLogs and only return the `id`
     * const aiSafetyLogWithIdOnly = await prisma.aiSafetyLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiSafetyLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AiSafetyLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiSafetyLog.
     * @param {AiSafetyLogDeleteArgs} args - Arguments to delete one AiSafetyLog.
     * @example
     * // Delete one AiSafetyLog
     * const AiSafetyLog = await prisma.aiSafetyLog.delete({
     *   where: {
     *     // ... filter to delete one AiSafetyLog
     *   }
     * })
     * 
     */
    delete<T extends AiSafetyLogDeleteArgs>(args: SelectSubset<T, AiSafetyLogDeleteArgs<ExtArgs>>): Prisma__AiSafetyLogClient<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiSafetyLog.
     * @param {AiSafetyLogUpdateArgs} args - Arguments to update one AiSafetyLog.
     * @example
     * // Update one AiSafetyLog
     * const aiSafetyLog = await prisma.aiSafetyLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiSafetyLogUpdateArgs>(args: SelectSubset<T, AiSafetyLogUpdateArgs<ExtArgs>>): Prisma__AiSafetyLogClient<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiSafetyLogs.
     * @param {AiSafetyLogDeleteManyArgs} args - Arguments to filter AiSafetyLogs to delete.
     * @example
     * // Delete a few AiSafetyLogs
     * const { count } = await prisma.aiSafetyLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiSafetyLogDeleteManyArgs>(args?: SelectSubset<T, AiSafetyLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiSafetyLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSafetyLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiSafetyLogs
     * const aiSafetyLog = await prisma.aiSafetyLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiSafetyLogUpdateManyArgs>(args: SelectSubset<T, AiSafetyLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiSafetyLog.
     * @param {AiSafetyLogUpsertArgs} args - Arguments to update or create a AiSafetyLog.
     * @example
     * // Update or create a AiSafetyLog
     * const aiSafetyLog = await prisma.aiSafetyLog.upsert({
     *   create: {
     *     // ... data to create a AiSafetyLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiSafetyLog we want to update
     *   }
     * })
     */
    upsert<T extends AiSafetyLogUpsertArgs>(args: SelectSubset<T, AiSafetyLogUpsertArgs<ExtArgs>>): Prisma__AiSafetyLogClient<$Result.GetResult<Prisma.$AiSafetyLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiSafetyLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSafetyLogCountArgs} args - Arguments to filter AiSafetyLogs to count.
     * @example
     * // Count the number of AiSafetyLogs
     * const count = await prisma.aiSafetyLog.count({
     *   where: {
     *     // ... the filter for the AiSafetyLogs we want to count
     *   }
     * })
    **/
    count<T extends AiSafetyLogCountArgs>(
      args?: Subset<T, AiSafetyLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiSafetyLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiSafetyLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSafetyLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiSafetyLogAggregateArgs>(args: Subset<T, AiSafetyLogAggregateArgs>): Prisma.PrismaPromise<GetAiSafetyLogAggregateType<T>>

    /**
     * Group by AiSafetyLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSafetyLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiSafetyLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiSafetyLogGroupByArgs['orderBy'] }
        : { orderBy?: AiSafetyLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiSafetyLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiSafetyLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiSafetyLog model
   */
  readonly fields: AiSafetyLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiSafetyLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiSafetyLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiSafetyLog model
   */ 
  interface AiSafetyLogFieldRefs {
    readonly id: FieldRef<"AiSafetyLog", 'String'>
    readonly timestamp: FieldRef<"AiSafetyLog", 'DateTime'>
    readonly eventId: FieldRef<"AiSafetyLog", 'String'>
    readonly userId: FieldRef<"AiSafetyLog", 'String'>
    readonly targetType: FieldRef<"AiSafetyLog", 'String'>
    readonly targetId: FieldRef<"AiSafetyLog", 'String'>
    readonly action: FieldRef<"AiSafetyLog", 'String'>
    readonly riskLevel: FieldRef<"AiSafetyLog", 'String'>
    readonly details: FieldRef<"AiSafetyLog", 'String'>
    readonly isImmutable: FieldRef<"AiSafetyLog", 'Boolean'>
    readonly isOrphan: FieldRef<"AiSafetyLog", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * AiSafetyLog findUnique
   */
  export type AiSafetyLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSafetyLog to fetch.
     */
    where: AiSafetyLogWhereUniqueInput
  }

  /**
   * AiSafetyLog findUniqueOrThrow
   */
  export type AiSafetyLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSafetyLog to fetch.
     */
    where: AiSafetyLogWhereUniqueInput
  }

  /**
   * AiSafetyLog findFirst
   */
  export type AiSafetyLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSafetyLog to fetch.
     */
    where?: AiSafetyLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSafetyLogs to fetch.
     */
    orderBy?: AiSafetyLogOrderByWithRelationInput | AiSafetyLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiSafetyLogs.
     */
    cursor?: AiSafetyLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSafetyLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSafetyLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiSafetyLogs.
     */
    distinct?: AiSafetyLogScalarFieldEnum | AiSafetyLogScalarFieldEnum[]
  }

  /**
   * AiSafetyLog findFirstOrThrow
   */
  export type AiSafetyLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSafetyLog to fetch.
     */
    where?: AiSafetyLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSafetyLogs to fetch.
     */
    orderBy?: AiSafetyLogOrderByWithRelationInput | AiSafetyLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiSafetyLogs.
     */
    cursor?: AiSafetyLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSafetyLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSafetyLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiSafetyLogs.
     */
    distinct?: AiSafetyLogScalarFieldEnum | AiSafetyLogScalarFieldEnum[]
  }

  /**
   * AiSafetyLog findMany
   */
  export type AiSafetyLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
    /**
     * Filter, which AiSafetyLogs to fetch.
     */
    where?: AiSafetyLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSafetyLogs to fetch.
     */
    orderBy?: AiSafetyLogOrderByWithRelationInput | AiSafetyLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiSafetyLogs.
     */
    cursor?: AiSafetyLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSafetyLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSafetyLogs.
     */
    skip?: number
    distinct?: AiSafetyLogScalarFieldEnum | AiSafetyLogScalarFieldEnum[]
  }

  /**
   * AiSafetyLog create
   */
  export type AiSafetyLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AiSafetyLog.
     */
    data: XOR<AiSafetyLogCreateInput, AiSafetyLogUncheckedCreateInput>
  }

  /**
   * AiSafetyLog createMany
   */
  export type AiSafetyLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiSafetyLogs.
     */
    data: AiSafetyLogCreateManyInput | AiSafetyLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiSafetyLog createManyAndReturn
   */
  export type AiSafetyLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiSafetyLogs.
     */
    data: AiSafetyLogCreateManyInput | AiSafetyLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiSafetyLog update
   */
  export type AiSafetyLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AiSafetyLog.
     */
    data: XOR<AiSafetyLogUpdateInput, AiSafetyLogUncheckedUpdateInput>
    /**
     * Choose, which AiSafetyLog to update.
     */
    where: AiSafetyLogWhereUniqueInput
  }

  /**
   * AiSafetyLog updateMany
   */
  export type AiSafetyLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiSafetyLogs.
     */
    data: XOR<AiSafetyLogUpdateManyMutationInput, AiSafetyLogUncheckedUpdateManyInput>
    /**
     * Filter which AiSafetyLogs to update
     */
    where?: AiSafetyLogWhereInput
  }

  /**
   * AiSafetyLog upsert
   */
  export type AiSafetyLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AiSafetyLog to update in case it exists.
     */
    where: AiSafetyLogWhereUniqueInput
    /**
     * In case the AiSafetyLog found by the `where` argument doesn't exist, create a new AiSafetyLog with this data.
     */
    create: XOR<AiSafetyLogCreateInput, AiSafetyLogUncheckedCreateInput>
    /**
     * In case the AiSafetyLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiSafetyLogUpdateInput, AiSafetyLogUncheckedUpdateInput>
  }

  /**
   * AiSafetyLog delete
   */
  export type AiSafetyLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
    /**
     * Filter which AiSafetyLog to delete.
     */
    where: AiSafetyLogWhereUniqueInput
  }

  /**
   * AiSafetyLog deleteMany
   */
  export type AiSafetyLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiSafetyLogs to delete
     */
    where?: AiSafetyLogWhereInput
  }

  /**
   * AiSafetyLog without action
   */
  export type AiSafetyLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSafetyLog
     */
    select?: AiSafetyLogSelect<ExtArgs> | null
  }


  /**
   * Model AiRequestLog
   */

  export type AggregateAiRequestLog = {
    _count: AiRequestLogCountAggregateOutputType | null
    _avg: AiRequestLogAvgAggregateOutputType | null
    _sum: AiRequestLogSumAggregateOutputType | null
    _min: AiRequestLogMinAggregateOutputType | null
    _max: AiRequestLogMaxAggregateOutputType | null
  }

  export type AiRequestLogAvgAggregateOutputType = {
    promptTokens: number | null
    completionTokens: number | null
    latencyMs: number | null
    status: number | null
  }

  export type AiRequestLogSumAggregateOutputType = {
    promptTokens: number | null
    completionTokens: number | null
    latencyMs: number | null
    status: number | null
  }

  export type AiRequestLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    targetType: string | null
    targetId: string | null
    modelName: string | null
    promptTokens: number | null
    completionTokens: number | null
    latencyMs: number | null
    status: number | null
    error: string | null
    isOrphan: boolean | null
    createdAt: Date | null
  }

  export type AiRequestLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    targetType: string | null
    targetId: string | null
    modelName: string | null
    promptTokens: number | null
    completionTokens: number | null
    latencyMs: number | null
    status: number | null
    error: string | null
    isOrphan: boolean | null
    createdAt: Date | null
  }

  export type AiRequestLogCountAggregateOutputType = {
    id: number
    userId: number
    targetType: number
    targetId: number
    modelName: number
    promptTokens: number
    completionTokens: number
    latencyMs: number
    status: number
    error: number
    isOrphan: number
    createdAt: number
    _all: number
  }


  export type AiRequestLogAvgAggregateInputType = {
    promptTokens?: true
    completionTokens?: true
    latencyMs?: true
    status?: true
  }

  export type AiRequestLogSumAggregateInputType = {
    promptTokens?: true
    completionTokens?: true
    latencyMs?: true
    status?: true
  }

  export type AiRequestLogMinAggregateInputType = {
    id?: true
    userId?: true
    targetType?: true
    targetId?: true
    modelName?: true
    promptTokens?: true
    completionTokens?: true
    latencyMs?: true
    status?: true
    error?: true
    isOrphan?: true
    createdAt?: true
  }

  export type AiRequestLogMaxAggregateInputType = {
    id?: true
    userId?: true
    targetType?: true
    targetId?: true
    modelName?: true
    promptTokens?: true
    completionTokens?: true
    latencyMs?: true
    status?: true
    error?: true
    isOrphan?: true
    createdAt?: true
  }

  export type AiRequestLogCountAggregateInputType = {
    id?: true
    userId?: true
    targetType?: true
    targetId?: true
    modelName?: true
    promptTokens?: true
    completionTokens?: true
    latencyMs?: true
    status?: true
    error?: true
    isOrphan?: true
    createdAt?: true
    _all?: true
  }

  export type AiRequestLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiRequestLog to aggregate.
     */
    where?: AiRequestLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiRequestLogs to fetch.
     */
    orderBy?: AiRequestLogOrderByWithRelationInput | AiRequestLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiRequestLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiRequestLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiRequestLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiRequestLogs
    **/
    _count?: true | AiRequestLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiRequestLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiRequestLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiRequestLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiRequestLogMaxAggregateInputType
  }

  export type GetAiRequestLogAggregateType<T extends AiRequestLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAiRequestLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiRequestLog[P]>
      : GetScalarType<T[P], AggregateAiRequestLog[P]>
  }




  export type AiRequestLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiRequestLogWhereInput
    orderBy?: AiRequestLogOrderByWithAggregationInput | AiRequestLogOrderByWithAggregationInput[]
    by: AiRequestLogScalarFieldEnum[] | AiRequestLogScalarFieldEnum
    having?: AiRequestLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiRequestLogCountAggregateInputType | true
    _avg?: AiRequestLogAvgAggregateInputType
    _sum?: AiRequestLogSumAggregateInputType
    _min?: AiRequestLogMinAggregateInputType
    _max?: AiRequestLogMaxAggregateInputType
  }

  export type AiRequestLogGroupByOutputType = {
    id: string
    userId: string
    targetType: string | null
    targetId: string | null
    modelName: string
    promptTokens: number
    completionTokens: number
    latencyMs: number
    status: number
    error: string | null
    isOrphan: boolean
    createdAt: Date
    _count: AiRequestLogCountAggregateOutputType | null
    _avg: AiRequestLogAvgAggregateOutputType | null
    _sum: AiRequestLogSumAggregateOutputType | null
    _min: AiRequestLogMinAggregateOutputType | null
    _max: AiRequestLogMaxAggregateOutputType | null
  }

  type GetAiRequestLogGroupByPayload<T extends AiRequestLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiRequestLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiRequestLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiRequestLogGroupByOutputType[P]>
            : GetScalarType<T[P], AiRequestLogGroupByOutputType[P]>
        }
      >
    >


  export type AiRequestLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    targetType?: boolean
    targetId?: boolean
    modelName?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    latencyMs?: boolean
    status?: boolean
    error?: boolean
    isOrphan?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiRequestLog"]>

  export type AiRequestLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    targetType?: boolean
    targetId?: boolean
    modelName?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    latencyMs?: boolean
    status?: boolean
    error?: boolean
    isOrphan?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiRequestLog"]>

  export type AiRequestLogSelectScalar = {
    id?: boolean
    userId?: boolean
    targetType?: boolean
    targetId?: boolean
    modelName?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    latencyMs?: boolean
    status?: boolean
    error?: boolean
    isOrphan?: boolean
    createdAt?: boolean
  }


  export type $AiRequestLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiRequestLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      targetType: string | null
      targetId: string | null
      modelName: string
      promptTokens: number
      completionTokens: number
      latencyMs: number
      status: number
      error: string | null
      isOrphan: boolean
      createdAt: Date
    }, ExtArgs["result"]["aiRequestLog"]>
    composites: {}
  }

  type AiRequestLogGetPayload<S extends boolean | null | undefined | AiRequestLogDefaultArgs> = $Result.GetResult<Prisma.$AiRequestLogPayload, S>

  type AiRequestLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiRequestLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiRequestLogCountAggregateInputType | true
    }

  export interface AiRequestLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiRequestLog'], meta: { name: 'AiRequestLog' } }
    /**
     * Find zero or one AiRequestLog that matches the filter.
     * @param {AiRequestLogFindUniqueArgs} args - Arguments to find a AiRequestLog
     * @example
     * // Get one AiRequestLog
     * const aiRequestLog = await prisma.aiRequestLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiRequestLogFindUniqueArgs>(args: SelectSubset<T, AiRequestLogFindUniqueArgs<ExtArgs>>): Prisma__AiRequestLogClient<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiRequestLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiRequestLogFindUniqueOrThrowArgs} args - Arguments to find a AiRequestLog
     * @example
     * // Get one AiRequestLog
     * const aiRequestLog = await prisma.aiRequestLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiRequestLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AiRequestLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiRequestLogClient<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiRequestLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRequestLogFindFirstArgs} args - Arguments to find a AiRequestLog
     * @example
     * // Get one AiRequestLog
     * const aiRequestLog = await prisma.aiRequestLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiRequestLogFindFirstArgs>(args?: SelectSubset<T, AiRequestLogFindFirstArgs<ExtArgs>>): Prisma__AiRequestLogClient<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiRequestLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRequestLogFindFirstOrThrowArgs} args - Arguments to find a AiRequestLog
     * @example
     * // Get one AiRequestLog
     * const aiRequestLog = await prisma.aiRequestLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiRequestLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AiRequestLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiRequestLogClient<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiRequestLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRequestLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiRequestLogs
     * const aiRequestLogs = await prisma.aiRequestLog.findMany()
     * 
     * // Get first 10 AiRequestLogs
     * const aiRequestLogs = await prisma.aiRequestLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiRequestLogWithIdOnly = await prisma.aiRequestLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiRequestLogFindManyArgs>(args?: SelectSubset<T, AiRequestLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiRequestLog.
     * @param {AiRequestLogCreateArgs} args - Arguments to create a AiRequestLog.
     * @example
     * // Create one AiRequestLog
     * const AiRequestLog = await prisma.aiRequestLog.create({
     *   data: {
     *     // ... data to create a AiRequestLog
     *   }
     * })
     * 
     */
    create<T extends AiRequestLogCreateArgs>(args: SelectSubset<T, AiRequestLogCreateArgs<ExtArgs>>): Prisma__AiRequestLogClient<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiRequestLogs.
     * @param {AiRequestLogCreateManyArgs} args - Arguments to create many AiRequestLogs.
     * @example
     * // Create many AiRequestLogs
     * const aiRequestLog = await prisma.aiRequestLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiRequestLogCreateManyArgs>(args?: SelectSubset<T, AiRequestLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiRequestLogs and returns the data saved in the database.
     * @param {AiRequestLogCreateManyAndReturnArgs} args - Arguments to create many AiRequestLogs.
     * @example
     * // Create many AiRequestLogs
     * const aiRequestLog = await prisma.aiRequestLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiRequestLogs and only return the `id`
     * const aiRequestLogWithIdOnly = await prisma.aiRequestLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiRequestLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AiRequestLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiRequestLog.
     * @param {AiRequestLogDeleteArgs} args - Arguments to delete one AiRequestLog.
     * @example
     * // Delete one AiRequestLog
     * const AiRequestLog = await prisma.aiRequestLog.delete({
     *   where: {
     *     // ... filter to delete one AiRequestLog
     *   }
     * })
     * 
     */
    delete<T extends AiRequestLogDeleteArgs>(args: SelectSubset<T, AiRequestLogDeleteArgs<ExtArgs>>): Prisma__AiRequestLogClient<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiRequestLog.
     * @param {AiRequestLogUpdateArgs} args - Arguments to update one AiRequestLog.
     * @example
     * // Update one AiRequestLog
     * const aiRequestLog = await prisma.aiRequestLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiRequestLogUpdateArgs>(args: SelectSubset<T, AiRequestLogUpdateArgs<ExtArgs>>): Prisma__AiRequestLogClient<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiRequestLogs.
     * @param {AiRequestLogDeleteManyArgs} args - Arguments to filter AiRequestLogs to delete.
     * @example
     * // Delete a few AiRequestLogs
     * const { count } = await prisma.aiRequestLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiRequestLogDeleteManyArgs>(args?: SelectSubset<T, AiRequestLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiRequestLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRequestLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiRequestLogs
     * const aiRequestLog = await prisma.aiRequestLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiRequestLogUpdateManyArgs>(args: SelectSubset<T, AiRequestLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiRequestLog.
     * @param {AiRequestLogUpsertArgs} args - Arguments to update or create a AiRequestLog.
     * @example
     * // Update or create a AiRequestLog
     * const aiRequestLog = await prisma.aiRequestLog.upsert({
     *   create: {
     *     // ... data to create a AiRequestLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiRequestLog we want to update
     *   }
     * })
     */
    upsert<T extends AiRequestLogUpsertArgs>(args: SelectSubset<T, AiRequestLogUpsertArgs<ExtArgs>>): Prisma__AiRequestLogClient<$Result.GetResult<Prisma.$AiRequestLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiRequestLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRequestLogCountArgs} args - Arguments to filter AiRequestLogs to count.
     * @example
     * // Count the number of AiRequestLogs
     * const count = await prisma.aiRequestLog.count({
     *   where: {
     *     // ... the filter for the AiRequestLogs we want to count
     *   }
     * })
    **/
    count<T extends AiRequestLogCountArgs>(
      args?: Subset<T, AiRequestLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiRequestLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiRequestLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRequestLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiRequestLogAggregateArgs>(args: Subset<T, AiRequestLogAggregateArgs>): Prisma.PrismaPromise<GetAiRequestLogAggregateType<T>>

    /**
     * Group by AiRequestLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRequestLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiRequestLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiRequestLogGroupByArgs['orderBy'] }
        : { orderBy?: AiRequestLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiRequestLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiRequestLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiRequestLog model
   */
  readonly fields: AiRequestLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiRequestLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiRequestLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiRequestLog model
   */ 
  interface AiRequestLogFieldRefs {
    readonly id: FieldRef<"AiRequestLog", 'String'>
    readonly userId: FieldRef<"AiRequestLog", 'String'>
    readonly targetType: FieldRef<"AiRequestLog", 'String'>
    readonly targetId: FieldRef<"AiRequestLog", 'String'>
    readonly modelName: FieldRef<"AiRequestLog", 'String'>
    readonly promptTokens: FieldRef<"AiRequestLog", 'Int'>
    readonly completionTokens: FieldRef<"AiRequestLog", 'Int'>
    readonly latencyMs: FieldRef<"AiRequestLog", 'Int'>
    readonly status: FieldRef<"AiRequestLog", 'Int'>
    readonly error: FieldRef<"AiRequestLog", 'String'>
    readonly isOrphan: FieldRef<"AiRequestLog", 'Boolean'>
    readonly createdAt: FieldRef<"AiRequestLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiRequestLog findUnique
   */
  export type AiRequestLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
    /**
     * Filter, which AiRequestLog to fetch.
     */
    where: AiRequestLogWhereUniqueInput
  }

  /**
   * AiRequestLog findUniqueOrThrow
   */
  export type AiRequestLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
    /**
     * Filter, which AiRequestLog to fetch.
     */
    where: AiRequestLogWhereUniqueInput
  }

  /**
   * AiRequestLog findFirst
   */
  export type AiRequestLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
    /**
     * Filter, which AiRequestLog to fetch.
     */
    where?: AiRequestLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiRequestLogs to fetch.
     */
    orderBy?: AiRequestLogOrderByWithRelationInput | AiRequestLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiRequestLogs.
     */
    cursor?: AiRequestLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiRequestLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiRequestLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiRequestLogs.
     */
    distinct?: AiRequestLogScalarFieldEnum | AiRequestLogScalarFieldEnum[]
  }

  /**
   * AiRequestLog findFirstOrThrow
   */
  export type AiRequestLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
    /**
     * Filter, which AiRequestLog to fetch.
     */
    where?: AiRequestLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiRequestLogs to fetch.
     */
    orderBy?: AiRequestLogOrderByWithRelationInput | AiRequestLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiRequestLogs.
     */
    cursor?: AiRequestLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiRequestLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiRequestLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiRequestLogs.
     */
    distinct?: AiRequestLogScalarFieldEnum | AiRequestLogScalarFieldEnum[]
  }

  /**
   * AiRequestLog findMany
   */
  export type AiRequestLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
    /**
     * Filter, which AiRequestLogs to fetch.
     */
    where?: AiRequestLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiRequestLogs to fetch.
     */
    orderBy?: AiRequestLogOrderByWithRelationInput | AiRequestLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiRequestLogs.
     */
    cursor?: AiRequestLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiRequestLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiRequestLogs.
     */
    skip?: number
    distinct?: AiRequestLogScalarFieldEnum | AiRequestLogScalarFieldEnum[]
  }

  /**
   * AiRequestLog create
   */
  export type AiRequestLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AiRequestLog.
     */
    data: XOR<AiRequestLogCreateInput, AiRequestLogUncheckedCreateInput>
  }

  /**
   * AiRequestLog createMany
   */
  export type AiRequestLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiRequestLogs.
     */
    data: AiRequestLogCreateManyInput | AiRequestLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiRequestLog createManyAndReturn
   */
  export type AiRequestLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiRequestLogs.
     */
    data: AiRequestLogCreateManyInput | AiRequestLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiRequestLog update
   */
  export type AiRequestLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AiRequestLog.
     */
    data: XOR<AiRequestLogUpdateInput, AiRequestLogUncheckedUpdateInput>
    /**
     * Choose, which AiRequestLog to update.
     */
    where: AiRequestLogWhereUniqueInput
  }

  /**
   * AiRequestLog updateMany
   */
  export type AiRequestLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiRequestLogs.
     */
    data: XOR<AiRequestLogUpdateManyMutationInput, AiRequestLogUncheckedUpdateManyInput>
    /**
     * Filter which AiRequestLogs to update
     */
    where?: AiRequestLogWhereInput
  }

  /**
   * AiRequestLog upsert
   */
  export type AiRequestLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AiRequestLog to update in case it exists.
     */
    where: AiRequestLogWhereUniqueInput
    /**
     * In case the AiRequestLog found by the `where` argument doesn't exist, create a new AiRequestLog with this data.
     */
    create: XOR<AiRequestLogCreateInput, AiRequestLogUncheckedCreateInput>
    /**
     * In case the AiRequestLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiRequestLogUpdateInput, AiRequestLogUncheckedUpdateInput>
  }

  /**
   * AiRequestLog delete
   */
  export type AiRequestLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
    /**
     * Filter which AiRequestLog to delete.
     */
    where: AiRequestLogWhereUniqueInput
  }

  /**
   * AiRequestLog deleteMany
   */
  export type AiRequestLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiRequestLogs to delete
     */
    where?: AiRequestLogWhereInput
  }

  /**
   * AiRequestLog without action
   */
  export type AiRequestLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRequestLog
     */
    select?: AiRequestLogSelect<ExtArgs> | null
  }


  /**
   * Model TrustGraphNode
   */

  export type AggregateTrustGraphNode = {
    _count: TrustGraphNodeCountAggregateOutputType | null
    _avg: TrustGraphNodeAvgAggregateOutputType | null
    _sum: TrustGraphNodeSumAggregateOutputType | null
    _min: TrustGraphNodeMinAggregateOutputType | null
    _max: TrustGraphNodeMaxAggregateOutputType | null
  }

  export type TrustGraphNodeAvgAggregateOutputType = {
    sourceVersion: number | null
    riskScore: number | null
  }

  export type TrustGraphNodeSumAggregateOutputType = {
    sourceVersion: number | null
    riskScore: number | null
  }

  export type TrustGraphNodeMinAggregateOutputType = {
    id: string | null
    sourceType: string | null
    sourceId: string | null
    sourceVersion: number | null
    label: string | null
    riskScore: number | null
    riskLevel: string | null
    lastRiskUpdate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrustGraphNodeMaxAggregateOutputType = {
    id: string | null
    sourceType: string | null
    sourceId: string | null
    sourceVersion: number | null
    label: string | null
    riskScore: number | null
    riskLevel: string | null
    lastRiskUpdate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrustGraphNodeCountAggregateOutputType = {
    id: number
    sourceType: number
    sourceId: number
    sourceVersion: number
    label: number
    metadata: number
    riskScore: number
    riskLevel: number
    lastRiskUpdate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrustGraphNodeAvgAggregateInputType = {
    sourceVersion?: true
    riskScore?: true
  }

  export type TrustGraphNodeSumAggregateInputType = {
    sourceVersion?: true
    riskScore?: true
  }

  export type TrustGraphNodeMinAggregateInputType = {
    id?: true
    sourceType?: true
    sourceId?: true
    sourceVersion?: true
    label?: true
    riskScore?: true
    riskLevel?: true
    lastRiskUpdate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrustGraphNodeMaxAggregateInputType = {
    id?: true
    sourceType?: true
    sourceId?: true
    sourceVersion?: true
    label?: true
    riskScore?: true
    riskLevel?: true
    lastRiskUpdate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrustGraphNodeCountAggregateInputType = {
    id?: true
    sourceType?: true
    sourceId?: true
    sourceVersion?: true
    label?: true
    metadata?: true
    riskScore?: true
    riskLevel?: true
    lastRiskUpdate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrustGraphNodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustGraphNode to aggregate.
     */
    where?: TrustGraphNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphNodes to fetch.
     */
    orderBy?: TrustGraphNodeOrderByWithRelationInput | TrustGraphNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrustGraphNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrustGraphNodes
    **/
    _count?: true | TrustGraphNodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrustGraphNodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrustGraphNodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrustGraphNodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrustGraphNodeMaxAggregateInputType
  }

  export type GetTrustGraphNodeAggregateType<T extends TrustGraphNodeAggregateArgs> = {
        [P in keyof T & keyof AggregateTrustGraphNode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrustGraphNode[P]>
      : GetScalarType<T[P], AggregateTrustGraphNode[P]>
  }




  export type TrustGraphNodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrustGraphNodeWhereInput
    orderBy?: TrustGraphNodeOrderByWithAggregationInput | TrustGraphNodeOrderByWithAggregationInput[]
    by: TrustGraphNodeScalarFieldEnum[] | TrustGraphNodeScalarFieldEnum
    having?: TrustGraphNodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrustGraphNodeCountAggregateInputType | true
    _avg?: TrustGraphNodeAvgAggregateInputType
    _sum?: TrustGraphNodeSumAggregateInputType
    _min?: TrustGraphNodeMinAggregateInputType
    _max?: TrustGraphNodeMaxAggregateInputType
  }

  export type TrustGraphNodeGroupByOutputType = {
    id: string
    sourceType: string
    sourceId: string | null
    sourceVersion: number | null
    label: string
    metadata: JsonValue | null
    riskScore: number | null
    riskLevel: string | null
    lastRiskUpdate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TrustGraphNodeCountAggregateOutputType | null
    _avg: TrustGraphNodeAvgAggregateOutputType | null
    _sum: TrustGraphNodeSumAggregateOutputType | null
    _min: TrustGraphNodeMinAggregateOutputType | null
    _max: TrustGraphNodeMaxAggregateOutputType | null
  }

  type GetTrustGraphNodeGroupByPayload<T extends TrustGraphNodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrustGraphNodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrustGraphNodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrustGraphNodeGroupByOutputType[P]>
            : GetScalarType<T[P], TrustGraphNodeGroupByOutputType[P]>
        }
      >
    >


  export type TrustGraphNodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceType?: boolean
    sourceId?: boolean
    sourceVersion?: boolean
    label?: boolean
    metadata?: boolean
    riskScore?: boolean
    riskLevel?: boolean
    lastRiskUpdate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["trustGraphNode"]>

  export type TrustGraphNodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceType?: boolean
    sourceId?: boolean
    sourceVersion?: boolean
    label?: boolean
    metadata?: boolean
    riskScore?: boolean
    riskLevel?: boolean
    lastRiskUpdate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["trustGraphNode"]>

  export type TrustGraphNodeSelectScalar = {
    id?: boolean
    sourceType?: boolean
    sourceId?: boolean
    sourceVersion?: boolean
    label?: boolean
    metadata?: boolean
    riskScore?: boolean
    riskLevel?: boolean
    lastRiskUpdate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $TrustGraphNodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrustGraphNode"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sourceType: string
      sourceId: string | null
      sourceVersion: number | null
      label: string
      metadata: Prisma.JsonValue | null
      riskScore: number | null
      riskLevel: string | null
      lastRiskUpdate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trustGraphNode"]>
    composites: {}
  }

  type TrustGraphNodeGetPayload<S extends boolean | null | undefined | TrustGraphNodeDefaultArgs> = $Result.GetResult<Prisma.$TrustGraphNodePayload, S>

  type TrustGraphNodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrustGraphNodeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrustGraphNodeCountAggregateInputType | true
    }

  export interface TrustGraphNodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrustGraphNode'], meta: { name: 'TrustGraphNode' } }
    /**
     * Find zero or one TrustGraphNode that matches the filter.
     * @param {TrustGraphNodeFindUniqueArgs} args - Arguments to find a TrustGraphNode
     * @example
     * // Get one TrustGraphNode
     * const trustGraphNode = await prisma.trustGraphNode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrustGraphNodeFindUniqueArgs>(args: SelectSubset<T, TrustGraphNodeFindUniqueArgs<ExtArgs>>): Prisma__TrustGraphNodeClient<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TrustGraphNode that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrustGraphNodeFindUniqueOrThrowArgs} args - Arguments to find a TrustGraphNode
     * @example
     * // Get one TrustGraphNode
     * const trustGraphNode = await prisma.trustGraphNode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrustGraphNodeFindUniqueOrThrowArgs>(args: SelectSubset<T, TrustGraphNodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrustGraphNodeClient<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TrustGraphNode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphNodeFindFirstArgs} args - Arguments to find a TrustGraphNode
     * @example
     * // Get one TrustGraphNode
     * const trustGraphNode = await prisma.trustGraphNode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrustGraphNodeFindFirstArgs>(args?: SelectSubset<T, TrustGraphNodeFindFirstArgs<ExtArgs>>): Prisma__TrustGraphNodeClient<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TrustGraphNode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphNodeFindFirstOrThrowArgs} args - Arguments to find a TrustGraphNode
     * @example
     * // Get one TrustGraphNode
     * const trustGraphNode = await prisma.trustGraphNode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrustGraphNodeFindFirstOrThrowArgs>(args?: SelectSubset<T, TrustGraphNodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrustGraphNodeClient<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TrustGraphNodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphNodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrustGraphNodes
     * const trustGraphNodes = await prisma.trustGraphNode.findMany()
     * 
     * // Get first 10 TrustGraphNodes
     * const trustGraphNodes = await prisma.trustGraphNode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trustGraphNodeWithIdOnly = await prisma.trustGraphNode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrustGraphNodeFindManyArgs>(args?: SelectSubset<T, TrustGraphNodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TrustGraphNode.
     * @param {TrustGraphNodeCreateArgs} args - Arguments to create a TrustGraphNode.
     * @example
     * // Create one TrustGraphNode
     * const TrustGraphNode = await prisma.trustGraphNode.create({
     *   data: {
     *     // ... data to create a TrustGraphNode
     *   }
     * })
     * 
     */
    create<T extends TrustGraphNodeCreateArgs>(args: SelectSubset<T, TrustGraphNodeCreateArgs<ExtArgs>>): Prisma__TrustGraphNodeClient<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TrustGraphNodes.
     * @param {TrustGraphNodeCreateManyArgs} args - Arguments to create many TrustGraphNodes.
     * @example
     * // Create many TrustGraphNodes
     * const trustGraphNode = await prisma.trustGraphNode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrustGraphNodeCreateManyArgs>(args?: SelectSubset<T, TrustGraphNodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrustGraphNodes and returns the data saved in the database.
     * @param {TrustGraphNodeCreateManyAndReturnArgs} args - Arguments to create many TrustGraphNodes.
     * @example
     * // Create many TrustGraphNodes
     * const trustGraphNode = await prisma.trustGraphNode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrustGraphNodes and only return the `id`
     * const trustGraphNodeWithIdOnly = await prisma.trustGraphNode.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrustGraphNodeCreateManyAndReturnArgs>(args?: SelectSubset<T, TrustGraphNodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TrustGraphNode.
     * @param {TrustGraphNodeDeleteArgs} args - Arguments to delete one TrustGraphNode.
     * @example
     * // Delete one TrustGraphNode
     * const TrustGraphNode = await prisma.trustGraphNode.delete({
     *   where: {
     *     // ... filter to delete one TrustGraphNode
     *   }
     * })
     * 
     */
    delete<T extends TrustGraphNodeDeleteArgs>(args: SelectSubset<T, TrustGraphNodeDeleteArgs<ExtArgs>>): Prisma__TrustGraphNodeClient<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TrustGraphNode.
     * @param {TrustGraphNodeUpdateArgs} args - Arguments to update one TrustGraphNode.
     * @example
     * // Update one TrustGraphNode
     * const trustGraphNode = await prisma.trustGraphNode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrustGraphNodeUpdateArgs>(args: SelectSubset<T, TrustGraphNodeUpdateArgs<ExtArgs>>): Prisma__TrustGraphNodeClient<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TrustGraphNodes.
     * @param {TrustGraphNodeDeleteManyArgs} args - Arguments to filter TrustGraphNodes to delete.
     * @example
     * // Delete a few TrustGraphNodes
     * const { count } = await prisma.trustGraphNode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrustGraphNodeDeleteManyArgs>(args?: SelectSubset<T, TrustGraphNodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrustGraphNodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphNodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrustGraphNodes
     * const trustGraphNode = await prisma.trustGraphNode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrustGraphNodeUpdateManyArgs>(args: SelectSubset<T, TrustGraphNodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TrustGraphNode.
     * @param {TrustGraphNodeUpsertArgs} args - Arguments to update or create a TrustGraphNode.
     * @example
     * // Update or create a TrustGraphNode
     * const trustGraphNode = await prisma.trustGraphNode.upsert({
     *   create: {
     *     // ... data to create a TrustGraphNode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrustGraphNode we want to update
     *   }
     * })
     */
    upsert<T extends TrustGraphNodeUpsertArgs>(args: SelectSubset<T, TrustGraphNodeUpsertArgs<ExtArgs>>): Prisma__TrustGraphNodeClient<$Result.GetResult<Prisma.$TrustGraphNodePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TrustGraphNodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphNodeCountArgs} args - Arguments to filter TrustGraphNodes to count.
     * @example
     * // Count the number of TrustGraphNodes
     * const count = await prisma.trustGraphNode.count({
     *   where: {
     *     // ... the filter for the TrustGraphNodes we want to count
     *   }
     * })
    **/
    count<T extends TrustGraphNodeCountArgs>(
      args?: Subset<T, TrustGraphNodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrustGraphNodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrustGraphNode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphNodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrustGraphNodeAggregateArgs>(args: Subset<T, TrustGraphNodeAggregateArgs>): Prisma.PrismaPromise<GetTrustGraphNodeAggregateType<T>>

    /**
     * Group by TrustGraphNode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphNodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrustGraphNodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrustGraphNodeGroupByArgs['orderBy'] }
        : { orderBy?: TrustGraphNodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrustGraphNodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrustGraphNodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrustGraphNode model
   */
  readonly fields: TrustGraphNodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrustGraphNode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrustGraphNodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrustGraphNode model
   */ 
  interface TrustGraphNodeFieldRefs {
    readonly id: FieldRef<"TrustGraphNode", 'String'>
    readonly sourceType: FieldRef<"TrustGraphNode", 'String'>
    readonly sourceId: FieldRef<"TrustGraphNode", 'String'>
    readonly sourceVersion: FieldRef<"TrustGraphNode", 'Int'>
    readonly label: FieldRef<"TrustGraphNode", 'String'>
    readonly metadata: FieldRef<"TrustGraphNode", 'Json'>
    readonly riskScore: FieldRef<"TrustGraphNode", 'Float'>
    readonly riskLevel: FieldRef<"TrustGraphNode", 'String'>
    readonly lastRiskUpdate: FieldRef<"TrustGraphNode", 'DateTime'>
    readonly createdAt: FieldRef<"TrustGraphNode", 'DateTime'>
    readonly updatedAt: FieldRef<"TrustGraphNode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrustGraphNode findUnique
   */
  export type TrustGraphNodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphNode to fetch.
     */
    where: TrustGraphNodeWhereUniqueInput
  }

  /**
   * TrustGraphNode findUniqueOrThrow
   */
  export type TrustGraphNodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphNode to fetch.
     */
    where: TrustGraphNodeWhereUniqueInput
  }

  /**
   * TrustGraphNode findFirst
   */
  export type TrustGraphNodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphNode to fetch.
     */
    where?: TrustGraphNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphNodes to fetch.
     */
    orderBy?: TrustGraphNodeOrderByWithRelationInput | TrustGraphNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustGraphNodes.
     */
    cursor?: TrustGraphNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustGraphNodes.
     */
    distinct?: TrustGraphNodeScalarFieldEnum | TrustGraphNodeScalarFieldEnum[]
  }

  /**
   * TrustGraphNode findFirstOrThrow
   */
  export type TrustGraphNodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphNode to fetch.
     */
    where?: TrustGraphNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphNodes to fetch.
     */
    orderBy?: TrustGraphNodeOrderByWithRelationInput | TrustGraphNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustGraphNodes.
     */
    cursor?: TrustGraphNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustGraphNodes.
     */
    distinct?: TrustGraphNodeScalarFieldEnum | TrustGraphNodeScalarFieldEnum[]
  }

  /**
   * TrustGraphNode findMany
   */
  export type TrustGraphNodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphNodes to fetch.
     */
    where?: TrustGraphNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphNodes to fetch.
     */
    orderBy?: TrustGraphNodeOrderByWithRelationInput | TrustGraphNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrustGraphNodes.
     */
    cursor?: TrustGraphNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphNodes.
     */
    skip?: number
    distinct?: TrustGraphNodeScalarFieldEnum | TrustGraphNodeScalarFieldEnum[]
  }

  /**
   * TrustGraphNode create
   */
  export type TrustGraphNodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
    /**
     * The data needed to create a TrustGraphNode.
     */
    data: XOR<TrustGraphNodeCreateInput, TrustGraphNodeUncheckedCreateInput>
  }

  /**
   * TrustGraphNode createMany
   */
  export type TrustGraphNodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrustGraphNodes.
     */
    data: TrustGraphNodeCreateManyInput | TrustGraphNodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrustGraphNode createManyAndReturn
   */
  export type TrustGraphNodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TrustGraphNodes.
     */
    data: TrustGraphNodeCreateManyInput | TrustGraphNodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrustGraphNode update
   */
  export type TrustGraphNodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
    /**
     * The data needed to update a TrustGraphNode.
     */
    data: XOR<TrustGraphNodeUpdateInput, TrustGraphNodeUncheckedUpdateInput>
    /**
     * Choose, which TrustGraphNode to update.
     */
    where: TrustGraphNodeWhereUniqueInput
  }

  /**
   * TrustGraphNode updateMany
   */
  export type TrustGraphNodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrustGraphNodes.
     */
    data: XOR<TrustGraphNodeUpdateManyMutationInput, TrustGraphNodeUncheckedUpdateManyInput>
    /**
     * Filter which TrustGraphNodes to update
     */
    where?: TrustGraphNodeWhereInput
  }

  /**
   * TrustGraphNode upsert
   */
  export type TrustGraphNodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
    /**
     * The filter to search for the TrustGraphNode to update in case it exists.
     */
    where: TrustGraphNodeWhereUniqueInput
    /**
     * In case the TrustGraphNode found by the `where` argument doesn't exist, create a new TrustGraphNode with this data.
     */
    create: XOR<TrustGraphNodeCreateInput, TrustGraphNodeUncheckedCreateInput>
    /**
     * In case the TrustGraphNode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrustGraphNodeUpdateInput, TrustGraphNodeUncheckedUpdateInput>
  }

  /**
   * TrustGraphNode delete
   */
  export type TrustGraphNodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
    /**
     * Filter which TrustGraphNode to delete.
     */
    where: TrustGraphNodeWhereUniqueInput
  }

  /**
   * TrustGraphNode deleteMany
   */
  export type TrustGraphNodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustGraphNodes to delete
     */
    where?: TrustGraphNodeWhereInput
  }

  /**
   * TrustGraphNode without action
   */
  export type TrustGraphNodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphNode
     */
    select?: TrustGraphNodeSelect<ExtArgs> | null
  }


  /**
   * Model TrustGraphEdge
   */

  export type AggregateTrustGraphEdge = {
    _count: TrustGraphEdgeCountAggregateOutputType | null
    _avg: TrustGraphEdgeAvgAggregateOutputType | null
    _sum: TrustGraphEdgeSumAggregateOutputType | null
    _min: TrustGraphEdgeMinAggregateOutputType | null
    _max: TrustGraphEdgeMaxAggregateOutputType | null
  }

  export type TrustGraphEdgeAvgAggregateOutputType = {
    confidence: number | null
  }

  export type TrustGraphEdgeSumAggregateOutputType = {
    confidence: number | null
  }

  export type TrustGraphEdgeMinAggregateOutputType = {
    id: string | null
    fromNodeId: string | null
    toNodeId: string | null
    relationType: string | null
    sourceType: string | null
    sourceId: string | null
    confidence: number | null
    createdAt: Date | null
  }

  export type TrustGraphEdgeMaxAggregateOutputType = {
    id: string | null
    fromNodeId: string | null
    toNodeId: string | null
    relationType: string | null
    sourceType: string | null
    sourceId: string | null
    confidence: number | null
    createdAt: Date | null
  }

  export type TrustGraphEdgeCountAggregateOutputType = {
    id: number
    fromNodeId: number
    toNodeId: number
    relationType: number
    sourceType: number
    sourceId: number
    confidence: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type TrustGraphEdgeAvgAggregateInputType = {
    confidence?: true
  }

  export type TrustGraphEdgeSumAggregateInputType = {
    confidence?: true
  }

  export type TrustGraphEdgeMinAggregateInputType = {
    id?: true
    fromNodeId?: true
    toNodeId?: true
    relationType?: true
    sourceType?: true
    sourceId?: true
    confidence?: true
    createdAt?: true
  }

  export type TrustGraphEdgeMaxAggregateInputType = {
    id?: true
    fromNodeId?: true
    toNodeId?: true
    relationType?: true
    sourceType?: true
    sourceId?: true
    confidence?: true
    createdAt?: true
  }

  export type TrustGraphEdgeCountAggregateInputType = {
    id?: true
    fromNodeId?: true
    toNodeId?: true
    relationType?: true
    sourceType?: true
    sourceId?: true
    confidence?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type TrustGraphEdgeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustGraphEdge to aggregate.
     */
    where?: TrustGraphEdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphEdges to fetch.
     */
    orderBy?: TrustGraphEdgeOrderByWithRelationInput | TrustGraphEdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrustGraphEdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphEdges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphEdges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrustGraphEdges
    **/
    _count?: true | TrustGraphEdgeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrustGraphEdgeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrustGraphEdgeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrustGraphEdgeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrustGraphEdgeMaxAggregateInputType
  }

  export type GetTrustGraphEdgeAggregateType<T extends TrustGraphEdgeAggregateArgs> = {
        [P in keyof T & keyof AggregateTrustGraphEdge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrustGraphEdge[P]>
      : GetScalarType<T[P], AggregateTrustGraphEdge[P]>
  }




  export type TrustGraphEdgeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrustGraphEdgeWhereInput
    orderBy?: TrustGraphEdgeOrderByWithAggregationInput | TrustGraphEdgeOrderByWithAggregationInput[]
    by: TrustGraphEdgeScalarFieldEnum[] | TrustGraphEdgeScalarFieldEnum
    having?: TrustGraphEdgeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrustGraphEdgeCountAggregateInputType | true
    _avg?: TrustGraphEdgeAvgAggregateInputType
    _sum?: TrustGraphEdgeSumAggregateInputType
    _min?: TrustGraphEdgeMinAggregateInputType
    _max?: TrustGraphEdgeMaxAggregateInputType
  }

  export type TrustGraphEdgeGroupByOutputType = {
    id: string
    fromNodeId: string
    toNodeId: string
    relationType: string
    sourceType: string | null
    sourceId: string | null
    confidence: number
    metadata: JsonValue | null
    createdAt: Date
    _count: TrustGraphEdgeCountAggregateOutputType | null
    _avg: TrustGraphEdgeAvgAggregateOutputType | null
    _sum: TrustGraphEdgeSumAggregateOutputType | null
    _min: TrustGraphEdgeMinAggregateOutputType | null
    _max: TrustGraphEdgeMaxAggregateOutputType | null
  }

  type GetTrustGraphEdgeGroupByPayload<T extends TrustGraphEdgeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrustGraphEdgeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrustGraphEdgeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrustGraphEdgeGroupByOutputType[P]>
            : GetScalarType<T[P], TrustGraphEdgeGroupByOutputType[P]>
        }
      >
    >


  export type TrustGraphEdgeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromNodeId?: boolean
    toNodeId?: boolean
    relationType?: boolean
    sourceType?: boolean
    sourceId?: boolean
    confidence?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["trustGraphEdge"]>

  export type TrustGraphEdgeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromNodeId?: boolean
    toNodeId?: boolean
    relationType?: boolean
    sourceType?: boolean
    sourceId?: boolean
    confidence?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["trustGraphEdge"]>

  export type TrustGraphEdgeSelectScalar = {
    id?: boolean
    fromNodeId?: boolean
    toNodeId?: boolean
    relationType?: boolean
    sourceType?: boolean
    sourceId?: boolean
    confidence?: boolean
    metadata?: boolean
    createdAt?: boolean
  }


  export type $TrustGraphEdgePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrustGraphEdge"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fromNodeId: string
      toNodeId: string
      relationType: string
      sourceType: string | null
      sourceId: string | null
      confidence: number
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["trustGraphEdge"]>
    composites: {}
  }

  type TrustGraphEdgeGetPayload<S extends boolean | null | undefined | TrustGraphEdgeDefaultArgs> = $Result.GetResult<Prisma.$TrustGraphEdgePayload, S>

  type TrustGraphEdgeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrustGraphEdgeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrustGraphEdgeCountAggregateInputType | true
    }

  export interface TrustGraphEdgeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrustGraphEdge'], meta: { name: 'TrustGraphEdge' } }
    /**
     * Find zero or one TrustGraphEdge that matches the filter.
     * @param {TrustGraphEdgeFindUniqueArgs} args - Arguments to find a TrustGraphEdge
     * @example
     * // Get one TrustGraphEdge
     * const trustGraphEdge = await prisma.trustGraphEdge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrustGraphEdgeFindUniqueArgs>(args: SelectSubset<T, TrustGraphEdgeFindUniqueArgs<ExtArgs>>): Prisma__TrustGraphEdgeClient<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TrustGraphEdge that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrustGraphEdgeFindUniqueOrThrowArgs} args - Arguments to find a TrustGraphEdge
     * @example
     * // Get one TrustGraphEdge
     * const trustGraphEdge = await prisma.trustGraphEdge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrustGraphEdgeFindUniqueOrThrowArgs>(args: SelectSubset<T, TrustGraphEdgeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrustGraphEdgeClient<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TrustGraphEdge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphEdgeFindFirstArgs} args - Arguments to find a TrustGraphEdge
     * @example
     * // Get one TrustGraphEdge
     * const trustGraphEdge = await prisma.trustGraphEdge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrustGraphEdgeFindFirstArgs>(args?: SelectSubset<T, TrustGraphEdgeFindFirstArgs<ExtArgs>>): Prisma__TrustGraphEdgeClient<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TrustGraphEdge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphEdgeFindFirstOrThrowArgs} args - Arguments to find a TrustGraphEdge
     * @example
     * // Get one TrustGraphEdge
     * const trustGraphEdge = await prisma.trustGraphEdge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrustGraphEdgeFindFirstOrThrowArgs>(args?: SelectSubset<T, TrustGraphEdgeFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrustGraphEdgeClient<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TrustGraphEdges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphEdgeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrustGraphEdges
     * const trustGraphEdges = await prisma.trustGraphEdge.findMany()
     * 
     * // Get first 10 TrustGraphEdges
     * const trustGraphEdges = await prisma.trustGraphEdge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trustGraphEdgeWithIdOnly = await prisma.trustGraphEdge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrustGraphEdgeFindManyArgs>(args?: SelectSubset<T, TrustGraphEdgeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TrustGraphEdge.
     * @param {TrustGraphEdgeCreateArgs} args - Arguments to create a TrustGraphEdge.
     * @example
     * // Create one TrustGraphEdge
     * const TrustGraphEdge = await prisma.trustGraphEdge.create({
     *   data: {
     *     // ... data to create a TrustGraphEdge
     *   }
     * })
     * 
     */
    create<T extends TrustGraphEdgeCreateArgs>(args: SelectSubset<T, TrustGraphEdgeCreateArgs<ExtArgs>>): Prisma__TrustGraphEdgeClient<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TrustGraphEdges.
     * @param {TrustGraphEdgeCreateManyArgs} args - Arguments to create many TrustGraphEdges.
     * @example
     * // Create many TrustGraphEdges
     * const trustGraphEdge = await prisma.trustGraphEdge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrustGraphEdgeCreateManyArgs>(args?: SelectSubset<T, TrustGraphEdgeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrustGraphEdges and returns the data saved in the database.
     * @param {TrustGraphEdgeCreateManyAndReturnArgs} args - Arguments to create many TrustGraphEdges.
     * @example
     * // Create many TrustGraphEdges
     * const trustGraphEdge = await prisma.trustGraphEdge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrustGraphEdges and only return the `id`
     * const trustGraphEdgeWithIdOnly = await prisma.trustGraphEdge.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrustGraphEdgeCreateManyAndReturnArgs>(args?: SelectSubset<T, TrustGraphEdgeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TrustGraphEdge.
     * @param {TrustGraphEdgeDeleteArgs} args - Arguments to delete one TrustGraphEdge.
     * @example
     * // Delete one TrustGraphEdge
     * const TrustGraphEdge = await prisma.trustGraphEdge.delete({
     *   where: {
     *     // ... filter to delete one TrustGraphEdge
     *   }
     * })
     * 
     */
    delete<T extends TrustGraphEdgeDeleteArgs>(args: SelectSubset<T, TrustGraphEdgeDeleteArgs<ExtArgs>>): Prisma__TrustGraphEdgeClient<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TrustGraphEdge.
     * @param {TrustGraphEdgeUpdateArgs} args - Arguments to update one TrustGraphEdge.
     * @example
     * // Update one TrustGraphEdge
     * const trustGraphEdge = await prisma.trustGraphEdge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrustGraphEdgeUpdateArgs>(args: SelectSubset<T, TrustGraphEdgeUpdateArgs<ExtArgs>>): Prisma__TrustGraphEdgeClient<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TrustGraphEdges.
     * @param {TrustGraphEdgeDeleteManyArgs} args - Arguments to filter TrustGraphEdges to delete.
     * @example
     * // Delete a few TrustGraphEdges
     * const { count } = await prisma.trustGraphEdge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrustGraphEdgeDeleteManyArgs>(args?: SelectSubset<T, TrustGraphEdgeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrustGraphEdges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphEdgeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrustGraphEdges
     * const trustGraphEdge = await prisma.trustGraphEdge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrustGraphEdgeUpdateManyArgs>(args: SelectSubset<T, TrustGraphEdgeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TrustGraphEdge.
     * @param {TrustGraphEdgeUpsertArgs} args - Arguments to update or create a TrustGraphEdge.
     * @example
     * // Update or create a TrustGraphEdge
     * const trustGraphEdge = await prisma.trustGraphEdge.upsert({
     *   create: {
     *     // ... data to create a TrustGraphEdge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrustGraphEdge we want to update
     *   }
     * })
     */
    upsert<T extends TrustGraphEdgeUpsertArgs>(args: SelectSubset<T, TrustGraphEdgeUpsertArgs<ExtArgs>>): Prisma__TrustGraphEdgeClient<$Result.GetResult<Prisma.$TrustGraphEdgePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TrustGraphEdges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphEdgeCountArgs} args - Arguments to filter TrustGraphEdges to count.
     * @example
     * // Count the number of TrustGraphEdges
     * const count = await prisma.trustGraphEdge.count({
     *   where: {
     *     // ... the filter for the TrustGraphEdges we want to count
     *   }
     * })
    **/
    count<T extends TrustGraphEdgeCountArgs>(
      args?: Subset<T, TrustGraphEdgeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrustGraphEdgeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrustGraphEdge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphEdgeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrustGraphEdgeAggregateArgs>(args: Subset<T, TrustGraphEdgeAggregateArgs>): Prisma.PrismaPromise<GetTrustGraphEdgeAggregateType<T>>

    /**
     * Group by TrustGraphEdge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphEdgeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrustGraphEdgeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrustGraphEdgeGroupByArgs['orderBy'] }
        : { orderBy?: TrustGraphEdgeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrustGraphEdgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrustGraphEdgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrustGraphEdge model
   */
  readonly fields: TrustGraphEdgeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrustGraphEdge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrustGraphEdgeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrustGraphEdge model
   */ 
  interface TrustGraphEdgeFieldRefs {
    readonly id: FieldRef<"TrustGraphEdge", 'String'>
    readonly fromNodeId: FieldRef<"TrustGraphEdge", 'String'>
    readonly toNodeId: FieldRef<"TrustGraphEdge", 'String'>
    readonly relationType: FieldRef<"TrustGraphEdge", 'String'>
    readonly sourceType: FieldRef<"TrustGraphEdge", 'String'>
    readonly sourceId: FieldRef<"TrustGraphEdge", 'String'>
    readonly confidence: FieldRef<"TrustGraphEdge", 'Float'>
    readonly metadata: FieldRef<"TrustGraphEdge", 'Json'>
    readonly createdAt: FieldRef<"TrustGraphEdge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrustGraphEdge findUnique
   */
  export type TrustGraphEdgeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphEdge to fetch.
     */
    where: TrustGraphEdgeWhereUniqueInput
  }

  /**
   * TrustGraphEdge findUniqueOrThrow
   */
  export type TrustGraphEdgeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphEdge to fetch.
     */
    where: TrustGraphEdgeWhereUniqueInput
  }

  /**
   * TrustGraphEdge findFirst
   */
  export type TrustGraphEdgeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphEdge to fetch.
     */
    where?: TrustGraphEdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphEdges to fetch.
     */
    orderBy?: TrustGraphEdgeOrderByWithRelationInput | TrustGraphEdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustGraphEdges.
     */
    cursor?: TrustGraphEdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphEdges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphEdges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustGraphEdges.
     */
    distinct?: TrustGraphEdgeScalarFieldEnum | TrustGraphEdgeScalarFieldEnum[]
  }

  /**
   * TrustGraphEdge findFirstOrThrow
   */
  export type TrustGraphEdgeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphEdge to fetch.
     */
    where?: TrustGraphEdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphEdges to fetch.
     */
    orderBy?: TrustGraphEdgeOrderByWithRelationInput | TrustGraphEdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustGraphEdges.
     */
    cursor?: TrustGraphEdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphEdges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphEdges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustGraphEdges.
     */
    distinct?: TrustGraphEdgeScalarFieldEnum | TrustGraphEdgeScalarFieldEnum[]
  }

  /**
   * TrustGraphEdge findMany
   */
  export type TrustGraphEdgeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphEdges to fetch.
     */
    where?: TrustGraphEdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphEdges to fetch.
     */
    orderBy?: TrustGraphEdgeOrderByWithRelationInput | TrustGraphEdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrustGraphEdges.
     */
    cursor?: TrustGraphEdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphEdges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphEdges.
     */
    skip?: number
    distinct?: TrustGraphEdgeScalarFieldEnum | TrustGraphEdgeScalarFieldEnum[]
  }

  /**
   * TrustGraphEdge create
   */
  export type TrustGraphEdgeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
    /**
     * The data needed to create a TrustGraphEdge.
     */
    data: XOR<TrustGraphEdgeCreateInput, TrustGraphEdgeUncheckedCreateInput>
  }

  /**
   * TrustGraphEdge createMany
   */
  export type TrustGraphEdgeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrustGraphEdges.
     */
    data: TrustGraphEdgeCreateManyInput | TrustGraphEdgeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrustGraphEdge createManyAndReturn
   */
  export type TrustGraphEdgeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TrustGraphEdges.
     */
    data: TrustGraphEdgeCreateManyInput | TrustGraphEdgeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrustGraphEdge update
   */
  export type TrustGraphEdgeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
    /**
     * The data needed to update a TrustGraphEdge.
     */
    data: XOR<TrustGraphEdgeUpdateInput, TrustGraphEdgeUncheckedUpdateInput>
    /**
     * Choose, which TrustGraphEdge to update.
     */
    where: TrustGraphEdgeWhereUniqueInput
  }

  /**
   * TrustGraphEdge updateMany
   */
  export type TrustGraphEdgeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrustGraphEdges.
     */
    data: XOR<TrustGraphEdgeUpdateManyMutationInput, TrustGraphEdgeUncheckedUpdateManyInput>
    /**
     * Filter which TrustGraphEdges to update
     */
    where?: TrustGraphEdgeWhereInput
  }

  /**
   * TrustGraphEdge upsert
   */
  export type TrustGraphEdgeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
    /**
     * The filter to search for the TrustGraphEdge to update in case it exists.
     */
    where: TrustGraphEdgeWhereUniqueInput
    /**
     * In case the TrustGraphEdge found by the `where` argument doesn't exist, create a new TrustGraphEdge with this data.
     */
    create: XOR<TrustGraphEdgeCreateInput, TrustGraphEdgeUncheckedCreateInput>
    /**
     * In case the TrustGraphEdge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrustGraphEdgeUpdateInput, TrustGraphEdgeUncheckedUpdateInput>
  }

  /**
   * TrustGraphEdge delete
   */
  export type TrustGraphEdgeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
    /**
     * Filter which TrustGraphEdge to delete.
     */
    where: TrustGraphEdgeWhereUniqueInput
  }

  /**
   * TrustGraphEdge deleteMany
   */
  export type TrustGraphEdgeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustGraphEdges to delete
     */
    where?: TrustGraphEdgeWhereInput
  }

  /**
   * TrustGraphEdge without action
   */
  export type TrustGraphEdgeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphEdge
     */
    select?: TrustGraphEdgeSelect<ExtArgs> | null
  }


  /**
   * Model TrustGraphSyncLog
   */

  export type AggregateTrustGraphSyncLog = {
    _count: TrustGraphSyncLogCountAggregateOutputType | null
    _avg: TrustGraphSyncLogAvgAggregateOutputType | null
    _sum: TrustGraphSyncLogSumAggregateOutputType | null
    _min: TrustGraphSyncLogMinAggregateOutputType | null
    _max: TrustGraphSyncLogMaxAggregateOutputType | null
  }

  export type TrustGraphSyncLogAvgAggregateOutputType = {
    retryCount: number | null
  }

  export type TrustGraphSyncLogSumAggregateOutputType = {
    retryCount: number | null
  }

  export type TrustGraphSyncLogMinAggregateOutputType = {
    id: string | null
    sourceType: string | null
    sourceId: string | null
    status: string | null
    retryCount: number | null
    lastError: string | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrustGraphSyncLogMaxAggregateOutputType = {
    id: string | null
    sourceType: string | null
    sourceId: string | null
    status: string | null
    retryCount: number | null
    lastError: string | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrustGraphSyncLogCountAggregateOutputType = {
    id: number
    sourceType: number
    sourceId: number
    status: number
    retryCount: number
    lastError: number
    lastSyncedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrustGraphSyncLogAvgAggregateInputType = {
    retryCount?: true
  }

  export type TrustGraphSyncLogSumAggregateInputType = {
    retryCount?: true
  }

  export type TrustGraphSyncLogMinAggregateInputType = {
    id?: true
    sourceType?: true
    sourceId?: true
    status?: true
    retryCount?: true
    lastError?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrustGraphSyncLogMaxAggregateInputType = {
    id?: true
    sourceType?: true
    sourceId?: true
    status?: true
    retryCount?: true
    lastError?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrustGraphSyncLogCountAggregateInputType = {
    id?: true
    sourceType?: true
    sourceId?: true
    status?: true
    retryCount?: true
    lastError?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrustGraphSyncLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustGraphSyncLog to aggregate.
     */
    where?: TrustGraphSyncLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphSyncLogs to fetch.
     */
    orderBy?: TrustGraphSyncLogOrderByWithRelationInput | TrustGraphSyncLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrustGraphSyncLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphSyncLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphSyncLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrustGraphSyncLogs
    **/
    _count?: true | TrustGraphSyncLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrustGraphSyncLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrustGraphSyncLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrustGraphSyncLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrustGraphSyncLogMaxAggregateInputType
  }

  export type GetTrustGraphSyncLogAggregateType<T extends TrustGraphSyncLogAggregateArgs> = {
        [P in keyof T & keyof AggregateTrustGraphSyncLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrustGraphSyncLog[P]>
      : GetScalarType<T[P], AggregateTrustGraphSyncLog[P]>
  }




  export type TrustGraphSyncLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrustGraphSyncLogWhereInput
    orderBy?: TrustGraphSyncLogOrderByWithAggregationInput | TrustGraphSyncLogOrderByWithAggregationInput[]
    by: TrustGraphSyncLogScalarFieldEnum[] | TrustGraphSyncLogScalarFieldEnum
    having?: TrustGraphSyncLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrustGraphSyncLogCountAggregateInputType | true
    _avg?: TrustGraphSyncLogAvgAggregateInputType
    _sum?: TrustGraphSyncLogSumAggregateInputType
    _min?: TrustGraphSyncLogMinAggregateInputType
    _max?: TrustGraphSyncLogMaxAggregateInputType
  }

  export type TrustGraphSyncLogGroupByOutputType = {
    id: string
    sourceType: string
    sourceId: string
    status: string
    retryCount: number
    lastError: string | null
    lastSyncedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TrustGraphSyncLogCountAggregateOutputType | null
    _avg: TrustGraphSyncLogAvgAggregateOutputType | null
    _sum: TrustGraphSyncLogSumAggregateOutputType | null
    _min: TrustGraphSyncLogMinAggregateOutputType | null
    _max: TrustGraphSyncLogMaxAggregateOutputType | null
  }

  type GetTrustGraphSyncLogGroupByPayload<T extends TrustGraphSyncLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrustGraphSyncLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrustGraphSyncLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrustGraphSyncLogGroupByOutputType[P]>
            : GetScalarType<T[P], TrustGraphSyncLogGroupByOutputType[P]>
        }
      >
    >


  export type TrustGraphSyncLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceType?: boolean
    sourceId?: boolean
    status?: boolean
    retryCount?: boolean
    lastError?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["trustGraphSyncLog"]>

  export type TrustGraphSyncLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceType?: boolean
    sourceId?: boolean
    status?: boolean
    retryCount?: boolean
    lastError?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["trustGraphSyncLog"]>

  export type TrustGraphSyncLogSelectScalar = {
    id?: boolean
    sourceType?: boolean
    sourceId?: boolean
    status?: boolean
    retryCount?: boolean
    lastError?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $TrustGraphSyncLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrustGraphSyncLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sourceType: string
      sourceId: string
      status: string
      retryCount: number
      lastError: string | null
      lastSyncedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trustGraphSyncLog"]>
    composites: {}
  }

  type TrustGraphSyncLogGetPayload<S extends boolean | null | undefined | TrustGraphSyncLogDefaultArgs> = $Result.GetResult<Prisma.$TrustGraphSyncLogPayload, S>

  type TrustGraphSyncLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrustGraphSyncLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrustGraphSyncLogCountAggregateInputType | true
    }

  export interface TrustGraphSyncLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrustGraphSyncLog'], meta: { name: 'TrustGraphSyncLog' } }
    /**
     * Find zero or one TrustGraphSyncLog that matches the filter.
     * @param {TrustGraphSyncLogFindUniqueArgs} args - Arguments to find a TrustGraphSyncLog
     * @example
     * // Get one TrustGraphSyncLog
     * const trustGraphSyncLog = await prisma.trustGraphSyncLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrustGraphSyncLogFindUniqueArgs>(args: SelectSubset<T, TrustGraphSyncLogFindUniqueArgs<ExtArgs>>): Prisma__TrustGraphSyncLogClient<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TrustGraphSyncLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrustGraphSyncLogFindUniqueOrThrowArgs} args - Arguments to find a TrustGraphSyncLog
     * @example
     * // Get one TrustGraphSyncLog
     * const trustGraphSyncLog = await prisma.trustGraphSyncLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrustGraphSyncLogFindUniqueOrThrowArgs>(args: SelectSubset<T, TrustGraphSyncLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrustGraphSyncLogClient<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TrustGraphSyncLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphSyncLogFindFirstArgs} args - Arguments to find a TrustGraphSyncLog
     * @example
     * // Get one TrustGraphSyncLog
     * const trustGraphSyncLog = await prisma.trustGraphSyncLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrustGraphSyncLogFindFirstArgs>(args?: SelectSubset<T, TrustGraphSyncLogFindFirstArgs<ExtArgs>>): Prisma__TrustGraphSyncLogClient<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TrustGraphSyncLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphSyncLogFindFirstOrThrowArgs} args - Arguments to find a TrustGraphSyncLog
     * @example
     * // Get one TrustGraphSyncLog
     * const trustGraphSyncLog = await prisma.trustGraphSyncLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrustGraphSyncLogFindFirstOrThrowArgs>(args?: SelectSubset<T, TrustGraphSyncLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrustGraphSyncLogClient<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TrustGraphSyncLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphSyncLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrustGraphSyncLogs
     * const trustGraphSyncLogs = await prisma.trustGraphSyncLog.findMany()
     * 
     * // Get first 10 TrustGraphSyncLogs
     * const trustGraphSyncLogs = await prisma.trustGraphSyncLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trustGraphSyncLogWithIdOnly = await prisma.trustGraphSyncLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrustGraphSyncLogFindManyArgs>(args?: SelectSubset<T, TrustGraphSyncLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TrustGraphSyncLog.
     * @param {TrustGraphSyncLogCreateArgs} args - Arguments to create a TrustGraphSyncLog.
     * @example
     * // Create one TrustGraphSyncLog
     * const TrustGraphSyncLog = await prisma.trustGraphSyncLog.create({
     *   data: {
     *     // ... data to create a TrustGraphSyncLog
     *   }
     * })
     * 
     */
    create<T extends TrustGraphSyncLogCreateArgs>(args: SelectSubset<T, TrustGraphSyncLogCreateArgs<ExtArgs>>): Prisma__TrustGraphSyncLogClient<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TrustGraphSyncLogs.
     * @param {TrustGraphSyncLogCreateManyArgs} args - Arguments to create many TrustGraphSyncLogs.
     * @example
     * // Create many TrustGraphSyncLogs
     * const trustGraphSyncLog = await prisma.trustGraphSyncLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrustGraphSyncLogCreateManyArgs>(args?: SelectSubset<T, TrustGraphSyncLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrustGraphSyncLogs and returns the data saved in the database.
     * @param {TrustGraphSyncLogCreateManyAndReturnArgs} args - Arguments to create many TrustGraphSyncLogs.
     * @example
     * // Create many TrustGraphSyncLogs
     * const trustGraphSyncLog = await prisma.trustGraphSyncLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrustGraphSyncLogs and only return the `id`
     * const trustGraphSyncLogWithIdOnly = await prisma.trustGraphSyncLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrustGraphSyncLogCreateManyAndReturnArgs>(args?: SelectSubset<T, TrustGraphSyncLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TrustGraphSyncLog.
     * @param {TrustGraphSyncLogDeleteArgs} args - Arguments to delete one TrustGraphSyncLog.
     * @example
     * // Delete one TrustGraphSyncLog
     * const TrustGraphSyncLog = await prisma.trustGraphSyncLog.delete({
     *   where: {
     *     // ... filter to delete one TrustGraphSyncLog
     *   }
     * })
     * 
     */
    delete<T extends TrustGraphSyncLogDeleteArgs>(args: SelectSubset<T, TrustGraphSyncLogDeleteArgs<ExtArgs>>): Prisma__TrustGraphSyncLogClient<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TrustGraphSyncLog.
     * @param {TrustGraphSyncLogUpdateArgs} args - Arguments to update one TrustGraphSyncLog.
     * @example
     * // Update one TrustGraphSyncLog
     * const trustGraphSyncLog = await prisma.trustGraphSyncLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrustGraphSyncLogUpdateArgs>(args: SelectSubset<T, TrustGraphSyncLogUpdateArgs<ExtArgs>>): Prisma__TrustGraphSyncLogClient<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TrustGraphSyncLogs.
     * @param {TrustGraphSyncLogDeleteManyArgs} args - Arguments to filter TrustGraphSyncLogs to delete.
     * @example
     * // Delete a few TrustGraphSyncLogs
     * const { count } = await prisma.trustGraphSyncLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrustGraphSyncLogDeleteManyArgs>(args?: SelectSubset<T, TrustGraphSyncLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrustGraphSyncLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphSyncLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrustGraphSyncLogs
     * const trustGraphSyncLog = await prisma.trustGraphSyncLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrustGraphSyncLogUpdateManyArgs>(args: SelectSubset<T, TrustGraphSyncLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TrustGraphSyncLog.
     * @param {TrustGraphSyncLogUpsertArgs} args - Arguments to update or create a TrustGraphSyncLog.
     * @example
     * // Update or create a TrustGraphSyncLog
     * const trustGraphSyncLog = await prisma.trustGraphSyncLog.upsert({
     *   create: {
     *     // ... data to create a TrustGraphSyncLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrustGraphSyncLog we want to update
     *   }
     * })
     */
    upsert<T extends TrustGraphSyncLogUpsertArgs>(args: SelectSubset<T, TrustGraphSyncLogUpsertArgs<ExtArgs>>): Prisma__TrustGraphSyncLogClient<$Result.GetResult<Prisma.$TrustGraphSyncLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TrustGraphSyncLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphSyncLogCountArgs} args - Arguments to filter TrustGraphSyncLogs to count.
     * @example
     * // Count the number of TrustGraphSyncLogs
     * const count = await prisma.trustGraphSyncLog.count({
     *   where: {
     *     // ... the filter for the TrustGraphSyncLogs we want to count
     *   }
     * })
    **/
    count<T extends TrustGraphSyncLogCountArgs>(
      args?: Subset<T, TrustGraphSyncLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrustGraphSyncLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrustGraphSyncLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphSyncLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrustGraphSyncLogAggregateArgs>(args: Subset<T, TrustGraphSyncLogAggregateArgs>): Prisma.PrismaPromise<GetTrustGraphSyncLogAggregateType<T>>

    /**
     * Group by TrustGraphSyncLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustGraphSyncLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrustGraphSyncLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrustGraphSyncLogGroupByArgs['orderBy'] }
        : { orderBy?: TrustGraphSyncLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrustGraphSyncLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrustGraphSyncLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrustGraphSyncLog model
   */
  readonly fields: TrustGraphSyncLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrustGraphSyncLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrustGraphSyncLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrustGraphSyncLog model
   */ 
  interface TrustGraphSyncLogFieldRefs {
    readonly id: FieldRef<"TrustGraphSyncLog", 'String'>
    readonly sourceType: FieldRef<"TrustGraphSyncLog", 'String'>
    readonly sourceId: FieldRef<"TrustGraphSyncLog", 'String'>
    readonly status: FieldRef<"TrustGraphSyncLog", 'String'>
    readonly retryCount: FieldRef<"TrustGraphSyncLog", 'Int'>
    readonly lastError: FieldRef<"TrustGraphSyncLog", 'String'>
    readonly lastSyncedAt: FieldRef<"TrustGraphSyncLog", 'DateTime'>
    readonly createdAt: FieldRef<"TrustGraphSyncLog", 'DateTime'>
    readonly updatedAt: FieldRef<"TrustGraphSyncLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrustGraphSyncLog findUnique
   */
  export type TrustGraphSyncLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphSyncLog to fetch.
     */
    where: TrustGraphSyncLogWhereUniqueInput
  }

  /**
   * TrustGraphSyncLog findUniqueOrThrow
   */
  export type TrustGraphSyncLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphSyncLog to fetch.
     */
    where: TrustGraphSyncLogWhereUniqueInput
  }

  /**
   * TrustGraphSyncLog findFirst
   */
  export type TrustGraphSyncLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphSyncLog to fetch.
     */
    where?: TrustGraphSyncLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphSyncLogs to fetch.
     */
    orderBy?: TrustGraphSyncLogOrderByWithRelationInput | TrustGraphSyncLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustGraphSyncLogs.
     */
    cursor?: TrustGraphSyncLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphSyncLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphSyncLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustGraphSyncLogs.
     */
    distinct?: TrustGraphSyncLogScalarFieldEnum | TrustGraphSyncLogScalarFieldEnum[]
  }

  /**
   * TrustGraphSyncLog findFirstOrThrow
   */
  export type TrustGraphSyncLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphSyncLog to fetch.
     */
    where?: TrustGraphSyncLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphSyncLogs to fetch.
     */
    orderBy?: TrustGraphSyncLogOrderByWithRelationInput | TrustGraphSyncLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustGraphSyncLogs.
     */
    cursor?: TrustGraphSyncLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphSyncLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphSyncLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustGraphSyncLogs.
     */
    distinct?: TrustGraphSyncLogScalarFieldEnum | TrustGraphSyncLogScalarFieldEnum[]
  }

  /**
   * TrustGraphSyncLog findMany
   */
  export type TrustGraphSyncLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
    /**
     * Filter, which TrustGraphSyncLogs to fetch.
     */
    where?: TrustGraphSyncLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustGraphSyncLogs to fetch.
     */
    orderBy?: TrustGraphSyncLogOrderByWithRelationInput | TrustGraphSyncLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrustGraphSyncLogs.
     */
    cursor?: TrustGraphSyncLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustGraphSyncLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustGraphSyncLogs.
     */
    skip?: number
    distinct?: TrustGraphSyncLogScalarFieldEnum | TrustGraphSyncLogScalarFieldEnum[]
  }

  /**
   * TrustGraphSyncLog create
   */
  export type TrustGraphSyncLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
    /**
     * The data needed to create a TrustGraphSyncLog.
     */
    data: XOR<TrustGraphSyncLogCreateInput, TrustGraphSyncLogUncheckedCreateInput>
  }

  /**
   * TrustGraphSyncLog createMany
   */
  export type TrustGraphSyncLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrustGraphSyncLogs.
     */
    data: TrustGraphSyncLogCreateManyInput | TrustGraphSyncLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrustGraphSyncLog createManyAndReturn
   */
  export type TrustGraphSyncLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TrustGraphSyncLogs.
     */
    data: TrustGraphSyncLogCreateManyInput | TrustGraphSyncLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrustGraphSyncLog update
   */
  export type TrustGraphSyncLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
    /**
     * The data needed to update a TrustGraphSyncLog.
     */
    data: XOR<TrustGraphSyncLogUpdateInput, TrustGraphSyncLogUncheckedUpdateInput>
    /**
     * Choose, which TrustGraphSyncLog to update.
     */
    where: TrustGraphSyncLogWhereUniqueInput
  }

  /**
   * TrustGraphSyncLog updateMany
   */
  export type TrustGraphSyncLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrustGraphSyncLogs.
     */
    data: XOR<TrustGraphSyncLogUpdateManyMutationInput, TrustGraphSyncLogUncheckedUpdateManyInput>
    /**
     * Filter which TrustGraphSyncLogs to update
     */
    where?: TrustGraphSyncLogWhereInput
  }

  /**
   * TrustGraphSyncLog upsert
   */
  export type TrustGraphSyncLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
    /**
     * The filter to search for the TrustGraphSyncLog to update in case it exists.
     */
    where: TrustGraphSyncLogWhereUniqueInput
    /**
     * In case the TrustGraphSyncLog found by the `where` argument doesn't exist, create a new TrustGraphSyncLog with this data.
     */
    create: XOR<TrustGraphSyncLogCreateInput, TrustGraphSyncLogUncheckedCreateInput>
    /**
     * In case the TrustGraphSyncLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrustGraphSyncLogUpdateInput, TrustGraphSyncLogUncheckedUpdateInput>
  }

  /**
   * TrustGraphSyncLog delete
   */
  export type TrustGraphSyncLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
    /**
     * Filter which TrustGraphSyncLog to delete.
     */
    where: TrustGraphSyncLogWhereUniqueInput
  }

  /**
   * TrustGraphSyncLog deleteMany
   */
  export type TrustGraphSyncLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustGraphSyncLogs to delete
     */
    where?: TrustGraphSyncLogWhereInput
  }

  /**
   * TrustGraphSyncLog without action
   */
  export type TrustGraphSyncLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustGraphSyncLog
     */
    select?: TrustGraphSyncLogSelect<ExtArgs> | null
  }


  /**
   * Model AuditConsistencyCheckLog
   */

  export type AggregateAuditConsistencyCheckLog = {
    _count: AuditConsistencyCheckLogCountAggregateOutputType | null
    _min: AuditConsistencyCheckLogMinAggregateOutputType | null
    _max: AuditConsistencyCheckLogMaxAggregateOutputType | null
  }

  export type AuditConsistencyCheckLogMinAggregateOutputType = {
    id: string | null
    checkType: string | null
    targetType: string | null
    targetId: string | null
    issueDetails: string | null
    severity: string | null
    status: string | null
    jobId: string | null
    handlerId: string | null
    handledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuditConsistencyCheckLogMaxAggregateOutputType = {
    id: string | null
    checkType: string | null
    targetType: string | null
    targetId: string | null
    issueDetails: string | null
    severity: string | null
    status: string | null
    jobId: string | null
    handlerId: string | null
    handledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuditConsistencyCheckLogCountAggregateOutputType = {
    id: number
    checkType: number
    targetType: number
    targetId: number
    issueDetails: number
    severity: number
    status: number
    jobId: number
    handlerId: number
    handledAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuditConsistencyCheckLogMinAggregateInputType = {
    id?: true
    checkType?: true
    targetType?: true
    targetId?: true
    issueDetails?: true
    severity?: true
    status?: true
    jobId?: true
    handlerId?: true
    handledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuditConsistencyCheckLogMaxAggregateInputType = {
    id?: true
    checkType?: true
    targetType?: true
    targetId?: true
    issueDetails?: true
    severity?: true
    status?: true
    jobId?: true
    handlerId?: true
    handledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuditConsistencyCheckLogCountAggregateInputType = {
    id?: true
    checkType?: true
    targetType?: true
    targetId?: true
    issueDetails?: true
    severity?: true
    status?: true
    jobId?: true
    handlerId?: true
    handledAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuditConsistencyCheckLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditConsistencyCheckLog to aggregate.
     */
    where?: AuditConsistencyCheckLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditConsistencyCheckLogs to fetch.
     */
    orderBy?: AuditConsistencyCheckLogOrderByWithRelationInput | AuditConsistencyCheckLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditConsistencyCheckLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditConsistencyCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditConsistencyCheckLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditConsistencyCheckLogs
    **/
    _count?: true | AuditConsistencyCheckLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditConsistencyCheckLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditConsistencyCheckLogMaxAggregateInputType
  }

  export type GetAuditConsistencyCheckLogAggregateType<T extends AuditConsistencyCheckLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditConsistencyCheckLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditConsistencyCheckLog[P]>
      : GetScalarType<T[P], AggregateAuditConsistencyCheckLog[P]>
  }




  export type AuditConsistencyCheckLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditConsistencyCheckLogWhereInput
    orderBy?: AuditConsistencyCheckLogOrderByWithAggregationInput | AuditConsistencyCheckLogOrderByWithAggregationInput[]
    by: AuditConsistencyCheckLogScalarFieldEnum[] | AuditConsistencyCheckLogScalarFieldEnum
    having?: AuditConsistencyCheckLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditConsistencyCheckLogCountAggregateInputType | true
    _min?: AuditConsistencyCheckLogMinAggregateInputType
    _max?: AuditConsistencyCheckLogMaxAggregateInputType
  }

  export type AuditConsistencyCheckLogGroupByOutputType = {
    id: string
    checkType: string
    targetType: string
    targetId: string
    issueDetails: string
    severity: string
    status: string
    jobId: string | null
    handlerId: string | null
    handledAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AuditConsistencyCheckLogCountAggregateOutputType | null
    _min: AuditConsistencyCheckLogMinAggregateOutputType | null
    _max: AuditConsistencyCheckLogMaxAggregateOutputType | null
  }

  type GetAuditConsistencyCheckLogGroupByPayload<T extends AuditConsistencyCheckLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditConsistencyCheckLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditConsistencyCheckLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditConsistencyCheckLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditConsistencyCheckLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditConsistencyCheckLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    checkType?: boolean
    targetType?: boolean
    targetId?: boolean
    issueDetails?: boolean
    severity?: boolean
    status?: boolean
    jobId?: boolean
    handlerId?: boolean
    handledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["auditConsistencyCheckLog"]>

  export type AuditConsistencyCheckLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    checkType?: boolean
    targetType?: boolean
    targetId?: boolean
    issueDetails?: boolean
    severity?: boolean
    status?: boolean
    jobId?: boolean
    handlerId?: boolean
    handledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["auditConsistencyCheckLog"]>

  export type AuditConsistencyCheckLogSelectScalar = {
    id?: boolean
    checkType?: boolean
    targetType?: boolean
    targetId?: boolean
    issueDetails?: boolean
    severity?: boolean
    status?: boolean
    jobId?: boolean
    handlerId?: boolean
    handledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $AuditConsistencyCheckLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditConsistencyCheckLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      checkType: string
      targetType: string
      targetId: string
      issueDetails: string
      severity: string
      status: string
      jobId: string | null
      handlerId: string | null
      handledAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["auditConsistencyCheckLog"]>
    composites: {}
  }

  type AuditConsistencyCheckLogGetPayload<S extends boolean | null | undefined | AuditConsistencyCheckLogDefaultArgs> = $Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload, S>

  type AuditConsistencyCheckLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditConsistencyCheckLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditConsistencyCheckLogCountAggregateInputType | true
    }

  export interface AuditConsistencyCheckLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditConsistencyCheckLog'], meta: { name: 'AuditConsistencyCheckLog' } }
    /**
     * Find zero or one AuditConsistencyCheckLog that matches the filter.
     * @param {AuditConsistencyCheckLogFindUniqueArgs} args - Arguments to find a AuditConsistencyCheckLog
     * @example
     * // Get one AuditConsistencyCheckLog
     * const auditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditConsistencyCheckLogFindUniqueArgs>(args: SelectSubset<T, AuditConsistencyCheckLogFindUniqueArgs<ExtArgs>>): Prisma__AuditConsistencyCheckLogClient<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditConsistencyCheckLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditConsistencyCheckLogFindUniqueOrThrowArgs} args - Arguments to find a AuditConsistencyCheckLog
     * @example
     * // Get one AuditConsistencyCheckLog
     * const auditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditConsistencyCheckLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditConsistencyCheckLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditConsistencyCheckLogClient<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditConsistencyCheckLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditConsistencyCheckLogFindFirstArgs} args - Arguments to find a AuditConsistencyCheckLog
     * @example
     * // Get one AuditConsistencyCheckLog
     * const auditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditConsistencyCheckLogFindFirstArgs>(args?: SelectSubset<T, AuditConsistencyCheckLogFindFirstArgs<ExtArgs>>): Prisma__AuditConsistencyCheckLogClient<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditConsistencyCheckLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditConsistencyCheckLogFindFirstOrThrowArgs} args - Arguments to find a AuditConsistencyCheckLog
     * @example
     * // Get one AuditConsistencyCheckLog
     * const auditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditConsistencyCheckLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditConsistencyCheckLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditConsistencyCheckLogClient<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditConsistencyCheckLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditConsistencyCheckLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditConsistencyCheckLogs
     * const auditConsistencyCheckLogs = await prisma.auditConsistencyCheckLog.findMany()
     * 
     * // Get first 10 AuditConsistencyCheckLogs
     * const auditConsistencyCheckLogs = await prisma.auditConsistencyCheckLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditConsistencyCheckLogWithIdOnly = await prisma.auditConsistencyCheckLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditConsistencyCheckLogFindManyArgs>(args?: SelectSubset<T, AuditConsistencyCheckLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditConsistencyCheckLog.
     * @param {AuditConsistencyCheckLogCreateArgs} args - Arguments to create a AuditConsistencyCheckLog.
     * @example
     * // Create one AuditConsistencyCheckLog
     * const AuditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.create({
     *   data: {
     *     // ... data to create a AuditConsistencyCheckLog
     *   }
     * })
     * 
     */
    create<T extends AuditConsistencyCheckLogCreateArgs>(args: SelectSubset<T, AuditConsistencyCheckLogCreateArgs<ExtArgs>>): Prisma__AuditConsistencyCheckLogClient<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditConsistencyCheckLogs.
     * @param {AuditConsistencyCheckLogCreateManyArgs} args - Arguments to create many AuditConsistencyCheckLogs.
     * @example
     * // Create many AuditConsistencyCheckLogs
     * const auditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditConsistencyCheckLogCreateManyArgs>(args?: SelectSubset<T, AuditConsistencyCheckLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditConsistencyCheckLogs and returns the data saved in the database.
     * @param {AuditConsistencyCheckLogCreateManyAndReturnArgs} args - Arguments to create many AuditConsistencyCheckLogs.
     * @example
     * // Create many AuditConsistencyCheckLogs
     * const auditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditConsistencyCheckLogs and only return the `id`
     * const auditConsistencyCheckLogWithIdOnly = await prisma.auditConsistencyCheckLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditConsistencyCheckLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditConsistencyCheckLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditConsistencyCheckLog.
     * @param {AuditConsistencyCheckLogDeleteArgs} args - Arguments to delete one AuditConsistencyCheckLog.
     * @example
     * // Delete one AuditConsistencyCheckLog
     * const AuditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.delete({
     *   where: {
     *     // ... filter to delete one AuditConsistencyCheckLog
     *   }
     * })
     * 
     */
    delete<T extends AuditConsistencyCheckLogDeleteArgs>(args: SelectSubset<T, AuditConsistencyCheckLogDeleteArgs<ExtArgs>>): Prisma__AuditConsistencyCheckLogClient<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditConsistencyCheckLog.
     * @param {AuditConsistencyCheckLogUpdateArgs} args - Arguments to update one AuditConsistencyCheckLog.
     * @example
     * // Update one AuditConsistencyCheckLog
     * const auditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditConsistencyCheckLogUpdateArgs>(args: SelectSubset<T, AuditConsistencyCheckLogUpdateArgs<ExtArgs>>): Prisma__AuditConsistencyCheckLogClient<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditConsistencyCheckLogs.
     * @param {AuditConsistencyCheckLogDeleteManyArgs} args - Arguments to filter AuditConsistencyCheckLogs to delete.
     * @example
     * // Delete a few AuditConsistencyCheckLogs
     * const { count } = await prisma.auditConsistencyCheckLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditConsistencyCheckLogDeleteManyArgs>(args?: SelectSubset<T, AuditConsistencyCheckLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditConsistencyCheckLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditConsistencyCheckLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditConsistencyCheckLogs
     * const auditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditConsistencyCheckLogUpdateManyArgs>(args: SelectSubset<T, AuditConsistencyCheckLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditConsistencyCheckLog.
     * @param {AuditConsistencyCheckLogUpsertArgs} args - Arguments to update or create a AuditConsistencyCheckLog.
     * @example
     * // Update or create a AuditConsistencyCheckLog
     * const auditConsistencyCheckLog = await prisma.auditConsistencyCheckLog.upsert({
     *   create: {
     *     // ... data to create a AuditConsistencyCheckLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditConsistencyCheckLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditConsistencyCheckLogUpsertArgs>(args: SelectSubset<T, AuditConsistencyCheckLogUpsertArgs<ExtArgs>>): Prisma__AuditConsistencyCheckLogClient<$Result.GetResult<Prisma.$AuditConsistencyCheckLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditConsistencyCheckLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditConsistencyCheckLogCountArgs} args - Arguments to filter AuditConsistencyCheckLogs to count.
     * @example
     * // Count the number of AuditConsistencyCheckLogs
     * const count = await prisma.auditConsistencyCheckLog.count({
     *   where: {
     *     // ... the filter for the AuditConsistencyCheckLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditConsistencyCheckLogCountArgs>(
      args?: Subset<T, AuditConsistencyCheckLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditConsistencyCheckLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditConsistencyCheckLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditConsistencyCheckLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditConsistencyCheckLogAggregateArgs>(args: Subset<T, AuditConsistencyCheckLogAggregateArgs>): Prisma.PrismaPromise<GetAuditConsistencyCheckLogAggregateType<T>>

    /**
     * Group by AuditConsistencyCheckLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditConsistencyCheckLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditConsistencyCheckLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditConsistencyCheckLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditConsistencyCheckLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditConsistencyCheckLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditConsistencyCheckLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditConsistencyCheckLog model
   */
  readonly fields: AuditConsistencyCheckLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditConsistencyCheckLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditConsistencyCheckLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditConsistencyCheckLog model
   */ 
  interface AuditConsistencyCheckLogFieldRefs {
    readonly id: FieldRef<"AuditConsistencyCheckLog", 'String'>
    readonly checkType: FieldRef<"AuditConsistencyCheckLog", 'String'>
    readonly targetType: FieldRef<"AuditConsistencyCheckLog", 'String'>
    readonly targetId: FieldRef<"AuditConsistencyCheckLog", 'String'>
    readonly issueDetails: FieldRef<"AuditConsistencyCheckLog", 'String'>
    readonly severity: FieldRef<"AuditConsistencyCheckLog", 'String'>
    readonly status: FieldRef<"AuditConsistencyCheckLog", 'String'>
    readonly jobId: FieldRef<"AuditConsistencyCheckLog", 'String'>
    readonly handlerId: FieldRef<"AuditConsistencyCheckLog", 'String'>
    readonly handledAt: FieldRef<"AuditConsistencyCheckLog", 'DateTime'>
    readonly createdAt: FieldRef<"AuditConsistencyCheckLog", 'DateTime'>
    readonly updatedAt: FieldRef<"AuditConsistencyCheckLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditConsistencyCheckLog findUnique
   */
  export type AuditConsistencyCheckLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditConsistencyCheckLog to fetch.
     */
    where: AuditConsistencyCheckLogWhereUniqueInput
  }

  /**
   * AuditConsistencyCheckLog findUniqueOrThrow
   */
  export type AuditConsistencyCheckLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditConsistencyCheckLog to fetch.
     */
    where: AuditConsistencyCheckLogWhereUniqueInput
  }

  /**
   * AuditConsistencyCheckLog findFirst
   */
  export type AuditConsistencyCheckLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditConsistencyCheckLog to fetch.
     */
    where?: AuditConsistencyCheckLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditConsistencyCheckLogs to fetch.
     */
    orderBy?: AuditConsistencyCheckLogOrderByWithRelationInput | AuditConsistencyCheckLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditConsistencyCheckLogs.
     */
    cursor?: AuditConsistencyCheckLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditConsistencyCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditConsistencyCheckLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditConsistencyCheckLogs.
     */
    distinct?: AuditConsistencyCheckLogScalarFieldEnum | AuditConsistencyCheckLogScalarFieldEnum[]
  }

  /**
   * AuditConsistencyCheckLog findFirstOrThrow
   */
  export type AuditConsistencyCheckLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditConsistencyCheckLog to fetch.
     */
    where?: AuditConsistencyCheckLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditConsistencyCheckLogs to fetch.
     */
    orderBy?: AuditConsistencyCheckLogOrderByWithRelationInput | AuditConsistencyCheckLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditConsistencyCheckLogs.
     */
    cursor?: AuditConsistencyCheckLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditConsistencyCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditConsistencyCheckLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditConsistencyCheckLogs.
     */
    distinct?: AuditConsistencyCheckLogScalarFieldEnum | AuditConsistencyCheckLogScalarFieldEnum[]
  }

  /**
   * AuditConsistencyCheckLog findMany
   */
  export type AuditConsistencyCheckLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditConsistencyCheckLogs to fetch.
     */
    where?: AuditConsistencyCheckLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditConsistencyCheckLogs to fetch.
     */
    orderBy?: AuditConsistencyCheckLogOrderByWithRelationInput | AuditConsistencyCheckLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditConsistencyCheckLogs.
     */
    cursor?: AuditConsistencyCheckLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditConsistencyCheckLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditConsistencyCheckLogs.
     */
    skip?: number
    distinct?: AuditConsistencyCheckLogScalarFieldEnum | AuditConsistencyCheckLogScalarFieldEnum[]
  }

  /**
   * AuditConsistencyCheckLog create
   */
  export type AuditConsistencyCheckLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AuditConsistencyCheckLog.
     */
    data: XOR<AuditConsistencyCheckLogCreateInput, AuditConsistencyCheckLogUncheckedCreateInput>
  }

  /**
   * AuditConsistencyCheckLog createMany
   */
  export type AuditConsistencyCheckLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditConsistencyCheckLogs.
     */
    data: AuditConsistencyCheckLogCreateManyInput | AuditConsistencyCheckLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditConsistencyCheckLog createManyAndReturn
   */
  export type AuditConsistencyCheckLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditConsistencyCheckLogs.
     */
    data: AuditConsistencyCheckLogCreateManyInput | AuditConsistencyCheckLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditConsistencyCheckLog update
   */
  export type AuditConsistencyCheckLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AuditConsistencyCheckLog.
     */
    data: XOR<AuditConsistencyCheckLogUpdateInput, AuditConsistencyCheckLogUncheckedUpdateInput>
    /**
     * Choose, which AuditConsistencyCheckLog to update.
     */
    where: AuditConsistencyCheckLogWhereUniqueInput
  }

  /**
   * AuditConsistencyCheckLog updateMany
   */
  export type AuditConsistencyCheckLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditConsistencyCheckLogs.
     */
    data: XOR<AuditConsistencyCheckLogUpdateManyMutationInput, AuditConsistencyCheckLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditConsistencyCheckLogs to update
     */
    where?: AuditConsistencyCheckLogWhereInput
  }

  /**
   * AuditConsistencyCheckLog upsert
   */
  export type AuditConsistencyCheckLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AuditConsistencyCheckLog to update in case it exists.
     */
    where: AuditConsistencyCheckLogWhereUniqueInput
    /**
     * In case the AuditConsistencyCheckLog found by the `where` argument doesn't exist, create a new AuditConsistencyCheckLog with this data.
     */
    create: XOR<AuditConsistencyCheckLogCreateInput, AuditConsistencyCheckLogUncheckedCreateInput>
    /**
     * In case the AuditConsistencyCheckLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditConsistencyCheckLogUpdateInput, AuditConsistencyCheckLogUncheckedUpdateInput>
  }

  /**
   * AuditConsistencyCheckLog delete
   */
  export type AuditConsistencyCheckLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
    /**
     * Filter which AuditConsistencyCheckLog to delete.
     */
    where: AuditConsistencyCheckLogWhereUniqueInput
  }

  /**
   * AuditConsistencyCheckLog deleteMany
   */
  export type AuditConsistencyCheckLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditConsistencyCheckLogs to delete
     */
    where?: AuditConsistencyCheckLogWhereInput
  }

  /**
   * AuditConsistencyCheckLog without action
   */
  export type AuditConsistencyCheckLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditConsistencyCheckLog
     */
    select?: AuditConsistencyCheckLogSelect<ExtArgs> | null
  }


  /**
   * Model GraphConsistencyLog
   */

  export type AggregateGraphConsistencyLog = {
    _count: GraphConsistencyLogCountAggregateOutputType | null
    _avg: GraphConsistencyLogAvgAggregateOutputType | null
    _sum: GraphConsistencyLogSumAggregateOutputType | null
    _min: GraphConsistencyLogMinAggregateOutputType | null
    _max: GraphConsistencyLogMaxAggregateOutputType | null
  }

  export type GraphConsistencyLogAvgAggregateOutputType = {
    expectedVersion: number | null
    actualVersion: number | null
  }

  export type GraphConsistencyLogSumAggregateOutputType = {
    expectedVersion: number | null
    actualVersion: number | null
  }

  export type GraphConsistencyLogMinAggregateOutputType = {
    id: string | null
    nodeOrEdgeId: string | null
    sourceType: string | null
    sourceId: string | null
    issueType: string | null
    expectedVersion: number | null
    actualVersion: number | null
    details: string | null
    status: string | null
    jobId: string | null
    handlerId: string | null
    handledAt: Date | null
    createdAt: Date | null
  }

  export type GraphConsistencyLogMaxAggregateOutputType = {
    id: string | null
    nodeOrEdgeId: string | null
    sourceType: string | null
    sourceId: string | null
    issueType: string | null
    expectedVersion: number | null
    actualVersion: number | null
    details: string | null
    status: string | null
    jobId: string | null
    handlerId: string | null
    handledAt: Date | null
    createdAt: Date | null
  }

  export type GraphConsistencyLogCountAggregateOutputType = {
    id: number
    nodeOrEdgeId: number
    sourceType: number
    sourceId: number
    issueType: number
    expectedVersion: number
    actualVersion: number
    details: number
    status: number
    jobId: number
    handlerId: number
    handledAt: number
    createdAt: number
    _all: number
  }


  export type GraphConsistencyLogAvgAggregateInputType = {
    expectedVersion?: true
    actualVersion?: true
  }

  export type GraphConsistencyLogSumAggregateInputType = {
    expectedVersion?: true
    actualVersion?: true
  }

  export type GraphConsistencyLogMinAggregateInputType = {
    id?: true
    nodeOrEdgeId?: true
    sourceType?: true
    sourceId?: true
    issueType?: true
    expectedVersion?: true
    actualVersion?: true
    details?: true
    status?: true
    jobId?: true
    handlerId?: true
    handledAt?: true
    createdAt?: true
  }

  export type GraphConsistencyLogMaxAggregateInputType = {
    id?: true
    nodeOrEdgeId?: true
    sourceType?: true
    sourceId?: true
    issueType?: true
    expectedVersion?: true
    actualVersion?: true
    details?: true
    status?: true
    jobId?: true
    handlerId?: true
    handledAt?: true
    createdAt?: true
  }

  export type GraphConsistencyLogCountAggregateInputType = {
    id?: true
    nodeOrEdgeId?: true
    sourceType?: true
    sourceId?: true
    issueType?: true
    expectedVersion?: true
    actualVersion?: true
    details?: true
    status?: true
    jobId?: true
    handlerId?: true
    handledAt?: true
    createdAt?: true
    _all?: true
  }

  export type GraphConsistencyLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GraphConsistencyLog to aggregate.
     */
    where?: GraphConsistencyLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GraphConsistencyLogs to fetch.
     */
    orderBy?: GraphConsistencyLogOrderByWithRelationInput | GraphConsistencyLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GraphConsistencyLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GraphConsistencyLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GraphConsistencyLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GraphConsistencyLogs
    **/
    _count?: true | GraphConsistencyLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GraphConsistencyLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GraphConsistencyLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GraphConsistencyLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GraphConsistencyLogMaxAggregateInputType
  }

  export type GetGraphConsistencyLogAggregateType<T extends GraphConsistencyLogAggregateArgs> = {
        [P in keyof T & keyof AggregateGraphConsistencyLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGraphConsistencyLog[P]>
      : GetScalarType<T[P], AggregateGraphConsistencyLog[P]>
  }




  export type GraphConsistencyLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GraphConsistencyLogWhereInput
    orderBy?: GraphConsistencyLogOrderByWithAggregationInput | GraphConsistencyLogOrderByWithAggregationInput[]
    by: GraphConsistencyLogScalarFieldEnum[] | GraphConsistencyLogScalarFieldEnum
    having?: GraphConsistencyLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GraphConsistencyLogCountAggregateInputType | true
    _avg?: GraphConsistencyLogAvgAggregateInputType
    _sum?: GraphConsistencyLogSumAggregateInputType
    _min?: GraphConsistencyLogMinAggregateInputType
    _max?: GraphConsistencyLogMaxAggregateInputType
  }

  export type GraphConsistencyLogGroupByOutputType = {
    id: string
    nodeOrEdgeId: string | null
    sourceType: string
    sourceId: string
    issueType: string
    expectedVersion: number | null
    actualVersion: number | null
    details: string | null
    status: string
    jobId: string | null
    handlerId: string | null
    handledAt: Date | null
    createdAt: Date
    _count: GraphConsistencyLogCountAggregateOutputType | null
    _avg: GraphConsistencyLogAvgAggregateOutputType | null
    _sum: GraphConsistencyLogSumAggregateOutputType | null
    _min: GraphConsistencyLogMinAggregateOutputType | null
    _max: GraphConsistencyLogMaxAggregateOutputType | null
  }

  type GetGraphConsistencyLogGroupByPayload<T extends GraphConsistencyLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GraphConsistencyLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GraphConsistencyLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GraphConsistencyLogGroupByOutputType[P]>
            : GetScalarType<T[P], GraphConsistencyLogGroupByOutputType[P]>
        }
      >
    >


  export type GraphConsistencyLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nodeOrEdgeId?: boolean
    sourceType?: boolean
    sourceId?: boolean
    issueType?: boolean
    expectedVersion?: boolean
    actualVersion?: boolean
    details?: boolean
    status?: boolean
    jobId?: boolean
    handlerId?: boolean
    handledAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["graphConsistencyLog"]>

  export type GraphConsistencyLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nodeOrEdgeId?: boolean
    sourceType?: boolean
    sourceId?: boolean
    issueType?: boolean
    expectedVersion?: boolean
    actualVersion?: boolean
    details?: boolean
    status?: boolean
    jobId?: boolean
    handlerId?: boolean
    handledAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["graphConsistencyLog"]>

  export type GraphConsistencyLogSelectScalar = {
    id?: boolean
    nodeOrEdgeId?: boolean
    sourceType?: boolean
    sourceId?: boolean
    issueType?: boolean
    expectedVersion?: boolean
    actualVersion?: boolean
    details?: boolean
    status?: boolean
    jobId?: boolean
    handlerId?: boolean
    handledAt?: boolean
    createdAt?: boolean
  }


  export type $GraphConsistencyLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GraphConsistencyLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nodeOrEdgeId: string | null
      sourceType: string
      sourceId: string
      issueType: string
      expectedVersion: number | null
      actualVersion: number | null
      details: string | null
      status: string
      jobId: string | null
      handlerId: string | null
      handledAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["graphConsistencyLog"]>
    composites: {}
  }

  type GraphConsistencyLogGetPayload<S extends boolean | null | undefined | GraphConsistencyLogDefaultArgs> = $Result.GetResult<Prisma.$GraphConsistencyLogPayload, S>

  type GraphConsistencyLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GraphConsistencyLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GraphConsistencyLogCountAggregateInputType | true
    }

  export interface GraphConsistencyLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GraphConsistencyLog'], meta: { name: 'GraphConsistencyLog' } }
    /**
     * Find zero or one GraphConsistencyLog that matches the filter.
     * @param {GraphConsistencyLogFindUniqueArgs} args - Arguments to find a GraphConsistencyLog
     * @example
     * // Get one GraphConsistencyLog
     * const graphConsistencyLog = await prisma.graphConsistencyLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GraphConsistencyLogFindUniqueArgs>(args: SelectSubset<T, GraphConsistencyLogFindUniqueArgs<ExtArgs>>): Prisma__GraphConsistencyLogClient<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GraphConsistencyLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GraphConsistencyLogFindUniqueOrThrowArgs} args - Arguments to find a GraphConsistencyLog
     * @example
     * // Get one GraphConsistencyLog
     * const graphConsistencyLog = await prisma.graphConsistencyLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GraphConsistencyLogFindUniqueOrThrowArgs>(args: SelectSubset<T, GraphConsistencyLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GraphConsistencyLogClient<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GraphConsistencyLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraphConsistencyLogFindFirstArgs} args - Arguments to find a GraphConsistencyLog
     * @example
     * // Get one GraphConsistencyLog
     * const graphConsistencyLog = await prisma.graphConsistencyLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GraphConsistencyLogFindFirstArgs>(args?: SelectSubset<T, GraphConsistencyLogFindFirstArgs<ExtArgs>>): Prisma__GraphConsistencyLogClient<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GraphConsistencyLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraphConsistencyLogFindFirstOrThrowArgs} args - Arguments to find a GraphConsistencyLog
     * @example
     * // Get one GraphConsistencyLog
     * const graphConsistencyLog = await prisma.graphConsistencyLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GraphConsistencyLogFindFirstOrThrowArgs>(args?: SelectSubset<T, GraphConsistencyLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__GraphConsistencyLogClient<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GraphConsistencyLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraphConsistencyLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GraphConsistencyLogs
     * const graphConsistencyLogs = await prisma.graphConsistencyLog.findMany()
     * 
     * // Get first 10 GraphConsistencyLogs
     * const graphConsistencyLogs = await prisma.graphConsistencyLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const graphConsistencyLogWithIdOnly = await prisma.graphConsistencyLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GraphConsistencyLogFindManyArgs>(args?: SelectSubset<T, GraphConsistencyLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GraphConsistencyLog.
     * @param {GraphConsistencyLogCreateArgs} args - Arguments to create a GraphConsistencyLog.
     * @example
     * // Create one GraphConsistencyLog
     * const GraphConsistencyLog = await prisma.graphConsistencyLog.create({
     *   data: {
     *     // ... data to create a GraphConsistencyLog
     *   }
     * })
     * 
     */
    create<T extends GraphConsistencyLogCreateArgs>(args: SelectSubset<T, GraphConsistencyLogCreateArgs<ExtArgs>>): Prisma__GraphConsistencyLogClient<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GraphConsistencyLogs.
     * @param {GraphConsistencyLogCreateManyArgs} args - Arguments to create many GraphConsistencyLogs.
     * @example
     * // Create many GraphConsistencyLogs
     * const graphConsistencyLog = await prisma.graphConsistencyLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GraphConsistencyLogCreateManyArgs>(args?: SelectSubset<T, GraphConsistencyLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GraphConsistencyLogs and returns the data saved in the database.
     * @param {GraphConsistencyLogCreateManyAndReturnArgs} args - Arguments to create many GraphConsistencyLogs.
     * @example
     * // Create many GraphConsistencyLogs
     * const graphConsistencyLog = await prisma.graphConsistencyLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GraphConsistencyLogs and only return the `id`
     * const graphConsistencyLogWithIdOnly = await prisma.graphConsistencyLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GraphConsistencyLogCreateManyAndReturnArgs>(args?: SelectSubset<T, GraphConsistencyLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GraphConsistencyLog.
     * @param {GraphConsistencyLogDeleteArgs} args - Arguments to delete one GraphConsistencyLog.
     * @example
     * // Delete one GraphConsistencyLog
     * const GraphConsistencyLog = await prisma.graphConsistencyLog.delete({
     *   where: {
     *     // ... filter to delete one GraphConsistencyLog
     *   }
     * })
     * 
     */
    delete<T extends GraphConsistencyLogDeleteArgs>(args: SelectSubset<T, GraphConsistencyLogDeleteArgs<ExtArgs>>): Prisma__GraphConsistencyLogClient<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GraphConsistencyLog.
     * @param {GraphConsistencyLogUpdateArgs} args - Arguments to update one GraphConsistencyLog.
     * @example
     * // Update one GraphConsistencyLog
     * const graphConsistencyLog = await prisma.graphConsistencyLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GraphConsistencyLogUpdateArgs>(args: SelectSubset<T, GraphConsistencyLogUpdateArgs<ExtArgs>>): Prisma__GraphConsistencyLogClient<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GraphConsistencyLogs.
     * @param {GraphConsistencyLogDeleteManyArgs} args - Arguments to filter GraphConsistencyLogs to delete.
     * @example
     * // Delete a few GraphConsistencyLogs
     * const { count } = await prisma.graphConsistencyLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GraphConsistencyLogDeleteManyArgs>(args?: SelectSubset<T, GraphConsistencyLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GraphConsistencyLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraphConsistencyLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GraphConsistencyLogs
     * const graphConsistencyLog = await prisma.graphConsistencyLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GraphConsistencyLogUpdateManyArgs>(args: SelectSubset<T, GraphConsistencyLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GraphConsistencyLog.
     * @param {GraphConsistencyLogUpsertArgs} args - Arguments to update or create a GraphConsistencyLog.
     * @example
     * // Update or create a GraphConsistencyLog
     * const graphConsistencyLog = await prisma.graphConsistencyLog.upsert({
     *   create: {
     *     // ... data to create a GraphConsistencyLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GraphConsistencyLog we want to update
     *   }
     * })
     */
    upsert<T extends GraphConsistencyLogUpsertArgs>(args: SelectSubset<T, GraphConsistencyLogUpsertArgs<ExtArgs>>): Prisma__GraphConsistencyLogClient<$Result.GetResult<Prisma.$GraphConsistencyLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GraphConsistencyLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraphConsistencyLogCountArgs} args - Arguments to filter GraphConsistencyLogs to count.
     * @example
     * // Count the number of GraphConsistencyLogs
     * const count = await prisma.graphConsistencyLog.count({
     *   where: {
     *     // ... the filter for the GraphConsistencyLogs we want to count
     *   }
     * })
    **/
    count<T extends GraphConsistencyLogCountArgs>(
      args?: Subset<T, GraphConsistencyLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GraphConsistencyLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GraphConsistencyLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraphConsistencyLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GraphConsistencyLogAggregateArgs>(args: Subset<T, GraphConsistencyLogAggregateArgs>): Prisma.PrismaPromise<GetGraphConsistencyLogAggregateType<T>>

    /**
     * Group by GraphConsistencyLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraphConsistencyLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GraphConsistencyLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GraphConsistencyLogGroupByArgs['orderBy'] }
        : { orderBy?: GraphConsistencyLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GraphConsistencyLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGraphConsistencyLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GraphConsistencyLog model
   */
  readonly fields: GraphConsistencyLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GraphConsistencyLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GraphConsistencyLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GraphConsistencyLog model
   */ 
  interface GraphConsistencyLogFieldRefs {
    readonly id: FieldRef<"GraphConsistencyLog", 'String'>
    readonly nodeOrEdgeId: FieldRef<"GraphConsistencyLog", 'String'>
    readonly sourceType: FieldRef<"GraphConsistencyLog", 'String'>
    readonly sourceId: FieldRef<"GraphConsistencyLog", 'String'>
    readonly issueType: FieldRef<"GraphConsistencyLog", 'String'>
    readonly expectedVersion: FieldRef<"GraphConsistencyLog", 'Int'>
    readonly actualVersion: FieldRef<"GraphConsistencyLog", 'Int'>
    readonly details: FieldRef<"GraphConsistencyLog", 'String'>
    readonly status: FieldRef<"GraphConsistencyLog", 'String'>
    readonly jobId: FieldRef<"GraphConsistencyLog", 'String'>
    readonly handlerId: FieldRef<"GraphConsistencyLog", 'String'>
    readonly handledAt: FieldRef<"GraphConsistencyLog", 'DateTime'>
    readonly createdAt: FieldRef<"GraphConsistencyLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GraphConsistencyLog findUnique
   */
  export type GraphConsistencyLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
    /**
     * Filter, which GraphConsistencyLog to fetch.
     */
    where: GraphConsistencyLogWhereUniqueInput
  }

  /**
   * GraphConsistencyLog findUniqueOrThrow
   */
  export type GraphConsistencyLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
    /**
     * Filter, which GraphConsistencyLog to fetch.
     */
    where: GraphConsistencyLogWhereUniqueInput
  }

  /**
   * GraphConsistencyLog findFirst
   */
  export type GraphConsistencyLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
    /**
     * Filter, which GraphConsistencyLog to fetch.
     */
    where?: GraphConsistencyLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GraphConsistencyLogs to fetch.
     */
    orderBy?: GraphConsistencyLogOrderByWithRelationInput | GraphConsistencyLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GraphConsistencyLogs.
     */
    cursor?: GraphConsistencyLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GraphConsistencyLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GraphConsistencyLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GraphConsistencyLogs.
     */
    distinct?: GraphConsistencyLogScalarFieldEnum | GraphConsistencyLogScalarFieldEnum[]
  }

  /**
   * GraphConsistencyLog findFirstOrThrow
   */
  export type GraphConsistencyLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
    /**
     * Filter, which GraphConsistencyLog to fetch.
     */
    where?: GraphConsistencyLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GraphConsistencyLogs to fetch.
     */
    orderBy?: GraphConsistencyLogOrderByWithRelationInput | GraphConsistencyLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GraphConsistencyLogs.
     */
    cursor?: GraphConsistencyLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GraphConsistencyLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GraphConsistencyLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GraphConsistencyLogs.
     */
    distinct?: GraphConsistencyLogScalarFieldEnum | GraphConsistencyLogScalarFieldEnum[]
  }

  /**
   * GraphConsistencyLog findMany
   */
  export type GraphConsistencyLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
    /**
     * Filter, which GraphConsistencyLogs to fetch.
     */
    where?: GraphConsistencyLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GraphConsistencyLogs to fetch.
     */
    orderBy?: GraphConsistencyLogOrderByWithRelationInput | GraphConsistencyLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GraphConsistencyLogs.
     */
    cursor?: GraphConsistencyLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GraphConsistencyLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GraphConsistencyLogs.
     */
    skip?: number
    distinct?: GraphConsistencyLogScalarFieldEnum | GraphConsistencyLogScalarFieldEnum[]
  }

  /**
   * GraphConsistencyLog create
   */
  export type GraphConsistencyLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
    /**
     * The data needed to create a GraphConsistencyLog.
     */
    data: XOR<GraphConsistencyLogCreateInput, GraphConsistencyLogUncheckedCreateInput>
  }

  /**
   * GraphConsistencyLog createMany
   */
  export type GraphConsistencyLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GraphConsistencyLogs.
     */
    data: GraphConsistencyLogCreateManyInput | GraphConsistencyLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GraphConsistencyLog createManyAndReturn
   */
  export type GraphConsistencyLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GraphConsistencyLogs.
     */
    data: GraphConsistencyLogCreateManyInput | GraphConsistencyLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GraphConsistencyLog update
   */
  export type GraphConsistencyLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
    /**
     * The data needed to update a GraphConsistencyLog.
     */
    data: XOR<GraphConsistencyLogUpdateInput, GraphConsistencyLogUncheckedUpdateInput>
    /**
     * Choose, which GraphConsistencyLog to update.
     */
    where: GraphConsistencyLogWhereUniqueInput
  }

  /**
   * GraphConsistencyLog updateMany
   */
  export type GraphConsistencyLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GraphConsistencyLogs.
     */
    data: XOR<GraphConsistencyLogUpdateManyMutationInput, GraphConsistencyLogUncheckedUpdateManyInput>
    /**
     * Filter which GraphConsistencyLogs to update
     */
    where?: GraphConsistencyLogWhereInput
  }

  /**
   * GraphConsistencyLog upsert
   */
  export type GraphConsistencyLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
    /**
     * The filter to search for the GraphConsistencyLog to update in case it exists.
     */
    where: GraphConsistencyLogWhereUniqueInput
    /**
     * In case the GraphConsistencyLog found by the `where` argument doesn't exist, create a new GraphConsistencyLog with this data.
     */
    create: XOR<GraphConsistencyLogCreateInput, GraphConsistencyLogUncheckedCreateInput>
    /**
     * In case the GraphConsistencyLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GraphConsistencyLogUpdateInput, GraphConsistencyLogUncheckedUpdateInput>
  }

  /**
   * GraphConsistencyLog delete
   */
  export type GraphConsistencyLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
    /**
     * Filter which GraphConsistencyLog to delete.
     */
    where: GraphConsistencyLogWhereUniqueInput
  }

  /**
   * GraphConsistencyLog deleteMany
   */
  export type GraphConsistencyLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GraphConsistencyLogs to delete
     */
    where?: GraphConsistencyLogWhereInput
  }

  /**
   * GraphConsistencyLog without action
   */
  export type GraphConsistencyLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraphConsistencyLog
     */
    select?: GraphConsistencyLogSelect<ExtArgs> | null
  }


  /**
   * Model IntegrityJobLog
   */

  export type AggregateIntegrityJobLog = {
    _count: IntegrityJobLogCountAggregateOutputType | null
    _avg: IntegrityJobLogAvgAggregateOutputType | null
    _sum: IntegrityJobLogSumAggregateOutputType | null
    _min: IntegrityJobLogMinAggregateOutputType | null
    _max: IntegrityJobLogMaxAggregateOutputType | null
  }

  export type IntegrityJobLogAvgAggregateOutputType = {
    totalRecordsChecked: number | null
    totalIssuesFound: number | null
  }

  export type IntegrityJobLogSumAggregateOutputType = {
    totalRecordsChecked: number | null
    totalIssuesFound: number | null
  }

  export type IntegrityJobLogMinAggregateOutputType = {
    id: string | null
    jobType: string | null
    startedAt: Date | null
    endedAt: Date | null
    totalRecordsChecked: number | null
    totalIssuesFound: number | null
    status: string | null
  }

  export type IntegrityJobLogMaxAggregateOutputType = {
    id: string | null
    jobType: string | null
    startedAt: Date | null
    endedAt: Date | null
    totalRecordsChecked: number | null
    totalIssuesFound: number | null
    status: string | null
  }

  export type IntegrityJobLogCountAggregateOutputType = {
    id: number
    jobType: number
    startedAt: number
    endedAt: number
    totalRecordsChecked: number
    totalIssuesFound: number
    status: number
    reportSummary: number
    _all: number
  }


  export type IntegrityJobLogAvgAggregateInputType = {
    totalRecordsChecked?: true
    totalIssuesFound?: true
  }

  export type IntegrityJobLogSumAggregateInputType = {
    totalRecordsChecked?: true
    totalIssuesFound?: true
  }

  export type IntegrityJobLogMinAggregateInputType = {
    id?: true
    jobType?: true
    startedAt?: true
    endedAt?: true
    totalRecordsChecked?: true
    totalIssuesFound?: true
    status?: true
  }

  export type IntegrityJobLogMaxAggregateInputType = {
    id?: true
    jobType?: true
    startedAt?: true
    endedAt?: true
    totalRecordsChecked?: true
    totalIssuesFound?: true
    status?: true
  }

  export type IntegrityJobLogCountAggregateInputType = {
    id?: true
    jobType?: true
    startedAt?: true
    endedAt?: true
    totalRecordsChecked?: true
    totalIssuesFound?: true
    status?: true
    reportSummary?: true
    _all?: true
  }

  export type IntegrityJobLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrityJobLog to aggregate.
     */
    where?: IntegrityJobLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrityJobLogs to fetch.
     */
    orderBy?: IntegrityJobLogOrderByWithRelationInput | IntegrityJobLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IntegrityJobLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrityJobLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrityJobLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IntegrityJobLogs
    **/
    _count?: true | IntegrityJobLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IntegrityJobLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IntegrityJobLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IntegrityJobLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IntegrityJobLogMaxAggregateInputType
  }

  export type GetIntegrityJobLogAggregateType<T extends IntegrityJobLogAggregateArgs> = {
        [P in keyof T & keyof AggregateIntegrityJobLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIntegrityJobLog[P]>
      : GetScalarType<T[P], AggregateIntegrityJobLog[P]>
  }




  export type IntegrityJobLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IntegrityJobLogWhereInput
    orderBy?: IntegrityJobLogOrderByWithAggregationInput | IntegrityJobLogOrderByWithAggregationInput[]
    by: IntegrityJobLogScalarFieldEnum[] | IntegrityJobLogScalarFieldEnum
    having?: IntegrityJobLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IntegrityJobLogCountAggregateInputType | true
    _avg?: IntegrityJobLogAvgAggregateInputType
    _sum?: IntegrityJobLogSumAggregateInputType
    _min?: IntegrityJobLogMinAggregateInputType
    _max?: IntegrityJobLogMaxAggregateInputType
  }

  export type IntegrityJobLogGroupByOutputType = {
    id: string
    jobType: string
    startedAt: Date
    endedAt: Date
    totalRecordsChecked: number
    totalIssuesFound: number
    status: string
    reportSummary: JsonValue | null
    _count: IntegrityJobLogCountAggregateOutputType | null
    _avg: IntegrityJobLogAvgAggregateOutputType | null
    _sum: IntegrityJobLogSumAggregateOutputType | null
    _min: IntegrityJobLogMinAggregateOutputType | null
    _max: IntegrityJobLogMaxAggregateOutputType | null
  }

  type GetIntegrityJobLogGroupByPayload<T extends IntegrityJobLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IntegrityJobLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IntegrityJobLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IntegrityJobLogGroupByOutputType[P]>
            : GetScalarType<T[P], IntegrityJobLogGroupByOutputType[P]>
        }
      >
    >


  export type IntegrityJobLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobType?: boolean
    startedAt?: boolean
    endedAt?: boolean
    totalRecordsChecked?: boolean
    totalIssuesFound?: boolean
    status?: boolean
    reportSummary?: boolean
  }, ExtArgs["result"]["integrityJobLog"]>

  export type IntegrityJobLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobType?: boolean
    startedAt?: boolean
    endedAt?: boolean
    totalRecordsChecked?: boolean
    totalIssuesFound?: boolean
    status?: boolean
    reportSummary?: boolean
  }, ExtArgs["result"]["integrityJobLog"]>

  export type IntegrityJobLogSelectScalar = {
    id?: boolean
    jobType?: boolean
    startedAt?: boolean
    endedAt?: boolean
    totalRecordsChecked?: boolean
    totalIssuesFound?: boolean
    status?: boolean
    reportSummary?: boolean
  }


  export type $IntegrityJobLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IntegrityJobLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      jobType: string
      startedAt: Date
      endedAt: Date
      totalRecordsChecked: number
      totalIssuesFound: number
      status: string
      reportSummary: Prisma.JsonValue | null
    }, ExtArgs["result"]["integrityJobLog"]>
    composites: {}
  }

  type IntegrityJobLogGetPayload<S extends boolean | null | undefined | IntegrityJobLogDefaultArgs> = $Result.GetResult<Prisma.$IntegrityJobLogPayload, S>

  type IntegrityJobLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<IntegrityJobLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: IntegrityJobLogCountAggregateInputType | true
    }

  export interface IntegrityJobLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IntegrityJobLog'], meta: { name: 'IntegrityJobLog' } }
    /**
     * Find zero or one IntegrityJobLog that matches the filter.
     * @param {IntegrityJobLogFindUniqueArgs} args - Arguments to find a IntegrityJobLog
     * @example
     * // Get one IntegrityJobLog
     * const integrityJobLog = await prisma.integrityJobLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IntegrityJobLogFindUniqueArgs>(args: SelectSubset<T, IntegrityJobLogFindUniqueArgs<ExtArgs>>): Prisma__IntegrityJobLogClient<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one IntegrityJobLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {IntegrityJobLogFindUniqueOrThrowArgs} args - Arguments to find a IntegrityJobLog
     * @example
     * // Get one IntegrityJobLog
     * const integrityJobLog = await prisma.integrityJobLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IntegrityJobLogFindUniqueOrThrowArgs>(args: SelectSubset<T, IntegrityJobLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IntegrityJobLogClient<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first IntegrityJobLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityJobLogFindFirstArgs} args - Arguments to find a IntegrityJobLog
     * @example
     * // Get one IntegrityJobLog
     * const integrityJobLog = await prisma.integrityJobLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IntegrityJobLogFindFirstArgs>(args?: SelectSubset<T, IntegrityJobLogFindFirstArgs<ExtArgs>>): Prisma__IntegrityJobLogClient<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first IntegrityJobLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityJobLogFindFirstOrThrowArgs} args - Arguments to find a IntegrityJobLog
     * @example
     * // Get one IntegrityJobLog
     * const integrityJobLog = await prisma.integrityJobLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IntegrityJobLogFindFirstOrThrowArgs>(args?: SelectSubset<T, IntegrityJobLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__IntegrityJobLogClient<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more IntegrityJobLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityJobLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IntegrityJobLogs
     * const integrityJobLogs = await prisma.integrityJobLog.findMany()
     * 
     * // Get first 10 IntegrityJobLogs
     * const integrityJobLogs = await prisma.integrityJobLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const integrityJobLogWithIdOnly = await prisma.integrityJobLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IntegrityJobLogFindManyArgs>(args?: SelectSubset<T, IntegrityJobLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a IntegrityJobLog.
     * @param {IntegrityJobLogCreateArgs} args - Arguments to create a IntegrityJobLog.
     * @example
     * // Create one IntegrityJobLog
     * const IntegrityJobLog = await prisma.integrityJobLog.create({
     *   data: {
     *     // ... data to create a IntegrityJobLog
     *   }
     * })
     * 
     */
    create<T extends IntegrityJobLogCreateArgs>(args: SelectSubset<T, IntegrityJobLogCreateArgs<ExtArgs>>): Prisma__IntegrityJobLogClient<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many IntegrityJobLogs.
     * @param {IntegrityJobLogCreateManyArgs} args - Arguments to create many IntegrityJobLogs.
     * @example
     * // Create many IntegrityJobLogs
     * const integrityJobLog = await prisma.integrityJobLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IntegrityJobLogCreateManyArgs>(args?: SelectSubset<T, IntegrityJobLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IntegrityJobLogs and returns the data saved in the database.
     * @param {IntegrityJobLogCreateManyAndReturnArgs} args - Arguments to create many IntegrityJobLogs.
     * @example
     * // Create many IntegrityJobLogs
     * const integrityJobLog = await prisma.integrityJobLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IntegrityJobLogs and only return the `id`
     * const integrityJobLogWithIdOnly = await prisma.integrityJobLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IntegrityJobLogCreateManyAndReturnArgs>(args?: SelectSubset<T, IntegrityJobLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a IntegrityJobLog.
     * @param {IntegrityJobLogDeleteArgs} args - Arguments to delete one IntegrityJobLog.
     * @example
     * // Delete one IntegrityJobLog
     * const IntegrityJobLog = await prisma.integrityJobLog.delete({
     *   where: {
     *     // ... filter to delete one IntegrityJobLog
     *   }
     * })
     * 
     */
    delete<T extends IntegrityJobLogDeleteArgs>(args: SelectSubset<T, IntegrityJobLogDeleteArgs<ExtArgs>>): Prisma__IntegrityJobLogClient<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one IntegrityJobLog.
     * @param {IntegrityJobLogUpdateArgs} args - Arguments to update one IntegrityJobLog.
     * @example
     * // Update one IntegrityJobLog
     * const integrityJobLog = await prisma.integrityJobLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IntegrityJobLogUpdateArgs>(args: SelectSubset<T, IntegrityJobLogUpdateArgs<ExtArgs>>): Prisma__IntegrityJobLogClient<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more IntegrityJobLogs.
     * @param {IntegrityJobLogDeleteManyArgs} args - Arguments to filter IntegrityJobLogs to delete.
     * @example
     * // Delete a few IntegrityJobLogs
     * const { count } = await prisma.integrityJobLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IntegrityJobLogDeleteManyArgs>(args?: SelectSubset<T, IntegrityJobLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IntegrityJobLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityJobLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IntegrityJobLogs
     * const integrityJobLog = await prisma.integrityJobLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IntegrityJobLogUpdateManyArgs>(args: SelectSubset<T, IntegrityJobLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one IntegrityJobLog.
     * @param {IntegrityJobLogUpsertArgs} args - Arguments to update or create a IntegrityJobLog.
     * @example
     * // Update or create a IntegrityJobLog
     * const integrityJobLog = await prisma.integrityJobLog.upsert({
     *   create: {
     *     // ... data to create a IntegrityJobLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IntegrityJobLog we want to update
     *   }
     * })
     */
    upsert<T extends IntegrityJobLogUpsertArgs>(args: SelectSubset<T, IntegrityJobLogUpsertArgs<ExtArgs>>): Prisma__IntegrityJobLogClient<$Result.GetResult<Prisma.$IntegrityJobLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of IntegrityJobLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityJobLogCountArgs} args - Arguments to filter IntegrityJobLogs to count.
     * @example
     * // Count the number of IntegrityJobLogs
     * const count = await prisma.integrityJobLog.count({
     *   where: {
     *     // ... the filter for the IntegrityJobLogs we want to count
     *   }
     * })
    **/
    count<T extends IntegrityJobLogCountArgs>(
      args?: Subset<T, IntegrityJobLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IntegrityJobLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IntegrityJobLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityJobLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IntegrityJobLogAggregateArgs>(args: Subset<T, IntegrityJobLogAggregateArgs>): Prisma.PrismaPromise<GetIntegrityJobLogAggregateType<T>>

    /**
     * Group by IntegrityJobLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityJobLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IntegrityJobLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IntegrityJobLogGroupByArgs['orderBy'] }
        : { orderBy?: IntegrityJobLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IntegrityJobLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIntegrityJobLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IntegrityJobLog model
   */
  readonly fields: IntegrityJobLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IntegrityJobLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IntegrityJobLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IntegrityJobLog model
   */ 
  interface IntegrityJobLogFieldRefs {
    readonly id: FieldRef<"IntegrityJobLog", 'String'>
    readonly jobType: FieldRef<"IntegrityJobLog", 'String'>
    readonly startedAt: FieldRef<"IntegrityJobLog", 'DateTime'>
    readonly endedAt: FieldRef<"IntegrityJobLog", 'DateTime'>
    readonly totalRecordsChecked: FieldRef<"IntegrityJobLog", 'Int'>
    readonly totalIssuesFound: FieldRef<"IntegrityJobLog", 'Int'>
    readonly status: FieldRef<"IntegrityJobLog", 'String'>
    readonly reportSummary: FieldRef<"IntegrityJobLog", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * IntegrityJobLog findUnique
   */
  export type IntegrityJobLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
    /**
     * Filter, which IntegrityJobLog to fetch.
     */
    where: IntegrityJobLogWhereUniqueInput
  }

  /**
   * IntegrityJobLog findUniqueOrThrow
   */
  export type IntegrityJobLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
    /**
     * Filter, which IntegrityJobLog to fetch.
     */
    where: IntegrityJobLogWhereUniqueInput
  }

  /**
   * IntegrityJobLog findFirst
   */
  export type IntegrityJobLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
    /**
     * Filter, which IntegrityJobLog to fetch.
     */
    where?: IntegrityJobLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrityJobLogs to fetch.
     */
    orderBy?: IntegrityJobLogOrderByWithRelationInput | IntegrityJobLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrityJobLogs.
     */
    cursor?: IntegrityJobLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrityJobLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrityJobLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrityJobLogs.
     */
    distinct?: IntegrityJobLogScalarFieldEnum | IntegrityJobLogScalarFieldEnum[]
  }

  /**
   * IntegrityJobLog findFirstOrThrow
   */
  export type IntegrityJobLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
    /**
     * Filter, which IntegrityJobLog to fetch.
     */
    where?: IntegrityJobLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrityJobLogs to fetch.
     */
    orderBy?: IntegrityJobLogOrderByWithRelationInput | IntegrityJobLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrityJobLogs.
     */
    cursor?: IntegrityJobLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrityJobLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrityJobLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrityJobLogs.
     */
    distinct?: IntegrityJobLogScalarFieldEnum | IntegrityJobLogScalarFieldEnum[]
  }

  /**
   * IntegrityJobLog findMany
   */
  export type IntegrityJobLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
    /**
     * Filter, which IntegrityJobLogs to fetch.
     */
    where?: IntegrityJobLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrityJobLogs to fetch.
     */
    orderBy?: IntegrityJobLogOrderByWithRelationInput | IntegrityJobLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IntegrityJobLogs.
     */
    cursor?: IntegrityJobLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrityJobLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrityJobLogs.
     */
    skip?: number
    distinct?: IntegrityJobLogScalarFieldEnum | IntegrityJobLogScalarFieldEnum[]
  }

  /**
   * IntegrityJobLog create
   */
  export type IntegrityJobLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
    /**
     * The data needed to create a IntegrityJobLog.
     */
    data: XOR<IntegrityJobLogCreateInput, IntegrityJobLogUncheckedCreateInput>
  }

  /**
   * IntegrityJobLog createMany
   */
  export type IntegrityJobLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IntegrityJobLogs.
     */
    data: IntegrityJobLogCreateManyInput | IntegrityJobLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IntegrityJobLog createManyAndReturn
   */
  export type IntegrityJobLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many IntegrityJobLogs.
     */
    data: IntegrityJobLogCreateManyInput | IntegrityJobLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IntegrityJobLog update
   */
  export type IntegrityJobLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
    /**
     * The data needed to update a IntegrityJobLog.
     */
    data: XOR<IntegrityJobLogUpdateInput, IntegrityJobLogUncheckedUpdateInput>
    /**
     * Choose, which IntegrityJobLog to update.
     */
    where: IntegrityJobLogWhereUniqueInput
  }

  /**
   * IntegrityJobLog updateMany
   */
  export type IntegrityJobLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IntegrityJobLogs.
     */
    data: XOR<IntegrityJobLogUpdateManyMutationInput, IntegrityJobLogUncheckedUpdateManyInput>
    /**
     * Filter which IntegrityJobLogs to update
     */
    where?: IntegrityJobLogWhereInput
  }

  /**
   * IntegrityJobLog upsert
   */
  export type IntegrityJobLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
    /**
     * The filter to search for the IntegrityJobLog to update in case it exists.
     */
    where: IntegrityJobLogWhereUniqueInput
    /**
     * In case the IntegrityJobLog found by the `where` argument doesn't exist, create a new IntegrityJobLog with this data.
     */
    create: XOR<IntegrityJobLogCreateInput, IntegrityJobLogUncheckedCreateInput>
    /**
     * In case the IntegrityJobLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IntegrityJobLogUpdateInput, IntegrityJobLogUncheckedUpdateInput>
  }

  /**
   * IntegrityJobLog delete
   */
  export type IntegrityJobLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
    /**
     * Filter which IntegrityJobLog to delete.
     */
    where: IntegrityJobLogWhereUniqueInput
  }

  /**
   * IntegrityJobLog deleteMany
   */
  export type IntegrityJobLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrityJobLogs to delete
     */
    where?: IntegrityJobLogWhereInput
  }

  /**
   * IntegrityJobLog without action
   */
  export type IntegrityJobLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityJobLog
     */
    select?: IntegrityJobLogSelect<ExtArgs> | null
  }


  /**
   * Model AiRiskReport
   */

  export type AggregateAiRiskReport = {
    _count: AiRiskReportCountAggregateOutputType | null
    _avg: AiRiskReportAvgAggregateOutputType | null
    _sum: AiRiskReportSumAggregateOutputType | null
    _min: AiRiskReportMinAggregateOutputType | null
    _max: AiRiskReportMaxAggregateOutputType | null
  }

  export type AiRiskReportAvgAggregateOutputType = {
    confidence: number | null
  }

  export type AiRiskReportSumAggregateOutputType = {
    confidence: number | null
  }

  export type AiRiskReportMinAggregateOutputType = {
    id: string | null
    reportType: string | null
    targetId: string | null
    title: string | null
    confidence: number | null
    status: string | null
    reviewedBy: string | null
    aiModel: string | null
    promptVersion: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiRiskReportMaxAggregateOutputType = {
    id: string | null
    reportType: string | null
    targetId: string | null
    title: string | null
    confidence: number | null
    status: string | null
    reviewedBy: string | null
    aiModel: string | null
    promptVersion: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiRiskReportCountAggregateOutputType = {
    id: number
    reportType: number
    targetId: number
    title: number
    content: number
    confidence: number
    status: number
    reviewedBy: number
    aiModel: number
    promptVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiRiskReportAvgAggregateInputType = {
    confidence?: true
  }

  export type AiRiskReportSumAggregateInputType = {
    confidence?: true
  }

  export type AiRiskReportMinAggregateInputType = {
    id?: true
    reportType?: true
    targetId?: true
    title?: true
    confidence?: true
    status?: true
    reviewedBy?: true
    aiModel?: true
    promptVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiRiskReportMaxAggregateInputType = {
    id?: true
    reportType?: true
    targetId?: true
    title?: true
    confidence?: true
    status?: true
    reviewedBy?: true
    aiModel?: true
    promptVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiRiskReportCountAggregateInputType = {
    id?: true
    reportType?: true
    targetId?: true
    title?: true
    content?: true
    confidence?: true
    status?: true
    reviewedBy?: true
    aiModel?: true
    promptVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiRiskReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiRiskReport to aggregate.
     */
    where?: AiRiskReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiRiskReports to fetch.
     */
    orderBy?: AiRiskReportOrderByWithRelationInput | AiRiskReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiRiskReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiRiskReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiRiskReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiRiskReports
    **/
    _count?: true | AiRiskReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiRiskReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiRiskReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiRiskReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiRiskReportMaxAggregateInputType
  }

  export type GetAiRiskReportAggregateType<T extends AiRiskReportAggregateArgs> = {
        [P in keyof T & keyof AggregateAiRiskReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiRiskReport[P]>
      : GetScalarType<T[P], AggregateAiRiskReport[P]>
  }




  export type AiRiskReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiRiskReportWhereInput
    orderBy?: AiRiskReportOrderByWithAggregationInput | AiRiskReportOrderByWithAggregationInput[]
    by: AiRiskReportScalarFieldEnum[] | AiRiskReportScalarFieldEnum
    having?: AiRiskReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiRiskReportCountAggregateInputType | true
    _avg?: AiRiskReportAvgAggregateInputType
    _sum?: AiRiskReportSumAggregateInputType
    _min?: AiRiskReportMinAggregateInputType
    _max?: AiRiskReportMaxAggregateInputType
  }

  export type AiRiskReportGroupByOutputType = {
    id: string
    reportType: string
    targetId: string
    title: string
    content: JsonValue
    confidence: number
    status: string
    reviewedBy: string | null
    aiModel: string
    promptVersion: string
    createdAt: Date
    updatedAt: Date
    _count: AiRiskReportCountAggregateOutputType | null
    _avg: AiRiskReportAvgAggregateOutputType | null
    _sum: AiRiskReportSumAggregateOutputType | null
    _min: AiRiskReportMinAggregateOutputType | null
    _max: AiRiskReportMaxAggregateOutputType | null
  }

  type GetAiRiskReportGroupByPayload<T extends AiRiskReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiRiskReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiRiskReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiRiskReportGroupByOutputType[P]>
            : GetScalarType<T[P], AiRiskReportGroupByOutputType[P]>
        }
      >
    >


  export type AiRiskReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reportType?: boolean
    targetId?: boolean
    title?: boolean
    content?: boolean
    confidence?: boolean
    status?: boolean
    reviewedBy?: boolean
    aiModel?: boolean
    promptVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiRiskReport"]>

  export type AiRiskReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reportType?: boolean
    targetId?: boolean
    title?: boolean
    content?: boolean
    confidence?: boolean
    status?: boolean
    reviewedBy?: boolean
    aiModel?: boolean
    promptVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiRiskReport"]>

  export type AiRiskReportSelectScalar = {
    id?: boolean
    reportType?: boolean
    targetId?: boolean
    title?: boolean
    content?: boolean
    confidence?: boolean
    status?: boolean
    reviewedBy?: boolean
    aiModel?: boolean
    promptVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $AiRiskReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiRiskReport"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reportType: string
      targetId: string
      title: string
      content: Prisma.JsonValue
      confidence: number
      status: string
      reviewedBy: string | null
      aiModel: string
      promptVersion: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiRiskReport"]>
    composites: {}
  }

  type AiRiskReportGetPayload<S extends boolean | null | undefined | AiRiskReportDefaultArgs> = $Result.GetResult<Prisma.$AiRiskReportPayload, S>

  type AiRiskReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiRiskReportFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiRiskReportCountAggregateInputType | true
    }

  export interface AiRiskReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiRiskReport'], meta: { name: 'AiRiskReport' } }
    /**
     * Find zero or one AiRiskReport that matches the filter.
     * @param {AiRiskReportFindUniqueArgs} args - Arguments to find a AiRiskReport
     * @example
     * // Get one AiRiskReport
     * const aiRiskReport = await prisma.aiRiskReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiRiskReportFindUniqueArgs>(args: SelectSubset<T, AiRiskReportFindUniqueArgs<ExtArgs>>): Prisma__AiRiskReportClient<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiRiskReport that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiRiskReportFindUniqueOrThrowArgs} args - Arguments to find a AiRiskReport
     * @example
     * // Get one AiRiskReport
     * const aiRiskReport = await prisma.aiRiskReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiRiskReportFindUniqueOrThrowArgs>(args: SelectSubset<T, AiRiskReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiRiskReportClient<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiRiskReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRiskReportFindFirstArgs} args - Arguments to find a AiRiskReport
     * @example
     * // Get one AiRiskReport
     * const aiRiskReport = await prisma.aiRiskReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiRiskReportFindFirstArgs>(args?: SelectSubset<T, AiRiskReportFindFirstArgs<ExtArgs>>): Prisma__AiRiskReportClient<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiRiskReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRiskReportFindFirstOrThrowArgs} args - Arguments to find a AiRiskReport
     * @example
     * // Get one AiRiskReport
     * const aiRiskReport = await prisma.aiRiskReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiRiskReportFindFirstOrThrowArgs>(args?: SelectSubset<T, AiRiskReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiRiskReportClient<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiRiskReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRiskReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiRiskReports
     * const aiRiskReports = await prisma.aiRiskReport.findMany()
     * 
     * // Get first 10 AiRiskReports
     * const aiRiskReports = await prisma.aiRiskReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiRiskReportWithIdOnly = await prisma.aiRiskReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiRiskReportFindManyArgs>(args?: SelectSubset<T, AiRiskReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiRiskReport.
     * @param {AiRiskReportCreateArgs} args - Arguments to create a AiRiskReport.
     * @example
     * // Create one AiRiskReport
     * const AiRiskReport = await prisma.aiRiskReport.create({
     *   data: {
     *     // ... data to create a AiRiskReport
     *   }
     * })
     * 
     */
    create<T extends AiRiskReportCreateArgs>(args: SelectSubset<T, AiRiskReportCreateArgs<ExtArgs>>): Prisma__AiRiskReportClient<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiRiskReports.
     * @param {AiRiskReportCreateManyArgs} args - Arguments to create many AiRiskReports.
     * @example
     * // Create many AiRiskReports
     * const aiRiskReport = await prisma.aiRiskReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiRiskReportCreateManyArgs>(args?: SelectSubset<T, AiRiskReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiRiskReports and returns the data saved in the database.
     * @param {AiRiskReportCreateManyAndReturnArgs} args - Arguments to create many AiRiskReports.
     * @example
     * // Create many AiRiskReports
     * const aiRiskReport = await prisma.aiRiskReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiRiskReports and only return the `id`
     * const aiRiskReportWithIdOnly = await prisma.aiRiskReport.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiRiskReportCreateManyAndReturnArgs>(args?: SelectSubset<T, AiRiskReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiRiskReport.
     * @param {AiRiskReportDeleteArgs} args - Arguments to delete one AiRiskReport.
     * @example
     * // Delete one AiRiskReport
     * const AiRiskReport = await prisma.aiRiskReport.delete({
     *   where: {
     *     // ... filter to delete one AiRiskReport
     *   }
     * })
     * 
     */
    delete<T extends AiRiskReportDeleteArgs>(args: SelectSubset<T, AiRiskReportDeleteArgs<ExtArgs>>): Prisma__AiRiskReportClient<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiRiskReport.
     * @param {AiRiskReportUpdateArgs} args - Arguments to update one AiRiskReport.
     * @example
     * // Update one AiRiskReport
     * const aiRiskReport = await prisma.aiRiskReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiRiskReportUpdateArgs>(args: SelectSubset<T, AiRiskReportUpdateArgs<ExtArgs>>): Prisma__AiRiskReportClient<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiRiskReports.
     * @param {AiRiskReportDeleteManyArgs} args - Arguments to filter AiRiskReports to delete.
     * @example
     * // Delete a few AiRiskReports
     * const { count } = await prisma.aiRiskReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiRiskReportDeleteManyArgs>(args?: SelectSubset<T, AiRiskReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiRiskReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRiskReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiRiskReports
     * const aiRiskReport = await prisma.aiRiskReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiRiskReportUpdateManyArgs>(args: SelectSubset<T, AiRiskReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiRiskReport.
     * @param {AiRiskReportUpsertArgs} args - Arguments to update or create a AiRiskReport.
     * @example
     * // Update or create a AiRiskReport
     * const aiRiskReport = await prisma.aiRiskReport.upsert({
     *   create: {
     *     // ... data to create a AiRiskReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiRiskReport we want to update
     *   }
     * })
     */
    upsert<T extends AiRiskReportUpsertArgs>(args: SelectSubset<T, AiRiskReportUpsertArgs<ExtArgs>>): Prisma__AiRiskReportClient<$Result.GetResult<Prisma.$AiRiskReportPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiRiskReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRiskReportCountArgs} args - Arguments to filter AiRiskReports to count.
     * @example
     * // Count the number of AiRiskReports
     * const count = await prisma.aiRiskReport.count({
     *   where: {
     *     // ... the filter for the AiRiskReports we want to count
     *   }
     * })
    **/
    count<T extends AiRiskReportCountArgs>(
      args?: Subset<T, AiRiskReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiRiskReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiRiskReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRiskReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiRiskReportAggregateArgs>(args: Subset<T, AiRiskReportAggregateArgs>): Prisma.PrismaPromise<GetAiRiskReportAggregateType<T>>

    /**
     * Group by AiRiskReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiRiskReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiRiskReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiRiskReportGroupByArgs['orderBy'] }
        : { orderBy?: AiRiskReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiRiskReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiRiskReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiRiskReport model
   */
  readonly fields: AiRiskReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiRiskReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiRiskReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiRiskReport model
   */ 
  interface AiRiskReportFieldRefs {
    readonly id: FieldRef<"AiRiskReport", 'String'>
    readonly reportType: FieldRef<"AiRiskReport", 'String'>
    readonly targetId: FieldRef<"AiRiskReport", 'String'>
    readonly title: FieldRef<"AiRiskReport", 'String'>
    readonly content: FieldRef<"AiRiskReport", 'Json'>
    readonly confidence: FieldRef<"AiRiskReport", 'Float'>
    readonly status: FieldRef<"AiRiskReport", 'String'>
    readonly reviewedBy: FieldRef<"AiRiskReport", 'String'>
    readonly aiModel: FieldRef<"AiRiskReport", 'String'>
    readonly promptVersion: FieldRef<"AiRiskReport", 'String'>
    readonly createdAt: FieldRef<"AiRiskReport", 'DateTime'>
    readonly updatedAt: FieldRef<"AiRiskReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiRiskReport findUnique
   */
  export type AiRiskReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
    /**
     * Filter, which AiRiskReport to fetch.
     */
    where: AiRiskReportWhereUniqueInput
  }

  /**
   * AiRiskReport findUniqueOrThrow
   */
  export type AiRiskReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
    /**
     * Filter, which AiRiskReport to fetch.
     */
    where: AiRiskReportWhereUniqueInput
  }

  /**
   * AiRiskReport findFirst
   */
  export type AiRiskReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
    /**
     * Filter, which AiRiskReport to fetch.
     */
    where?: AiRiskReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiRiskReports to fetch.
     */
    orderBy?: AiRiskReportOrderByWithRelationInput | AiRiskReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiRiskReports.
     */
    cursor?: AiRiskReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiRiskReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiRiskReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiRiskReports.
     */
    distinct?: AiRiskReportScalarFieldEnum | AiRiskReportScalarFieldEnum[]
  }

  /**
   * AiRiskReport findFirstOrThrow
   */
  export type AiRiskReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
    /**
     * Filter, which AiRiskReport to fetch.
     */
    where?: AiRiskReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiRiskReports to fetch.
     */
    orderBy?: AiRiskReportOrderByWithRelationInput | AiRiskReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiRiskReports.
     */
    cursor?: AiRiskReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiRiskReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiRiskReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiRiskReports.
     */
    distinct?: AiRiskReportScalarFieldEnum | AiRiskReportScalarFieldEnum[]
  }

  /**
   * AiRiskReport findMany
   */
  export type AiRiskReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
    /**
     * Filter, which AiRiskReports to fetch.
     */
    where?: AiRiskReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiRiskReports to fetch.
     */
    orderBy?: AiRiskReportOrderByWithRelationInput | AiRiskReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiRiskReports.
     */
    cursor?: AiRiskReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiRiskReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiRiskReports.
     */
    skip?: number
    distinct?: AiRiskReportScalarFieldEnum | AiRiskReportScalarFieldEnum[]
  }

  /**
   * AiRiskReport create
   */
  export type AiRiskReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
    /**
     * The data needed to create a AiRiskReport.
     */
    data: XOR<AiRiskReportCreateInput, AiRiskReportUncheckedCreateInput>
  }

  /**
   * AiRiskReport createMany
   */
  export type AiRiskReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiRiskReports.
     */
    data: AiRiskReportCreateManyInput | AiRiskReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiRiskReport createManyAndReturn
   */
  export type AiRiskReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiRiskReports.
     */
    data: AiRiskReportCreateManyInput | AiRiskReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiRiskReport update
   */
  export type AiRiskReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
    /**
     * The data needed to update a AiRiskReport.
     */
    data: XOR<AiRiskReportUpdateInput, AiRiskReportUncheckedUpdateInput>
    /**
     * Choose, which AiRiskReport to update.
     */
    where: AiRiskReportWhereUniqueInput
  }

  /**
   * AiRiskReport updateMany
   */
  export type AiRiskReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiRiskReports.
     */
    data: XOR<AiRiskReportUpdateManyMutationInput, AiRiskReportUncheckedUpdateManyInput>
    /**
     * Filter which AiRiskReports to update
     */
    where?: AiRiskReportWhereInput
  }

  /**
   * AiRiskReport upsert
   */
  export type AiRiskReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
    /**
     * The filter to search for the AiRiskReport to update in case it exists.
     */
    where: AiRiskReportWhereUniqueInput
    /**
     * In case the AiRiskReport found by the `where` argument doesn't exist, create a new AiRiskReport with this data.
     */
    create: XOR<AiRiskReportCreateInput, AiRiskReportUncheckedCreateInput>
    /**
     * In case the AiRiskReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiRiskReportUpdateInput, AiRiskReportUncheckedUpdateInput>
  }

  /**
   * AiRiskReport delete
   */
  export type AiRiskReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
    /**
     * Filter which AiRiskReport to delete.
     */
    where: AiRiskReportWhereUniqueInput
  }

  /**
   * AiRiskReport deleteMany
   */
  export type AiRiskReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiRiskReports to delete
     */
    where?: AiRiskReportWhereInput
  }

  /**
   * AiRiskReport without action
   */
  export type AiRiskReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiRiskReport
     */
    select?: AiRiskReportSelect<ExtArgs> | null
  }


  /**
   * Model AiReportAudit
   */

  export type AggregateAiReportAudit = {
    _count: AiReportAuditCountAggregateOutputType | null
    _min: AiReportAuditMinAggregateOutputType | null
    _max: AiReportAuditMaxAggregateOutputType | null
  }

  export type AiReportAuditMinAggregateOutputType = {
    id: string | null
    reportId: string | null
    reviewerId: string | null
    action: string | null
    comment: string | null
    createdAt: Date | null
  }

  export type AiReportAuditMaxAggregateOutputType = {
    id: string | null
    reportId: string | null
    reviewerId: string | null
    action: string | null
    comment: string | null
    createdAt: Date | null
  }

  export type AiReportAuditCountAggregateOutputType = {
    id: number
    reportId: number
    reviewerId: number
    action: number
    previousContent: number
    newContent: number
    comment: number
    createdAt: number
    _all: number
  }


  export type AiReportAuditMinAggregateInputType = {
    id?: true
    reportId?: true
    reviewerId?: true
    action?: true
    comment?: true
    createdAt?: true
  }

  export type AiReportAuditMaxAggregateInputType = {
    id?: true
    reportId?: true
    reviewerId?: true
    action?: true
    comment?: true
    createdAt?: true
  }

  export type AiReportAuditCountAggregateInputType = {
    id?: true
    reportId?: true
    reviewerId?: true
    action?: true
    previousContent?: true
    newContent?: true
    comment?: true
    createdAt?: true
    _all?: true
  }

  export type AiReportAuditAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiReportAudit to aggregate.
     */
    where?: AiReportAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiReportAudits to fetch.
     */
    orderBy?: AiReportAuditOrderByWithRelationInput | AiReportAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiReportAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiReportAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiReportAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiReportAudits
    **/
    _count?: true | AiReportAuditCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiReportAuditMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiReportAuditMaxAggregateInputType
  }

  export type GetAiReportAuditAggregateType<T extends AiReportAuditAggregateArgs> = {
        [P in keyof T & keyof AggregateAiReportAudit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiReportAudit[P]>
      : GetScalarType<T[P], AggregateAiReportAudit[P]>
  }




  export type AiReportAuditGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiReportAuditWhereInput
    orderBy?: AiReportAuditOrderByWithAggregationInput | AiReportAuditOrderByWithAggregationInput[]
    by: AiReportAuditScalarFieldEnum[] | AiReportAuditScalarFieldEnum
    having?: AiReportAuditScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiReportAuditCountAggregateInputType | true
    _min?: AiReportAuditMinAggregateInputType
    _max?: AiReportAuditMaxAggregateInputType
  }

  export type AiReportAuditGroupByOutputType = {
    id: string
    reportId: string
    reviewerId: string
    action: string
    previousContent: JsonValue | null
    newContent: JsonValue | null
    comment: string | null
    createdAt: Date
    _count: AiReportAuditCountAggregateOutputType | null
    _min: AiReportAuditMinAggregateOutputType | null
    _max: AiReportAuditMaxAggregateOutputType | null
  }

  type GetAiReportAuditGroupByPayload<T extends AiReportAuditGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiReportAuditGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiReportAuditGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiReportAuditGroupByOutputType[P]>
            : GetScalarType<T[P], AiReportAuditGroupByOutputType[P]>
        }
      >
    >


  export type AiReportAuditSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reportId?: boolean
    reviewerId?: boolean
    action?: boolean
    previousContent?: boolean
    newContent?: boolean
    comment?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiReportAudit"]>

  export type AiReportAuditSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reportId?: boolean
    reviewerId?: boolean
    action?: boolean
    previousContent?: boolean
    newContent?: boolean
    comment?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiReportAudit"]>

  export type AiReportAuditSelectScalar = {
    id?: boolean
    reportId?: boolean
    reviewerId?: boolean
    action?: boolean
    previousContent?: boolean
    newContent?: boolean
    comment?: boolean
    createdAt?: boolean
  }


  export type $AiReportAuditPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiReportAudit"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reportId: string
      reviewerId: string
      action: string
      previousContent: Prisma.JsonValue | null
      newContent: Prisma.JsonValue | null
      comment: string | null
      createdAt: Date
    }, ExtArgs["result"]["aiReportAudit"]>
    composites: {}
  }

  type AiReportAuditGetPayload<S extends boolean | null | undefined | AiReportAuditDefaultArgs> = $Result.GetResult<Prisma.$AiReportAuditPayload, S>

  type AiReportAuditCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiReportAuditFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiReportAuditCountAggregateInputType | true
    }

  export interface AiReportAuditDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiReportAudit'], meta: { name: 'AiReportAudit' } }
    /**
     * Find zero or one AiReportAudit that matches the filter.
     * @param {AiReportAuditFindUniqueArgs} args - Arguments to find a AiReportAudit
     * @example
     * // Get one AiReportAudit
     * const aiReportAudit = await prisma.aiReportAudit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiReportAuditFindUniqueArgs>(args: SelectSubset<T, AiReportAuditFindUniqueArgs<ExtArgs>>): Prisma__AiReportAuditClient<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiReportAudit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiReportAuditFindUniqueOrThrowArgs} args - Arguments to find a AiReportAudit
     * @example
     * // Get one AiReportAudit
     * const aiReportAudit = await prisma.aiReportAudit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiReportAuditFindUniqueOrThrowArgs>(args: SelectSubset<T, AiReportAuditFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiReportAuditClient<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiReportAudit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiReportAuditFindFirstArgs} args - Arguments to find a AiReportAudit
     * @example
     * // Get one AiReportAudit
     * const aiReportAudit = await prisma.aiReportAudit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiReportAuditFindFirstArgs>(args?: SelectSubset<T, AiReportAuditFindFirstArgs<ExtArgs>>): Prisma__AiReportAuditClient<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiReportAudit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiReportAuditFindFirstOrThrowArgs} args - Arguments to find a AiReportAudit
     * @example
     * // Get one AiReportAudit
     * const aiReportAudit = await prisma.aiReportAudit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiReportAuditFindFirstOrThrowArgs>(args?: SelectSubset<T, AiReportAuditFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiReportAuditClient<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiReportAudits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiReportAuditFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiReportAudits
     * const aiReportAudits = await prisma.aiReportAudit.findMany()
     * 
     * // Get first 10 AiReportAudits
     * const aiReportAudits = await prisma.aiReportAudit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiReportAuditWithIdOnly = await prisma.aiReportAudit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiReportAuditFindManyArgs>(args?: SelectSubset<T, AiReportAuditFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiReportAudit.
     * @param {AiReportAuditCreateArgs} args - Arguments to create a AiReportAudit.
     * @example
     * // Create one AiReportAudit
     * const AiReportAudit = await prisma.aiReportAudit.create({
     *   data: {
     *     // ... data to create a AiReportAudit
     *   }
     * })
     * 
     */
    create<T extends AiReportAuditCreateArgs>(args: SelectSubset<T, AiReportAuditCreateArgs<ExtArgs>>): Prisma__AiReportAuditClient<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiReportAudits.
     * @param {AiReportAuditCreateManyArgs} args - Arguments to create many AiReportAudits.
     * @example
     * // Create many AiReportAudits
     * const aiReportAudit = await prisma.aiReportAudit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiReportAuditCreateManyArgs>(args?: SelectSubset<T, AiReportAuditCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiReportAudits and returns the data saved in the database.
     * @param {AiReportAuditCreateManyAndReturnArgs} args - Arguments to create many AiReportAudits.
     * @example
     * // Create many AiReportAudits
     * const aiReportAudit = await prisma.aiReportAudit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiReportAudits and only return the `id`
     * const aiReportAuditWithIdOnly = await prisma.aiReportAudit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiReportAuditCreateManyAndReturnArgs>(args?: SelectSubset<T, AiReportAuditCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiReportAudit.
     * @param {AiReportAuditDeleteArgs} args - Arguments to delete one AiReportAudit.
     * @example
     * // Delete one AiReportAudit
     * const AiReportAudit = await prisma.aiReportAudit.delete({
     *   where: {
     *     // ... filter to delete one AiReportAudit
     *   }
     * })
     * 
     */
    delete<T extends AiReportAuditDeleteArgs>(args: SelectSubset<T, AiReportAuditDeleteArgs<ExtArgs>>): Prisma__AiReportAuditClient<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiReportAudit.
     * @param {AiReportAuditUpdateArgs} args - Arguments to update one AiReportAudit.
     * @example
     * // Update one AiReportAudit
     * const aiReportAudit = await prisma.aiReportAudit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiReportAuditUpdateArgs>(args: SelectSubset<T, AiReportAuditUpdateArgs<ExtArgs>>): Prisma__AiReportAuditClient<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiReportAudits.
     * @param {AiReportAuditDeleteManyArgs} args - Arguments to filter AiReportAudits to delete.
     * @example
     * // Delete a few AiReportAudits
     * const { count } = await prisma.aiReportAudit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiReportAuditDeleteManyArgs>(args?: SelectSubset<T, AiReportAuditDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiReportAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiReportAuditUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiReportAudits
     * const aiReportAudit = await prisma.aiReportAudit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiReportAuditUpdateManyArgs>(args: SelectSubset<T, AiReportAuditUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiReportAudit.
     * @param {AiReportAuditUpsertArgs} args - Arguments to update or create a AiReportAudit.
     * @example
     * // Update or create a AiReportAudit
     * const aiReportAudit = await prisma.aiReportAudit.upsert({
     *   create: {
     *     // ... data to create a AiReportAudit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiReportAudit we want to update
     *   }
     * })
     */
    upsert<T extends AiReportAuditUpsertArgs>(args: SelectSubset<T, AiReportAuditUpsertArgs<ExtArgs>>): Prisma__AiReportAuditClient<$Result.GetResult<Prisma.$AiReportAuditPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiReportAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiReportAuditCountArgs} args - Arguments to filter AiReportAudits to count.
     * @example
     * // Count the number of AiReportAudits
     * const count = await prisma.aiReportAudit.count({
     *   where: {
     *     // ... the filter for the AiReportAudits we want to count
     *   }
     * })
    **/
    count<T extends AiReportAuditCountArgs>(
      args?: Subset<T, AiReportAuditCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiReportAuditCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiReportAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiReportAuditAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiReportAuditAggregateArgs>(args: Subset<T, AiReportAuditAggregateArgs>): Prisma.PrismaPromise<GetAiReportAuditAggregateType<T>>

    /**
     * Group by AiReportAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiReportAuditGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiReportAuditGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiReportAuditGroupByArgs['orderBy'] }
        : { orderBy?: AiReportAuditGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiReportAuditGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiReportAuditGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiReportAudit model
   */
  readonly fields: AiReportAuditFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiReportAudit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiReportAuditClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiReportAudit model
   */ 
  interface AiReportAuditFieldRefs {
    readonly id: FieldRef<"AiReportAudit", 'String'>
    readonly reportId: FieldRef<"AiReportAudit", 'String'>
    readonly reviewerId: FieldRef<"AiReportAudit", 'String'>
    readonly action: FieldRef<"AiReportAudit", 'String'>
    readonly previousContent: FieldRef<"AiReportAudit", 'Json'>
    readonly newContent: FieldRef<"AiReportAudit", 'Json'>
    readonly comment: FieldRef<"AiReportAudit", 'String'>
    readonly createdAt: FieldRef<"AiReportAudit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiReportAudit findUnique
   */
  export type AiReportAuditFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
    /**
     * Filter, which AiReportAudit to fetch.
     */
    where: AiReportAuditWhereUniqueInput
  }

  /**
   * AiReportAudit findUniqueOrThrow
   */
  export type AiReportAuditFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
    /**
     * Filter, which AiReportAudit to fetch.
     */
    where: AiReportAuditWhereUniqueInput
  }

  /**
   * AiReportAudit findFirst
   */
  export type AiReportAuditFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
    /**
     * Filter, which AiReportAudit to fetch.
     */
    where?: AiReportAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiReportAudits to fetch.
     */
    orderBy?: AiReportAuditOrderByWithRelationInput | AiReportAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiReportAudits.
     */
    cursor?: AiReportAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiReportAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiReportAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiReportAudits.
     */
    distinct?: AiReportAuditScalarFieldEnum | AiReportAuditScalarFieldEnum[]
  }

  /**
   * AiReportAudit findFirstOrThrow
   */
  export type AiReportAuditFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
    /**
     * Filter, which AiReportAudit to fetch.
     */
    where?: AiReportAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiReportAudits to fetch.
     */
    orderBy?: AiReportAuditOrderByWithRelationInput | AiReportAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiReportAudits.
     */
    cursor?: AiReportAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiReportAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiReportAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiReportAudits.
     */
    distinct?: AiReportAuditScalarFieldEnum | AiReportAuditScalarFieldEnum[]
  }

  /**
   * AiReportAudit findMany
   */
  export type AiReportAuditFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
    /**
     * Filter, which AiReportAudits to fetch.
     */
    where?: AiReportAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiReportAudits to fetch.
     */
    orderBy?: AiReportAuditOrderByWithRelationInput | AiReportAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiReportAudits.
     */
    cursor?: AiReportAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiReportAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiReportAudits.
     */
    skip?: number
    distinct?: AiReportAuditScalarFieldEnum | AiReportAuditScalarFieldEnum[]
  }

  /**
   * AiReportAudit create
   */
  export type AiReportAuditCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
    /**
     * The data needed to create a AiReportAudit.
     */
    data: XOR<AiReportAuditCreateInput, AiReportAuditUncheckedCreateInput>
  }

  /**
   * AiReportAudit createMany
   */
  export type AiReportAuditCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiReportAudits.
     */
    data: AiReportAuditCreateManyInput | AiReportAuditCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiReportAudit createManyAndReturn
   */
  export type AiReportAuditCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiReportAudits.
     */
    data: AiReportAuditCreateManyInput | AiReportAuditCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiReportAudit update
   */
  export type AiReportAuditUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
    /**
     * The data needed to update a AiReportAudit.
     */
    data: XOR<AiReportAuditUpdateInput, AiReportAuditUncheckedUpdateInput>
    /**
     * Choose, which AiReportAudit to update.
     */
    where: AiReportAuditWhereUniqueInput
  }

  /**
   * AiReportAudit updateMany
   */
  export type AiReportAuditUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiReportAudits.
     */
    data: XOR<AiReportAuditUpdateManyMutationInput, AiReportAuditUncheckedUpdateManyInput>
    /**
     * Filter which AiReportAudits to update
     */
    where?: AiReportAuditWhereInput
  }

  /**
   * AiReportAudit upsert
   */
  export type AiReportAuditUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
    /**
     * The filter to search for the AiReportAudit to update in case it exists.
     */
    where: AiReportAuditWhereUniqueInput
    /**
     * In case the AiReportAudit found by the `where` argument doesn't exist, create a new AiReportAudit with this data.
     */
    create: XOR<AiReportAuditCreateInput, AiReportAuditUncheckedCreateInput>
    /**
     * In case the AiReportAudit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiReportAuditUpdateInput, AiReportAuditUncheckedUpdateInput>
  }

  /**
   * AiReportAudit delete
   */
  export type AiReportAuditDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
    /**
     * Filter which AiReportAudit to delete.
     */
    where: AiReportAuditWhereUniqueInput
  }

  /**
   * AiReportAudit deleteMany
   */
  export type AiReportAuditDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiReportAudits to delete
     */
    where?: AiReportAuditWhereInput
  }

  /**
   * AiReportAudit without action
   */
  export type AiReportAuditDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiReportAudit
     */
    select?: AiReportAuditSelect<ExtArgs> | null
  }


  /**
   * Model PredictiveAlert
   */

  export type AggregatePredictiveAlert = {
    _count: PredictiveAlertCountAggregateOutputType | null
    _avg: PredictiveAlertAvgAggregateOutputType | null
    _sum: PredictiveAlertSumAggregateOutputType | null
    _min: PredictiveAlertMinAggregateOutputType | null
    _max: PredictiveAlertMaxAggregateOutputType | null
  }

  export type PredictiveAlertAvgAggregateOutputType = {
    probability: number | null
  }

  export type PredictiveAlertSumAggregateOutputType = {
    probability: number | null
  }

  export type PredictiveAlertMinAggregateOutputType = {
    id: string | null
    targetId: string | null
    probability: number | null
    recommendation: string | null
    status: string | null
    reviewedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PredictiveAlertMaxAggregateOutputType = {
    id: string | null
    targetId: string | null
    probability: number | null
    recommendation: string | null
    status: string | null
    reviewedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PredictiveAlertCountAggregateOutputType = {
    id: number
    targetId: number
    probability: number
    recommendation: number
    reasoning: number
    status: number
    reviewedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PredictiveAlertAvgAggregateInputType = {
    probability?: true
  }

  export type PredictiveAlertSumAggregateInputType = {
    probability?: true
  }

  export type PredictiveAlertMinAggregateInputType = {
    id?: true
    targetId?: true
    probability?: true
    recommendation?: true
    status?: true
    reviewedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PredictiveAlertMaxAggregateInputType = {
    id?: true
    targetId?: true
    probability?: true
    recommendation?: true
    status?: true
    reviewedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PredictiveAlertCountAggregateInputType = {
    id?: true
    targetId?: true
    probability?: true
    recommendation?: true
    reasoning?: true
    status?: true
    reviewedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PredictiveAlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PredictiveAlert to aggregate.
     */
    where?: PredictiveAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PredictiveAlerts to fetch.
     */
    orderBy?: PredictiveAlertOrderByWithRelationInput | PredictiveAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PredictiveAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PredictiveAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PredictiveAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PredictiveAlerts
    **/
    _count?: true | PredictiveAlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PredictiveAlertAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PredictiveAlertSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PredictiveAlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PredictiveAlertMaxAggregateInputType
  }

  export type GetPredictiveAlertAggregateType<T extends PredictiveAlertAggregateArgs> = {
        [P in keyof T & keyof AggregatePredictiveAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePredictiveAlert[P]>
      : GetScalarType<T[P], AggregatePredictiveAlert[P]>
  }




  export type PredictiveAlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PredictiveAlertWhereInput
    orderBy?: PredictiveAlertOrderByWithAggregationInput | PredictiveAlertOrderByWithAggregationInput[]
    by: PredictiveAlertScalarFieldEnum[] | PredictiveAlertScalarFieldEnum
    having?: PredictiveAlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PredictiveAlertCountAggregateInputType | true
    _avg?: PredictiveAlertAvgAggregateInputType
    _sum?: PredictiveAlertSumAggregateInputType
    _min?: PredictiveAlertMinAggregateInputType
    _max?: PredictiveAlertMaxAggregateInputType
  }

  export type PredictiveAlertGroupByOutputType = {
    id: string
    targetId: string
    probability: number
    recommendation: string
    reasoning: JsonValue | null
    status: string
    reviewedBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: PredictiveAlertCountAggregateOutputType | null
    _avg: PredictiveAlertAvgAggregateOutputType | null
    _sum: PredictiveAlertSumAggregateOutputType | null
    _min: PredictiveAlertMinAggregateOutputType | null
    _max: PredictiveAlertMaxAggregateOutputType | null
  }

  type GetPredictiveAlertGroupByPayload<T extends PredictiveAlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PredictiveAlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PredictiveAlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PredictiveAlertGroupByOutputType[P]>
            : GetScalarType<T[P], PredictiveAlertGroupByOutputType[P]>
        }
      >
    >


  export type PredictiveAlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    targetId?: boolean
    probability?: boolean
    recommendation?: boolean
    reasoning?: boolean
    status?: boolean
    reviewedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["predictiveAlert"]>

  export type PredictiveAlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    targetId?: boolean
    probability?: boolean
    recommendation?: boolean
    reasoning?: boolean
    status?: boolean
    reviewedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["predictiveAlert"]>

  export type PredictiveAlertSelectScalar = {
    id?: boolean
    targetId?: boolean
    probability?: boolean
    recommendation?: boolean
    reasoning?: boolean
    status?: boolean
    reviewedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $PredictiveAlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PredictiveAlert"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      targetId: string
      probability: number
      recommendation: string
      reasoning: Prisma.JsonValue | null
      status: string
      reviewedBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["predictiveAlert"]>
    composites: {}
  }

  type PredictiveAlertGetPayload<S extends boolean | null | undefined | PredictiveAlertDefaultArgs> = $Result.GetResult<Prisma.$PredictiveAlertPayload, S>

  type PredictiveAlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PredictiveAlertFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PredictiveAlertCountAggregateInputType | true
    }

  export interface PredictiveAlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PredictiveAlert'], meta: { name: 'PredictiveAlert' } }
    /**
     * Find zero or one PredictiveAlert that matches the filter.
     * @param {PredictiveAlertFindUniqueArgs} args - Arguments to find a PredictiveAlert
     * @example
     * // Get one PredictiveAlert
     * const predictiveAlert = await prisma.predictiveAlert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PredictiveAlertFindUniqueArgs>(args: SelectSubset<T, PredictiveAlertFindUniqueArgs<ExtArgs>>): Prisma__PredictiveAlertClient<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PredictiveAlert that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PredictiveAlertFindUniqueOrThrowArgs} args - Arguments to find a PredictiveAlert
     * @example
     * // Get one PredictiveAlert
     * const predictiveAlert = await prisma.predictiveAlert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PredictiveAlertFindUniqueOrThrowArgs>(args: SelectSubset<T, PredictiveAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PredictiveAlertClient<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PredictiveAlert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictiveAlertFindFirstArgs} args - Arguments to find a PredictiveAlert
     * @example
     * // Get one PredictiveAlert
     * const predictiveAlert = await prisma.predictiveAlert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PredictiveAlertFindFirstArgs>(args?: SelectSubset<T, PredictiveAlertFindFirstArgs<ExtArgs>>): Prisma__PredictiveAlertClient<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PredictiveAlert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictiveAlertFindFirstOrThrowArgs} args - Arguments to find a PredictiveAlert
     * @example
     * // Get one PredictiveAlert
     * const predictiveAlert = await prisma.predictiveAlert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PredictiveAlertFindFirstOrThrowArgs>(args?: SelectSubset<T, PredictiveAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__PredictiveAlertClient<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PredictiveAlerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictiveAlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PredictiveAlerts
     * const predictiveAlerts = await prisma.predictiveAlert.findMany()
     * 
     * // Get first 10 PredictiveAlerts
     * const predictiveAlerts = await prisma.predictiveAlert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const predictiveAlertWithIdOnly = await prisma.predictiveAlert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PredictiveAlertFindManyArgs>(args?: SelectSubset<T, PredictiveAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PredictiveAlert.
     * @param {PredictiveAlertCreateArgs} args - Arguments to create a PredictiveAlert.
     * @example
     * // Create one PredictiveAlert
     * const PredictiveAlert = await prisma.predictiveAlert.create({
     *   data: {
     *     // ... data to create a PredictiveAlert
     *   }
     * })
     * 
     */
    create<T extends PredictiveAlertCreateArgs>(args: SelectSubset<T, PredictiveAlertCreateArgs<ExtArgs>>): Prisma__PredictiveAlertClient<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PredictiveAlerts.
     * @param {PredictiveAlertCreateManyArgs} args - Arguments to create many PredictiveAlerts.
     * @example
     * // Create many PredictiveAlerts
     * const predictiveAlert = await prisma.predictiveAlert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PredictiveAlertCreateManyArgs>(args?: SelectSubset<T, PredictiveAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PredictiveAlerts and returns the data saved in the database.
     * @param {PredictiveAlertCreateManyAndReturnArgs} args - Arguments to create many PredictiveAlerts.
     * @example
     * // Create many PredictiveAlerts
     * const predictiveAlert = await prisma.predictiveAlert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PredictiveAlerts and only return the `id`
     * const predictiveAlertWithIdOnly = await prisma.predictiveAlert.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PredictiveAlertCreateManyAndReturnArgs>(args?: SelectSubset<T, PredictiveAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PredictiveAlert.
     * @param {PredictiveAlertDeleteArgs} args - Arguments to delete one PredictiveAlert.
     * @example
     * // Delete one PredictiveAlert
     * const PredictiveAlert = await prisma.predictiveAlert.delete({
     *   where: {
     *     // ... filter to delete one PredictiveAlert
     *   }
     * })
     * 
     */
    delete<T extends PredictiveAlertDeleteArgs>(args: SelectSubset<T, PredictiveAlertDeleteArgs<ExtArgs>>): Prisma__PredictiveAlertClient<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PredictiveAlert.
     * @param {PredictiveAlertUpdateArgs} args - Arguments to update one PredictiveAlert.
     * @example
     * // Update one PredictiveAlert
     * const predictiveAlert = await prisma.predictiveAlert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PredictiveAlertUpdateArgs>(args: SelectSubset<T, PredictiveAlertUpdateArgs<ExtArgs>>): Prisma__PredictiveAlertClient<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PredictiveAlerts.
     * @param {PredictiveAlertDeleteManyArgs} args - Arguments to filter PredictiveAlerts to delete.
     * @example
     * // Delete a few PredictiveAlerts
     * const { count } = await prisma.predictiveAlert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PredictiveAlertDeleteManyArgs>(args?: SelectSubset<T, PredictiveAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PredictiveAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictiveAlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PredictiveAlerts
     * const predictiveAlert = await prisma.predictiveAlert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PredictiveAlertUpdateManyArgs>(args: SelectSubset<T, PredictiveAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PredictiveAlert.
     * @param {PredictiveAlertUpsertArgs} args - Arguments to update or create a PredictiveAlert.
     * @example
     * // Update or create a PredictiveAlert
     * const predictiveAlert = await prisma.predictiveAlert.upsert({
     *   create: {
     *     // ... data to create a PredictiveAlert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PredictiveAlert we want to update
     *   }
     * })
     */
    upsert<T extends PredictiveAlertUpsertArgs>(args: SelectSubset<T, PredictiveAlertUpsertArgs<ExtArgs>>): Prisma__PredictiveAlertClient<$Result.GetResult<Prisma.$PredictiveAlertPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PredictiveAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictiveAlertCountArgs} args - Arguments to filter PredictiveAlerts to count.
     * @example
     * // Count the number of PredictiveAlerts
     * const count = await prisma.predictiveAlert.count({
     *   where: {
     *     // ... the filter for the PredictiveAlerts we want to count
     *   }
     * })
    **/
    count<T extends PredictiveAlertCountArgs>(
      args?: Subset<T, PredictiveAlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PredictiveAlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PredictiveAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictiveAlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PredictiveAlertAggregateArgs>(args: Subset<T, PredictiveAlertAggregateArgs>): Prisma.PrismaPromise<GetPredictiveAlertAggregateType<T>>

    /**
     * Group by PredictiveAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictiveAlertGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PredictiveAlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PredictiveAlertGroupByArgs['orderBy'] }
        : { orderBy?: PredictiveAlertGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PredictiveAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPredictiveAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PredictiveAlert model
   */
  readonly fields: PredictiveAlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PredictiveAlert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PredictiveAlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PredictiveAlert model
   */ 
  interface PredictiveAlertFieldRefs {
    readonly id: FieldRef<"PredictiveAlert", 'String'>
    readonly targetId: FieldRef<"PredictiveAlert", 'String'>
    readonly probability: FieldRef<"PredictiveAlert", 'Float'>
    readonly recommendation: FieldRef<"PredictiveAlert", 'String'>
    readonly reasoning: FieldRef<"PredictiveAlert", 'Json'>
    readonly status: FieldRef<"PredictiveAlert", 'String'>
    readonly reviewedBy: FieldRef<"PredictiveAlert", 'String'>
    readonly createdAt: FieldRef<"PredictiveAlert", 'DateTime'>
    readonly updatedAt: FieldRef<"PredictiveAlert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PredictiveAlert findUnique
   */
  export type PredictiveAlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
    /**
     * Filter, which PredictiveAlert to fetch.
     */
    where: PredictiveAlertWhereUniqueInput
  }

  /**
   * PredictiveAlert findUniqueOrThrow
   */
  export type PredictiveAlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
    /**
     * Filter, which PredictiveAlert to fetch.
     */
    where: PredictiveAlertWhereUniqueInput
  }

  /**
   * PredictiveAlert findFirst
   */
  export type PredictiveAlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
    /**
     * Filter, which PredictiveAlert to fetch.
     */
    where?: PredictiveAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PredictiveAlerts to fetch.
     */
    orderBy?: PredictiveAlertOrderByWithRelationInput | PredictiveAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PredictiveAlerts.
     */
    cursor?: PredictiveAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PredictiveAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PredictiveAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PredictiveAlerts.
     */
    distinct?: PredictiveAlertScalarFieldEnum | PredictiveAlertScalarFieldEnum[]
  }

  /**
   * PredictiveAlert findFirstOrThrow
   */
  export type PredictiveAlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
    /**
     * Filter, which PredictiveAlert to fetch.
     */
    where?: PredictiveAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PredictiveAlerts to fetch.
     */
    orderBy?: PredictiveAlertOrderByWithRelationInput | PredictiveAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PredictiveAlerts.
     */
    cursor?: PredictiveAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PredictiveAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PredictiveAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PredictiveAlerts.
     */
    distinct?: PredictiveAlertScalarFieldEnum | PredictiveAlertScalarFieldEnum[]
  }

  /**
   * PredictiveAlert findMany
   */
  export type PredictiveAlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
    /**
     * Filter, which PredictiveAlerts to fetch.
     */
    where?: PredictiveAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PredictiveAlerts to fetch.
     */
    orderBy?: PredictiveAlertOrderByWithRelationInput | PredictiveAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PredictiveAlerts.
     */
    cursor?: PredictiveAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PredictiveAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PredictiveAlerts.
     */
    skip?: number
    distinct?: PredictiveAlertScalarFieldEnum | PredictiveAlertScalarFieldEnum[]
  }

  /**
   * PredictiveAlert create
   */
  export type PredictiveAlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
    /**
     * The data needed to create a PredictiveAlert.
     */
    data: XOR<PredictiveAlertCreateInput, PredictiveAlertUncheckedCreateInput>
  }

  /**
   * PredictiveAlert createMany
   */
  export type PredictiveAlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PredictiveAlerts.
     */
    data: PredictiveAlertCreateManyInput | PredictiveAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PredictiveAlert createManyAndReturn
   */
  export type PredictiveAlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PredictiveAlerts.
     */
    data: PredictiveAlertCreateManyInput | PredictiveAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PredictiveAlert update
   */
  export type PredictiveAlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
    /**
     * The data needed to update a PredictiveAlert.
     */
    data: XOR<PredictiveAlertUpdateInput, PredictiveAlertUncheckedUpdateInput>
    /**
     * Choose, which PredictiveAlert to update.
     */
    where: PredictiveAlertWhereUniqueInput
  }

  /**
   * PredictiveAlert updateMany
   */
  export type PredictiveAlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PredictiveAlerts.
     */
    data: XOR<PredictiveAlertUpdateManyMutationInput, PredictiveAlertUncheckedUpdateManyInput>
    /**
     * Filter which PredictiveAlerts to update
     */
    where?: PredictiveAlertWhereInput
  }

  /**
   * PredictiveAlert upsert
   */
  export type PredictiveAlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
    /**
     * The filter to search for the PredictiveAlert to update in case it exists.
     */
    where: PredictiveAlertWhereUniqueInput
    /**
     * In case the PredictiveAlert found by the `where` argument doesn't exist, create a new PredictiveAlert with this data.
     */
    create: XOR<PredictiveAlertCreateInput, PredictiveAlertUncheckedCreateInput>
    /**
     * In case the PredictiveAlert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PredictiveAlertUpdateInput, PredictiveAlertUncheckedUpdateInput>
  }

  /**
   * PredictiveAlert delete
   */
  export type PredictiveAlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
    /**
     * Filter which PredictiveAlert to delete.
     */
    where: PredictiveAlertWhereUniqueInput
  }

  /**
   * PredictiveAlert deleteMany
   */
  export type PredictiveAlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PredictiveAlerts to delete
     */
    where?: PredictiveAlertWhereInput
  }

  /**
   * PredictiveAlert without action
   */
  export type PredictiveAlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictiveAlert
     */
    select?: PredictiveAlertSelect<ExtArgs> | null
  }


  /**
   * Model RiskScoreHistory
   */

  export type AggregateRiskScoreHistory = {
    _count: RiskScoreHistoryCountAggregateOutputType | null
    _avg: RiskScoreHistoryAvgAggregateOutputType | null
    _sum: RiskScoreHistorySumAggregateOutputType | null
    _min: RiskScoreHistoryMinAggregateOutputType | null
    _max: RiskScoreHistoryMaxAggregateOutputType | null
  }

  export type RiskScoreHistoryAvgAggregateOutputType = {
    score: number | null
  }

  export type RiskScoreHistorySumAggregateOutputType = {
    score: number | null
  }

  export type RiskScoreHistoryMinAggregateOutputType = {
    id: string | null
    nodeId: string | null
    score: number | null
    level: string | null
    createdAt: Date | null
  }

  export type RiskScoreHistoryMaxAggregateOutputType = {
    id: string | null
    nodeId: string | null
    score: number | null
    level: string | null
    createdAt: Date | null
  }

  export type RiskScoreHistoryCountAggregateOutputType = {
    id: number
    nodeId: number
    score: number
    level: number
    factors: number
    createdAt: number
    _all: number
  }


  export type RiskScoreHistoryAvgAggregateInputType = {
    score?: true
  }

  export type RiskScoreHistorySumAggregateInputType = {
    score?: true
  }

  export type RiskScoreHistoryMinAggregateInputType = {
    id?: true
    nodeId?: true
    score?: true
    level?: true
    createdAt?: true
  }

  export type RiskScoreHistoryMaxAggregateInputType = {
    id?: true
    nodeId?: true
    score?: true
    level?: true
    createdAt?: true
  }

  export type RiskScoreHistoryCountAggregateInputType = {
    id?: true
    nodeId?: true
    score?: true
    level?: true
    factors?: true
    createdAt?: true
    _all?: true
  }

  export type RiskScoreHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RiskScoreHistory to aggregate.
     */
    where?: RiskScoreHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RiskScoreHistories to fetch.
     */
    orderBy?: RiskScoreHistoryOrderByWithRelationInput | RiskScoreHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RiskScoreHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RiskScoreHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RiskScoreHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RiskScoreHistories
    **/
    _count?: true | RiskScoreHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RiskScoreHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RiskScoreHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RiskScoreHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RiskScoreHistoryMaxAggregateInputType
  }

  export type GetRiskScoreHistoryAggregateType<T extends RiskScoreHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateRiskScoreHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRiskScoreHistory[P]>
      : GetScalarType<T[P], AggregateRiskScoreHistory[P]>
  }




  export type RiskScoreHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RiskScoreHistoryWhereInput
    orderBy?: RiskScoreHistoryOrderByWithAggregationInput | RiskScoreHistoryOrderByWithAggregationInput[]
    by: RiskScoreHistoryScalarFieldEnum[] | RiskScoreHistoryScalarFieldEnum
    having?: RiskScoreHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RiskScoreHistoryCountAggregateInputType | true
    _avg?: RiskScoreHistoryAvgAggregateInputType
    _sum?: RiskScoreHistorySumAggregateInputType
    _min?: RiskScoreHistoryMinAggregateInputType
    _max?: RiskScoreHistoryMaxAggregateInputType
  }

  export type RiskScoreHistoryGroupByOutputType = {
    id: string
    nodeId: string
    score: number
    level: string
    factors: JsonValue | null
    createdAt: Date
    _count: RiskScoreHistoryCountAggregateOutputType | null
    _avg: RiskScoreHistoryAvgAggregateOutputType | null
    _sum: RiskScoreHistorySumAggregateOutputType | null
    _min: RiskScoreHistoryMinAggregateOutputType | null
    _max: RiskScoreHistoryMaxAggregateOutputType | null
  }

  type GetRiskScoreHistoryGroupByPayload<T extends RiskScoreHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RiskScoreHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RiskScoreHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RiskScoreHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], RiskScoreHistoryGroupByOutputType[P]>
        }
      >
    >


  export type RiskScoreHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nodeId?: boolean
    score?: boolean
    level?: boolean
    factors?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["riskScoreHistory"]>

  export type RiskScoreHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nodeId?: boolean
    score?: boolean
    level?: boolean
    factors?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["riskScoreHistory"]>

  export type RiskScoreHistorySelectScalar = {
    id?: boolean
    nodeId?: boolean
    score?: boolean
    level?: boolean
    factors?: boolean
    createdAt?: boolean
  }


  export type $RiskScoreHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RiskScoreHistory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nodeId: string
      score: number
      level: string
      factors: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["riskScoreHistory"]>
    composites: {}
  }

  type RiskScoreHistoryGetPayload<S extends boolean | null | undefined | RiskScoreHistoryDefaultArgs> = $Result.GetResult<Prisma.$RiskScoreHistoryPayload, S>

  type RiskScoreHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RiskScoreHistoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RiskScoreHistoryCountAggregateInputType | true
    }

  export interface RiskScoreHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RiskScoreHistory'], meta: { name: 'RiskScoreHistory' } }
    /**
     * Find zero or one RiskScoreHistory that matches the filter.
     * @param {RiskScoreHistoryFindUniqueArgs} args - Arguments to find a RiskScoreHistory
     * @example
     * // Get one RiskScoreHistory
     * const riskScoreHistory = await prisma.riskScoreHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RiskScoreHistoryFindUniqueArgs>(args: SelectSubset<T, RiskScoreHistoryFindUniqueArgs<ExtArgs>>): Prisma__RiskScoreHistoryClient<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RiskScoreHistory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RiskScoreHistoryFindUniqueOrThrowArgs} args - Arguments to find a RiskScoreHistory
     * @example
     * // Get one RiskScoreHistory
     * const riskScoreHistory = await prisma.riskScoreHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RiskScoreHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, RiskScoreHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RiskScoreHistoryClient<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RiskScoreHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskScoreHistoryFindFirstArgs} args - Arguments to find a RiskScoreHistory
     * @example
     * // Get one RiskScoreHistory
     * const riskScoreHistory = await prisma.riskScoreHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RiskScoreHistoryFindFirstArgs>(args?: SelectSubset<T, RiskScoreHistoryFindFirstArgs<ExtArgs>>): Prisma__RiskScoreHistoryClient<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RiskScoreHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskScoreHistoryFindFirstOrThrowArgs} args - Arguments to find a RiskScoreHistory
     * @example
     * // Get one RiskScoreHistory
     * const riskScoreHistory = await prisma.riskScoreHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RiskScoreHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, RiskScoreHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__RiskScoreHistoryClient<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RiskScoreHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskScoreHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RiskScoreHistories
     * const riskScoreHistories = await prisma.riskScoreHistory.findMany()
     * 
     * // Get first 10 RiskScoreHistories
     * const riskScoreHistories = await prisma.riskScoreHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const riskScoreHistoryWithIdOnly = await prisma.riskScoreHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RiskScoreHistoryFindManyArgs>(args?: SelectSubset<T, RiskScoreHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RiskScoreHistory.
     * @param {RiskScoreHistoryCreateArgs} args - Arguments to create a RiskScoreHistory.
     * @example
     * // Create one RiskScoreHistory
     * const RiskScoreHistory = await prisma.riskScoreHistory.create({
     *   data: {
     *     // ... data to create a RiskScoreHistory
     *   }
     * })
     * 
     */
    create<T extends RiskScoreHistoryCreateArgs>(args: SelectSubset<T, RiskScoreHistoryCreateArgs<ExtArgs>>): Prisma__RiskScoreHistoryClient<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RiskScoreHistories.
     * @param {RiskScoreHistoryCreateManyArgs} args - Arguments to create many RiskScoreHistories.
     * @example
     * // Create many RiskScoreHistories
     * const riskScoreHistory = await prisma.riskScoreHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RiskScoreHistoryCreateManyArgs>(args?: SelectSubset<T, RiskScoreHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RiskScoreHistories and returns the data saved in the database.
     * @param {RiskScoreHistoryCreateManyAndReturnArgs} args - Arguments to create many RiskScoreHistories.
     * @example
     * // Create many RiskScoreHistories
     * const riskScoreHistory = await prisma.riskScoreHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RiskScoreHistories and only return the `id`
     * const riskScoreHistoryWithIdOnly = await prisma.riskScoreHistory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RiskScoreHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, RiskScoreHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RiskScoreHistory.
     * @param {RiskScoreHistoryDeleteArgs} args - Arguments to delete one RiskScoreHistory.
     * @example
     * // Delete one RiskScoreHistory
     * const RiskScoreHistory = await prisma.riskScoreHistory.delete({
     *   where: {
     *     // ... filter to delete one RiskScoreHistory
     *   }
     * })
     * 
     */
    delete<T extends RiskScoreHistoryDeleteArgs>(args: SelectSubset<T, RiskScoreHistoryDeleteArgs<ExtArgs>>): Prisma__RiskScoreHistoryClient<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RiskScoreHistory.
     * @param {RiskScoreHistoryUpdateArgs} args - Arguments to update one RiskScoreHistory.
     * @example
     * // Update one RiskScoreHistory
     * const riskScoreHistory = await prisma.riskScoreHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RiskScoreHistoryUpdateArgs>(args: SelectSubset<T, RiskScoreHistoryUpdateArgs<ExtArgs>>): Prisma__RiskScoreHistoryClient<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RiskScoreHistories.
     * @param {RiskScoreHistoryDeleteManyArgs} args - Arguments to filter RiskScoreHistories to delete.
     * @example
     * // Delete a few RiskScoreHistories
     * const { count } = await prisma.riskScoreHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RiskScoreHistoryDeleteManyArgs>(args?: SelectSubset<T, RiskScoreHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RiskScoreHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskScoreHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RiskScoreHistories
     * const riskScoreHistory = await prisma.riskScoreHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RiskScoreHistoryUpdateManyArgs>(args: SelectSubset<T, RiskScoreHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RiskScoreHistory.
     * @param {RiskScoreHistoryUpsertArgs} args - Arguments to update or create a RiskScoreHistory.
     * @example
     * // Update or create a RiskScoreHistory
     * const riskScoreHistory = await prisma.riskScoreHistory.upsert({
     *   create: {
     *     // ... data to create a RiskScoreHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RiskScoreHistory we want to update
     *   }
     * })
     */
    upsert<T extends RiskScoreHistoryUpsertArgs>(args: SelectSubset<T, RiskScoreHistoryUpsertArgs<ExtArgs>>): Prisma__RiskScoreHistoryClient<$Result.GetResult<Prisma.$RiskScoreHistoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RiskScoreHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskScoreHistoryCountArgs} args - Arguments to filter RiskScoreHistories to count.
     * @example
     * // Count the number of RiskScoreHistories
     * const count = await prisma.riskScoreHistory.count({
     *   where: {
     *     // ... the filter for the RiskScoreHistories we want to count
     *   }
     * })
    **/
    count<T extends RiskScoreHistoryCountArgs>(
      args?: Subset<T, RiskScoreHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RiskScoreHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RiskScoreHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskScoreHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RiskScoreHistoryAggregateArgs>(args: Subset<T, RiskScoreHistoryAggregateArgs>): Prisma.PrismaPromise<GetRiskScoreHistoryAggregateType<T>>

    /**
     * Group by RiskScoreHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskScoreHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RiskScoreHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RiskScoreHistoryGroupByArgs['orderBy'] }
        : { orderBy?: RiskScoreHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RiskScoreHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRiskScoreHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RiskScoreHistory model
   */
  readonly fields: RiskScoreHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RiskScoreHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RiskScoreHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RiskScoreHistory model
   */ 
  interface RiskScoreHistoryFieldRefs {
    readonly id: FieldRef<"RiskScoreHistory", 'String'>
    readonly nodeId: FieldRef<"RiskScoreHistory", 'String'>
    readonly score: FieldRef<"RiskScoreHistory", 'Float'>
    readonly level: FieldRef<"RiskScoreHistory", 'String'>
    readonly factors: FieldRef<"RiskScoreHistory", 'Json'>
    readonly createdAt: FieldRef<"RiskScoreHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RiskScoreHistory findUnique
   */
  export type RiskScoreHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
    /**
     * Filter, which RiskScoreHistory to fetch.
     */
    where: RiskScoreHistoryWhereUniqueInput
  }

  /**
   * RiskScoreHistory findUniqueOrThrow
   */
  export type RiskScoreHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
    /**
     * Filter, which RiskScoreHistory to fetch.
     */
    where: RiskScoreHistoryWhereUniqueInput
  }

  /**
   * RiskScoreHistory findFirst
   */
  export type RiskScoreHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
    /**
     * Filter, which RiskScoreHistory to fetch.
     */
    where?: RiskScoreHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RiskScoreHistories to fetch.
     */
    orderBy?: RiskScoreHistoryOrderByWithRelationInput | RiskScoreHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RiskScoreHistories.
     */
    cursor?: RiskScoreHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RiskScoreHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RiskScoreHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RiskScoreHistories.
     */
    distinct?: RiskScoreHistoryScalarFieldEnum | RiskScoreHistoryScalarFieldEnum[]
  }

  /**
   * RiskScoreHistory findFirstOrThrow
   */
  export type RiskScoreHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
    /**
     * Filter, which RiskScoreHistory to fetch.
     */
    where?: RiskScoreHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RiskScoreHistories to fetch.
     */
    orderBy?: RiskScoreHistoryOrderByWithRelationInput | RiskScoreHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RiskScoreHistories.
     */
    cursor?: RiskScoreHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RiskScoreHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RiskScoreHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RiskScoreHistories.
     */
    distinct?: RiskScoreHistoryScalarFieldEnum | RiskScoreHistoryScalarFieldEnum[]
  }

  /**
   * RiskScoreHistory findMany
   */
  export type RiskScoreHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
    /**
     * Filter, which RiskScoreHistories to fetch.
     */
    where?: RiskScoreHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RiskScoreHistories to fetch.
     */
    orderBy?: RiskScoreHistoryOrderByWithRelationInput | RiskScoreHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RiskScoreHistories.
     */
    cursor?: RiskScoreHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RiskScoreHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RiskScoreHistories.
     */
    skip?: number
    distinct?: RiskScoreHistoryScalarFieldEnum | RiskScoreHistoryScalarFieldEnum[]
  }

  /**
   * RiskScoreHistory create
   */
  export type RiskScoreHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
    /**
     * The data needed to create a RiskScoreHistory.
     */
    data: XOR<RiskScoreHistoryCreateInput, RiskScoreHistoryUncheckedCreateInput>
  }

  /**
   * RiskScoreHistory createMany
   */
  export type RiskScoreHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RiskScoreHistories.
     */
    data: RiskScoreHistoryCreateManyInput | RiskScoreHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RiskScoreHistory createManyAndReturn
   */
  export type RiskScoreHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RiskScoreHistories.
     */
    data: RiskScoreHistoryCreateManyInput | RiskScoreHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RiskScoreHistory update
   */
  export type RiskScoreHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
    /**
     * The data needed to update a RiskScoreHistory.
     */
    data: XOR<RiskScoreHistoryUpdateInput, RiskScoreHistoryUncheckedUpdateInput>
    /**
     * Choose, which RiskScoreHistory to update.
     */
    where: RiskScoreHistoryWhereUniqueInput
  }

  /**
   * RiskScoreHistory updateMany
   */
  export type RiskScoreHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RiskScoreHistories.
     */
    data: XOR<RiskScoreHistoryUpdateManyMutationInput, RiskScoreHistoryUncheckedUpdateManyInput>
    /**
     * Filter which RiskScoreHistories to update
     */
    where?: RiskScoreHistoryWhereInput
  }

  /**
   * RiskScoreHistory upsert
   */
  export type RiskScoreHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
    /**
     * The filter to search for the RiskScoreHistory to update in case it exists.
     */
    where: RiskScoreHistoryWhereUniqueInput
    /**
     * In case the RiskScoreHistory found by the `where` argument doesn't exist, create a new RiskScoreHistory with this data.
     */
    create: XOR<RiskScoreHistoryCreateInput, RiskScoreHistoryUncheckedCreateInput>
    /**
     * In case the RiskScoreHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RiskScoreHistoryUpdateInput, RiskScoreHistoryUncheckedUpdateInput>
  }

  /**
   * RiskScoreHistory delete
   */
  export type RiskScoreHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
    /**
     * Filter which RiskScoreHistory to delete.
     */
    where: RiskScoreHistoryWhereUniqueInput
  }

  /**
   * RiskScoreHistory deleteMany
   */
  export type RiskScoreHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RiskScoreHistories to delete
     */
    where?: RiskScoreHistoryWhereInput
  }

  /**
   * RiskScoreHistory without action
   */
  export type RiskScoreHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskScoreHistory
     */
    select?: RiskScoreHistorySelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AiAgentScalarFieldEnum: {
    id: 'id',
    name: 'name',
    subsystem: 'subsystem',
    systemPrompt: 'systemPrompt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiAgentScalarFieldEnum = (typeof AiAgentScalarFieldEnum)[keyof typeof AiAgentScalarFieldEnum]


  export const AiKnowledgeSnippetScalarFieldEnum: {
    id: 'id',
    content: 'content',
    source: 'source',
    tags: 'tags',
    createdAt: 'createdAt',
    agentId: 'agentId'
  };

  export type AiKnowledgeSnippetScalarFieldEnum = (typeof AiKnowledgeSnippetScalarFieldEnum)[keyof typeof AiKnowledgeSnippetScalarFieldEnum]


  export const AiConversationScalarFieldEnum: {
    id: 'id',
    title: 'title',
    userId: 'userId',
    agentId: 'agentId',
    state: 'state',
    mode: 'mode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiConversationScalarFieldEnum = (typeof AiConversationScalarFieldEnum)[keyof typeof AiConversationScalarFieldEnum]


  export const AiConversationMessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    role: 'role',
    content: 'content',
    source: 'source',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type AiConversationMessageScalarFieldEnum = (typeof AiConversationMessageScalarFieldEnum)[keyof typeof AiConversationMessageScalarFieldEnum]


  export const AiInsightScalarFieldEnum: {
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

  export type AiInsightScalarFieldEnum = (typeof AiInsightScalarFieldEnum)[keyof typeof AiInsightScalarFieldEnum]


  export const AiSyncLogScalarFieldEnum: {
    id: 'id',
    syncType: 'syncType',
    recordsSynced: 'recordsSynced',
    recordsFailed: 'recordsFailed',
    status: 'status',
    errorMessage: 'errorMessage',
    createdAt: 'createdAt'
  };

  export type AiSyncLogScalarFieldEnum = (typeof AiSyncLogScalarFieldEnum)[keyof typeof AiSyncLogScalarFieldEnum]


  export const AiVerificationLogScalarFieldEnum: {
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

  export type AiVerificationLogScalarFieldEnum = (typeof AiVerificationLogScalarFieldEnum)[keyof typeof AiVerificationLogScalarFieldEnum]


  export const AiSafetyLogScalarFieldEnum: {
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

  export type AiSafetyLogScalarFieldEnum = (typeof AiSafetyLogScalarFieldEnum)[keyof typeof AiSafetyLogScalarFieldEnum]


  export const AiRequestLogScalarFieldEnum: {
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

  export type AiRequestLogScalarFieldEnum = (typeof AiRequestLogScalarFieldEnum)[keyof typeof AiRequestLogScalarFieldEnum]


  export const TrustGraphNodeScalarFieldEnum: {
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

  export type TrustGraphNodeScalarFieldEnum = (typeof TrustGraphNodeScalarFieldEnum)[keyof typeof TrustGraphNodeScalarFieldEnum]


  export const TrustGraphEdgeScalarFieldEnum: {
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

  export type TrustGraphEdgeScalarFieldEnum = (typeof TrustGraphEdgeScalarFieldEnum)[keyof typeof TrustGraphEdgeScalarFieldEnum]


  export const TrustGraphSyncLogScalarFieldEnum: {
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

  export type TrustGraphSyncLogScalarFieldEnum = (typeof TrustGraphSyncLogScalarFieldEnum)[keyof typeof TrustGraphSyncLogScalarFieldEnum]


  export const AuditConsistencyCheckLogScalarFieldEnum: {
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

  export type AuditConsistencyCheckLogScalarFieldEnum = (typeof AuditConsistencyCheckLogScalarFieldEnum)[keyof typeof AuditConsistencyCheckLogScalarFieldEnum]


  export const GraphConsistencyLogScalarFieldEnum: {
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

  export type GraphConsistencyLogScalarFieldEnum = (typeof GraphConsistencyLogScalarFieldEnum)[keyof typeof GraphConsistencyLogScalarFieldEnum]


  export const IntegrityJobLogScalarFieldEnum: {
    id: 'id',
    jobType: 'jobType',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    totalRecordsChecked: 'totalRecordsChecked',
    totalIssuesFound: 'totalIssuesFound',
    status: 'status',
    reportSummary: 'reportSummary'
  };

  export type IntegrityJobLogScalarFieldEnum = (typeof IntegrityJobLogScalarFieldEnum)[keyof typeof IntegrityJobLogScalarFieldEnum]


  export const AiRiskReportScalarFieldEnum: {
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

  export type AiRiskReportScalarFieldEnum = (typeof AiRiskReportScalarFieldEnum)[keyof typeof AiRiskReportScalarFieldEnum]


  export const AiReportAuditScalarFieldEnum: {
    id: 'id',
    reportId: 'reportId',
    reviewerId: 'reviewerId',
    action: 'action',
    previousContent: 'previousContent',
    newContent: 'newContent',
    comment: 'comment',
    createdAt: 'createdAt'
  };

  export type AiReportAuditScalarFieldEnum = (typeof AiReportAuditScalarFieldEnum)[keyof typeof AiReportAuditScalarFieldEnum]


  export const PredictiveAlertScalarFieldEnum: {
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

  export type PredictiveAlertScalarFieldEnum = (typeof PredictiveAlertScalarFieldEnum)[keyof typeof PredictiveAlertScalarFieldEnum]


  export const RiskScoreHistoryScalarFieldEnum: {
    id: 'id',
    nodeId: 'nodeId',
    score: 'score',
    level: 'level',
    factors: 'factors',
    createdAt: 'createdAt'
  };

  export type RiskScoreHistoryScalarFieldEnum = (typeof RiskScoreHistoryScalarFieldEnum)[keyof typeof RiskScoreHistoryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AiAgentWhereInput = {
    AND?: AiAgentWhereInput | AiAgentWhereInput[]
    OR?: AiAgentWhereInput[]
    NOT?: AiAgentWhereInput | AiAgentWhereInput[]
    id?: StringFilter<"AiAgent"> | string
    name?: StringFilter<"AiAgent"> | string
    subsystem?: StringFilter<"AiAgent"> | string
    systemPrompt?: StringFilter<"AiAgent"> | string
    createdAt?: DateTimeFilter<"AiAgent"> | Date | string
    updatedAt?: DateTimeFilter<"AiAgent"> | Date | string
  }

  export type AiAgentOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    systemPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiAgentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiAgentWhereInput | AiAgentWhereInput[]
    OR?: AiAgentWhereInput[]
    NOT?: AiAgentWhereInput | AiAgentWhereInput[]
    name?: StringFilter<"AiAgent"> | string
    subsystem?: StringFilter<"AiAgent"> | string
    systemPrompt?: StringFilter<"AiAgent"> | string
    createdAt?: DateTimeFilter<"AiAgent"> | Date | string
    updatedAt?: DateTimeFilter<"AiAgent"> | Date | string
  }, "id">

  export type AiAgentOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    systemPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiAgentCountOrderByAggregateInput
    _max?: AiAgentMaxOrderByAggregateInput
    _min?: AiAgentMinOrderByAggregateInput
  }

  export type AiAgentScalarWhereWithAggregatesInput = {
    AND?: AiAgentScalarWhereWithAggregatesInput | AiAgentScalarWhereWithAggregatesInput[]
    OR?: AiAgentScalarWhereWithAggregatesInput[]
    NOT?: AiAgentScalarWhereWithAggregatesInput | AiAgentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiAgent"> | string
    name?: StringWithAggregatesFilter<"AiAgent"> | string
    subsystem?: StringWithAggregatesFilter<"AiAgent"> | string
    systemPrompt?: StringWithAggregatesFilter<"AiAgent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AiAgent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiAgent"> | Date | string
  }

  export type AiKnowledgeSnippetWhereInput = {
    AND?: AiKnowledgeSnippetWhereInput | AiKnowledgeSnippetWhereInput[]
    OR?: AiKnowledgeSnippetWhereInput[]
    NOT?: AiKnowledgeSnippetWhereInput | AiKnowledgeSnippetWhereInput[]
    id?: StringFilter<"AiKnowledgeSnippet"> | string
    content?: StringFilter<"AiKnowledgeSnippet"> | string
    source?: StringFilter<"AiKnowledgeSnippet"> | string
    tags?: StringNullableListFilter<"AiKnowledgeSnippet">
    createdAt?: DateTimeFilter<"AiKnowledgeSnippet"> | Date | string
    agentId?: StringNullableFilter<"AiKnowledgeSnippet"> | string | null
  }

  export type AiKnowledgeSnippetOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    agentId?: SortOrderInput | SortOrder
  }

  export type AiKnowledgeSnippetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiKnowledgeSnippetWhereInput | AiKnowledgeSnippetWhereInput[]
    OR?: AiKnowledgeSnippetWhereInput[]
    NOT?: AiKnowledgeSnippetWhereInput | AiKnowledgeSnippetWhereInput[]
    content?: StringFilter<"AiKnowledgeSnippet"> | string
    source?: StringFilter<"AiKnowledgeSnippet"> | string
    tags?: StringNullableListFilter<"AiKnowledgeSnippet">
    createdAt?: DateTimeFilter<"AiKnowledgeSnippet"> | Date | string
    agentId?: StringNullableFilter<"AiKnowledgeSnippet"> | string | null
  }, "id">

  export type AiKnowledgeSnippetOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    agentId?: SortOrderInput | SortOrder
    _count?: AiKnowledgeSnippetCountOrderByAggregateInput
    _max?: AiKnowledgeSnippetMaxOrderByAggregateInput
    _min?: AiKnowledgeSnippetMinOrderByAggregateInput
  }

  export type AiKnowledgeSnippetScalarWhereWithAggregatesInput = {
    AND?: AiKnowledgeSnippetScalarWhereWithAggregatesInput | AiKnowledgeSnippetScalarWhereWithAggregatesInput[]
    OR?: AiKnowledgeSnippetScalarWhereWithAggregatesInput[]
    NOT?: AiKnowledgeSnippetScalarWhereWithAggregatesInput | AiKnowledgeSnippetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiKnowledgeSnippet"> | string
    content?: StringWithAggregatesFilter<"AiKnowledgeSnippet"> | string
    source?: StringWithAggregatesFilter<"AiKnowledgeSnippet"> | string
    tags?: StringNullableListFilter<"AiKnowledgeSnippet">
    createdAt?: DateTimeWithAggregatesFilter<"AiKnowledgeSnippet"> | Date | string
    agentId?: StringNullableWithAggregatesFilter<"AiKnowledgeSnippet"> | string | null
  }

  export type AiConversationWhereInput = {
    AND?: AiConversationWhereInput | AiConversationWhereInput[]
    OR?: AiConversationWhereInput[]
    NOT?: AiConversationWhereInput | AiConversationWhereInput[]
    id?: StringFilter<"AiConversation"> | string
    title?: StringNullableFilter<"AiConversation"> | string | null
    userId?: StringFilter<"AiConversation"> | string
    agentId?: StringNullableFilter<"AiConversation"> | string | null
    state?: JsonNullableFilter<"AiConversation">
    mode?: StringFilter<"AiConversation"> | string
    createdAt?: DateTimeFilter<"AiConversation"> | Date | string
    updatedAt?: DateTimeFilter<"AiConversation"> | Date | string
    messages?: AiConversationMessageListRelationFilter
  }

  export type AiConversationOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    userId?: SortOrder
    agentId?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    mode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    messages?: AiConversationMessageOrderByRelationAggregateInput
  }

  export type AiConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiConversationWhereInput | AiConversationWhereInput[]
    OR?: AiConversationWhereInput[]
    NOT?: AiConversationWhereInput | AiConversationWhereInput[]
    title?: StringNullableFilter<"AiConversation"> | string | null
    userId?: StringFilter<"AiConversation"> | string
    agentId?: StringNullableFilter<"AiConversation"> | string | null
    state?: JsonNullableFilter<"AiConversation">
    mode?: StringFilter<"AiConversation"> | string
    createdAt?: DateTimeFilter<"AiConversation"> | Date | string
    updatedAt?: DateTimeFilter<"AiConversation"> | Date | string
    messages?: AiConversationMessageListRelationFilter
  }, "id">

  export type AiConversationOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    userId?: SortOrder
    agentId?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    mode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiConversationCountOrderByAggregateInput
    _max?: AiConversationMaxOrderByAggregateInput
    _min?: AiConversationMinOrderByAggregateInput
  }

  export type AiConversationScalarWhereWithAggregatesInput = {
    AND?: AiConversationScalarWhereWithAggregatesInput | AiConversationScalarWhereWithAggregatesInput[]
    OR?: AiConversationScalarWhereWithAggregatesInput[]
    NOT?: AiConversationScalarWhereWithAggregatesInput | AiConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiConversation"> | string
    title?: StringNullableWithAggregatesFilter<"AiConversation"> | string | null
    userId?: StringWithAggregatesFilter<"AiConversation"> | string
    agentId?: StringNullableWithAggregatesFilter<"AiConversation"> | string | null
    state?: JsonNullableWithAggregatesFilter<"AiConversation">
    mode?: StringWithAggregatesFilter<"AiConversation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AiConversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiConversation"> | Date | string
  }

  export type AiConversationMessageWhereInput = {
    AND?: AiConversationMessageWhereInput | AiConversationMessageWhereInput[]
    OR?: AiConversationMessageWhereInput[]
    NOT?: AiConversationMessageWhereInput | AiConversationMessageWhereInput[]
    id?: StringFilter<"AiConversationMessage"> | string
    conversationId?: StringFilter<"AiConversationMessage"> | string
    role?: StringFilter<"AiConversationMessage"> | string
    content?: StringFilter<"AiConversationMessage"> | string
    source?: StringNullableFilter<"AiConversationMessage"> | string | null
    metadata?: JsonNullableFilter<"AiConversationMessage">
    createdAt?: DateTimeFilter<"AiConversationMessage"> | Date | string
    conversation?: XOR<AiConversationRelationFilter, AiConversationWhereInput>
  }

  export type AiConversationMessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    source?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    conversation?: AiConversationOrderByWithRelationInput
  }

  export type AiConversationMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiConversationMessageWhereInput | AiConversationMessageWhereInput[]
    OR?: AiConversationMessageWhereInput[]
    NOT?: AiConversationMessageWhereInput | AiConversationMessageWhereInput[]
    conversationId?: StringFilter<"AiConversationMessage"> | string
    role?: StringFilter<"AiConversationMessage"> | string
    content?: StringFilter<"AiConversationMessage"> | string
    source?: StringNullableFilter<"AiConversationMessage"> | string | null
    metadata?: JsonNullableFilter<"AiConversationMessage">
    createdAt?: DateTimeFilter<"AiConversationMessage"> | Date | string
    conversation?: XOR<AiConversationRelationFilter, AiConversationWhereInput>
  }, "id">

  export type AiConversationMessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    source?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AiConversationMessageCountOrderByAggregateInput
    _max?: AiConversationMessageMaxOrderByAggregateInput
    _min?: AiConversationMessageMinOrderByAggregateInput
  }

  export type AiConversationMessageScalarWhereWithAggregatesInput = {
    AND?: AiConversationMessageScalarWhereWithAggregatesInput | AiConversationMessageScalarWhereWithAggregatesInput[]
    OR?: AiConversationMessageScalarWhereWithAggregatesInput[]
    NOT?: AiConversationMessageScalarWhereWithAggregatesInput | AiConversationMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiConversationMessage"> | string
    conversationId?: StringWithAggregatesFilter<"AiConversationMessage"> | string
    role?: StringWithAggregatesFilter<"AiConversationMessage"> | string
    content?: StringWithAggregatesFilter<"AiConversationMessage"> | string
    source?: StringNullableWithAggregatesFilter<"AiConversationMessage"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AiConversationMessage">
    createdAt?: DateTimeWithAggregatesFilter<"AiConversationMessage"> | Date | string
  }

  export type AiInsightWhereInput = {
    AND?: AiInsightWhereInput | AiInsightWhereInput[]
    OR?: AiInsightWhereInput[]
    NOT?: AiInsightWhereInput | AiInsightWhereInput[]
    id?: StringFilter<"AiInsight"> | string
    category?: StringFilter<"AiInsight"> | string
    title?: StringFilter<"AiInsight"> | string
    content?: StringFilter<"AiInsight"> | string
    severity?: StringFilter<"AiInsight"> | string
    source?: StringFilter<"AiInsight"> | string
    metadata?: JsonNullableFilter<"AiInsight">
    expiresAt?: DateTimeNullableFilter<"AiInsight"> | Date | string | null
    createdAt?: DateTimeFilter<"AiInsight"> | Date | string
  }

  export type AiInsightOrderByWithRelationInput = {
    id?: SortOrder
    category?: SortOrder
    title?: SortOrder
    content?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    metadata?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AiInsightWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiInsightWhereInput | AiInsightWhereInput[]
    OR?: AiInsightWhereInput[]
    NOT?: AiInsightWhereInput | AiInsightWhereInput[]
    category?: StringFilter<"AiInsight"> | string
    title?: StringFilter<"AiInsight"> | string
    content?: StringFilter<"AiInsight"> | string
    severity?: StringFilter<"AiInsight"> | string
    source?: StringFilter<"AiInsight"> | string
    metadata?: JsonNullableFilter<"AiInsight">
    expiresAt?: DateTimeNullableFilter<"AiInsight"> | Date | string | null
    createdAt?: DateTimeFilter<"AiInsight"> | Date | string
  }, "id">

  export type AiInsightOrderByWithAggregationInput = {
    id?: SortOrder
    category?: SortOrder
    title?: SortOrder
    content?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    metadata?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AiInsightCountOrderByAggregateInput
    _max?: AiInsightMaxOrderByAggregateInput
    _min?: AiInsightMinOrderByAggregateInput
  }

  export type AiInsightScalarWhereWithAggregatesInput = {
    AND?: AiInsightScalarWhereWithAggregatesInput | AiInsightScalarWhereWithAggregatesInput[]
    OR?: AiInsightScalarWhereWithAggregatesInput[]
    NOT?: AiInsightScalarWhereWithAggregatesInput | AiInsightScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiInsight"> | string
    category?: StringWithAggregatesFilter<"AiInsight"> | string
    title?: StringWithAggregatesFilter<"AiInsight"> | string
    content?: StringWithAggregatesFilter<"AiInsight"> | string
    severity?: StringWithAggregatesFilter<"AiInsight"> | string
    source?: StringWithAggregatesFilter<"AiInsight"> | string
    metadata?: JsonNullableWithAggregatesFilter<"AiInsight">
    expiresAt?: DateTimeNullableWithAggregatesFilter<"AiInsight"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiInsight"> | Date | string
  }

  export type AiSyncLogWhereInput = {
    AND?: AiSyncLogWhereInput | AiSyncLogWhereInput[]
    OR?: AiSyncLogWhereInput[]
    NOT?: AiSyncLogWhereInput | AiSyncLogWhereInput[]
    id?: StringFilter<"AiSyncLog"> | string
    syncType?: StringFilter<"AiSyncLog"> | string
    recordsSynced?: IntFilter<"AiSyncLog"> | number
    recordsFailed?: IntFilter<"AiSyncLog"> | number
    status?: StringFilter<"AiSyncLog"> | string
    errorMessage?: StringNullableFilter<"AiSyncLog"> | string | null
    createdAt?: DateTimeFilter<"AiSyncLog"> | Date | string
  }

  export type AiSyncLogOrderByWithRelationInput = {
    id?: SortOrder
    syncType?: SortOrder
    recordsSynced?: SortOrder
    recordsFailed?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AiSyncLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiSyncLogWhereInput | AiSyncLogWhereInput[]
    OR?: AiSyncLogWhereInput[]
    NOT?: AiSyncLogWhereInput | AiSyncLogWhereInput[]
    syncType?: StringFilter<"AiSyncLog"> | string
    recordsSynced?: IntFilter<"AiSyncLog"> | number
    recordsFailed?: IntFilter<"AiSyncLog"> | number
    status?: StringFilter<"AiSyncLog"> | string
    errorMessage?: StringNullableFilter<"AiSyncLog"> | string | null
    createdAt?: DateTimeFilter<"AiSyncLog"> | Date | string
  }, "id">

  export type AiSyncLogOrderByWithAggregationInput = {
    id?: SortOrder
    syncType?: SortOrder
    recordsSynced?: SortOrder
    recordsFailed?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AiSyncLogCountOrderByAggregateInput
    _avg?: AiSyncLogAvgOrderByAggregateInput
    _max?: AiSyncLogMaxOrderByAggregateInput
    _min?: AiSyncLogMinOrderByAggregateInput
    _sum?: AiSyncLogSumOrderByAggregateInput
  }

  export type AiSyncLogScalarWhereWithAggregatesInput = {
    AND?: AiSyncLogScalarWhereWithAggregatesInput | AiSyncLogScalarWhereWithAggregatesInput[]
    OR?: AiSyncLogScalarWhereWithAggregatesInput[]
    NOT?: AiSyncLogScalarWhereWithAggregatesInput | AiSyncLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiSyncLog"> | string
    syncType?: StringWithAggregatesFilter<"AiSyncLog"> | string
    recordsSynced?: IntWithAggregatesFilter<"AiSyncLog"> | number
    recordsFailed?: IntWithAggregatesFilter<"AiSyncLog"> | number
    status?: StringWithAggregatesFilter<"AiSyncLog"> | string
    errorMessage?: StringNullableWithAggregatesFilter<"AiSyncLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiSyncLog"> | Date | string
  }

  export type AiVerificationLogWhereInput = {
    AND?: AiVerificationLogWhereInput | AiVerificationLogWhereInput[]
    OR?: AiVerificationLogWhereInput[]
    NOT?: AiVerificationLogWhereInput | AiVerificationLogWhereInput[]
    id?: StringFilter<"AiVerificationLog"> | string
    targetId?: StringFilter<"AiVerificationLog"> | string
    targetType?: StringFilter<"AiVerificationLog"> | string
    targetDisplayCode?: StringNullableFilter<"AiVerificationLog"> | string | null
    targetVersion?: IntNullableFilter<"AiVerificationLog"> | number | null
    sourceModule?: StringFilter<"AiVerificationLog"> | string
    aiProposedContent?: JsonFilter<"AiVerificationLog">
    finalContent?: JsonNullableFilter<"AiVerificationLog">
    status?: StringFilter<"AiVerificationLog"> | string
    riskLevel?: StringFilter<"AiVerificationLog"> | string
    requiredRole?: StringFilter<"AiVerificationLog"> | string
    verifiedBy?: StringNullableFilter<"AiVerificationLog"> | string | null
    verifiedAt?: DateTimeNullableFilter<"AiVerificationLog"> | Date | string | null
    modelVersion?: StringNullableFilter<"AiVerificationLog"> | string | null
    isOrphan?: BoolFilter<"AiVerificationLog"> | boolean
    createdAt?: DateTimeFilter<"AiVerificationLog"> | Date | string
  }

  export type AiVerificationLogOrderByWithRelationInput = {
    id?: SortOrder
    targetId?: SortOrder
    targetType?: SortOrder
    targetDisplayCode?: SortOrderInput | SortOrder
    targetVersion?: SortOrderInput | SortOrder
    sourceModule?: SortOrder
    aiProposedContent?: SortOrder
    finalContent?: SortOrderInput | SortOrder
    status?: SortOrder
    riskLevel?: SortOrder
    requiredRole?: SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    modelVersion?: SortOrderInput | SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
  }

  export type AiVerificationLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiVerificationLogWhereInput | AiVerificationLogWhereInput[]
    OR?: AiVerificationLogWhereInput[]
    NOT?: AiVerificationLogWhereInput | AiVerificationLogWhereInput[]
    targetId?: StringFilter<"AiVerificationLog"> | string
    targetType?: StringFilter<"AiVerificationLog"> | string
    targetDisplayCode?: StringNullableFilter<"AiVerificationLog"> | string | null
    targetVersion?: IntNullableFilter<"AiVerificationLog"> | number | null
    sourceModule?: StringFilter<"AiVerificationLog"> | string
    aiProposedContent?: JsonFilter<"AiVerificationLog">
    finalContent?: JsonNullableFilter<"AiVerificationLog">
    status?: StringFilter<"AiVerificationLog"> | string
    riskLevel?: StringFilter<"AiVerificationLog"> | string
    requiredRole?: StringFilter<"AiVerificationLog"> | string
    verifiedBy?: StringNullableFilter<"AiVerificationLog"> | string | null
    verifiedAt?: DateTimeNullableFilter<"AiVerificationLog"> | Date | string | null
    modelVersion?: StringNullableFilter<"AiVerificationLog"> | string | null
    isOrphan?: BoolFilter<"AiVerificationLog"> | boolean
    createdAt?: DateTimeFilter<"AiVerificationLog"> | Date | string
  }, "id">

  export type AiVerificationLogOrderByWithAggregationInput = {
    id?: SortOrder
    targetId?: SortOrder
    targetType?: SortOrder
    targetDisplayCode?: SortOrderInput | SortOrder
    targetVersion?: SortOrderInput | SortOrder
    sourceModule?: SortOrder
    aiProposedContent?: SortOrder
    finalContent?: SortOrderInput | SortOrder
    status?: SortOrder
    riskLevel?: SortOrder
    requiredRole?: SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    modelVersion?: SortOrderInput | SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
    _count?: AiVerificationLogCountOrderByAggregateInput
    _avg?: AiVerificationLogAvgOrderByAggregateInput
    _max?: AiVerificationLogMaxOrderByAggregateInput
    _min?: AiVerificationLogMinOrderByAggregateInput
    _sum?: AiVerificationLogSumOrderByAggregateInput
  }

  export type AiVerificationLogScalarWhereWithAggregatesInput = {
    AND?: AiVerificationLogScalarWhereWithAggregatesInput | AiVerificationLogScalarWhereWithAggregatesInput[]
    OR?: AiVerificationLogScalarWhereWithAggregatesInput[]
    NOT?: AiVerificationLogScalarWhereWithAggregatesInput | AiVerificationLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiVerificationLog"> | string
    targetId?: StringWithAggregatesFilter<"AiVerificationLog"> | string
    targetType?: StringWithAggregatesFilter<"AiVerificationLog"> | string
    targetDisplayCode?: StringNullableWithAggregatesFilter<"AiVerificationLog"> | string | null
    targetVersion?: IntNullableWithAggregatesFilter<"AiVerificationLog"> | number | null
    sourceModule?: StringWithAggregatesFilter<"AiVerificationLog"> | string
    aiProposedContent?: JsonWithAggregatesFilter<"AiVerificationLog">
    finalContent?: JsonNullableWithAggregatesFilter<"AiVerificationLog">
    status?: StringWithAggregatesFilter<"AiVerificationLog"> | string
    riskLevel?: StringWithAggregatesFilter<"AiVerificationLog"> | string
    requiredRole?: StringWithAggregatesFilter<"AiVerificationLog"> | string
    verifiedBy?: StringNullableWithAggregatesFilter<"AiVerificationLog"> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"AiVerificationLog"> | Date | string | null
    modelVersion?: StringNullableWithAggregatesFilter<"AiVerificationLog"> | string | null
    isOrphan?: BoolWithAggregatesFilter<"AiVerificationLog"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AiVerificationLog"> | Date | string
  }

  export type AiSafetyLogWhereInput = {
    AND?: AiSafetyLogWhereInput | AiSafetyLogWhereInput[]
    OR?: AiSafetyLogWhereInput[]
    NOT?: AiSafetyLogWhereInput | AiSafetyLogWhereInput[]
    id?: StringFilter<"AiSafetyLog"> | string
    timestamp?: DateTimeFilter<"AiSafetyLog"> | Date | string
    eventId?: StringFilter<"AiSafetyLog"> | string
    userId?: StringFilter<"AiSafetyLog"> | string
    targetType?: StringNullableFilter<"AiSafetyLog"> | string | null
    targetId?: StringNullableFilter<"AiSafetyLog"> | string | null
    action?: StringFilter<"AiSafetyLog"> | string
    riskLevel?: StringFilter<"AiSafetyLog"> | string
    details?: StringFilter<"AiSafetyLog"> | string
    isImmutable?: BoolFilter<"AiSafetyLog"> | boolean
    isOrphan?: BoolFilter<"AiSafetyLog"> | boolean
  }

  export type AiSafetyLogOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    action?: SortOrder
    riskLevel?: SortOrder
    details?: SortOrder
    isImmutable?: SortOrder
    isOrphan?: SortOrder
  }

  export type AiSafetyLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiSafetyLogWhereInput | AiSafetyLogWhereInput[]
    OR?: AiSafetyLogWhereInput[]
    NOT?: AiSafetyLogWhereInput | AiSafetyLogWhereInput[]
    timestamp?: DateTimeFilter<"AiSafetyLog"> | Date | string
    eventId?: StringFilter<"AiSafetyLog"> | string
    userId?: StringFilter<"AiSafetyLog"> | string
    targetType?: StringNullableFilter<"AiSafetyLog"> | string | null
    targetId?: StringNullableFilter<"AiSafetyLog"> | string | null
    action?: StringFilter<"AiSafetyLog"> | string
    riskLevel?: StringFilter<"AiSafetyLog"> | string
    details?: StringFilter<"AiSafetyLog"> | string
    isImmutable?: BoolFilter<"AiSafetyLog"> | boolean
    isOrphan?: BoolFilter<"AiSafetyLog"> | boolean
  }, "id">

  export type AiSafetyLogOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    action?: SortOrder
    riskLevel?: SortOrder
    details?: SortOrder
    isImmutable?: SortOrder
    isOrphan?: SortOrder
    _count?: AiSafetyLogCountOrderByAggregateInput
    _max?: AiSafetyLogMaxOrderByAggregateInput
    _min?: AiSafetyLogMinOrderByAggregateInput
  }

  export type AiSafetyLogScalarWhereWithAggregatesInput = {
    AND?: AiSafetyLogScalarWhereWithAggregatesInput | AiSafetyLogScalarWhereWithAggregatesInput[]
    OR?: AiSafetyLogScalarWhereWithAggregatesInput[]
    NOT?: AiSafetyLogScalarWhereWithAggregatesInput | AiSafetyLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiSafetyLog"> | string
    timestamp?: DateTimeWithAggregatesFilter<"AiSafetyLog"> | Date | string
    eventId?: StringWithAggregatesFilter<"AiSafetyLog"> | string
    userId?: StringWithAggregatesFilter<"AiSafetyLog"> | string
    targetType?: StringNullableWithAggregatesFilter<"AiSafetyLog"> | string | null
    targetId?: StringNullableWithAggregatesFilter<"AiSafetyLog"> | string | null
    action?: StringWithAggregatesFilter<"AiSafetyLog"> | string
    riskLevel?: StringWithAggregatesFilter<"AiSafetyLog"> | string
    details?: StringWithAggregatesFilter<"AiSafetyLog"> | string
    isImmutable?: BoolWithAggregatesFilter<"AiSafetyLog"> | boolean
    isOrphan?: BoolWithAggregatesFilter<"AiSafetyLog"> | boolean
  }

  export type AiRequestLogWhereInput = {
    AND?: AiRequestLogWhereInput | AiRequestLogWhereInput[]
    OR?: AiRequestLogWhereInput[]
    NOT?: AiRequestLogWhereInput | AiRequestLogWhereInput[]
    id?: StringFilter<"AiRequestLog"> | string
    userId?: StringFilter<"AiRequestLog"> | string
    targetType?: StringNullableFilter<"AiRequestLog"> | string | null
    targetId?: StringNullableFilter<"AiRequestLog"> | string | null
    modelName?: StringFilter<"AiRequestLog"> | string
    promptTokens?: IntFilter<"AiRequestLog"> | number
    completionTokens?: IntFilter<"AiRequestLog"> | number
    latencyMs?: IntFilter<"AiRequestLog"> | number
    status?: IntFilter<"AiRequestLog"> | number
    error?: StringNullableFilter<"AiRequestLog"> | string | null
    isOrphan?: BoolFilter<"AiRequestLog"> | boolean
    createdAt?: DateTimeFilter<"AiRequestLog"> | Date | string
  }

  export type AiRequestLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    latencyMs?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
  }

  export type AiRequestLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiRequestLogWhereInput | AiRequestLogWhereInput[]
    OR?: AiRequestLogWhereInput[]
    NOT?: AiRequestLogWhereInput | AiRequestLogWhereInput[]
    userId?: StringFilter<"AiRequestLog"> | string
    targetType?: StringNullableFilter<"AiRequestLog"> | string | null
    targetId?: StringNullableFilter<"AiRequestLog"> | string | null
    modelName?: StringFilter<"AiRequestLog"> | string
    promptTokens?: IntFilter<"AiRequestLog"> | number
    completionTokens?: IntFilter<"AiRequestLog"> | number
    latencyMs?: IntFilter<"AiRequestLog"> | number
    status?: IntFilter<"AiRequestLog"> | number
    error?: StringNullableFilter<"AiRequestLog"> | string | null
    isOrphan?: BoolFilter<"AiRequestLog"> | boolean
    createdAt?: DateTimeFilter<"AiRequestLog"> | Date | string
  }, "id">

  export type AiRequestLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    latencyMs?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
    _count?: AiRequestLogCountOrderByAggregateInput
    _avg?: AiRequestLogAvgOrderByAggregateInput
    _max?: AiRequestLogMaxOrderByAggregateInput
    _min?: AiRequestLogMinOrderByAggregateInput
    _sum?: AiRequestLogSumOrderByAggregateInput
  }

  export type AiRequestLogScalarWhereWithAggregatesInput = {
    AND?: AiRequestLogScalarWhereWithAggregatesInput | AiRequestLogScalarWhereWithAggregatesInput[]
    OR?: AiRequestLogScalarWhereWithAggregatesInput[]
    NOT?: AiRequestLogScalarWhereWithAggregatesInput | AiRequestLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiRequestLog"> | string
    userId?: StringWithAggregatesFilter<"AiRequestLog"> | string
    targetType?: StringNullableWithAggregatesFilter<"AiRequestLog"> | string | null
    targetId?: StringNullableWithAggregatesFilter<"AiRequestLog"> | string | null
    modelName?: StringWithAggregatesFilter<"AiRequestLog"> | string
    promptTokens?: IntWithAggregatesFilter<"AiRequestLog"> | number
    completionTokens?: IntWithAggregatesFilter<"AiRequestLog"> | number
    latencyMs?: IntWithAggregatesFilter<"AiRequestLog"> | number
    status?: IntWithAggregatesFilter<"AiRequestLog"> | number
    error?: StringNullableWithAggregatesFilter<"AiRequestLog"> | string | null
    isOrphan?: BoolWithAggregatesFilter<"AiRequestLog"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AiRequestLog"> | Date | string
  }

  export type TrustGraphNodeWhereInput = {
    AND?: TrustGraphNodeWhereInput | TrustGraphNodeWhereInput[]
    OR?: TrustGraphNodeWhereInput[]
    NOT?: TrustGraphNodeWhereInput | TrustGraphNodeWhereInput[]
    id?: StringFilter<"TrustGraphNode"> | string
    sourceType?: StringFilter<"TrustGraphNode"> | string
    sourceId?: StringNullableFilter<"TrustGraphNode"> | string | null
    sourceVersion?: IntNullableFilter<"TrustGraphNode"> | number | null
    label?: StringFilter<"TrustGraphNode"> | string
    metadata?: JsonNullableFilter<"TrustGraphNode">
    riskScore?: FloatNullableFilter<"TrustGraphNode"> | number | null
    riskLevel?: StringNullableFilter<"TrustGraphNode"> | string | null
    lastRiskUpdate?: DateTimeNullableFilter<"TrustGraphNode"> | Date | string | null
    createdAt?: DateTimeFilter<"TrustGraphNode"> | Date | string
    updatedAt?: DateTimeFilter<"TrustGraphNode"> | Date | string
  }

  export type TrustGraphNodeOrderByWithRelationInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    sourceVersion?: SortOrderInput | SortOrder
    label?: SortOrder
    metadata?: SortOrderInput | SortOrder
    riskScore?: SortOrderInput | SortOrder
    riskLevel?: SortOrderInput | SortOrder
    lastRiskUpdate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustGraphNodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sourceType_sourceId?: TrustGraphNodeSourceTypeSourceIdCompoundUniqueInput
    AND?: TrustGraphNodeWhereInput | TrustGraphNodeWhereInput[]
    OR?: TrustGraphNodeWhereInput[]
    NOT?: TrustGraphNodeWhereInput | TrustGraphNodeWhereInput[]
    sourceType?: StringFilter<"TrustGraphNode"> | string
    sourceId?: StringNullableFilter<"TrustGraphNode"> | string | null
    sourceVersion?: IntNullableFilter<"TrustGraphNode"> | number | null
    label?: StringFilter<"TrustGraphNode"> | string
    metadata?: JsonNullableFilter<"TrustGraphNode">
    riskScore?: FloatNullableFilter<"TrustGraphNode"> | number | null
    riskLevel?: StringNullableFilter<"TrustGraphNode"> | string | null
    lastRiskUpdate?: DateTimeNullableFilter<"TrustGraphNode"> | Date | string | null
    createdAt?: DateTimeFilter<"TrustGraphNode"> | Date | string
    updatedAt?: DateTimeFilter<"TrustGraphNode"> | Date | string
  }, "id" | "sourceType_sourceId">

  export type TrustGraphNodeOrderByWithAggregationInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    sourceVersion?: SortOrderInput | SortOrder
    label?: SortOrder
    metadata?: SortOrderInput | SortOrder
    riskScore?: SortOrderInput | SortOrder
    riskLevel?: SortOrderInput | SortOrder
    lastRiskUpdate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrustGraphNodeCountOrderByAggregateInput
    _avg?: TrustGraphNodeAvgOrderByAggregateInput
    _max?: TrustGraphNodeMaxOrderByAggregateInput
    _min?: TrustGraphNodeMinOrderByAggregateInput
    _sum?: TrustGraphNodeSumOrderByAggregateInput
  }

  export type TrustGraphNodeScalarWhereWithAggregatesInput = {
    AND?: TrustGraphNodeScalarWhereWithAggregatesInput | TrustGraphNodeScalarWhereWithAggregatesInput[]
    OR?: TrustGraphNodeScalarWhereWithAggregatesInput[]
    NOT?: TrustGraphNodeScalarWhereWithAggregatesInput | TrustGraphNodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrustGraphNode"> | string
    sourceType?: StringWithAggregatesFilter<"TrustGraphNode"> | string
    sourceId?: StringNullableWithAggregatesFilter<"TrustGraphNode"> | string | null
    sourceVersion?: IntNullableWithAggregatesFilter<"TrustGraphNode"> | number | null
    label?: StringWithAggregatesFilter<"TrustGraphNode"> | string
    metadata?: JsonNullableWithAggregatesFilter<"TrustGraphNode">
    riskScore?: FloatNullableWithAggregatesFilter<"TrustGraphNode"> | number | null
    riskLevel?: StringNullableWithAggregatesFilter<"TrustGraphNode"> | string | null
    lastRiskUpdate?: DateTimeNullableWithAggregatesFilter<"TrustGraphNode"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TrustGraphNode"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrustGraphNode"> | Date | string
  }

  export type TrustGraphEdgeWhereInput = {
    AND?: TrustGraphEdgeWhereInput | TrustGraphEdgeWhereInput[]
    OR?: TrustGraphEdgeWhereInput[]
    NOT?: TrustGraphEdgeWhereInput | TrustGraphEdgeWhereInput[]
    id?: StringFilter<"TrustGraphEdge"> | string
    fromNodeId?: StringFilter<"TrustGraphEdge"> | string
    toNodeId?: StringFilter<"TrustGraphEdge"> | string
    relationType?: StringFilter<"TrustGraphEdge"> | string
    sourceType?: StringNullableFilter<"TrustGraphEdge"> | string | null
    sourceId?: StringNullableFilter<"TrustGraphEdge"> | string | null
    confidence?: FloatFilter<"TrustGraphEdge"> | number
    metadata?: JsonNullableFilter<"TrustGraphEdge">
    createdAt?: DateTimeFilter<"TrustGraphEdge"> | Date | string
  }

  export type TrustGraphEdgeOrderByWithRelationInput = {
    id?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    relationType?: SortOrder
    sourceType?: SortOrderInput | SortOrder
    sourceId?: SortOrderInput | SortOrder
    confidence?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type TrustGraphEdgeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    fromNodeId_toNodeId_relationType?: TrustGraphEdgeFromNodeIdToNodeIdRelationTypeCompoundUniqueInput
    AND?: TrustGraphEdgeWhereInput | TrustGraphEdgeWhereInput[]
    OR?: TrustGraphEdgeWhereInput[]
    NOT?: TrustGraphEdgeWhereInput | TrustGraphEdgeWhereInput[]
    fromNodeId?: StringFilter<"TrustGraphEdge"> | string
    toNodeId?: StringFilter<"TrustGraphEdge"> | string
    relationType?: StringFilter<"TrustGraphEdge"> | string
    sourceType?: StringNullableFilter<"TrustGraphEdge"> | string | null
    sourceId?: StringNullableFilter<"TrustGraphEdge"> | string | null
    confidence?: FloatFilter<"TrustGraphEdge"> | number
    metadata?: JsonNullableFilter<"TrustGraphEdge">
    createdAt?: DateTimeFilter<"TrustGraphEdge"> | Date | string
  }, "id" | "fromNodeId_toNodeId_relationType">

  export type TrustGraphEdgeOrderByWithAggregationInput = {
    id?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    relationType?: SortOrder
    sourceType?: SortOrderInput | SortOrder
    sourceId?: SortOrderInput | SortOrder
    confidence?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TrustGraphEdgeCountOrderByAggregateInput
    _avg?: TrustGraphEdgeAvgOrderByAggregateInput
    _max?: TrustGraphEdgeMaxOrderByAggregateInput
    _min?: TrustGraphEdgeMinOrderByAggregateInput
    _sum?: TrustGraphEdgeSumOrderByAggregateInput
  }

  export type TrustGraphEdgeScalarWhereWithAggregatesInput = {
    AND?: TrustGraphEdgeScalarWhereWithAggregatesInput | TrustGraphEdgeScalarWhereWithAggregatesInput[]
    OR?: TrustGraphEdgeScalarWhereWithAggregatesInput[]
    NOT?: TrustGraphEdgeScalarWhereWithAggregatesInput | TrustGraphEdgeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrustGraphEdge"> | string
    fromNodeId?: StringWithAggregatesFilter<"TrustGraphEdge"> | string
    toNodeId?: StringWithAggregatesFilter<"TrustGraphEdge"> | string
    relationType?: StringWithAggregatesFilter<"TrustGraphEdge"> | string
    sourceType?: StringNullableWithAggregatesFilter<"TrustGraphEdge"> | string | null
    sourceId?: StringNullableWithAggregatesFilter<"TrustGraphEdge"> | string | null
    confidence?: FloatWithAggregatesFilter<"TrustGraphEdge"> | number
    metadata?: JsonNullableWithAggregatesFilter<"TrustGraphEdge">
    createdAt?: DateTimeWithAggregatesFilter<"TrustGraphEdge"> | Date | string
  }

  export type TrustGraphSyncLogWhereInput = {
    AND?: TrustGraphSyncLogWhereInput | TrustGraphSyncLogWhereInput[]
    OR?: TrustGraphSyncLogWhereInput[]
    NOT?: TrustGraphSyncLogWhereInput | TrustGraphSyncLogWhereInput[]
    id?: StringFilter<"TrustGraphSyncLog"> | string
    sourceType?: StringFilter<"TrustGraphSyncLog"> | string
    sourceId?: StringFilter<"TrustGraphSyncLog"> | string
    status?: StringFilter<"TrustGraphSyncLog"> | string
    retryCount?: IntFilter<"TrustGraphSyncLog"> | number
    lastError?: StringNullableFilter<"TrustGraphSyncLog"> | string | null
    lastSyncedAt?: DateTimeNullableFilter<"TrustGraphSyncLog"> | Date | string | null
    createdAt?: DateTimeFilter<"TrustGraphSyncLog"> | Date | string
    updatedAt?: DateTimeFilter<"TrustGraphSyncLog"> | Date | string
  }

  export type TrustGraphSyncLogOrderByWithRelationInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    lastError?: SortOrderInput | SortOrder
    lastSyncedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustGraphSyncLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sourceType_sourceId?: TrustGraphSyncLogSourceTypeSourceIdCompoundUniqueInput
    AND?: TrustGraphSyncLogWhereInput | TrustGraphSyncLogWhereInput[]
    OR?: TrustGraphSyncLogWhereInput[]
    NOT?: TrustGraphSyncLogWhereInput | TrustGraphSyncLogWhereInput[]
    sourceType?: StringFilter<"TrustGraphSyncLog"> | string
    sourceId?: StringFilter<"TrustGraphSyncLog"> | string
    status?: StringFilter<"TrustGraphSyncLog"> | string
    retryCount?: IntFilter<"TrustGraphSyncLog"> | number
    lastError?: StringNullableFilter<"TrustGraphSyncLog"> | string | null
    lastSyncedAt?: DateTimeNullableFilter<"TrustGraphSyncLog"> | Date | string | null
    createdAt?: DateTimeFilter<"TrustGraphSyncLog"> | Date | string
    updatedAt?: DateTimeFilter<"TrustGraphSyncLog"> | Date | string
  }, "id" | "sourceType_sourceId">

  export type TrustGraphSyncLogOrderByWithAggregationInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    lastError?: SortOrderInput | SortOrder
    lastSyncedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrustGraphSyncLogCountOrderByAggregateInput
    _avg?: TrustGraphSyncLogAvgOrderByAggregateInput
    _max?: TrustGraphSyncLogMaxOrderByAggregateInput
    _min?: TrustGraphSyncLogMinOrderByAggregateInput
    _sum?: TrustGraphSyncLogSumOrderByAggregateInput
  }

  export type TrustGraphSyncLogScalarWhereWithAggregatesInput = {
    AND?: TrustGraphSyncLogScalarWhereWithAggregatesInput | TrustGraphSyncLogScalarWhereWithAggregatesInput[]
    OR?: TrustGraphSyncLogScalarWhereWithAggregatesInput[]
    NOT?: TrustGraphSyncLogScalarWhereWithAggregatesInput | TrustGraphSyncLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrustGraphSyncLog"> | string
    sourceType?: StringWithAggregatesFilter<"TrustGraphSyncLog"> | string
    sourceId?: StringWithAggregatesFilter<"TrustGraphSyncLog"> | string
    status?: StringWithAggregatesFilter<"TrustGraphSyncLog"> | string
    retryCount?: IntWithAggregatesFilter<"TrustGraphSyncLog"> | number
    lastError?: StringNullableWithAggregatesFilter<"TrustGraphSyncLog"> | string | null
    lastSyncedAt?: DateTimeNullableWithAggregatesFilter<"TrustGraphSyncLog"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TrustGraphSyncLog"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrustGraphSyncLog"> | Date | string
  }

  export type AuditConsistencyCheckLogWhereInput = {
    AND?: AuditConsistencyCheckLogWhereInput | AuditConsistencyCheckLogWhereInput[]
    OR?: AuditConsistencyCheckLogWhereInput[]
    NOT?: AuditConsistencyCheckLogWhereInput | AuditConsistencyCheckLogWhereInput[]
    id?: StringFilter<"AuditConsistencyCheckLog"> | string
    checkType?: StringFilter<"AuditConsistencyCheckLog"> | string
    targetType?: StringFilter<"AuditConsistencyCheckLog"> | string
    targetId?: StringFilter<"AuditConsistencyCheckLog"> | string
    issueDetails?: StringFilter<"AuditConsistencyCheckLog"> | string
    severity?: StringFilter<"AuditConsistencyCheckLog"> | string
    status?: StringFilter<"AuditConsistencyCheckLog"> | string
    jobId?: StringNullableFilter<"AuditConsistencyCheckLog"> | string | null
    handlerId?: StringNullableFilter<"AuditConsistencyCheckLog"> | string | null
    handledAt?: DateTimeNullableFilter<"AuditConsistencyCheckLog"> | Date | string | null
    createdAt?: DateTimeFilter<"AuditConsistencyCheckLog"> | Date | string
    updatedAt?: DateTimeFilter<"AuditConsistencyCheckLog"> | Date | string
  }

  export type AuditConsistencyCheckLogOrderByWithRelationInput = {
    id?: SortOrder
    checkType?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    issueDetails?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    jobId?: SortOrderInput | SortOrder
    handlerId?: SortOrderInput | SortOrder
    handledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditConsistencyCheckLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditConsistencyCheckLogWhereInput | AuditConsistencyCheckLogWhereInput[]
    OR?: AuditConsistencyCheckLogWhereInput[]
    NOT?: AuditConsistencyCheckLogWhereInput | AuditConsistencyCheckLogWhereInput[]
    checkType?: StringFilter<"AuditConsistencyCheckLog"> | string
    targetType?: StringFilter<"AuditConsistencyCheckLog"> | string
    targetId?: StringFilter<"AuditConsistencyCheckLog"> | string
    issueDetails?: StringFilter<"AuditConsistencyCheckLog"> | string
    severity?: StringFilter<"AuditConsistencyCheckLog"> | string
    status?: StringFilter<"AuditConsistencyCheckLog"> | string
    jobId?: StringNullableFilter<"AuditConsistencyCheckLog"> | string | null
    handlerId?: StringNullableFilter<"AuditConsistencyCheckLog"> | string | null
    handledAt?: DateTimeNullableFilter<"AuditConsistencyCheckLog"> | Date | string | null
    createdAt?: DateTimeFilter<"AuditConsistencyCheckLog"> | Date | string
    updatedAt?: DateTimeFilter<"AuditConsistencyCheckLog"> | Date | string
  }, "id">

  export type AuditConsistencyCheckLogOrderByWithAggregationInput = {
    id?: SortOrder
    checkType?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    issueDetails?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    jobId?: SortOrderInput | SortOrder
    handlerId?: SortOrderInput | SortOrder
    handledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuditConsistencyCheckLogCountOrderByAggregateInput
    _max?: AuditConsistencyCheckLogMaxOrderByAggregateInput
    _min?: AuditConsistencyCheckLogMinOrderByAggregateInput
  }

  export type AuditConsistencyCheckLogScalarWhereWithAggregatesInput = {
    AND?: AuditConsistencyCheckLogScalarWhereWithAggregatesInput | AuditConsistencyCheckLogScalarWhereWithAggregatesInput[]
    OR?: AuditConsistencyCheckLogScalarWhereWithAggregatesInput[]
    NOT?: AuditConsistencyCheckLogScalarWhereWithAggregatesInput | AuditConsistencyCheckLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditConsistencyCheckLog"> | string
    checkType?: StringWithAggregatesFilter<"AuditConsistencyCheckLog"> | string
    targetType?: StringWithAggregatesFilter<"AuditConsistencyCheckLog"> | string
    targetId?: StringWithAggregatesFilter<"AuditConsistencyCheckLog"> | string
    issueDetails?: StringWithAggregatesFilter<"AuditConsistencyCheckLog"> | string
    severity?: StringWithAggregatesFilter<"AuditConsistencyCheckLog"> | string
    status?: StringWithAggregatesFilter<"AuditConsistencyCheckLog"> | string
    jobId?: StringNullableWithAggregatesFilter<"AuditConsistencyCheckLog"> | string | null
    handlerId?: StringNullableWithAggregatesFilter<"AuditConsistencyCheckLog"> | string | null
    handledAt?: DateTimeNullableWithAggregatesFilter<"AuditConsistencyCheckLog"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditConsistencyCheckLog"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuditConsistencyCheckLog"> | Date | string
  }

  export type GraphConsistencyLogWhereInput = {
    AND?: GraphConsistencyLogWhereInput | GraphConsistencyLogWhereInput[]
    OR?: GraphConsistencyLogWhereInput[]
    NOT?: GraphConsistencyLogWhereInput | GraphConsistencyLogWhereInput[]
    id?: StringFilter<"GraphConsistencyLog"> | string
    nodeOrEdgeId?: StringNullableFilter<"GraphConsistencyLog"> | string | null
    sourceType?: StringFilter<"GraphConsistencyLog"> | string
    sourceId?: StringFilter<"GraphConsistencyLog"> | string
    issueType?: StringFilter<"GraphConsistencyLog"> | string
    expectedVersion?: IntNullableFilter<"GraphConsistencyLog"> | number | null
    actualVersion?: IntNullableFilter<"GraphConsistencyLog"> | number | null
    details?: StringNullableFilter<"GraphConsistencyLog"> | string | null
    status?: StringFilter<"GraphConsistencyLog"> | string
    jobId?: StringNullableFilter<"GraphConsistencyLog"> | string | null
    handlerId?: StringNullableFilter<"GraphConsistencyLog"> | string | null
    handledAt?: DateTimeNullableFilter<"GraphConsistencyLog"> | Date | string | null
    createdAt?: DateTimeFilter<"GraphConsistencyLog"> | Date | string
  }

  export type GraphConsistencyLogOrderByWithRelationInput = {
    id?: SortOrder
    nodeOrEdgeId?: SortOrderInput | SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    issueType?: SortOrder
    expectedVersion?: SortOrderInput | SortOrder
    actualVersion?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    status?: SortOrder
    jobId?: SortOrderInput | SortOrder
    handlerId?: SortOrderInput | SortOrder
    handledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type GraphConsistencyLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GraphConsistencyLogWhereInput | GraphConsistencyLogWhereInput[]
    OR?: GraphConsistencyLogWhereInput[]
    NOT?: GraphConsistencyLogWhereInput | GraphConsistencyLogWhereInput[]
    nodeOrEdgeId?: StringNullableFilter<"GraphConsistencyLog"> | string | null
    sourceType?: StringFilter<"GraphConsistencyLog"> | string
    sourceId?: StringFilter<"GraphConsistencyLog"> | string
    issueType?: StringFilter<"GraphConsistencyLog"> | string
    expectedVersion?: IntNullableFilter<"GraphConsistencyLog"> | number | null
    actualVersion?: IntNullableFilter<"GraphConsistencyLog"> | number | null
    details?: StringNullableFilter<"GraphConsistencyLog"> | string | null
    status?: StringFilter<"GraphConsistencyLog"> | string
    jobId?: StringNullableFilter<"GraphConsistencyLog"> | string | null
    handlerId?: StringNullableFilter<"GraphConsistencyLog"> | string | null
    handledAt?: DateTimeNullableFilter<"GraphConsistencyLog"> | Date | string | null
    createdAt?: DateTimeFilter<"GraphConsistencyLog"> | Date | string
  }, "id">

  export type GraphConsistencyLogOrderByWithAggregationInput = {
    id?: SortOrder
    nodeOrEdgeId?: SortOrderInput | SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    issueType?: SortOrder
    expectedVersion?: SortOrderInput | SortOrder
    actualVersion?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    status?: SortOrder
    jobId?: SortOrderInput | SortOrder
    handlerId?: SortOrderInput | SortOrder
    handledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GraphConsistencyLogCountOrderByAggregateInput
    _avg?: GraphConsistencyLogAvgOrderByAggregateInput
    _max?: GraphConsistencyLogMaxOrderByAggregateInput
    _min?: GraphConsistencyLogMinOrderByAggregateInput
    _sum?: GraphConsistencyLogSumOrderByAggregateInput
  }

  export type GraphConsistencyLogScalarWhereWithAggregatesInput = {
    AND?: GraphConsistencyLogScalarWhereWithAggregatesInput | GraphConsistencyLogScalarWhereWithAggregatesInput[]
    OR?: GraphConsistencyLogScalarWhereWithAggregatesInput[]
    NOT?: GraphConsistencyLogScalarWhereWithAggregatesInput | GraphConsistencyLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GraphConsistencyLog"> | string
    nodeOrEdgeId?: StringNullableWithAggregatesFilter<"GraphConsistencyLog"> | string | null
    sourceType?: StringWithAggregatesFilter<"GraphConsistencyLog"> | string
    sourceId?: StringWithAggregatesFilter<"GraphConsistencyLog"> | string
    issueType?: StringWithAggregatesFilter<"GraphConsistencyLog"> | string
    expectedVersion?: IntNullableWithAggregatesFilter<"GraphConsistencyLog"> | number | null
    actualVersion?: IntNullableWithAggregatesFilter<"GraphConsistencyLog"> | number | null
    details?: StringNullableWithAggregatesFilter<"GraphConsistencyLog"> | string | null
    status?: StringWithAggregatesFilter<"GraphConsistencyLog"> | string
    jobId?: StringNullableWithAggregatesFilter<"GraphConsistencyLog"> | string | null
    handlerId?: StringNullableWithAggregatesFilter<"GraphConsistencyLog"> | string | null
    handledAt?: DateTimeNullableWithAggregatesFilter<"GraphConsistencyLog"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GraphConsistencyLog"> | Date | string
  }

  export type IntegrityJobLogWhereInput = {
    AND?: IntegrityJobLogWhereInput | IntegrityJobLogWhereInput[]
    OR?: IntegrityJobLogWhereInput[]
    NOT?: IntegrityJobLogWhereInput | IntegrityJobLogWhereInput[]
    id?: StringFilter<"IntegrityJobLog"> | string
    jobType?: StringFilter<"IntegrityJobLog"> | string
    startedAt?: DateTimeFilter<"IntegrityJobLog"> | Date | string
    endedAt?: DateTimeFilter<"IntegrityJobLog"> | Date | string
    totalRecordsChecked?: IntFilter<"IntegrityJobLog"> | number
    totalIssuesFound?: IntFilter<"IntegrityJobLog"> | number
    status?: StringFilter<"IntegrityJobLog"> | string
    reportSummary?: JsonNullableFilter<"IntegrityJobLog">
  }

  export type IntegrityJobLogOrderByWithRelationInput = {
    id?: SortOrder
    jobType?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    totalRecordsChecked?: SortOrder
    totalIssuesFound?: SortOrder
    status?: SortOrder
    reportSummary?: SortOrderInput | SortOrder
  }

  export type IntegrityJobLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IntegrityJobLogWhereInput | IntegrityJobLogWhereInput[]
    OR?: IntegrityJobLogWhereInput[]
    NOT?: IntegrityJobLogWhereInput | IntegrityJobLogWhereInput[]
    jobType?: StringFilter<"IntegrityJobLog"> | string
    startedAt?: DateTimeFilter<"IntegrityJobLog"> | Date | string
    endedAt?: DateTimeFilter<"IntegrityJobLog"> | Date | string
    totalRecordsChecked?: IntFilter<"IntegrityJobLog"> | number
    totalIssuesFound?: IntFilter<"IntegrityJobLog"> | number
    status?: StringFilter<"IntegrityJobLog"> | string
    reportSummary?: JsonNullableFilter<"IntegrityJobLog">
  }, "id">

  export type IntegrityJobLogOrderByWithAggregationInput = {
    id?: SortOrder
    jobType?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    totalRecordsChecked?: SortOrder
    totalIssuesFound?: SortOrder
    status?: SortOrder
    reportSummary?: SortOrderInput | SortOrder
    _count?: IntegrityJobLogCountOrderByAggregateInput
    _avg?: IntegrityJobLogAvgOrderByAggregateInput
    _max?: IntegrityJobLogMaxOrderByAggregateInput
    _min?: IntegrityJobLogMinOrderByAggregateInput
    _sum?: IntegrityJobLogSumOrderByAggregateInput
  }

  export type IntegrityJobLogScalarWhereWithAggregatesInput = {
    AND?: IntegrityJobLogScalarWhereWithAggregatesInput | IntegrityJobLogScalarWhereWithAggregatesInput[]
    OR?: IntegrityJobLogScalarWhereWithAggregatesInput[]
    NOT?: IntegrityJobLogScalarWhereWithAggregatesInput | IntegrityJobLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IntegrityJobLog"> | string
    jobType?: StringWithAggregatesFilter<"IntegrityJobLog"> | string
    startedAt?: DateTimeWithAggregatesFilter<"IntegrityJobLog"> | Date | string
    endedAt?: DateTimeWithAggregatesFilter<"IntegrityJobLog"> | Date | string
    totalRecordsChecked?: IntWithAggregatesFilter<"IntegrityJobLog"> | number
    totalIssuesFound?: IntWithAggregatesFilter<"IntegrityJobLog"> | number
    status?: StringWithAggregatesFilter<"IntegrityJobLog"> | string
    reportSummary?: JsonNullableWithAggregatesFilter<"IntegrityJobLog">
  }

  export type AiRiskReportWhereInput = {
    AND?: AiRiskReportWhereInput | AiRiskReportWhereInput[]
    OR?: AiRiskReportWhereInput[]
    NOT?: AiRiskReportWhereInput | AiRiskReportWhereInput[]
    id?: StringFilter<"AiRiskReport"> | string
    reportType?: StringFilter<"AiRiskReport"> | string
    targetId?: StringFilter<"AiRiskReport"> | string
    title?: StringFilter<"AiRiskReport"> | string
    content?: JsonFilter<"AiRiskReport">
    confidence?: FloatFilter<"AiRiskReport"> | number
    status?: StringFilter<"AiRiskReport"> | string
    reviewedBy?: StringNullableFilter<"AiRiskReport"> | string | null
    aiModel?: StringFilter<"AiRiskReport"> | string
    promptVersion?: StringFilter<"AiRiskReport"> | string
    createdAt?: DateTimeFilter<"AiRiskReport"> | Date | string
    updatedAt?: DateTimeFilter<"AiRiskReport"> | Date | string
  }

  export type AiRiskReportOrderByWithRelationInput = {
    id?: SortOrder
    reportType?: SortOrder
    targetId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    aiModel?: SortOrder
    promptVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiRiskReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiRiskReportWhereInput | AiRiskReportWhereInput[]
    OR?: AiRiskReportWhereInput[]
    NOT?: AiRiskReportWhereInput | AiRiskReportWhereInput[]
    reportType?: StringFilter<"AiRiskReport"> | string
    targetId?: StringFilter<"AiRiskReport"> | string
    title?: StringFilter<"AiRiskReport"> | string
    content?: JsonFilter<"AiRiskReport">
    confidence?: FloatFilter<"AiRiskReport"> | number
    status?: StringFilter<"AiRiskReport"> | string
    reviewedBy?: StringNullableFilter<"AiRiskReport"> | string | null
    aiModel?: StringFilter<"AiRiskReport"> | string
    promptVersion?: StringFilter<"AiRiskReport"> | string
    createdAt?: DateTimeFilter<"AiRiskReport"> | Date | string
    updatedAt?: DateTimeFilter<"AiRiskReport"> | Date | string
  }, "id">

  export type AiRiskReportOrderByWithAggregationInput = {
    id?: SortOrder
    reportType?: SortOrder
    targetId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    aiModel?: SortOrder
    promptVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiRiskReportCountOrderByAggregateInput
    _avg?: AiRiskReportAvgOrderByAggregateInput
    _max?: AiRiskReportMaxOrderByAggregateInput
    _min?: AiRiskReportMinOrderByAggregateInput
    _sum?: AiRiskReportSumOrderByAggregateInput
  }

  export type AiRiskReportScalarWhereWithAggregatesInput = {
    AND?: AiRiskReportScalarWhereWithAggregatesInput | AiRiskReportScalarWhereWithAggregatesInput[]
    OR?: AiRiskReportScalarWhereWithAggregatesInput[]
    NOT?: AiRiskReportScalarWhereWithAggregatesInput | AiRiskReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiRiskReport"> | string
    reportType?: StringWithAggregatesFilter<"AiRiskReport"> | string
    targetId?: StringWithAggregatesFilter<"AiRiskReport"> | string
    title?: StringWithAggregatesFilter<"AiRiskReport"> | string
    content?: JsonWithAggregatesFilter<"AiRiskReport">
    confidence?: FloatWithAggregatesFilter<"AiRiskReport"> | number
    status?: StringWithAggregatesFilter<"AiRiskReport"> | string
    reviewedBy?: StringNullableWithAggregatesFilter<"AiRiskReport"> | string | null
    aiModel?: StringWithAggregatesFilter<"AiRiskReport"> | string
    promptVersion?: StringWithAggregatesFilter<"AiRiskReport"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AiRiskReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiRiskReport"> | Date | string
  }

  export type AiReportAuditWhereInput = {
    AND?: AiReportAuditWhereInput | AiReportAuditWhereInput[]
    OR?: AiReportAuditWhereInput[]
    NOT?: AiReportAuditWhereInput | AiReportAuditWhereInput[]
    id?: StringFilter<"AiReportAudit"> | string
    reportId?: StringFilter<"AiReportAudit"> | string
    reviewerId?: StringFilter<"AiReportAudit"> | string
    action?: StringFilter<"AiReportAudit"> | string
    previousContent?: JsonNullableFilter<"AiReportAudit">
    newContent?: JsonNullableFilter<"AiReportAudit">
    comment?: StringNullableFilter<"AiReportAudit"> | string | null
    createdAt?: DateTimeFilter<"AiReportAudit"> | Date | string
  }

  export type AiReportAuditOrderByWithRelationInput = {
    id?: SortOrder
    reportId?: SortOrder
    reviewerId?: SortOrder
    action?: SortOrder
    previousContent?: SortOrderInput | SortOrder
    newContent?: SortOrderInput | SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AiReportAuditWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiReportAuditWhereInput | AiReportAuditWhereInput[]
    OR?: AiReportAuditWhereInput[]
    NOT?: AiReportAuditWhereInput | AiReportAuditWhereInput[]
    reportId?: StringFilter<"AiReportAudit"> | string
    reviewerId?: StringFilter<"AiReportAudit"> | string
    action?: StringFilter<"AiReportAudit"> | string
    previousContent?: JsonNullableFilter<"AiReportAudit">
    newContent?: JsonNullableFilter<"AiReportAudit">
    comment?: StringNullableFilter<"AiReportAudit"> | string | null
    createdAt?: DateTimeFilter<"AiReportAudit"> | Date | string
  }, "id">

  export type AiReportAuditOrderByWithAggregationInput = {
    id?: SortOrder
    reportId?: SortOrder
    reviewerId?: SortOrder
    action?: SortOrder
    previousContent?: SortOrderInput | SortOrder
    newContent?: SortOrderInput | SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AiReportAuditCountOrderByAggregateInput
    _max?: AiReportAuditMaxOrderByAggregateInput
    _min?: AiReportAuditMinOrderByAggregateInput
  }

  export type AiReportAuditScalarWhereWithAggregatesInput = {
    AND?: AiReportAuditScalarWhereWithAggregatesInput | AiReportAuditScalarWhereWithAggregatesInput[]
    OR?: AiReportAuditScalarWhereWithAggregatesInput[]
    NOT?: AiReportAuditScalarWhereWithAggregatesInput | AiReportAuditScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiReportAudit"> | string
    reportId?: StringWithAggregatesFilter<"AiReportAudit"> | string
    reviewerId?: StringWithAggregatesFilter<"AiReportAudit"> | string
    action?: StringWithAggregatesFilter<"AiReportAudit"> | string
    previousContent?: JsonNullableWithAggregatesFilter<"AiReportAudit">
    newContent?: JsonNullableWithAggregatesFilter<"AiReportAudit">
    comment?: StringNullableWithAggregatesFilter<"AiReportAudit"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiReportAudit"> | Date | string
  }

  export type PredictiveAlertWhereInput = {
    AND?: PredictiveAlertWhereInput | PredictiveAlertWhereInput[]
    OR?: PredictiveAlertWhereInput[]
    NOT?: PredictiveAlertWhereInput | PredictiveAlertWhereInput[]
    id?: StringFilter<"PredictiveAlert"> | string
    targetId?: StringFilter<"PredictiveAlert"> | string
    probability?: FloatFilter<"PredictiveAlert"> | number
    recommendation?: StringFilter<"PredictiveAlert"> | string
    reasoning?: JsonNullableFilter<"PredictiveAlert">
    status?: StringFilter<"PredictiveAlert"> | string
    reviewedBy?: StringNullableFilter<"PredictiveAlert"> | string | null
    createdAt?: DateTimeFilter<"PredictiveAlert"> | Date | string
    updatedAt?: DateTimeFilter<"PredictiveAlert"> | Date | string
  }

  export type PredictiveAlertOrderByWithRelationInput = {
    id?: SortOrder
    targetId?: SortOrder
    probability?: SortOrder
    recommendation?: SortOrder
    reasoning?: SortOrderInput | SortOrder
    status?: SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PredictiveAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PredictiveAlertWhereInput | PredictiveAlertWhereInput[]
    OR?: PredictiveAlertWhereInput[]
    NOT?: PredictiveAlertWhereInput | PredictiveAlertWhereInput[]
    targetId?: StringFilter<"PredictiveAlert"> | string
    probability?: FloatFilter<"PredictiveAlert"> | number
    recommendation?: StringFilter<"PredictiveAlert"> | string
    reasoning?: JsonNullableFilter<"PredictiveAlert">
    status?: StringFilter<"PredictiveAlert"> | string
    reviewedBy?: StringNullableFilter<"PredictiveAlert"> | string | null
    createdAt?: DateTimeFilter<"PredictiveAlert"> | Date | string
    updatedAt?: DateTimeFilter<"PredictiveAlert"> | Date | string
  }, "id">

  export type PredictiveAlertOrderByWithAggregationInput = {
    id?: SortOrder
    targetId?: SortOrder
    probability?: SortOrder
    recommendation?: SortOrder
    reasoning?: SortOrderInput | SortOrder
    status?: SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PredictiveAlertCountOrderByAggregateInput
    _avg?: PredictiveAlertAvgOrderByAggregateInput
    _max?: PredictiveAlertMaxOrderByAggregateInput
    _min?: PredictiveAlertMinOrderByAggregateInput
    _sum?: PredictiveAlertSumOrderByAggregateInput
  }

  export type PredictiveAlertScalarWhereWithAggregatesInput = {
    AND?: PredictiveAlertScalarWhereWithAggregatesInput | PredictiveAlertScalarWhereWithAggregatesInput[]
    OR?: PredictiveAlertScalarWhereWithAggregatesInput[]
    NOT?: PredictiveAlertScalarWhereWithAggregatesInput | PredictiveAlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PredictiveAlert"> | string
    targetId?: StringWithAggregatesFilter<"PredictiveAlert"> | string
    probability?: FloatWithAggregatesFilter<"PredictiveAlert"> | number
    recommendation?: StringWithAggregatesFilter<"PredictiveAlert"> | string
    reasoning?: JsonNullableWithAggregatesFilter<"PredictiveAlert">
    status?: StringWithAggregatesFilter<"PredictiveAlert"> | string
    reviewedBy?: StringNullableWithAggregatesFilter<"PredictiveAlert"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PredictiveAlert"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PredictiveAlert"> | Date | string
  }

  export type RiskScoreHistoryWhereInput = {
    AND?: RiskScoreHistoryWhereInput | RiskScoreHistoryWhereInput[]
    OR?: RiskScoreHistoryWhereInput[]
    NOT?: RiskScoreHistoryWhereInput | RiskScoreHistoryWhereInput[]
    id?: StringFilter<"RiskScoreHistory"> | string
    nodeId?: StringFilter<"RiskScoreHistory"> | string
    score?: FloatFilter<"RiskScoreHistory"> | number
    level?: StringFilter<"RiskScoreHistory"> | string
    factors?: JsonNullableFilter<"RiskScoreHistory">
    createdAt?: DateTimeFilter<"RiskScoreHistory"> | Date | string
  }

  export type RiskScoreHistoryOrderByWithRelationInput = {
    id?: SortOrder
    nodeId?: SortOrder
    score?: SortOrder
    level?: SortOrder
    factors?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type RiskScoreHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RiskScoreHistoryWhereInput | RiskScoreHistoryWhereInput[]
    OR?: RiskScoreHistoryWhereInput[]
    NOT?: RiskScoreHistoryWhereInput | RiskScoreHistoryWhereInput[]
    nodeId?: StringFilter<"RiskScoreHistory"> | string
    score?: FloatFilter<"RiskScoreHistory"> | number
    level?: StringFilter<"RiskScoreHistory"> | string
    factors?: JsonNullableFilter<"RiskScoreHistory">
    createdAt?: DateTimeFilter<"RiskScoreHistory"> | Date | string
  }, "id">

  export type RiskScoreHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    nodeId?: SortOrder
    score?: SortOrder
    level?: SortOrder
    factors?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RiskScoreHistoryCountOrderByAggregateInput
    _avg?: RiskScoreHistoryAvgOrderByAggregateInput
    _max?: RiskScoreHistoryMaxOrderByAggregateInput
    _min?: RiskScoreHistoryMinOrderByAggregateInput
    _sum?: RiskScoreHistorySumOrderByAggregateInput
  }

  export type RiskScoreHistoryScalarWhereWithAggregatesInput = {
    AND?: RiskScoreHistoryScalarWhereWithAggregatesInput | RiskScoreHistoryScalarWhereWithAggregatesInput[]
    OR?: RiskScoreHistoryScalarWhereWithAggregatesInput[]
    NOT?: RiskScoreHistoryScalarWhereWithAggregatesInput | RiskScoreHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RiskScoreHistory"> | string
    nodeId?: StringWithAggregatesFilter<"RiskScoreHistory"> | string
    score?: FloatWithAggregatesFilter<"RiskScoreHistory"> | number
    level?: StringWithAggregatesFilter<"RiskScoreHistory"> | string
    factors?: JsonNullableWithAggregatesFilter<"RiskScoreHistory">
    createdAt?: DateTimeWithAggregatesFilter<"RiskScoreHistory"> | Date | string
  }

  export type AiAgentCreateInput = {
    id?: string
    name: string
    subsystem: string
    systemPrompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiAgentUncheckedCreateInput = {
    id?: string
    name: string
    subsystem: string
    systemPrompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiAgentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiAgentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiAgentCreateManyInput = {
    id?: string
    name: string
    subsystem: string
    systemPrompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiAgentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiAgentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiKnowledgeSnippetCreateInput = {
    id?: string
    content: string
    source: string
    tags?: AiKnowledgeSnippetCreatetagsInput | string[]
    createdAt?: Date | string
    agentId?: string | null
  }

  export type AiKnowledgeSnippetUncheckedCreateInput = {
    id?: string
    content: string
    source: string
    tags?: AiKnowledgeSnippetCreatetagsInput | string[]
    createdAt?: Date | string
    agentId?: string | null
  }

  export type AiKnowledgeSnippetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    tags?: AiKnowledgeSnippetUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AiKnowledgeSnippetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    tags?: AiKnowledgeSnippetUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AiKnowledgeSnippetCreateManyInput = {
    id?: string
    content: string
    source: string
    tags?: AiKnowledgeSnippetCreatetagsInput | string[]
    createdAt?: Date | string
    agentId?: string | null
  }

  export type AiKnowledgeSnippetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    tags?: AiKnowledgeSnippetUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AiKnowledgeSnippetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    tags?: AiKnowledgeSnippetUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AiConversationCreateInput = {
    id?: string
    title?: string | null
    userId: string
    agentId?: string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: AiConversationMessageCreateNestedManyWithoutConversationInput
  }

  export type AiConversationUncheckedCreateInput = {
    id?: string
    title?: string | null
    userId: string
    agentId?: string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: AiConversationMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type AiConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: AiConversationMessageUpdateManyWithoutConversationNestedInput
  }

  export type AiConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: AiConversationMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type AiConversationCreateManyInput = {
    id?: string
    title?: string | null
    userId: string
    agentId?: string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationMessageCreateInput = {
    id?: string
    role: string
    content: string
    source?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    conversation: AiConversationCreateNestedOneWithoutMessagesInput
  }

  export type AiConversationMessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    role: string
    content: string
    source?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiConversationMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: AiConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type AiConversationMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationMessageCreateManyInput = {
    id?: string
    conversationId: string
    role: string
    content: string
    source?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiConversationMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiInsightCreateInput = {
    id?: string
    category: string
    title: string
    content: string
    severity?: string
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AiInsightUncheckedCreateInput = {
    id?: string
    category: string
    title: string
    content: string
    severity?: string
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AiInsightUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiInsightUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiInsightCreateManyInput = {
    id?: string
    category: string
    title: string
    content: string
    severity?: string
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AiInsightUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiInsightUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiSyncLogCreateInput = {
    id?: string
    syncType: string
    recordsSynced?: number
    recordsFailed?: number
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiSyncLogUncheckedCreateInput = {
    id?: string
    syncType: string
    recordsSynced?: number
    recordsFailed?: number
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiSyncLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    syncType?: StringFieldUpdateOperationsInput | string
    recordsSynced?: IntFieldUpdateOperationsInput | number
    recordsFailed?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiSyncLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    syncType?: StringFieldUpdateOperationsInput | string
    recordsSynced?: IntFieldUpdateOperationsInput | number
    recordsFailed?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiSyncLogCreateManyInput = {
    id?: string
    syncType: string
    recordsSynced?: number
    recordsFailed?: number
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiSyncLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    syncType?: StringFieldUpdateOperationsInput | string
    recordsSynced?: IntFieldUpdateOperationsInput | number
    recordsFailed?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiSyncLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    syncType?: StringFieldUpdateOperationsInput | string
    recordsSynced?: IntFieldUpdateOperationsInput | number
    recordsFailed?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiVerificationLogCreateInput = {
    id?: string
    targetId: string
    targetType: string
    targetDisplayCode?: string | null
    targetVersion?: number | null
    sourceModule: string
    aiProposedContent: JsonNullValueInput | InputJsonValue
    finalContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    riskLevel?: string
    requiredRole?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    modelVersion?: string | null
    isOrphan?: boolean
    createdAt?: Date | string
  }

  export type AiVerificationLogUncheckedCreateInput = {
    id?: string
    targetId: string
    targetType: string
    targetDisplayCode?: string | null
    targetVersion?: number | null
    sourceModule: string
    aiProposedContent: JsonNullValueInput | InputJsonValue
    finalContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    riskLevel?: string
    requiredRole?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    modelVersion?: string | null
    isOrphan?: boolean
    createdAt?: Date | string
  }

  export type AiVerificationLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetDisplayCode?: NullableStringFieldUpdateOperationsInput | string | null
    targetVersion?: NullableIntFieldUpdateOperationsInput | number | null
    sourceModule?: StringFieldUpdateOperationsInput | string
    aiProposedContent?: JsonNullValueInput | InputJsonValue
    finalContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    riskLevel?: StringFieldUpdateOperationsInput | string
    requiredRole?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    modelVersion?: NullableStringFieldUpdateOperationsInput | string | null
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiVerificationLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetDisplayCode?: NullableStringFieldUpdateOperationsInput | string | null
    targetVersion?: NullableIntFieldUpdateOperationsInput | number | null
    sourceModule?: StringFieldUpdateOperationsInput | string
    aiProposedContent?: JsonNullValueInput | InputJsonValue
    finalContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    riskLevel?: StringFieldUpdateOperationsInput | string
    requiredRole?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    modelVersion?: NullableStringFieldUpdateOperationsInput | string | null
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiVerificationLogCreateManyInput = {
    id?: string
    targetId: string
    targetType: string
    targetDisplayCode?: string | null
    targetVersion?: number | null
    sourceModule: string
    aiProposedContent: JsonNullValueInput | InputJsonValue
    finalContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    riskLevel?: string
    requiredRole?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    modelVersion?: string | null
    isOrphan?: boolean
    createdAt?: Date | string
  }

  export type AiVerificationLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetDisplayCode?: NullableStringFieldUpdateOperationsInput | string | null
    targetVersion?: NullableIntFieldUpdateOperationsInput | number | null
    sourceModule?: StringFieldUpdateOperationsInput | string
    aiProposedContent?: JsonNullValueInput | InputJsonValue
    finalContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    riskLevel?: StringFieldUpdateOperationsInput | string
    requiredRole?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    modelVersion?: NullableStringFieldUpdateOperationsInput | string | null
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiVerificationLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetDisplayCode?: NullableStringFieldUpdateOperationsInput | string | null
    targetVersion?: NullableIntFieldUpdateOperationsInput | number | null
    sourceModule?: StringFieldUpdateOperationsInput | string
    aiProposedContent?: JsonNullValueInput | InputJsonValue
    finalContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    riskLevel?: StringFieldUpdateOperationsInput | string
    requiredRole?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    modelVersion?: NullableStringFieldUpdateOperationsInput | string | null
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiSafetyLogCreateInput = {
    id?: string
    timestamp?: Date | string
    eventId: string
    userId: string
    targetType?: string | null
    targetId?: string | null
    action: string
    riskLevel: string
    details: string
    isImmutable?: boolean
    isOrphan?: boolean
  }

  export type AiSafetyLogUncheckedCreateInput = {
    id?: string
    timestamp?: Date | string
    eventId: string
    userId: string
    targetType?: string | null
    targetId?: string | null
    action: string
    riskLevel: string
    details: string
    isImmutable?: boolean
    isOrphan?: boolean
  }

  export type AiSafetyLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    riskLevel?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    isImmutable?: BoolFieldUpdateOperationsInput | boolean
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AiSafetyLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    riskLevel?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    isImmutable?: BoolFieldUpdateOperationsInput | boolean
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AiSafetyLogCreateManyInput = {
    id?: string
    timestamp?: Date | string
    eventId: string
    userId: string
    targetType?: string | null
    targetId?: string | null
    action: string
    riskLevel: string
    details: string
    isImmutable?: boolean
    isOrphan?: boolean
  }

  export type AiSafetyLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    riskLevel?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    isImmutable?: BoolFieldUpdateOperationsInput | boolean
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AiSafetyLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    riskLevel?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    isImmutable?: BoolFieldUpdateOperationsInput | boolean
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AiRequestLogCreateInput = {
    id?: string
    userId: string
    targetType?: string | null
    targetId?: string | null
    modelName: string
    promptTokens?: number
    completionTokens?: number
    latencyMs?: number
    status: number
    error?: string | null
    isOrphan?: boolean
    createdAt?: Date | string
  }

  export type AiRequestLogUncheckedCreateInput = {
    id?: string
    userId: string
    targetType?: string | null
    targetId?: string | null
    modelName: string
    promptTokens?: number
    completionTokens?: number
    latencyMs?: number
    status: number
    error?: string | null
    isOrphan?: boolean
    createdAt?: Date | string
  }

  export type AiRequestLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    status?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiRequestLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    status?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiRequestLogCreateManyInput = {
    id?: string
    userId: string
    targetType?: string | null
    targetId?: string | null
    modelName: string
    promptTokens?: number
    completionTokens?: number
    latencyMs?: number
    status: number
    error?: string | null
    isOrphan?: boolean
    createdAt?: Date | string
  }

  export type AiRequestLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    status?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiRequestLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    latencyMs?: IntFieldUpdateOperationsInput | number
    status?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    isOrphan?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphNodeCreateInput = {
    id?: string
    sourceType: string
    sourceId?: string | null
    sourceVersion?: number | null
    label: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    riskScore?: number | null
    riskLevel?: string | null
    lastRiskUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustGraphNodeUncheckedCreateInput = {
    id?: string
    sourceType: string
    sourceId?: string | null
    sourceVersion?: number | null
    label: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    riskScore?: number | null
    riskLevel?: string | null
    lastRiskUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustGraphNodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceVersion?: NullableIntFieldUpdateOperationsInput | number | null
    label?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    lastRiskUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphNodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceVersion?: NullableIntFieldUpdateOperationsInput | number | null
    label?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    lastRiskUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphNodeCreateManyInput = {
    id?: string
    sourceType: string
    sourceId?: string | null
    sourceVersion?: number | null
    label: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    riskScore?: number | null
    riskLevel?: string | null
    lastRiskUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustGraphNodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceVersion?: NullableIntFieldUpdateOperationsInput | number | null
    label?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    lastRiskUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphNodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceVersion?: NullableIntFieldUpdateOperationsInput | number | null
    label?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    lastRiskUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphEdgeCreateInput = {
    id?: string
    fromNodeId: string
    toNodeId: string
    relationType: string
    sourceType?: string | null
    sourceId?: string | null
    confidence?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TrustGraphEdgeUncheckedCreateInput = {
    id?: string
    fromNodeId: string
    toNodeId: string
    relationType: string
    sourceType?: string | null
    sourceId?: string | null
    confidence?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TrustGraphEdgeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    relationType?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: FloatFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphEdgeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    relationType?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: FloatFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphEdgeCreateManyInput = {
    id?: string
    fromNodeId: string
    toNodeId: string
    relationType: string
    sourceType?: string | null
    sourceId?: string | null
    confidence?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TrustGraphEdgeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    relationType?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: FloatFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphEdgeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    relationType?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: FloatFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphSyncLogCreateInput = {
    id?: string
    sourceType: string
    sourceId: string
    status: string
    retryCount?: number
    lastError?: string | null
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustGraphSyncLogUncheckedCreateInput = {
    id?: string
    sourceType: string
    sourceId: string
    status: string
    retryCount?: number
    lastError?: string | null
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustGraphSyncLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphSyncLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphSyncLogCreateManyInput = {
    id?: string
    sourceType: string
    sourceId: string
    status: string
    retryCount?: number
    lastError?: string | null
    lastSyncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrustGraphSyncLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustGraphSyncLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    lastSyncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditConsistencyCheckLogCreateInput = {
    id?: string
    checkType: string
    targetType: string
    targetId: string
    issueDetails: string
    severity?: string
    status?: string
    jobId?: string | null
    handlerId?: string | null
    handledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditConsistencyCheckLogUncheckedCreateInput = {
    id?: string
    checkType: string
    targetType: string
    targetId: string
    issueDetails: string
    severity?: string
    status?: string
    jobId?: string | null
    handlerId?: string | null
    handledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditConsistencyCheckLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkType?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    issueDetails?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    handlerId?: NullableStringFieldUpdateOperationsInput | string | null
    handledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditConsistencyCheckLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkType?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    issueDetails?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    handlerId?: NullableStringFieldUpdateOperationsInput | string | null
    handledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditConsistencyCheckLogCreateManyInput = {
    id?: string
    checkType: string
    targetType: string
    targetId: string
    issueDetails: string
    severity?: string
    status?: string
    jobId?: string | null
    handlerId?: string | null
    handledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditConsistencyCheckLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkType?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    issueDetails?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    handlerId?: NullableStringFieldUpdateOperationsInput | string | null
    handledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditConsistencyCheckLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkType?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    issueDetails?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    handlerId?: NullableStringFieldUpdateOperationsInput | string | null
    handledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraphConsistencyLogCreateInput = {
    id?: string
    nodeOrEdgeId?: string | null
    sourceType: string
    sourceId: string
    issueType: string
    expectedVersion?: number | null
    actualVersion?: number | null
    details?: string | null
    status?: string
    jobId?: string | null
    handlerId?: string | null
    handledAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GraphConsistencyLogUncheckedCreateInput = {
    id?: string
    nodeOrEdgeId?: string | null
    sourceType: string
    sourceId: string
    issueType: string
    expectedVersion?: number | null
    actualVersion?: number | null
    details?: string | null
    status?: string
    jobId?: string | null
    handlerId?: string | null
    handledAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GraphConsistencyLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeOrEdgeId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    expectedVersion?: NullableIntFieldUpdateOperationsInput | number | null
    actualVersion?: NullableIntFieldUpdateOperationsInput | number | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    handlerId?: NullableStringFieldUpdateOperationsInput | string | null
    handledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraphConsistencyLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeOrEdgeId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    expectedVersion?: NullableIntFieldUpdateOperationsInput | number | null
    actualVersion?: NullableIntFieldUpdateOperationsInput | number | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    handlerId?: NullableStringFieldUpdateOperationsInput | string | null
    handledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraphConsistencyLogCreateManyInput = {
    id?: string
    nodeOrEdgeId?: string | null
    sourceType: string
    sourceId: string
    issueType: string
    expectedVersion?: number | null
    actualVersion?: number | null
    details?: string | null
    status?: string
    jobId?: string | null
    handlerId?: string | null
    handledAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GraphConsistencyLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeOrEdgeId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    expectedVersion?: NullableIntFieldUpdateOperationsInput | number | null
    actualVersion?: NullableIntFieldUpdateOperationsInput | number | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    handlerId?: NullableStringFieldUpdateOperationsInput | string | null
    handledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraphConsistencyLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeOrEdgeId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    expectedVersion?: NullableIntFieldUpdateOperationsInput | number | null
    actualVersion?: NullableIntFieldUpdateOperationsInput | number | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    handlerId?: NullableStringFieldUpdateOperationsInput | string | null
    handledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrityJobLogCreateInput = {
    id?: string
    jobType: string
    startedAt: Date | string
    endedAt: Date | string
    totalRecordsChecked: number
    totalIssuesFound: number
    status: string
    reportSummary?: NullableJsonNullValueInput | InputJsonValue
  }

  export type IntegrityJobLogUncheckedCreateInput = {
    id?: string
    jobType: string
    startedAt: Date | string
    endedAt: Date | string
    totalRecordsChecked: number
    totalIssuesFound: number
    status: string
    reportSummary?: NullableJsonNullValueInput | InputJsonValue
  }

  export type IntegrityJobLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRecordsChecked?: IntFieldUpdateOperationsInput | number
    totalIssuesFound?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reportSummary?: NullableJsonNullValueInput | InputJsonValue
  }

  export type IntegrityJobLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRecordsChecked?: IntFieldUpdateOperationsInput | number
    totalIssuesFound?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reportSummary?: NullableJsonNullValueInput | InputJsonValue
  }

  export type IntegrityJobLogCreateManyInput = {
    id?: string
    jobType: string
    startedAt: Date | string
    endedAt: Date | string
    totalRecordsChecked: number
    totalIssuesFound: number
    status: string
    reportSummary?: NullableJsonNullValueInput | InputJsonValue
  }

  export type IntegrityJobLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRecordsChecked?: IntFieldUpdateOperationsInput | number
    totalIssuesFound?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reportSummary?: NullableJsonNullValueInput | InputJsonValue
  }

  export type IntegrityJobLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRecordsChecked?: IntFieldUpdateOperationsInput | number
    totalIssuesFound?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reportSummary?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AiRiskReportCreateInput = {
    id?: string
    reportType: string
    targetId: string
    title: string
    content: JsonNullValueInput | InputJsonValue
    confidence?: number
    status?: string
    reviewedBy?: string | null
    aiModel: string
    promptVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiRiskReportUncheckedCreateInput = {
    id?: string
    reportType: string
    targetId: string
    title: string
    content: JsonNullValueInput | InputJsonValue
    confidence?: number
    status?: string
    reviewedBy?: string | null
    aiModel: string
    promptVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiRiskReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    aiModel?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiRiskReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    aiModel?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiRiskReportCreateManyInput = {
    id?: string
    reportType: string
    targetId: string
    title: string
    content: JsonNullValueInput | InputJsonValue
    confidence?: number
    status?: string
    reviewedBy?: string | null
    aiModel: string
    promptVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiRiskReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    aiModel?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiRiskReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    aiModel?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiReportAuditCreateInput = {
    id?: string
    reportId: string
    reviewerId: string
    action: string
    previousContent?: NullableJsonNullValueInput | InputJsonValue
    newContent?: NullableJsonNullValueInput | InputJsonValue
    comment?: string | null
    createdAt?: Date | string
  }

  export type AiReportAuditUncheckedCreateInput = {
    id?: string
    reportId: string
    reviewerId: string
    action: string
    previousContent?: NullableJsonNullValueInput | InputJsonValue
    newContent?: NullableJsonNullValueInput | InputJsonValue
    comment?: string | null
    createdAt?: Date | string
  }

  export type AiReportAuditUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    previousContent?: NullableJsonNullValueInput | InputJsonValue
    newContent?: NullableJsonNullValueInput | InputJsonValue
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiReportAuditUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    previousContent?: NullableJsonNullValueInput | InputJsonValue
    newContent?: NullableJsonNullValueInput | InputJsonValue
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiReportAuditCreateManyInput = {
    id?: string
    reportId: string
    reviewerId: string
    action: string
    previousContent?: NullableJsonNullValueInput | InputJsonValue
    newContent?: NullableJsonNullValueInput | InputJsonValue
    comment?: string | null
    createdAt?: Date | string
  }

  export type AiReportAuditUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    previousContent?: NullableJsonNullValueInput | InputJsonValue
    newContent?: NullableJsonNullValueInput | InputJsonValue
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiReportAuditUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    previousContent?: NullableJsonNullValueInput | InputJsonValue
    newContent?: NullableJsonNullValueInput | InputJsonValue
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictiveAlertCreateInput = {
    id?: string
    targetId: string
    probability: number
    recommendation: string
    reasoning?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    reviewedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PredictiveAlertUncheckedCreateInput = {
    id?: string
    targetId: string
    probability: number
    recommendation: string
    reasoning?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    reviewedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PredictiveAlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    probability?: FloatFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictiveAlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    probability?: FloatFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictiveAlertCreateManyInput = {
    id?: string
    targetId: string
    probability: number
    recommendation: string
    reasoning?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    reviewedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PredictiveAlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    probability?: FloatFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictiveAlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    probability?: FloatFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskScoreHistoryCreateInput = {
    id?: string
    nodeId: string
    score: number
    level: string
    factors?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RiskScoreHistoryUncheckedCreateInput = {
    id?: string
    nodeId: string
    score: number
    level: string
    factors?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RiskScoreHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    level?: StringFieldUpdateOperationsInput | string
    factors?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskScoreHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    level?: StringFieldUpdateOperationsInput | string
    factors?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskScoreHistoryCreateManyInput = {
    id?: string
    nodeId: string
    score: number
    level: string
    factors?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RiskScoreHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    level?: StringFieldUpdateOperationsInput | string
    factors?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskScoreHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    level?: StringFieldUpdateOperationsInput | string
    factors?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AiAgentCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    systemPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiAgentMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    systemPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiAgentMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    systemPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AiKnowledgeSnippetCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    agentId?: SortOrder
  }

  export type AiKnowledgeSnippetMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    agentId?: SortOrder
  }

  export type AiKnowledgeSnippetMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    agentId?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AiConversationMessageListRelationFilter = {
    every?: AiConversationMessageWhereInput
    some?: AiConversationMessageWhereInput
    none?: AiConversationMessageWhereInput
  }

  export type AiConversationMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AiConversationCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    agentId?: SortOrder
    state?: SortOrder
    mode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    agentId?: SortOrder
    mode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiConversationMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    agentId?: SortOrder
    mode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type AiConversationRelationFilter = {
    is?: AiConversationWhereInput
    isNot?: AiConversationWhereInput
  }

  export type AiConversationMessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    source?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type AiConversationMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type AiConversationMessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AiInsightCountOrderByAggregateInput = {
    id?: SortOrder
    category?: SortOrder
    title?: SortOrder
    content?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    metadata?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AiInsightMaxOrderByAggregateInput = {
    id?: SortOrder
    category?: SortOrder
    title?: SortOrder
    content?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AiInsightMinOrderByAggregateInput = {
    id?: SortOrder
    category?: SortOrder
    title?: SortOrder
    content?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AiSyncLogCountOrderByAggregateInput = {
    id?: SortOrder
    syncType?: SortOrder
    recordsSynced?: SortOrder
    recordsFailed?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiSyncLogAvgOrderByAggregateInput = {
    recordsSynced?: SortOrder
    recordsFailed?: SortOrder
  }

  export type AiSyncLogMaxOrderByAggregateInput = {
    id?: SortOrder
    syncType?: SortOrder
    recordsSynced?: SortOrder
    recordsFailed?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiSyncLogMinOrderByAggregateInput = {
    id?: SortOrder
    syncType?: SortOrder
    recordsSynced?: SortOrder
    recordsFailed?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiSyncLogSumOrderByAggregateInput = {
    recordsSynced?: SortOrder
    recordsFailed?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AiVerificationLogCountOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    targetType?: SortOrder
    targetDisplayCode?: SortOrder
    targetVersion?: SortOrder
    sourceModule?: SortOrder
    aiProposedContent?: SortOrder
    finalContent?: SortOrder
    status?: SortOrder
    riskLevel?: SortOrder
    requiredRole?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    modelVersion?: SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
  }

  export type AiVerificationLogAvgOrderByAggregateInput = {
    targetVersion?: SortOrder
  }

  export type AiVerificationLogMaxOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    targetType?: SortOrder
    targetDisplayCode?: SortOrder
    targetVersion?: SortOrder
    sourceModule?: SortOrder
    status?: SortOrder
    riskLevel?: SortOrder
    requiredRole?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    modelVersion?: SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
  }

  export type AiVerificationLogMinOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    targetType?: SortOrder
    targetDisplayCode?: SortOrder
    targetVersion?: SortOrder
    sourceModule?: SortOrder
    status?: SortOrder
    riskLevel?: SortOrder
    requiredRole?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    modelVersion?: SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
  }

  export type AiVerificationLogSumOrderByAggregateInput = {
    targetVersion?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type AiSafetyLogCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    action?: SortOrder
    riskLevel?: SortOrder
    details?: SortOrder
    isImmutable?: SortOrder
    isOrphan?: SortOrder
  }

  export type AiSafetyLogMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    action?: SortOrder
    riskLevel?: SortOrder
    details?: SortOrder
    isImmutable?: SortOrder
    isOrphan?: SortOrder
  }

  export type AiSafetyLogMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    action?: SortOrder
    riskLevel?: SortOrder
    details?: SortOrder
    isImmutable?: SortOrder
    isOrphan?: SortOrder
  }

  export type AiRequestLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    latencyMs?: SortOrder
    status?: SortOrder
    error?: SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
  }

  export type AiRequestLogAvgOrderByAggregateInput = {
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    latencyMs?: SortOrder
    status?: SortOrder
  }

  export type AiRequestLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    latencyMs?: SortOrder
    status?: SortOrder
    error?: SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
  }

  export type AiRequestLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    modelName?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    latencyMs?: SortOrder
    status?: SortOrder
    error?: SortOrder
    isOrphan?: SortOrder
    createdAt?: SortOrder
  }

  export type AiRequestLogSumOrderByAggregateInput = {
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    latencyMs?: SortOrder
    status?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type TrustGraphNodeSourceTypeSourceIdCompoundUniqueInput = {
    sourceType: string
    sourceId: string
  }

  export type TrustGraphNodeCountOrderByAggregateInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    sourceVersion?: SortOrder
    label?: SortOrder
    metadata?: SortOrder
    riskScore?: SortOrder
    riskLevel?: SortOrder
    lastRiskUpdate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustGraphNodeAvgOrderByAggregateInput = {
    sourceVersion?: SortOrder
    riskScore?: SortOrder
  }

  export type TrustGraphNodeMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    sourceVersion?: SortOrder
    label?: SortOrder
    riskScore?: SortOrder
    riskLevel?: SortOrder
    lastRiskUpdate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustGraphNodeMinOrderByAggregateInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    sourceVersion?: SortOrder
    label?: SortOrder
    riskScore?: SortOrder
    riskLevel?: SortOrder
    lastRiskUpdate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustGraphNodeSumOrderByAggregateInput = {
    sourceVersion?: SortOrder
    riskScore?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TrustGraphEdgeFromNodeIdToNodeIdRelationTypeCompoundUniqueInput = {
    fromNodeId: string
    toNodeId: string
    relationType: string
  }

  export type TrustGraphEdgeCountOrderByAggregateInput = {
    id?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    relationType?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    confidence?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type TrustGraphEdgeAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type TrustGraphEdgeMaxOrderByAggregateInput = {
    id?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    relationType?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
  }

  export type TrustGraphEdgeMinOrderByAggregateInput = {
    id?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    relationType?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
  }

  export type TrustGraphEdgeSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type TrustGraphSyncLogSourceTypeSourceIdCompoundUniqueInput = {
    sourceType: string
    sourceId: string
  }

  export type TrustGraphSyncLogCountOrderByAggregateInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    lastError?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustGraphSyncLogAvgOrderByAggregateInput = {
    retryCount?: SortOrder
  }

  export type TrustGraphSyncLogMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    lastError?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustGraphSyncLogMinOrderByAggregateInput = {
    id?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    lastError?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrustGraphSyncLogSumOrderByAggregateInput = {
    retryCount?: SortOrder
  }

  export type AuditConsistencyCheckLogCountOrderByAggregateInput = {
    id?: SortOrder
    checkType?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    issueDetails?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    handlerId?: SortOrder
    handledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditConsistencyCheckLogMaxOrderByAggregateInput = {
    id?: SortOrder
    checkType?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    issueDetails?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    handlerId?: SortOrder
    handledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditConsistencyCheckLogMinOrderByAggregateInput = {
    id?: SortOrder
    checkType?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    issueDetails?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    handlerId?: SortOrder
    handledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GraphConsistencyLogCountOrderByAggregateInput = {
    id?: SortOrder
    nodeOrEdgeId?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    issueType?: SortOrder
    expectedVersion?: SortOrder
    actualVersion?: SortOrder
    details?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    handlerId?: SortOrder
    handledAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GraphConsistencyLogAvgOrderByAggregateInput = {
    expectedVersion?: SortOrder
    actualVersion?: SortOrder
  }

  export type GraphConsistencyLogMaxOrderByAggregateInput = {
    id?: SortOrder
    nodeOrEdgeId?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    issueType?: SortOrder
    expectedVersion?: SortOrder
    actualVersion?: SortOrder
    details?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    handlerId?: SortOrder
    handledAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GraphConsistencyLogMinOrderByAggregateInput = {
    id?: SortOrder
    nodeOrEdgeId?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    issueType?: SortOrder
    expectedVersion?: SortOrder
    actualVersion?: SortOrder
    details?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    handlerId?: SortOrder
    handledAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GraphConsistencyLogSumOrderByAggregateInput = {
    expectedVersion?: SortOrder
    actualVersion?: SortOrder
  }

  export type IntegrityJobLogCountOrderByAggregateInput = {
    id?: SortOrder
    jobType?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    totalRecordsChecked?: SortOrder
    totalIssuesFound?: SortOrder
    status?: SortOrder
    reportSummary?: SortOrder
  }

  export type IntegrityJobLogAvgOrderByAggregateInput = {
    totalRecordsChecked?: SortOrder
    totalIssuesFound?: SortOrder
  }

  export type IntegrityJobLogMaxOrderByAggregateInput = {
    id?: SortOrder
    jobType?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    totalRecordsChecked?: SortOrder
    totalIssuesFound?: SortOrder
    status?: SortOrder
  }

  export type IntegrityJobLogMinOrderByAggregateInput = {
    id?: SortOrder
    jobType?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    totalRecordsChecked?: SortOrder
    totalIssuesFound?: SortOrder
    status?: SortOrder
  }

  export type IntegrityJobLogSumOrderByAggregateInput = {
    totalRecordsChecked?: SortOrder
    totalIssuesFound?: SortOrder
  }

  export type AiRiskReportCountOrderByAggregateInput = {
    id?: SortOrder
    reportType?: SortOrder
    targetId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    reviewedBy?: SortOrder
    aiModel?: SortOrder
    promptVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiRiskReportAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type AiRiskReportMaxOrderByAggregateInput = {
    id?: SortOrder
    reportType?: SortOrder
    targetId?: SortOrder
    title?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    reviewedBy?: SortOrder
    aiModel?: SortOrder
    promptVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiRiskReportMinOrderByAggregateInput = {
    id?: SortOrder
    reportType?: SortOrder
    targetId?: SortOrder
    title?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    reviewedBy?: SortOrder
    aiModel?: SortOrder
    promptVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiRiskReportSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type AiReportAuditCountOrderByAggregateInput = {
    id?: SortOrder
    reportId?: SortOrder
    reviewerId?: SortOrder
    action?: SortOrder
    previousContent?: SortOrder
    newContent?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type AiReportAuditMaxOrderByAggregateInput = {
    id?: SortOrder
    reportId?: SortOrder
    reviewerId?: SortOrder
    action?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type AiReportAuditMinOrderByAggregateInput = {
    id?: SortOrder
    reportId?: SortOrder
    reviewerId?: SortOrder
    action?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type PredictiveAlertCountOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    probability?: SortOrder
    recommendation?: SortOrder
    reasoning?: SortOrder
    status?: SortOrder
    reviewedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PredictiveAlertAvgOrderByAggregateInput = {
    probability?: SortOrder
  }

  export type PredictiveAlertMaxOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    probability?: SortOrder
    recommendation?: SortOrder
    status?: SortOrder
    reviewedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PredictiveAlertMinOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    probability?: SortOrder
    recommendation?: SortOrder
    status?: SortOrder
    reviewedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PredictiveAlertSumOrderByAggregateInput = {
    probability?: SortOrder
  }

  export type RiskScoreHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    nodeId?: SortOrder
    score?: SortOrder
    level?: SortOrder
    factors?: SortOrder
    createdAt?: SortOrder
  }

  export type RiskScoreHistoryAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type RiskScoreHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    nodeId?: SortOrder
    score?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
  }

  export type RiskScoreHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    nodeId?: SortOrder
    score?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
  }

  export type RiskScoreHistorySumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AiKnowledgeSnippetCreatetagsInput = {
    set: string[]
  }

  export type AiKnowledgeSnippetUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type AiConversationMessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<AiConversationMessageCreateWithoutConversationInput, AiConversationMessageUncheckedCreateWithoutConversationInput> | AiConversationMessageCreateWithoutConversationInput[] | AiConversationMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: AiConversationMessageCreateOrConnectWithoutConversationInput | AiConversationMessageCreateOrConnectWithoutConversationInput[]
    createMany?: AiConversationMessageCreateManyConversationInputEnvelope
    connect?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
  }

  export type AiConversationMessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<AiConversationMessageCreateWithoutConversationInput, AiConversationMessageUncheckedCreateWithoutConversationInput> | AiConversationMessageCreateWithoutConversationInput[] | AiConversationMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: AiConversationMessageCreateOrConnectWithoutConversationInput | AiConversationMessageCreateOrConnectWithoutConversationInput[]
    createMany?: AiConversationMessageCreateManyConversationInputEnvelope
    connect?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
  }

  export type AiConversationMessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<AiConversationMessageCreateWithoutConversationInput, AiConversationMessageUncheckedCreateWithoutConversationInput> | AiConversationMessageCreateWithoutConversationInput[] | AiConversationMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: AiConversationMessageCreateOrConnectWithoutConversationInput | AiConversationMessageCreateOrConnectWithoutConversationInput[]
    upsert?: AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput | AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: AiConversationMessageCreateManyConversationInputEnvelope
    set?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
    disconnect?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
    delete?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
    connect?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
    update?: AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput | AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: AiConversationMessageUpdateManyWithWhereWithoutConversationInput | AiConversationMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: AiConversationMessageScalarWhereInput | AiConversationMessageScalarWhereInput[]
  }

  export type AiConversationMessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<AiConversationMessageCreateWithoutConversationInput, AiConversationMessageUncheckedCreateWithoutConversationInput> | AiConversationMessageCreateWithoutConversationInput[] | AiConversationMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: AiConversationMessageCreateOrConnectWithoutConversationInput | AiConversationMessageCreateOrConnectWithoutConversationInput[]
    upsert?: AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput | AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: AiConversationMessageCreateManyConversationInputEnvelope
    set?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
    disconnect?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
    delete?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
    connect?: AiConversationMessageWhereUniqueInput | AiConversationMessageWhereUniqueInput[]
    update?: AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput | AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: AiConversationMessageUpdateManyWithWhereWithoutConversationInput | AiConversationMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: AiConversationMessageScalarWhereInput | AiConversationMessageScalarWhereInput[]
  }

  export type AiConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<AiConversationCreateWithoutMessagesInput, AiConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: AiConversationCreateOrConnectWithoutMessagesInput
    connect?: AiConversationWhereUniqueInput
  }

  export type AiConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<AiConversationCreateWithoutMessagesInput, AiConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: AiConversationCreateOrConnectWithoutMessagesInput
    upsert?: AiConversationUpsertWithoutMessagesInput
    connect?: AiConversationWhereUniqueInput
    update?: XOR<XOR<AiConversationUpdateToOneWithWhereWithoutMessagesInput, AiConversationUpdateWithoutMessagesInput>, AiConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type AiConversationMessageCreateWithoutConversationInput = {
    id?: string
    role: string
    content: string
    source?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiConversationMessageUncheckedCreateWithoutConversationInput = {
    id?: string
    role: string
    content: string
    source?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiConversationMessageCreateOrConnectWithoutConversationInput = {
    where: AiConversationMessageWhereUniqueInput
    create: XOR<AiConversationMessageCreateWithoutConversationInput, AiConversationMessageUncheckedCreateWithoutConversationInput>
  }

  export type AiConversationMessageCreateManyConversationInputEnvelope = {
    data: AiConversationMessageCreateManyConversationInput | AiConversationMessageCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: AiConversationMessageWhereUniqueInput
    update: XOR<AiConversationMessageUpdateWithoutConversationInput, AiConversationMessageUncheckedUpdateWithoutConversationInput>
    create: XOR<AiConversationMessageCreateWithoutConversationInput, AiConversationMessageUncheckedCreateWithoutConversationInput>
  }

  export type AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: AiConversationMessageWhereUniqueInput
    data: XOR<AiConversationMessageUpdateWithoutConversationInput, AiConversationMessageUncheckedUpdateWithoutConversationInput>
  }

  export type AiConversationMessageUpdateManyWithWhereWithoutConversationInput = {
    where: AiConversationMessageScalarWhereInput
    data: XOR<AiConversationMessageUpdateManyMutationInput, AiConversationMessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type AiConversationMessageScalarWhereInput = {
    AND?: AiConversationMessageScalarWhereInput | AiConversationMessageScalarWhereInput[]
    OR?: AiConversationMessageScalarWhereInput[]
    NOT?: AiConversationMessageScalarWhereInput | AiConversationMessageScalarWhereInput[]
    id?: StringFilter<"AiConversationMessage"> | string
    conversationId?: StringFilter<"AiConversationMessage"> | string
    role?: StringFilter<"AiConversationMessage"> | string
    content?: StringFilter<"AiConversationMessage"> | string
    source?: StringNullableFilter<"AiConversationMessage"> | string | null
    metadata?: JsonNullableFilter<"AiConversationMessage">
    createdAt?: DateTimeFilter<"AiConversationMessage"> | Date | string
  }

  export type AiConversationCreateWithoutMessagesInput = {
    id?: string
    title?: string | null
    userId: string
    agentId?: string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    title?: string | null
    userId: string
    agentId?: string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiConversationCreateOrConnectWithoutMessagesInput = {
    where: AiConversationWhereUniqueInput
    create: XOR<AiConversationCreateWithoutMessagesInput, AiConversationUncheckedCreateWithoutMessagesInput>
  }

  export type AiConversationUpsertWithoutMessagesInput = {
    update: XOR<AiConversationUpdateWithoutMessagesInput, AiConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<AiConversationCreateWithoutMessagesInput, AiConversationUncheckedCreateWithoutMessagesInput>
    where?: AiConversationWhereInput
  }

  export type AiConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: AiConversationWhereInput
    data: XOR<AiConversationUpdateWithoutMessagesInput, AiConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type AiConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationMessageCreateManyConversationInput = {
    id?: string
    role: string
    content: string
    source?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiConversationMessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationMessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationMessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use AiConversationCountOutputTypeDefaultArgs instead
     */
    export type AiConversationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiConversationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiAgentDefaultArgs instead
     */
    export type AiAgentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiAgentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiKnowledgeSnippetDefaultArgs instead
     */
    export type AiKnowledgeSnippetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiKnowledgeSnippetDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiConversationDefaultArgs instead
     */
    export type AiConversationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiConversationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiConversationMessageDefaultArgs instead
     */
    export type AiConversationMessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiConversationMessageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiInsightDefaultArgs instead
     */
    export type AiInsightArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiInsightDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiSyncLogDefaultArgs instead
     */
    export type AiSyncLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiSyncLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiVerificationLogDefaultArgs instead
     */
    export type AiVerificationLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiVerificationLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiSafetyLogDefaultArgs instead
     */
    export type AiSafetyLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiSafetyLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiRequestLogDefaultArgs instead
     */
    export type AiRequestLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiRequestLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrustGraphNodeDefaultArgs instead
     */
    export type TrustGraphNodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrustGraphNodeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrustGraphEdgeDefaultArgs instead
     */
    export type TrustGraphEdgeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrustGraphEdgeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrustGraphSyncLogDefaultArgs instead
     */
    export type TrustGraphSyncLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrustGraphSyncLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditConsistencyCheckLogDefaultArgs instead
     */
    export type AuditConsistencyCheckLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditConsistencyCheckLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GraphConsistencyLogDefaultArgs instead
     */
    export type GraphConsistencyLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GraphConsistencyLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use IntegrityJobLogDefaultArgs instead
     */
    export type IntegrityJobLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IntegrityJobLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiRiskReportDefaultArgs instead
     */
    export type AiRiskReportArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiRiskReportDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiReportAuditDefaultArgs instead
     */
    export type AiReportAuditArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiReportAuditDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PredictiveAlertDefaultArgs instead
     */
    export type PredictiveAlertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PredictiveAlertDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RiskScoreHistoryDefaultArgs instead
     */
    export type RiskScoreHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RiskScoreHistoryDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}