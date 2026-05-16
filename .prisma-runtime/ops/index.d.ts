
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
 * Model SystemLog
 * 
 */
export type SystemLog = $Result.DefaultSelection<Prisma.$SystemLogPayload>
/**
 * Model ResponsibleUnit
 * 
 */
export type ResponsibleUnit = $Result.DefaultSelection<Prisma.$ResponsibleUnitPayload>
/**
 * Model Subsystem
 * 
 */
export type Subsystem = $Result.DefaultSelection<Prisma.$SubsystemPayload>
/**
 * Model PatrolLocation
 * 
 */
export type PatrolLocation = $Result.DefaultSelection<Prisma.$PatrolLocationPayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model MaintenanceStandard
 * 
 */
export type MaintenanceStandard = $Result.DefaultSelection<Prisma.$MaintenanceStandardPayload>
/**
 * Model MaintenanceStandardItem
 * 
 */
export type MaintenanceStandardItem = $Result.DefaultSelection<Prisma.$MaintenanceStandardItemPayload>
/**
 * Model InspectionDetail
 * 
 */
export type InspectionDetail = $Result.DefaultSelection<Prisma.$InspectionDetailPayload>
/**
 * Model DnfDocument
 * 
 */
export type DnfDocument = $Result.DefaultSelection<Prisma.$DnfDocumentPayload>
/**
 * Model CorrectiveAction
 * 
 */
export type CorrectiveAction = $Result.DefaultSelection<Prisma.$CorrectiveActionPayload>
/**
 * Model HazardRecord
 * 
 */
export type HazardRecord = $Result.DefaultSelection<Prisma.$HazardRecordPayload>
/**
 * Model Improvement
 * 
 */
export type Improvement = $Result.DefaultSelection<Prisma.$ImprovementPayload>
/**
 * Model SystemState
 * 
 */
export type SystemState = $Result.DefaultSelection<Prisma.$SystemStatePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SystemLogs
 * const systemLogs = await prisma.systemLog.findMany()
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
   * // Fetch zero or more SystemLogs
   * const systemLogs = await prisma.systemLog.findMany()
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
   * `prisma.systemLog`: Exposes CRUD operations for the **SystemLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemLogs
    * const systemLogs = await prisma.systemLog.findMany()
    * ```
    */
  get systemLog(): Prisma.SystemLogDelegate<ExtArgs>;

  /**
   * `prisma.responsibleUnit`: Exposes CRUD operations for the **ResponsibleUnit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ResponsibleUnits
    * const responsibleUnits = await prisma.responsibleUnit.findMany()
    * ```
    */
  get responsibleUnit(): Prisma.ResponsibleUnitDelegate<ExtArgs>;

  /**
   * `prisma.subsystem`: Exposes CRUD operations for the **Subsystem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subsystems
    * const subsystems = await prisma.subsystem.findMany()
    * ```
    */
  get subsystem(): Prisma.SubsystemDelegate<ExtArgs>;

  /**
   * `prisma.patrolLocation`: Exposes CRUD operations for the **PatrolLocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatrolLocations
    * const patrolLocations = await prisma.patrolLocation.findMany()
    * ```
    */
  get patrolLocation(): Prisma.PatrolLocationDelegate<ExtArgs>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs>;

  /**
   * `prisma.maintenanceStandard`: Exposes CRUD operations for the **MaintenanceStandard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaintenanceStandards
    * const maintenanceStandards = await prisma.maintenanceStandard.findMany()
    * ```
    */
  get maintenanceStandard(): Prisma.MaintenanceStandardDelegate<ExtArgs>;

  /**
   * `prisma.maintenanceStandardItem`: Exposes CRUD operations for the **MaintenanceStandardItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaintenanceStandardItems
    * const maintenanceStandardItems = await prisma.maintenanceStandardItem.findMany()
    * ```
    */
  get maintenanceStandardItem(): Prisma.MaintenanceStandardItemDelegate<ExtArgs>;

  /**
   * `prisma.inspectionDetail`: Exposes CRUD operations for the **InspectionDetail** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InspectionDetails
    * const inspectionDetails = await prisma.inspectionDetail.findMany()
    * ```
    */
  get inspectionDetail(): Prisma.InspectionDetailDelegate<ExtArgs>;

  /**
   * `prisma.dnfDocument`: Exposes CRUD operations for the **DnfDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DnfDocuments
    * const dnfDocuments = await prisma.dnfDocument.findMany()
    * ```
    */
  get dnfDocument(): Prisma.DnfDocumentDelegate<ExtArgs>;

  /**
   * `prisma.correctiveAction`: Exposes CRUD operations for the **CorrectiveAction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CorrectiveActions
    * const correctiveActions = await prisma.correctiveAction.findMany()
    * ```
    */
  get correctiveAction(): Prisma.CorrectiveActionDelegate<ExtArgs>;

  /**
   * `prisma.hazardRecord`: Exposes CRUD operations for the **HazardRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HazardRecords
    * const hazardRecords = await prisma.hazardRecord.findMany()
    * ```
    */
  get hazardRecord(): Prisma.HazardRecordDelegate<ExtArgs>;

  /**
   * `prisma.improvement`: Exposes CRUD operations for the **Improvement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Improvements
    * const improvements = await prisma.improvement.findMany()
    * ```
    */
  get improvement(): Prisma.ImprovementDelegate<ExtArgs>;

  /**
   * `prisma.systemState`: Exposes CRUD operations for the **SystemState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemStates
    * const systemStates = await prisma.systemState.findMany()
    * ```
    */
  get systemState(): Prisma.SystemStateDelegate<ExtArgs>;
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "systemLog" | "responsibleUnit" | "subsystem" | "patrolLocation" | "comment" | "notification" | "maintenanceStandard" | "maintenanceStandardItem" | "inspectionDetail" | "dnfDocument" | "correctiveAction" | "hazardRecord" | "improvement" | "systemState"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SystemLog: {
        payload: Prisma.$SystemLogPayload<ExtArgs>
        fields: Prisma.SystemLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          findFirst: {
            args: Prisma.SystemLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          findMany: {
            args: Prisma.SystemLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>[]
          }
          create: {
            args: Prisma.SystemLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          createMany: {
            args: Prisma.SystemLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>[]
          }
          delete: {
            args: Prisma.SystemLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          update: {
            args: Prisma.SystemLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          deleteMany: {
            args: Prisma.SystemLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SystemLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          aggregate: {
            args: Prisma.SystemLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemLog>
          }
          groupBy: {
            args: Prisma.SystemLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemLogCountArgs<ExtArgs>
            result: $Utils.Optional<SystemLogCountAggregateOutputType> | number
          }
        }
      }
      ResponsibleUnit: {
        payload: Prisma.$ResponsibleUnitPayload<ExtArgs>
        fields: Prisma.ResponsibleUnitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResponsibleUnitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResponsibleUnitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload>
          }
          findFirst: {
            args: Prisma.ResponsibleUnitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResponsibleUnitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload>
          }
          findMany: {
            args: Prisma.ResponsibleUnitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload>[]
          }
          create: {
            args: Prisma.ResponsibleUnitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload>
          }
          createMany: {
            args: Prisma.ResponsibleUnitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResponsibleUnitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload>[]
          }
          delete: {
            args: Prisma.ResponsibleUnitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload>
          }
          update: {
            args: Prisma.ResponsibleUnitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload>
          }
          deleteMany: {
            args: Prisma.ResponsibleUnitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResponsibleUnitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ResponsibleUnitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResponsibleUnitPayload>
          }
          aggregate: {
            args: Prisma.ResponsibleUnitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResponsibleUnit>
          }
          groupBy: {
            args: Prisma.ResponsibleUnitGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResponsibleUnitGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResponsibleUnitCountArgs<ExtArgs>
            result: $Utils.Optional<ResponsibleUnitCountAggregateOutputType> | number
          }
        }
      }
      Subsystem: {
        payload: Prisma.$SubsystemPayload<ExtArgs>
        fields: Prisma.SubsystemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubsystemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubsystemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload>
          }
          findFirst: {
            args: Prisma.SubsystemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubsystemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload>
          }
          findMany: {
            args: Prisma.SubsystemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload>[]
          }
          create: {
            args: Prisma.SubsystemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload>
          }
          createMany: {
            args: Prisma.SubsystemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubsystemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload>[]
          }
          delete: {
            args: Prisma.SubsystemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload>
          }
          update: {
            args: Prisma.SubsystemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload>
          }
          deleteMany: {
            args: Prisma.SubsystemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubsystemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubsystemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubsystemPayload>
          }
          aggregate: {
            args: Prisma.SubsystemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubsystem>
          }
          groupBy: {
            args: Prisma.SubsystemGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubsystemGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubsystemCountArgs<ExtArgs>
            result: $Utils.Optional<SubsystemCountAggregateOutputType> | number
          }
        }
      }
      PatrolLocation: {
        payload: Prisma.$PatrolLocationPayload<ExtArgs>
        fields: Prisma.PatrolLocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatrolLocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatrolLocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload>
          }
          findFirst: {
            args: Prisma.PatrolLocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatrolLocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload>
          }
          findMany: {
            args: Prisma.PatrolLocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload>[]
          }
          create: {
            args: Prisma.PatrolLocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload>
          }
          createMany: {
            args: Prisma.PatrolLocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatrolLocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload>[]
          }
          delete: {
            args: Prisma.PatrolLocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload>
          }
          update: {
            args: Prisma.PatrolLocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload>
          }
          deleteMany: {
            args: Prisma.PatrolLocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatrolLocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatrolLocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatrolLocationPayload>
          }
          aggregate: {
            args: Prisma.PatrolLocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatrolLocation>
          }
          groupBy: {
            args: Prisma.PatrolLocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatrolLocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatrolLocationCountArgs<ExtArgs>
            result: $Utils.Optional<PatrolLocationCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      MaintenanceStandard: {
        payload: Prisma.$MaintenanceStandardPayload<ExtArgs>
        fields: Prisma.MaintenanceStandardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaintenanceStandardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaintenanceStandardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload>
          }
          findFirst: {
            args: Prisma.MaintenanceStandardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaintenanceStandardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload>
          }
          findMany: {
            args: Prisma.MaintenanceStandardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload>[]
          }
          create: {
            args: Prisma.MaintenanceStandardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload>
          }
          createMany: {
            args: Prisma.MaintenanceStandardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaintenanceStandardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload>[]
          }
          delete: {
            args: Prisma.MaintenanceStandardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload>
          }
          update: {
            args: Prisma.MaintenanceStandardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload>
          }
          deleteMany: {
            args: Prisma.MaintenanceStandardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaintenanceStandardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MaintenanceStandardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardPayload>
          }
          aggregate: {
            args: Prisma.MaintenanceStandardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaintenanceStandard>
          }
          groupBy: {
            args: Prisma.MaintenanceStandardGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceStandardGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaintenanceStandardCountArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceStandardCountAggregateOutputType> | number
          }
        }
      }
      MaintenanceStandardItem: {
        payload: Prisma.$MaintenanceStandardItemPayload<ExtArgs>
        fields: Prisma.MaintenanceStandardItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaintenanceStandardItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaintenanceStandardItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload>
          }
          findFirst: {
            args: Prisma.MaintenanceStandardItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaintenanceStandardItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload>
          }
          findMany: {
            args: Prisma.MaintenanceStandardItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload>[]
          }
          create: {
            args: Prisma.MaintenanceStandardItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload>
          }
          createMany: {
            args: Prisma.MaintenanceStandardItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaintenanceStandardItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload>[]
          }
          delete: {
            args: Prisma.MaintenanceStandardItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload>
          }
          update: {
            args: Prisma.MaintenanceStandardItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload>
          }
          deleteMany: {
            args: Prisma.MaintenanceStandardItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaintenanceStandardItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MaintenanceStandardItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceStandardItemPayload>
          }
          aggregate: {
            args: Prisma.MaintenanceStandardItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaintenanceStandardItem>
          }
          groupBy: {
            args: Prisma.MaintenanceStandardItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceStandardItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaintenanceStandardItemCountArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceStandardItemCountAggregateOutputType> | number
          }
        }
      }
      InspectionDetail: {
        payload: Prisma.$InspectionDetailPayload<ExtArgs>
        fields: Prisma.InspectionDetailFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InspectionDetailFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InspectionDetailFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload>
          }
          findFirst: {
            args: Prisma.InspectionDetailFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InspectionDetailFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload>
          }
          findMany: {
            args: Prisma.InspectionDetailFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload>[]
          }
          create: {
            args: Prisma.InspectionDetailCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload>
          }
          createMany: {
            args: Prisma.InspectionDetailCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InspectionDetailCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload>[]
          }
          delete: {
            args: Prisma.InspectionDetailDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload>
          }
          update: {
            args: Prisma.InspectionDetailUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload>
          }
          deleteMany: {
            args: Prisma.InspectionDetailDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InspectionDetailUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InspectionDetailUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionDetailPayload>
          }
          aggregate: {
            args: Prisma.InspectionDetailAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInspectionDetail>
          }
          groupBy: {
            args: Prisma.InspectionDetailGroupByArgs<ExtArgs>
            result: $Utils.Optional<InspectionDetailGroupByOutputType>[]
          }
          count: {
            args: Prisma.InspectionDetailCountArgs<ExtArgs>
            result: $Utils.Optional<InspectionDetailCountAggregateOutputType> | number
          }
        }
      }
      DnfDocument: {
        payload: Prisma.$DnfDocumentPayload<ExtArgs>
        fields: Prisma.DnfDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DnfDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DnfDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload>
          }
          findFirst: {
            args: Prisma.DnfDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DnfDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload>
          }
          findMany: {
            args: Prisma.DnfDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload>[]
          }
          create: {
            args: Prisma.DnfDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload>
          }
          createMany: {
            args: Prisma.DnfDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DnfDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload>[]
          }
          delete: {
            args: Prisma.DnfDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload>
          }
          update: {
            args: Prisma.DnfDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload>
          }
          deleteMany: {
            args: Prisma.DnfDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DnfDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DnfDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DnfDocumentPayload>
          }
          aggregate: {
            args: Prisma.DnfDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDnfDocument>
          }
          groupBy: {
            args: Prisma.DnfDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DnfDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DnfDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DnfDocumentCountAggregateOutputType> | number
          }
        }
      }
      CorrectiveAction: {
        payload: Prisma.$CorrectiveActionPayload<ExtArgs>
        fields: Prisma.CorrectiveActionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CorrectiveActionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CorrectiveActionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload>
          }
          findFirst: {
            args: Prisma.CorrectiveActionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CorrectiveActionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload>
          }
          findMany: {
            args: Prisma.CorrectiveActionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload>[]
          }
          create: {
            args: Prisma.CorrectiveActionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload>
          }
          createMany: {
            args: Prisma.CorrectiveActionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CorrectiveActionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload>[]
          }
          delete: {
            args: Prisma.CorrectiveActionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload>
          }
          update: {
            args: Prisma.CorrectiveActionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload>
          }
          deleteMany: {
            args: Prisma.CorrectiveActionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CorrectiveActionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CorrectiveActionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectiveActionPayload>
          }
          aggregate: {
            args: Prisma.CorrectiveActionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCorrectiveAction>
          }
          groupBy: {
            args: Prisma.CorrectiveActionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CorrectiveActionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CorrectiveActionCountArgs<ExtArgs>
            result: $Utils.Optional<CorrectiveActionCountAggregateOutputType> | number
          }
        }
      }
      HazardRecord: {
        payload: Prisma.$HazardRecordPayload<ExtArgs>
        fields: Prisma.HazardRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HazardRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HazardRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload>
          }
          findFirst: {
            args: Prisma.HazardRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HazardRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload>
          }
          findMany: {
            args: Prisma.HazardRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload>[]
          }
          create: {
            args: Prisma.HazardRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload>
          }
          createMany: {
            args: Prisma.HazardRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HazardRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload>[]
          }
          delete: {
            args: Prisma.HazardRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload>
          }
          update: {
            args: Prisma.HazardRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload>
          }
          deleteMany: {
            args: Prisma.HazardRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HazardRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HazardRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HazardRecordPayload>
          }
          aggregate: {
            args: Prisma.HazardRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHazardRecord>
          }
          groupBy: {
            args: Prisma.HazardRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<HazardRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.HazardRecordCountArgs<ExtArgs>
            result: $Utils.Optional<HazardRecordCountAggregateOutputType> | number
          }
        }
      }
      Improvement: {
        payload: Prisma.$ImprovementPayload<ExtArgs>
        fields: Prisma.ImprovementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImprovementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImprovementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload>
          }
          findFirst: {
            args: Prisma.ImprovementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImprovementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload>
          }
          findMany: {
            args: Prisma.ImprovementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload>[]
          }
          create: {
            args: Prisma.ImprovementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload>
          }
          createMany: {
            args: Prisma.ImprovementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImprovementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload>[]
          }
          delete: {
            args: Prisma.ImprovementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload>
          }
          update: {
            args: Prisma.ImprovementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload>
          }
          deleteMany: {
            args: Prisma.ImprovementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImprovementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImprovementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImprovementPayload>
          }
          aggregate: {
            args: Prisma.ImprovementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImprovement>
          }
          groupBy: {
            args: Prisma.ImprovementGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImprovementGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImprovementCountArgs<ExtArgs>
            result: $Utils.Optional<ImprovementCountAggregateOutputType> | number
          }
        }
      }
      SystemState: {
        payload: Prisma.$SystemStatePayload<ExtArgs>
        fields: Prisma.SystemStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload>
          }
          findFirst: {
            args: Prisma.SystemStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload>
          }
          findMany: {
            args: Prisma.SystemStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload>[]
          }
          create: {
            args: Prisma.SystemStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload>
          }
          createMany: {
            args: Prisma.SystemStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload>[]
          }
          delete: {
            args: Prisma.SystemStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload>
          }
          update: {
            args: Prisma.SystemStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload>
          }
          deleteMany: {
            args: Prisma.SystemStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SystemStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemStatePayload>
          }
          aggregate: {
            args: Prisma.SystemStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemState>
          }
          groupBy: {
            args: Prisma.SystemStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemStateCountArgs<ExtArgs>
            result: $Utils.Optional<SystemStateCountAggregateOutputType> | number
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
   * Count Type DnfDocumentCountOutputType
   */

  export type DnfDocumentCountOutputType = {
    correctiveActions: number
  }

  export type DnfDocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    correctiveActions?: boolean | DnfDocumentCountOutputTypeCountCorrectiveActionsArgs
  }

  // Custom InputTypes
  /**
   * DnfDocumentCountOutputType without action
   */
  export type DnfDocumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocumentCountOutputType
     */
    select?: DnfDocumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DnfDocumentCountOutputType without action
   */
  export type DnfDocumentCountOutputTypeCountCorrectiveActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorrectiveActionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SystemLog
   */

  export type AggregateSystemLog = {
    _count: SystemLogCountAggregateOutputType | null
    _min: SystemLogMinAggregateOutputType | null
    _max: SystemLogMaxAggregateOutputType | null
  }

  export type SystemLogMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    userId: string | null
    userName: string | null
    action: string | null
    level: string | null
    details: string | null
    category: string | null
    deletedAt: Date | null
  }

  export type SystemLogMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    userId: string | null
    userName: string | null
    action: string | null
    level: string | null
    details: string | null
    category: string | null
    deletedAt: Date | null
  }

  export type SystemLogCountAggregateOutputType = {
    id: number
    timestamp: number
    userId: number
    userName: number
    action: number
    level: number
    details: number
    category: number
    deletedAt: number
    _all: number
  }


  export type SystemLogMinAggregateInputType = {
    id?: true
    timestamp?: true
    userId?: true
    userName?: true
    action?: true
    level?: true
    details?: true
    category?: true
    deletedAt?: true
  }

  export type SystemLogMaxAggregateInputType = {
    id?: true
    timestamp?: true
    userId?: true
    userName?: true
    action?: true
    level?: true
    details?: true
    category?: true
    deletedAt?: true
  }

  export type SystemLogCountAggregateInputType = {
    id?: true
    timestamp?: true
    userId?: true
    userName?: true
    action?: true
    level?: true
    details?: true
    category?: true
    deletedAt?: true
    _all?: true
  }

  export type SystemLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemLog to aggregate.
     */
    where?: SystemLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemLogs to fetch.
     */
    orderBy?: SystemLogOrderByWithRelationInput | SystemLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemLogs
    **/
    _count?: true | SystemLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemLogMaxAggregateInputType
  }

  export type GetSystemLogAggregateType<T extends SystemLogAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemLog[P]>
      : GetScalarType<T[P], AggregateSystemLog[P]>
  }




  export type SystemLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemLogWhereInput
    orderBy?: SystemLogOrderByWithAggregationInput | SystemLogOrderByWithAggregationInput[]
    by: SystemLogScalarFieldEnum[] | SystemLogScalarFieldEnum
    having?: SystemLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemLogCountAggregateInputType | true
    _min?: SystemLogMinAggregateInputType
    _max?: SystemLogMaxAggregateInputType
  }

  export type SystemLogGroupByOutputType = {
    id: string
    timestamp: Date
    userId: string
    userName: string
    action: string
    level: string
    details: string
    category: string
    deletedAt: Date | null
    _count: SystemLogCountAggregateOutputType | null
    _min: SystemLogMinAggregateOutputType | null
    _max: SystemLogMaxAggregateOutputType | null
  }

  type GetSystemLogGroupByPayload<T extends SystemLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemLogGroupByOutputType[P]>
            : GetScalarType<T[P], SystemLogGroupByOutputType[P]>
        }
      >
    >


  export type SystemLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    userId?: boolean
    userName?: boolean
    action?: boolean
    level?: boolean
    details?: boolean
    category?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["systemLog"]>

  export type SystemLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    userId?: boolean
    userName?: boolean
    action?: boolean
    level?: boolean
    details?: boolean
    category?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["systemLog"]>

  export type SystemLogSelectScalar = {
    id?: boolean
    timestamp?: boolean
    userId?: boolean
    userName?: boolean
    action?: boolean
    level?: boolean
    details?: boolean
    category?: boolean
    deletedAt?: boolean
  }


  export type $SystemLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      userId: string
      userName: string
      action: string
      level: string
      details: string
      category: string
      deletedAt: Date | null
    }, ExtArgs["result"]["systemLog"]>
    composites: {}
  }

  type SystemLogGetPayload<S extends boolean | null | undefined | SystemLogDefaultArgs> = $Result.GetResult<Prisma.$SystemLogPayload, S>

  type SystemLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SystemLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SystemLogCountAggregateInputType | true
    }

  export interface SystemLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemLog'], meta: { name: 'SystemLog' } }
    /**
     * Find zero or one SystemLog that matches the filter.
     * @param {SystemLogFindUniqueArgs} args - Arguments to find a SystemLog
     * @example
     * // Get one SystemLog
     * const systemLog = await prisma.systemLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemLogFindUniqueArgs>(args: SelectSubset<T, SystemLogFindUniqueArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SystemLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SystemLogFindUniqueOrThrowArgs} args - Arguments to find a SystemLog
     * @example
     * // Get one SystemLog
     * const systemLog = await prisma.systemLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemLogFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SystemLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogFindFirstArgs} args - Arguments to find a SystemLog
     * @example
     * // Get one SystemLog
     * const systemLog = await prisma.systemLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemLogFindFirstArgs>(args?: SelectSubset<T, SystemLogFindFirstArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SystemLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogFindFirstOrThrowArgs} args - Arguments to find a SystemLog
     * @example
     * // Get one SystemLog
     * const systemLog = await prisma.systemLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemLogFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SystemLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemLogs
     * const systemLogs = await prisma.systemLog.findMany()
     * 
     * // Get first 10 SystemLogs
     * const systemLogs = await prisma.systemLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemLogWithIdOnly = await prisma.systemLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemLogFindManyArgs>(args?: SelectSubset<T, SystemLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SystemLog.
     * @param {SystemLogCreateArgs} args - Arguments to create a SystemLog.
     * @example
     * // Create one SystemLog
     * const SystemLog = await prisma.systemLog.create({
     *   data: {
     *     // ... data to create a SystemLog
     *   }
     * })
     * 
     */
    create<T extends SystemLogCreateArgs>(args: SelectSubset<T, SystemLogCreateArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SystemLogs.
     * @param {SystemLogCreateManyArgs} args - Arguments to create many SystemLogs.
     * @example
     * // Create many SystemLogs
     * const systemLog = await prisma.systemLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemLogCreateManyArgs>(args?: SelectSubset<T, SystemLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemLogs and returns the data saved in the database.
     * @param {SystemLogCreateManyAndReturnArgs} args - Arguments to create many SystemLogs.
     * @example
     * // Create many SystemLogs
     * const systemLog = await prisma.systemLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemLogs and only return the `id`
     * const systemLogWithIdOnly = await prisma.systemLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemLogCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SystemLog.
     * @param {SystemLogDeleteArgs} args - Arguments to delete one SystemLog.
     * @example
     * // Delete one SystemLog
     * const SystemLog = await prisma.systemLog.delete({
     *   where: {
     *     // ... filter to delete one SystemLog
     *   }
     * })
     * 
     */
    delete<T extends SystemLogDeleteArgs>(args: SelectSubset<T, SystemLogDeleteArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SystemLog.
     * @param {SystemLogUpdateArgs} args - Arguments to update one SystemLog.
     * @example
     * // Update one SystemLog
     * const systemLog = await prisma.systemLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemLogUpdateArgs>(args: SelectSubset<T, SystemLogUpdateArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SystemLogs.
     * @param {SystemLogDeleteManyArgs} args - Arguments to filter SystemLogs to delete.
     * @example
     * // Delete a few SystemLogs
     * const { count } = await prisma.systemLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemLogDeleteManyArgs>(args?: SelectSubset<T, SystemLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemLogs
     * const systemLog = await prisma.systemLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemLogUpdateManyArgs>(args: SelectSubset<T, SystemLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SystemLog.
     * @param {SystemLogUpsertArgs} args - Arguments to update or create a SystemLog.
     * @example
     * // Update or create a SystemLog
     * const systemLog = await prisma.systemLog.upsert({
     *   create: {
     *     // ... data to create a SystemLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemLog we want to update
     *   }
     * })
     */
    upsert<T extends SystemLogUpsertArgs>(args: SelectSubset<T, SystemLogUpsertArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SystemLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogCountArgs} args - Arguments to filter SystemLogs to count.
     * @example
     * // Count the number of SystemLogs
     * const count = await prisma.systemLog.count({
     *   where: {
     *     // ... the filter for the SystemLogs we want to count
     *   }
     * })
    **/
    count<T extends SystemLogCountArgs>(
      args?: Subset<T, SystemLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SystemLogAggregateArgs>(args: Subset<T, SystemLogAggregateArgs>): Prisma.PrismaPromise<GetSystemLogAggregateType<T>>

    /**
     * Group by SystemLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogGroupByArgs} args - Group by arguments.
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
      T extends SystemLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemLogGroupByArgs['orderBy'] }
        : { orderBy?: SystemLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SystemLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemLog model
   */
  readonly fields: SystemLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SystemLog model
   */ 
  interface SystemLogFieldRefs {
    readonly id: FieldRef<"SystemLog", 'String'>
    readonly timestamp: FieldRef<"SystemLog", 'DateTime'>
    readonly userId: FieldRef<"SystemLog", 'String'>
    readonly userName: FieldRef<"SystemLog", 'String'>
    readonly action: FieldRef<"SystemLog", 'String'>
    readonly level: FieldRef<"SystemLog", 'String'>
    readonly details: FieldRef<"SystemLog", 'String'>
    readonly category: FieldRef<"SystemLog", 'String'>
    readonly deletedAt: FieldRef<"SystemLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemLog findUnique
   */
  export type SystemLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLog to fetch.
     */
    where: SystemLogWhereUniqueInput
  }

  /**
   * SystemLog findUniqueOrThrow
   */
  export type SystemLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLog to fetch.
     */
    where: SystemLogWhereUniqueInput
  }

  /**
   * SystemLog findFirst
   */
  export type SystemLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLog to fetch.
     */
    where?: SystemLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemLogs to fetch.
     */
    orderBy?: SystemLogOrderByWithRelationInput | SystemLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemLogs.
     */
    cursor?: SystemLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemLogs.
     */
    distinct?: SystemLogScalarFieldEnum | SystemLogScalarFieldEnum[]
  }

  /**
   * SystemLog findFirstOrThrow
   */
  export type SystemLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLog to fetch.
     */
    where?: SystemLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemLogs to fetch.
     */
    orderBy?: SystemLogOrderByWithRelationInput | SystemLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemLogs.
     */
    cursor?: SystemLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemLogs.
     */
    distinct?: SystemLogScalarFieldEnum | SystemLogScalarFieldEnum[]
  }

  /**
   * SystemLog findMany
   */
  export type SystemLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLogs to fetch.
     */
    where?: SystemLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemLogs to fetch.
     */
    orderBy?: SystemLogOrderByWithRelationInput | SystemLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemLogs.
     */
    cursor?: SystemLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemLogs.
     */
    skip?: number
    distinct?: SystemLogScalarFieldEnum | SystemLogScalarFieldEnum[]
  }

  /**
   * SystemLog create
   */
  export type SystemLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * The data needed to create a SystemLog.
     */
    data: XOR<SystemLogCreateInput, SystemLogUncheckedCreateInput>
  }

  /**
   * SystemLog createMany
   */
  export type SystemLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemLogs.
     */
    data: SystemLogCreateManyInput | SystemLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemLog createManyAndReturn
   */
  export type SystemLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SystemLogs.
     */
    data: SystemLogCreateManyInput | SystemLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemLog update
   */
  export type SystemLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * The data needed to update a SystemLog.
     */
    data: XOR<SystemLogUpdateInput, SystemLogUncheckedUpdateInput>
    /**
     * Choose, which SystemLog to update.
     */
    where: SystemLogWhereUniqueInput
  }

  /**
   * SystemLog updateMany
   */
  export type SystemLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemLogs.
     */
    data: XOR<SystemLogUpdateManyMutationInput, SystemLogUncheckedUpdateManyInput>
    /**
     * Filter which SystemLogs to update
     */
    where?: SystemLogWhereInput
  }

  /**
   * SystemLog upsert
   */
  export type SystemLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * The filter to search for the SystemLog to update in case it exists.
     */
    where: SystemLogWhereUniqueInput
    /**
     * In case the SystemLog found by the `where` argument doesn't exist, create a new SystemLog with this data.
     */
    create: XOR<SystemLogCreateInput, SystemLogUncheckedCreateInput>
    /**
     * In case the SystemLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemLogUpdateInput, SystemLogUncheckedUpdateInput>
  }

  /**
   * SystemLog delete
   */
  export type SystemLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter which SystemLog to delete.
     */
    where: SystemLogWhereUniqueInput
  }

  /**
   * SystemLog deleteMany
   */
  export type SystemLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemLogs to delete
     */
    where?: SystemLogWhereInput
  }

  /**
   * SystemLog without action
   */
  export type SystemLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
  }


  /**
   * Model ResponsibleUnit
   */

  export type AggregateResponsibleUnit = {
    _count: ResponsibleUnitCountAggregateOutputType | null
    _min: ResponsibleUnitMinAggregateOutputType | null
    _max: ResponsibleUnitMaxAggregateOutputType | null
  }

  export type ResponsibleUnitMinAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type ResponsibleUnitMaxAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type ResponsibleUnitCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type ResponsibleUnitMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type ResponsibleUnitMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type ResponsibleUnitCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type ResponsibleUnitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResponsibleUnit to aggregate.
     */
    where?: ResponsibleUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResponsibleUnits to fetch.
     */
    orderBy?: ResponsibleUnitOrderByWithRelationInput | ResponsibleUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResponsibleUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResponsibleUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResponsibleUnits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ResponsibleUnits
    **/
    _count?: true | ResponsibleUnitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResponsibleUnitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResponsibleUnitMaxAggregateInputType
  }

  export type GetResponsibleUnitAggregateType<T extends ResponsibleUnitAggregateArgs> = {
        [P in keyof T & keyof AggregateResponsibleUnit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResponsibleUnit[P]>
      : GetScalarType<T[P], AggregateResponsibleUnit[P]>
  }




  export type ResponsibleUnitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResponsibleUnitWhereInput
    orderBy?: ResponsibleUnitOrderByWithAggregationInput | ResponsibleUnitOrderByWithAggregationInput[]
    by: ResponsibleUnitScalarFieldEnum[] | ResponsibleUnitScalarFieldEnum
    having?: ResponsibleUnitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResponsibleUnitCountAggregateInputType | true
    _min?: ResponsibleUnitMinAggregateInputType
    _max?: ResponsibleUnitMaxAggregateInputType
  }

  export type ResponsibleUnitGroupByOutputType = {
    id: string
    name: string
    _count: ResponsibleUnitCountAggregateOutputType | null
    _min: ResponsibleUnitMinAggregateOutputType | null
    _max: ResponsibleUnitMaxAggregateOutputType | null
  }

  type GetResponsibleUnitGroupByPayload<T extends ResponsibleUnitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResponsibleUnitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResponsibleUnitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResponsibleUnitGroupByOutputType[P]>
            : GetScalarType<T[P], ResponsibleUnitGroupByOutputType[P]>
        }
      >
    >


  export type ResponsibleUnitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["responsibleUnit"]>

  export type ResponsibleUnitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["responsibleUnit"]>

  export type ResponsibleUnitSelectScalar = {
    id?: boolean
    name?: boolean
  }


  export type $ResponsibleUnitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ResponsibleUnit"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
    }, ExtArgs["result"]["responsibleUnit"]>
    composites: {}
  }

  type ResponsibleUnitGetPayload<S extends boolean | null | undefined | ResponsibleUnitDefaultArgs> = $Result.GetResult<Prisma.$ResponsibleUnitPayload, S>

  type ResponsibleUnitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ResponsibleUnitFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ResponsibleUnitCountAggregateInputType | true
    }

  export interface ResponsibleUnitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ResponsibleUnit'], meta: { name: 'ResponsibleUnit' } }
    /**
     * Find zero or one ResponsibleUnit that matches the filter.
     * @param {ResponsibleUnitFindUniqueArgs} args - Arguments to find a ResponsibleUnit
     * @example
     * // Get one ResponsibleUnit
     * const responsibleUnit = await prisma.responsibleUnit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResponsibleUnitFindUniqueArgs>(args: SelectSubset<T, ResponsibleUnitFindUniqueArgs<ExtArgs>>): Prisma__ResponsibleUnitClient<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ResponsibleUnit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ResponsibleUnitFindUniqueOrThrowArgs} args - Arguments to find a ResponsibleUnit
     * @example
     * // Get one ResponsibleUnit
     * const responsibleUnit = await prisma.responsibleUnit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResponsibleUnitFindUniqueOrThrowArgs>(args: SelectSubset<T, ResponsibleUnitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResponsibleUnitClient<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ResponsibleUnit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponsibleUnitFindFirstArgs} args - Arguments to find a ResponsibleUnit
     * @example
     * // Get one ResponsibleUnit
     * const responsibleUnit = await prisma.responsibleUnit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResponsibleUnitFindFirstArgs>(args?: SelectSubset<T, ResponsibleUnitFindFirstArgs<ExtArgs>>): Prisma__ResponsibleUnitClient<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ResponsibleUnit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponsibleUnitFindFirstOrThrowArgs} args - Arguments to find a ResponsibleUnit
     * @example
     * // Get one ResponsibleUnit
     * const responsibleUnit = await prisma.responsibleUnit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResponsibleUnitFindFirstOrThrowArgs>(args?: SelectSubset<T, ResponsibleUnitFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResponsibleUnitClient<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ResponsibleUnits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponsibleUnitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ResponsibleUnits
     * const responsibleUnits = await prisma.responsibleUnit.findMany()
     * 
     * // Get first 10 ResponsibleUnits
     * const responsibleUnits = await prisma.responsibleUnit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const responsibleUnitWithIdOnly = await prisma.responsibleUnit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResponsibleUnitFindManyArgs>(args?: SelectSubset<T, ResponsibleUnitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ResponsibleUnit.
     * @param {ResponsibleUnitCreateArgs} args - Arguments to create a ResponsibleUnit.
     * @example
     * // Create one ResponsibleUnit
     * const ResponsibleUnit = await prisma.responsibleUnit.create({
     *   data: {
     *     // ... data to create a ResponsibleUnit
     *   }
     * })
     * 
     */
    create<T extends ResponsibleUnitCreateArgs>(args: SelectSubset<T, ResponsibleUnitCreateArgs<ExtArgs>>): Prisma__ResponsibleUnitClient<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ResponsibleUnits.
     * @param {ResponsibleUnitCreateManyArgs} args - Arguments to create many ResponsibleUnits.
     * @example
     * // Create many ResponsibleUnits
     * const responsibleUnit = await prisma.responsibleUnit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResponsibleUnitCreateManyArgs>(args?: SelectSubset<T, ResponsibleUnitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ResponsibleUnits and returns the data saved in the database.
     * @param {ResponsibleUnitCreateManyAndReturnArgs} args - Arguments to create many ResponsibleUnits.
     * @example
     * // Create many ResponsibleUnits
     * const responsibleUnit = await prisma.responsibleUnit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ResponsibleUnits and only return the `id`
     * const responsibleUnitWithIdOnly = await prisma.responsibleUnit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResponsibleUnitCreateManyAndReturnArgs>(args?: SelectSubset<T, ResponsibleUnitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ResponsibleUnit.
     * @param {ResponsibleUnitDeleteArgs} args - Arguments to delete one ResponsibleUnit.
     * @example
     * // Delete one ResponsibleUnit
     * const ResponsibleUnit = await prisma.responsibleUnit.delete({
     *   where: {
     *     // ... filter to delete one ResponsibleUnit
     *   }
     * })
     * 
     */
    delete<T extends ResponsibleUnitDeleteArgs>(args: SelectSubset<T, ResponsibleUnitDeleteArgs<ExtArgs>>): Prisma__ResponsibleUnitClient<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ResponsibleUnit.
     * @param {ResponsibleUnitUpdateArgs} args - Arguments to update one ResponsibleUnit.
     * @example
     * // Update one ResponsibleUnit
     * const responsibleUnit = await prisma.responsibleUnit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResponsibleUnitUpdateArgs>(args: SelectSubset<T, ResponsibleUnitUpdateArgs<ExtArgs>>): Prisma__ResponsibleUnitClient<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ResponsibleUnits.
     * @param {ResponsibleUnitDeleteManyArgs} args - Arguments to filter ResponsibleUnits to delete.
     * @example
     * // Delete a few ResponsibleUnits
     * const { count } = await prisma.responsibleUnit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResponsibleUnitDeleteManyArgs>(args?: SelectSubset<T, ResponsibleUnitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResponsibleUnits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponsibleUnitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ResponsibleUnits
     * const responsibleUnit = await prisma.responsibleUnit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResponsibleUnitUpdateManyArgs>(args: SelectSubset<T, ResponsibleUnitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ResponsibleUnit.
     * @param {ResponsibleUnitUpsertArgs} args - Arguments to update or create a ResponsibleUnit.
     * @example
     * // Update or create a ResponsibleUnit
     * const responsibleUnit = await prisma.responsibleUnit.upsert({
     *   create: {
     *     // ... data to create a ResponsibleUnit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ResponsibleUnit we want to update
     *   }
     * })
     */
    upsert<T extends ResponsibleUnitUpsertArgs>(args: SelectSubset<T, ResponsibleUnitUpsertArgs<ExtArgs>>): Prisma__ResponsibleUnitClient<$Result.GetResult<Prisma.$ResponsibleUnitPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ResponsibleUnits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponsibleUnitCountArgs} args - Arguments to filter ResponsibleUnits to count.
     * @example
     * // Count the number of ResponsibleUnits
     * const count = await prisma.responsibleUnit.count({
     *   where: {
     *     // ... the filter for the ResponsibleUnits we want to count
     *   }
     * })
    **/
    count<T extends ResponsibleUnitCountArgs>(
      args?: Subset<T, ResponsibleUnitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResponsibleUnitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ResponsibleUnit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponsibleUnitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ResponsibleUnitAggregateArgs>(args: Subset<T, ResponsibleUnitAggregateArgs>): Prisma.PrismaPromise<GetResponsibleUnitAggregateType<T>>

    /**
     * Group by ResponsibleUnit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponsibleUnitGroupByArgs} args - Group by arguments.
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
      T extends ResponsibleUnitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResponsibleUnitGroupByArgs['orderBy'] }
        : { orderBy?: ResponsibleUnitGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ResponsibleUnitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResponsibleUnitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ResponsibleUnit model
   */
  readonly fields: ResponsibleUnitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ResponsibleUnit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResponsibleUnitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ResponsibleUnit model
   */ 
  interface ResponsibleUnitFieldRefs {
    readonly id: FieldRef<"ResponsibleUnit", 'String'>
    readonly name: FieldRef<"ResponsibleUnit", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ResponsibleUnit findUnique
   */
  export type ResponsibleUnitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
    /**
     * Filter, which ResponsibleUnit to fetch.
     */
    where: ResponsibleUnitWhereUniqueInput
  }

  /**
   * ResponsibleUnit findUniqueOrThrow
   */
  export type ResponsibleUnitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
    /**
     * Filter, which ResponsibleUnit to fetch.
     */
    where: ResponsibleUnitWhereUniqueInput
  }

  /**
   * ResponsibleUnit findFirst
   */
  export type ResponsibleUnitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
    /**
     * Filter, which ResponsibleUnit to fetch.
     */
    where?: ResponsibleUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResponsibleUnits to fetch.
     */
    orderBy?: ResponsibleUnitOrderByWithRelationInput | ResponsibleUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResponsibleUnits.
     */
    cursor?: ResponsibleUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResponsibleUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResponsibleUnits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResponsibleUnits.
     */
    distinct?: ResponsibleUnitScalarFieldEnum | ResponsibleUnitScalarFieldEnum[]
  }

  /**
   * ResponsibleUnit findFirstOrThrow
   */
  export type ResponsibleUnitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
    /**
     * Filter, which ResponsibleUnit to fetch.
     */
    where?: ResponsibleUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResponsibleUnits to fetch.
     */
    orderBy?: ResponsibleUnitOrderByWithRelationInput | ResponsibleUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResponsibleUnits.
     */
    cursor?: ResponsibleUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResponsibleUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResponsibleUnits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResponsibleUnits.
     */
    distinct?: ResponsibleUnitScalarFieldEnum | ResponsibleUnitScalarFieldEnum[]
  }

  /**
   * ResponsibleUnit findMany
   */
  export type ResponsibleUnitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
    /**
     * Filter, which ResponsibleUnits to fetch.
     */
    where?: ResponsibleUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResponsibleUnits to fetch.
     */
    orderBy?: ResponsibleUnitOrderByWithRelationInput | ResponsibleUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ResponsibleUnits.
     */
    cursor?: ResponsibleUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResponsibleUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResponsibleUnits.
     */
    skip?: number
    distinct?: ResponsibleUnitScalarFieldEnum | ResponsibleUnitScalarFieldEnum[]
  }

  /**
   * ResponsibleUnit create
   */
  export type ResponsibleUnitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
    /**
     * The data needed to create a ResponsibleUnit.
     */
    data: XOR<ResponsibleUnitCreateInput, ResponsibleUnitUncheckedCreateInput>
  }

  /**
   * ResponsibleUnit createMany
   */
  export type ResponsibleUnitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ResponsibleUnits.
     */
    data: ResponsibleUnitCreateManyInput | ResponsibleUnitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ResponsibleUnit createManyAndReturn
   */
  export type ResponsibleUnitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ResponsibleUnits.
     */
    data: ResponsibleUnitCreateManyInput | ResponsibleUnitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ResponsibleUnit update
   */
  export type ResponsibleUnitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
    /**
     * The data needed to update a ResponsibleUnit.
     */
    data: XOR<ResponsibleUnitUpdateInput, ResponsibleUnitUncheckedUpdateInput>
    /**
     * Choose, which ResponsibleUnit to update.
     */
    where: ResponsibleUnitWhereUniqueInput
  }

  /**
   * ResponsibleUnit updateMany
   */
  export type ResponsibleUnitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ResponsibleUnits.
     */
    data: XOR<ResponsibleUnitUpdateManyMutationInput, ResponsibleUnitUncheckedUpdateManyInput>
    /**
     * Filter which ResponsibleUnits to update
     */
    where?: ResponsibleUnitWhereInput
  }

  /**
   * ResponsibleUnit upsert
   */
  export type ResponsibleUnitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
    /**
     * The filter to search for the ResponsibleUnit to update in case it exists.
     */
    where: ResponsibleUnitWhereUniqueInput
    /**
     * In case the ResponsibleUnit found by the `where` argument doesn't exist, create a new ResponsibleUnit with this data.
     */
    create: XOR<ResponsibleUnitCreateInput, ResponsibleUnitUncheckedCreateInput>
    /**
     * In case the ResponsibleUnit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResponsibleUnitUpdateInput, ResponsibleUnitUncheckedUpdateInput>
  }

  /**
   * ResponsibleUnit delete
   */
  export type ResponsibleUnitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
    /**
     * Filter which ResponsibleUnit to delete.
     */
    where: ResponsibleUnitWhereUniqueInput
  }

  /**
   * ResponsibleUnit deleteMany
   */
  export type ResponsibleUnitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResponsibleUnits to delete
     */
    where?: ResponsibleUnitWhereInput
  }

  /**
   * ResponsibleUnit without action
   */
  export type ResponsibleUnitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResponsibleUnit
     */
    select?: ResponsibleUnitSelect<ExtArgs> | null
  }


  /**
   * Model Subsystem
   */

  export type AggregateSubsystem = {
    _count: SubsystemCountAggregateOutputType | null
    _min: SubsystemMinAggregateOutputType | null
    _max: SubsystemMaxAggregateOutputType | null
  }

  export type SubsystemMinAggregateOutputType = {
    id: string | null
  }

  export type SubsystemMaxAggregateOutputType = {
    id: string | null
  }

  export type SubsystemCountAggregateOutputType = {
    id: number
    label: number
    _all: number
  }


  export type SubsystemMinAggregateInputType = {
    id?: true
  }

  export type SubsystemMaxAggregateInputType = {
    id?: true
  }

  export type SubsystemCountAggregateInputType = {
    id?: true
    label?: true
    _all?: true
  }

  export type SubsystemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subsystem to aggregate.
     */
    where?: SubsystemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subsystems to fetch.
     */
    orderBy?: SubsystemOrderByWithRelationInput | SubsystemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubsystemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subsystems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subsystems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subsystems
    **/
    _count?: true | SubsystemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubsystemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubsystemMaxAggregateInputType
  }

  export type GetSubsystemAggregateType<T extends SubsystemAggregateArgs> = {
        [P in keyof T & keyof AggregateSubsystem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubsystem[P]>
      : GetScalarType<T[P], AggregateSubsystem[P]>
  }




  export type SubsystemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubsystemWhereInput
    orderBy?: SubsystemOrderByWithAggregationInput | SubsystemOrderByWithAggregationInput[]
    by: SubsystemScalarFieldEnum[] | SubsystemScalarFieldEnum
    having?: SubsystemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubsystemCountAggregateInputType | true
    _min?: SubsystemMinAggregateInputType
    _max?: SubsystemMaxAggregateInputType
  }

  export type SubsystemGroupByOutputType = {
    id: string
    label: JsonValue
    _count: SubsystemCountAggregateOutputType | null
    _min: SubsystemMinAggregateOutputType | null
    _max: SubsystemMaxAggregateOutputType | null
  }

  type GetSubsystemGroupByPayload<T extends SubsystemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubsystemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubsystemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubsystemGroupByOutputType[P]>
            : GetScalarType<T[P], SubsystemGroupByOutputType[P]>
        }
      >
    >


  export type SubsystemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
  }, ExtArgs["result"]["subsystem"]>

  export type SubsystemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
  }, ExtArgs["result"]["subsystem"]>

  export type SubsystemSelectScalar = {
    id?: boolean
    label?: boolean
  }


  export type $SubsystemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subsystem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      label: Prisma.JsonValue
    }, ExtArgs["result"]["subsystem"]>
    composites: {}
  }

  type SubsystemGetPayload<S extends boolean | null | undefined | SubsystemDefaultArgs> = $Result.GetResult<Prisma.$SubsystemPayload, S>

  type SubsystemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubsystemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubsystemCountAggregateInputType | true
    }

  export interface SubsystemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subsystem'], meta: { name: 'Subsystem' } }
    /**
     * Find zero or one Subsystem that matches the filter.
     * @param {SubsystemFindUniqueArgs} args - Arguments to find a Subsystem
     * @example
     * // Get one Subsystem
     * const subsystem = await prisma.subsystem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubsystemFindUniqueArgs>(args: SelectSubset<T, SubsystemFindUniqueArgs<ExtArgs>>): Prisma__SubsystemClient<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Subsystem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubsystemFindUniqueOrThrowArgs} args - Arguments to find a Subsystem
     * @example
     * // Get one Subsystem
     * const subsystem = await prisma.subsystem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubsystemFindUniqueOrThrowArgs>(args: SelectSubset<T, SubsystemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubsystemClient<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Subsystem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubsystemFindFirstArgs} args - Arguments to find a Subsystem
     * @example
     * // Get one Subsystem
     * const subsystem = await prisma.subsystem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubsystemFindFirstArgs>(args?: SelectSubset<T, SubsystemFindFirstArgs<ExtArgs>>): Prisma__SubsystemClient<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Subsystem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubsystemFindFirstOrThrowArgs} args - Arguments to find a Subsystem
     * @example
     * // Get one Subsystem
     * const subsystem = await prisma.subsystem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubsystemFindFirstOrThrowArgs>(args?: SelectSubset<T, SubsystemFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubsystemClient<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Subsystems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubsystemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subsystems
     * const subsystems = await prisma.subsystem.findMany()
     * 
     * // Get first 10 Subsystems
     * const subsystems = await prisma.subsystem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subsystemWithIdOnly = await prisma.subsystem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubsystemFindManyArgs>(args?: SelectSubset<T, SubsystemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Subsystem.
     * @param {SubsystemCreateArgs} args - Arguments to create a Subsystem.
     * @example
     * // Create one Subsystem
     * const Subsystem = await prisma.subsystem.create({
     *   data: {
     *     // ... data to create a Subsystem
     *   }
     * })
     * 
     */
    create<T extends SubsystemCreateArgs>(args: SelectSubset<T, SubsystemCreateArgs<ExtArgs>>): Prisma__SubsystemClient<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Subsystems.
     * @param {SubsystemCreateManyArgs} args - Arguments to create many Subsystems.
     * @example
     * // Create many Subsystems
     * const subsystem = await prisma.subsystem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubsystemCreateManyArgs>(args?: SelectSubset<T, SubsystemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subsystems and returns the data saved in the database.
     * @param {SubsystemCreateManyAndReturnArgs} args - Arguments to create many Subsystems.
     * @example
     * // Create many Subsystems
     * const subsystem = await prisma.subsystem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subsystems and only return the `id`
     * const subsystemWithIdOnly = await prisma.subsystem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubsystemCreateManyAndReturnArgs>(args?: SelectSubset<T, SubsystemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Subsystem.
     * @param {SubsystemDeleteArgs} args - Arguments to delete one Subsystem.
     * @example
     * // Delete one Subsystem
     * const Subsystem = await prisma.subsystem.delete({
     *   where: {
     *     // ... filter to delete one Subsystem
     *   }
     * })
     * 
     */
    delete<T extends SubsystemDeleteArgs>(args: SelectSubset<T, SubsystemDeleteArgs<ExtArgs>>): Prisma__SubsystemClient<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Subsystem.
     * @param {SubsystemUpdateArgs} args - Arguments to update one Subsystem.
     * @example
     * // Update one Subsystem
     * const subsystem = await prisma.subsystem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubsystemUpdateArgs>(args: SelectSubset<T, SubsystemUpdateArgs<ExtArgs>>): Prisma__SubsystemClient<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Subsystems.
     * @param {SubsystemDeleteManyArgs} args - Arguments to filter Subsystems to delete.
     * @example
     * // Delete a few Subsystems
     * const { count } = await prisma.subsystem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubsystemDeleteManyArgs>(args?: SelectSubset<T, SubsystemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subsystems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubsystemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subsystems
     * const subsystem = await prisma.subsystem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubsystemUpdateManyArgs>(args: SelectSubset<T, SubsystemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subsystem.
     * @param {SubsystemUpsertArgs} args - Arguments to update or create a Subsystem.
     * @example
     * // Update or create a Subsystem
     * const subsystem = await prisma.subsystem.upsert({
     *   create: {
     *     // ... data to create a Subsystem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subsystem we want to update
     *   }
     * })
     */
    upsert<T extends SubsystemUpsertArgs>(args: SelectSubset<T, SubsystemUpsertArgs<ExtArgs>>): Prisma__SubsystemClient<$Result.GetResult<Prisma.$SubsystemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Subsystems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubsystemCountArgs} args - Arguments to filter Subsystems to count.
     * @example
     * // Count the number of Subsystems
     * const count = await prisma.subsystem.count({
     *   where: {
     *     // ... the filter for the Subsystems we want to count
     *   }
     * })
    **/
    count<T extends SubsystemCountArgs>(
      args?: Subset<T, SubsystemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubsystemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subsystem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubsystemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SubsystemAggregateArgs>(args: Subset<T, SubsystemAggregateArgs>): Prisma.PrismaPromise<GetSubsystemAggregateType<T>>

    /**
     * Group by Subsystem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubsystemGroupByArgs} args - Group by arguments.
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
      T extends SubsystemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubsystemGroupByArgs['orderBy'] }
        : { orderBy?: SubsystemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SubsystemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubsystemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subsystem model
   */
  readonly fields: SubsystemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subsystem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubsystemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Subsystem model
   */ 
  interface SubsystemFieldRefs {
    readonly id: FieldRef<"Subsystem", 'String'>
    readonly label: FieldRef<"Subsystem", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Subsystem findUnique
   */
  export type SubsystemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
    /**
     * Filter, which Subsystem to fetch.
     */
    where: SubsystemWhereUniqueInput
  }

  /**
   * Subsystem findUniqueOrThrow
   */
  export type SubsystemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
    /**
     * Filter, which Subsystem to fetch.
     */
    where: SubsystemWhereUniqueInput
  }

  /**
   * Subsystem findFirst
   */
  export type SubsystemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
    /**
     * Filter, which Subsystem to fetch.
     */
    where?: SubsystemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subsystems to fetch.
     */
    orderBy?: SubsystemOrderByWithRelationInput | SubsystemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subsystems.
     */
    cursor?: SubsystemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subsystems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subsystems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subsystems.
     */
    distinct?: SubsystemScalarFieldEnum | SubsystemScalarFieldEnum[]
  }

  /**
   * Subsystem findFirstOrThrow
   */
  export type SubsystemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
    /**
     * Filter, which Subsystem to fetch.
     */
    where?: SubsystemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subsystems to fetch.
     */
    orderBy?: SubsystemOrderByWithRelationInput | SubsystemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subsystems.
     */
    cursor?: SubsystemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subsystems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subsystems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subsystems.
     */
    distinct?: SubsystemScalarFieldEnum | SubsystemScalarFieldEnum[]
  }

  /**
   * Subsystem findMany
   */
  export type SubsystemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
    /**
     * Filter, which Subsystems to fetch.
     */
    where?: SubsystemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subsystems to fetch.
     */
    orderBy?: SubsystemOrderByWithRelationInput | SubsystemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subsystems.
     */
    cursor?: SubsystemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subsystems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subsystems.
     */
    skip?: number
    distinct?: SubsystemScalarFieldEnum | SubsystemScalarFieldEnum[]
  }

  /**
   * Subsystem create
   */
  export type SubsystemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
    /**
     * The data needed to create a Subsystem.
     */
    data: XOR<SubsystemCreateInput, SubsystemUncheckedCreateInput>
  }

  /**
   * Subsystem createMany
   */
  export type SubsystemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subsystems.
     */
    data: SubsystemCreateManyInput | SubsystemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subsystem createManyAndReturn
   */
  export type SubsystemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Subsystems.
     */
    data: SubsystemCreateManyInput | SubsystemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subsystem update
   */
  export type SubsystemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
    /**
     * The data needed to update a Subsystem.
     */
    data: XOR<SubsystemUpdateInput, SubsystemUncheckedUpdateInput>
    /**
     * Choose, which Subsystem to update.
     */
    where: SubsystemWhereUniqueInput
  }

  /**
   * Subsystem updateMany
   */
  export type SubsystemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subsystems.
     */
    data: XOR<SubsystemUpdateManyMutationInput, SubsystemUncheckedUpdateManyInput>
    /**
     * Filter which Subsystems to update
     */
    where?: SubsystemWhereInput
  }

  /**
   * Subsystem upsert
   */
  export type SubsystemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
    /**
     * The filter to search for the Subsystem to update in case it exists.
     */
    where: SubsystemWhereUniqueInput
    /**
     * In case the Subsystem found by the `where` argument doesn't exist, create a new Subsystem with this data.
     */
    create: XOR<SubsystemCreateInput, SubsystemUncheckedCreateInput>
    /**
     * In case the Subsystem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubsystemUpdateInput, SubsystemUncheckedUpdateInput>
  }

  /**
   * Subsystem delete
   */
  export type SubsystemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
    /**
     * Filter which Subsystem to delete.
     */
    where: SubsystemWhereUniqueInput
  }

  /**
   * Subsystem deleteMany
   */
  export type SubsystemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subsystems to delete
     */
    where?: SubsystemWhereInput
  }

  /**
   * Subsystem without action
   */
  export type SubsystemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subsystem
     */
    select?: SubsystemSelect<ExtArgs> | null
  }


  /**
   * Model PatrolLocation
   */

  export type AggregatePatrolLocation = {
    _count: PatrolLocationCountAggregateOutputType | null
    _min: PatrolLocationMinAggregateOutputType | null
    _max: PatrolLocationMaxAggregateOutputType | null
  }

  export type PatrolLocationMinAggregateOutputType = {
    id: string | null
    label: string | null
  }

  export type PatrolLocationMaxAggregateOutputType = {
    id: string | null
    label: string | null
  }

  export type PatrolLocationCountAggregateOutputType = {
    id: number
    label: number
    _all: number
  }


  export type PatrolLocationMinAggregateInputType = {
    id?: true
    label?: true
  }

  export type PatrolLocationMaxAggregateInputType = {
    id?: true
    label?: true
  }

  export type PatrolLocationCountAggregateInputType = {
    id?: true
    label?: true
    _all?: true
  }

  export type PatrolLocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatrolLocation to aggregate.
     */
    where?: PatrolLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatrolLocations to fetch.
     */
    orderBy?: PatrolLocationOrderByWithRelationInput | PatrolLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatrolLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatrolLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatrolLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatrolLocations
    **/
    _count?: true | PatrolLocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatrolLocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatrolLocationMaxAggregateInputType
  }

  export type GetPatrolLocationAggregateType<T extends PatrolLocationAggregateArgs> = {
        [P in keyof T & keyof AggregatePatrolLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatrolLocation[P]>
      : GetScalarType<T[P], AggregatePatrolLocation[P]>
  }




  export type PatrolLocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatrolLocationWhereInput
    orderBy?: PatrolLocationOrderByWithAggregationInput | PatrolLocationOrderByWithAggregationInput[]
    by: PatrolLocationScalarFieldEnum[] | PatrolLocationScalarFieldEnum
    having?: PatrolLocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatrolLocationCountAggregateInputType | true
    _min?: PatrolLocationMinAggregateInputType
    _max?: PatrolLocationMaxAggregateInputType
  }

  export type PatrolLocationGroupByOutputType = {
    id: string
    label: string
    _count: PatrolLocationCountAggregateOutputType | null
    _min: PatrolLocationMinAggregateOutputType | null
    _max: PatrolLocationMaxAggregateOutputType | null
  }

  type GetPatrolLocationGroupByPayload<T extends PatrolLocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatrolLocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatrolLocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatrolLocationGroupByOutputType[P]>
            : GetScalarType<T[P], PatrolLocationGroupByOutputType[P]>
        }
      >
    >


  export type PatrolLocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
  }, ExtArgs["result"]["patrolLocation"]>

  export type PatrolLocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
  }, ExtArgs["result"]["patrolLocation"]>

  export type PatrolLocationSelectScalar = {
    id?: boolean
    label?: boolean
  }


  export type $PatrolLocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatrolLocation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      label: string
    }, ExtArgs["result"]["patrolLocation"]>
    composites: {}
  }

  type PatrolLocationGetPayload<S extends boolean | null | undefined | PatrolLocationDefaultArgs> = $Result.GetResult<Prisma.$PatrolLocationPayload, S>

  type PatrolLocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatrolLocationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatrolLocationCountAggregateInputType | true
    }

  export interface PatrolLocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatrolLocation'], meta: { name: 'PatrolLocation' } }
    /**
     * Find zero or one PatrolLocation that matches the filter.
     * @param {PatrolLocationFindUniqueArgs} args - Arguments to find a PatrolLocation
     * @example
     * // Get one PatrolLocation
     * const patrolLocation = await prisma.patrolLocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatrolLocationFindUniqueArgs>(args: SelectSubset<T, PatrolLocationFindUniqueArgs<ExtArgs>>): Prisma__PatrolLocationClient<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatrolLocation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatrolLocationFindUniqueOrThrowArgs} args - Arguments to find a PatrolLocation
     * @example
     * // Get one PatrolLocation
     * const patrolLocation = await prisma.patrolLocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatrolLocationFindUniqueOrThrowArgs>(args: SelectSubset<T, PatrolLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatrolLocationClient<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatrolLocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatrolLocationFindFirstArgs} args - Arguments to find a PatrolLocation
     * @example
     * // Get one PatrolLocation
     * const patrolLocation = await prisma.patrolLocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatrolLocationFindFirstArgs>(args?: SelectSubset<T, PatrolLocationFindFirstArgs<ExtArgs>>): Prisma__PatrolLocationClient<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatrolLocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatrolLocationFindFirstOrThrowArgs} args - Arguments to find a PatrolLocation
     * @example
     * // Get one PatrolLocation
     * const patrolLocation = await prisma.patrolLocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatrolLocationFindFirstOrThrowArgs>(args?: SelectSubset<T, PatrolLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatrolLocationClient<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatrolLocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatrolLocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatrolLocations
     * const patrolLocations = await prisma.patrolLocation.findMany()
     * 
     * // Get first 10 PatrolLocations
     * const patrolLocations = await prisma.patrolLocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patrolLocationWithIdOnly = await prisma.patrolLocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatrolLocationFindManyArgs>(args?: SelectSubset<T, PatrolLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatrolLocation.
     * @param {PatrolLocationCreateArgs} args - Arguments to create a PatrolLocation.
     * @example
     * // Create one PatrolLocation
     * const PatrolLocation = await prisma.patrolLocation.create({
     *   data: {
     *     // ... data to create a PatrolLocation
     *   }
     * })
     * 
     */
    create<T extends PatrolLocationCreateArgs>(args: SelectSubset<T, PatrolLocationCreateArgs<ExtArgs>>): Prisma__PatrolLocationClient<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatrolLocations.
     * @param {PatrolLocationCreateManyArgs} args - Arguments to create many PatrolLocations.
     * @example
     * // Create many PatrolLocations
     * const patrolLocation = await prisma.patrolLocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatrolLocationCreateManyArgs>(args?: SelectSubset<T, PatrolLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatrolLocations and returns the data saved in the database.
     * @param {PatrolLocationCreateManyAndReturnArgs} args - Arguments to create many PatrolLocations.
     * @example
     * // Create many PatrolLocations
     * const patrolLocation = await prisma.patrolLocation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatrolLocations and only return the `id`
     * const patrolLocationWithIdOnly = await prisma.patrolLocation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatrolLocationCreateManyAndReturnArgs>(args?: SelectSubset<T, PatrolLocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatrolLocation.
     * @param {PatrolLocationDeleteArgs} args - Arguments to delete one PatrolLocation.
     * @example
     * // Delete one PatrolLocation
     * const PatrolLocation = await prisma.patrolLocation.delete({
     *   where: {
     *     // ... filter to delete one PatrolLocation
     *   }
     * })
     * 
     */
    delete<T extends PatrolLocationDeleteArgs>(args: SelectSubset<T, PatrolLocationDeleteArgs<ExtArgs>>): Prisma__PatrolLocationClient<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatrolLocation.
     * @param {PatrolLocationUpdateArgs} args - Arguments to update one PatrolLocation.
     * @example
     * // Update one PatrolLocation
     * const patrolLocation = await prisma.patrolLocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatrolLocationUpdateArgs>(args: SelectSubset<T, PatrolLocationUpdateArgs<ExtArgs>>): Prisma__PatrolLocationClient<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatrolLocations.
     * @param {PatrolLocationDeleteManyArgs} args - Arguments to filter PatrolLocations to delete.
     * @example
     * // Delete a few PatrolLocations
     * const { count } = await prisma.patrolLocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatrolLocationDeleteManyArgs>(args?: SelectSubset<T, PatrolLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatrolLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatrolLocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatrolLocations
     * const patrolLocation = await prisma.patrolLocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatrolLocationUpdateManyArgs>(args: SelectSubset<T, PatrolLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatrolLocation.
     * @param {PatrolLocationUpsertArgs} args - Arguments to update or create a PatrolLocation.
     * @example
     * // Update or create a PatrolLocation
     * const patrolLocation = await prisma.patrolLocation.upsert({
     *   create: {
     *     // ... data to create a PatrolLocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatrolLocation we want to update
     *   }
     * })
     */
    upsert<T extends PatrolLocationUpsertArgs>(args: SelectSubset<T, PatrolLocationUpsertArgs<ExtArgs>>): Prisma__PatrolLocationClient<$Result.GetResult<Prisma.$PatrolLocationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatrolLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatrolLocationCountArgs} args - Arguments to filter PatrolLocations to count.
     * @example
     * // Count the number of PatrolLocations
     * const count = await prisma.patrolLocation.count({
     *   where: {
     *     // ... the filter for the PatrolLocations we want to count
     *   }
     * })
    **/
    count<T extends PatrolLocationCountArgs>(
      args?: Subset<T, PatrolLocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatrolLocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatrolLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatrolLocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatrolLocationAggregateArgs>(args: Subset<T, PatrolLocationAggregateArgs>): Prisma.PrismaPromise<GetPatrolLocationAggregateType<T>>

    /**
     * Group by PatrolLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatrolLocationGroupByArgs} args - Group by arguments.
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
      T extends PatrolLocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatrolLocationGroupByArgs['orderBy'] }
        : { orderBy?: PatrolLocationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatrolLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatrolLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatrolLocation model
   */
  readonly fields: PatrolLocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatrolLocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatrolLocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PatrolLocation model
   */ 
  interface PatrolLocationFieldRefs {
    readonly id: FieldRef<"PatrolLocation", 'String'>
    readonly label: FieldRef<"PatrolLocation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PatrolLocation findUnique
   */
  export type PatrolLocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
    /**
     * Filter, which PatrolLocation to fetch.
     */
    where: PatrolLocationWhereUniqueInput
  }

  /**
   * PatrolLocation findUniqueOrThrow
   */
  export type PatrolLocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
    /**
     * Filter, which PatrolLocation to fetch.
     */
    where: PatrolLocationWhereUniqueInput
  }

  /**
   * PatrolLocation findFirst
   */
  export type PatrolLocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
    /**
     * Filter, which PatrolLocation to fetch.
     */
    where?: PatrolLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatrolLocations to fetch.
     */
    orderBy?: PatrolLocationOrderByWithRelationInput | PatrolLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatrolLocations.
     */
    cursor?: PatrolLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatrolLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatrolLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatrolLocations.
     */
    distinct?: PatrolLocationScalarFieldEnum | PatrolLocationScalarFieldEnum[]
  }

  /**
   * PatrolLocation findFirstOrThrow
   */
  export type PatrolLocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
    /**
     * Filter, which PatrolLocation to fetch.
     */
    where?: PatrolLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatrolLocations to fetch.
     */
    orderBy?: PatrolLocationOrderByWithRelationInput | PatrolLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatrolLocations.
     */
    cursor?: PatrolLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatrolLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatrolLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatrolLocations.
     */
    distinct?: PatrolLocationScalarFieldEnum | PatrolLocationScalarFieldEnum[]
  }

  /**
   * PatrolLocation findMany
   */
  export type PatrolLocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
    /**
     * Filter, which PatrolLocations to fetch.
     */
    where?: PatrolLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatrolLocations to fetch.
     */
    orderBy?: PatrolLocationOrderByWithRelationInput | PatrolLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatrolLocations.
     */
    cursor?: PatrolLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatrolLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatrolLocations.
     */
    skip?: number
    distinct?: PatrolLocationScalarFieldEnum | PatrolLocationScalarFieldEnum[]
  }

  /**
   * PatrolLocation create
   */
  export type PatrolLocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
    /**
     * The data needed to create a PatrolLocation.
     */
    data: XOR<PatrolLocationCreateInput, PatrolLocationUncheckedCreateInput>
  }

  /**
   * PatrolLocation createMany
   */
  export type PatrolLocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatrolLocations.
     */
    data: PatrolLocationCreateManyInput | PatrolLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatrolLocation createManyAndReturn
   */
  export type PatrolLocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatrolLocations.
     */
    data: PatrolLocationCreateManyInput | PatrolLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatrolLocation update
   */
  export type PatrolLocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
    /**
     * The data needed to update a PatrolLocation.
     */
    data: XOR<PatrolLocationUpdateInput, PatrolLocationUncheckedUpdateInput>
    /**
     * Choose, which PatrolLocation to update.
     */
    where: PatrolLocationWhereUniqueInput
  }

  /**
   * PatrolLocation updateMany
   */
  export type PatrolLocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatrolLocations.
     */
    data: XOR<PatrolLocationUpdateManyMutationInput, PatrolLocationUncheckedUpdateManyInput>
    /**
     * Filter which PatrolLocations to update
     */
    where?: PatrolLocationWhereInput
  }

  /**
   * PatrolLocation upsert
   */
  export type PatrolLocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
    /**
     * The filter to search for the PatrolLocation to update in case it exists.
     */
    where: PatrolLocationWhereUniqueInput
    /**
     * In case the PatrolLocation found by the `where` argument doesn't exist, create a new PatrolLocation with this data.
     */
    create: XOR<PatrolLocationCreateInput, PatrolLocationUncheckedCreateInput>
    /**
     * In case the PatrolLocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatrolLocationUpdateInput, PatrolLocationUncheckedUpdateInput>
  }

  /**
   * PatrolLocation delete
   */
  export type PatrolLocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
    /**
     * Filter which PatrolLocation to delete.
     */
    where: PatrolLocationWhereUniqueInput
  }

  /**
   * PatrolLocation deleteMany
   */
  export type PatrolLocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatrolLocations to delete
     */
    where?: PatrolLocationWhereInput
  }

  /**
   * PatrolLocation without action
   */
  export type PatrolLocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatrolLocation
     */
    select?: PatrolLocationSelect<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentMinAggregateOutputType = {
    id: string | null
    entityId: string | null
    senderId: string | null
    senderName: string | null
    timestamp: Date | null
    content: string | null
  }

  export type CommentMaxAggregateOutputType = {
    id: string | null
    entityId: string | null
    senderId: string | null
    senderName: string | null
    timestamp: Date | null
    content: string | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    entityId: number
    senderId: number
    senderName: number
    timestamp: number
    content: number
    _all: number
  }


  export type CommentMinAggregateInputType = {
    id?: true
    entityId?: true
    senderId?: true
    senderName?: true
    timestamp?: true
    content?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    entityId?: true
    senderId?: true
    senderName?: true
    timestamp?: true
    content?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    entityId?: true
    senderId?: true
    senderName?: true
    timestamp?: true
    content?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: string
    entityId: string
    senderId: string
    senderName: string
    timestamp: Date
    content: string
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entityId?: boolean
    senderId?: boolean
    senderName?: boolean
    timestamp?: boolean
    content?: boolean
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entityId?: boolean
    senderId?: boolean
    senderName?: boolean
    timestamp?: boolean
    content?: boolean
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    entityId?: boolean
    senderId?: boolean
    senderName?: boolean
    timestamp?: boolean
    content?: boolean
  }


  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entityId: string
      senderId: string
      senderName: string
      timestamp: Date
      content: string
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
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
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Comment model
   */ 
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'String'>
    readonly entityId: FieldRef<"Comment", 'String'>
    readonly senderId: FieldRef<"Comment", 'String'>
    readonly senderName: FieldRef<"Comment", 'String'>
    readonly timestamp: FieldRef<"Comment", 'DateTime'>
    readonly content: FieldRef<"Comment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    message: string | null
    type: string | null
    timestamp: Date | null
    isRead: boolean | null
    link: string | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    message: string | null
    type: string | null
    timestamp: Date | null
    isRead: boolean | null
    link: string | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    message: number
    type: number
    timestamp: number
    isRead: number
    link: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    message?: true
    type?: true
    timestamp?: true
    isRead?: true
    link?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    message?: true
    type?: true
    timestamp?: true
    isRead?: true
    link?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    message?: true
    type?: true
    timestamp?: true
    isRead?: true
    link?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    message: string
    type: string
    timestamp: Date
    isRead: boolean
    link: string | null
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    message?: boolean
    type?: boolean
    timestamp?: boolean
    isRead?: boolean
    link?: boolean
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    message?: boolean
    type?: boolean
    timestamp?: boolean
    isRead?: boolean
    link?: boolean
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    message?: boolean
    type?: boolean
    timestamp?: boolean
    isRead?: boolean
    link?: boolean
  }


  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      message: string
      type: string
      timestamp: Date
      isRead: boolean
      link: string | null
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
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
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Notification model
   */ 
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly timestamp: FieldRef<"Notification", 'DateTime'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly link: FieldRef<"Notification", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
  }


  /**
   * Model MaintenanceStandard
   */

  export type AggregateMaintenanceStandard = {
    _count: MaintenanceStandardCountAggregateOutputType | null
    _avg: MaintenanceStandardAvgAggregateOutputType | null
    _sum: MaintenanceStandardSumAggregateOutputType | null
    _min: MaintenanceStandardMinAggregateOutputType | null
    _max: MaintenanceStandardMaxAggregateOutputType | null
  }

  export type MaintenanceStandardAvgAggregateOutputType = {
    estimatedDurationHours: number | null
  }

  export type MaintenanceStandardSumAggregateOutputType = {
    estimatedDurationHours: number | null
  }

  export type MaintenanceStandardMinAggregateOutputType = {
    id: string | null
    name: string | null
    name_en: string | null
    description: string | null
    frequency: string | null
    scheduledTime: string | null
    recipientId: string | null
    abbreviation: string | null
    estimatedDurationHours: number | null
    deletedAt: Date | null
  }

  export type MaintenanceStandardMaxAggregateOutputType = {
    id: string | null
    name: string | null
    name_en: string | null
    description: string | null
    frequency: string | null
    scheduledTime: string | null
    recipientId: string | null
    abbreviation: string | null
    estimatedDurationHours: number | null
    deletedAt: Date | null
  }

  export type MaintenanceStandardCountAggregateOutputType = {
    id: number
    name: number
    name_en: number
    description: number
    frequency: number
    scheduledTime: number
    locationIds: number
    recipientId: number
    abbreviation: number
    estimatedDurationHours: number
    deletedAt: number
    _all: number
  }


  export type MaintenanceStandardAvgAggregateInputType = {
    estimatedDurationHours?: true
  }

  export type MaintenanceStandardSumAggregateInputType = {
    estimatedDurationHours?: true
  }

  export type MaintenanceStandardMinAggregateInputType = {
    id?: true
    name?: true
    name_en?: true
    description?: true
    frequency?: true
    scheduledTime?: true
    recipientId?: true
    abbreviation?: true
    estimatedDurationHours?: true
    deletedAt?: true
  }

  export type MaintenanceStandardMaxAggregateInputType = {
    id?: true
    name?: true
    name_en?: true
    description?: true
    frequency?: true
    scheduledTime?: true
    recipientId?: true
    abbreviation?: true
    estimatedDurationHours?: true
    deletedAt?: true
  }

  export type MaintenanceStandardCountAggregateInputType = {
    id?: true
    name?: true
    name_en?: true
    description?: true
    frequency?: true
    scheduledTime?: true
    locationIds?: true
    recipientId?: true
    abbreviation?: true
    estimatedDurationHours?: true
    deletedAt?: true
    _all?: true
  }

  export type MaintenanceStandardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceStandard to aggregate.
     */
    where?: MaintenanceStandardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceStandards to fetch.
     */
    orderBy?: MaintenanceStandardOrderByWithRelationInput | MaintenanceStandardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaintenanceStandardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceStandards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceStandards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaintenanceStandards
    **/
    _count?: true | MaintenanceStandardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MaintenanceStandardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MaintenanceStandardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaintenanceStandardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaintenanceStandardMaxAggregateInputType
  }

  export type GetMaintenanceStandardAggregateType<T extends MaintenanceStandardAggregateArgs> = {
        [P in keyof T & keyof AggregateMaintenanceStandard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenanceStandard[P]>
      : GetScalarType<T[P], AggregateMaintenanceStandard[P]>
  }




  export type MaintenanceStandardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceStandardWhereInput
    orderBy?: MaintenanceStandardOrderByWithAggregationInput | MaintenanceStandardOrderByWithAggregationInput[]
    by: MaintenanceStandardScalarFieldEnum[] | MaintenanceStandardScalarFieldEnum
    having?: MaintenanceStandardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaintenanceStandardCountAggregateInputType | true
    _avg?: MaintenanceStandardAvgAggregateInputType
    _sum?: MaintenanceStandardSumAggregateInputType
    _min?: MaintenanceStandardMinAggregateInputType
    _max?: MaintenanceStandardMaxAggregateInputType
  }

  export type MaintenanceStandardGroupByOutputType = {
    id: string
    name: string
    name_en: string | null
    description: string | null
    frequency: string | null
    scheduledTime: string | null
    locationIds: string[]
    recipientId: string | null
    abbreviation: string | null
    estimatedDurationHours: number | null
    deletedAt: Date | null
    _count: MaintenanceStandardCountAggregateOutputType | null
    _avg: MaintenanceStandardAvgAggregateOutputType | null
    _sum: MaintenanceStandardSumAggregateOutputType | null
    _min: MaintenanceStandardMinAggregateOutputType | null
    _max: MaintenanceStandardMaxAggregateOutputType | null
  }

  type GetMaintenanceStandardGroupByPayload<T extends MaintenanceStandardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaintenanceStandardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaintenanceStandardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceStandardGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceStandardGroupByOutputType[P]>
        }
      >
    >


  export type MaintenanceStandardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    name_en?: boolean
    description?: boolean
    frequency?: boolean
    scheduledTime?: boolean
    locationIds?: boolean
    recipientId?: boolean
    abbreviation?: boolean
    estimatedDurationHours?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["maintenanceStandard"]>

  export type MaintenanceStandardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    name_en?: boolean
    description?: boolean
    frequency?: boolean
    scheduledTime?: boolean
    locationIds?: boolean
    recipientId?: boolean
    abbreviation?: boolean
    estimatedDurationHours?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["maintenanceStandard"]>

  export type MaintenanceStandardSelectScalar = {
    id?: boolean
    name?: boolean
    name_en?: boolean
    description?: boolean
    frequency?: boolean
    scheduledTime?: boolean
    locationIds?: boolean
    recipientId?: boolean
    abbreviation?: boolean
    estimatedDurationHours?: boolean
    deletedAt?: boolean
  }


  export type $MaintenanceStandardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaintenanceStandard"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      name_en: string | null
      description: string | null
      frequency: string | null
      scheduledTime: string | null
      locationIds: string[]
      recipientId: string | null
      abbreviation: string | null
      estimatedDurationHours: number | null
      deletedAt: Date | null
    }, ExtArgs["result"]["maintenanceStandard"]>
    composites: {}
  }

  type MaintenanceStandardGetPayload<S extends boolean | null | undefined | MaintenanceStandardDefaultArgs> = $Result.GetResult<Prisma.$MaintenanceStandardPayload, S>

  type MaintenanceStandardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MaintenanceStandardFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MaintenanceStandardCountAggregateInputType | true
    }

  export interface MaintenanceStandardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaintenanceStandard'], meta: { name: 'MaintenanceStandard' } }
    /**
     * Find zero or one MaintenanceStandard that matches the filter.
     * @param {MaintenanceStandardFindUniqueArgs} args - Arguments to find a MaintenanceStandard
     * @example
     * // Get one MaintenanceStandard
     * const maintenanceStandard = await prisma.maintenanceStandard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceStandardFindUniqueArgs>(args: SelectSubset<T, MaintenanceStandardFindUniqueArgs<ExtArgs>>): Prisma__MaintenanceStandardClient<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MaintenanceStandard that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MaintenanceStandardFindUniqueOrThrowArgs} args - Arguments to find a MaintenanceStandard
     * @example
     * // Get one MaintenanceStandard
     * const maintenanceStandard = await prisma.maintenanceStandard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceStandardFindUniqueOrThrowArgs>(args: SelectSubset<T, MaintenanceStandardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaintenanceStandardClient<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MaintenanceStandard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardFindFirstArgs} args - Arguments to find a MaintenanceStandard
     * @example
     * // Get one MaintenanceStandard
     * const maintenanceStandard = await prisma.maintenanceStandard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceStandardFindFirstArgs>(args?: SelectSubset<T, MaintenanceStandardFindFirstArgs<ExtArgs>>): Prisma__MaintenanceStandardClient<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MaintenanceStandard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardFindFirstOrThrowArgs} args - Arguments to find a MaintenanceStandard
     * @example
     * // Get one MaintenanceStandard
     * const maintenanceStandard = await prisma.maintenanceStandard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceStandardFindFirstOrThrowArgs>(args?: SelectSubset<T, MaintenanceStandardFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaintenanceStandardClient<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MaintenanceStandards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaintenanceStandards
     * const maintenanceStandards = await prisma.maintenanceStandard.findMany()
     * 
     * // Get first 10 MaintenanceStandards
     * const maintenanceStandards = await prisma.maintenanceStandard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maintenanceStandardWithIdOnly = await prisma.maintenanceStandard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaintenanceStandardFindManyArgs>(args?: SelectSubset<T, MaintenanceStandardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MaintenanceStandard.
     * @param {MaintenanceStandardCreateArgs} args - Arguments to create a MaintenanceStandard.
     * @example
     * // Create one MaintenanceStandard
     * const MaintenanceStandard = await prisma.maintenanceStandard.create({
     *   data: {
     *     // ... data to create a MaintenanceStandard
     *   }
     * })
     * 
     */
    create<T extends MaintenanceStandardCreateArgs>(args: SelectSubset<T, MaintenanceStandardCreateArgs<ExtArgs>>): Prisma__MaintenanceStandardClient<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MaintenanceStandards.
     * @param {MaintenanceStandardCreateManyArgs} args - Arguments to create many MaintenanceStandards.
     * @example
     * // Create many MaintenanceStandards
     * const maintenanceStandard = await prisma.maintenanceStandard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaintenanceStandardCreateManyArgs>(args?: SelectSubset<T, MaintenanceStandardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MaintenanceStandards and returns the data saved in the database.
     * @param {MaintenanceStandardCreateManyAndReturnArgs} args - Arguments to create many MaintenanceStandards.
     * @example
     * // Create many MaintenanceStandards
     * const maintenanceStandard = await prisma.maintenanceStandard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MaintenanceStandards and only return the `id`
     * const maintenanceStandardWithIdOnly = await prisma.maintenanceStandard.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaintenanceStandardCreateManyAndReturnArgs>(args?: SelectSubset<T, MaintenanceStandardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MaintenanceStandard.
     * @param {MaintenanceStandardDeleteArgs} args - Arguments to delete one MaintenanceStandard.
     * @example
     * // Delete one MaintenanceStandard
     * const MaintenanceStandard = await prisma.maintenanceStandard.delete({
     *   where: {
     *     // ... filter to delete one MaintenanceStandard
     *   }
     * })
     * 
     */
    delete<T extends MaintenanceStandardDeleteArgs>(args: SelectSubset<T, MaintenanceStandardDeleteArgs<ExtArgs>>): Prisma__MaintenanceStandardClient<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MaintenanceStandard.
     * @param {MaintenanceStandardUpdateArgs} args - Arguments to update one MaintenanceStandard.
     * @example
     * // Update one MaintenanceStandard
     * const maintenanceStandard = await prisma.maintenanceStandard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaintenanceStandardUpdateArgs>(args: SelectSubset<T, MaintenanceStandardUpdateArgs<ExtArgs>>): Prisma__MaintenanceStandardClient<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MaintenanceStandards.
     * @param {MaintenanceStandardDeleteManyArgs} args - Arguments to filter MaintenanceStandards to delete.
     * @example
     * // Delete a few MaintenanceStandards
     * const { count } = await prisma.maintenanceStandard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaintenanceStandardDeleteManyArgs>(args?: SelectSubset<T, MaintenanceStandardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceStandards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaintenanceStandards
     * const maintenanceStandard = await prisma.maintenanceStandard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaintenanceStandardUpdateManyArgs>(args: SelectSubset<T, MaintenanceStandardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MaintenanceStandard.
     * @param {MaintenanceStandardUpsertArgs} args - Arguments to update or create a MaintenanceStandard.
     * @example
     * // Update or create a MaintenanceStandard
     * const maintenanceStandard = await prisma.maintenanceStandard.upsert({
     *   create: {
     *     // ... data to create a MaintenanceStandard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaintenanceStandard we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceStandardUpsertArgs>(args: SelectSubset<T, MaintenanceStandardUpsertArgs<ExtArgs>>): Prisma__MaintenanceStandardClient<$Result.GetResult<Prisma.$MaintenanceStandardPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MaintenanceStandards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardCountArgs} args - Arguments to filter MaintenanceStandards to count.
     * @example
     * // Count the number of MaintenanceStandards
     * const count = await prisma.maintenanceStandard.count({
     *   where: {
     *     // ... the filter for the MaintenanceStandards we want to count
     *   }
     * })
    **/
    count<T extends MaintenanceStandardCountArgs>(
      args?: Subset<T, MaintenanceStandardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaintenanceStandardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaintenanceStandard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MaintenanceStandardAggregateArgs>(args: Subset<T, MaintenanceStandardAggregateArgs>): Prisma.PrismaPromise<GetMaintenanceStandardAggregateType<T>>

    /**
     * Group by MaintenanceStandard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardGroupByArgs} args - Group by arguments.
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
      T extends MaintenanceStandardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceStandardGroupByArgs['orderBy'] }
        : { orderBy?: MaintenanceStandardGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MaintenanceStandardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaintenanceStandardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaintenanceStandard model
   */
  readonly fields: MaintenanceStandardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaintenanceStandard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceStandardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MaintenanceStandard model
   */ 
  interface MaintenanceStandardFieldRefs {
    readonly id: FieldRef<"MaintenanceStandard", 'String'>
    readonly name: FieldRef<"MaintenanceStandard", 'String'>
    readonly name_en: FieldRef<"MaintenanceStandard", 'String'>
    readonly description: FieldRef<"MaintenanceStandard", 'String'>
    readonly frequency: FieldRef<"MaintenanceStandard", 'String'>
    readonly scheduledTime: FieldRef<"MaintenanceStandard", 'String'>
    readonly locationIds: FieldRef<"MaintenanceStandard", 'String[]'>
    readonly recipientId: FieldRef<"MaintenanceStandard", 'String'>
    readonly abbreviation: FieldRef<"MaintenanceStandard", 'String'>
    readonly estimatedDurationHours: FieldRef<"MaintenanceStandard", 'Float'>
    readonly deletedAt: FieldRef<"MaintenanceStandard", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MaintenanceStandard findUnique
   */
  export type MaintenanceStandardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandard to fetch.
     */
    where: MaintenanceStandardWhereUniqueInput
  }

  /**
   * MaintenanceStandard findUniqueOrThrow
   */
  export type MaintenanceStandardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandard to fetch.
     */
    where: MaintenanceStandardWhereUniqueInput
  }

  /**
   * MaintenanceStandard findFirst
   */
  export type MaintenanceStandardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandard to fetch.
     */
    where?: MaintenanceStandardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceStandards to fetch.
     */
    orderBy?: MaintenanceStandardOrderByWithRelationInput | MaintenanceStandardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceStandards.
     */
    cursor?: MaintenanceStandardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceStandards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceStandards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceStandards.
     */
    distinct?: MaintenanceStandardScalarFieldEnum | MaintenanceStandardScalarFieldEnum[]
  }

  /**
   * MaintenanceStandard findFirstOrThrow
   */
  export type MaintenanceStandardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandard to fetch.
     */
    where?: MaintenanceStandardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceStandards to fetch.
     */
    orderBy?: MaintenanceStandardOrderByWithRelationInput | MaintenanceStandardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceStandards.
     */
    cursor?: MaintenanceStandardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceStandards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceStandards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceStandards.
     */
    distinct?: MaintenanceStandardScalarFieldEnum | MaintenanceStandardScalarFieldEnum[]
  }

  /**
   * MaintenanceStandard findMany
   */
  export type MaintenanceStandardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandards to fetch.
     */
    where?: MaintenanceStandardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceStandards to fetch.
     */
    orderBy?: MaintenanceStandardOrderByWithRelationInput | MaintenanceStandardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaintenanceStandards.
     */
    cursor?: MaintenanceStandardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceStandards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceStandards.
     */
    skip?: number
    distinct?: MaintenanceStandardScalarFieldEnum | MaintenanceStandardScalarFieldEnum[]
  }

  /**
   * MaintenanceStandard create
   */
  export type MaintenanceStandardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
    /**
     * The data needed to create a MaintenanceStandard.
     */
    data: XOR<MaintenanceStandardCreateInput, MaintenanceStandardUncheckedCreateInput>
  }

  /**
   * MaintenanceStandard createMany
   */
  export type MaintenanceStandardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaintenanceStandards.
     */
    data: MaintenanceStandardCreateManyInput | MaintenanceStandardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceStandard createManyAndReturn
   */
  export type MaintenanceStandardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MaintenanceStandards.
     */
    data: MaintenanceStandardCreateManyInput | MaintenanceStandardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceStandard update
   */
  export type MaintenanceStandardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
    /**
     * The data needed to update a MaintenanceStandard.
     */
    data: XOR<MaintenanceStandardUpdateInput, MaintenanceStandardUncheckedUpdateInput>
    /**
     * Choose, which MaintenanceStandard to update.
     */
    where: MaintenanceStandardWhereUniqueInput
  }

  /**
   * MaintenanceStandard updateMany
   */
  export type MaintenanceStandardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaintenanceStandards.
     */
    data: XOR<MaintenanceStandardUpdateManyMutationInput, MaintenanceStandardUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceStandards to update
     */
    where?: MaintenanceStandardWhereInput
  }

  /**
   * MaintenanceStandard upsert
   */
  export type MaintenanceStandardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
    /**
     * The filter to search for the MaintenanceStandard to update in case it exists.
     */
    where: MaintenanceStandardWhereUniqueInput
    /**
     * In case the MaintenanceStandard found by the `where` argument doesn't exist, create a new MaintenanceStandard with this data.
     */
    create: XOR<MaintenanceStandardCreateInput, MaintenanceStandardUncheckedCreateInput>
    /**
     * In case the MaintenanceStandard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceStandardUpdateInput, MaintenanceStandardUncheckedUpdateInput>
  }

  /**
   * MaintenanceStandard delete
   */
  export type MaintenanceStandardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
    /**
     * Filter which MaintenanceStandard to delete.
     */
    where: MaintenanceStandardWhereUniqueInput
  }

  /**
   * MaintenanceStandard deleteMany
   */
  export type MaintenanceStandardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceStandards to delete
     */
    where?: MaintenanceStandardWhereInput
  }

  /**
   * MaintenanceStandard without action
   */
  export type MaintenanceStandardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandard
     */
    select?: MaintenanceStandardSelect<ExtArgs> | null
  }


  /**
   * Model MaintenanceStandardItem
   */

  export type AggregateMaintenanceStandardItem = {
    _count: MaintenanceStandardItemCountAggregateOutputType | null
    _avg: MaintenanceStandardItemAvgAggregateOutputType | null
    _sum: MaintenanceStandardItemSumAggregateOutputType | null
    _min: MaintenanceStandardItemMinAggregateOutputType | null
    _max: MaintenanceStandardItemMaxAggregateOutputType | null
  }

  export type MaintenanceStandardItemAvgAggregateOutputType = {
    standardQuantity: number | null
    toleranceValue: number | null
  }

  export type MaintenanceStandardItemSumAggregateOutputType = {
    standardQuantity: number | null
    toleranceValue: number | null
  }

  export type MaintenanceStandardItemMinAggregateOutputType = {
    id: string | null
    standardId: string | null
    itemCode: string | null
    itemText: string | null
    criteria: string | null
    unit: string | null
    standardQuantity: number | null
    toleranceOperator: string | null
    toleranceValue: number | null
    requiredTools: string | null
  }

  export type MaintenanceStandardItemMaxAggregateOutputType = {
    id: string | null
    standardId: string | null
    itemCode: string | null
    itemText: string | null
    criteria: string | null
    unit: string | null
    standardQuantity: number | null
    toleranceOperator: string | null
    toleranceValue: number | null
    requiredTools: string | null
  }

  export type MaintenanceStandardItemCountAggregateOutputType = {
    id: number
    standardId: number
    itemCode: number
    itemText: number
    criteria: number
    unit: number
    standardQuantity: number
    toleranceOperator: number
    toleranceValue: number
    requiredTools: number
    _all: number
  }


  export type MaintenanceStandardItemAvgAggregateInputType = {
    standardQuantity?: true
    toleranceValue?: true
  }

  export type MaintenanceStandardItemSumAggregateInputType = {
    standardQuantity?: true
    toleranceValue?: true
  }

  export type MaintenanceStandardItemMinAggregateInputType = {
    id?: true
    standardId?: true
    itemCode?: true
    itemText?: true
    criteria?: true
    unit?: true
    standardQuantity?: true
    toleranceOperator?: true
    toleranceValue?: true
    requiredTools?: true
  }

  export type MaintenanceStandardItemMaxAggregateInputType = {
    id?: true
    standardId?: true
    itemCode?: true
    itemText?: true
    criteria?: true
    unit?: true
    standardQuantity?: true
    toleranceOperator?: true
    toleranceValue?: true
    requiredTools?: true
  }

  export type MaintenanceStandardItemCountAggregateInputType = {
    id?: true
    standardId?: true
    itemCode?: true
    itemText?: true
    criteria?: true
    unit?: true
    standardQuantity?: true
    toleranceOperator?: true
    toleranceValue?: true
    requiredTools?: true
    _all?: true
  }

  export type MaintenanceStandardItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceStandardItem to aggregate.
     */
    where?: MaintenanceStandardItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceStandardItems to fetch.
     */
    orderBy?: MaintenanceStandardItemOrderByWithRelationInput | MaintenanceStandardItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaintenanceStandardItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceStandardItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceStandardItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaintenanceStandardItems
    **/
    _count?: true | MaintenanceStandardItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MaintenanceStandardItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MaintenanceStandardItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaintenanceStandardItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaintenanceStandardItemMaxAggregateInputType
  }

  export type GetMaintenanceStandardItemAggregateType<T extends MaintenanceStandardItemAggregateArgs> = {
        [P in keyof T & keyof AggregateMaintenanceStandardItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenanceStandardItem[P]>
      : GetScalarType<T[P], AggregateMaintenanceStandardItem[P]>
  }




  export type MaintenanceStandardItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceStandardItemWhereInput
    orderBy?: MaintenanceStandardItemOrderByWithAggregationInput | MaintenanceStandardItemOrderByWithAggregationInput[]
    by: MaintenanceStandardItemScalarFieldEnum[] | MaintenanceStandardItemScalarFieldEnum
    having?: MaintenanceStandardItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaintenanceStandardItemCountAggregateInputType | true
    _avg?: MaintenanceStandardItemAvgAggregateInputType
    _sum?: MaintenanceStandardItemSumAggregateInputType
    _min?: MaintenanceStandardItemMinAggregateInputType
    _max?: MaintenanceStandardItemMaxAggregateInputType
  }

  export type MaintenanceStandardItemGroupByOutputType = {
    id: string
    standardId: string
    itemCode: string
    itemText: string
    criteria: string | null
    unit: string | null
    standardQuantity: number | null
    toleranceOperator: string | null
    toleranceValue: number | null
    requiredTools: string | null
    _count: MaintenanceStandardItemCountAggregateOutputType | null
    _avg: MaintenanceStandardItemAvgAggregateOutputType | null
    _sum: MaintenanceStandardItemSumAggregateOutputType | null
    _min: MaintenanceStandardItemMinAggregateOutputType | null
    _max: MaintenanceStandardItemMaxAggregateOutputType | null
  }

  type GetMaintenanceStandardItemGroupByPayload<T extends MaintenanceStandardItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaintenanceStandardItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaintenanceStandardItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceStandardItemGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceStandardItemGroupByOutputType[P]>
        }
      >
    >


  export type MaintenanceStandardItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    standardId?: boolean
    itemCode?: boolean
    itemText?: boolean
    criteria?: boolean
    unit?: boolean
    standardQuantity?: boolean
    toleranceOperator?: boolean
    toleranceValue?: boolean
    requiredTools?: boolean
  }, ExtArgs["result"]["maintenanceStandardItem"]>

  export type MaintenanceStandardItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    standardId?: boolean
    itemCode?: boolean
    itemText?: boolean
    criteria?: boolean
    unit?: boolean
    standardQuantity?: boolean
    toleranceOperator?: boolean
    toleranceValue?: boolean
    requiredTools?: boolean
  }, ExtArgs["result"]["maintenanceStandardItem"]>

  export type MaintenanceStandardItemSelectScalar = {
    id?: boolean
    standardId?: boolean
    itemCode?: boolean
    itemText?: boolean
    criteria?: boolean
    unit?: boolean
    standardQuantity?: boolean
    toleranceOperator?: boolean
    toleranceValue?: boolean
    requiredTools?: boolean
  }


  export type $MaintenanceStandardItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaintenanceStandardItem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      standardId: string
      itemCode: string
      itemText: string
      criteria: string | null
      unit: string | null
      standardQuantity: number | null
      toleranceOperator: string | null
      toleranceValue: number | null
      requiredTools: string | null
    }, ExtArgs["result"]["maintenanceStandardItem"]>
    composites: {}
  }

  type MaintenanceStandardItemGetPayload<S extends boolean | null | undefined | MaintenanceStandardItemDefaultArgs> = $Result.GetResult<Prisma.$MaintenanceStandardItemPayload, S>

  type MaintenanceStandardItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MaintenanceStandardItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MaintenanceStandardItemCountAggregateInputType | true
    }

  export interface MaintenanceStandardItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaintenanceStandardItem'], meta: { name: 'MaintenanceStandardItem' } }
    /**
     * Find zero or one MaintenanceStandardItem that matches the filter.
     * @param {MaintenanceStandardItemFindUniqueArgs} args - Arguments to find a MaintenanceStandardItem
     * @example
     * // Get one MaintenanceStandardItem
     * const maintenanceStandardItem = await prisma.maintenanceStandardItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceStandardItemFindUniqueArgs>(args: SelectSubset<T, MaintenanceStandardItemFindUniqueArgs<ExtArgs>>): Prisma__MaintenanceStandardItemClient<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MaintenanceStandardItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MaintenanceStandardItemFindUniqueOrThrowArgs} args - Arguments to find a MaintenanceStandardItem
     * @example
     * // Get one MaintenanceStandardItem
     * const maintenanceStandardItem = await prisma.maintenanceStandardItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceStandardItemFindUniqueOrThrowArgs>(args: SelectSubset<T, MaintenanceStandardItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaintenanceStandardItemClient<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MaintenanceStandardItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardItemFindFirstArgs} args - Arguments to find a MaintenanceStandardItem
     * @example
     * // Get one MaintenanceStandardItem
     * const maintenanceStandardItem = await prisma.maintenanceStandardItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceStandardItemFindFirstArgs>(args?: SelectSubset<T, MaintenanceStandardItemFindFirstArgs<ExtArgs>>): Prisma__MaintenanceStandardItemClient<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MaintenanceStandardItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardItemFindFirstOrThrowArgs} args - Arguments to find a MaintenanceStandardItem
     * @example
     * // Get one MaintenanceStandardItem
     * const maintenanceStandardItem = await prisma.maintenanceStandardItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceStandardItemFindFirstOrThrowArgs>(args?: SelectSubset<T, MaintenanceStandardItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaintenanceStandardItemClient<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MaintenanceStandardItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaintenanceStandardItems
     * const maintenanceStandardItems = await prisma.maintenanceStandardItem.findMany()
     * 
     * // Get first 10 MaintenanceStandardItems
     * const maintenanceStandardItems = await prisma.maintenanceStandardItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maintenanceStandardItemWithIdOnly = await prisma.maintenanceStandardItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaintenanceStandardItemFindManyArgs>(args?: SelectSubset<T, MaintenanceStandardItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MaintenanceStandardItem.
     * @param {MaintenanceStandardItemCreateArgs} args - Arguments to create a MaintenanceStandardItem.
     * @example
     * // Create one MaintenanceStandardItem
     * const MaintenanceStandardItem = await prisma.maintenanceStandardItem.create({
     *   data: {
     *     // ... data to create a MaintenanceStandardItem
     *   }
     * })
     * 
     */
    create<T extends MaintenanceStandardItemCreateArgs>(args: SelectSubset<T, MaintenanceStandardItemCreateArgs<ExtArgs>>): Prisma__MaintenanceStandardItemClient<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MaintenanceStandardItems.
     * @param {MaintenanceStandardItemCreateManyArgs} args - Arguments to create many MaintenanceStandardItems.
     * @example
     * // Create many MaintenanceStandardItems
     * const maintenanceStandardItem = await prisma.maintenanceStandardItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaintenanceStandardItemCreateManyArgs>(args?: SelectSubset<T, MaintenanceStandardItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MaintenanceStandardItems and returns the data saved in the database.
     * @param {MaintenanceStandardItemCreateManyAndReturnArgs} args - Arguments to create many MaintenanceStandardItems.
     * @example
     * // Create many MaintenanceStandardItems
     * const maintenanceStandardItem = await prisma.maintenanceStandardItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MaintenanceStandardItems and only return the `id`
     * const maintenanceStandardItemWithIdOnly = await prisma.maintenanceStandardItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaintenanceStandardItemCreateManyAndReturnArgs>(args?: SelectSubset<T, MaintenanceStandardItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MaintenanceStandardItem.
     * @param {MaintenanceStandardItemDeleteArgs} args - Arguments to delete one MaintenanceStandardItem.
     * @example
     * // Delete one MaintenanceStandardItem
     * const MaintenanceStandardItem = await prisma.maintenanceStandardItem.delete({
     *   where: {
     *     // ... filter to delete one MaintenanceStandardItem
     *   }
     * })
     * 
     */
    delete<T extends MaintenanceStandardItemDeleteArgs>(args: SelectSubset<T, MaintenanceStandardItemDeleteArgs<ExtArgs>>): Prisma__MaintenanceStandardItemClient<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MaintenanceStandardItem.
     * @param {MaintenanceStandardItemUpdateArgs} args - Arguments to update one MaintenanceStandardItem.
     * @example
     * // Update one MaintenanceStandardItem
     * const maintenanceStandardItem = await prisma.maintenanceStandardItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaintenanceStandardItemUpdateArgs>(args: SelectSubset<T, MaintenanceStandardItemUpdateArgs<ExtArgs>>): Prisma__MaintenanceStandardItemClient<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MaintenanceStandardItems.
     * @param {MaintenanceStandardItemDeleteManyArgs} args - Arguments to filter MaintenanceStandardItems to delete.
     * @example
     * // Delete a few MaintenanceStandardItems
     * const { count } = await prisma.maintenanceStandardItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaintenanceStandardItemDeleteManyArgs>(args?: SelectSubset<T, MaintenanceStandardItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceStandardItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaintenanceStandardItems
     * const maintenanceStandardItem = await prisma.maintenanceStandardItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaintenanceStandardItemUpdateManyArgs>(args: SelectSubset<T, MaintenanceStandardItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MaintenanceStandardItem.
     * @param {MaintenanceStandardItemUpsertArgs} args - Arguments to update or create a MaintenanceStandardItem.
     * @example
     * // Update or create a MaintenanceStandardItem
     * const maintenanceStandardItem = await prisma.maintenanceStandardItem.upsert({
     *   create: {
     *     // ... data to create a MaintenanceStandardItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaintenanceStandardItem we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceStandardItemUpsertArgs>(args: SelectSubset<T, MaintenanceStandardItemUpsertArgs<ExtArgs>>): Prisma__MaintenanceStandardItemClient<$Result.GetResult<Prisma.$MaintenanceStandardItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MaintenanceStandardItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardItemCountArgs} args - Arguments to filter MaintenanceStandardItems to count.
     * @example
     * // Count the number of MaintenanceStandardItems
     * const count = await prisma.maintenanceStandardItem.count({
     *   where: {
     *     // ... the filter for the MaintenanceStandardItems we want to count
     *   }
     * })
    **/
    count<T extends MaintenanceStandardItemCountArgs>(
      args?: Subset<T, MaintenanceStandardItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaintenanceStandardItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaintenanceStandardItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MaintenanceStandardItemAggregateArgs>(args: Subset<T, MaintenanceStandardItemAggregateArgs>): Prisma.PrismaPromise<GetMaintenanceStandardItemAggregateType<T>>

    /**
     * Group by MaintenanceStandardItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceStandardItemGroupByArgs} args - Group by arguments.
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
      T extends MaintenanceStandardItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceStandardItemGroupByArgs['orderBy'] }
        : { orderBy?: MaintenanceStandardItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MaintenanceStandardItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaintenanceStandardItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaintenanceStandardItem model
   */
  readonly fields: MaintenanceStandardItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaintenanceStandardItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceStandardItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MaintenanceStandardItem model
   */ 
  interface MaintenanceStandardItemFieldRefs {
    readonly id: FieldRef<"MaintenanceStandardItem", 'String'>
    readonly standardId: FieldRef<"MaintenanceStandardItem", 'String'>
    readonly itemCode: FieldRef<"MaintenanceStandardItem", 'String'>
    readonly itemText: FieldRef<"MaintenanceStandardItem", 'String'>
    readonly criteria: FieldRef<"MaintenanceStandardItem", 'String'>
    readonly unit: FieldRef<"MaintenanceStandardItem", 'String'>
    readonly standardQuantity: FieldRef<"MaintenanceStandardItem", 'Float'>
    readonly toleranceOperator: FieldRef<"MaintenanceStandardItem", 'String'>
    readonly toleranceValue: FieldRef<"MaintenanceStandardItem", 'Float'>
    readonly requiredTools: FieldRef<"MaintenanceStandardItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MaintenanceStandardItem findUnique
   */
  export type MaintenanceStandardItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandardItem to fetch.
     */
    where: MaintenanceStandardItemWhereUniqueInput
  }

  /**
   * MaintenanceStandardItem findUniqueOrThrow
   */
  export type MaintenanceStandardItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandardItem to fetch.
     */
    where: MaintenanceStandardItemWhereUniqueInput
  }

  /**
   * MaintenanceStandardItem findFirst
   */
  export type MaintenanceStandardItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandardItem to fetch.
     */
    where?: MaintenanceStandardItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceStandardItems to fetch.
     */
    orderBy?: MaintenanceStandardItemOrderByWithRelationInput | MaintenanceStandardItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceStandardItems.
     */
    cursor?: MaintenanceStandardItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceStandardItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceStandardItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceStandardItems.
     */
    distinct?: MaintenanceStandardItemScalarFieldEnum | MaintenanceStandardItemScalarFieldEnum[]
  }

  /**
   * MaintenanceStandardItem findFirstOrThrow
   */
  export type MaintenanceStandardItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandardItem to fetch.
     */
    where?: MaintenanceStandardItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceStandardItems to fetch.
     */
    orderBy?: MaintenanceStandardItemOrderByWithRelationInput | MaintenanceStandardItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceStandardItems.
     */
    cursor?: MaintenanceStandardItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceStandardItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceStandardItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceStandardItems.
     */
    distinct?: MaintenanceStandardItemScalarFieldEnum | MaintenanceStandardItemScalarFieldEnum[]
  }

  /**
   * MaintenanceStandardItem findMany
   */
  export type MaintenanceStandardItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
    /**
     * Filter, which MaintenanceStandardItems to fetch.
     */
    where?: MaintenanceStandardItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceStandardItems to fetch.
     */
    orderBy?: MaintenanceStandardItemOrderByWithRelationInput | MaintenanceStandardItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaintenanceStandardItems.
     */
    cursor?: MaintenanceStandardItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceStandardItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceStandardItems.
     */
    skip?: number
    distinct?: MaintenanceStandardItemScalarFieldEnum | MaintenanceStandardItemScalarFieldEnum[]
  }

  /**
   * MaintenanceStandardItem create
   */
  export type MaintenanceStandardItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
    /**
     * The data needed to create a MaintenanceStandardItem.
     */
    data: XOR<MaintenanceStandardItemCreateInput, MaintenanceStandardItemUncheckedCreateInput>
  }

  /**
   * MaintenanceStandardItem createMany
   */
  export type MaintenanceStandardItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaintenanceStandardItems.
     */
    data: MaintenanceStandardItemCreateManyInput | MaintenanceStandardItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceStandardItem createManyAndReturn
   */
  export type MaintenanceStandardItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MaintenanceStandardItems.
     */
    data: MaintenanceStandardItemCreateManyInput | MaintenanceStandardItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceStandardItem update
   */
  export type MaintenanceStandardItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
    /**
     * The data needed to update a MaintenanceStandardItem.
     */
    data: XOR<MaintenanceStandardItemUpdateInput, MaintenanceStandardItemUncheckedUpdateInput>
    /**
     * Choose, which MaintenanceStandardItem to update.
     */
    where: MaintenanceStandardItemWhereUniqueInput
  }

  /**
   * MaintenanceStandardItem updateMany
   */
  export type MaintenanceStandardItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaintenanceStandardItems.
     */
    data: XOR<MaintenanceStandardItemUpdateManyMutationInput, MaintenanceStandardItemUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceStandardItems to update
     */
    where?: MaintenanceStandardItemWhereInput
  }

  /**
   * MaintenanceStandardItem upsert
   */
  export type MaintenanceStandardItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
    /**
     * The filter to search for the MaintenanceStandardItem to update in case it exists.
     */
    where: MaintenanceStandardItemWhereUniqueInput
    /**
     * In case the MaintenanceStandardItem found by the `where` argument doesn't exist, create a new MaintenanceStandardItem with this data.
     */
    create: XOR<MaintenanceStandardItemCreateInput, MaintenanceStandardItemUncheckedCreateInput>
    /**
     * In case the MaintenanceStandardItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceStandardItemUpdateInput, MaintenanceStandardItemUncheckedUpdateInput>
  }

  /**
   * MaintenanceStandardItem delete
   */
  export type MaintenanceStandardItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
    /**
     * Filter which MaintenanceStandardItem to delete.
     */
    where: MaintenanceStandardItemWhereUniqueInput
  }

  /**
   * MaintenanceStandardItem deleteMany
   */
  export type MaintenanceStandardItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceStandardItems to delete
     */
    where?: MaintenanceStandardItemWhereInput
  }

  /**
   * MaintenanceStandardItem without action
   */
  export type MaintenanceStandardItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceStandardItem
     */
    select?: MaintenanceStandardItemSelect<ExtArgs> | null
  }


  /**
   * Model InspectionDetail
   */

  export type AggregateInspectionDetail = {
    _count: InspectionDetailCountAggregateOutputType | null
    _avg: InspectionDetailAvgAggregateOutputType | null
    _sum: InspectionDetailSumAggregateOutputType | null
    _min: InspectionDetailMinAggregateOutputType | null
    _max: InspectionDetailMaxAggregateOutputType | null
  }

  export type InspectionDetailAvgAggregateOutputType = {
    estimatedDurationHours: number | null
  }

  export type InspectionDetailSumAggregateOutputType = {
    estimatedDurationHours: number | null
  }

  export type InspectionDetailMinAggregateOutputType = {
    id: string | null
    title: string | null
    inspector: string | null
    date: Date | null
    status: string | null
    checklistTemplateId: string | null
    generalNotes: string | null
    approvalComments: string | null
    lastStatusUpdateBy: string | null
    lastStatusUpdateAt: Date | null
    scheduledStartDate: Date | null
    scheduledFinishDate: Date | null
    estimatedDurationHours: number | null
    isArchived: boolean | null
    deletedAt: Date | null
  }

  export type InspectionDetailMaxAggregateOutputType = {
    id: string | null
    title: string | null
    inspector: string | null
    date: Date | null
    status: string | null
    checklistTemplateId: string | null
    generalNotes: string | null
    approvalComments: string | null
    lastStatusUpdateBy: string | null
    lastStatusUpdateAt: Date | null
    scheduledStartDate: Date | null
    scheduledFinishDate: Date | null
    estimatedDurationHours: number | null
    isArchived: boolean | null
    deletedAt: Date | null
  }

  export type InspectionDetailCountAggregateOutputType = {
    id: number
    title: number
    areaIds: number
    inspector: number
    date: number
    status: number
    checklistTemplateId: number
    checklistItems: number
    generalNotes: number
    approvalComments: number
    lastStatusUpdateBy: number
    lastStatusUpdateAt: number
    scheduledStartDate: number
    scheduledFinishDate: number
    estimatedDurationHours: number
    isArchived: number
    deletedAt: number
    _all: number
  }


  export type InspectionDetailAvgAggregateInputType = {
    estimatedDurationHours?: true
  }

  export type InspectionDetailSumAggregateInputType = {
    estimatedDurationHours?: true
  }

  export type InspectionDetailMinAggregateInputType = {
    id?: true
    title?: true
    inspector?: true
    date?: true
    status?: true
    checklistTemplateId?: true
    generalNotes?: true
    approvalComments?: true
    lastStatusUpdateBy?: true
    lastStatusUpdateAt?: true
    scheduledStartDate?: true
    scheduledFinishDate?: true
    estimatedDurationHours?: true
    isArchived?: true
    deletedAt?: true
  }

  export type InspectionDetailMaxAggregateInputType = {
    id?: true
    title?: true
    inspector?: true
    date?: true
    status?: true
    checklistTemplateId?: true
    generalNotes?: true
    approvalComments?: true
    lastStatusUpdateBy?: true
    lastStatusUpdateAt?: true
    scheduledStartDate?: true
    scheduledFinishDate?: true
    estimatedDurationHours?: true
    isArchived?: true
    deletedAt?: true
  }

  export type InspectionDetailCountAggregateInputType = {
    id?: true
    title?: true
    areaIds?: true
    inspector?: true
    date?: true
    status?: true
    checklistTemplateId?: true
    checklistItems?: true
    generalNotes?: true
    approvalComments?: true
    lastStatusUpdateBy?: true
    lastStatusUpdateAt?: true
    scheduledStartDate?: true
    scheduledFinishDate?: true
    estimatedDurationHours?: true
    isArchived?: true
    deletedAt?: true
    _all?: true
  }

  export type InspectionDetailAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InspectionDetail to aggregate.
     */
    where?: InspectionDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InspectionDetails to fetch.
     */
    orderBy?: InspectionDetailOrderByWithRelationInput | InspectionDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InspectionDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InspectionDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InspectionDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InspectionDetails
    **/
    _count?: true | InspectionDetailCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InspectionDetailAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InspectionDetailSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InspectionDetailMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InspectionDetailMaxAggregateInputType
  }

  export type GetInspectionDetailAggregateType<T extends InspectionDetailAggregateArgs> = {
        [P in keyof T & keyof AggregateInspectionDetail]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInspectionDetail[P]>
      : GetScalarType<T[P], AggregateInspectionDetail[P]>
  }




  export type InspectionDetailGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InspectionDetailWhereInput
    orderBy?: InspectionDetailOrderByWithAggregationInput | InspectionDetailOrderByWithAggregationInput[]
    by: InspectionDetailScalarFieldEnum[] | InspectionDetailScalarFieldEnum
    having?: InspectionDetailScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InspectionDetailCountAggregateInputType | true
    _avg?: InspectionDetailAvgAggregateInputType
    _sum?: InspectionDetailSumAggregateInputType
    _min?: InspectionDetailMinAggregateInputType
    _max?: InspectionDetailMaxAggregateInputType
  }

  export type InspectionDetailGroupByOutputType = {
    id: string
    title: string
    areaIds: string[]
    inspector: string
    date: Date
    status: string
    checklistTemplateId: string | null
    checklistItems: JsonValue | null
    generalNotes: string | null
    approvalComments: string | null
    lastStatusUpdateBy: string | null
    lastStatusUpdateAt: Date | null
    scheduledStartDate: Date | null
    scheduledFinishDate: Date | null
    estimatedDurationHours: number | null
    isArchived: boolean
    deletedAt: Date | null
    _count: InspectionDetailCountAggregateOutputType | null
    _avg: InspectionDetailAvgAggregateOutputType | null
    _sum: InspectionDetailSumAggregateOutputType | null
    _min: InspectionDetailMinAggregateOutputType | null
    _max: InspectionDetailMaxAggregateOutputType | null
  }

  type GetInspectionDetailGroupByPayload<T extends InspectionDetailGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InspectionDetailGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InspectionDetailGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InspectionDetailGroupByOutputType[P]>
            : GetScalarType<T[P], InspectionDetailGroupByOutputType[P]>
        }
      >
    >


  export type InspectionDetailSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    areaIds?: boolean
    inspector?: boolean
    date?: boolean
    status?: boolean
    checklistTemplateId?: boolean
    checklistItems?: boolean
    generalNotes?: boolean
    approvalComments?: boolean
    lastStatusUpdateBy?: boolean
    lastStatusUpdateAt?: boolean
    scheduledStartDate?: boolean
    scheduledFinishDate?: boolean
    estimatedDurationHours?: boolean
    isArchived?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["inspectionDetail"]>

  export type InspectionDetailSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    areaIds?: boolean
    inspector?: boolean
    date?: boolean
    status?: boolean
    checklistTemplateId?: boolean
    checklistItems?: boolean
    generalNotes?: boolean
    approvalComments?: boolean
    lastStatusUpdateBy?: boolean
    lastStatusUpdateAt?: boolean
    scheduledStartDate?: boolean
    scheduledFinishDate?: boolean
    estimatedDurationHours?: boolean
    isArchived?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["inspectionDetail"]>

  export type InspectionDetailSelectScalar = {
    id?: boolean
    title?: boolean
    areaIds?: boolean
    inspector?: boolean
    date?: boolean
    status?: boolean
    checklistTemplateId?: boolean
    checklistItems?: boolean
    generalNotes?: boolean
    approvalComments?: boolean
    lastStatusUpdateBy?: boolean
    lastStatusUpdateAt?: boolean
    scheduledStartDate?: boolean
    scheduledFinishDate?: boolean
    estimatedDurationHours?: boolean
    isArchived?: boolean
    deletedAt?: boolean
  }


  export type $InspectionDetailPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InspectionDetail"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      areaIds: string[]
      inspector: string
      date: Date
      status: string
      checklistTemplateId: string | null
      checklistItems: Prisma.JsonValue | null
      generalNotes: string | null
      approvalComments: string | null
      lastStatusUpdateBy: string | null
      lastStatusUpdateAt: Date | null
      scheduledStartDate: Date | null
      scheduledFinishDate: Date | null
      estimatedDurationHours: number | null
      isArchived: boolean
      deletedAt: Date | null
    }, ExtArgs["result"]["inspectionDetail"]>
    composites: {}
  }

  type InspectionDetailGetPayload<S extends boolean | null | undefined | InspectionDetailDefaultArgs> = $Result.GetResult<Prisma.$InspectionDetailPayload, S>

  type InspectionDetailCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InspectionDetailFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InspectionDetailCountAggregateInputType | true
    }

  export interface InspectionDetailDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InspectionDetail'], meta: { name: 'InspectionDetail' } }
    /**
     * Find zero or one InspectionDetail that matches the filter.
     * @param {InspectionDetailFindUniqueArgs} args - Arguments to find a InspectionDetail
     * @example
     * // Get one InspectionDetail
     * const inspectionDetail = await prisma.inspectionDetail.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InspectionDetailFindUniqueArgs>(args: SelectSubset<T, InspectionDetailFindUniqueArgs<ExtArgs>>): Prisma__InspectionDetailClient<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InspectionDetail that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InspectionDetailFindUniqueOrThrowArgs} args - Arguments to find a InspectionDetail
     * @example
     * // Get one InspectionDetail
     * const inspectionDetail = await prisma.inspectionDetail.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InspectionDetailFindUniqueOrThrowArgs>(args: SelectSubset<T, InspectionDetailFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InspectionDetailClient<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InspectionDetail that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionDetailFindFirstArgs} args - Arguments to find a InspectionDetail
     * @example
     * // Get one InspectionDetail
     * const inspectionDetail = await prisma.inspectionDetail.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InspectionDetailFindFirstArgs>(args?: SelectSubset<T, InspectionDetailFindFirstArgs<ExtArgs>>): Prisma__InspectionDetailClient<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InspectionDetail that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionDetailFindFirstOrThrowArgs} args - Arguments to find a InspectionDetail
     * @example
     * // Get one InspectionDetail
     * const inspectionDetail = await prisma.inspectionDetail.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InspectionDetailFindFirstOrThrowArgs>(args?: SelectSubset<T, InspectionDetailFindFirstOrThrowArgs<ExtArgs>>): Prisma__InspectionDetailClient<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InspectionDetails that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionDetailFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InspectionDetails
     * const inspectionDetails = await prisma.inspectionDetail.findMany()
     * 
     * // Get first 10 InspectionDetails
     * const inspectionDetails = await prisma.inspectionDetail.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inspectionDetailWithIdOnly = await prisma.inspectionDetail.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InspectionDetailFindManyArgs>(args?: SelectSubset<T, InspectionDetailFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InspectionDetail.
     * @param {InspectionDetailCreateArgs} args - Arguments to create a InspectionDetail.
     * @example
     * // Create one InspectionDetail
     * const InspectionDetail = await prisma.inspectionDetail.create({
     *   data: {
     *     // ... data to create a InspectionDetail
     *   }
     * })
     * 
     */
    create<T extends InspectionDetailCreateArgs>(args: SelectSubset<T, InspectionDetailCreateArgs<ExtArgs>>): Prisma__InspectionDetailClient<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InspectionDetails.
     * @param {InspectionDetailCreateManyArgs} args - Arguments to create many InspectionDetails.
     * @example
     * // Create many InspectionDetails
     * const inspectionDetail = await prisma.inspectionDetail.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InspectionDetailCreateManyArgs>(args?: SelectSubset<T, InspectionDetailCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InspectionDetails and returns the data saved in the database.
     * @param {InspectionDetailCreateManyAndReturnArgs} args - Arguments to create many InspectionDetails.
     * @example
     * // Create many InspectionDetails
     * const inspectionDetail = await prisma.inspectionDetail.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InspectionDetails and only return the `id`
     * const inspectionDetailWithIdOnly = await prisma.inspectionDetail.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InspectionDetailCreateManyAndReturnArgs>(args?: SelectSubset<T, InspectionDetailCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InspectionDetail.
     * @param {InspectionDetailDeleteArgs} args - Arguments to delete one InspectionDetail.
     * @example
     * // Delete one InspectionDetail
     * const InspectionDetail = await prisma.inspectionDetail.delete({
     *   where: {
     *     // ... filter to delete one InspectionDetail
     *   }
     * })
     * 
     */
    delete<T extends InspectionDetailDeleteArgs>(args: SelectSubset<T, InspectionDetailDeleteArgs<ExtArgs>>): Prisma__InspectionDetailClient<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InspectionDetail.
     * @param {InspectionDetailUpdateArgs} args - Arguments to update one InspectionDetail.
     * @example
     * // Update one InspectionDetail
     * const inspectionDetail = await prisma.inspectionDetail.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InspectionDetailUpdateArgs>(args: SelectSubset<T, InspectionDetailUpdateArgs<ExtArgs>>): Prisma__InspectionDetailClient<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InspectionDetails.
     * @param {InspectionDetailDeleteManyArgs} args - Arguments to filter InspectionDetails to delete.
     * @example
     * // Delete a few InspectionDetails
     * const { count } = await prisma.inspectionDetail.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InspectionDetailDeleteManyArgs>(args?: SelectSubset<T, InspectionDetailDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InspectionDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionDetailUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InspectionDetails
     * const inspectionDetail = await prisma.inspectionDetail.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InspectionDetailUpdateManyArgs>(args: SelectSubset<T, InspectionDetailUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InspectionDetail.
     * @param {InspectionDetailUpsertArgs} args - Arguments to update or create a InspectionDetail.
     * @example
     * // Update or create a InspectionDetail
     * const inspectionDetail = await prisma.inspectionDetail.upsert({
     *   create: {
     *     // ... data to create a InspectionDetail
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InspectionDetail we want to update
     *   }
     * })
     */
    upsert<T extends InspectionDetailUpsertArgs>(args: SelectSubset<T, InspectionDetailUpsertArgs<ExtArgs>>): Prisma__InspectionDetailClient<$Result.GetResult<Prisma.$InspectionDetailPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InspectionDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionDetailCountArgs} args - Arguments to filter InspectionDetails to count.
     * @example
     * // Count the number of InspectionDetails
     * const count = await prisma.inspectionDetail.count({
     *   where: {
     *     // ... the filter for the InspectionDetails we want to count
     *   }
     * })
    **/
    count<T extends InspectionDetailCountArgs>(
      args?: Subset<T, InspectionDetailCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InspectionDetailCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InspectionDetail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionDetailAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InspectionDetailAggregateArgs>(args: Subset<T, InspectionDetailAggregateArgs>): Prisma.PrismaPromise<GetInspectionDetailAggregateType<T>>

    /**
     * Group by InspectionDetail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionDetailGroupByArgs} args - Group by arguments.
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
      T extends InspectionDetailGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InspectionDetailGroupByArgs['orderBy'] }
        : { orderBy?: InspectionDetailGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InspectionDetailGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInspectionDetailGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InspectionDetail model
   */
  readonly fields: InspectionDetailFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InspectionDetail.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InspectionDetailClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the InspectionDetail model
   */ 
  interface InspectionDetailFieldRefs {
    readonly id: FieldRef<"InspectionDetail", 'String'>
    readonly title: FieldRef<"InspectionDetail", 'String'>
    readonly areaIds: FieldRef<"InspectionDetail", 'String[]'>
    readonly inspector: FieldRef<"InspectionDetail", 'String'>
    readonly date: FieldRef<"InspectionDetail", 'DateTime'>
    readonly status: FieldRef<"InspectionDetail", 'String'>
    readonly checklistTemplateId: FieldRef<"InspectionDetail", 'String'>
    readonly checklistItems: FieldRef<"InspectionDetail", 'Json'>
    readonly generalNotes: FieldRef<"InspectionDetail", 'String'>
    readonly approvalComments: FieldRef<"InspectionDetail", 'String'>
    readonly lastStatusUpdateBy: FieldRef<"InspectionDetail", 'String'>
    readonly lastStatusUpdateAt: FieldRef<"InspectionDetail", 'DateTime'>
    readonly scheduledStartDate: FieldRef<"InspectionDetail", 'DateTime'>
    readonly scheduledFinishDate: FieldRef<"InspectionDetail", 'DateTime'>
    readonly estimatedDurationHours: FieldRef<"InspectionDetail", 'Float'>
    readonly isArchived: FieldRef<"InspectionDetail", 'Boolean'>
    readonly deletedAt: FieldRef<"InspectionDetail", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InspectionDetail findUnique
   */
  export type InspectionDetailFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
    /**
     * Filter, which InspectionDetail to fetch.
     */
    where: InspectionDetailWhereUniqueInput
  }

  /**
   * InspectionDetail findUniqueOrThrow
   */
  export type InspectionDetailFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
    /**
     * Filter, which InspectionDetail to fetch.
     */
    where: InspectionDetailWhereUniqueInput
  }

  /**
   * InspectionDetail findFirst
   */
  export type InspectionDetailFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
    /**
     * Filter, which InspectionDetail to fetch.
     */
    where?: InspectionDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InspectionDetails to fetch.
     */
    orderBy?: InspectionDetailOrderByWithRelationInput | InspectionDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InspectionDetails.
     */
    cursor?: InspectionDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InspectionDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InspectionDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InspectionDetails.
     */
    distinct?: InspectionDetailScalarFieldEnum | InspectionDetailScalarFieldEnum[]
  }

  /**
   * InspectionDetail findFirstOrThrow
   */
  export type InspectionDetailFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
    /**
     * Filter, which InspectionDetail to fetch.
     */
    where?: InspectionDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InspectionDetails to fetch.
     */
    orderBy?: InspectionDetailOrderByWithRelationInput | InspectionDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InspectionDetails.
     */
    cursor?: InspectionDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InspectionDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InspectionDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InspectionDetails.
     */
    distinct?: InspectionDetailScalarFieldEnum | InspectionDetailScalarFieldEnum[]
  }

  /**
   * InspectionDetail findMany
   */
  export type InspectionDetailFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
    /**
     * Filter, which InspectionDetails to fetch.
     */
    where?: InspectionDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InspectionDetails to fetch.
     */
    orderBy?: InspectionDetailOrderByWithRelationInput | InspectionDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InspectionDetails.
     */
    cursor?: InspectionDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InspectionDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InspectionDetails.
     */
    skip?: number
    distinct?: InspectionDetailScalarFieldEnum | InspectionDetailScalarFieldEnum[]
  }

  /**
   * InspectionDetail create
   */
  export type InspectionDetailCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
    /**
     * The data needed to create a InspectionDetail.
     */
    data: XOR<InspectionDetailCreateInput, InspectionDetailUncheckedCreateInput>
  }

  /**
   * InspectionDetail createMany
   */
  export type InspectionDetailCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InspectionDetails.
     */
    data: InspectionDetailCreateManyInput | InspectionDetailCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InspectionDetail createManyAndReturn
   */
  export type InspectionDetailCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InspectionDetails.
     */
    data: InspectionDetailCreateManyInput | InspectionDetailCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InspectionDetail update
   */
  export type InspectionDetailUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
    /**
     * The data needed to update a InspectionDetail.
     */
    data: XOR<InspectionDetailUpdateInput, InspectionDetailUncheckedUpdateInput>
    /**
     * Choose, which InspectionDetail to update.
     */
    where: InspectionDetailWhereUniqueInput
  }

  /**
   * InspectionDetail updateMany
   */
  export type InspectionDetailUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InspectionDetails.
     */
    data: XOR<InspectionDetailUpdateManyMutationInput, InspectionDetailUncheckedUpdateManyInput>
    /**
     * Filter which InspectionDetails to update
     */
    where?: InspectionDetailWhereInput
  }

  /**
   * InspectionDetail upsert
   */
  export type InspectionDetailUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
    /**
     * The filter to search for the InspectionDetail to update in case it exists.
     */
    where: InspectionDetailWhereUniqueInput
    /**
     * In case the InspectionDetail found by the `where` argument doesn't exist, create a new InspectionDetail with this data.
     */
    create: XOR<InspectionDetailCreateInput, InspectionDetailUncheckedCreateInput>
    /**
     * In case the InspectionDetail was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InspectionDetailUpdateInput, InspectionDetailUncheckedUpdateInput>
  }

  /**
   * InspectionDetail delete
   */
  export type InspectionDetailDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
    /**
     * Filter which InspectionDetail to delete.
     */
    where: InspectionDetailWhereUniqueInput
  }

  /**
   * InspectionDetail deleteMany
   */
  export type InspectionDetailDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InspectionDetails to delete
     */
    where?: InspectionDetailWhereInput
  }

  /**
   * InspectionDetail without action
   */
  export type InspectionDetailDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionDetail
     */
    select?: InspectionDetailSelect<ExtArgs> | null
  }


  /**
   * Model DnfDocument
   */

  export type AggregateDnfDocument = {
    _count: DnfDocumentCountAggregateOutputType | null
    _avg: DnfDocumentAvgAggregateOutputType | null
    _sum: DnfDocumentSumAggregateOutputType | null
    _min: DnfDocumentMinAggregateOutputType | null
    _max: DnfDocumentMaxAggregateOutputType | null
  }

  export type DnfDocumentAvgAggregateOutputType = {
    disruptionDuration: number | null
    trainKm: number | null
  }

  export type DnfDocumentSumAggregateOutputType = {
    disruptionDuration: number | null
    trainKm: number | null
  }

  export type DnfDocumentMinAggregateOutputType = {
    id: string | null
    failureReportNo: string | null
    locationOfFailure: string | null
    failedComponentEquipmentLRUTrainNumber: string | null
    descriptionOfFailure: string | null
    impactAssessment: string | null
    staffWhoIdentifiedFailure: string | null
    dateTimeOfFailureOccurrence: Date | null
    methodOfFailureDetection: string | null
    hazardLevelId: string | null
    status: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isArchived: boolean | null
    resolutionDetails: string | null
    assignedTo: string | null
    priority: string | null
    completedDate: Date | null
    originatingInspectionId: string | null
    originatingFindingId: string | null
    immediateAction: string | null
    problemResettable: boolean | null
    trainServiceAffected: boolean | null
    trainWithdrawn: boolean | null
    systemRestoredTime: Date | null
    disruptionDuration: number | null
    trainKm: number | null
    rectificationParty: string | null
    deletedAt: Date | null
  }

  export type DnfDocumentMaxAggregateOutputType = {
    id: string | null
    failureReportNo: string | null
    locationOfFailure: string | null
    failedComponentEquipmentLRUTrainNumber: string | null
    descriptionOfFailure: string | null
    impactAssessment: string | null
    staffWhoIdentifiedFailure: string | null
    dateTimeOfFailureOccurrence: Date | null
    methodOfFailureDetection: string | null
    hazardLevelId: string | null
    status: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isArchived: boolean | null
    resolutionDetails: string | null
    assignedTo: string | null
    priority: string | null
    completedDate: Date | null
    originatingInspectionId: string | null
    originatingFindingId: string | null
    immediateAction: string | null
    problemResettable: boolean | null
    trainServiceAffected: boolean | null
    trainWithdrawn: boolean | null
    systemRestoredTime: Date | null
    disruptionDuration: number | null
    trainKm: number | null
    rectificationParty: string | null
    deletedAt: Date | null
  }

  export type DnfDocumentCountAggregateOutputType = {
    id: number
    failureReportNo: number
    locationOfFailure: number
    failedComponentEquipmentLRUTrainNumber: number
    subsystemIds: number
    descriptionOfFailure: number
    impactAssessment: number
    staffWhoIdentifiedFailure: number
    dateTimeOfFailureOccurrence: number
    methodOfFailureDetection: number
    hazardLevelId: number
    status: number
    attachments: number
    createdById: number
    createdAt: number
    updatedAt: number
    statusHistory: number
    isArchived: number
    resolutionDetails: number
    assignedTo: number
    priority: number
    completedDate: number
    originatingInspectionId: number
    originatingFindingId: number
    immediateAction: number
    problemResettable: number
    trainServiceAffected: number
    trainWithdrawn: number
    systemRestoredTime: number
    disruptionDuration: number
    trainKm: number
    rectificationParty: number
    deletedAt: number
    _all: number
  }


  export type DnfDocumentAvgAggregateInputType = {
    disruptionDuration?: true
    trainKm?: true
  }

  export type DnfDocumentSumAggregateInputType = {
    disruptionDuration?: true
    trainKm?: true
  }

  export type DnfDocumentMinAggregateInputType = {
    id?: true
    failureReportNo?: true
    locationOfFailure?: true
    failedComponentEquipmentLRUTrainNumber?: true
    descriptionOfFailure?: true
    impactAssessment?: true
    staffWhoIdentifiedFailure?: true
    dateTimeOfFailureOccurrence?: true
    methodOfFailureDetection?: true
    hazardLevelId?: true
    status?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    isArchived?: true
    resolutionDetails?: true
    assignedTo?: true
    priority?: true
    completedDate?: true
    originatingInspectionId?: true
    originatingFindingId?: true
    immediateAction?: true
    problemResettable?: true
    trainServiceAffected?: true
    trainWithdrawn?: true
    systemRestoredTime?: true
    disruptionDuration?: true
    trainKm?: true
    rectificationParty?: true
    deletedAt?: true
  }

  export type DnfDocumentMaxAggregateInputType = {
    id?: true
    failureReportNo?: true
    locationOfFailure?: true
    failedComponentEquipmentLRUTrainNumber?: true
    descriptionOfFailure?: true
    impactAssessment?: true
    staffWhoIdentifiedFailure?: true
    dateTimeOfFailureOccurrence?: true
    methodOfFailureDetection?: true
    hazardLevelId?: true
    status?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    isArchived?: true
    resolutionDetails?: true
    assignedTo?: true
    priority?: true
    completedDate?: true
    originatingInspectionId?: true
    originatingFindingId?: true
    immediateAction?: true
    problemResettable?: true
    trainServiceAffected?: true
    trainWithdrawn?: true
    systemRestoredTime?: true
    disruptionDuration?: true
    trainKm?: true
    rectificationParty?: true
    deletedAt?: true
  }

  export type DnfDocumentCountAggregateInputType = {
    id?: true
    failureReportNo?: true
    locationOfFailure?: true
    failedComponentEquipmentLRUTrainNumber?: true
    subsystemIds?: true
    descriptionOfFailure?: true
    impactAssessment?: true
    staffWhoIdentifiedFailure?: true
    dateTimeOfFailureOccurrence?: true
    methodOfFailureDetection?: true
    hazardLevelId?: true
    status?: true
    attachments?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    statusHistory?: true
    isArchived?: true
    resolutionDetails?: true
    assignedTo?: true
    priority?: true
    completedDate?: true
    originatingInspectionId?: true
    originatingFindingId?: true
    immediateAction?: true
    problemResettable?: true
    trainServiceAffected?: true
    trainWithdrawn?: true
    systemRestoredTime?: true
    disruptionDuration?: true
    trainKm?: true
    rectificationParty?: true
    deletedAt?: true
    _all?: true
  }

  export type DnfDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DnfDocument to aggregate.
     */
    where?: DnfDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DnfDocuments to fetch.
     */
    orderBy?: DnfDocumentOrderByWithRelationInput | DnfDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DnfDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DnfDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DnfDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DnfDocuments
    **/
    _count?: true | DnfDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DnfDocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DnfDocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DnfDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DnfDocumentMaxAggregateInputType
  }

  export type GetDnfDocumentAggregateType<T extends DnfDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDnfDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDnfDocument[P]>
      : GetScalarType<T[P], AggregateDnfDocument[P]>
  }




  export type DnfDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DnfDocumentWhereInput
    orderBy?: DnfDocumentOrderByWithAggregationInput | DnfDocumentOrderByWithAggregationInput[]
    by: DnfDocumentScalarFieldEnum[] | DnfDocumentScalarFieldEnum
    having?: DnfDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DnfDocumentCountAggregateInputType | true
    _avg?: DnfDocumentAvgAggregateInputType
    _sum?: DnfDocumentSumAggregateInputType
    _min?: DnfDocumentMinAggregateInputType
    _max?: DnfDocumentMaxAggregateInputType
  }

  export type DnfDocumentGroupByOutputType = {
    id: string
    failureReportNo: string | null
    locationOfFailure: string
    failedComponentEquipmentLRUTrainNumber: string | null
    subsystemIds: string[]
    descriptionOfFailure: string
    impactAssessment: string | null
    staffWhoIdentifiedFailure: string
    dateTimeOfFailureOccurrence: Date
    methodOfFailureDetection: string
    hazardLevelId: string | null
    status: string
    attachments: JsonValue | null
    createdById: string
    createdAt: Date
    updatedAt: Date
    statusHistory: JsonValue | null
    isArchived: boolean
    resolutionDetails: string | null
    assignedTo: string | null
    priority: string | null
    completedDate: Date | null
    originatingInspectionId: string | null
    originatingFindingId: string | null
    immediateAction: string | null
    problemResettable: boolean | null
    trainServiceAffected: boolean | null
    trainWithdrawn: boolean | null
    systemRestoredTime: Date | null
    disruptionDuration: number | null
    trainKm: number | null
    rectificationParty: string | null
    deletedAt: Date | null
    _count: DnfDocumentCountAggregateOutputType | null
    _avg: DnfDocumentAvgAggregateOutputType | null
    _sum: DnfDocumentSumAggregateOutputType | null
    _min: DnfDocumentMinAggregateOutputType | null
    _max: DnfDocumentMaxAggregateOutputType | null
  }

  type GetDnfDocumentGroupByPayload<T extends DnfDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DnfDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DnfDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DnfDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DnfDocumentGroupByOutputType[P]>
        }
      >
    >


  export type DnfDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    failureReportNo?: boolean
    locationOfFailure?: boolean
    failedComponentEquipmentLRUTrainNumber?: boolean
    subsystemIds?: boolean
    descriptionOfFailure?: boolean
    impactAssessment?: boolean
    staffWhoIdentifiedFailure?: boolean
    dateTimeOfFailureOccurrence?: boolean
    methodOfFailureDetection?: boolean
    hazardLevelId?: boolean
    status?: boolean
    attachments?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    statusHistory?: boolean
    isArchived?: boolean
    resolutionDetails?: boolean
    assignedTo?: boolean
    priority?: boolean
    completedDate?: boolean
    originatingInspectionId?: boolean
    originatingFindingId?: boolean
    immediateAction?: boolean
    problemResettable?: boolean
    trainServiceAffected?: boolean
    trainWithdrawn?: boolean
    systemRestoredTime?: boolean
    disruptionDuration?: boolean
    trainKm?: boolean
    rectificationParty?: boolean
    deletedAt?: boolean
    correctiveActions?: boolean | DnfDocument$correctiveActionsArgs<ExtArgs>
    _count?: boolean | DnfDocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dnfDocument"]>

  export type DnfDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    failureReportNo?: boolean
    locationOfFailure?: boolean
    failedComponentEquipmentLRUTrainNumber?: boolean
    subsystemIds?: boolean
    descriptionOfFailure?: boolean
    impactAssessment?: boolean
    staffWhoIdentifiedFailure?: boolean
    dateTimeOfFailureOccurrence?: boolean
    methodOfFailureDetection?: boolean
    hazardLevelId?: boolean
    status?: boolean
    attachments?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    statusHistory?: boolean
    isArchived?: boolean
    resolutionDetails?: boolean
    assignedTo?: boolean
    priority?: boolean
    completedDate?: boolean
    originatingInspectionId?: boolean
    originatingFindingId?: boolean
    immediateAction?: boolean
    problemResettable?: boolean
    trainServiceAffected?: boolean
    trainWithdrawn?: boolean
    systemRestoredTime?: boolean
    disruptionDuration?: boolean
    trainKm?: boolean
    rectificationParty?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["dnfDocument"]>

  export type DnfDocumentSelectScalar = {
    id?: boolean
    failureReportNo?: boolean
    locationOfFailure?: boolean
    failedComponentEquipmentLRUTrainNumber?: boolean
    subsystemIds?: boolean
    descriptionOfFailure?: boolean
    impactAssessment?: boolean
    staffWhoIdentifiedFailure?: boolean
    dateTimeOfFailureOccurrence?: boolean
    methodOfFailureDetection?: boolean
    hazardLevelId?: boolean
    status?: boolean
    attachments?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    statusHistory?: boolean
    isArchived?: boolean
    resolutionDetails?: boolean
    assignedTo?: boolean
    priority?: boolean
    completedDate?: boolean
    originatingInspectionId?: boolean
    originatingFindingId?: boolean
    immediateAction?: boolean
    problemResettable?: boolean
    trainServiceAffected?: boolean
    trainWithdrawn?: boolean
    systemRestoredTime?: boolean
    disruptionDuration?: boolean
    trainKm?: boolean
    rectificationParty?: boolean
    deletedAt?: boolean
  }

  export type DnfDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    correctiveActions?: boolean | DnfDocument$correctiveActionsArgs<ExtArgs>
    _count?: boolean | DnfDocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DnfDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DnfDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DnfDocument"
    objects: {
      correctiveActions: Prisma.$CorrectiveActionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      failureReportNo: string | null
      locationOfFailure: string
      failedComponentEquipmentLRUTrainNumber: string | null
      subsystemIds: string[]
      descriptionOfFailure: string
      impactAssessment: string | null
      staffWhoIdentifiedFailure: string
      dateTimeOfFailureOccurrence: Date
      methodOfFailureDetection: string
      hazardLevelId: string | null
      status: string
      attachments: Prisma.JsonValue | null
      createdById: string
      createdAt: Date
      updatedAt: Date
      statusHistory: Prisma.JsonValue | null
      isArchived: boolean
      resolutionDetails: string | null
      assignedTo: string | null
      priority: string | null
      completedDate: Date | null
      originatingInspectionId: string | null
      originatingFindingId: string | null
      immediateAction: string | null
      problemResettable: boolean | null
      trainServiceAffected: boolean | null
      trainWithdrawn: boolean | null
      systemRestoredTime: Date | null
      disruptionDuration: number | null
      trainKm: number | null
      rectificationParty: string | null
      deletedAt: Date | null
    }, ExtArgs["result"]["dnfDocument"]>
    composites: {}
  }

  type DnfDocumentGetPayload<S extends boolean | null | undefined | DnfDocumentDefaultArgs> = $Result.GetResult<Prisma.$DnfDocumentPayload, S>

  type DnfDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DnfDocumentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DnfDocumentCountAggregateInputType | true
    }

  export interface DnfDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DnfDocument'], meta: { name: 'DnfDocument' } }
    /**
     * Find zero or one DnfDocument that matches the filter.
     * @param {DnfDocumentFindUniqueArgs} args - Arguments to find a DnfDocument
     * @example
     * // Get one DnfDocument
     * const dnfDocument = await prisma.dnfDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DnfDocumentFindUniqueArgs>(args: SelectSubset<T, DnfDocumentFindUniqueArgs<ExtArgs>>): Prisma__DnfDocumentClient<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DnfDocument that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DnfDocumentFindUniqueOrThrowArgs} args - Arguments to find a DnfDocument
     * @example
     * // Get one DnfDocument
     * const dnfDocument = await prisma.dnfDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DnfDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DnfDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DnfDocumentClient<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DnfDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DnfDocumentFindFirstArgs} args - Arguments to find a DnfDocument
     * @example
     * // Get one DnfDocument
     * const dnfDocument = await prisma.dnfDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DnfDocumentFindFirstArgs>(args?: SelectSubset<T, DnfDocumentFindFirstArgs<ExtArgs>>): Prisma__DnfDocumentClient<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DnfDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DnfDocumentFindFirstOrThrowArgs} args - Arguments to find a DnfDocument
     * @example
     * // Get one DnfDocument
     * const dnfDocument = await prisma.dnfDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DnfDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DnfDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DnfDocumentClient<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DnfDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DnfDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DnfDocuments
     * const dnfDocuments = await prisma.dnfDocument.findMany()
     * 
     * // Get first 10 DnfDocuments
     * const dnfDocuments = await prisma.dnfDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dnfDocumentWithIdOnly = await prisma.dnfDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DnfDocumentFindManyArgs>(args?: SelectSubset<T, DnfDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DnfDocument.
     * @param {DnfDocumentCreateArgs} args - Arguments to create a DnfDocument.
     * @example
     * // Create one DnfDocument
     * const DnfDocument = await prisma.dnfDocument.create({
     *   data: {
     *     // ... data to create a DnfDocument
     *   }
     * })
     * 
     */
    create<T extends DnfDocumentCreateArgs>(args: SelectSubset<T, DnfDocumentCreateArgs<ExtArgs>>): Prisma__DnfDocumentClient<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DnfDocuments.
     * @param {DnfDocumentCreateManyArgs} args - Arguments to create many DnfDocuments.
     * @example
     * // Create many DnfDocuments
     * const dnfDocument = await prisma.dnfDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DnfDocumentCreateManyArgs>(args?: SelectSubset<T, DnfDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DnfDocuments and returns the data saved in the database.
     * @param {DnfDocumentCreateManyAndReturnArgs} args - Arguments to create many DnfDocuments.
     * @example
     * // Create many DnfDocuments
     * const dnfDocument = await prisma.dnfDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DnfDocuments and only return the `id`
     * const dnfDocumentWithIdOnly = await prisma.dnfDocument.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DnfDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DnfDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DnfDocument.
     * @param {DnfDocumentDeleteArgs} args - Arguments to delete one DnfDocument.
     * @example
     * // Delete one DnfDocument
     * const DnfDocument = await prisma.dnfDocument.delete({
     *   where: {
     *     // ... filter to delete one DnfDocument
     *   }
     * })
     * 
     */
    delete<T extends DnfDocumentDeleteArgs>(args: SelectSubset<T, DnfDocumentDeleteArgs<ExtArgs>>): Prisma__DnfDocumentClient<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DnfDocument.
     * @param {DnfDocumentUpdateArgs} args - Arguments to update one DnfDocument.
     * @example
     * // Update one DnfDocument
     * const dnfDocument = await prisma.dnfDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DnfDocumentUpdateArgs>(args: SelectSubset<T, DnfDocumentUpdateArgs<ExtArgs>>): Prisma__DnfDocumentClient<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DnfDocuments.
     * @param {DnfDocumentDeleteManyArgs} args - Arguments to filter DnfDocuments to delete.
     * @example
     * // Delete a few DnfDocuments
     * const { count } = await prisma.dnfDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DnfDocumentDeleteManyArgs>(args?: SelectSubset<T, DnfDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DnfDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DnfDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DnfDocuments
     * const dnfDocument = await prisma.dnfDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DnfDocumentUpdateManyArgs>(args: SelectSubset<T, DnfDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DnfDocument.
     * @param {DnfDocumentUpsertArgs} args - Arguments to update or create a DnfDocument.
     * @example
     * // Update or create a DnfDocument
     * const dnfDocument = await prisma.dnfDocument.upsert({
     *   create: {
     *     // ... data to create a DnfDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DnfDocument we want to update
     *   }
     * })
     */
    upsert<T extends DnfDocumentUpsertArgs>(args: SelectSubset<T, DnfDocumentUpsertArgs<ExtArgs>>): Prisma__DnfDocumentClient<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DnfDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DnfDocumentCountArgs} args - Arguments to filter DnfDocuments to count.
     * @example
     * // Count the number of DnfDocuments
     * const count = await prisma.dnfDocument.count({
     *   where: {
     *     // ... the filter for the DnfDocuments we want to count
     *   }
     * })
    **/
    count<T extends DnfDocumentCountArgs>(
      args?: Subset<T, DnfDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DnfDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DnfDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DnfDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DnfDocumentAggregateArgs>(args: Subset<T, DnfDocumentAggregateArgs>): Prisma.PrismaPromise<GetDnfDocumentAggregateType<T>>

    /**
     * Group by DnfDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DnfDocumentGroupByArgs} args - Group by arguments.
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
      T extends DnfDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DnfDocumentGroupByArgs['orderBy'] }
        : { orderBy?: DnfDocumentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DnfDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDnfDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DnfDocument model
   */
  readonly fields: DnfDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DnfDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DnfDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    correctiveActions<T extends DnfDocument$correctiveActionsArgs<ExtArgs> = {}>(args?: Subset<T, DnfDocument$correctiveActionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the DnfDocument model
   */ 
  interface DnfDocumentFieldRefs {
    readonly id: FieldRef<"DnfDocument", 'String'>
    readonly failureReportNo: FieldRef<"DnfDocument", 'String'>
    readonly locationOfFailure: FieldRef<"DnfDocument", 'String'>
    readonly failedComponentEquipmentLRUTrainNumber: FieldRef<"DnfDocument", 'String'>
    readonly subsystemIds: FieldRef<"DnfDocument", 'String[]'>
    readonly descriptionOfFailure: FieldRef<"DnfDocument", 'String'>
    readonly impactAssessment: FieldRef<"DnfDocument", 'String'>
    readonly staffWhoIdentifiedFailure: FieldRef<"DnfDocument", 'String'>
    readonly dateTimeOfFailureOccurrence: FieldRef<"DnfDocument", 'DateTime'>
    readonly methodOfFailureDetection: FieldRef<"DnfDocument", 'String'>
    readonly hazardLevelId: FieldRef<"DnfDocument", 'String'>
    readonly status: FieldRef<"DnfDocument", 'String'>
    readonly attachments: FieldRef<"DnfDocument", 'Json'>
    readonly createdById: FieldRef<"DnfDocument", 'String'>
    readonly createdAt: FieldRef<"DnfDocument", 'DateTime'>
    readonly updatedAt: FieldRef<"DnfDocument", 'DateTime'>
    readonly statusHistory: FieldRef<"DnfDocument", 'Json'>
    readonly isArchived: FieldRef<"DnfDocument", 'Boolean'>
    readonly resolutionDetails: FieldRef<"DnfDocument", 'String'>
    readonly assignedTo: FieldRef<"DnfDocument", 'String'>
    readonly priority: FieldRef<"DnfDocument", 'String'>
    readonly completedDate: FieldRef<"DnfDocument", 'DateTime'>
    readonly originatingInspectionId: FieldRef<"DnfDocument", 'String'>
    readonly originatingFindingId: FieldRef<"DnfDocument", 'String'>
    readonly immediateAction: FieldRef<"DnfDocument", 'String'>
    readonly problemResettable: FieldRef<"DnfDocument", 'Boolean'>
    readonly trainServiceAffected: FieldRef<"DnfDocument", 'Boolean'>
    readonly trainWithdrawn: FieldRef<"DnfDocument", 'Boolean'>
    readonly systemRestoredTime: FieldRef<"DnfDocument", 'DateTime'>
    readonly disruptionDuration: FieldRef<"DnfDocument", 'Float'>
    readonly trainKm: FieldRef<"DnfDocument", 'Float'>
    readonly rectificationParty: FieldRef<"DnfDocument", 'String'>
    readonly deletedAt: FieldRef<"DnfDocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DnfDocument findUnique
   */
  export type DnfDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
    /**
     * Filter, which DnfDocument to fetch.
     */
    where: DnfDocumentWhereUniqueInput
  }

  /**
   * DnfDocument findUniqueOrThrow
   */
  export type DnfDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
    /**
     * Filter, which DnfDocument to fetch.
     */
    where: DnfDocumentWhereUniqueInput
  }

  /**
   * DnfDocument findFirst
   */
  export type DnfDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
    /**
     * Filter, which DnfDocument to fetch.
     */
    where?: DnfDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DnfDocuments to fetch.
     */
    orderBy?: DnfDocumentOrderByWithRelationInput | DnfDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DnfDocuments.
     */
    cursor?: DnfDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DnfDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DnfDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DnfDocuments.
     */
    distinct?: DnfDocumentScalarFieldEnum | DnfDocumentScalarFieldEnum[]
  }

  /**
   * DnfDocument findFirstOrThrow
   */
  export type DnfDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
    /**
     * Filter, which DnfDocument to fetch.
     */
    where?: DnfDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DnfDocuments to fetch.
     */
    orderBy?: DnfDocumentOrderByWithRelationInput | DnfDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DnfDocuments.
     */
    cursor?: DnfDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DnfDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DnfDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DnfDocuments.
     */
    distinct?: DnfDocumentScalarFieldEnum | DnfDocumentScalarFieldEnum[]
  }

  /**
   * DnfDocument findMany
   */
  export type DnfDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
    /**
     * Filter, which DnfDocuments to fetch.
     */
    where?: DnfDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DnfDocuments to fetch.
     */
    orderBy?: DnfDocumentOrderByWithRelationInput | DnfDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DnfDocuments.
     */
    cursor?: DnfDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DnfDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DnfDocuments.
     */
    skip?: number
    distinct?: DnfDocumentScalarFieldEnum | DnfDocumentScalarFieldEnum[]
  }

  /**
   * DnfDocument create
   */
  export type DnfDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a DnfDocument.
     */
    data: XOR<DnfDocumentCreateInput, DnfDocumentUncheckedCreateInput>
  }

  /**
   * DnfDocument createMany
   */
  export type DnfDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DnfDocuments.
     */
    data: DnfDocumentCreateManyInput | DnfDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DnfDocument createManyAndReturn
   */
  export type DnfDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DnfDocuments.
     */
    data: DnfDocumentCreateManyInput | DnfDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DnfDocument update
   */
  export type DnfDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a DnfDocument.
     */
    data: XOR<DnfDocumentUpdateInput, DnfDocumentUncheckedUpdateInput>
    /**
     * Choose, which DnfDocument to update.
     */
    where: DnfDocumentWhereUniqueInput
  }

  /**
   * DnfDocument updateMany
   */
  export type DnfDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DnfDocuments.
     */
    data: XOR<DnfDocumentUpdateManyMutationInput, DnfDocumentUncheckedUpdateManyInput>
    /**
     * Filter which DnfDocuments to update
     */
    where?: DnfDocumentWhereInput
  }

  /**
   * DnfDocument upsert
   */
  export type DnfDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the DnfDocument to update in case it exists.
     */
    where: DnfDocumentWhereUniqueInput
    /**
     * In case the DnfDocument found by the `where` argument doesn't exist, create a new DnfDocument with this data.
     */
    create: XOR<DnfDocumentCreateInput, DnfDocumentUncheckedCreateInput>
    /**
     * In case the DnfDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DnfDocumentUpdateInput, DnfDocumentUncheckedUpdateInput>
  }

  /**
   * DnfDocument delete
   */
  export type DnfDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
    /**
     * Filter which DnfDocument to delete.
     */
    where: DnfDocumentWhereUniqueInput
  }

  /**
   * DnfDocument deleteMany
   */
  export type DnfDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DnfDocuments to delete
     */
    where?: DnfDocumentWhereInput
  }

  /**
   * DnfDocument.correctiveActions
   */
  export type DnfDocument$correctiveActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    where?: CorrectiveActionWhereInput
    orderBy?: CorrectiveActionOrderByWithRelationInput | CorrectiveActionOrderByWithRelationInput[]
    cursor?: CorrectiveActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CorrectiveActionScalarFieldEnum | CorrectiveActionScalarFieldEnum[]
  }

  /**
   * DnfDocument without action
   */
  export type DnfDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DnfDocument
     */
    select?: DnfDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DnfDocumentInclude<ExtArgs> | null
  }


  /**
   * Model CorrectiveAction
   */

  export type AggregateCorrectiveAction = {
    _count: CorrectiveActionCountAggregateOutputType | null
    _avg: CorrectiveActionAvgAggregateOutputType | null
    _sum: CorrectiveActionSumAggregateOutputType | null
    _min: CorrectiveActionMinAggregateOutputType | null
    _max: CorrectiveActionMaxAggregateOutputType | null
  }

  export type CorrectiveActionAvgAggregateOutputType = {
    diagnosisTime: number | null
    repairTime: number | null
    verificationTime: number | null
    totalDownTime: number | null
  }

  export type CorrectiveActionSumAggregateOutputType = {
    diagnosisTime: number | null
    repairTime: number | null
    verificationTime: number | null
    totalDownTime: number | null
  }

  export type CorrectiveActionMinAggregateOutputType = {
    id: string | null
    dnfId: string | null
    description: string | null
    responsiblePersonOrUnit: string | null
    createdAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
    status: string | null
    dateTimeNotified: Date | null
    dateTimeArrival: Date | null
    diagnosisTime: number | null
    repairTime: number | null
    verificationTime: number | null
    totalDownTime: number | null
  }

  export type CorrectiveActionMaxAggregateOutputType = {
    id: string | null
    dnfId: string | null
    description: string | null
    responsiblePersonOrUnit: string | null
    createdAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
    status: string | null
    dateTimeNotified: Date | null
    dateTimeArrival: Date | null
    diagnosisTime: number | null
    repairTime: number | null
    verificationTime: number | null
    totalDownTime: number | null
  }

  export type CorrectiveActionCountAggregateOutputType = {
    id: number
    dnfId: number
    description: number
    responsiblePersonOrUnit: number
    createdAt: number
    updatedAt: number
    completedAt: number
    status: number
    dateTimeNotified: number
    dateTimeArrival: number
    diagnosisTime: number
    repairTime: number
    verificationTime: number
    totalDownTime: number
    _all: number
  }


  export type CorrectiveActionAvgAggregateInputType = {
    diagnosisTime?: true
    repairTime?: true
    verificationTime?: true
    totalDownTime?: true
  }

  export type CorrectiveActionSumAggregateInputType = {
    diagnosisTime?: true
    repairTime?: true
    verificationTime?: true
    totalDownTime?: true
  }

  export type CorrectiveActionMinAggregateInputType = {
    id?: true
    dnfId?: true
    description?: true
    responsiblePersonOrUnit?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    status?: true
    dateTimeNotified?: true
    dateTimeArrival?: true
    diagnosisTime?: true
    repairTime?: true
    verificationTime?: true
    totalDownTime?: true
  }

  export type CorrectiveActionMaxAggregateInputType = {
    id?: true
    dnfId?: true
    description?: true
    responsiblePersonOrUnit?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    status?: true
    dateTimeNotified?: true
    dateTimeArrival?: true
    diagnosisTime?: true
    repairTime?: true
    verificationTime?: true
    totalDownTime?: true
  }

  export type CorrectiveActionCountAggregateInputType = {
    id?: true
    dnfId?: true
    description?: true
    responsiblePersonOrUnit?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    status?: true
    dateTimeNotified?: true
    dateTimeArrival?: true
    diagnosisTime?: true
    repairTime?: true
    verificationTime?: true
    totalDownTime?: true
    _all?: true
  }

  export type CorrectiveActionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorrectiveAction to aggregate.
     */
    where?: CorrectiveActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorrectiveActions to fetch.
     */
    orderBy?: CorrectiveActionOrderByWithRelationInput | CorrectiveActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CorrectiveActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorrectiveActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorrectiveActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CorrectiveActions
    **/
    _count?: true | CorrectiveActionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CorrectiveActionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CorrectiveActionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CorrectiveActionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CorrectiveActionMaxAggregateInputType
  }

  export type GetCorrectiveActionAggregateType<T extends CorrectiveActionAggregateArgs> = {
        [P in keyof T & keyof AggregateCorrectiveAction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCorrectiveAction[P]>
      : GetScalarType<T[P], AggregateCorrectiveAction[P]>
  }




  export type CorrectiveActionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorrectiveActionWhereInput
    orderBy?: CorrectiveActionOrderByWithAggregationInput | CorrectiveActionOrderByWithAggregationInput[]
    by: CorrectiveActionScalarFieldEnum[] | CorrectiveActionScalarFieldEnum
    having?: CorrectiveActionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CorrectiveActionCountAggregateInputType | true
    _avg?: CorrectiveActionAvgAggregateInputType
    _sum?: CorrectiveActionSumAggregateInputType
    _min?: CorrectiveActionMinAggregateInputType
    _max?: CorrectiveActionMaxAggregateInputType
  }

  export type CorrectiveActionGroupByOutputType = {
    id: string
    dnfId: string
    description: string
    responsiblePersonOrUnit: string
    createdAt: Date
    updatedAt: Date
    completedAt: Date | null
    status: string
    dateTimeNotified: Date | null
    dateTimeArrival: Date | null
    diagnosisTime: number | null
    repairTime: number | null
    verificationTime: number | null
    totalDownTime: number | null
    _count: CorrectiveActionCountAggregateOutputType | null
    _avg: CorrectiveActionAvgAggregateOutputType | null
    _sum: CorrectiveActionSumAggregateOutputType | null
    _min: CorrectiveActionMinAggregateOutputType | null
    _max: CorrectiveActionMaxAggregateOutputType | null
  }

  type GetCorrectiveActionGroupByPayload<T extends CorrectiveActionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CorrectiveActionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CorrectiveActionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CorrectiveActionGroupByOutputType[P]>
            : GetScalarType<T[P], CorrectiveActionGroupByOutputType[P]>
        }
      >
    >


  export type CorrectiveActionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dnfId?: boolean
    description?: boolean
    responsiblePersonOrUnit?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    status?: boolean
    dateTimeNotified?: boolean
    dateTimeArrival?: boolean
    diagnosisTime?: boolean
    repairTime?: boolean
    verificationTime?: boolean
    totalDownTime?: boolean
    dnf?: boolean | DnfDocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["correctiveAction"]>

  export type CorrectiveActionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dnfId?: boolean
    description?: boolean
    responsiblePersonOrUnit?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    status?: boolean
    dateTimeNotified?: boolean
    dateTimeArrival?: boolean
    diagnosisTime?: boolean
    repairTime?: boolean
    verificationTime?: boolean
    totalDownTime?: boolean
    dnf?: boolean | DnfDocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["correctiveAction"]>

  export type CorrectiveActionSelectScalar = {
    id?: boolean
    dnfId?: boolean
    description?: boolean
    responsiblePersonOrUnit?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    status?: boolean
    dateTimeNotified?: boolean
    dateTimeArrival?: boolean
    diagnosisTime?: boolean
    repairTime?: boolean
    verificationTime?: boolean
    totalDownTime?: boolean
  }

  export type CorrectiveActionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dnf?: boolean | DnfDocumentDefaultArgs<ExtArgs>
  }
  export type CorrectiveActionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dnf?: boolean | DnfDocumentDefaultArgs<ExtArgs>
  }

  export type $CorrectiveActionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CorrectiveAction"
    objects: {
      dnf: Prisma.$DnfDocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dnfId: string
      description: string
      responsiblePersonOrUnit: string
      createdAt: Date
      updatedAt: Date
      completedAt: Date | null
      status: string
      dateTimeNotified: Date | null
      dateTimeArrival: Date | null
      diagnosisTime: number | null
      repairTime: number | null
      verificationTime: number | null
      totalDownTime: number | null
    }, ExtArgs["result"]["correctiveAction"]>
    composites: {}
  }

  type CorrectiveActionGetPayload<S extends boolean | null | undefined | CorrectiveActionDefaultArgs> = $Result.GetResult<Prisma.$CorrectiveActionPayload, S>

  type CorrectiveActionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CorrectiveActionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CorrectiveActionCountAggregateInputType | true
    }

  export interface CorrectiveActionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CorrectiveAction'], meta: { name: 'CorrectiveAction' } }
    /**
     * Find zero or one CorrectiveAction that matches the filter.
     * @param {CorrectiveActionFindUniqueArgs} args - Arguments to find a CorrectiveAction
     * @example
     * // Get one CorrectiveAction
     * const correctiveAction = await prisma.correctiveAction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CorrectiveActionFindUniqueArgs>(args: SelectSubset<T, CorrectiveActionFindUniqueArgs<ExtArgs>>): Prisma__CorrectiveActionClient<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CorrectiveAction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CorrectiveActionFindUniqueOrThrowArgs} args - Arguments to find a CorrectiveAction
     * @example
     * // Get one CorrectiveAction
     * const correctiveAction = await prisma.correctiveAction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CorrectiveActionFindUniqueOrThrowArgs>(args: SelectSubset<T, CorrectiveActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CorrectiveActionClient<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CorrectiveAction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectiveActionFindFirstArgs} args - Arguments to find a CorrectiveAction
     * @example
     * // Get one CorrectiveAction
     * const correctiveAction = await prisma.correctiveAction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CorrectiveActionFindFirstArgs>(args?: SelectSubset<T, CorrectiveActionFindFirstArgs<ExtArgs>>): Prisma__CorrectiveActionClient<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CorrectiveAction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectiveActionFindFirstOrThrowArgs} args - Arguments to find a CorrectiveAction
     * @example
     * // Get one CorrectiveAction
     * const correctiveAction = await prisma.correctiveAction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CorrectiveActionFindFirstOrThrowArgs>(args?: SelectSubset<T, CorrectiveActionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CorrectiveActionClient<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CorrectiveActions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectiveActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CorrectiveActions
     * const correctiveActions = await prisma.correctiveAction.findMany()
     * 
     * // Get first 10 CorrectiveActions
     * const correctiveActions = await prisma.correctiveAction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const correctiveActionWithIdOnly = await prisma.correctiveAction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CorrectiveActionFindManyArgs>(args?: SelectSubset<T, CorrectiveActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CorrectiveAction.
     * @param {CorrectiveActionCreateArgs} args - Arguments to create a CorrectiveAction.
     * @example
     * // Create one CorrectiveAction
     * const CorrectiveAction = await prisma.correctiveAction.create({
     *   data: {
     *     // ... data to create a CorrectiveAction
     *   }
     * })
     * 
     */
    create<T extends CorrectiveActionCreateArgs>(args: SelectSubset<T, CorrectiveActionCreateArgs<ExtArgs>>): Prisma__CorrectiveActionClient<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CorrectiveActions.
     * @param {CorrectiveActionCreateManyArgs} args - Arguments to create many CorrectiveActions.
     * @example
     * // Create many CorrectiveActions
     * const correctiveAction = await prisma.correctiveAction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CorrectiveActionCreateManyArgs>(args?: SelectSubset<T, CorrectiveActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CorrectiveActions and returns the data saved in the database.
     * @param {CorrectiveActionCreateManyAndReturnArgs} args - Arguments to create many CorrectiveActions.
     * @example
     * // Create many CorrectiveActions
     * const correctiveAction = await prisma.correctiveAction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CorrectiveActions and only return the `id`
     * const correctiveActionWithIdOnly = await prisma.correctiveAction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CorrectiveActionCreateManyAndReturnArgs>(args?: SelectSubset<T, CorrectiveActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CorrectiveAction.
     * @param {CorrectiveActionDeleteArgs} args - Arguments to delete one CorrectiveAction.
     * @example
     * // Delete one CorrectiveAction
     * const CorrectiveAction = await prisma.correctiveAction.delete({
     *   where: {
     *     // ... filter to delete one CorrectiveAction
     *   }
     * })
     * 
     */
    delete<T extends CorrectiveActionDeleteArgs>(args: SelectSubset<T, CorrectiveActionDeleteArgs<ExtArgs>>): Prisma__CorrectiveActionClient<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CorrectiveAction.
     * @param {CorrectiveActionUpdateArgs} args - Arguments to update one CorrectiveAction.
     * @example
     * // Update one CorrectiveAction
     * const correctiveAction = await prisma.correctiveAction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CorrectiveActionUpdateArgs>(args: SelectSubset<T, CorrectiveActionUpdateArgs<ExtArgs>>): Prisma__CorrectiveActionClient<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CorrectiveActions.
     * @param {CorrectiveActionDeleteManyArgs} args - Arguments to filter CorrectiveActions to delete.
     * @example
     * // Delete a few CorrectiveActions
     * const { count } = await prisma.correctiveAction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CorrectiveActionDeleteManyArgs>(args?: SelectSubset<T, CorrectiveActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorrectiveActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectiveActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CorrectiveActions
     * const correctiveAction = await prisma.correctiveAction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CorrectiveActionUpdateManyArgs>(args: SelectSubset<T, CorrectiveActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CorrectiveAction.
     * @param {CorrectiveActionUpsertArgs} args - Arguments to update or create a CorrectiveAction.
     * @example
     * // Update or create a CorrectiveAction
     * const correctiveAction = await prisma.correctiveAction.upsert({
     *   create: {
     *     // ... data to create a CorrectiveAction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CorrectiveAction we want to update
     *   }
     * })
     */
    upsert<T extends CorrectiveActionUpsertArgs>(args: SelectSubset<T, CorrectiveActionUpsertArgs<ExtArgs>>): Prisma__CorrectiveActionClient<$Result.GetResult<Prisma.$CorrectiveActionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CorrectiveActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectiveActionCountArgs} args - Arguments to filter CorrectiveActions to count.
     * @example
     * // Count the number of CorrectiveActions
     * const count = await prisma.correctiveAction.count({
     *   where: {
     *     // ... the filter for the CorrectiveActions we want to count
     *   }
     * })
    **/
    count<T extends CorrectiveActionCountArgs>(
      args?: Subset<T, CorrectiveActionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CorrectiveActionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CorrectiveAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectiveActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CorrectiveActionAggregateArgs>(args: Subset<T, CorrectiveActionAggregateArgs>): Prisma.PrismaPromise<GetCorrectiveActionAggregateType<T>>

    /**
     * Group by CorrectiveAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectiveActionGroupByArgs} args - Group by arguments.
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
      T extends CorrectiveActionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CorrectiveActionGroupByArgs['orderBy'] }
        : { orderBy?: CorrectiveActionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CorrectiveActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCorrectiveActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CorrectiveAction model
   */
  readonly fields: CorrectiveActionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CorrectiveAction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CorrectiveActionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dnf<T extends DnfDocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DnfDocumentDefaultArgs<ExtArgs>>): Prisma__DnfDocumentClient<$Result.GetResult<Prisma.$DnfDocumentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the CorrectiveAction model
   */ 
  interface CorrectiveActionFieldRefs {
    readonly id: FieldRef<"CorrectiveAction", 'String'>
    readonly dnfId: FieldRef<"CorrectiveAction", 'String'>
    readonly description: FieldRef<"CorrectiveAction", 'String'>
    readonly responsiblePersonOrUnit: FieldRef<"CorrectiveAction", 'String'>
    readonly createdAt: FieldRef<"CorrectiveAction", 'DateTime'>
    readonly updatedAt: FieldRef<"CorrectiveAction", 'DateTime'>
    readonly completedAt: FieldRef<"CorrectiveAction", 'DateTime'>
    readonly status: FieldRef<"CorrectiveAction", 'String'>
    readonly dateTimeNotified: FieldRef<"CorrectiveAction", 'DateTime'>
    readonly dateTimeArrival: FieldRef<"CorrectiveAction", 'DateTime'>
    readonly diagnosisTime: FieldRef<"CorrectiveAction", 'Float'>
    readonly repairTime: FieldRef<"CorrectiveAction", 'Float'>
    readonly verificationTime: FieldRef<"CorrectiveAction", 'Float'>
    readonly totalDownTime: FieldRef<"CorrectiveAction", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * CorrectiveAction findUnique
   */
  export type CorrectiveActionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    /**
     * Filter, which CorrectiveAction to fetch.
     */
    where: CorrectiveActionWhereUniqueInput
  }

  /**
   * CorrectiveAction findUniqueOrThrow
   */
  export type CorrectiveActionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    /**
     * Filter, which CorrectiveAction to fetch.
     */
    where: CorrectiveActionWhereUniqueInput
  }

  /**
   * CorrectiveAction findFirst
   */
  export type CorrectiveActionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    /**
     * Filter, which CorrectiveAction to fetch.
     */
    where?: CorrectiveActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorrectiveActions to fetch.
     */
    orderBy?: CorrectiveActionOrderByWithRelationInput | CorrectiveActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorrectiveActions.
     */
    cursor?: CorrectiveActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorrectiveActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorrectiveActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorrectiveActions.
     */
    distinct?: CorrectiveActionScalarFieldEnum | CorrectiveActionScalarFieldEnum[]
  }

  /**
   * CorrectiveAction findFirstOrThrow
   */
  export type CorrectiveActionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    /**
     * Filter, which CorrectiveAction to fetch.
     */
    where?: CorrectiveActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorrectiveActions to fetch.
     */
    orderBy?: CorrectiveActionOrderByWithRelationInput | CorrectiveActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorrectiveActions.
     */
    cursor?: CorrectiveActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorrectiveActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorrectiveActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorrectiveActions.
     */
    distinct?: CorrectiveActionScalarFieldEnum | CorrectiveActionScalarFieldEnum[]
  }

  /**
   * CorrectiveAction findMany
   */
  export type CorrectiveActionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    /**
     * Filter, which CorrectiveActions to fetch.
     */
    where?: CorrectiveActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorrectiveActions to fetch.
     */
    orderBy?: CorrectiveActionOrderByWithRelationInput | CorrectiveActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CorrectiveActions.
     */
    cursor?: CorrectiveActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorrectiveActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorrectiveActions.
     */
    skip?: number
    distinct?: CorrectiveActionScalarFieldEnum | CorrectiveActionScalarFieldEnum[]
  }

  /**
   * CorrectiveAction create
   */
  export type CorrectiveActionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    /**
     * The data needed to create a CorrectiveAction.
     */
    data: XOR<CorrectiveActionCreateInput, CorrectiveActionUncheckedCreateInput>
  }

  /**
   * CorrectiveAction createMany
   */
  export type CorrectiveActionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CorrectiveActions.
     */
    data: CorrectiveActionCreateManyInput | CorrectiveActionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CorrectiveAction createManyAndReturn
   */
  export type CorrectiveActionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CorrectiveActions.
     */
    data: CorrectiveActionCreateManyInput | CorrectiveActionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CorrectiveAction update
   */
  export type CorrectiveActionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    /**
     * The data needed to update a CorrectiveAction.
     */
    data: XOR<CorrectiveActionUpdateInput, CorrectiveActionUncheckedUpdateInput>
    /**
     * Choose, which CorrectiveAction to update.
     */
    where: CorrectiveActionWhereUniqueInput
  }

  /**
   * CorrectiveAction updateMany
   */
  export type CorrectiveActionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CorrectiveActions.
     */
    data: XOR<CorrectiveActionUpdateManyMutationInput, CorrectiveActionUncheckedUpdateManyInput>
    /**
     * Filter which CorrectiveActions to update
     */
    where?: CorrectiveActionWhereInput
  }

  /**
   * CorrectiveAction upsert
   */
  export type CorrectiveActionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    /**
     * The filter to search for the CorrectiveAction to update in case it exists.
     */
    where: CorrectiveActionWhereUniqueInput
    /**
     * In case the CorrectiveAction found by the `where` argument doesn't exist, create a new CorrectiveAction with this data.
     */
    create: XOR<CorrectiveActionCreateInput, CorrectiveActionUncheckedCreateInput>
    /**
     * In case the CorrectiveAction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CorrectiveActionUpdateInput, CorrectiveActionUncheckedUpdateInput>
  }

  /**
   * CorrectiveAction delete
   */
  export type CorrectiveActionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
    /**
     * Filter which CorrectiveAction to delete.
     */
    where: CorrectiveActionWhereUniqueInput
  }

  /**
   * CorrectiveAction deleteMany
   */
  export type CorrectiveActionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorrectiveActions to delete
     */
    where?: CorrectiveActionWhereInput
  }

  /**
   * CorrectiveAction without action
   */
  export type CorrectiveActionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectiveAction
     */
    select?: CorrectiveActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorrectiveActionInclude<ExtArgs> | null
  }


  /**
   * Model HazardRecord
   */

  export type AggregateHazardRecord = {
    _count: HazardRecordCountAggregateOutputType | null
    _min: HazardRecordMinAggregateOutputType | null
    _max: HazardRecordMaxAggregateOutputType | null
  }

  export type HazardRecordMinAggregateOutputType = {
    id: string | null
    description: string | null
    systemGroup: string | null
    source: string | null
    potentialConsequence: string | null
    identifiedBy: string | null
    identificationDate: Date | null
    severityId: string | null
    likelihoodId: string | null
    riskLevelId: string | null
    currentControls: string | null
    proposedActions: string | null
    suggestedActions: string | null
    responsiblePersonOrUnit: string | null
    dueDate: Date | null
    status: string | null
    closureDetails: string | null
    verificationDetails: string | null
    linkedDnfId: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isArchived: boolean | null
    deletedAt: Date | null
  }

  export type HazardRecordMaxAggregateOutputType = {
    id: string | null
    description: string | null
    systemGroup: string | null
    source: string | null
    potentialConsequence: string | null
    identifiedBy: string | null
    identificationDate: Date | null
    severityId: string | null
    likelihoodId: string | null
    riskLevelId: string | null
    currentControls: string | null
    proposedActions: string | null
    suggestedActions: string | null
    responsiblePersonOrUnit: string | null
    dueDate: Date | null
    status: string | null
    closureDetails: string | null
    verificationDetails: string | null
    linkedDnfId: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isArchived: boolean | null
    deletedAt: Date | null
  }

  export type HazardRecordCountAggregateOutputType = {
    id: number
    description: number
    systemGroup: number
    locationIds: number
    source: number
    potentialConsequence: number
    identifiedBy: number
    identificationDate: number
    severityId: number
    likelihoodId: number
    riskLevelId: number
    currentControls: number
    proposedActions: number
    suggestedActions: number
    responsiblePersonOrUnit: number
    coordinatingUnits: number
    dueDate: number
    status: number
    closureDetails: number
    verificationDetails: number
    attachments: number
    linkedDnfId: number
    createdById: number
    createdAt: number
    updatedAt: number
    isArchived: number
    deletedAt: number
    statusHistory: number
    _all: number
  }


  export type HazardRecordMinAggregateInputType = {
    id?: true
    description?: true
    systemGroup?: true
    source?: true
    potentialConsequence?: true
    identifiedBy?: true
    identificationDate?: true
    severityId?: true
    likelihoodId?: true
    riskLevelId?: true
    currentControls?: true
    proposedActions?: true
    suggestedActions?: true
    responsiblePersonOrUnit?: true
    dueDate?: true
    status?: true
    closureDetails?: true
    verificationDetails?: true
    linkedDnfId?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    isArchived?: true
    deletedAt?: true
  }

  export type HazardRecordMaxAggregateInputType = {
    id?: true
    description?: true
    systemGroup?: true
    source?: true
    potentialConsequence?: true
    identifiedBy?: true
    identificationDate?: true
    severityId?: true
    likelihoodId?: true
    riskLevelId?: true
    currentControls?: true
    proposedActions?: true
    suggestedActions?: true
    responsiblePersonOrUnit?: true
    dueDate?: true
    status?: true
    closureDetails?: true
    verificationDetails?: true
    linkedDnfId?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    isArchived?: true
    deletedAt?: true
  }

  export type HazardRecordCountAggregateInputType = {
    id?: true
    description?: true
    systemGroup?: true
    locationIds?: true
    source?: true
    potentialConsequence?: true
    identifiedBy?: true
    identificationDate?: true
    severityId?: true
    likelihoodId?: true
    riskLevelId?: true
    currentControls?: true
    proposedActions?: true
    suggestedActions?: true
    responsiblePersonOrUnit?: true
    coordinatingUnits?: true
    dueDate?: true
    status?: true
    closureDetails?: true
    verificationDetails?: true
    attachments?: true
    linkedDnfId?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    isArchived?: true
    deletedAt?: true
    statusHistory?: true
    _all?: true
  }

  export type HazardRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HazardRecord to aggregate.
     */
    where?: HazardRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HazardRecords to fetch.
     */
    orderBy?: HazardRecordOrderByWithRelationInput | HazardRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HazardRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HazardRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HazardRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HazardRecords
    **/
    _count?: true | HazardRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HazardRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HazardRecordMaxAggregateInputType
  }

  export type GetHazardRecordAggregateType<T extends HazardRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateHazardRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHazardRecord[P]>
      : GetScalarType<T[P], AggregateHazardRecord[P]>
  }




  export type HazardRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HazardRecordWhereInput
    orderBy?: HazardRecordOrderByWithAggregationInput | HazardRecordOrderByWithAggregationInput[]
    by: HazardRecordScalarFieldEnum[] | HazardRecordScalarFieldEnum
    having?: HazardRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HazardRecordCountAggregateInputType | true
    _min?: HazardRecordMinAggregateInputType
    _max?: HazardRecordMaxAggregateInputType
  }

  export type HazardRecordGroupByOutputType = {
    id: string
    description: string
    systemGroup: string | null
    locationIds: string[]
    source: string | null
    potentialConsequence: string | null
    identifiedBy: string
    identificationDate: Date
    severityId: string | null
    likelihoodId: string | null
    riskLevelId: string | null
    currentControls: string
    proposedActions: string | null
    suggestedActions: string | null
    responsiblePersonOrUnit: string | null
    coordinatingUnits: string[]
    dueDate: Date | null
    status: string
    closureDetails: string | null
    verificationDetails: string | null
    attachments: JsonValue | null
    linkedDnfId: string | null
    createdById: string
    createdAt: Date
    updatedAt: Date
    isArchived: boolean
    deletedAt: Date | null
    statusHistory: JsonValue | null
    _count: HazardRecordCountAggregateOutputType | null
    _min: HazardRecordMinAggregateOutputType | null
    _max: HazardRecordMaxAggregateOutputType | null
  }

  type GetHazardRecordGroupByPayload<T extends HazardRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HazardRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HazardRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HazardRecordGroupByOutputType[P]>
            : GetScalarType<T[P], HazardRecordGroupByOutputType[P]>
        }
      >
    >


  export type HazardRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    description?: boolean
    systemGroup?: boolean
    locationIds?: boolean
    source?: boolean
    potentialConsequence?: boolean
    identifiedBy?: boolean
    identificationDate?: boolean
    severityId?: boolean
    likelihoodId?: boolean
    riskLevelId?: boolean
    currentControls?: boolean
    proposedActions?: boolean
    suggestedActions?: boolean
    responsiblePersonOrUnit?: boolean
    coordinatingUnits?: boolean
    dueDate?: boolean
    status?: boolean
    closureDetails?: boolean
    verificationDetails?: boolean
    attachments?: boolean
    linkedDnfId?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isArchived?: boolean
    deletedAt?: boolean
    statusHistory?: boolean
  }, ExtArgs["result"]["hazardRecord"]>

  export type HazardRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    description?: boolean
    systemGroup?: boolean
    locationIds?: boolean
    source?: boolean
    potentialConsequence?: boolean
    identifiedBy?: boolean
    identificationDate?: boolean
    severityId?: boolean
    likelihoodId?: boolean
    riskLevelId?: boolean
    currentControls?: boolean
    proposedActions?: boolean
    suggestedActions?: boolean
    responsiblePersonOrUnit?: boolean
    coordinatingUnits?: boolean
    dueDate?: boolean
    status?: boolean
    closureDetails?: boolean
    verificationDetails?: boolean
    attachments?: boolean
    linkedDnfId?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isArchived?: boolean
    deletedAt?: boolean
    statusHistory?: boolean
  }, ExtArgs["result"]["hazardRecord"]>

  export type HazardRecordSelectScalar = {
    id?: boolean
    description?: boolean
    systemGroup?: boolean
    locationIds?: boolean
    source?: boolean
    potentialConsequence?: boolean
    identifiedBy?: boolean
    identificationDate?: boolean
    severityId?: boolean
    likelihoodId?: boolean
    riskLevelId?: boolean
    currentControls?: boolean
    proposedActions?: boolean
    suggestedActions?: boolean
    responsiblePersonOrUnit?: boolean
    coordinatingUnits?: boolean
    dueDate?: boolean
    status?: boolean
    closureDetails?: boolean
    verificationDetails?: boolean
    attachments?: boolean
    linkedDnfId?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isArchived?: boolean
    deletedAt?: boolean
    statusHistory?: boolean
  }


  export type $HazardRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HazardRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      description: string
      systemGroup: string | null
      locationIds: string[]
      source: string | null
      potentialConsequence: string | null
      identifiedBy: string
      identificationDate: Date
      severityId: string | null
      likelihoodId: string | null
      riskLevelId: string | null
      currentControls: string
      proposedActions: string | null
      suggestedActions: string | null
      responsiblePersonOrUnit: string | null
      coordinatingUnits: string[]
      dueDate: Date | null
      status: string
      closureDetails: string | null
      verificationDetails: string | null
      attachments: Prisma.JsonValue | null
      linkedDnfId: string | null
      createdById: string
      createdAt: Date
      updatedAt: Date
      isArchived: boolean
      deletedAt: Date | null
      statusHistory: Prisma.JsonValue | null
    }, ExtArgs["result"]["hazardRecord"]>
    composites: {}
  }

  type HazardRecordGetPayload<S extends boolean | null | undefined | HazardRecordDefaultArgs> = $Result.GetResult<Prisma.$HazardRecordPayload, S>

  type HazardRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<HazardRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: HazardRecordCountAggregateInputType | true
    }

  export interface HazardRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HazardRecord'], meta: { name: 'HazardRecord' } }
    /**
     * Find zero or one HazardRecord that matches the filter.
     * @param {HazardRecordFindUniqueArgs} args - Arguments to find a HazardRecord
     * @example
     * // Get one HazardRecord
     * const hazardRecord = await prisma.hazardRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HazardRecordFindUniqueArgs>(args: SelectSubset<T, HazardRecordFindUniqueArgs<ExtArgs>>): Prisma__HazardRecordClient<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one HazardRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {HazardRecordFindUniqueOrThrowArgs} args - Arguments to find a HazardRecord
     * @example
     * // Get one HazardRecord
     * const hazardRecord = await prisma.hazardRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HazardRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, HazardRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HazardRecordClient<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first HazardRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HazardRecordFindFirstArgs} args - Arguments to find a HazardRecord
     * @example
     * // Get one HazardRecord
     * const hazardRecord = await prisma.hazardRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HazardRecordFindFirstArgs>(args?: SelectSubset<T, HazardRecordFindFirstArgs<ExtArgs>>): Prisma__HazardRecordClient<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first HazardRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HazardRecordFindFirstOrThrowArgs} args - Arguments to find a HazardRecord
     * @example
     * // Get one HazardRecord
     * const hazardRecord = await prisma.hazardRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HazardRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, HazardRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__HazardRecordClient<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more HazardRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HazardRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HazardRecords
     * const hazardRecords = await prisma.hazardRecord.findMany()
     * 
     * // Get first 10 HazardRecords
     * const hazardRecords = await prisma.hazardRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hazardRecordWithIdOnly = await prisma.hazardRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HazardRecordFindManyArgs>(args?: SelectSubset<T, HazardRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a HazardRecord.
     * @param {HazardRecordCreateArgs} args - Arguments to create a HazardRecord.
     * @example
     * // Create one HazardRecord
     * const HazardRecord = await prisma.hazardRecord.create({
     *   data: {
     *     // ... data to create a HazardRecord
     *   }
     * })
     * 
     */
    create<T extends HazardRecordCreateArgs>(args: SelectSubset<T, HazardRecordCreateArgs<ExtArgs>>): Prisma__HazardRecordClient<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many HazardRecords.
     * @param {HazardRecordCreateManyArgs} args - Arguments to create many HazardRecords.
     * @example
     * // Create many HazardRecords
     * const hazardRecord = await prisma.hazardRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HazardRecordCreateManyArgs>(args?: SelectSubset<T, HazardRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HazardRecords and returns the data saved in the database.
     * @param {HazardRecordCreateManyAndReturnArgs} args - Arguments to create many HazardRecords.
     * @example
     * // Create many HazardRecords
     * const hazardRecord = await prisma.hazardRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HazardRecords and only return the `id`
     * const hazardRecordWithIdOnly = await prisma.hazardRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HazardRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, HazardRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a HazardRecord.
     * @param {HazardRecordDeleteArgs} args - Arguments to delete one HazardRecord.
     * @example
     * // Delete one HazardRecord
     * const HazardRecord = await prisma.hazardRecord.delete({
     *   where: {
     *     // ... filter to delete one HazardRecord
     *   }
     * })
     * 
     */
    delete<T extends HazardRecordDeleteArgs>(args: SelectSubset<T, HazardRecordDeleteArgs<ExtArgs>>): Prisma__HazardRecordClient<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one HazardRecord.
     * @param {HazardRecordUpdateArgs} args - Arguments to update one HazardRecord.
     * @example
     * // Update one HazardRecord
     * const hazardRecord = await prisma.hazardRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HazardRecordUpdateArgs>(args: SelectSubset<T, HazardRecordUpdateArgs<ExtArgs>>): Prisma__HazardRecordClient<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more HazardRecords.
     * @param {HazardRecordDeleteManyArgs} args - Arguments to filter HazardRecords to delete.
     * @example
     * // Delete a few HazardRecords
     * const { count } = await prisma.hazardRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HazardRecordDeleteManyArgs>(args?: SelectSubset<T, HazardRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HazardRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HazardRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HazardRecords
     * const hazardRecord = await prisma.hazardRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HazardRecordUpdateManyArgs>(args: SelectSubset<T, HazardRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HazardRecord.
     * @param {HazardRecordUpsertArgs} args - Arguments to update or create a HazardRecord.
     * @example
     * // Update or create a HazardRecord
     * const hazardRecord = await prisma.hazardRecord.upsert({
     *   create: {
     *     // ... data to create a HazardRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HazardRecord we want to update
     *   }
     * })
     */
    upsert<T extends HazardRecordUpsertArgs>(args: SelectSubset<T, HazardRecordUpsertArgs<ExtArgs>>): Prisma__HazardRecordClient<$Result.GetResult<Prisma.$HazardRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of HazardRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HazardRecordCountArgs} args - Arguments to filter HazardRecords to count.
     * @example
     * // Count the number of HazardRecords
     * const count = await prisma.hazardRecord.count({
     *   where: {
     *     // ... the filter for the HazardRecords we want to count
     *   }
     * })
    **/
    count<T extends HazardRecordCountArgs>(
      args?: Subset<T, HazardRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HazardRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HazardRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HazardRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends HazardRecordAggregateArgs>(args: Subset<T, HazardRecordAggregateArgs>): Prisma.PrismaPromise<GetHazardRecordAggregateType<T>>

    /**
     * Group by HazardRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HazardRecordGroupByArgs} args - Group by arguments.
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
      T extends HazardRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HazardRecordGroupByArgs['orderBy'] }
        : { orderBy?: HazardRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, HazardRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHazardRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HazardRecord model
   */
  readonly fields: HazardRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HazardRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HazardRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the HazardRecord model
   */ 
  interface HazardRecordFieldRefs {
    readonly id: FieldRef<"HazardRecord", 'String'>
    readonly description: FieldRef<"HazardRecord", 'String'>
    readonly systemGroup: FieldRef<"HazardRecord", 'String'>
    readonly locationIds: FieldRef<"HazardRecord", 'String[]'>
    readonly source: FieldRef<"HazardRecord", 'String'>
    readonly potentialConsequence: FieldRef<"HazardRecord", 'String'>
    readonly identifiedBy: FieldRef<"HazardRecord", 'String'>
    readonly identificationDate: FieldRef<"HazardRecord", 'DateTime'>
    readonly severityId: FieldRef<"HazardRecord", 'String'>
    readonly likelihoodId: FieldRef<"HazardRecord", 'String'>
    readonly riskLevelId: FieldRef<"HazardRecord", 'String'>
    readonly currentControls: FieldRef<"HazardRecord", 'String'>
    readonly proposedActions: FieldRef<"HazardRecord", 'String'>
    readonly suggestedActions: FieldRef<"HazardRecord", 'String'>
    readonly responsiblePersonOrUnit: FieldRef<"HazardRecord", 'String'>
    readonly coordinatingUnits: FieldRef<"HazardRecord", 'String[]'>
    readonly dueDate: FieldRef<"HazardRecord", 'DateTime'>
    readonly status: FieldRef<"HazardRecord", 'String'>
    readonly closureDetails: FieldRef<"HazardRecord", 'String'>
    readonly verificationDetails: FieldRef<"HazardRecord", 'String'>
    readonly attachments: FieldRef<"HazardRecord", 'Json'>
    readonly linkedDnfId: FieldRef<"HazardRecord", 'String'>
    readonly createdById: FieldRef<"HazardRecord", 'String'>
    readonly createdAt: FieldRef<"HazardRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"HazardRecord", 'DateTime'>
    readonly isArchived: FieldRef<"HazardRecord", 'Boolean'>
    readonly deletedAt: FieldRef<"HazardRecord", 'DateTime'>
    readonly statusHistory: FieldRef<"HazardRecord", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * HazardRecord findUnique
   */
  export type HazardRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
    /**
     * Filter, which HazardRecord to fetch.
     */
    where: HazardRecordWhereUniqueInput
  }

  /**
   * HazardRecord findUniqueOrThrow
   */
  export type HazardRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
    /**
     * Filter, which HazardRecord to fetch.
     */
    where: HazardRecordWhereUniqueInput
  }

  /**
   * HazardRecord findFirst
   */
  export type HazardRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
    /**
     * Filter, which HazardRecord to fetch.
     */
    where?: HazardRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HazardRecords to fetch.
     */
    orderBy?: HazardRecordOrderByWithRelationInput | HazardRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HazardRecords.
     */
    cursor?: HazardRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HazardRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HazardRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HazardRecords.
     */
    distinct?: HazardRecordScalarFieldEnum | HazardRecordScalarFieldEnum[]
  }

  /**
   * HazardRecord findFirstOrThrow
   */
  export type HazardRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
    /**
     * Filter, which HazardRecord to fetch.
     */
    where?: HazardRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HazardRecords to fetch.
     */
    orderBy?: HazardRecordOrderByWithRelationInput | HazardRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HazardRecords.
     */
    cursor?: HazardRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HazardRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HazardRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HazardRecords.
     */
    distinct?: HazardRecordScalarFieldEnum | HazardRecordScalarFieldEnum[]
  }

  /**
   * HazardRecord findMany
   */
  export type HazardRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
    /**
     * Filter, which HazardRecords to fetch.
     */
    where?: HazardRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HazardRecords to fetch.
     */
    orderBy?: HazardRecordOrderByWithRelationInput | HazardRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HazardRecords.
     */
    cursor?: HazardRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HazardRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HazardRecords.
     */
    skip?: number
    distinct?: HazardRecordScalarFieldEnum | HazardRecordScalarFieldEnum[]
  }

  /**
   * HazardRecord create
   */
  export type HazardRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
    /**
     * The data needed to create a HazardRecord.
     */
    data: XOR<HazardRecordCreateInput, HazardRecordUncheckedCreateInput>
  }

  /**
   * HazardRecord createMany
   */
  export type HazardRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HazardRecords.
     */
    data: HazardRecordCreateManyInput | HazardRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HazardRecord createManyAndReturn
   */
  export type HazardRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many HazardRecords.
     */
    data: HazardRecordCreateManyInput | HazardRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HazardRecord update
   */
  export type HazardRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
    /**
     * The data needed to update a HazardRecord.
     */
    data: XOR<HazardRecordUpdateInput, HazardRecordUncheckedUpdateInput>
    /**
     * Choose, which HazardRecord to update.
     */
    where: HazardRecordWhereUniqueInput
  }

  /**
   * HazardRecord updateMany
   */
  export type HazardRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HazardRecords.
     */
    data: XOR<HazardRecordUpdateManyMutationInput, HazardRecordUncheckedUpdateManyInput>
    /**
     * Filter which HazardRecords to update
     */
    where?: HazardRecordWhereInput
  }

  /**
   * HazardRecord upsert
   */
  export type HazardRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
    /**
     * The filter to search for the HazardRecord to update in case it exists.
     */
    where: HazardRecordWhereUniqueInput
    /**
     * In case the HazardRecord found by the `where` argument doesn't exist, create a new HazardRecord with this data.
     */
    create: XOR<HazardRecordCreateInput, HazardRecordUncheckedCreateInput>
    /**
     * In case the HazardRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HazardRecordUpdateInput, HazardRecordUncheckedUpdateInput>
  }

  /**
   * HazardRecord delete
   */
  export type HazardRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
    /**
     * Filter which HazardRecord to delete.
     */
    where: HazardRecordWhereUniqueInput
  }

  /**
   * HazardRecord deleteMany
   */
  export type HazardRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HazardRecords to delete
     */
    where?: HazardRecordWhereInput
  }

  /**
   * HazardRecord without action
   */
  export type HazardRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HazardRecord
     */
    select?: HazardRecordSelect<ExtArgs> | null
  }


  /**
   * Model Improvement
   */

  export type AggregateImprovement = {
    _count: ImprovementCountAggregateOutputType | null
    _avg: ImprovementAvgAggregateOutputType | null
    _sum: ImprovementSumAggregateOutputType | null
    _min: ImprovementMinAggregateOutputType | null
    _max: ImprovementMaxAggregateOutputType | null
  }

  export type ImprovementAvgAggregateOutputType = {
    estimatedCost: number | null
  }

  export type ImprovementSumAggregateOutputType = {
    estimatedCost: number | null
  }

  export type ImprovementMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    category: string | null
    status: string | null
    submittedBy: string | null
    createdById: string | null
    submissionDate: Date | null
    updatedAt: Date | null
    benefitAnalysis: string | null
    estimatedCost: number | null
  }

  export type ImprovementMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    category: string | null
    status: string | null
    submittedBy: string | null
    createdById: string | null
    submissionDate: Date | null
    updatedAt: Date | null
    benefitAnalysis: string | null
    estimatedCost: number | null
  }

  export type ImprovementCountAggregateOutputType = {
    id: number
    title: number
    description: number
    category: number
    status: number
    submittedBy: number
    createdById: number
    submissionDate: number
    updatedAt: number
    benefitAnalysis: number
    estimatedCost: number
    attachments: number
    _all: number
  }


  export type ImprovementAvgAggregateInputType = {
    estimatedCost?: true
  }

  export type ImprovementSumAggregateInputType = {
    estimatedCost?: true
  }

  export type ImprovementMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    status?: true
    submittedBy?: true
    createdById?: true
    submissionDate?: true
    updatedAt?: true
    benefitAnalysis?: true
    estimatedCost?: true
  }

  export type ImprovementMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    status?: true
    submittedBy?: true
    createdById?: true
    submissionDate?: true
    updatedAt?: true
    benefitAnalysis?: true
    estimatedCost?: true
  }

  export type ImprovementCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    status?: true
    submittedBy?: true
    createdById?: true
    submissionDate?: true
    updatedAt?: true
    benefitAnalysis?: true
    estimatedCost?: true
    attachments?: true
    _all?: true
  }

  export type ImprovementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Improvement to aggregate.
     */
    where?: ImprovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Improvements to fetch.
     */
    orderBy?: ImprovementOrderByWithRelationInput | ImprovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImprovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Improvements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Improvements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Improvements
    **/
    _count?: true | ImprovementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImprovementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImprovementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImprovementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImprovementMaxAggregateInputType
  }

  export type GetImprovementAggregateType<T extends ImprovementAggregateArgs> = {
        [P in keyof T & keyof AggregateImprovement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImprovement[P]>
      : GetScalarType<T[P], AggregateImprovement[P]>
  }




  export type ImprovementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImprovementWhereInput
    orderBy?: ImprovementOrderByWithAggregationInput | ImprovementOrderByWithAggregationInput[]
    by: ImprovementScalarFieldEnum[] | ImprovementScalarFieldEnum
    having?: ImprovementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImprovementCountAggregateInputType | true
    _avg?: ImprovementAvgAggregateInputType
    _sum?: ImprovementSumAggregateInputType
    _min?: ImprovementMinAggregateInputType
    _max?: ImprovementMaxAggregateInputType
  }

  export type ImprovementGroupByOutputType = {
    id: string
    title: string
    description: string
    category: string
    status: string
    submittedBy: string
    createdById: string
    submissionDate: Date
    updatedAt: Date
    benefitAnalysis: string | null
    estimatedCost: number | null
    attachments: JsonValue | null
    _count: ImprovementCountAggregateOutputType | null
    _avg: ImprovementAvgAggregateOutputType | null
    _sum: ImprovementSumAggregateOutputType | null
    _min: ImprovementMinAggregateOutputType | null
    _max: ImprovementMaxAggregateOutputType | null
  }

  type GetImprovementGroupByPayload<T extends ImprovementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImprovementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImprovementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImprovementGroupByOutputType[P]>
            : GetScalarType<T[P], ImprovementGroupByOutputType[P]>
        }
      >
    >


  export type ImprovementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    submittedBy?: boolean
    createdById?: boolean
    submissionDate?: boolean
    updatedAt?: boolean
    benefitAnalysis?: boolean
    estimatedCost?: boolean
    attachments?: boolean
  }, ExtArgs["result"]["improvement"]>

  export type ImprovementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    submittedBy?: boolean
    createdById?: boolean
    submissionDate?: boolean
    updatedAt?: boolean
    benefitAnalysis?: boolean
    estimatedCost?: boolean
    attachments?: boolean
  }, ExtArgs["result"]["improvement"]>

  export type ImprovementSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    submittedBy?: boolean
    createdById?: boolean
    submissionDate?: boolean
    updatedAt?: boolean
    benefitAnalysis?: boolean
    estimatedCost?: boolean
    attachments?: boolean
  }


  export type $ImprovementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Improvement"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      category: string
      status: string
      submittedBy: string
      createdById: string
      submissionDate: Date
      updatedAt: Date
      benefitAnalysis: string | null
      estimatedCost: number | null
      attachments: Prisma.JsonValue | null
    }, ExtArgs["result"]["improvement"]>
    composites: {}
  }

  type ImprovementGetPayload<S extends boolean | null | undefined | ImprovementDefaultArgs> = $Result.GetResult<Prisma.$ImprovementPayload, S>

  type ImprovementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ImprovementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ImprovementCountAggregateInputType | true
    }

  export interface ImprovementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Improvement'], meta: { name: 'Improvement' } }
    /**
     * Find zero or one Improvement that matches the filter.
     * @param {ImprovementFindUniqueArgs} args - Arguments to find a Improvement
     * @example
     * // Get one Improvement
     * const improvement = await prisma.improvement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImprovementFindUniqueArgs>(args: SelectSubset<T, ImprovementFindUniqueArgs<ExtArgs>>): Prisma__ImprovementClient<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Improvement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ImprovementFindUniqueOrThrowArgs} args - Arguments to find a Improvement
     * @example
     * // Get one Improvement
     * const improvement = await prisma.improvement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImprovementFindUniqueOrThrowArgs>(args: SelectSubset<T, ImprovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImprovementClient<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Improvement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImprovementFindFirstArgs} args - Arguments to find a Improvement
     * @example
     * // Get one Improvement
     * const improvement = await prisma.improvement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImprovementFindFirstArgs>(args?: SelectSubset<T, ImprovementFindFirstArgs<ExtArgs>>): Prisma__ImprovementClient<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Improvement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImprovementFindFirstOrThrowArgs} args - Arguments to find a Improvement
     * @example
     * // Get one Improvement
     * const improvement = await prisma.improvement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImprovementFindFirstOrThrowArgs>(args?: SelectSubset<T, ImprovementFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImprovementClient<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Improvements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImprovementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Improvements
     * const improvements = await prisma.improvement.findMany()
     * 
     * // Get first 10 Improvements
     * const improvements = await prisma.improvement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const improvementWithIdOnly = await prisma.improvement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImprovementFindManyArgs>(args?: SelectSubset<T, ImprovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Improvement.
     * @param {ImprovementCreateArgs} args - Arguments to create a Improvement.
     * @example
     * // Create one Improvement
     * const Improvement = await prisma.improvement.create({
     *   data: {
     *     // ... data to create a Improvement
     *   }
     * })
     * 
     */
    create<T extends ImprovementCreateArgs>(args: SelectSubset<T, ImprovementCreateArgs<ExtArgs>>): Prisma__ImprovementClient<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Improvements.
     * @param {ImprovementCreateManyArgs} args - Arguments to create many Improvements.
     * @example
     * // Create many Improvements
     * const improvement = await prisma.improvement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImprovementCreateManyArgs>(args?: SelectSubset<T, ImprovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Improvements and returns the data saved in the database.
     * @param {ImprovementCreateManyAndReturnArgs} args - Arguments to create many Improvements.
     * @example
     * // Create many Improvements
     * const improvement = await prisma.improvement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Improvements and only return the `id`
     * const improvementWithIdOnly = await prisma.improvement.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImprovementCreateManyAndReturnArgs>(args?: SelectSubset<T, ImprovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Improvement.
     * @param {ImprovementDeleteArgs} args - Arguments to delete one Improvement.
     * @example
     * // Delete one Improvement
     * const Improvement = await prisma.improvement.delete({
     *   where: {
     *     // ... filter to delete one Improvement
     *   }
     * })
     * 
     */
    delete<T extends ImprovementDeleteArgs>(args: SelectSubset<T, ImprovementDeleteArgs<ExtArgs>>): Prisma__ImprovementClient<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Improvement.
     * @param {ImprovementUpdateArgs} args - Arguments to update one Improvement.
     * @example
     * // Update one Improvement
     * const improvement = await prisma.improvement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImprovementUpdateArgs>(args: SelectSubset<T, ImprovementUpdateArgs<ExtArgs>>): Prisma__ImprovementClient<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Improvements.
     * @param {ImprovementDeleteManyArgs} args - Arguments to filter Improvements to delete.
     * @example
     * // Delete a few Improvements
     * const { count } = await prisma.improvement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImprovementDeleteManyArgs>(args?: SelectSubset<T, ImprovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Improvements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImprovementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Improvements
     * const improvement = await prisma.improvement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImprovementUpdateManyArgs>(args: SelectSubset<T, ImprovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Improvement.
     * @param {ImprovementUpsertArgs} args - Arguments to update or create a Improvement.
     * @example
     * // Update or create a Improvement
     * const improvement = await prisma.improvement.upsert({
     *   create: {
     *     // ... data to create a Improvement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Improvement we want to update
     *   }
     * })
     */
    upsert<T extends ImprovementUpsertArgs>(args: SelectSubset<T, ImprovementUpsertArgs<ExtArgs>>): Prisma__ImprovementClient<$Result.GetResult<Prisma.$ImprovementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Improvements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImprovementCountArgs} args - Arguments to filter Improvements to count.
     * @example
     * // Count the number of Improvements
     * const count = await prisma.improvement.count({
     *   where: {
     *     // ... the filter for the Improvements we want to count
     *   }
     * })
    **/
    count<T extends ImprovementCountArgs>(
      args?: Subset<T, ImprovementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImprovementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Improvement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImprovementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImprovementAggregateArgs>(args: Subset<T, ImprovementAggregateArgs>): Prisma.PrismaPromise<GetImprovementAggregateType<T>>

    /**
     * Group by Improvement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImprovementGroupByArgs} args - Group by arguments.
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
      T extends ImprovementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImprovementGroupByArgs['orderBy'] }
        : { orderBy?: ImprovementGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImprovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImprovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Improvement model
   */
  readonly fields: ImprovementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Improvement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImprovementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Improvement model
   */ 
  interface ImprovementFieldRefs {
    readonly id: FieldRef<"Improvement", 'String'>
    readonly title: FieldRef<"Improvement", 'String'>
    readonly description: FieldRef<"Improvement", 'String'>
    readonly category: FieldRef<"Improvement", 'String'>
    readonly status: FieldRef<"Improvement", 'String'>
    readonly submittedBy: FieldRef<"Improvement", 'String'>
    readonly createdById: FieldRef<"Improvement", 'String'>
    readonly submissionDate: FieldRef<"Improvement", 'DateTime'>
    readonly updatedAt: FieldRef<"Improvement", 'DateTime'>
    readonly benefitAnalysis: FieldRef<"Improvement", 'String'>
    readonly estimatedCost: FieldRef<"Improvement", 'Float'>
    readonly attachments: FieldRef<"Improvement", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Improvement findUnique
   */
  export type ImprovementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
    /**
     * Filter, which Improvement to fetch.
     */
    where: ImprovementWhereUniqueInput
  }

  /**
   * Improvement findUniqueOrThrow
   */
  export type ImprovementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
    /**
     * Filter, which Improvement to fetch.
     */
    where: ImprovementWhereUniqueInput
  }

  /**
   * Improvement findFirst
   */
  export type ImprovementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
    /**
     * Filter, which Improvement to fetch.
     */
    where?: ImprovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Improvements to fetch.
     */
    orderBy?: ImprovementOrderByWithRelationInput | ImprovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Improvements.
     */
    cursor?: ImprovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Improvements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Improvements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Improvements.
     */
    distinct?: ImprovementScalarFieldEnum | ImprovementScalarFieldEnum[]
  }

  /**
   * Improvement findFirstOrThrow
   */
  export type ImprovementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
    /**
     * Filter, which Improvement to fetch.
     */
    where?: ImprovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Improvements to fetch.
     */
    orderBy?: ImprovementOrderByWithRelationInput | ImprovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Improvements.
     */
    cursor?: ImprovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Improvements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Improvements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Improvements.
     */
    distinct?: ImprovementScalarFieldEnum | ImprovementScalarFieldEnum[]
  }

  /**
   * Improvement findMany
   */
  export type ImprovementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
    /**
     * Filter, which Improvements to fetch.
     */
    where?: ImprovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Improvements to fetch.
     */
    orderBy?: ImprovementOrderByWithRelationInput | ImprovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Improvements.
     */
    cursor?: ImprovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Improvements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Improvements.
     */
    skip?: number
    distinct?: ImprovementScalarFieldEnum | ImprovementScalarFieldEnum[]
  }

  /**
   * Improvement create
   */
  export type ImprovementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
    /**
     * The data needed to create a Improvement.
     */
    data: XOR<ImprovementCreateInput, ImprovementUncheckedCreateInput>
  }

  /**
   * Improvement createMany
   */
  export type ImprovementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Improvements.
     */
    data: ImprovementCreateManyInput | ImprovementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Improvement createManyAndReturn
   */
  export type ImprovementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Improvements.
     */
    data: ImprovementCreateManyInput | ImprovementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Improvement update
   */
  export type ImprovementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
    /**
     * The data needed to update a Improvement.
     */
    data: XOR<ImprovementUpdateInput, ImprovementUncheckedUpdateInput>
    /**
     * Choose, which Improvement to update.
     */
    where: ImprovementWhereUniqueInput
  }

  /**
   * Improvement updateMany
   */
  export type ImprovementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Improvements.
     */
    data: XOR<ImprovementUpdateManyMutationInput, ImprovementUncheckedUpdateManyInput>
    /**
     * Filter which Improvements to update
     */
    where?: ImprovementWhereInput
  }

  /**
   * Improvement upsert
   */
  export type ImprovementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
    /**
     * The filter to search for the Improvement to update in case it exists.
     */
    where: ImprovementWhereUniqueInput
    /**
     * In case the Improvement found by the `where` argument doesn't exist, create a new Improvement with this data.
     */
    create: XOR<ImprovementCreateInput, ImprovementUncheckedCreateInput>
    /**
     * In case the Improvement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImprovementUpdateInput, ImprovementUncheckedUpdateInput>
  }

  /**
   * Improvement delete
   */
  export type ImprovementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
    /**
     * Filter which Improvement to delete.
     */
    where: ImprovementWhereUniqueInput
  }

  /**
   * Improvement deleteMany
   */
  export type ImprovementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Improvements to delete
     */
    where?: ImprovementWhereInput
  }

  /**
   * Improvement without action
   */
  export type ImprovementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Improvement
     */
    select?: ImprovementSelect<ExtArgs> | null
  }


  /**
   * Model SystemState
   */

  export type AggregateSystemState = {
    _count: SystemStateCountAggregateOutputType | null
    _avg: SystemStateAvgAggregateOutputType | null
    _sum: SystemStateSumAggregateOutputType | null
    _min: SystemStateMinAggregateOutputType | null
    _max: SystemStateMaxAggregateOutputType | null
  }

  export type SystemStateAvgAggregateOutputType = {
    id: number | null
  }

  export type SystemStateSumAggregateOutputType = {
    id: number | null
  }

  export type SystemStateMinAggregateOutputType = {
    id: number | null
    lastSchedulerRun: Date | null
    aiModelConfig: string | null
  }

  export type SystemStateMaxAggregateOutputType = {
    id: number | null
    lastSchedulerRun: Date | null
    aiModelConfig: string | null
  }

  export type SystemStateCountAggregateOutputType = {
    id: number
    lastSchedulerRun: number
    aiModelConfig: number
    _all: number
  }


  export type SystemStateAvgAggregateInputType = {
    id?: true
  }

  export type SystemStateSumAggregateInputType = {
    id?: true
  }

  export type SystemStateMinAggregateInputType = {
    id?: true
    lastSchedulerRun?: true
    aiModelConfig?: true
  }

  export type SystemStateMaxAggregateInputType = {
    id?: true
    lastSchedulerRun?: true
    aiModelConfig?: true
  }

  export type SystemStateCountAggregateInputType = {
    id?: true
    lastSchedulerRun?: true
    aiModelConfig?: true
    _all?: true
  }

  export type SystemStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemState to aggregate.
     */
    where?: SystemStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemStates to fetch.
     */
    orderBy?: SystemStateOrderByWithRelationInput | SystemStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemStates
    **/
    _count?: true | SystemStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SystemStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SystemStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemStateMaxAggregateInputType
  }

  export type GetSystemStateAggregateType<T extends SystemStateAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemState[P]>
      : GetScalarType<T[P], AggregateSystemState[P]>
  }




  export type SystemStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemStateWhereInput
    orderBy?: SystemStateOrderByWithAggregationInput | SystemStateOrderByWithAggregationInput[]
    by: SystemStateScalarFieldEnum[] | SystemStateScalarFieldEnum
    having?: SystemStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemStateCountAggregateInputType | true
    _avg?: SystemStateAvgAggregateInputType
    _sum?: SystemStateSumAggregateInputType
    _min?: SystemStateMinAggregateInputType
    _max?: SystemStateMaxAggregateInputType
  }

  export type SystemStateGroupByOutputType = {
    id: number
    lastSchedulerRun: Date | null
    aiModelConfig: string | null
    _count: SystemStateCountAggregateOutputType | null
    _avg: SystemStateAvgAggregateOutputType | null
    _sum: SystemStateSumAggregateOutputType | null
    _min: SystemStateMinAggregateOutputType | null
    _max: SystemStateMaxAggregateOutputType | null
  }

  type GetSystemStateGroupByPayload<T extends SystemStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemStateGroupByOutputType[P]>
            : GetScalarType<T[P], SystemStateGroupByOutputType[P]>
        }
      >
    >


  export type SystemStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastSchedulerRun?: boolean
    aiModelConfig?: boolean
  }, ExtArgs["result"]["systemState"]>

  export type SystemStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastSchedulerRun?: boolean
    aiModelConfig?: boolean
  }, ExtArgs["result"]["systemState"]>

  export type SystemStateSelectScalar = {
    id?: boolean
    lastSchedulerRun?: boolean
    aiModelConfig?: boolean
  }


  export type $SystemStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemState"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      lastSchedulerRun: Date | null
      aiModelConfig: string | null
    }, ExtArgs["result"]["systemState"]>
    composites: {}
  }

  type SystemStateGetPayload<S extends boolean | null | undefined | SystemStateDefaultArgs> = $Result.GetResult<Prisma.$SystemStatePayload, S>

  type SystemStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SystemStateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SystemStateCountAggregateInputType | true
    }

  export interface SystemStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemState'], meta: { name: 'SystemState' } }
    /**
     * Find zero or one SystemState that matches the filter.
     * @param {SystemStateFindUniqueArgs} args - Arguments to find a SystemState
     * @example
     * // Get one SystemState
     * const systemState = await prisma.systemState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemStateFindUniqueArgs>(args: SelectSubset<T, SystemStateFindUniqueArgs<ExtArgs>>): Prisma__SystemStateClient<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SystemState that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SystemStateFindUniqueOrThrowArgs} args - Arguments to find a SystemState
     * @example
     * // Get one SystemState
     * const systemState = await prisma.systemState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemStateFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemStateClient<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SystemState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemStateFindFirstArgs} args - Arguments to find a SystemState
     * @example
     * // Get one SystemState
     * const systemState = await prisma.systemState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemStateFindFirstArgs>(args?: SelectSubset<T, SystemStateFindFirstArgs<ExtArgs>>): Prisma__SystemStateClient<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SystemState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemStateFindFirstOrThrowArgs} args - Arguments to find a SystemState
     * @example
     * // Get one SystemState
     * const systemState = await prisma.systemState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemStateFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemStateClient<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SystemStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemStates
     * const systemStates = await prisma.systemState.findMany()
     * 
     * // Get first 10 SystemStates
     * const systemStates = await prisma.systemState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemStateWithIdOnly = await prisma.systemState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemStateFindManyArgs>(args?: SelectSubset<T, SystemStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SystemState.
     * @param {SystemStateCreateArgs} args - Arguments to create a SystemState.
     * @example
     * // Create one SystemState
     * const SystemState = await prisma.systemState.create({
     *   data: {
     *     // ... data to create a SystemState
     *   }
     * })
     * 
     */
    create<T extends SystemStateCreateArgs>(args: SelectSubset<T, SystemStateCreateArgs<ExtArgs>>): Prisma__SystemStateClient<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SystemStates.
     * @param {SystemStateCreateManyArgs} args - Arguments to create many SystemStates.
     * @example
     * // Create many SystemStates
     * const systemState = await prisma.systemState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemStateCreateManyArgs>(args?: SelectSubset<T, SystemStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemStates and returns the data saved in the database.
     * @param {SystemStateCreateManyAndReturnArgs} args - Arguments to create many SystemStates.
     * @example
     * // Create many SystemStates
     * const systemState = await prisma.systemState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemStates and only return the `id`
     * const systemStateWithIdOnly = await prisma.systemState.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemStateCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SystemState.
     * @param {SystemStateDeleteArgs} args - Arguments to delete one SystemState.
     * @example
     * // Delete one SystemState
     * const SystemState = await prisma.systemState.delete({
     *   where: {
     *     // ... filter to delete one SystemState
     *   }
     * })
     * 
     */
    delete<T extends SystemStateDeleteArgs>(args: SelectSubset<T, SystemStateDeleteArgs<ExtArgs>>): Prisma__SystemStateClient<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SystemState.
     * @param {SystemStateUpdateArgs} args - Arguments to update one SystemState.
     * @example
     * // Update one SystemState
     * const systemState = await prisma.systemState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemStateUpdateArgs>(args: SelectSubset<T, SystemStateUpdateArgs<ExtArgs>>): Prisma__SystemStateClient<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SystemStates.
     * @param {SystemStateDeleteManyArgs} args - Arguments to filter SystemStates to delete.
     * @example
     * // Delete a few SystemStates
     * const { count } = await prisma.systemState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemStateDeleteManyArgs>(args?: SelectSubset<T, SystemStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemStates
     * const systemState = await prisma.systemState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemStateUpdateManyArgs>(args: SelectSubset<T, SystemStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SystemState.
     * @param {SystemStateUpsertArgs} args - Arguments to update or create a SystemState.
     * @example
     * // Update or create a SystemState
     * const systemState = await prisma.systemState.upsert({
     *   create: {
     *     // ... data to create a SystemState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemState we want to update
     *   }
     * })
     */
    upsert<T extends SystemStateUpsertArgs>(args: SelectSubset<T, SystemStateUpsertArgs<ExtArgs>>): Prisma__SystemStateClient<$Result.GetResult<Prisma.$SystemStatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SystemStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemStateCountArgs} args - Arguments to filter SystemStates to count.
     * @example
     * // Count the number of SystemStates
     * const count = await prisma.systemState.count({
     *   where: {
     *     // ... the filter for the SystemStates we want to count
     *   }
     * })
    **/
    count<T extends SystemStateCountArgs>(
      args?: Subset<T, SystemStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SystemStateAggregateArgs>(args: Subset<T, SystemStateAggregateArgs>): Prisma.PrismaPromise<GetSystemStateAggregateType<T>>

    /**
     * Group by SystemState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemStateGroupByArgs} args - Group by arguments.
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
      T extends SystemStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemStateGroupByArgs['orderBy'] }
        : { orderBy?: SystemStateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SystemStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemState model
   */
  readonly fields: SystemStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SystemState model
   */ 
  interface SystemStateFieldRefs {
    readonly id: FieldRef<"SystemState", 'Int'>
    readonly lastSchedulerRun: FieldRef<"SystemState", 'DateTime'>
    readonly aiModelConfig: FieldRef<"SystemState", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SystemState findUnique
   */
  export type SystemStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
    /**
     * Filter, which SystemState to fetch.
     */
    where: SystemStateWhereUniqueInput
  }

  /**
   * SystemState findUniqueOrThrow
   */
  export type SystemStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
    /**
     * Filter, which SystemState to fetch.
     */
    where: SystemStateWhereUniqueInput
  }

  /**
   * SystemState findFirst
   */
  export type SystemStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
    /**
     * Filter, which SystemState to fetch.
     */
    where?: SystemStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemStates to fetch.
     */
    orderBy?: SystemStateOrderByWithRelationInput | SystemStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemStates.
     */
    cursor?: SystemStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemStates.
     */
    distinct?: SystemStateScalarFieldEnum | SystemStateScalarFieldEnum[]
  }

  /**
   * SystemState findFirstOrThrow
   */
  export type SystemStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
    /**
     * Filter, which SystemState to fetch.
     */
    where?: SystemStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemStates to fetch.
     */
    orderBy?: SystemStateOrderByWithRelationInput | SystemStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemStates.
     */
    cursor?: SystemStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemStates.
     */
    distinct?: SystemStateScalarFieldEnum | SystemStateScalarFieldEnum[]
  }

  /**
   * SystemState findMany
   */
  export type SystemStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
    /**
     * Filter, which SystemStates to fetch.
     */
    where?: SystemStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemStates to fetch.
     */
    orderBy?: SystemStateOrderByWithRelationInput | SystemStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemStates.
     */
    cursor?: SystemStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemStates.
     */
    skip?: number
    distinct?: SystemStateScalarFieldEnum | SystemStateScalarFieldEnum[]
  }

  /**
   * SystemState create
   */
  export type SystemStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
    /**
     * The data needed to create a SystemState.
     */
    data?: XOR<SystemStateCreateInput, SystemStateUncheckedCreateInput>
  }

  /**
   * SystemState createMany
   */
  export type SystemStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemStates.
     */
    data: SystemStateCreateManyInput | SystemStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemState createManyAndReturn
   */
  export type SystemStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SystemStates.
     */
    data: SystemStateCreateManyInput | SystemStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemState update
   */
  export type SystemStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
    /**
     * The data needed to update a SystemState.
     */
    data: XOR<SystemStateUpdateInput, SystemStateUncheckedUpdateInput>
    /**
     * Choose, which SystemState to update.
     */
    where: SystemStateWhereUniqueInput
  }

  /**
   * SystemState updateMany
   */
  export type SystemStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemStates.
     */
    data: XOR<SystemStateUpdateManyMutationInput, SystemStateUncheckedUpdateManyInput>
    /**
     * Filter which SystemStates to update
     */
    where?: SystemStateWhereInput
  }

  /**
   * SystemState upsert
   */
  export type SystemStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
    /**
     * The filter to search for the SystemState to update in case it exists.
     */
    where: SystemStateWhereUniqueInput
    /**
     * In case the SystemState found by the `where` argument doesn't exist, create a new SystemState with this data.
     */
    create: XOR<SystemStateCreateInput, SystemStateUncheckedCreateInput>
    /**
     * In case the SystemState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemStateUpdateInput, SystemStateUncheckedUpdateInput>
  }

  /**
   * SystemState delete
   */
  export type SystemStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
    /**
     * Filter which SystemState to delete.
     */
    where: SystemStateWhereUniqueInput
  }

  /**
   * SystemState deleteMany
   */
  export type SystemStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemStates to delete
     */
    where?: SystemStateWhereInput
  }

  /**
   * SystemState without action
   */
  export type SystemStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemState
     */
    select?: SystemStateSelect<ExtArgs> | null
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


  export const SystemLogScalarFieldEnum: {
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

  export type SystemLogScalarFieldEnum = (typeof SystemLogScalarFieldEnum)[keyof typeof SystemLogScalarFieldEnum]


  export const ResponsibleUnitScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type ResponsibleUnitScalarFieldEnum = (typeof ResponsibleUnitScalarFieldEnum)[keyof typeof ResponsibleUnitScalarFieldEnum]


  export const SubsystemScalarFieldEnum: {
    id: 'id',
    label: 'label'
  };

  export type SubsystemScalarFieldEnum = (typeof SubsystemScalarFieldEnum)[keyof typeof SubsystemScalarFieldEnum]


  export const PatrolLocationScalarFieldEnum: {
    id: 'id',
    label: 'label'
  };

  export type PatrolLocationScalarFieldEnum = (typeof PatrolLocationScalarFieldEnum)[keyof typeof PatrolLocationScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    entityId: 'entityId',
    senderId: 'senderId',
    senderName: 'senderName',
    timestamp: 'timestamp',
    content: 'content'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    message: 'message',
    type: 'type',
    timestamp: 'timestamp',
    isRead: 'isRead',
    link: 'link'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const MaintenanceStandardScalarFieldEnum: {
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

  export type MaintenanceStandardScalarFieldEnum = (typeof MaintenanceStandardScalarFieldEnum)[keyof typeof MaintenanceStandardScalarFieldEnum]


  export const MaintenanceStandardItemScalarFieldEnum: {
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

  export type MaintenanceStandardItemScalarFieldEnum = (typeof MaintenanceStandardItemScalarFieldEnum)[keyof typeof MaintenanceStandardItemScalarFieldEnum]


  export const InspectionDetailScalarFieldEnum: {
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

  export type InspectionDetailScalarFieldEnum = (typeof InspectionDetailScalarFieldEnum)[keyof typeof InspectionDetailScalarFieldEnum]


  export const DnfDocumentScalarFieldEnum: {
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

  export type DnfDocumentScalarFieldEnum = (typeof DnfDocumentScalarFieldEnum)[keyof typeof DnfDocumentScalarFieldEnum]


  export const CorrectiveActionScalarFieldEnum: {
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

  export type CorrectiveActionScalarFieldEnum = (typeof CorrectiveActionScalarFieldEnum)[keyof typeof CorrectiveActionScalarFieldEnum]


  export const HazardRecordScalarFieldEnum: {
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

  export type HazardRecordScalarFieldEnum = (typeof HazardRecordScalarFieldEnum)[keyof typeof HazardRecordScalarFieldEnum]


  export const ImprovementScalarFieldEnum: {
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

  export type ImprovementScalarFieldEnum = (typeof ImprovementScalarFieldEnum)[keyof typeof ImprovementScalarFieldEnum]


  export const SystemStateScalarFieldEnum: {
    id: 'id',
    lastSchedulerRun: 'lastSchedulerRun',
    aiModelConfig: 'aiModelConfig'
  };

  export type SystemStateScalarFieldEnum = (typeof SystemStateScalarFieldEnum)[keyof typeof SystemStateScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type SystemLogWhereInput = {
    AND?: SystemLogWhereInput | SystemLogWhereInput[]
    OR?: SystemLogWhereInput[]
    NOT?: SystemLogWhereInput | SystemLogWhereInput[]
    id?: StringFilter<"SystemLog"> | string
    timestamp?: DateTimeFilter<"SystemLog"> | Date | string
    userId?: StringFilter<"SystemLog"> | string
    userName?: StringFilter<"SystemLog"> | string
    action?: StringFilter<"SystemLog"> | string
    level?: StringFilter<"SystemLog"> | string
    details?: StringFilter<"SystemLog"> | string
    category?: StringFilter<"SystemLog"> | string
    deletedAt?: DateTimeNullableFilter<"SystemLog"> | Date | string | null
  }

  export type SystemLogOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    action?: SortOrder
    level?: SortOrder
    details?: SortOrder
    category?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
  }

  export type SystemLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SystemLogWhereInput | SystemLogWhereInput[]
    OR?: SystemLogWhereInput[]
    NOT?: SystemLogWhereInput | SystemLogWhereInput[]
    timestamp?: DateTimeFilter<"SystemLog"> | Date | string
    userId?: StringFilter<"SystemLog"> | string
    userName?: StringFilter<"SystemLog"> | string
    action?: StringFilter<"SystemLog"> | string
    level?: StringFilter<"SystemLog"> | string
    details?: StringFilter<"SystemLog"> | string
    category?: StringFilter<"SystemLog"> | string
    deletedAt?: DateTimeNullableFilter<"SystemLog"> | Date | string | null
  }, "id">

  export type SystemLogOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    action?: SortOrder
    level?: SortOrder
    details?: SortOrder
    category?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: SystemLogCountOrderByAggregateInput
    _max?: SystemLogMaxOrderByAggregateInput
    _min?: SystemLogMinOrderByAggregateInput
  }

  export type SystemLogScalarWhereWithAggregatesInput = {
    AND?: SystemLogScalarWhereWithAggregatesInput | SystemLogScalarWhereWithAggregatesInput[]
    OR?: SystemLogScalarWhereWithAggregatesInput[]
    NOT?: SystemLogScalarWhereWithAggregatesInput | SystemLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemLog"> | string
    timestamp?: DateTimeWithAggregatesFilter<"SystemLog"> | Date | string
    userId?: StringWithAggregatesFilter<"SystemLog"> | string
    userName?: StringWithAggregatesFilter<"SystemLog"> | string
    action?: StringWithAggregatesFilter<"SystemLog"> | string
    level?: StringWithAggregatesFilter<"SystemLog"> | string
    details?: StringWithAggregatesFilter<"SystemLog"> | string
    category?: StringWithAggregatesFilter<"SystemLog"> | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"SystemLog"> | Date | string | null
  }

  export type ResponsibleUnitWhereInput = {
    AND?: ResponsibleUnitWhereInput | ResponsibleUnitWhereInput[]
    OR?: ResponsibleUnitWhereInput[]
    NOT?: ResponsibleUnitWhereInput | ResponsibleUnitWhereInput[]
    id?: StringFilter<"ResponsibleUnit"> | string
    name?: StringFilter<"ResponsibleUnit"> | string
  }

  export type ResponsibleUnitOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type ResponsibleUnitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResponsibleUnitWhereInput | ResponsibleUnitWhereInput[]
    OR?: ResponsibleUnitWhereInput[]
    NOT?: ResponsibleUnitWhereInput | ResponsibleUnitWhereInput[]
    name?: StringFilter<"ResponsibleUnit"> | string
  }, "id">

  export type ResponsibleUnitOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: ResponsibleUnitCountOrderByAggregateInput
    _max?: ResponsibleUnitMaxOrderByAggregateInput
    _min?: ResponsibleUnitMinOrderByAggregateInput
  }

  export type ResponsibleUnitScalarWhereWithAggregatesInput = {
    AND?: ResponsibleUnitScalarWhereWithAggregatesInput | ResponsibleUnitScalarWhereWithAggregatesInput[]
    OR?: ResponsibleUnitScalarWhereWithAggregatesInput[]
    NOT?: ResponsibleUnitScalarWhereWithAggregatesInput | ResponsibleUnitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ResponsibleUnit"> | string
    name?: StringWithAggregatesFilter<"ResponsibleUnit"> | string
  }

  export type SubsystemWhereInput = {
    AND?: SubsystemWhereInput | SubsystemWhereInput[]
    OR?: SubsystemWhereInput[]
    NOT?: SubsystemWhereInput | SubsystemWhereInput[]
    id?: StringFilter<"Subsystem"> | string
    label?: JsonFilter<"Subsystem">
  }

  export type SubsystemOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
  }

  export type SubsystemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubsystemWhereInput | SubsystemWhereInput[]
    OR?: SubsystemWhereInput[]
    NOT?: SubsystemWhereInput | SubsystemWhereInput[]
    label?: JsonFilter<"Subsystem">
  }, "id">

  export type SubsystemOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    _count?: SubsystemCountOrderByAggregateInput
    _max?: SubsystemMaxOrderByAggregateInput
    _min?: SubsystemMinOrderByAggregateInput
  }

  export type SubsystemScalarWhereWithAggregatesInput = {
    AND?: SubsystemScalarWhereWithAggregatesInput | SubsystemScalarWhereWithAggregatesInput[]
    OR?: SubsystemScalarWhereWithAggregatesInput[]
    NOT?: SubsystemScalarWhereWithAggregatesInput | SubsystemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subsystem"> | string
    label?: JsonWithAggregatesFilter<"Subsystem">
  }

  export type PatrolLocationWhereInput = {
    AND?: PatrolLocationWhereInput | PatrolLocationWhereInput[]
    OR?: PatrolLocationWhereInput[]
    NOT?: PatrolLocationWhereInput | PatrolLocationWhereInput[]
    id?: StringFilter<"PatrolLocation"> | string
    label?: StringFilter<"PatrolLocation"> | string
  }

  export type PatrolLocationOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
  }

  export type PatrolLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatrolLocationWhereInput | PatrolLocationWhereInput[]
    OR?: PatrolLocationWhereInput[]
    NOT?: PatrolLocationWhereInput | PatrolLocationWhereInput[]
    label?: StringFilter<"PatrolLocation"> | string
  }, "id">

  export type PatrolLocationOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    _count?: PatrolLocationCountOrderByAggregateInput
    _max?: PatrolLocationMaxOrderByAggregateInput
    _min?: PatrolLocationMinOrderByAggregateInput
  }

  export type PatrolLocationScalarWhereWithAggregatesInput = {
    AND?: PatrolLocationScalarWhereWithAggregatesInput | PatrolLocationScalarWhereWithAggregatesInput[]
    OR?: PatrolLocationScalarWhereWithAggregatesInput[]
    NOT?: PatrolLocationScalarWhereWithAggregatesInput | PatrolLocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PatrolLocation"> | string
    label?: StringWithAggregatesFilter<"PatrolLocation"> | string
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: StringFilter<"Comment"> | string
    entityId?: StringFilter<"Comment"> | string
    senderId?: StringFilter<"Comment"> | string
    senderName?: StringFilter<"Comment"> | string
    timestamp?: DateTimeFilter<"Comment"> | Date | string
    content?: StringFilter<"Comment"> | string
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    entityId?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    timestamp?: SortOrder
    content?: SortOrder
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    entityId?: StringFilter<"Comment"> | string
    senderId?: StringFilter<"Comment"> | string
    senderName?: StringFilter<"Comment"> | string
    timestamp?: DateTimeFilter<"Comment"> | Date | string
    content?: StringFilter<"Comment"> | string
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    entityId?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    timestamp?: SortOrder
    content?: SortOrder
    _count?: CommentCountOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Comment"> | string
    entityId?: StringWithAggregatesFilter<"Comment"> | string
    senderId?: StringWithAggregatesFilter<"Comment"> | string
    senderName?: StringWithAggregatesFilter<"Comment"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
    content?: StringWithAggregatesFilter<"Comment"> | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    timestamp?: DateTimeFilter<"Notification"> | Date | string
    isRead?: BoolFilter<"Notification"> | boolean
    link?: StringNullableFilter<"Notification"> | string | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    message?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    isRead?: SortOrder
    link?: SortOrderInput | SortOrder
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    timestamp?: DateTimeFilter<"Notification"> | Date | string
    isRead?: BoolFilter<"Notification"> | boolean
    link?: StringNullableFilter<"Notification"> | string | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    message?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    isRead?: SortOrder
    link?: SortOrderInput | SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    link?: StringNullableWithAggregatesFilter<"Notification"> | string | null
  }

  export type MaintenanceStandardWhereInput = {
    AND?: MaintenanceStandardWhereInput | MaintenanceStandardWhereInput[]
    OR?: MaintenanceStandardWhereInput[]
    NOT?: MaintenanceStandardWhereInput | MaintenanceStandardWhereInput[]
    id?: StringFilter<"MaintenanceStandard"> | string
    name?: StringFilter<"MaintenanceStandard"> | string
    name_en?: StringNullableFilter<"MaintenanceStandard"> | string | null
    description?: StringNullableFilter<"MaintenanceStandard"> | string | null
    frequency?: StringNullableFilter<"MaintenanceStandard"> | string | null
    scheduledTime?: StringNullableFilter<"MaintenanceStandard"> | string | null
    locationIds?: StringNullableListFilter<"MaintenanceStandard">
    recipientId?: StringNullableFilter<"MaintenanceStandard"> | string | null
    abbreviation?: StringNullableFilter<"MaintenanceStandard"> | string | null
    estimatedDurationHours?: FloatNullableFilter<"MaintenanceStandard"> | number | null
    deletedAt?: DateTimeNullableFilter<"MaintenanceStandard"> | Date | string | null
  }

  export type MaintenanceStandardOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    name_en?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    frequency?: SortOrderInput | SortOrder
    scheduledTime?: SortOrderInput | SortOrder
    locationIds?: SortOrder
    recipientId?: SortOrderInput | SortOrder
    abbreviation?: SortOrderInput | SortOrder
    estimatedDurationHours?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
  }

  export type MaintenanceStandardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MaintenanceStandardWhereInput | MaintenanceStandardWhereInput[]
    OR?: MaintenanceStandardWhereInput[]
    NOT?: MaintenanceStandardWhereInput | MaintenanceStandardWhereInput[]
    name?: StringFilter<"MaintenanceStandard"> | string
    name_en?: StringNullableFilter<"MaintenanceStandard"> | string | null
    description?: StringNullableFilter<"MaintenanceStandard"> | string | null
    frequency?: StringNullableFilter<"MaintenanceStandard"> | string | null
    scheduledTime?: StringNullableFilter<"MaintenanceStandard"> | string | null
    locationIds?: StringNullableListFilter<"MaintenanceStandard">
    recipientId?: StringNullableFilter<"MaintenanceStandard"> | string | null
    abbreviation?: StringNullableFilter<"MaintenanceStandard"> | string | null
    estimatedDurationHours?: FloatNullableFilter<"MaintenanceStandard"> | number | null
    deletedAt?: DateTimeNullableFilter<"MaintenanceStandard"> | Date | string | null
  }, "id">

  export type MaintenanceStandardOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    name_en?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    frequency?: SortOrderInput | SortOrder
    scheduledTime?: SortOrderInput | SortOrder
    locationIds?: SortOrder
    recipientId?: SortOrderInput | SortOrder
    abbreviation?: SortOrderInput | SortOrder
    estimatedDurationHours?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: MaintenanceStandardCountOrderByAggregateInput
    _avg?: MaintenanceStandardAvgOrderByAggregateInput
    _max?: MaintenanceStandardMaxOrderByAggregateInput
    _min?: MaintenanceStandardMinOrderByAggregateInput
    _sum?: MaintenanceStandardSumOrderByAggregateInput
  }

  export type MaintenanceStandardScalarWhereWithAggregatesInput = {
    AND?: MaintenanceStandardScalarWhereWithAggregatesInput | MaintenanceStandardScalarWhereWithAggregatesInput[]
    OR?: MaintenanceStandardScalarWhereWithAggregatesInput[]
    NOT?: MaintenanceStandardScalarWhereWithAggregatesInput | MaintenanceStandardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MaintenanceStandard"> | string
    name?: StringWithAggregatesFilter<"MaintenanceStandard"> | string
    name_en?: StringNullableWithAggregatesFilter<"MaintenanceStandard"> | string | null
    description?: StringNullableWithAggregatesFilter<"MaintenanceStandard"> | string | null
    frequency?: StringNullableWithAggregatesFilter<"MaintenanceStandard"> | string | null
    scheduledTime?: StringNullableWithAggregatesFilter<"MaintenanceStandard"> | string | null
    locationIds?: StringNullableListFilter<"MaintenanceStandard">
    recipientId?: StringNullableWithAggregatesFilter<"MaintenanceStandard"> | string | null
    abbreviation?: StringNullableWithAggregatesFilter<"MaintenanceStandard"> | string | null
    estimatedDurationHours?: FloatNullableWithAggregatesFilter<"MaintenanceStandard"> | number | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"MaintenanceStandard"> | Date | string | null
  }

  export type MaintenanceStandardItemWhereInput = {
    AND?: MaintenanceStandardItemWhereInput | MaintenanceStandardItemWhereInput[]
    OR?: MaintenanceStandardItemWhereInput[]
    NOT?: MaintenanceStandardItemWhereInput | MaintenanceStandardItemWhereInput[]
    id?: StringFilter<"MaintenanceStandardItem"> | string
    standardId?: StringFilter<"MaintenanceStandardItem"> | string
    itemCode?: StringFilter<"MaintenanceStandardItem"> | string
    itemText?: StringFilter<"MaintenanceStandardItem"> | string
    criteria?: StringNullableFilter<"MaintenanceStandardItem"> | string | null
    unit?: StringNullableFilter<"MaintenanceStandardItem"> | string | null
    standardQuantity?: FloatNullableFilter<"MaintenanceStandardItem"> | number | null
    toleranceOperator?: StringNullableFilter<"MaintenanceStandardItem"> | string | null
    toleranceValue?: FloatNullableFilter<"MaintenanceStandardItem"> | number | null
    requiredTools?: StringNullableFilter<"MaintenanceStandardItem"> | string | null
  }

  export type MaintenanceStandardItemOrderByWithRelationInput = {
    id?: SortOrder
    standardId?: SortOrder
    itemCode?: SortOrder
    itemText?: SortOrder
    criteria?: SortOrderInput | SortOrder
    unit?: SortOrderInput | SortOrder
    standardQuantity?: SortOrderInput | SortOrder
    toleranceOperator?: SortOrderInput | SortOrder
    toleranceValue?: SortOrderInput | SortOrder
    requiredTools?: SortOrderInput | SortOrder
  }

  export type MaintenanceStandardItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MaintenanceStandardItemWhereInput | MaintenanceStandardItemWhereInput[]
    OR?: MaintenanceStandardItemWhereInput[]
    NOT?: MaintenanceStandardItemWhereInput | MaintenanceStandardItemWhereInput[]
    standardId?: StringFilter<"MaintenanceStandardItem"> | string
    itemCode?: StringFilter<"MaintenanceStandardItem"> | string
    itemText?: StringFilter<"MaintenanceStandardItem"> | string
    criteria?: StringNullableFilter<"MaintenanceStandardItem"> | string | null
    unit?: StringNullableFilter<"MaintenanceStandardItem"> | string | null
    standardQuantity?: FloatNullableFilter<"MaintenanceStandardItem"> | number | null
    toleranceOperator?: StringNullableFilter<"MaintenanceStandardItem"> | string | null
    toleranceValue?: FloatNullableFilter<"MaintenanceStandardItem"> | number | null
    requiredTools?: StringNullableFilter<"MaintenanceStandardItem"> | string | null
  }, "id">

  export type MaintenanceStandardItemOrderByWithAggregationInput = {
    id?: SortOrder
    standardId?: SortOrder
    itemCode?: SortOrder
    itemText?: SortOrder
    criteria?: SortOrderInput | SortOrder
    unit?: SortOrderInput | SortOrder
    standardQuantity?: SortOrderInput | SortOrder
    toleranceOperator?: SortOrderInput | SortOrder
    toleranceValue?: SortOrderInput | SortOrder
    requiredTools?: SortOrderInput | SortOrder
    _count?: MaintenanceStandardItemCountOrderByAggregateInput
    _avg?: MaintenanceStandardItemAvgOrderByAggregateInput
    _max?: MaintenanceStandardItemMaxOrderByAggregateInput
    _min?: MaintenanceStandardItemMinOrderByAggregateInput
    _sum?: MaintenanceStandardItemSumOrderByAggregateInput
  }

  export type MaintenanceStandardItemScalarWhereWithAggregatesInput = {
    AND?: MaintenanceStandardItemScalarWhereWithAggregatesInput | MaintenanceStandardItemScalarWhereWithAggregatesInput[]
    OR?: MaintenanceStandardItemScalarWhereWithAggregatesInput[]
    NOT?: MaintenanceStandardItemScalarWhereWithAggregatesInput | MaintenanceStandardItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MaintenanceStandardItem"> | string
    standardId?: StringWithAggregatesFilter<"MaintenanceStandardItem"> | string
    itemCode?: StringWithAggregatesFilter<"MaintenanceStandardItem"> | string
    itemText?: StringWithAggregatesFilter<"MaintenanceStandardItem"> | string
    criteria?: StringNullableWithAggregatesFilter<"MaintenanceStandardItem"> | string | null
    unit?: StringNullableWithAggregatesFilter<"MaintenanceStandardItem"> | string | null
    standardQuantity?: FloatNullableWithAggregatesFilter<"MaintenanceStandardItem"> | number | null
    toleranceOperator?: StringNullableWithAggregatesFilter<"MaintenanceStandardItem"> | string | null
    toleranceValue?: FloatNullableWithAggregatesFilter<"MaintenanceStandardItem"> | number | null
    requiredTools?: StringNullableWithAggregatesFilter<"MaintenanceStandardItem"> | string | null
  }

  export type InspectionDetailWhereInput = {
    AND?: InspectionDetailWhereInput | InspectionDetailWhereInput[]
    OR?: InspectionDetailWhereInput[]
    NOT?: InspectionDetailWhereInput | InspectionDetailWhereInput[]
    id?: StringFilter<"InspectionDetail"> | string
    title?: StringFilter<"InspectionDetail"> | string
    areaIds?: StringNullableListFilter<"InspectionDetail">
    inspector?: StringFilter<"InspectionDetail"> | string
    date?: DateTimeFilter<"InspectionDetail"> | Date | string
    status?: StringFilter<"InspectionDetail"> | string
    checklistTemplateId?: StringNullableFilter<"InspectionDetail"> | string | null
    checklistItems?: JsonNullableFilter<"InspectionDetail">
    generalNotes?: StringNullableFilter<"InspectionDetail"> | string | null
    approvalComments?: StringNullableFilter<"InspectionDetail"> | string | null
    lastStatusUpdateBy?: StringNullableFilter<"InspectionDetail"> | string | null
    lastStatusUpdateAt?: DateTimeNullableFilter<"InspectionDetail"> | Date | string | null
    scheduledStartDate?: DateTimeNullableFilter<"InspectionDetail"> | Date | string | null
    scheduledFinishDate?: DateTimeNullableFilter<"InspectionDetail"> | Date | string | null
    estimatedDurationHours?: FloatNullableFilter<"InspectionDetail"> | number | null
    isArchived?: BoolFilter<"InspectionDetail"> | boolean
    deletedAt?: DateTimeNullableFilter<"InspectionDetail"> | Date | string | null
  }

  export type InspectionDetailOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    areaIds?: SortOrder
    inspector?: SortOrder
    date?: SortOrder
    status?: SortOrder
    checklistTemplateId?: SortOrderInput | SortOrder
    checklistItems?: SortOrderInput | SortOrder
    generalNotes?: SortOrderInput | SortOrder
    approvalComments?: SortOrderInput | SortOrder
    lastStatusUpdateBy?: SortOrderInput | SortOrder
    lastStatusUpdateAt?: SortOrderInput | SortOrder
    scheduledStartDate?: SortOrderInput | SortOrder
    scheduledFinishDate?: SortOrderInput | SortOrder
    estimatedDurationHours?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
  }

  export type InspectionDetailWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InspectionDetailWhereInput | InspectionDetailWhereInput[]
    OR?: InspectionDetailWhereInput[]
    NOT?: InspectionDetailWhereInput | InspectionDetailWhereInput[]
    title?: StringFilter<"InspectionDetail"> | string
    areaIds?: StringNullableListFilter<"InspectionDetail">
    inspector?: StringFilter<"InspectionDetail"> | string
    date?: DateTimeFilter<"InspectionDetail"> | Date | string
    status?: StringFilter<"InspectionDetail"> | string
    checklistTemplateId?: StringNullableFilter<"InspectionDetail"> | string | null
    checklistItems?: JsonNullableFilter<"InspectionDetail">
    generalNotes?: StringNullableFilter<"InspectionDetail"> | string | null
    approvalComments?: StringNullableFilter<"InspectionDetail"> | string | null
    lastStatusUpdateBy?: StringNullableFilter<"InspectionDetail"> | string | null
    lastStatusUpdateAt?: DateTimeNullableFilter<"InspectionDetail"> | Date | string | null
    scheduledStartDate?: DateTimeNullableFilter<"InspectionDetail"> | Date | string | null
    scheduledFinishDate?: DateTimeNullableFilter<"InspectionDetail"> | Date | string | null
    estimatedDurationHours?: FloatNullableFilter<"InspectionDetail"> | number | null
    isArchived?: BoolFilter<"InspectionDetail"> | boolean
    deletedAt?: DateTimeNullableFilter<"InspectionDetail"> | Date | string | null
  }, "id">

  export type InspectionDetailOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    areaIds?: SortOrder
    inspector?: SortOrder
    date?: SortOrder
    status?: SortOrder
    checklistTemplateId?: SortOrderInput | SortOrder
    checklistItems?: SortOrderInput | SortOrder
    generalNotes?: SortOrderInput | SortOrder
    approvalComments?: SortOrderInput | SortOrder
    lastStatusUpdateBy?: SortOrderInput | SortOrder
    lastStatusUpdateAt?: SortOrderInput | SortOrder
    scheduledStartDate?: SortOrderInput | SortOrder
    scheduledFinishDate?: SortOrderInput | SortOrder
    estimatedDurationHours?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: InspectionDetailCountOrderByAggregateInput
    _avg?: InspectionDetailAvgOrderByAggregateInput
    _max?: InspectionDetailMaxOrderByAggregateInput
    _min?: InspectionDetailMinOrderByAggregateInput
    _sum?: InspectionDetailSumOrderByAggregateInput
  }

  export type InspectionDetailScalarWhereWithAggregatesInput = {
    AND?: InspectionDetailScalarWhereWithAggregatesInput | InspectionDetailScalarWhereWithAggregatesInput[]
    OR?: InspectionDetailScalarWhereWithAggregatesInput[]
    NOT?: InspectionDetailScalarWhereWithAggregatesInput | InspectionDetailScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InspectionDetail"> | string
    title?: StringWithAggregatesFilter<"InspectionDetail"> | string
    areaIds?: StringNullableListFilter<"InspectionDetail">
    inspector?: StringWithAggregatesFilter<"InspectionDetail"> | string
    date?: DateTimeWithAggregatesFilter<"InspectionDetail"> | Date | string
    status?: StringWithAggregatesFilter<"InspectionDetail"> | string
    checklistTemplateId?: StringNullableWithAggregatesFilter<"InspectionDetail"> | string | null
    checklistItems?: JsonNullableWithAggregatesFilter<"InspectionDetail">
    generalNotes?: StringNullableWithAggregatesFilter<"InspectionDetail"> | string | null
    approvalComments?: StringNullableWithAggregatesFilter<"InspectionDetail"> | string | null
    lastStatusUpdateBy?: StringNullableWithAggregatesFilter<"InspectionDetail"> | string | null
    lastStatusUpdateAt?: DateTimeNullableWithAggregatesFilter<"InspectionDetail"> | Date | string | null
    scheduledStartDate?: DateTimeNullableWithAggregatesFilter<"InspectionDetail"> | Date | string | null
    scheduledFinishDate?: DateTimeNullableWithAggregatesFilter<"InspectionDetail"> | Date | string | null
    estimatedDurationHours?: FloatNullableWithAggregatesFilter<"InspectionDetail"> | number | null
    isArchived?: BoolWithAggregatesFilter<"InspectionDetail"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"InspectionDetail"> | Date | string | null
  }

  export type DnfDocumentWhereInput = {
    AND?: DnfDocumentWhereInput | DnfDocumentWhereInput[]
    OR?: DnfDocumentWhereInput[]
    NOT?: DnfDocumentWhereInput | DnfDocumentWhereInput[]
    id?: StringFilter<"DnfDocument"> | string
    failureReportNo?: StringNullableFilter<"DnfDocument"> | string | null
    locationOfFailure?: StringFilter<"DnfDocument"> | string
    failedComponentEquipmentLRUTrainNumber?: StringNullableFilter<"DnfDocument"> | string | null
    subsystemIds?: StringNullableListFilter<"DnfDocument">
    descriptionOfFailure?: StringFilter<"DnfDocument"> | string
    impactAssessment?: StringNullableFilter<"DnfDocument"> | string | null
    staffWhoIdentifiedFailure?: StringFilter<"DnfDocument"> | string
    dateTimeOfFailureOccurrence?: DateTimeFilter<"DnfDocument"> | Date | string
    methodOfFailureDetection?: StringFilter<"DnfDocument"> | string
    hazardLevelId?: StringNullableFilter<"DnfDocument"> | string | null
    status?: StringFilter<"DnfDocument"> | string
    attachments?: JsonNullableFilter<"DnfDocument">
    createdById?: StringFilter<"DnfDocument"> | string
    createdAt?: DateTimeFilter<"DnfDocument"> | Date | string
    updatedAt?: DateTimeFilter<"DnfDocument"> | Date | string
    statusHistory?: JsonNullableFilter<"DnfDocument">
    isArchived?: BoolFilter<"DnfDocument"> | boolean
    resolutionDetails?: StringNullableFilter<"DnfDocument"> | string | null
    assignedTo?: StringNullableFilter<"DnfDocument"> | string | null
    priority?: StringNullableFilter<"DnfDocument"> | string | null
    completedDate?: DateTimeNullableFilter<"DnfDocument"> | Date | string | null
    originatingInspectionId?: StringNullableFilter<"DnfDocument"> | string | null
    originatingFindingId?: StringNullableFilter<"DnfDocument"> | string | null
    immediateAction?: StringNullableFilter<"DnfDocument"> | string | null
    problemResettable?: BoolNullableFilter<"DnfDocument"> | boolean | null
    trainServiceAffected?: BoolNullableFilter<"DnfDocument"> | boolean | null
    trainWithdrawn?: BoolNullableFilter<"DnfDocument"> | boolean | null
    systemRestoredTime?: DateTimeNullableFilter<"DnfDocument"> | Date | string | null
    disruptionDuration?: FloatNullableFilter<"DnfDocument"> | number | null
    trainKm?: FloatNullableFilter<"DnfDocument"> | number | null
    rectificationParty?: StringNullableFilter<"DnfDocument"> | string | null
    deletedAt?: DateTimeNullableFilter<"DnfDocument"> | Date | string | null
    correctiveActions?: CorrectiveActionListRelationFilter
  }

  export type DnfDocumentOrderByWithRelationInput = {
    id?: SortOrder
    failureReportNo?: SortOrderInput | SortOrder
    locationOfFailure?: SortOrder
    failedComponentEquipmentLRUTrainNumber?: SortOrderInput | SortOrder
    subsystemIds?: SortOrder
    descriptionOfFailure?: SortOrder
    impactAssessment?: SortOrderInput | SortOrder
    staffWhoIdentifiedFailure?: SortOrder
    dateTimeOfFailureOccurrence?: SortOrder
    methodOfFailureDetection?: SortOrder
    hazardLevelId?: SortOrderInput | SortOrder
    status?: SortOrder
    attachments?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    statusHistory?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    resolutionDetails?: SortOrderInput | SortOrder
    assignedTo?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    completedDate?: SortOrderInput | SortOrder
    originatingInspectionId?: SortOrderInput | SortOrder
    originatingFindingId?: SortOrderInput | SortOrder
    immediateAction?: SortOrderInput | SortOrder
    problemResettable?: SortOrderInput | SortOrder
    trainServiceAffected?: SortOrderInput | SortOrder
    trainWithdrawn?: SortOrderInput | SortOrder
    systemRestoredTime?: SortOrderInput | SortOrder
    disruptionDuration?: SortOrderInput | SortOrder
    trainKm?: SortOrderInput | SortOrder
    rectificationParty?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    correctiveActions?: CorrectiveActionOrderByRelationAggregateInput
  }

  export type DnfDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DnfDocumentWhereInput | DnfDocumentWhereInput[]
    OR?: DnfDocumentWhereInput[]
    NOT?: DnfDocumentWhereInput | DnfDocumentWhereInput[]
    failureReportNo?: StringNullableFilter<"DnfDocument"> | string | null
    locationOfFailure?: StringFilter<"DnfDocument"> | string
    failedComponentEquipmentLRUTrainNumber?: StringNullableFilter<"DnfDocument"> | string | null
    subsystemIds?: StringNullableListFilter<"DnfDocument">
    descriptionOfFailure?: StringFilter<"DnfDocument"> | string
    impactAssessment?: StringNullableFilter<"DnfDocument"> | string | null
    staffWhoIdentifiedFailure?: StringFilter<"DnfDocument"> | string
    dateTimeOfFailureOccurrence?: DateTimeFilter<"DnfDocument"> | Date | string
    methodOfFailureDetection?: StringFilter<"DnfDocument"> | string
    hazardLevelId?: StringNullableFilter<"DnfDocument"> | string | null
    status?: StringFilter<"DnfDocument"> | string
    attachments?: JsonNullableFilter<"DnfDocument">
    createdById?: StringFilter<"DnfDocument"> | string
    createdAt?: DateTimeFilter<"DnfDocument"> | Date | string
    updatedAt?: DateTimeFilter<"DnfDocument"> | Date | string
    statusHistory?: JsonNullableFilter<"DnfDocument">
    isArchived?: BoolFilter<"DnfDocument"> | boolean
    resolutionDetails?: StringNullableFilter<"DnfDocument"> | string | null
    assignedTo?: StringNullableFilter<"DnfDocument"> | string | null
    priority?: StringNullableFilter<"DnfDocument"> | string | null
    completedDate?: DateTimeNullableFilter<"DnfDocument"> | Date | string | null
    originatingInspectionId?: StringNullableFilter<"DnfDocument"> | string | null
    originatingFindingId?: StringNullableFilter<"DnfDocument"> | string | null
    immediateAction?: StringNullableFilter<"DnfDocument"> | string | null
    problemResettable?: BoolNullableFilter<"DnfDocument"> | boolean | null
    trainServiceAffected?: BoolNullableFilter<"DnfDocument"> | boolean | null
    trainWithdrawn?: BoolNullableFilter<"DnfDocument"> | boolean | null
    systemRestoredTime?: DateTimeNullableFilter<"DnfDocument"> | Date | string | null
    disruptionDuration?: FloatNullableFilter<"DnfDocument"> | number | null
    trainKm?: FloatNullableFilter<"DnfDocument"> | number | null
    rectificationParty?: StringNullableFilter<"DnfDocument"> | string | null
    deletedAt?: DateTimeNullableFilter<"DnfDocument"> | Date | string | null
    correctiveActions?: CorrectiveActionListRelationFilter
  }, "id">

  export type DnfDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    failureReportNo?: SortOrderInput | SortOrder
    locationOfFailure?: SortOrder
    failedComponentEquipmentLRUTrainNumber?: SortOrderInput | SortOrder
    subsystemIds?: SortOrder
    descriptionOfFailure?: SortOrder
    impactAssessment?: SortOrderInput | SortOrder
    staffWhoIdentifiedFailure?: SortOrder
    dateTimeOfFailureOccurrence?: SortOrder
    methodOfFailureDetection?: SortOrder
    hazardLevelId?: SortOrderInput | SortOrder
    status?: SortOrder
    attachments?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    statusHistory?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    resolutionDetails?: SortOrderInput | SortOrder
    assignedTo?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    completedDate?: SortOrderInput | SortOrder
    originatingInspectionId?: SortOrderInput | SortOrder
    originatingFindingId?: SortOrderInput | SortOrder
    immediateAction?: SortOrderInput | SortOrder
    problemResettable?: SortOrderInput | SortOrder
    trainServiceAffected?: SortOrderInput | SortOrder
    trainWithdrawn?: SortOrderInput | SortOrder
    systemRestoredTime?: SortOrderInput | SortOrder
    disruptionDuration?: SortOrderInput | SortOrder
    trainKm?: SortOrderInput | SortOrder
    rectificationParty?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: DnfDocumentCountOrderByAggregateInput
    _avg?: DnfDocumentAvgOrderByAggregateInput
    _max?: DnfDocumentMaxOrderByAggregateInput
    _min?: DnfDocumentMinOrderByAggregateInput
    _sum?: DnfDocumentSumOrderByAggregateInput
  }

  export type DnfDocumentScalarWhereWithAggregatesInput = {
    AND?: DnfDocumentScalarWhereWithAggregatesInput | DnfDocumentScalarWhereWithAggregatesInput[]
    OR?: DnfDocumentScalarWhereWithAggregatesInput[]
    NOT?: DnfDocumentScalarWhereWithAggregatesInput | DnfDocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DnfDocument"> | string
    failureReportNo?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    locationOfFailure?: StringWithAggregatesFilter<"DnfDocument"> | string
    failedComponentEquipmentLRUTrainNumber?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    subsystemIds?: StringNullableListFilter<"DnfDocument">
    descriptionOfFailure?: StringWithAggregatesFilter<"DnfDocument"> | string
    impactAssessment?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    staffWhoIdentifiedFailure?: StringWithAggregatesFilter<"DnfDocument"> | string
    dateTimeOfFailureOccurrence?: DateTimeWithAggregatesFilter<"DnfDocument"> | Date | string
    methodOfFailureDetection?: StringWithAggregatesFilter<"DnfDocument"> | string
    hazardLevelId?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    status?: StringWithAggregatesFilter<"DnfDocument"> | string
    attachments?: JsonNullableWithAggregatesFilter<"DnfDocument">
    createdById?: StringWithAggregatesFilter<"DnfDocument"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DnfDocument"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DnfDocument"> | Date | string
    statusHistory?: JsonNullableWithAggregatesFilter<"DnfDocument">
    isArchived?: BoolWithAggregatesFilter<"DnfDocument"> | boolean
    resolutionDetails?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    assignedTo?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    priority?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    completedDate?: DateTimeNullableWithAggregatesFilter<"DnfDocument"> | Date | string | null
    originatingInspectionId?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    originatingFindingId?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    immediateAction?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    problemResettable?: BoolNullableWithAggregatesFilter<"DnfDocument"> | boolean | null
    trainServiceAffected?: BoolNullableWithAggregatesFilter<"DnfDocument"> | boolean | null
    trainWithdrawn?: BoolNullableWithAggregatesFilter<"DnfDocument"> | boolean | null
    systemRestoredTime?: DateTimeNullableWithAggregatesFilter<"DnfDocument"> | Date | string | null
    disruptionDuration?: FloatNullableWithAggregatesFilter<"DnfDocument"> | number | null
    trainKm?: FloatNullableWithAggregatesFilter<"DnfDocument"> | number | null
    rectificationParty?: StringNullableWithAggregatesFilter<"DnfDocument"> | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"DnfDocument"> | Date | string | null
  }

  export type CorrectiveActionWhereInput = {
    AND?: CorrectiveActionWhereInput | CorrectiveActionWhereInput[]
    OR?: CorrectiveActionWhereInput[]
    NOT?: CorrectiveActionWhereInput | CorrectiveActionWhereInput[]
    id?: StringFilter<"CorrectiveAction"> | string
    dnfId?: StringFilter<"CorrectiveAction"> | string
    description?: StringFilter<"CorrectiveAction"> | string
    responsiblePersonOrUnit?: StringFilter<"CorrectiveAction"> | string
    createdAt?: DateTimeFilter<"CorrectiveAction"> | Date | string
    updatedAt?: DateTimeFilter<"CorrectiveAction"> | Date | string
    completedAt?: DateTimeNullableFilter<"CorrectiveAction"> | Date | string | null
    status?: StringFilter<"CorrectiveAction"> | string
    dateTimeNotified?: DateTimeNullableFilter<"CorrectiveAction"> | Date | string | null
    dateTimeArrival?: DateTimeNullableFilter<"CorrectiveAction"> | Date | string | null
    diagnosisTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    repairTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    verificationTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    totalDownTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    dnf?: XOR<DnfDocumentRelationFilter, DnfDocumentWhereInput>
  }

  export type CorrectiveActionOrderByWithRelationInput = {
    id?: SortOrder
    dnfId?: SortOrder
    description?: SortOrder
    responsiblePersonOrUnit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    dateTimeNotified?: SortOrderInput | SortOrder
    dateTimeArrival?: SortOrderInput | SortOrder
    diagnosisTime?: SortOrderInput | SortOrder
    repairTime?: SortOrderInput | SortOrder
    verificationTime?: SortOrderInput | SortOrder
    totalDownTime?: SortOrderInput | SortOrder
    dnf?: DnfDocumentOrderByWithRelationInput
  }

  export type CorrectiveActionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CorrectiveActionWhereInput | CorrectiveActionWhereInput[]
    OR?: CorrectiveActionWhereInput[]
    NOT?: CorrectiveActionWhereInput | CorrectiveActionWhereInput[]
    dnfId?: StringFilter<"CorrectiveAction"> | string
    description?: StringFilter<"CorrectiveAction"> | string
    responsiblePersonOrUnit?: StringFilter<"CorrectiveAction"> | string
    createdAt?: DateTimeFilter<"CorrectiveAction"> | Date | string
    updatedAt?: DateTimeFilter<"CorrectiveAction"> | Date | string
    completedAt?: DateTimeNullableFilter<"CorrectiveAction"> | Date | string | null
    status?: StringFilter<"CorrectiveAction"> | string
    dateTimeNotified?: DateTimeNullableFilter<"CorrectiveAction"> | Date | string | null
    dateTimeArrival?: DateTimeNullableFilter<"CorrectiveAction"> | Date | string | null
    diagnosisTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    repairTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    verificationTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    totalDownTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    dnf?: XOR<DnfDocumentRelationFilter, DnfDocumentWhereInput>
  }, "id">

  export type CorrectiveActionOrderByWithAggregationInput = {
    id?: SortOrder
    dnfId?: SortOrder
    description?: SortOrder
    responsiblePersonOrUnit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    dateTimeNotified?: SortOrderInput | SortOrder
    dateTimeArrival?: SortOrderInput | SortOrder
    diagnosisTime?: SortOrderInput | SortOrder
    repairTime?: SortOrderInput | SortOrder
    verificationTime?: SortOrderInput | SortOrder
    totalDownTime?: SortOrderInput | SortOrder
    _count?: CorrectiveActionCountOrderByAggregateInput
    _avg?: CorrectiveActionAvgOrderByAggregateInput
    _max?: CorrectiveActionMaxOrderByAggregateInput
    _min?: CorrectiveActionMinOrderByAggregateInput
    _sum?: CorrectiveActionSumOrderByAggregateInput
  }

  export type CorrectiveActionScalarWhereWithAggregatesInput = {
    AND?: CorrectiveActionScalarWhereWithAggregatesInput | CorrectiveActionScalarWhereWithAggregatesInput[]
    OR?: CorrectiveActionScalarWhereWithAggregatesInput[]
    NOT?: CorrectiveActionScalarWhereWithAggregatesInput | CorrectiveActionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CorrectiveAction"> | string
    dnfId?: StringWithAggregatesFilter<"CorrectiveAction"> | string
    description?: StringWithAggregatesFilter<"CorrectiveAction"> | string
    responsiblePersonOrUnit?: StringWithAggregatesFilter<"CorrectiveAction"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CorrectiveAction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CorrectiveAction"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"CorrectiveAction"> | Date | string | null
    status?: StringWithAggregatesFilter<"CorrectiveAction"> | string
    dateTimeNotified?: DateTimeNullableWithAggregatesFilter<"CorrectiveAction"> | Date | string | null
    dateTimeArrival?: DateTimeNullableWithAggregatesFilter<"CorrectiveAction"> | Date | string | null
    diagnosisTime?: FloatNullableWithAggregatesFilter<"CorrectiveAction"> | number | null
    repairTime?: FloatNullableWithAggregatesFilter<"CorrectiveAction"> | number | null
    verificationTime?: FloatNullableWithAggregatesFilter<"CorrectiveAction"> | number | null
    totalDownTime?: FloatNullableWithAggregatesFilter<"CorrectiveAction"> | number | null
  }

  export type HazardRecordWhereInput = {
    AND?: HazardRecordWhereInput | HazardRecordWhereInput[]
    OR?: HazardRecordWhereInput[]
    NOT?: HazardRecordWhereInput | HazardRecordWhereInput[]
    id?: StringFilter<"HazardRecord"> | string
    description?: StringFilter<"HazardRecord"> | string
    systemGroup?: StringNullableFilter<"HazardRecord"> | string | null
    locationIds?: StringNullableListFilter<"HazardRecord">
    source?: StringNullableFilter<"HazardRecord"> | string | null
    potentialConsequence?: StringNullableFilter<"HazardRecord"> | string | null
    identifiedBy?: StringFilter<"HazardRecord"> | string
    identificationDate?: DateTimeFilter<"HazardRecord"> | Date | string
    severityId?: StringNullableFilter<"HazardRecord"> | string | null
    likelihoodId?: StringNullableFilter<"HazardRecord"> | string | null
    riskLevelId?: StringNullableFilter<"HazardRecord"> | string | null
    currentControls?: StringFilter<"HazardRecord"> | string
    proposedActions?: StringNullableFilter<"HazardRecord"> | string | null
    suggestedActions?: StringNullableFilter<"HazardRecord"> | string | null
    responsiblePersonOrUnit?: StringNullableFilter<"HazardRecord"> | string | null
    coordinatingUnits?: StringNullableListFilter<"HazardRecord">
    dueDate?: DateTimeNullableFilter<"HazardRecord"> | Date | string | null
    status?: StringFilter<"HazardRecord"> | string
    closureDetails?: StringNullableFilter<"HazardRecord"> | string | null
    verificationDetails?: StringNullableFilter<"HazardRecord"> | string | null
    attachments?: JsonNullableFilter<"HazardRecord">
    linkedDnfId?: StringNullableFilter<"HazardRecord"> | string | null
    createdById?: StringFilter<"HazardRecord"> | string
    createdAt?: DateTimeFilter<"HazardRecord"> | Date | string
    updatedAt?: DateTimeFilter<"HazardRecord"> | Date | string
    isArchived?: BoolFilter<"HazardRecord"> | boolean
    deletedAt?: DateTimeNullableFilter<"HazardRecord"> | Date | string | null
    statusHistory?: JsonNullableFilter<"HazardRecord">
  }

  export type HazardRecordOrderByWithRelationInput = {
    id?: SortOrder
    description?: SortOrder
    systemGroup?: SortOrderInput | SortOrder
    locationIds?: SortOrder
    source?: SortOrderInput | SortOrder
    potentialConsequence?: SortOrderInput | SortOrder
    identifiedBy?: SortOrder
    identificationDate?: SortOrder
    severityId?: SortOrderInput | SortOrder
    likelihoodId?: SortOrderInput | SortOrder
    riskLevelId?: SortOrderInput | SortOrder
    currentControls?: SortOrder
    proposedActions?: SortOrderInput | SortOrder
    suggestedActions?: SortOrderInput | SortOrder
    responsiblePersonOrUnit?: SortOrderInput | SortOrder
    coordinatingUnits?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    status?: SortOrder
    closureDetails?: SortOrderInput | SortOrder
    verificationDetails?: SortOrderInput | SortOrder
    attachments?: SortOrderInput | SortOrder
    linkedDnfId?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    statusHistory?: SortOrderInput | SortOrder
  }

  export type HazardRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HazardRecordWhereInput | HazardRecordWhereInput[]
    OR?: HazardRecordWhereInput[]
    NOT?: HazardRecordWhereInput | HazardRecordWhereInput[]
    description?: StringFilter<"HazardRecord"> | string
    systemGroup?: StringNullableFilter<"HazardRecord"> | string | null
    locationIds?: StringNullableListFilter<"HazardRecord">
    source?: StringNullableFilter<"HazardRecord"> | string | null
    potentialConsequence?: StringNullableFilter<"HazardRecord"> | string | null
    identifiedBy?: StringFilter<"HazardRecord"> | string
    identificationDate?: DateTimeFilter<"HazardRecord"> | Date | string
    severityId?: StringNullableFilter<"HazardRecord"> | string | null
    likelihoodId?: StringNullableFilter<"HazardRecord"> | string | null
    riskLevelId?: StringNullableFilter<"HazardRecord"> | string | null
    currentControls?: StringFilter<"HazardRecord"> | string
    proposedActions?: StringNullableFilter<"HazardRecord"> | string | null
    suggestedActions?: StringNullableFilter<"HazardRecord"> | string | null
    responsiblePersonOrUnit?: StringNullableFilter<"HazardRecord"> | string | null
    coordinatingUnits?: StringNullableListFilter<"HazardRecord">
    dueDate?: DateTimeNullableFilter<"HazardRecord"> | Date | string | null
    status?: StringFilter<"HazardRecord"> | string
    closureDetails?: StringNullableFilter<"HazardRecord"> | string | null
    verificationDetails?: StringNullableFilter<"HazardRecord"> | string | null
    attachments?: JsonNullableFilter<"HazardRecord">
    linkedDnfId?: StringNullableFilter<"HazardRecord"> | string | null
    createdById?: StringFilter<"HazardRecord"> | string
    createdAt?: DateTimeFilter<"HazardRecord"> | Date | string
    updatedAt?: DateTimeFilter<"HazardRecord"> | Date | string
    isArchived?: BoolFilter<"HazardRecord"> | boolean
    deletedAt?: DateTimeNullableFilter<"HazardRecord"> | Date | string | null
    statusHistory?: JsonNullableFilter<"HazardRecord">
  }, "id">

  export type HazardRecordOrderByWithAggregationInput = {
    id?: SortOrder
    description?: SortOrder
    systemGroup?: SortOrderInput | SortOrder
    locationIds?: SortOrder
    source?: SortOrderInput | SortOrder
    potentialConsequence?: SortOrderInput | SortOrder
    identifiedBy?: SortOrder
    identificationDate?: SortOrder
    severityId?: SortOrderInput | SortOrder
    likelihoodId?: SortOrderInput | SortOrder
    riskLevelId?: SortOrderInput | SortOrder
    currentControls?: SortOrder
    proposedActions?: SortOrderInput | SortOrder
    suggestedActions?: SortOrderInput | SortOrder
    responsiblePersonOrUnit?: SortOrderInput | SortOrder
    coordinatingUnits?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    status?: SortOrder
    closureDetails?: SortOrderInput | SortOrder
    verificationDetails?: SortOrderInput | SortOrder
    attachments?: SortOrderInput | SortOrder
    linkedDnfId?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    statusHistory?: SortOrderInput | SortOrder
    _count?: HazardRecordCountOrderByAggregateInput
    _max?: HazardRecordMaxOrderByAggregateInput
    _min?: HazardRecordMinOrderByAggregateInput
  }

  export type HazardRecordScalarWhereWithAggregatesInput = {
    AND?: HazardRecordScalarWhereWithAggregatesInput | HazardRecordScalarWhereWithAggregatesInput[]
    OR?: HazardRecordScalarWhereWithAggregatesInput[]
    NOT?: HazardRecordScalarWhereWithAggregatesInput | HazardRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HazardRecord"> | string
    description?: StringWithAggregatesFilter<"HazardRecord"> | string
    systemGroup?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    locationIds?: StringNullableListFilter<"HazardRecord">
    source?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    potentialConsequence?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    identifiedBy?: StringWithAggregatesFilter<"HazardRecord"> | string
    identificationDate?: DateTimeWithAggregatesFilter<"HazardRecord"> | Date | string
    severityId?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    likelihoodId?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    riskLevelId?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    currentControls?: StringWithAggregatesFilter<"HazardRecord"> | string
    proposedActions?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    suggestedActions?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    responsiblePersonOrUnit?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    coordinatingUnits?: StringNullableListFilter<"HazardRecord">
    dueDate?: DateTimeNullableWithAggregatesFilter<"HazardRecord"> | Date | string | null
    status?: StringWithAggregatesFilter<"HazardRecord"> | string
    closureDetails?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    verificationDetails?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    attachments?: JsonNullableWithAggregatesFilter<"HazardRecord">
    linkedDnfId?: StringNullableWithAggregatesFilter<"HazardRecord"> | string | null
    createdById?: StringWithAggregatesFilter<"HazardRecord"> | string
    createdAt?: DateTimeWithAggregatesFilter<"HazardRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"HazardRecord"> | Date | string
    isArchived?: BoolWithAggregatesFilter<"HazardRecord"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"HazardRecord"> | Date | string | null
    statusHistory?: JsonNullableWithAggregatesFilter<"HazardRecord">
  }

  export type ImprovementWhereInput = {
    AND?: ImprovementWhereInput | ImprovementWhereInput[]
    OR?: ImprovementWhereInput[]
    NOT?: ImprovementWhereInput | ImprovementWhereInput[]
    id?: StringFilter<"Improvement"> | string
    title?: StringFilter<"Improvement"> | string
    description?: StringFilter<"Improvement"> | string
    category?: StringFilter<"Improvement"> | string
    status?: StringFilter<"Improvement"> | string
    submittedBy?: StringFilter<"Improvement"> | string
    createdById?: StringFilter<"Improvement"> | string
    submissionDate?: DateTimeFilter<"Improvement"> | Date | string
    updatedAt?: DateTimeFilter<"Improvement"> | Date | string
    benefitAnalysis?: StringNullableFilter<"Improvement"> | string | null
    estimatedCost?: FloatNullableFilter<"Improvement"> | number | null
    attachments?: JsonNullableFilter<"Improvement">
  }

  export type ImprovementOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    createdById?: SortOrder
    submissionDate?: SortOrder
    updatedAt?: SortOrder
    benefitAnalysis?: SortOrderInput | SortOrder
    estimatedCost?: SortOrderInput | SortOrder
    attachments?: SortOrderInput | SortOrder
  }

  export type ImprovementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImprovementWhereInput | ImprovementWhereInput[]
    OR?: ImprovementWhereInput[]
    NOT?: ImprovementWhereInput | ImprovementWhereInput[]
    title?: StringFilter<"Improvement"> | string
    description?: StringFilter<"Improvement"> | string
    category?: StringFilter<"Improvement"> | string
    status?: StringFilter<"Improvement"> | string
    submittedBy?: StringFilter<"Improvement"> | string
    createdById?: StringFilter<"Improvement"> | string
    submissionDate?: DateTimeFilter<"Improvement"> | Date | string
    updatedAt?: DateTimeFilter<"Improvement"> | Date | string
    benefitAnalysis?: StringNullableFilter<"Improvement"> | string | null
    estimatedCost?: FloatNullableFilter<"Improvement"> | number | null
    attachments?: JsonNullableFilter<"Improvement">
  }, "id">

  export type ImprovementOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    createdById?: SortOrder
    submissionDate?: SortOrder
    updatedAt?: SortOrder
    benefitAnalysis?: SortOrderInput | SortOrder
    estimatedCost?: SortOrderInput | SortOrder
    attachments?: SortOrderInput | SortOrder
    _count?: ImprovementCountOrderByAggregateInput
    _avg?: ImprovementAvgOrderByAggregateInput
    _max?: ImprovementMaxOrderByAggregateInput
    _min?: ImprovementMinOrderByAggregateInput
    _sum?: ImprovementSumOrderByAggregateInput
  }

  export type ImprovementScalarWhereWithAggregatesInput = {
    AND?: ImprovementScalarWhereWithAggregatesInput | ImprovementScalarWhereWithAggregatesInput[]
    OR?: ImprovementScalarWhereWithAggregatesInput[]
    NOT?: ImprovementScalarWhereWithAggregatesInput | ImprovementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Improvement"> | string
    title?: StringWithAggregatesFilter<"Improvement"> | string
    description?: StringWithAggregatesFilter<"Improvement"> | string
    category?: StringWithAggregatesFilter<"Improvement"> | string
    status?: StringWithAggregatesFilter<"Improvement"> | string
    submittedBy?: StringWithAggregatesFilter<"Improvement"> | string
    createdById?: StringWithAggregatesFilter<"Improvement"> | string
    submissionDate?: DateTimeWithAggregatesFilter<"Improvement"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Improvement"> | Date | string
    benefitAnalysis?: StringNullableWithAggregatesFilter<"Improvement"> | string | null
    estimatedCost?: FloatNullableWithAggregatesFilter<"Improvement"> | number | null
    attachments?: JsonNullableWithAggregatesFilter<"Improvement">
  }

  export type SystemStateWhereInput = {
    AND?: SystemStateWhereInput | SystemStateWhereInput[]
    OR?: SystemStateWhereInput[]
    NOT?: SystemStateWhereInput | SystemStateWhereInput[]
    id?: IntFilter<"SystemState"> | number
    lastSchedulerRun?: DateTimeNullableFilter<"SystemState"> | Date | string | null
    aiModelConfig?: StringNullableFilter<"SystemState"> | string | null
  }

  export type SystemStateOrderByWithRelationInput = {
    id?: SortOrder
    lastSchedulerRun?: SortOrderInput | SortOrder
    aiModelConfig?: SortOrderInput | SortOrder
  }

  export type SystemStateWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SystemStateWhereInput | SystemStateWhereInput[]
    OR?: SystemStateWhereInput[]
    NOT?: SystemStateWhereInput | SystemStateWhereInput[]
    lastSchedulerRun?: DateTimeNullableFilter<"SystemState"> | Date | string | null
    aiModelConfig?: StringNullableFilter<"SystemState"> | string | null
  }, "id">

  export type SystemStateOrderByWithAggregationInput = {
    id?: SortOrder
    lastSchedulerRun?: SortOrderInput | SortOrder
    aiModelConfig?: SortOrderInput | SortOrder
    _count?: SystemStateCountOrderByAggregateInput
    _avg?: SystemStateAvgOrderByAggregateInput
    _max?: SystemStateMaxOrderByAggregateInput
    _min?: SystemStateMinOrderByAggregateInput
    _sum?: SystemStateSumOrderByAggregateInput
  }

  export type SystemStateScalarWhereWithAggregatesInput = {
    AND?: SystemStateScalarWhereWithAggregatesInput | SystemStateScalarWhereWithAggregatesInput[]
    OR?: SystemStateScalarWhereWithAggregatesInput[]
    NOT?: SystemStateScalarWhereWithAggregatesInput | SystemStateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SystemState"> | number
    lastSchedulerRun?: DateTimeNullableWithAggregatesFilter<"SystemState"> | Date | string | null
    aiModelConfig?: StringNullableWithAggregatesFilter<"SystemState"> | string | null
  }

  export type SystemLogCreateInput = {
    id?: string
    timestamp?: Date | string
    userId: string
    userName: string
    action: string
    level: string
    details: string
    category: string
    deletedAt?: Date | string | null
  }

  export type SystemLogUncheckedCreateInput = {
    id?: string
    timestamp?: Date | string
    userId: string
    userName: string
    action: string
    level: string
    details: string
    category: string
    deletedAt?: Date | string | null
  }

  export type SystemLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SystemLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SystemLogCreateManyInput = {
    id?: string
    timestamp?: Date | string
    userId: string
    userName: string
    action: string
    level: string
    details: string
    category: string
    deletedAt?: Date | string | null
  }

  export type SystemLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SystemLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ResponsibleUnitCreateInput = {
    id: string
    name: string
  }

  export type ResponsibleUnitUncheckedCreateInput = {
    id: string
    name: string
  }

  export type ResponsibleUnitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ResponsibleUnitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ResponsibleUnitCreateManyInput = {
    id: string
    name: string
  }

  export type ResponsibleUnitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ResponsibleUnitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SubsystemCreateInput = {
    id: string
    label: JsonNullValueInput | InputJsonValue
  }

  export type SubsystemUncheckedCreateInput = {
    id: string
    label: JsonNullValueInput | InputJsonValue
  }

  export type SubsystemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: JsonNullValueInput | InputJsonValue
  }

  export type SubsystemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: JsonNullValueInput | InputJsonValue
  }

  export type SubsystemCreateManyInput = {
    id: string
    label: JsonNullValueInput | InputJsonValue
  }

  export type SubsystemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: JsonNullValueInput | InputJsonValue
  }

  export type SubsystemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: JsonNullValueInput | InputJsonValue
  }

  export type PatrolLocationCreateInput = {
    id: string
    label: string
  }

  export type PatrolLocationUncheckedCreateInput = {
    id: string
    label: string
  }

  export type PatrolLocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type PatrolLocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type PatrolLocationCreateManyInput = {
    id: string
    label: string
  }

  export type PatrolLocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type PatrolLocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type CommentCreateInput = {
    id?: string
    entityId: string
    senderId: string
    senderName: string
    timestamp?: Date | string
    content: string
  }

  export type CommentUncheckedCreateInput = {
    id?: string
    entityId: string
    senderId: string
    senderName: string
    timestamp?: Date | string
    content: string
  }

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type CommentCreateManyInput = {
    id?: string
    entityId: string
    senderId: string
    senderName: string
    timestamp?: Date | string
    content: string
  }

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationCreateInput = {
    id?: string
    message: string
    type: string
    timestamp?: Date | string
    isRead?: boolean
    link?: string | null
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    message: string
    type: string
    timestamp?: Date | string
    isRead?: boolean
    link?: string | null
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationCreateManyInput = {
    id?: string
    message: string
    type: string
    timestamp?: Date | string
    isRead?: boolean
    link?: string | null
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceStandardCreateInput = {
    id: string
    name: string
    name_en?: string | null
    description?: string | null
    frequency?: string | null
    scheduledTime?: string | null
    locationIds?: MaintenanceStandardCreatelocationIdsInput | string[]
    recipientId?: string | null
    abbreviation?: string | null
    estimatedDurationHours?: number | null
    deletedAt?: Date | string | null
  }

  export type MaintenanceStandardUncheckedCreateInput = {
    id: string
    name: string
    name_en?: string | null
    description?: string | null
    frequency?: string | null
    scheduledTime?: string | null
    locationIds?: MaintenanceStandardCreatelocationIdsInput | string[]
    recipientId?: string | null
    abbreviation?: string | null
    estimatedDurationHours?: number | null
    deletedAt?: Date | string | null
  }

  export type MaintenanceStandardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledTime?: NullableStringFieldUpdateOperationsInput | string | null
    locationIds?: MaintenanceStandardUpdatelocationIdsInput | string[]
    recipientId?: NullableStringFieldUpdateOperationsInput | string | null
    abbreviation?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDurationHours?: NullableFloatFieldUpdateOperationsInput | number | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MaintenanceStandardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledTime?: NullableStringFieldUpdateOperationsInput | string | null
    locationIds?: MaintenanceStandardUpdatelocationIdsInput | string[]
    recipientId?: NullableStringFieldUpdateOperationsInput | string | null
    abbreviation?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDurationHours?: NullableFloatFieldUpdateOperationsInput | number | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MaintenanceStandardCreateManyInput = {
    id: string
    name: string
    name_en?: string | null
    description?: string | null
    frequency?: string | null
    scheduledTime?: string | null
    locationIds?: MaintenanceStandardCreatelocationIdsInput | string[]
    recipientId?: string | null
    abbreviation?: string | null
    estimatedDurationHours?: number | null
    deletedAt?: Date | string | null
  }

  export type MaintenanceStandardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledTime?: NullableStringFieldUpdateOperationsInput | string | null
    locationIds?: MaintenanceStandardUpdatelocationIdsInput | string[]
    recipientId?: NullableStringFieldUpdateOperationsInput | string | null
    abbreviation?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDurationHours?: NullableFloatFieldUpdateOperationsInput | number | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MaintenanceStandardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledTime?: NullableStringFieldUpdateOperationsInput | string | null
    locationIds?: MaintenanceStandardUpdatelocationIdsInput | string[]
    recipientId?: NullableStringFieldUpdateOperationsInput | string | null
    abbreviation?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDurationHours?: NullableFloatFieldUpdateOperationsInput | number | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MaintenanceStandardItemCreateInput = {
    id: string
    standardId: string
    itemCode: string
    itemText: string
    criteria?: string | null
    unit?: string | null
    standardQuantity?: number | null
    toleranceOperator?: string | null
    toleranceValue?: number | null
    requiredTools?: string | null
  }

  export type MaintenanceStandardItemUncheckedCreateInput = {
    id: string
    standardId: string
    itemCode: string
    itemText: string
    criteria?: string | null
    unit?: string | null
    standardQuantity?: number | null
    toleranceOperator?: string | null
    toleranceValue?: number | null
    requiredTools?: string | null
  }

  export type MaintenanceStandardItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    standardId?: StringFieldUpdateOperationsInput | string
    itemCode?: StringFieldUpdateOperationsInput | string
    itemText?: StringFieldUpdateOperationsInput | string
    criteria?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    standardQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    toleranceOperator?: NullableStringFieldUpdateOperationsInput | string | null
    toleranceValue?: NullableFloatFieldUpdateOperationsInput | number | null
    requiredTools?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceStandardItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    standardId?: StringFieldUpdateOperationsInput | string
    itemCode?: StringFieldUpdateOperationsInput | string
    itemText?: StringFieldUpdateOperationsInput | string
    criteria?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    standardQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    toleranceOperator?: NullableStringFieldUpdateOperationsInput | string | null
    toleranceValue?: NullableFloatFieldUpdateOperationsInput | number | null
    requiredTools?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceStandardItemCreateManyInput = {
    id: string
    standardId: string
    itemCode: string
    itemText: string
    criteria?: string | null
    unit?: string | null
    standardQuantity?: number | null
    toleranceOperator?: string | null
    toleranceValue?: number | null
    requiredTools?: string | null
  }

  export type MaintenanceStandardItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    standardId?: StringFieldUpdateOperationsInput | string
    itemCode?: StringFieldUpdateOperationsInput | string
    itemText?: StringFieldUpdateOperationsInput | string
    criteria?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    standardQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    toleranceOperator?: NullableStringFieldUpdateOperationsInput | string | null
    toleranceValue?: NullableFloatFieldUpdateOperationsInput | number | null
    requiredTools?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceStandardItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    standardId?: StringFieldUpdateOperationsInput | string
    itemCode?: StringFieldUpdateOperationsInput | string
    itemText?: StringFieldUpdateOperationsInput | string
    criteria?: NullableStringFieldUpdateOperationsInput | string | null
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    standardQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    toleranceOperator?: NullableStringFieldUpdateOperationsInput | string | null
    toleranceValue?: NullableFloatFieldUpdateOperationsInput | number | null
    requiredTools?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InspectionDetailCreateInput = {
    id: string
    title: string
    areaIds?: InspectionDetailCreateareaIdsInput | string[]
    inspector: string
    date: Date | string
    status: string
    checklistTemplateId?: string | null
    checklistItems?: NullableJsonNullValueInput | InputJsonValue
    generalNotes?: string | null
    approvalComments?: string | null
    lastStatusUpdateBy?: string | null
    lastStatusUpdateAt?: Date | string | null
    scheduledStartDate?: Date | string | null
    scheduledFinishDate?: Date | string | null
    estimatedDurationHours?: number | null
    isArchived?: boolean
    deletedAt?: Date | string | null
  }

  export type InspectionDetailUncheckedCreateInput = {
    id: string
    title: string
    areaIds?: InspectionDetailCreateareaIdsInput | string[]
    inspector: string
    date: Date | string
    status: string
    checklistTemplateId?: string | null
    checklistItems?: NullableJsonNullValueInput | InputJsonValue
    generalNotes?: string | null
    approvalComments?: string | null
    lastStatusUpdateBy?: string | null
    lastStatusUpdateAt?: Date | string | null
    scheduledStartDate?: Date | string | null
    scheduledFinishDate?: Date | string | null
    estimatedDurationHours?: number | null
    isArchived?: boolean
    deletedAt?: Date | string | null
  }

  export type InspectionDetailUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    areaIds?: InspectionDetailUpdateareaIdsInput | string[]
    inspector?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    checklistTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    checklistItems?: NullableJsonNullValueInput | InputJsonValue
    generalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    approvalComments?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatusUpdateBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatusUpdateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledFinishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedDurationHours?: NullableFloatFieldUpdateOperationsInput | number | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InspectionDetailUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    areaIds?: InspectionDetailUpdateareaIdsInput | string[]
    inspector?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    checklistTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    checklistItems?: NullableJsonNullValueInput | InputJsonValue
    generalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    approvalComments?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatusUpdateBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatusUpdateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledFinishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedDurationHours?: NullableFloatFieldUpdateOperationsInput | number | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InspectionDetailCreateManyInput = {
    id: string
    title: string
    areaIds?: InspectionDetailCreateareaIdsInput | string[]
    inspector: string
    date: Date | string
    status: string
    checklistTemplateId?: string | null
    checklistItems?: NullableJsonNullValueInput | InputJsonValue
    generalNotes?: string | null
    approvalComments?: string | null
    lastStatusUpdateBy?: string | null
    lastStatusUpdateAt?: Date | string | null
    scheduledStartDate?: Date | string | null
    scheduledFinishDate?: Date | string | null
    estimatedDurationHours?: number | null
    isArchived?: boolean
    deletedAt?: Date | string | null
  }

  export type InspectionDetailUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    areaIds?: InspectionDetailUpdateareaIdsInput | string[]
    inspector?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    checklistTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    checklistItems?: NullableJsonNullValueInput | InputJsonValue
    generalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    approvalComments?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatusUpdateBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatusUpdateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledFinishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedDurationHours?: NullableFloatFieldUpdateOperationsInput | number | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InspectionDetailUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    areaIds?: InspectionDetailUpdateareaIdsInput | string[]
    inspector?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    checklistTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    checklistItems?: NullableJsonNullValueInput | InputJsonValue
    generalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    approvalComments?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatusUpdateBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastStatusUpdateAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledFinishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedDurationHours?: NullableFloatFieldUpdateOperationsInput | number | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DnfDocumentCreateInput = {
    id: string
    failureReportNo?: string | null
    locationOfFailure: string
    failedComponentEquipmentLRUTrainNumber?: string | null
    subsystemIds?: DnfDocumentCreatesubsystemIdsInput | string[]
    descriptionOfFailure: string
    impactAssessment?: string | null
    staffWhoIdentifiedFailure: string
    dateTimeOfFailureOccurrence: Date | string
    methodOfFailureDetection: string
    hazardLevelId?: string | null
    status: string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: boolean
    resolutionDetails?: string | null
    assignedTo?: string | null
    priority?: string | null
    completedDate?: Date | string | null
    originatingInspectionId?: string | null
    originatingFindingId?: string | null
    immediateAction?: string | null
    problemResettable?: boolean | null
    trainServiceAffected?: boolean | null
    trainWithdrawn?: boolean | null
    systemRestoredTime?: Date | string | null
    disruptionDuration?: number | null
    trainKm?: number | null
    rectificationParty?: string | null
    deletedAt?: Date | string | null
    correctiveActions?: CorrectiveActionCreateNestedManyWithoutDnfInput
  }

  export type DnfDocumentUncheckedCreateInput = {
    id: string
    failureReportNo?: string | null
    locationOfFailure: string
    failedComponentEquipmentLRUTrainNumber?: string | null
    subsystemIds?: DnfDocumentCreatesubsystemIdsInput | string[]
    descriptionOfFailure: string
    impactAssessment?: string | null
    staffWhoIdentifiedFailure: string
    dateTimeOfFailureOccurrence: Date | string
    methodOfFailureDetection: string
    hazardLevelId?: string | null
    status: string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: boolean
    resolutionDetails?: string | null
    assignedTo?: string | null
    priority?: string | null
    completedDate?: Date | string | null
    originatingInspectionId?: string | null
    originatingFindingId?: string | null
    immediateAction?: string | null
    problemResettable?: boolean | null
    trainServiceAffected?: boolean | null
    trainWithdrawn?: boolean | null
    systemRestoredTime?: Date | string | null
    disruptionDuration?: number | null
    trainKm?: number | null
    rectificationParty?: string | null
    deletedAt?: Date | string | null
    correctiveActions?: CorrectiveActionUncheckedCreateNestedManyWithoutDnfInput
  }

  export type DnfDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    failureReportNo?: NullableStringFieldUpdateOperationsInput | string | null
    locationOfFailure?: StringFieldUpdateOperationsInput | string
    failedComponentEquipmentLRUTrainNumber?: NullableStringFieldUpdateOperationsInput | string | null
    subsystemIds?: DnfDocumentUpdatesubsystemIdsInput | string[]
    descriptionOfFailure?: StringFieldUpdateOperationsInput | string
    impactAssessment?: NullableStringFieldUpdateOperationsInput | string | null
    staffWhoIdentifiedFailure?: StringFieldUpdateOperationsInput | string
    dateTimeOfFailureOccurrence?: DateTimeFieldUpdateOperationsInput | Date | string
    methodOfFailureDetection?: StringFieldUpdateOperationsInput | string
    hazardLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    resolutionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    originatingInspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    originatingFindingId?: NullableStringFieldUpdateOperationsInput | string | null
    immediateAction?: NullableStringFieldUpdateOperationsInput | string | null
    problemResettable?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainServiceAffected?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainWithdrawn?: NullableBoolFieldUpdateOperationsInput | boolean | null
    systemRestoredTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disruptionDuration?: NullableFloatFieldUpdateOperationsInput | number | null
    trainKm?: NullableFloatFieldUpdateOperationsInput | number | null
    rectificationParty?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    correctiveActions?: CorrectiveActionUpdateManyWithoutDnfNestedInput
  }

  export type DnfDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    failureReportNo?: NullableStringFieldUpdateOperationsInput | string | null
    locationOfFailure?: StringFieldUpdateOperationsInput | string
    failedComponentEquipmentLRUTrainNumber?: NullableStringFieldUpdateOperationsInput | string | null
    subsystemIds?: DnfDocumentUpdatesubsystemIdsInput | string[]
    descriptionOfFailure?: StringFieldUpdateOperationsInput | string
    impactAssessment?: NullableStringFieldUpdateOperationsInput | string | null
    staffWhoIdentifiedFailure?: StringFieldUpdateOperationsInput | string
    dateTimeOfFailureOccurrence?: DateTimeFieldUpdateOperationsInput | Date | string
    methodOfFailureDetection?: StringFieldUpdateOperationsInput | string
    hazardLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    resolutionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    originatingInspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    originatingFindingId?: NullableStringFieldUpdateOperationsInput | string | null
    immediateAction?: NullableStringFieldUpdateOperationsInput | string | null
    problemResettable?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainServiceAffected?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainWithdrawn?: NullableBoolFieldUpdateOperationsInput | boolean | null
    systemRestoredTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disruptionDuration?: NullableFloatFieldUpdateOperationsInput | number | null
    trainKm?: NullableFloatFieldUpdateOperationsInput | number | null
    rectificationParty?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    correctiveActions?: CorrectiveActionUncheckedUpdateManyWithoutDnfNestedInput
  }

  export type DnfDocumentCreateManyInput = {
    id: string
    failureReportNo?: string | null
    locationOfFailure: string
    failedComponentEquipmentLRUTrainNumber?: string | null
    subsystemIds?: DnfDocumentCreatesubsystemIdsInput | string[]
    descriptionOfFailure: string
    impactAssessment?: string | null
    staffWhoIdentifiedFailure: string
    dateTimeOfFailureOccurrence: Date | string
    methodOfFailureDetection: string
    hazardLevelId?: string | null
    status: string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: boolean
    resolutionDetails?: string | null
    assignedTo?: string | null
    priority?: string | null
    completedDate?: Date | string | null
    originatingInspectionId?: string | null
    originatingFindingId?: string | null
    immediateAction?: string | null
    problemResettable?: boolean | null
    trainServiceAffected?: boolean | null
    trainWithdrawn?: boolean | null
    systemRestoredTime?: Date | string | null
    disruptionDuration?: number | null
    trainKm?: number | null
    rectificationParty?: string | null
    deletedAt?: Date | string | null
  }

  export type DnfDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    failureReportNo?: NullableStringFieldUpdateOperationsInput | string | null
    locationOfFailure?: StringFieldUpdateOperationsInput | string
    failedComponentEquipmentLRUTrainNumber?: NullableStringFieldUpdateOperationsInput | string | null
    subsystemIds?: DnfDocumentUpdatesubsystemIdsInput | string[]
    descriptionOfFailure?: StringFieldUpdateOperationsInput | string
    impactAssessment?: NullableStringFieldUpdateOperationsInput | string | null
    staffWhoIdentifiedFailure?: StringFieldUpdateOperationsInput | string
    dateTimeOfFailureOccurrence?: DateTimeFieldUpdateOperationsInput | Date | string
    methodOfFailureDetection?: StringFieldUpdateOperationsInput | string
    hazardLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    resolutionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    originatingInspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    originatingFindingId?: NullableStringFieldUpdateOperationsInput | string | null
    immediateAction?: NullableStringFieldUpdateOperationsInput | string | null
    problemResettable?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainServiceAffected?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainWithdrawn?: NullableBoolFieldUpdateOperationsInput | boolean | null
    systemRestoredTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disruptionDuration?: NullableFloatFieldUpdateOperationsInput | number | null
    trainKm?: NullableFloatFieldUpdateOperationsInput | number | null
    rectificationParty?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DnfDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    failureReportNo?: NullableStringFieldUpdateOperationsInput | string | null
    locationOfFailure?: StringFieldUpdateOperationsInput | string
    failedComponentEquipmentLRUTrainNumber?: NullableStringFieldUpdateOperationsInput | string | null
    subsystemIds?: DnfDocumentUpdatesubsystemIdsInput | string[]
    descriptionOfFailure?: StringFieldUpdateOperationsInput | string
    impactAssessment?: NullableStringFieldUpdateOperationsInput | string | null
    staffWhoIdentifiedFailure?: StringFieldUpdateOperationsInput | string
    dateTimeOfFailureOccurrence?: DateTimeFieldUpdateOperationsInput | Date | string
    methodOfFailureDetection?: StringFieldUpdateOperationsInput | string
    hazardLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    resolutionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    originatingInspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    originatingFindingId?: NullableStringFieldUpdateOperationsInput | string | null
    immediateAction?: NullableStringFieldUpdateOperationsInput | string | null
    problemResettable?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainServiceAffected?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainWithdrawn?: NullableBoolFieldUpdateOperationsInput | boolean | null
    systemRestoredTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disruptionDuration?: NullableFloatFieldUpdateOperationsInput | number | null
    trainKm?: NullableFloatFieldUpdateOperationsInput | number | null
    rectificationParty?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CorrectiveActionCreateInput = {
    id: string
    description: string
    responsiblePersonOrUnit: string
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status: string
    dateTimeNotified?: Date | string | null
    dateTimeArrival?: Date | string | null
    diagnosisTime?: number | null
    repairTime?: number | null
    verificationTime?: number | null
    totalDownTime?: number | null
    dnf: DnfDocumentCreateNestedOneWithoutCorrectiveActionsInput
  }

  export type CorrectiveActionUncheckedCreateInput = {
    id: string
    dnfId: string
    description: string
    responsiblePersonOrUnit: string
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status: string
    dateTimeNotified?: Date | string | null
    dateTimeArrival?: Date | string | null
    diagnosisTime?: number | null
    repairTime?: number | null
    verificationTime?: number | null
    totalDownTime?: number | null
  }

  export type CorrectiveActionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    responsiblePersonOrUnit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dateTimeNotified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateTimeArrival?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    diagnosisTime?: NullableFloatFieldUpdateOperationsInput | number | null
    repairTime?: NullableFloatFieldUpdateOperationsInput | number | null
    verificationTime?: NullableFloatFieldUpdateOperationsInput | number | null
    totalDownTime?: NullableFloatFieldUpdateOperationsInput | number | null
    dnf?: DnfDocumentUpdateOneRequiredWithoutCorrectiveActionsNestedInput
  }

  export type CorrectiveActionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dnfId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    responsiblePersonOrUnit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dateTimeNotified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateTimeArrival?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    diagnosisTime?: NullableFloatFieldUpdateOperationsInput | number | null
    repairTime?: NullableFloatFieldUpdateOperationsInput | number | null
    verificationTime?: NullableFloatFieldUpdateOperationsInput | number | null
    totalDownTime?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type CorrectiveActionCreateManyInput = {
    id: string
    dnfId: string
    description: string
    responsiblePersonOrUnit: string
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status: string
    dateTimeNotified?: Date | string | null
    dateTimeArrival?: Date | string | null
    diagnosisTime?: number | null
    repairTime?: number | null
    verificationTime?: number | null
    totalDownTime?: number | null
  }

  export type CorrectiveActionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    responsiblePersonOrUnit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dateTimeNotified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateTimeArrival?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    diagnosisTime?: NullableFloatFieldUpdateOperationsInput | number | null
    repairTime?: NullableFloatFieldUpdateOperationsInput | number | null
    verificationTime?: NullableFloatFieldUpdateOperationsInput | number | null
    totalDownTime?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type CorrectiveActionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dnfId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    responsiblePersonOrUnit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dateTimeNotified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateTimeArrival?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    diagnosisTime?: NullableFloatFieldUpdateOperationsInput | number | null
    repairTime?: NullableFloatFieldUpdateOperationsInput | number | null
    verificationTime?: NullableFloatFieldUpdateOperationsInput | number | null
    totalDownTime?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type HazardRecordCreateInput = {
    id: string
    description: string
    systemGroup?: string | null
    locationIds?: HazardRecordCreatelocationIdsInput | string[]
    source?: string | null
    potentialConsequence?: string | null
    identifiedBy: string
    identificationDate: Date | string
    severityId?: string | null
    likelihoodId?: string | null
    riskLevelId?: string | null
    currentControls: string
    proposedActions?: string | null
    suggestedActions?: string | null
    responsiblePersonOrUnit?: string | null
    coordinatingUnits?: HazardRecordCreatecoordinatingUnitsInput | string[]
    dueDate?: Date | string | null
    status: string
    closureDetails?: string | null
    verificationDetails?: string | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
    linkedDnfId?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isArchived?: boolean
    deletedAt?: Date | string | null
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
  }

  export type HazardRecordUncheckedCreateInput = {
    id: string
    description: string
    systemGroup?: string | null
    locationIds?: HazardRecordCreatelocationIdsInput | string[]
    source?: string | null
    potentialConsequence?: string | null
    identifiedBy: string
    identificationDate: Date | string
    severityId?: string | null
    likelihoodId?: string | null
    riskLevelId?: string | null
    currentControls: string
    proposedActions?: string | null
    suggestedActions?: string | null
    responsiblePersonOrUnit?: string | null
    coordinatingUnits?: HazardRecordCreatecoordinatingUnitsInput | string[]
    dueDate?: Date | string | null
    status: string
    closureDetails?: string | null
    verificationDetails?: string | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
    linkedDnfId?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isArchived?: boolean
    deletedAt?: Date | string | null
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
  }

  export type HazardRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    systemGroup?: NullableStringFieldUpdateOperationsInput | string | null
    locationIds?: HazardRecordUpdatelocationIdsInput | string[]
    source?: NullableStringFieldUpdateOperationsInput | string | null
    potentialConsequence?: NullableStringFieldUpdateOperationsInput | string | null
    identifiedBy?: StringFieldUpdateOperationsInput | string
    identificationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    severityId?: NullableStringFieldUpdateOperationsInput | string | null
    likelihoodId?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    currentControls?: StringFieldUpdateOperationsInput | string
    proposedActions?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedActions?: NullableStringFieldUpdateOperationsInput | string | null
    responsiblePersonOrUnit?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatingUnits?: HazardRecordUpdatecoordinatingUnitsInput | string[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    closureDetails?: NullableStringFieldUpdateOperationsInput | string | null
    verificationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
    linkedDnfId?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
  }

  export type HazardRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    systemGroup?: NullableStringFieldUpdateOperationsInput | string | null
    locationIds?: HazardRecordUpdatelocationIdsInput | string[]
    source?: NullableStringFieldUpdateOperationsInput | string | null
    potentialConsequence?: NullableStringFieldUpdateOperationsInput | string | null
    identifiedBy?: StringFieldUpdateOperationsInput | string
    identificationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    severityId?: NullableStringFieldUpdateOperationsInput | string | null
    likelihoodId?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    currentControls?: StringFieldUpdateOperationsInput | string
    proposedActions?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedActions?: NullableStringFieldUpdateOperationsInput | string | null
    responsiblePersonOrUnit?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatingUnits?: HazardRecordUpdatecoordinatingUnitsInput | string[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    closureDetails?: NullableStringFieldUpdateOperationsInput | string | null
    verificationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
    linkedDnfId?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
  }

  export type HazardRecordCreateManyInput = {
    id: string
    description: string
    systemGroup?: string | null
    locationIds?: HazardRecordCreatelocationIdsInput | string[]
    source?: string | null
    potentialConsequence?: string | null
    identifiedBy: string
    identificationDate: Date | string
    severityId?: string | null
    likelihoodId?: string | null
    riskLevelId?: string | null
    currentControls: string
    proposedActions?: string | null
    suggestedActions?: string | null
    responsiblePersonOrUnit?: string | null
    coordinatingUnits?: HazardRecordCreatecoordinatingUnitsInput | string[]
    dueDate?: Date | string | null
    status: string
    closureDetails?: string | null
    verificationDetails?: string | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
    linkedDnfId?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isArchived?: boolean
    deletedAt?: Date | string | null
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
  }

  export type HazardRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    systemGroup?: NullableStringFieldUpdateOperationsInput | string | null
    locationIds?: HazardRecordUpdatelocationIdsInput | string[]
    source?: NullableStringFieldUpdateOperationsInput | string | null
    potentialConsequence?: NullableStringFieldUpdateOperationsInput | string | null
    identifiedBy?: StringFieldUpdateOperationsInput | string
    identificationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    severityId?: NullableStringFieldUpdateOperationsInput | string | null
    likelihoodId?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    currentControls?: StringFieldUpdateOperationsInput | string
    proposedActions?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedActions?: NullableStringFieldUpdateOperationsInput | string | null
    responsiblePersonOrUnit?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatingUnits?: HazardRecordUpdatecoordinatingUnitsInput | string[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    closureDetails?: NullableStringFieldUpdateOperationsInput | string | null
    verificationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
    linkedDnfId?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
  }

  export type HazardRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    systemGroup?: NullableStringFieldUpdateOperationsInput | string | null
    locationIds?: HazardRecordUpdatelocationIdsInput | string[]
    source?: NullableStringFieldUpdateOperationsInput | string | null
    potentialConsequence?: NullableStringFieldUpdateOperationsInput | string | null
    identifiedBy?: StringFieldUpdateOperationsInput | string
    identificationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    severityId?: NullableStringFieldUpdateOperationsInput | string | null
    likelihoodId?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    currentControls?: StringFieldUpdateOperationsInput | string
    proposedActions?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedActions?: NullableStringFieldUpdateOperationsInput | string | null
    responsiblePersonOrUnit?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatingUnits?: HazardRecordUpdatecoordinatingUnitsInput | string[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    closureDetails?: NullableStringFieldUpdateOperationsInput | string | null
    verificationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
    linkedDnfId?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ImprovementCreateInput = {
    id: string
    title: string
    description: string
    category: string
    status: string
    submittedBy: string
    createdById: string
    submissionDate?: Date | string
    updatedAt?: Date | string
    benefitAnalysis?: string | null
    estimatedCost?: number | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ImprovementUncheckedCreateInput = {
    id: string
    title: string
    description: string
    category: string
    status: string
    submittedBy: string
    createdById: string
    submissionDate?: Date | string
    updatedAt?: Date | string
    benefitAnalysis?: string | null
    estimatedCost?: number | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ImprovementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    submittedBy?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    submissionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    benefitAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ImprovementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    submittedBy?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    submissionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    benefitAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ImprovementCreateManyInput = {
    id: string
    title: string
    description: string
    category: string
    status: string
    submittedBy: string
    createdById: string
    submissionDate?: Date | string
    updatedAt?: Date | string
    benefitAnalysis?: string | null
    estimatedCost?: number | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ImprovementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    submittedBy?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    submissionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    benefitAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ImprovementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    submittedBy?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    submissionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    benefitAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null
    attachments?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SystemStateCreateInput = {
    id?: number
    lastSchedulerRun?: Date | string | null
    aiModelConfig?: string | null
  }

  export type SystemStateUncheckedCreateInput = {
    id?: number
    lastSchedulerRun?: Date | string | null
    aiModelConfig?: string | null
  }

  export type SystemStateUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    lastSchedulerRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiModelConfig?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SystemStateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    lastSchedulerRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiModelConfig?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SystemStateCreateManyInput = {
    id?: number
    lastSchedulerRun?: Date | string | null
    aiModelConfig?: string | null
  }

  export type SystemStateUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    lastSchedulerRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiModelConfig?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SystemStateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    lastSchedulerRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiModelConfig?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SystemLogCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    action?: SortOrder
    level?: SortOrder
    details?: SortOrder
    category?: SortOrder
    deletedAt?: SortOrder
  }

  export type SystemLogMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    action?: SortOrder
    level?: SortOrder
    details?: SortOrder
    category?: SortOrder
    deletedAt?: SortOrder
  }

  export type SystemLogMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    action?: SortOrder
    level?: SortOrder
    details?: SortOrder
    category?: SortOrder
    deletedAt?: SortOrder
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

  export type ResponsibleUnitCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type ResponsibleUnitMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type ResponsibleUnitMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
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

  export type SubsystemCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
  }

  export type SubsystemMaxOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SubsystemMinOrderByAggregateInput = {
    id?: SortOrder
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

  export type PatrolLocationCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
  }

  export type PatrolLocationMaxOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
  }

  export type PatrolLocationMinOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    entityId?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    timestamp?: SortOrder
    content?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    entityId?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    timestamp?: SortOrder
    content?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    entityId?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    timestamp?: SortOrder
    content?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    message?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    isRead?: SortOrder
    link?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    message?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    isRead?: SortOrder
    link?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    message?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    isRead?: SortOrder
    link?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type MaintenanceStandardCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    name_en?: SortOrder
    description?: SortOrder
    frequency?: SortOrder
    scheduledTime?: SortOrder
    locationIds?: SortOrder
    recipientId?: SortOrder
    abbreviation?: SortOrder
    estimatedDurationHours?: SortOrder
    deletedAt?: SortOrder
  }

  export type MaintenanceStandardAvgOrderByAggregateInput = {
    estimatedDurationHours?: SortOrder
  }

  export type MaintenanceStandardMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    name_en?: SortOrder
    description?: SortOrder
    frequency?: SortOrder
    scheduledTime?: SortOrder
    recipientId?: SortOrder
    abbreviation?: SortOrder
    estimatedDurationHours?: SortOrder
    deletedAt?: SortOrder
  }

  export type MaintenanceStandardMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    name_en?: SortOrder
    description?: SortOrder
    frequency?: SortOrder
    scheduledTime?: SortOrder
    recipientId?: SortOrder
    abbreviation?: SortOrder
    estimatedDurationHours?: SortOrder
    deletedAt?: SortOrder
  }

  export type MaintenanceStandardSumOrderByAggregateInput = {
    estimatedDurationHours?: SortOrder
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

  export type MaintenanceStandardItemCountOrderByAggregateInput = {
    id?: SortOrder
    standardId?: SortOrder
    itemCode?: SortOrder
    itemText?: SortOrder
    criteria?: SortOrder
    unit?: SortOrder
    standardQuantity?: SortOrder
    toleranceOperator?: SortOrder
    toleranceValue?: SortOrder
    requiredTools?: SortOrder
  }

  export type MaintenanceStandardItemAvgOrderByAggregateInput = {
    standardQuantity?: SortOrder
    toleranceValue?: SortOrder
  }

  export type MaintenanceStandardItemMaxOrderByAggregateInput = {
    id?: SortOrder
    standardId?: SortOrder
    itemCode?: SortOrder
    itemText?: SortOrder
    criteria?: SortOrder
    unit?: SortOrder
    standardQuantity?: SortOrder
    toleranceOperator?: SortOrder
    toleranceValue?: SortOrder
    requiredTools?: SortOrder
  }

  export type MaintenanceStandardItemMinOrderByAggregateInput = {
    id?: SortOrder
    standardId?: SortOrder
    itemCode?: SortOrder
    itemText?: SortOrder
    criteria?: SortOrder
    unit?: SortOrder
    standardQuantity?: SortOrder
    toleranceOperator?: SortOrder
    toleranceValue?: SortOrder
    requiredTools?: SortOrder
  }

  export type MaintenanceStandardItemSumOrderByAggregateInput = {
    standardQuantity?: SortOrder
    toleranceValue?: SortOrder
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

  export type InspectionDetailCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    areaIds?: SortOrder
    inspector?: SortOrder
    date?: SortOrder
    status?: SortOrder
    checklistTemplateId?: SortOrder
    checklistItems?: SortOrder
    generalNotes?: SortOrder
    approvalComments?: SortOrder
    lastStatusUpdateBy?: SortOrder
    lastStatusUpdateAt?: SortOrder
    scheduledStartDate?: SortOrder
    scheduledFinishDate?: SortOrder
    estimatedDurationHours?: SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrder
  }

  export type InspectionDetailAvgOrderByAggregateInput = {
    estimatedDurationHours?: SortOrder
  }

  export type InspectionDetailMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    inspector?: SortOrder
    date?: SortOrder
    status?: SortOrder
    checklistTemplateId?: SortOrder
    generalNotes?: SortOrder
    approvalComments?: SortOrder
    lastStatusUpdateBy?: SortOrder
    lastStatusUpdateAt?: SortOrder
    scheduledStartDate?: SortOrder
    scheduledFinishDate?: SortOrder
    estimatedDurationHours?: SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrder
  }

  export type InspectionDetailMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    inspector?: SortOrder
    date?: SortOrder
    status?: SortOrder
    checklistTemplateId?: SortOrder
    generalNotes?: SortOrder
    approvalComments?: SortOrder
    lastStatusUpdateBy?: SortOrder
    lastStatusUpdateAt?: SortOrder
    scheduledStartDate?: SortOrder
    scheduledFinishDate?: SortOrder
    estimatedDurationHours?: SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrder
  }

  export type InspectionDetailSumOrderByAggregateInput = {
    estimatedDurationHours?: SortOrder
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

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type CorrectiveActionListRelationFilter = {
    every?: CorrectiveActionWhereInput
    some?: CorrectiveActionWhereInput
    none?: CorrectiveActionWhereInput
  }

  export type CorrectiveActionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DnfDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    failureReportNo?: SortOrder
    locationOfFailure?: SortOrder
    failedComponentEquipmentLRUTrainNumber?: SortOrder
    subsystemIds?: SortOrder
    descriptionOfFailure?: SortOrder
    impactAssessment?: SortOrder
    staffWhoIdentifiedFailure?: SortOrder
    dateTimeOfFailureOccurrence?: SortOrder
    methodOfFailureDetection?: SortOrder
    hazardLevelId?: SortOrder
    status?: SortOrder
    attachments?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    statusHistory?: SortOrder
    isArchived?: SortOrder
    resolutionDetails?: SortOrder
    assignedTo?: SortOrder
    priority?: SortOrder
    completedDate?: SortOrder
    originatingInspectionId?: SortOrder
    originatingFindingId?: SortOrder
    immediateAction?: SortOrder
    problemResettable?: SortOrder
    trainServiceAffected?: SortOrder
    trainWithdrawn?: SortOrder
    systemRestoredTime?: SortOrder
    disruptionDuration?: SortOrder
    trainKm?: SortOrder
    rectificationParty?: SortOrder
    deletedAt?: SortOrder
  }

  export type DnfDocumentAvgOrderByAggregateInput = {
    disruptionDuration?: SortOrder
    trainKm?: SortOrder
  }

  export type DnfDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    failureReportNo?: SortOrder
    locationOfFailure?: SortOrder
    failedComponentEquipmentLRUTrainNumber?: SortOrder
    descriptionOfFailure?: SortOrder
    impactAssessment?: SortOrder
    staffWhoIdentifiedFailure?: SortOrder
    dateTimeOfFailureOccurrence?: SortOrder
    methodOfFailureDetection?: SortOrder
    hazardLevelId?: SortOrder
    status?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isArchived?: SortOrder
    resolutionDetails?: SortOrder
    assignedTo?: SortOrder
    priority?: SortOrder
    completedDate?: SortOrder
    originatingInspectionId?: SortOrder
    originatingFindingId?: SortOrder
    immediateAction?: SortOrder
    problemResettable?: SortOrder
    trainServiceAffected?: SortOrder
    trainWithdrawn?: SortOrder
    systemRestoredTime?: SortOrder
    disruptionDuration?: SortOrder
    trainKm?: SortOrder
    rectificationParty?: SortOrder
    deletedAt?: SortOrder
  }

  export type DnfDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    failureReportNo?: SortOrder
    locationOfFailure?: SortOrder
    failedComponentEquipmentLRUTrainNumber?: SortOrder
    descriptionOfFailure?: SortOrder
    impactAssessment?: SortOrder
    staffWhoIdentifiedFailure?: SortOrder
    dateTimeOfFailureOccurrence?: SortOrder
    methodOfFailureDetection?: SortOrder
    hazardLevelId?: SortOrder
    status?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isArchived?: SortOrder
    resolutionDetails?: SortOrder
    assignedTo?: SortOrder
    priority?: SortOrder
    completedDate?: SortOrder
    originatingInspectionId?: SortOrder
    originatingFindingId?: SortOrder
    immediateAction?: SortOrder
    problemResettable?: SortOrder
    trainServiceAffected?: SortOrder
    trainWithdrawn?: SortOrder
    systemRestoredTime?: SortOrder
    disruptionDuration?: SortOrder
    trainKm?: SortOrder
    rectificationParty?: SortOrder
    deletedAt?: SortOrder
  }

  export type DnfDocumentSumOrderByAggregateInput = {
    disruptionDuration?: SortOrder
    trainKm?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DnfDocumentRelationFilter = {
    is?: DnfDocumentWhereInput
    isNot?: DnfDocumentWhereInput
  }

  export type CorrectiveActionCountOrderByAggregateInput = {
    id?: SortOrder
    dnfId?: SortOrder
    description?: SortOrder
    responsiblePersonOrUnit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    dateTimeNotified?: SortOrder
    dateTimeArrival?: SortOrder
    diagnosisTime?: SortOrder
    repairTime?: SortOrder
    verificationTime?: SortOrder
    totalDownTime?: SortOrder
  }

  export type CorrectiveActionAvgOrderByAggregateInput = {
    diagnosisTime?: SortOrder
    repairTime?: SortOrder
    verificationTime?: SortOrder
    totalDownTime?: SortOrder
  }

  export type CorrectiveActionMaxOrderByAggregateInput = {
    id?: SortOrder
    dnfId?: SortOrder
    description?: SortOrder
    responsiblePersonOrUnit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    dateTimeNotified?: SortOrder
    dateTimeArrival?: SortOrder
    diagnosisTime?: SortOrder
    repairTime?: SortOrder
    verificationTime?: SortOrder
    totalDownTime?: SortOrder
  }

  export type CorrectiveActionMinOrderByAggregateInput = {
    id?: SortOrder
    dnfId?: SortOrder
    description?: SortOrder
    responsiblePersonOrUnit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    dateTimeNotified?: SortOrder
    dateTimeArrival?: SortOrder
    diagnosisTime?: SortOrder
    repairTime?: SortOrder
    verificationTime?: SortOrder
    totalDownTime?: SortOrder
  }

  export type CorrectiveActionSumOrderByAggregateInput = {
    diagnosisTime?: SortOrder
    repairTime?: SortOrder
    verificationTime?: SortOrder
    totalDownTime?: SortOrder
  }

  export type HazardRecordCountOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    systemGroup?: SortOrder
    locationIds?: SortOrder
    source?: SortOrder
    potentialConsequence?: SortOrder
    identifiedBy?: SortOrder
    identificationDate?: SortOrder
    severityId?: SortOrder
    likelihoodId?: SortOrder
    riskLevelId?: SortOrder
    currentControls?: SortOrder
    proposedActions?: SortOrder
    suggestedActions?: SortOrder
    responsiblePersonOrUnit?: SortOrder
    coordinatingUnits?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    closureDetails?: SortOrder
    verificationDetails?: SortOrder
    attachments?: SortOrder
    linkedDnfId?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrder
    statusHistory?: SortOrder
  }

  export type HazardRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    systemGroup?: SortOrder
    source?: SortOrder
    potentialConsequence?: SortOrder
    identifiedBy?: SortOrder
    identificationDate?: SortOrder
    severityId?: SortOrder
    likelihoodId?: SortOrder
    riskLevelId?: SortOrder
    currentControls?: SortOrder
    proposedActions?: SortOrder
    suggestedActions?: SortOrder
    responsiblePersonOrUnit?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    closureDetails?: SortOrder
    verificationDetails?: SortOrder
    linkedDnfId?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrder
  }

  export type HazardRecordMinOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    systemGroup?: SortOrder
    source?: SortOrder
    potentialConsequence?: SortOrder
    identifiedBy?: SortOrder
    identificationDate?: SortOrder
    severityId?: SortOrder
    likelihoodId?: SortOrder
    riskLevelId?: SortOrder
    currentControls?: SortOrder
    proposedActions?: SortOrder
    suggestedActions?: SortOrder
    responsiblePersonOrUnit?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    closureDetails?: SortOrder
    verificationDetails?: SortOrder
    linkedDnfId?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isArchived?: SortOrder
    deletedAt?: SortOrder
  }

  export type ImprovementCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    createdById?: SortOrder
    submissionDate?: SortOrder
    updatedAt?: SortOrder
    benefitAnalysis?: SortOrder
    estimatedCost?: SortOrder
    attachments?: SortOrder
  }

  export type ImprovementAvgOrderByAggregateInput = {
    estimatedCost?: SortOrder
  }

  export type ImprovementMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    createdById?: SortOrder
    submissionDate?: SortOrder
    updatedAt?: SortOrder
    benefitAnalysis?: SortOrder
    estimatedCost?: SortOrder
  }

  export type ImprovementMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    createdById?: SortOrder
    submissionDate?: SortOrder
    updatedAt?: SortOrder
    benefitAnalysis?: SortOrder
    estimatedCost?: SortOrder
  }

  export type ImprovementSumOrderByAggregateInput = {
    estimatedCost?: SortOrder
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

  export type SystemStateCountOrderByAggregateInput = {
    id?: SortOrder
    lastSchedulerRun?: SortOrder
    aiModelConfig?: SortOrder
  }

  export type SystemStateAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SystemStateMaxOrderByAggregateInput = {
    id?: SortOrder
    lastSchedulerRun?: SortOrder
    aiModelConfig?: SortOrder
  }

  export type SystemStateMinOrderByAggregateInput = {
    id?: SortOrder
    lastSchedulerRun?: SortOrder
    aiModelConfig?: SortOrder
  }

  export type SystemStateSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type MaintenanceStandardCreatelocationIdsInput = {
    set: string[]
  }

  export type MaintenanceStandardUpdatelocationIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InspectionDetailCreateareaIdsInput = {
    set: string[]
  }

  export type InspectionDetailUpdateareaIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DnfDocumentCreatesubsystemIdsInput = {
    set: string[]
  }

  export type CorrectiveActionCreateNestedManyWithoutDnfInput = {
    create?: XOR<CorrectiveActionCreateWithoutDnfInput, CorrectiveActionUncheckedCreateWithoutDnfInput> | CorrectiveActionCreateWithoutDnfInput[] | CorrectiveActionUncheckedCreateWithoutDnfInput[]
    connectOrCreate?: CorrectiveActionCreateOrConnectWithoutDnfInput | CorrectiveActionCreateOrConnectWithoutDnfInput[]
    createMany?: CorrectiveActionCreateManyDnfInputEnvelope
    connect?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
  }

  export type CorrectiveActionUncheckedCreateNestedManyWithoutDnfInput = {
    create?: XOR<CorrectiveActionCreateWithoutDnfInput, CorrectiveActionUncheckedCreateWithoutDnfInput> | CorrectiveActionCreateWithoutDnfInput[] | CorrectiveActionUncheckedCreateWithoutDnfInput[]
    connectOrCreate?: CorrectiveActionCreateOrConnectWithoutDnfInput | CorrectiveActionCreateOrConnectWithoutDnfInput[]
    createMany?: CorrectiveActionCreateManyDnfInputEnvelope
    connect?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
  }

  export type DnfDocumentUpdatesubsystemIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type CorrectiveActionUpdateManyWithoutDnfNestedInput = {
    create?: XOR<CorrectiveActionCreateWithoutDnfInput, CorrectiveActionUncheckedCreateWithoutDnfInput> | CorrectiveActionCreateWithoutDnfInput[] | CorrectiveActionUncheckedCreateWithoutDnfInput[]
    connectOrCreate?: CorrectiveActionCreateOrConnectWithoutDnfInput | CorrectiveActionCreateOrConnectWithoutDnfInput[]
    upsert?: CorrectiveActionUpsertWithWhereUniqueWithoutDnfInput | CorrectiveActionUpsertWithWhereUniqueWithoutDnfInput[]
    createMany?: CorrectiveActionCreateManyDnfInputEnvelope
    set?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
    disconnect?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
    delete?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
    connect?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
    update?: CorrectiveActionUpdateWithWhereUniqueWithoutDnfInput | CorrectiveActionUpdateWithWhereUniqueWithoutDnfInput[]
    updateMany?: CorrectiveActionUpdateManyWithWhereWithoutDnfInput | CorrectiveActionUpdateManyWithWhereWithoutDnfInput[]
    deleteMany?: CorrectiveActionScalarWhereInput | CorrectiveActionScalarWhereInput[]
  }

  export type CorrectiveActionUncheckedUpdateManyWithoutDnfNestedInput = {
    create?: XOR<CorrectiveActionCreateWithoutDnfInput, CorrectiveActionUncheckedCreateWithoutDnfInput> | CorrectiveActionCreateWithoutDnfInput[] | CorrectiveActionUncheckedCreateWithoutDnfInput[]
    connectOrCreate?: CorrectiveActionCreateOrConnectWithoutDnfInput | CorrectiveActionCreateOrConnectWithoutDnfInput[]
    upsert?: CorrectiveActionUpsertWithWhereUniqueWithoutDnfInput | CorrectiveActionUpsertWithWhereUniqueWithoutDnfInput[]
    createMany?: CorrectiveActionCreateManyDnfInputEnvelope
    set?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
    disconnect?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
    delete?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
    connect?: CorrectiveActionWhereUniqueInput | CorrectiveActionWhereUniqueInput[]
    update?: CorrectiveActionUpdateWithWhereUniqueWithoutDnfInput | CorrectiveActionUpdateWithWhereUniqueWithoutDnfInput[]
    updateMany?: CorrectiveActionUpdateManyWithWhereWithoutDnfInput | CorrectiveActionUpdateManyWithWhereWithoutDnfInput[]
    deleteMany?: CorrectiveActionScalarWhereInput | CorrectiveActionScalarWhereInput[]
  }

  export type DnfDocumentCreateNestedOneWithoutCorrectiveActionsInput = {
    create?: XOR<DnfDocumentCreateWithoutCorrectiveActionsInput, DnfDocumentUncheckedCreateWithoutCorrectiveActionsInput>
    connectOrCreate?: DnfDocumentCreateOrConnectWithoutCorrectiveActionsInput
    connect?: DnfDocumentWhereUniqueInput
  }

  export type DnfDocumentUpdateOneRequiredWithoutCorrectiveActionsNestedInput = {
    create?: XOR<DnfDocumentCreateWithoutCorrectiveActionsInput, DnfDocumentUncheckedCreateWithoutCorrectiveActionsInput>
    connectOrCreate?: DnfDocumentCreateOrConnectWithoutCorrectiveActionsInput
    upsert?: DnfDocumentUpsertWithoutCorrectiveActionsInput
    connect?: DnfDocumentWhereUniqueInput
    update?: XOR<XOR<DnfDocumentUpdateToOneWithWhereWithoutCorrectiveActionsInput, DnfDocumentUpdateWithoutCorrectiveActionsInput>, DnfDocumentUncheckedUpdateWithoutCorrectiveActionsInput>
  }

  export type HazardRecordCreatelocationIdsInput = {
    set: string[]
  }

  export type HazardRecordCreatecoordinatingUnitsInput = {
    set: string[]
  }

  export type HazardRecordUpdatelocationIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type HazardRecordUpdatecoordinatingUnitsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
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

  export type CorrectiveActionCreateWithoutDnfInput = {
    id: string
    description: string
    responsiblePersonOrUnit: string
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status: string
    dateTimeNotified?: Date | string | null
    dateTimeArrival?: Date | string | null
    diagnosisTime?: number | null
    repairTime?: number | null
    verificationTime?: number | null
    totalDownTime?: number | null
  }

  export type CorrectiveActionUncheckedCreateWithoutDnfInput = {
    id: string
    description: string
    responsiblePersonOrUnit: string
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status: string
    dateTimeNotified?: Date | string | null
    dateTimeArrival?: Date | string | null
    diagnosisTime?: number | null
    repairTime?: number | null
    verificationTime?: number | null
    totalDownTime?: number | null
  }

  export type CorrectiveActionCreateOrConnectWithoutDnfInput = {
    where: CorrectiveActionWhereUniqueInput
    create: XOR<CorrectiveActionCreateWithoutDnfInput, CorrectiveActionUncheckedCreateWithoutDnfInput>
  }

  export type CorrectiveActionCreateManyDnfInputEnvelope = {
    data: CorrectiveActionCreateManyDnfInput | CorrectiveActionCreateManyDnfInput[]
    skipDuplicates?: boolean
  }

  export type CorrectiveActionUpsertWithWhereUniqueWithoutDnfInput = {
    where: CorrectiveActionWhereUniqueInput
    update: XOR<CorrectiveActionUpdateWithoutDnfInput, CorrectiveActionUncheckedUpdateWithoutDnfInput>
    create: XOR<CorrectiveActionCreateWithoutDnfInput, CorrectiveActionUncheckedCreateWithoutDnfInput>
  }

  export type CorrectiveActionUpdateWithWhereUniqueWithoutDnfInput = {
    where: CorrectiveActionWhereUniqueInput
    data: XOR<CorrectiveActionUpdateWithoutDnfInput, CorrectiveActionUncheckedUpdateWithoutDnfInput>
  }

  export type CorrectiveActionUpdateManyWithWhereWithoutDnfInput = {
    where: CorrectiveActionScalarWhereInput
    data: XOR<CorrectiveActionUpdateManyMutationInput, CorrectiveActionUncheckedUpdateManyWithoutDnfInput>
  }

  export type CorrectiveActionScalarWhereInput = {
    AND?: CorrectiveActionScalarWhereInput | CorrectiveActionScalarWhereInput[]
    OR?: CorrectiveActionScalarWhereInput[]
    NOT?: CorrectiveActionScalarWhereInput | CorrectiveActionScalarWhereInput[]
    id?: StringFilter<"CorrectiveAction"> | string
    dnfId?: StringFilter<"CorrectiveAction"> | string
    description?: StringFilter<"CorrectiveAction"> | string
    responsiblePersonOrUnit?: StringFilter<"CorrectiveAction"> | string
    createdAt?: DateTimeFilter<"CorrectiveAction"> | Date | string
    updatedAt?: DateTimeFilter<"CorrectiveAction"> | Date | string
    completedAt?: DateTimeNullableFilter<"CorrectiveAction"> | Date | string | null
    status?: StringFilter<"CorrectiveAction"> | string
    dateTimeNotified?: DateTimeNullableFilter<"CorrectiveAction"> | Date | string | null
    dateTimeArrival?: DateTimeNullableFilter<"CorrectiveAction"> | Date | string | null
    diagnosisTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    repairTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    verificationTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
    totalDownTime?: FloatNullableFilter<"CorrectiveAction"> | number | null
  }

  export type DnfDocumentCreateWithoutCorrectiveActionsInput = {
    id: string
    failureReportNo?: string | null
    locationOfFailure: string
    failedComponentEquipmentLRUTrainNumber?: string | null
    subsystemIds?: DnfDocumentCreatesubsystemIdsInput | string[]
    descriptionOfFailure: string
    impactAssessment?: string | null
    staffWhoIdentifiedFailure: string
    dateTimeOfFailureOccurrence: Date | string
    methodOfFailureDetection: string
    hazardLevelId?: string | null
    status: string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: boolean
    resolutionDetails?: string | null
    assignedTo?: string | null
    priority?: string | null
    completedDate?: Date | string | null
    originatingInspectionId?: string | null
    originatingFindingId?: string | null
    immediateAction?: string | null
    problemResettable?: boolean | null
    trainServiceAffected?: boolean | null
    trainWithdrawn?: boolean | null
    systemRestoredTime?: Date | string | null
    disruptionDuration?: number | null
    trainKm?: number | null
    rectificationParty?: string | null
    deletedAt?: Date | string | null
  }

  export type DnfDocumentUncheckedCreateWithoutCorrectiveActionsInput = {
    id: string
    failureReportNo?: string | null
    locationOfFailure: string
    failedComponentEquipmentLRUTrainNumber?: string | null
    subsystemIds?: DnfDocumentCreatesubsystemIdsInput | string[]
    descriptionOfFailure: string
    impactAssessment?: string | null
    staffWhoIdentifiedFailure: string
    dateTimeOfFailureOccurrence: Date | string
    methodOfFailureDetection: string
    hazardLevelId?: string | null
    status: string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: boolean
    resolutionDetails?: string | null
    assignedTo?: string | null
    priority?: string | null
    completedDate?: Date | string | null
    originatingInspectionId?: string | null
    originatingFindingId?: string | null
    immediateAction?: string | null
    problemResettable?: boolean | null
    trainServiceAffected?: boolean | null
    trainWithdrawn?: boolean | null
    systemRestoredTime?: Date | string | null
    disruptionDuration?: number | null
    trainKm?: number | null
    rectificationParty?: string | null
    deletedAt?: Date | string | null
  }

  export type DnfDocumentCreateOrConnectWithoutCorrectiveActionsInput = {
    where: DnfDocumentWhereUniqueInput
    create: XOR<DnfDocumentCreateWithoutCorrectiveActionsInput, DnfDocumentUncheckedCreateWithoutCorrectiveActionsInput>
  }

  export type DnfDocumentUpsertWithoutCorrectiveActionsInput = {
    update: XOR<DnfDocumentUpdateWithoutCorrectiveActionsInput, DnfDocumentUncheckedUpdateWithoutCorrectiveActionsInput>
    create: XOR<DnfDocumentCreateWithoutCorrectiveActionsInput, DnfDocumentUncheckedCreateWithoutCorrectiveActionsInput>
    where?: DnfDocumentWhereInput
  }

  export type DnfDocumentUpdateToOneWithWhereWithoutCorrectiveActionsInput = {
    where?: DnfDocumentWhereInput
    data: XOR<DnfDocumentUpdateWithoutCorrectiveActionsInput, DnfDocumentUncheckedUpdateWithoutCorrectiveActionsInput>
  }

  export type DnfDocumentUpdateWithoutCorrectiveActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    failureReportNo?: NullableStringFieldUpdateOperationsInput | string | null
    locationOfFailure?: StringFieldUpdateOperationsInput | string
    failedComponentEquipmentLRUTrainNumber?: NullableStringFieldUpdateOperationsInput | string | null
    subsystemIds?: DnfDocumentUpdatesubsystemIdsInput | string[]
    descriptionOfFailure?: StringFieldUpdateOperationsInput | string
    impactAssessment?: NullableStringFieldUpdateOperationsInput | string | null
    staffWhoIdentifiedFailure?: StringFieldUpdateOperationsInput | string
    dateTimeOfFailureOccurrence?: DateTimeFieldUpdateOperationsInput | Date | string
    methodOfFailureDetection?: StringFieldUpdateOperationsInput | string
    hazardLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    resolutionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    originatingInspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    originatingFindingId?: NullableStringFieldUpdateOperationsInput | string | null
    immediateAction?: NullableStringFieldUpdateOperationsInput | string | null
    problemResettable?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainServiceAffected?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainWithdrawn?: NullableBoolFieldUpdateOperationsInput | boolean | null
    systemRestoredTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disruptionDuration?: NullableFloatFieldUpdateOperationsInput | number | null
    trainKm?: NullableFloatFieldUpdateOperationsInput | number | null
    rectificationParty?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DnfDocumentUncheckedUpdateWithoutCorrectiveActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    failureReportNo?: NullableStringFieldUpdateOperationsInput | string | null
    locationOfFailure?: StringFieldUpdateOperationsInput | string
    failedComponentEquipmentLRUTrainNumber?: NullableStringFieldUpdateOperationsInput | string | null
    subsystemIds?: DnfDocumentUpdatesubsystemIdsInput | string[]
    descriptionOfFailure?: StringFieldUpdateOperationsInput | string
    impactAssessment?: NullableStringFieldUpdateOperationsInput | string | null
    staffWhoIdentifiedFailure?: StringFieldUpdateOperationsInput | string
    dateTimeOfFailureOccurrence?: DateTimeFieldUpdateOperationsInput | Date | string
    methodOfFailureDetection?: StringFieldUpdateOperationsInput | string
    hazardLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistory?: NullableJsonNullValueInput | InputJsonValue
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    resolutionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    originatingInspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    originatingFindingId?: NullableStringFieldUpdateOperationsInput | string | null
    immediateAction?: NullableStringFieldUpdateOperationsInput | string | null
    problemResettable?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainServiceAffected?: NullableBoolFieldUpdateOperationsInput | boolean | null
    trainWithdrawn?: NullableBoolFieldUpdateOperationsInput | boolean | null
    systemRestoredTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disruptionDuration?: NullableFloatFieldUpdateOperationsInput | number | null
    trainKm?: NullableFloatFieldUpdateOperationsInput | number | null
    rectificationParty?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CorrectiveActionCreateManyDnfInput = {
    id: string
    description: string
    responsiblePersonOrUnit: string
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status: string
    dateTimeNotified?: Date | string | null
    dateTimeArrival?: Date | string | null
    diagnosisTime?: number | null
    repairTime?: number | null
    verificationTime?: number | null
    totalDownTime?: number | null
  }

  export type CorrectiveActionUpdateWithoutDnfInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    responsiblePersonOrUnit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dateTimeNotified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateTimeArrival?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    diagnosisTime?: NullableFloatFieldUpdateOperationsInput | number | null
    repairTime?: NullableFloatFieldUpdateOperationsInput | number | null
    verificationTime?: NullableFloatFieldUpdateOperationsInput | number | null
    totalDownTime?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type CorrectiveActionUncheckedUpdateWithoutDnfInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    responsiblePersonOrUnit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dateTimeNotified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateTimeArrival?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    diagnosisTime?: NullableFloatFieldUpdateOperationsInput | number | null
    repairTime?: NullableFloatFieldUpdateOperationsInput | number | null
    verificationTime?: NullableFloatFieldUpdateOperationsInput | number | null
    totalDownTime?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type CorrectiveActionUncheckedUpdateManyWithoutDnfInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    responsiblePersonOrUnit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dateTimeNotified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateTimeArrival?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    diagnosisTime?: NullableFloatFieldUpdateOperationsInput | number | null
    repairTime?: NullableFloatFieldUpdateOperationsInput | number | null
    verificationTime?: NullableFloatFieldUpdateOperationsInput | number | null
    totalDownTime?: NullableFloatFieldUpdateOperationsInput | number | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use DnfDocumentCountOutputTypeDefaultArgs instead
     */
    export type DnfDocumentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DnfDocumentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SystemLogDefaultArgs instead
     */
    export type SystemLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SystemLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ResponsibleUnitDefaultArgs instead
     */
    export type ResponsibleUnitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ResponsibleUnitDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubsystemDefaultArgs instead
     */
    export type SubsystemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubsystemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatrolLocationDefaultArgs instead
     */
    export type PatrolLocationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatrolLocationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommentDefaultArgs instead
     */
    export type CommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationDefaultArgs instead
     */
    export type NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MaintenanceStandardDefaultArgs instead
     */
    export type MaintenanceStandardArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MaintenanceStandardDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MaintenanceStandardItemDefaultArgs instead
     */
    export type MaintenanceStandardItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MaintenanceStandardItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InspectionDetailDefaultArgs instead
     */
    export type InspectionDetailArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InspectionDetailDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DnfDocumentDefaultArgs instead
     */
    export type DnfDocumentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DnfDocumentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CorrectiveActionDefaultArgs instead
     */
    export type CorrectiveActionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CorrectiveActionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use HazardRecordDefaultArgs instead
     */
    export type HazardRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HazardRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ImprovementDefaultArgs instead
     */
    export type ImprovementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ImprovementDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SystemStateDefaultArgs instead
     */
    export type SystemStateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SystemStateDefaultArgs<ExtArgs>

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