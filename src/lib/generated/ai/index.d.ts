
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
    AiKnowledgeSnippet: 'AiKnowledgeSnippet'
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
      modelProps: "aiAgent" | "aiKnowledgeSnippet"
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


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use AiAgentDefaultArgs instead
     */
    export type AiAgentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiAgentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiKnowledgeSnippetDefaultArgs instead
     */
    export type AiKnowledgeSnippetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiKnowledgeSnippetDefaultArgs<ExtArgs>

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