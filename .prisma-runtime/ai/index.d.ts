
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
    AiSyncLog: 'AiSyncLog'
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
      modelProps: "aiAgent" | "aiKnowledgeSnippet" | "aiConversation" | "aiConversationMessage" | "aiInsight" | "aiSyncLog"
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