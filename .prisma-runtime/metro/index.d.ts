
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
 * Model Asset
 * 
 */
export type Asset = $Result.DefaultSelection<Prisma.$AssetPayload>
/**
 * Model TelemetryReading
 * 
 */
export type TelemetryReading = $Result.DefaultSelection<Prisma.$TelemetryReadingPayload>
/**
 * Model SnmpConfig
 * 
 */
export type SnmpConfig = $Result.DefaultSelection<Prisma.$SnmpConfigPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Assets
 * const assets = await prisma.asset.findMany()
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
   * // Fetch zero or more Assets
   * const assets = await prisma.asset.findMany()
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
   * `prisma.asset`: Exposes CRUD operations for the **Asset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Assets
    * const assets = await prisma.asset.findMany()
    * ```
    */
  get asset(): Prisma.AssetDelegate<ExtArgs>;

  /**
   * `prisma.telemetryReading`: Exposes CRUD operations for the **TelemetryReading** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TelemetryReadings
    * const telemetryReadings = await prisma.telemetryReading.findMany()
    * ```
    */
  get telemetryReading(): Prisma.TelemetryReadingDelegate<ExtArgs>;

  /**
   * `prisma.snmpConfig`: Exposes CRUD operations for the **SnmpConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SnmpConfigs
    * const snmpConfigs = await prisma.snmpConfig.findMany()
    * ```
    */
  get snmpConfig(): Prisma.SnmpConfigDelegate<ExtArgs>;
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
    Asset: 'Asset',
    TelemetryReading: 'TelemetryReading',
    SnmpConfig: 'SnmpConfig'
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
      modelProps: "asset" | "telemetryReading" | "snmpConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Asset: {
        payload: Prisma.$AssetPayload<ExtArgs>
        fields: Prisma.AssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findFirst: {
            args: Prisma.AssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findMany: {
            args: Prisma.AssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          create: {
            args: Prisma.AssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          createMany: {
            args: Prisma.AssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          delete: {
            args: Prisma.AssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          update: {
            args: Prisma.AssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          deleteMany: {
            args: Prisma.AssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          aggregate: {
            args: Prisma.AssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsset>
          }
          groupBy: {
            args: Prisma.AssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetCountArgs<ExtArgs>
            result: $Utils.Optional<AssetCountAggregateOutputType> | number
          }
        }
      }
      TelemetryReading: {
        payload: Prisma.$TelemetryReadingPayload<ExtArgs>
        fields: Prisma.TelemetryReadingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TelemetryReadingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TelemetryReadingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload>
          }
          findFirst: {
            args: Prisma.TelemetryReadingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TelemetryReadingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload>
          }
          findMany: {
            args: Prisma.TelemetryReadingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload>[]
          }
          create: {
            args: Prisma.TelemetryReadingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload>
          }
          createMany: {
            args: Prisma.TelemetryReadingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TelemetryReadingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload>[]
          }
          delete: {
            args: Prisma.TelemetryReadingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload>
          }
          update: {
            args: Prisma.TelemetryReadingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload>
          }
          deleteMany: {
            args: Prisma.TelemetryReadingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TelemetryReadingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TelemetryReadingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryReadingPayload>
          }
          aggregate: {
            args: Prisma.TelemetryReadingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTelemetryReading>
          }
          groupBy: {
            args: Prisma.TelemetryReadingGroupByArgs<ExtArgs>
            result: $Utils.Optional<TelemetryReadingGroupByOutputType>[]
          }
          count: {
            args: Prisma.TelemetryReadingCountArgs<ExtArgs>
            result: $Utils.Optional<TelemetryReadingCountAggregateOutputType> | number
          }
        }
      }
      SnmpConfig: {
        payload: Prisma.$SnmpConfigPayload<ExtArgs>
        fields: Prisma.SnmpConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnmpConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnmpConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload>
          }
          findFirst: {
            args: Prisma.SnmpConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnmpConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload>
          }
          findMany: {
            args: Prisma.SnmpConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload>[]
          }
          create: {
            args: Prisma.SnmpConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload>
          }
          createMany: {
            args: Prisma.SnmpConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnmpConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload>[]
          }
          delete: {
            args: Prisma.SnmpConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload>
          }
          update: {
            args: Prisma.SnmpConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload>
          }
          deleteMany: {
            args: Prisma.SnmpConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnmpConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SnmpConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnmpConfigPayload>
          }
          aggregate: {
            args: Prisma.SnmpConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnmpConfig>
          }
          groupBy: {
            args: Prisma.SnmpConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnmpConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnmpConfigCountArgs<ExtArgs>
            result: $Utils.Optional<SnmpConfigCountAggregateOutputType> | number
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
   * Count Type AssetCountOutputType
   */

  export type AssetCountOutputType = {
    children: number
  }

  export type AssetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | AssetCountOutputTypeCountChildrenArgs
  }

  // Custom InputTypes
  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCountOutputType
     */
    select?: AssetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Asset
   */

  export type AggregateAsset = {
    _count: AssetCountAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  export type AssetMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    subsystem: string | null
    parentId: string | null
    criticality: string | null
    createdAt: Date | null
    deletedAt: Date | null
    updatedAt: Date | null
  }

  export type AssetMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    subsystem: string | null
    parentId: string | null
    criticality: string | null
    createdAt: Date | null
    deletedAt: Date | null
    updatedAt: Date | null
  }

  export type AssetCountAggregateOutputType = {
    id: number
    code: number
    name: number
    subsystem: number
    parentId: number
    criticality: number
    specification: number
    createdAt: number
    deletedAt: number
    updatedAt: number
    _all: number
  }


  export type AssetMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    subsystem?: true
    parentId?: true
    criticality?: true
    createdAt?: true
    deletedAt?: true
    updatedAt?: true
  }

  export type AssetMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    subsystem?: true
    parentId?: true
    criticality?: true
    createdAt?: true
    deletedAt?: true
    updatedAt?: true
  }

  export type AssetCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    subsystem?: true
    parentId?: true
    criticality?: true
    specification?: true
    createdAt?: true
    deletedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asset to aggregate.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Assets
    **/
    _count?: true | AssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetMaxAggregateInputType
  }

  export type GetAssetAggregateType<T extends AssetAggregateArgs> = {
        [P in keyof T & keyof AggregateAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsset[P]>
      : GetScalarType<T[P], AggregateAsset[P]>
  }




  export type AssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithAggregationInput | AssetOrderByWithAggregationInput[]
    by: AssetScalarFieldEnum[] | AssetScalarFieldEnum
    having?: AssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetCountAggregateInputType | true
    _min?: AssetMinAggregateInputType
    _max?: AssetMaxAggregateInputType
  }

  export type AssetGroupByOutputType = {
    id: string
    code: string
    name: string
    subsystem: string
    parentId: string | null
    criticality: string
    specification: JsonValue | null
    createdAt: Date
    deletedAt: Date | null
    updatedAt: Date
    _count: AssetCountAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  type GetAssetGroupByPayload<T extends AssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetGroupByOutputType[P]>
            : GetScalarType<T[P], AssetGroupByOutputType[P]>
        }
      >
    >


  export type AssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    subsystem?: boolean
    parentId?: boolean
    criticality?: boolean
    specification?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Asset$parentArgs<ExtArgs>
    children?: boolean | Asset$childrenArgs<ExtArgs>
    _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    subsystem?: boolean
    parentId?: boolean
    criticality?: boolean
    specification?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Asset$parentArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    subsystem?: boolean
    parentId?: boolean
    criticality?: boolean
    specification?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    updatedAt?: boolean
  }

  export type AssetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Asset$parentArgs<ExtArgs>
    children?: boolean | Asset$childrenArgs<ExtArgs>
    _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AssetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Asset$parentArgs<ExtArgs>
  }

  export type $AssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Asset"
    objects: {
      parent: Prisma.$AssetPayload<ExtArgs> | null
      children: Prisma.$AssetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      subsystem: string
      parentId: string | null
      criticality: string
      specification: Prisma.JsonValue | null
      createdAt: Date
      deletedAt: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["asset"]>
    composites: {}
  }

  type AssetGetPayload<S extends boolean | null | undefined | AssetDefaultArgs> = $Result.GetResult<Prisma.$AssetPayload, S>

  type AssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AssetFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AssetCountAggregateInputType | true
    }

  export interface AssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Asset'], meta: { name: 'Asset' } }
    /**
     * Find zero or one Asset that matches the filter.
     * @param {AssetFindUniqueArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetFindUniqueArgs>(args: SelectSubset<T, AssetFindUniqueArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Asset that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AssetFindUniqueOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Asset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetFindFirstArgs>(args?: SelectSubset<T, AssetFindFirstArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Asset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Assets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assets
     * const assets = await prisma.asset.findMany()
     * 
     * // Get first 10 Assets
     * const assets = await prisma.asset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetWithIdOnly = await prisma.asset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetFindManyArgs>(args?: SelectSubset<T, AssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Asset.
     * @param {AssetCreateArgs} args - Arguments to create a Asset.
     * @example
     * // Create one Asset
     * const Asset = await prisma.asset.create({
     *   data: {
     *     // ... data to create a Asset
     *   }
     * })
     * 
     */
    create<T extends AssetCreateArgs>(args: SelectSubset<T, AssetCreateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Assets.
     * @param {AssetCreateManyArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetCreateManyArgs>(args?: SelectSubset<T, AssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Assets and returns the data saved in the database.
     * @param {AssetCreateManyAndReturnArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Asset.
     * @param {AssetDeleteArgs} args - Arguments to delete one Asset.
     * @example
     * // Delete one Asset
     * const Asset = await prisma.asset.delete({
     *   where: {
     *     // ... filter to delete one Asset
     *   }
     * })
     * 
     */
    delete<T extends AssetDeleteArgs>(args: SelectSubset<T, AssetDeleteArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Asset.
     * @param {AssetUpdateArgs} args - Arguments to update one Asset.
     * @example
     * // Update one Asset
     * const asset = await prisma.asset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetUpdateArgs>(args: SelectSubset<T, AssetUpdateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Assets.
     * @param {AssetDeleteManyArgs} args - Arguments to filter Assets to delete.
     * @example
     * // Delete a few Assets
     * const { count } = await prisma.asset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetDeleteManyArgs>(args?: SelectSubset<T, AssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetUpdateManyArgs>(args: SelectSubset<T, AssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Asset.
     * @param {AssetUpsertArgs} args - Arguments to update or create a Asset.
     * @example
     * // Update or create a Asset
     * const asset = await prisma.asset.upsert({
     *   create: {
     *     // ... data to create a Asset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asset we want to update
     *   }
     * })
     */
    upsert<T extends AssetUpsertArgs>(args: SelectSubset<T, AssetUpsertArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCountArgs} args - Arguments to filter Assets to count.
     * @example
     * // Count the number of Assets
     * const count = await prisma.asset.count({
     *   where: {
     *     // ... the filter for the Assets we want to count
     *   }
     * })
    **/
    count<T extends AssetCountArgs>(
      args?: Subset<T, AssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AssetAggregateArgs>(args: Subset<T, AssetAggregateArgs>): Prisma.PrismaPromise<GetAssetAggregateType<T>>

    /**
     * Group by Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetGroupByArgs} args - Group by arguments.
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
      T extends AssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetGroupByArgs['orderBy'] }
        : { orderBy?: AssetGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Asset model
   */
  readonly fields: AssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends Asset$parentArgs<ExtArgs> = {}>(args?: Subset<T, Asset$parentArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    children<T extends Asset$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Asset$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Asset model
   */ 
  interface AssetFieldRefs {
    readonly id: FieldRef<"Asset", 'String'>
    readonly code: FieldRef<"Asset", 'String'>
    readonly name: FieldRef<"Asset", 'String'>
    readonly subsystem: FieldRef<"Asset", 'String'>
    readonly parentId: FieldRef<"Asset", 'String'>
    readonly criticality: FieldRef<"Asset", 'String'>
    readonly specification: FieldRef<"Asset", 'Json'>
    readonly createdAt: FieldRef<"Asset", 'DateTime'>
    readonly deletedAt: FieldRef<"Asset", 'DateTime'>
    readonly updatedAt: FieldRef<"Asset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Asset findUnique
   */
  export type AssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findUniqueOrThrow
   */
  export type AssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findFirst
   */
  export type AssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findFirstOrThrow
   */
  export type AssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findMany
   */
  export type AssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Assets to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset create
   */
  export type AssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to create a Asset.
     */
    data: XOR<AssetCreateInput, AssetUncheckedCreateInput>
  }

  /**
   * Asset createMany
   */
  export type AssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Asset createManyAndReturn
   */
  export type AssetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asset update
   */
  export type AssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to update a Asset.
     */
    data: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
    /**
     * Choose, which Asset to update.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset updateMany
   */
  export type AssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput
  }

  /**
   * Asset upsert
   */
  export type AssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The filter to search for the Asset to update in case it exists.
     */
    where: AssetWhereUniqueInput
    /**
     * In case the Asset found by the `where` argument doesn't exist, create a new Asset with this data.
     */
    create: XOR<AssetCreateInput, AssetUncheckedCreateInput>
    /**
     * In case the Asset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
  }

  /**
   * Asset delete
   */
  export type AssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter which Asset to delete.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset deleteMany
   */
  export type AssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assets to delete
     */
    where?: AssetWhereInput
  }

  /**
   * Asset.parent
   */
  export type Asset$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    where?: AssetWhereInput
  }

  /**
   * Asset.children
   */
  export type Asset$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    cursor?: AssetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset without action
   */
  export type AssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
  }


  /**
   * Model TelemetryReading
   */

  export type AggregateTelemetryReading = {
    _count: TelemetryReadingCountAggregateOutputType | null
    _avg: TelemetryReadingAvgAggregateOutputType | null
    _sum: TelemetryReadingSumAggregateOutputType | null
    _min: TelemetryReadingMinAggregateOutputType | null
    _max: TelemetryReadingMaxAggregateOutputType | null
  }

  export type TelemetryReadingAvgAggregateOutputType = {
    value: number | null
  }

  export type TelemetryReadingSumAggregateOutputType = {
    value: number | null
  }

  export type TelemetryReadingMinAggregateOutputType = {
    id: string | null
    assetId: string | null
    metric: string | null
    value: number | null
    unit: string | null
    timestamp: Date | null
  }

  export type TelemetryReadingMaxAggregateOutputType = {
    id: string | null
    assetId: string | null
    metric: string | null
    value: number | null
    unit: string | null
    timestamp: Date | null
  }

  export type TelemetryReadingCountAggregateOutputType = {
    id: number
    assetId: number
    metric: number
    value: number
    unit: number
    timestamp: number
    _all: number
  }


  export type TelemetryReadingAvgAggregateInputType = {
    value?: true
  }

  export type TelemetryReadingSumAggregateInputType = {
    value?: true
  }

  export type TelemetryReadingMinAggregateInputType = {
    id?: true
    assetId?: true
    metric?: true
    value?: true
    unit?: true
    timestamp?: true
  }

  export type TelemetryReadingMaxAggregateInputType = {
    id?: true
    assetId?: true
    metric?: true
    value?: true
    unit?: true
    timestamp?: true
  }

  export type TelemetryReadingCountAggregateInputType = {
    id?: true
    assetId?: true
    metric?: true
    value?: true
    unit?: true
    timestamp?: true
    _all?: true
  }

  export type TelemetryReadingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TelemetryReading to aggregate.
     */
    where?: TelemetryReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TelemetryReadings to fetch.
     */
    orderBy?: TelemetryReadingOrderByWithRelationInput | TelemetryReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TelemetryReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TelemetryReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TelemetryReadings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TelemetryReadings
    **/
    _count?: true | TelemetryReadingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TelemetryReadingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TelemetryReadingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TelemetryReadingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TelemetryReadingMaxAggregateInputType
  }

  export type GetTelemetryReadingAggregateType<T extends TelemetryReadingAggregateArgs> = {
        [P in keyof T & keyof AggregateTelemetryReading]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTelemetryReading[P]>
      : GetScalarType<T[P], AggregateTelemetryReading[P]>
  }




  export type TelemetryReadingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TelemetryReadingWhereInput
    orderBy?: TelemetryReadingOrderByWithAggregationInput | TelemetryReadingOrderByWithAggregationInput[]
    by: TelemetryReadingScalarFieldEnum[] | TelemetryReadingScalarFieldEnum
    having?: TelemetryReadingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TelemetryReadingCountAggregateInputType | true
    _avg?: TelemetryReadingAvgAggregateInputType
    _sum?: TelemetryReadingSumAggregateInputType
    _min?: TelemetryReadingMinAggregateInputType
    _max?: TelemetryReadingMaxAggregateInputType
  }

  export type TelemetryReadingGroupByOutputType = {
    id: string
    assetId: string
    metric: string
    value: number
    unit: string | null
    timestamp: Date
    _count: TelemetryReadingCountAggregateOutputType | null
    _avg: TelemetryReadingAvgAggregateOutputType | null
    _sum: TelemetryReadingSumAggregateOutputType | null
    _min: TelemetryReadingMinAggregateOutputType | null
    _max: TelemetryReadingMaxAggregateOutputType | null
  }

  type GetTelemetryReadingGroupByPayload<T extends TelemetryReadingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TelemetryReadingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TelemetryReadingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TelemetryReadingGroupByOutputType[P]>
            : GetScalarType<T[P], TelemetryReadingGroupByOutputType[P]>
        }
      >
    >


  export type TelemetryReadingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    metric?: boolean
    value?: boolean
    unit?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["telemetryReading"]>

  export type TelemetryReadingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    metric?: boolean
    value?: boolean
    unit?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["telemetryReading"]>

  export type TelemetryReadingSelectScalar = {
    id?: boolean
    assetId?: boolean
    metric?: boolean
    value?: boolean
    unit?: boolean
    timestamp?: boolean
  }


  export type $TelemetryReadingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TelemetryReading"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetId: string
      metric: string
      value: number
      unit: string | null
      timestamp: Date
    }, ExtArgs["result"]["telemetryReading"]>
    composites: {}
  }

  type TelemetryReadingGetPayload<S extends boolean | null | undefined | TelemetryReadingDefaultArgs> = $Result.GetResult<Prisma.$TelemetryReadingPayload, S>

  type TelemetryReadingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TelemetryReadingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TelemetryReadingCountAggregateInputType | true
    }

  export interface TelemetryReadingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TelemetryReading'], meta: { name: 'TelemetryReading' } }
    /**
     * Find zero or one TelemetryReading that matches the filter.
     * @param {TelemetryReadingFindUniqueArgs} args - Arguments to find a TelemetryReading
     * @example
     * // Get one TelemetryReading
     * const telemetryReading = await prisma.telemetryReading.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TelemetryReadingFindUniqueArgs>(args: SelectSubset<T, TelemetryReadingFindUniqueArgs<ExtArgs>>): Prisma__TelemetryReadingClient<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TelemetryReading that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TelemetryReadingFindUniqueOrThrowArgs} args - Arguments to find a TelemetryReading
     * @example
     * // Get one TelemetryReading
     * const telemetryReading = await prisma.telemetryReading.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TelemetryReadingFindUniqueOrThrowArgs>(args: SelectSubset<T, TelemetryReadingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TelemetryReadingClient<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TelemetryReading that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryReadingFindFirstArgs} args - Arguments to find a TelemetryReading
     * @example
     * // Get one TelemetryReading
     * const telemetryReading = await prisma.telemetryReading.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TelemetryReadingFindFirstArgs>(args?: SelectSubset<T, TelemetryReadingFindFirstArgs<ExtArgs>>): Prisma__TelemetryReadingClient<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TelemetryReading that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryReadingFindFirstOrThrowArgs} args - Arguments to find a TelemetryReading
     * @example
     * // Get one TelemetryReading
     * const telemetryReading = await prisma.telemetryReading.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TelemetryReadingFindFirstOrThrowArgs>(args?: SelectSubset<T, TelemetryReadingFindFirstOrThrowArgs<ExtArgs>>): Prisma__TelemetryReadingClient<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TelemetryReadings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryReadingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TelemetryReadings
     * const telemetryReadings = await prisma.telemetryReading.findMany()
     * 
     * // Get first 10 TelemetryReadings
     * const telemetryReadings = await prisma.telemetryReading.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const telemetryReadingWithIdOnly = await prisma.telemetryReading.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TelemetryReadingFindManyArgs>(args?: SelectSubset<T, TelemetryReadingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TelemetryReading.
     * @param {TelemetryReadingCreateArgs} args - Arguments to create a TelemetryReading.
     * @example
     * // Create one TelemetryReading
     * const TelemetryReading = await prisma.telemetryReading.create({
     *   data: {
     *     // ... data to create a TelemetryReading
     *   }
     * })
     * 
     */
    create<T extends TelemetryReadingCreateArgs>(args: SelectSubset<T, TelemetryReadingCreateArgs<ExtArgs>>): Prisma__TelemetryReadingClient<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TelemetryReadings.
     * @param {TelemetryReadingCreateManyArgs} args - Arguments to create many TelemetryReadings.
     * @example
     * // Create many TelemetryReadings
     * const telemetryReading = await prisma.telemetryReading.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TelemetryReadingCreateManyArgs>(args?: SelectSubset<T, TelemetryReadingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TelemetryReadings and returns the data saved in the database.
     * @param {TelemetryReadingCreateManyAndReturnArgs} args - Arguments to create many TelemetryReadings.
     * @example
     * // Create many TelemetryReadings
     * const telemetryReading = await prisma.telemetryReading.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TelemetryReadings and only return the `id`
     * const telemetryReadingWithIdOnly = await prisma.telemetryReading.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TelemetryReadingCreateManyAndReturnArgs>(args?: SelectSubset<T, TelemetryReadingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TelemetryReading.
     * @param {TelemetryReadingDeleteArgs} args - Arguments to delete one TelemetryReading.
     * @example
     * // Delete one TelemetryReading
     * const TelemetryReading = await prisma.telemetryReading.delete({
     *   where: {
     *     // ... filter to delete one TelemetryReading
     *   }
     * })
     * 
     */
    delete<T extends TelemetryReadingDeleteArgs>(args: SelectSubset<T, TelemetryReadingDeleteArgs<ExtArgs>>): Prisma__TelemetryReadingClient<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TelemetryReading.
     * @param {TelemetryReadingUpdateArgs} args - Arguments to update one TelemetryReading.
     * @example
     * // Update one TelemetryReading
     * const telemetryReading = await prisma.telemetryReading.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TelemetryReadingUpdateArgs>(args: SelectSubset<T, TelemetryReadingUpdateArgs<ExtArgs>>): Prisma__TelemetryReadingClient<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TelemetryReadings.
     * @param {TelemetryReadingDeleteManyArgs} args - Arguments to filter TelemetryReadings to delete.
     * @example
     * // Delete a few TelemetryReadings
     * const { count } = await prisma.telemetryReading.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TelemetryReadingDeleteManyArgs>(args?: SelectSubset<T, TelemetryReadingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TelemetryReadings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryReadingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TelemetryReadings
     * const telemetryReading = await prisma.telemetryReading.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TelemetryReadingUpdateManyArgs>(args: SelectSubset<T, TelemetryReadingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TelemetryReading.
     * @param {TelemetryReadingUpsertArgs} args - Arguments to update or create a TelemetryReading.
     * @example
     * // Update or create a TelemetryReading
     * const telemetryReading = await prisma.telemetryReading.upsert({
     *   create: {
     *     // ... data to create a TelemetryReading
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TelemetryReading we want to update
     *   }
     * })
     */
    upsert<T extends TelemetryReadingUpsertArgs>(args: SelectSubset<T, TelemetryReadingUpsertArgs<ExtArgs>>): Prisma__TelemetryReadingClient<$Result.GetResult<Prisma.$TelemetryReadingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TelemetryReadings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryReadingCountArgs} args - Arguments to filter TelemetryReadings to count.
     * @example
     * // Count the number of TelemetryReadings
     * const count = await prisma.telemetryReading.count({
     *   where: {
     *     // ... the filter for the TelemetryReadings we want to count
     *   }
     * })
    **/
    count<T extends TelemetryReadingCountArgs>(
      args?: Subset<T, TelemetryReadingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TelemetryReadingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TelemetryReading.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryReadingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TelemetryReadingAggregateArgs>(args: Subset<T, TelemetryReadingAggregateArgs>): Prisma.PrismaPromise<GetTelemetryReadingAggregateType<T>>

    /**
     * Group by TelemetryReading.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryReadingGroupByArgs} args - Group by arguments.
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
      T extends TelemetryReadingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TelemetryReadingGroupByArgs['orderBy'] }
        : { orderBy?: TelemetryReadingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TelemetryReadingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTelemetryReadingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TelemetryReading model
   */
  readonly fields: TelemetryReadingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TelemetryReading.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TelemetryReadingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TelemetryReading model
   */ 
  interface TelemetryReadingFieldRefs {
    readonly id: FieldRef<"TelemetryReading", 'String'>
    readonly assetId: FieldRef<"TelemetryReading", 'String'>
    readonly metric: FieldRef<"TelemetryReading", 'String'>
    readonly value: FieldRef<"TelemetryReading", 'Float'>
    readonly unit: FieldRef<"TelemetryReading", 'String'>
    readonly timestamp: FieldRef<"TelemetryReading", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TelemetryReading findUnique
   */
  export type TelemetryReadingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
    /**
     * Filter, which TelemetryReading to fetch.
     */
    where: TelemetryReadingWhereUniqueInput
  }

  /**
   * TelemetryReading findUniqueOrThrow
   */
  export type TelemetryReadingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
    /**
     * Filter, which TelemetryReading to fetch.
     */
    where: TelemetryReadingWhereUniqueInput
  }

  /**
   * TelemetryReading findFirst
   */
  export type TelemetryReadingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
    /**
     * Filter, which TelemetryReading to fetch.
     */
    where?: TelemetryReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TelemetryReadings to fetch.
     */
    orderBy?: TelemetryReadingOrderByWithRelationInput | TelemetryReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TelemetryReadings.
     */
    cursor?: TelemetryReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TelemetryReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TelemetryReadings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TelemetryReadings.
     */
    distinct?: TelemetryReadingScalarFieldEnum | TelemetryReadingScalarFieldEnum[]
  }

  /**
   * TelemetryReading findFirstOrThrow
   */
  export type TelemetryReadingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
    /**
     * Filter, which TelemetryReading to fetch.
     */
    where?: TelemetryReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TelemetryReadings to fetch.
     */
    orderBy?: TelemetryReadingOrderByWithRelationInput | TelemetryReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TelemetryReadings.
     */
    cursor?: TelemetryReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TelemetryReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TelemetryReadings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TelemetryReadings.
     */
    distinct?: TelemetryReadingScalarFieldEnum | TelemetryReadingScalarFieldEnum[]
  }

  /**
   * TelemetryReading findMany
   */
  export type TelemetryReadingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
    /**
     * Filter, which TelemetryReadings to fetch.
     */
    where?: TelemetryReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TelemetryReadings to fetch.
     */
    orderBy?: TelemetryReadingOrderByWithRelationInput | TelemetryReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TelemetryReadings.
     */
    cursor?: TelemetryReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TelemetryReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TelemetryReadings.
     */
    skip?: number
    distinct?: TelemetryReadingScalarFieldEnum | TelemetryReadingScalarFieldEnum[]
  }

  /**
   * TelemetryReading create
   */
  export type TelemetryReadingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
    /**
     * The data needed to create a TelemetryReading.
     */
    data: XOR<TelemetryReadingCreateInput, TelemetryReadingUncheckedCreateInput>
  }

  /**
   * TelemetryReading createMany
   */
  export type TelemetryReadingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TelemetryReadings.
     */
    data: TelemetryReadingCreateManyInput | TelemetryReadingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TelemetryReading createManyAndReturn
   */
  export type TelemetryReadingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TelemetryReadings.
     */
    data: TelemetryReadingCreateManyInput | TelemetryReadingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TelemetryReading update
   */
  export type TelemetryReadingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
    /**
     * The data needed to update a TelemetryReading.
     */
    data: XOR<TelemetryReadingUpdateInput, TelemetryReadingUncheckedUpdateInput>
    /**
     * Choose, which TelemetryReading to update.
     */
    where: TelemetryReadingWhereUniqueInput
  }

  /**
   * TelemetryReading updateMany
   */
  export type TelemetryReadingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TelemetryReadings.
     */
    data: XOR<TelemetryReadingUpdateManyMutationInput, TelemetryReadingUncheckedUpdateManyInput>
    /**
     * Filter which TelemetryReadings to update
     */
    where?: TelemetryReadingWhereInput
  }

  /**
   * TelemetryReading upsert
   */
  export type TelemetryReadingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
    /**
     * The filter to search for the TelemetryReading to update in case it exists.
     */
    where: TelemetryReadingWhereUniqueInput
    /**
     * In case the TelemetryReading found by the `where` argument doesn't exist, create a new TelemetryReading with this data.
     */
    create: XOR<TelemetryReadingCreateInput, TelemetryReadingUncheckedCreateInput>
    /**
     * In case the TelemetryReading was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TelemetryReadingUpdateInput, TelemetryReadingUncheckedUpdateInput>
  }

  /**
   * TelemetryReading delete
   */
  export type TelemetryReadingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
    /**
     * Filter which TelemetryReading to delete.
     */
    where: TelemetryReadingWhereUniqueInput
  }

  /**
   * TelemetryReading deleteMany
   */
  export type TelemetryReadingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TelemetryReadings to delete
     */
    where?: TelemetryReadingWhereInput
  }

  /**
   * TelemetryReading without action
   */
  export type TelemetryReadingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryReading
     */
    select?: TelemetryReadingSelect<ExtArgs> | null
  }


  /**
   * Model SnmpConfig
   */

  export type AggregateSnmpConfig = {
    _count: SnmpConfigCountAggregateOutputType | null
    _avg: SnmpConfigAvgAggregateOutputType | null
    _sum: SnmpConfigSumAggregateOutputType | null
    _min: SnmpConfigMinAggregateOutputType | null
    _max: SnmpConfigMaxAggregateOutputType | null
  }

  export type SnmpConfigAvgAggregateOutputType = {
    intervalSeconds: number | null
  }

  export type SnmpConfigSumAggregateOutputType = {
    intervalSeconds: number | null
  }

  export type SnmpConfigMinAggregateOutputType = {
    id: string | null
    assetId: string | null
    ip: string | null
    community: string | null
    oid: string | null
    metricName: string | null
    intervalSeconds: number | null
    lastPolled: Date | null
  }

  export type SnmpConfigMaxAggregateOutputType = {
    id: string | null
    assetId: string | null
    ip: string | null
    community: string | null
    oid: string | null
    metricName: string | null
    intervalSeconds: number | null
    lastPolled: Date | null
  }

  export type SnmpConfigCountAggregateOutputType = {
    id: number
    assetId: number
    ip: number
    community: number
    oid: number
    metricName: number
    intervalSeconds: number
    lastPolled: number
    _all: number
  }


  export type SnmpConfigAvgAggregateInputType = {
    intervalSeconds?: true
  }

  export type SnmpConfigSumAggregateInputType = {
    intervalSeconds?: true
  }

  export type SnmpConfigMinAggregateInputType = {
    id?: true
    assetId?: true
    ip?: true
    community?: true
    oid?: true
    metricName?: true
    intervalSeconds?: true
    lastPolled?: true
  }

  export type SnmpConfigMaxAggregateInputType = {
    id?: true
    assetId?: true
    ip?: true
    community?: true
    oid?: true
    metricName?: true
    intervalSeconds?: true
    lastPolled?: true
  }

  export type SnmpConfigCountAggregateInputType = {
    id?: true
    assetId?: true
    ip?: true
    community?: true
    oid?: true
    metricName?: true
    intervalSeconds?: true
    lastPolled?: true
    _all?: true
  }

  export type SnmpConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnmpConfig to aggregate.
     */
    where?: SnmpConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnmpConfigs to fetch.
     */
    orderBy?: SnmpConfigOrderByWithRelationInput | SnmpConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnmpConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnmpConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnmpConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SnmpConfigs
    **/
    _count?: true | SnmpConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SnmpConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SnmpConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnmpConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnmpConfigMaxAggregateInputType
  }

  export type GetSnmpConfigAggregateType<T extends SnmpConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateSnmpConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnmpConfig[P]>
      : GetScalarType<T[P], AggregateSnmpConfig[P]>
  }




  export type SnmpConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnmpConfigWhereInput
    orderBy?: SnmpConfigOrderByWithAggregationInput | SnmpConfigOrderByWithAggregationInput[]
    by: SnmpConfigScalarFieldEnum[] | SnmpConfigScalarFieldEnum
    having?: SnmpConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnmpConfigCountAggregateInputType | true
    _avg?: SnmpConfigAvgAggregateInputType
    _sum?: SnmpConfigSumAggregateInputType
    _min?: SnmpConfigMinAggregateInputType
    _max?: SnmpConfigMaxAggregateInputType
  }

  export type SnmpConfigGroupByOutputType = {
    id: string
    assetId: string
    ip: string
    community: string
    oid: string
    metricName: string
    intervalSeconds: number
    lastPolled: Date | null
    _count: SnmpConfigCountAggregateOutputType | null
    _avg: SnmpConfigAvgAggregateOutputType | null
    _sum: SnmpConfigSumAggregateOutputType | null
    _min: SnmpConfigMinAggregateOutputType | null
    _max: SnmpConfigMaxAggregateOutputType | null
  }

  type GetSnmpConfigGroupByPayload<T extends SnmpConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnmpConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnmpConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnmpConfigGroupByOutputType[P]>
            : GetScalarType<T[P], SnmpConfigGroupByOutputType[P]>
        }
      >
    >


  export type SnmpConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    ip?: boolean
    community?: boolean
    oid?: boolean
    metricName?: boolean
    intervalSeconds?: boolean
    lastPolled?: boolean
  }, ExtArgs["result"]["snmpConfig"]>

  export type SnmpConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    ip?: boolean
    community?: boolean
    oid?: boolean
    metricName?: boolean
    intervalSeconds?: boolean
    lastPolled?: boolean
  }, ExtArgs["result"]["snmpConfig"]>

  export type SnmpConfigSelectScalar = {
    id?: boolean
    assetId?: boolean
    ip?: boolean
    community?: boolean
    oid?: boolean
    metricName?: boolean
    intervalSeconds?: boolean
    lastPolled?: boolean
  }


  export type $SnmpConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SnmpConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetId: string
      ip: string
      community: string
      oid: string
      metricName: string
      intervalSeconds: number
      lastPolled: Date | null
    }, ExtArgs["result"]["snmpConfig"]>
    composites: {}
  }

  type SnmpConfigGetPayload<S extends boolean | null | undefined | SnmpConfigDefaultArgs> = $Result.GetResult<Prisma.$SnmpConfigPayload, S>

  type SnmpConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SnmpConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SnmpConfigCountAggregateInputType | true
    }

  export interface SnmpConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SnmpConfig'], meta: { name: 'SnmpConfig' } }
    /**
     * Find zero or one SnmpConfig that matches the filter.
     * @param {SnmpConfigFindUniqueArgs} args - Arguments to find a SnmpConfig
     * @example
     * // Get one SnmpConfig
     * const snmpConfig = await prisma.snmpConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnmpConfigFindUniqueArgs>(args: SelectSubset<T, SnmpConfigFindUniqueArgs<ExtArgs>>): Prisma__SnmpConfigClient<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SnmpConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SnmpConfigFindUniqueOrThrowArgs} args - Arguments to find a SnmpConfig
     * @example
     * // Get one SnmpConfig
     * const snmpConfig = await prisma.snmpConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnmpConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, SnmpConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnmpConfigClient<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SnmpConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnmpConfigFindFirstArgs} args - Arguments to find a SnmpConfig
     * @example
     * // Get one SnmpConfig
     * const snmpConfig = await prisma.snmpConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnmpConfigFindFirstArgs>(args?: SelectSubset<T, SnmpConfigFindFirstArgs<ExtArgs>>): Prisma__SnmpConfigClient<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SnmpConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnmpConfigFindFirstOrThrowArgs} args - Arguments to find a SnmpConfig
     * @example
     * // Get one SnmpConfig
     * const snmpConfig = await prisma.snmpConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnmpConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, SnmpConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnmpConfigClient<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SnmpConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnmpConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SnmpConfigs
     * const snmpConfigs = await prisma.snmpConfig.findMany()
     * 
     * // Get first 10 SnmpConfigs
     * const snmpConfigs = await prisma.snmpConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const snmpConfigWithIdOnly = await prisma.snmpConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SnmpConfigFindManyArgs>(args?: SelectSubset<T, SnmpConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SnmpConfig.
     * @param {SnmpConfigCreateArgs} args - Arguments to create a SnmpConfig.
     * @example
     * // Create one SnmpConfig
     * const SnmpConfig = await prisma.snmpConfig.create({
     *   data: {
     *     // ... data to create a SnmpConfig
     *   }
     * })
     * 
     */
    create<T extends SnmpConfigCreateArgs>(args: SelectSubset<T, SnmpConfigCreateArgs<ExtArgs>>): Prisma__SnmpConfigClient<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SnmpConfigs.
     * @param {SnmpConfigCreateManyArgs} args - Arguments to create many SnmpConfigs.
     * @example
     * // Create many SnmpConfigs
     * const snmpConfig = await prisma.snmpConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnmpConfigCreateManyArgs>(args?: SelectSubset<T, SnmpConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SnmpConfigs and returns the data saved in the database.
     * @param {SnmpConfigCreateManyAndReturnArgs} args - Arguments to create many SnmpConfigs.
     * @example
     * // Create many SnmpConfigs
     * const snmpConfig = await prisma.snmpConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SnmpConfigs and only return the `id`
     * const snmpConfigWithIdOnly = await prisma.snmpConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnmpConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, SnmpConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SnmpConfig.
     * @param {SnmpConfigDeleteArgs} args - Arguments to delete one SnmpConfig.
     * @example
     * // Delete one SnmpConfig
     * const SnmpConfig = await prisma.snmpConfig.delete({
     *   where: {
     *     // ... filter to delete one SnmpConfig
     *   }
     * })
     * 
     */
    delete<T extends SnmpConfigDeleteArgs>(args: SelectSubset<T, SnmpConfigDeleteArgs<ExtArgs>>): Prisma__SnmpConfigClient<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SnmpConfig.
     * @param {SnmpConfigUpdateArgs} args - Arguments to update one SnmpConfig.
     * @example
     * // Update one SnmpConfig
     * const snmpConfig = await prisma.snmpConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnmpConfigUpdateArgs>(args: SelectSubset<T, SnmpConfigUpdateArgs<ExtArgs>>): Prisma__SnmpConfigClient<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SnmpConfigs.
     * @param {SnmpConfigDeleteManyArgs} args - Arguments to filter SnmpConfigs to delete.
     * @example
     * // Delete a few SnmpConfigs
     * const { count } = await prisma.snmpConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnmpConfigDeleteManyArgs>(args?: SelectSubset<T, SnmpConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnmpConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnmpConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SnmpConfigs
     * const snmpConfig = await prisma.snmpConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnmpConfigUpdateManyArgs>(args: SelectSubset<T, SnmpConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SnmpConfig.
     * @param {SnmpConfigUpsertArgs} args - Arguments to update or create a SnmpConfig.
     * @example
     * // Update or create a SnmpConfig
     * const snmpConfig = await prisma.snmpConfig.upsert({
     *   create: {
     *     // ... data to create a SnmpConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SnmpConfig we want to update
     *   }
     * })
     */
    upsert<T extends SnmpConfigUpsertArgs>(args: SelectSubset<T, SnmpConfigUpsertArgs<ExtArgs>>): Prisma__SnmpConfigClient<$Result.GetResult<Prisma.$SnmpConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SnmpConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnmpConfigCountArgs} args - Arguments to filter SnmpConfigs to count.
     * @example
     * // Count the number of SnmpConfigs
     * const count = await prisma.snmpConfig.count({
     *   where: {
     *     // ... the filter for the SnmpConfigs we want to count
     *   }
     * })
    **/
    count<T extends SnmpConfigCountArgs>(
      args?: Subset<T, SnmpConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnmpConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SnmpConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnmpConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SnmpConfigAggregateArgs>(args: Subset<T, SnmpConfigAggregateArgs>): Prisma.PrismaPromise<GetSnmpConfigAggregateType<T>>

    /**
     * Group by SnmpConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnmpConfigGroupByArgs} args - Group by arguments.
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
      T extends SnmpConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnmpConfigGroupByArgs['orderBy'] }
        : { orderBy?: SnmpConfigGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SnmpConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnmpConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SnmpConfig model
   */
  readonly fields: SnmpConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SnmpConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnmpConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SnmpConfig model
   */ 
  interface SnmpConfigFieldRefs {
    readonly id: FieldRef<"SnmpConfig", 'String'>
    readonly assetId: FieldRef<"SnmpConfig", 'String'>
    readonly ip: FieldRef<"SnmpConfig", 'String'>
    readonly community: FieldRef<"SnmpConfig", 'String'>
    readonly oid: FieldRef<"SnmpConfig", 'String'>
    readonly metricName: FieldRef<"SnmpConfig", 'String'>
    readonly intervalSeconds: FieldRef<"SnmpConfig", 'Int'>
    readonly lastPolled: FieldRef<"SnmpConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SnmpConfig findUnique
   */
  export type SnmpConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
    /**
     * Filter, which SnmpConfig to fetch.
     */
    where: SnmpConfigWhereUniqueInput
  }

  /**
   * SnmpConfig findUniqueOrThrow
   */
  export type SnmpConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
    /**
     * Filter, which SnmpConfig to fetch.
     */
    where: SnmpConfigWhereUniqueInput
  }

  /**
   * SnmpConfig findFirst
   */
  export type SnmpConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
    /**
     * Filter, which SnmpConfig to fetch.
     */
    where?: SnmpConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnmpConfigs to fetch.
     */
    orderBy?: SnmpConfigOrderByWithRelationInput | SnmpConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnmpConfigs.
     */
    cursor?: SnmpConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnmpConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnmpConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnmpConfigs.
     */
    distinct?: SnmpConfigScalarFieldEnum | SnmpConfigScalarFieldEnum[]
  }

  /**
   * SnmpConfig findFirstOrThrow
   */
  export type SnmpConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
    /**
     * Filter, which SnmpConfig to fetch.
     */
    where?: SnmpConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnmpConfigs to fetch.
     */
    orderBy?: SnmpConfigOrderByWithRelationInput | SnmpConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnmpConfigs.
     */
    cursor?: SnmpConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnmpConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnmpConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnmpConfigs.
     */
    distinct?: SnmpConfigScalarFieldEnum | SnmpConfigScalarFieldEnum[]
  }

  /**
   * SnmpConfig findMany
   */
  export type SnmpConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
    /**
     * Filter, which SnmpConfigs to fetch.
     */
    where?: SnmpConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnmpConfigs to fetch.
     */
    orderBy?: SnmpConfigOrderByWithRelationInput | SnmpConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SnmpConfigs.
     */
    cursor?: SnmpConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnmpConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnmpConfigs.
     */
    skip?: number
    distinct?: SnmpConfigScalarFieldEnum | SnmpConfigScalarFieldEnum[]
  }

  /**
   * SnmpConfig create
   */
  export type SnmpConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a SnmpConfig.
     */
    data: XOR<SnmpConfigCreateInput, SnmpConfigUncheckedCreateInput>
  }

  /**
   * SnmpConfig createMany
   */
  export type SnmpConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SnmpConfigs.
     */
    data: SnmpConfigCreateManyInput | SnmpConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SnmpConfig createManyAndReturn
   */
  export type SnmpConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SnmpConfigs.
     */
    data: SnmpConfigCreateManyInput | SnmpConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SnmpConfig update
   */
  export type SnmpConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a SnmpConfig.
     */
    data: XOR<SnmpConfigUpdateInput, SnmpConfigUncheckedUpdateInput>
    /**
     * Choose, which SnmpConfig to update.
     */
    where: SnmpConfigWhereUniqueInput
  }

  /**
   * SnmpConfig updateMany
   */
  export type SnmpConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SnmpConfigs.
     */
    data: XOR<SnmpConfigUpdateManyMutationInput, SnmpConfigUncheckedUpdateManyInput>
    /**
     * Filter which SnmpConfigs to update
     */
    where?: SnmpConfigWhereInput
  }

  /**
   * SnmpConfig upsert
   */
  export type SnmpConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the SnmpConfig to update in case it exists.
     */
    where: SnmpConfigWhereUniqueInput
    /**
     * In case the SnmpConfig found by the `where` argument doesn't exist, create a new SnmpConfig with this data.
     */
    create: XOR<SnmpConfigCreateInput, SnmpConfigUncheckedCreateInput>
    /**
     * In case the SnmpConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnmpConfigUpdateInput, SnmpConfigUncheckedUpdateInput>
  }

  /**
   * SnmpConfig delete
   */
  export type SnmpConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
    /**
     * Filter which SnmpConfig to delete.
     */
    where: SnmpConfigWhereUniqueInput
  }

  /**
   * SnmpConfig deleteMany
   */
  export type SnmpConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnmpConfigs to delete
     */
    where?: SnmpConfigWhereInput
  }

  /**
   * SnmpConfig without action
   */
  export type SnmpConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnmpConfig
     */
    select?: SnmpConfigSelect<ExtArgs> | null
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


  export const AssetScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    subsystem: 'subsystem',
    parentId: 'parentId',
    criticality: 'criticality',
    specification: 'specification',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt',
    updatedAt: 'updatedAt'
  };

  export type AssetScalarFieldEnum = (typeof AssetScalarFieldEnum)[keyof typeof AssetScalarFieldEnum]


  export const TelemetryReadingScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    metric: 'metric',
    value: 'value',
    unit: 'unit',
    timestamp: 'timestamp'
  };

  export type TelemetryReadingScalarFieldEnum = (typeof TelemetryReadingScalarFieldEnum)[keyof typeof TelemetryReadingScalarFieldEnum]


  export const SnmpConfigScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    ip: 'ip',
    community: 'community',
    oid: 'oid',
    metricName: 'metricName',
    intervalSeconds: 'intervalSeconds',
    lastPolled: 'lastPolled'
  };

  export type SnmpConfigScalarFieldEnum = (typeof SnmpConfigScalarFieldEnum)[keyof typeof SnmpConfigScalarFieldEnum]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


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


  export type AssetWhereInput = {
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    id?: StringFilter<"Asset"> | string
    code?: StringFilter<"Asset"> | string
    name?: StringFilter<"Asset"> | string
    subsystem?: StringFilter<"Asset"> | string
    parentId?: StringNullableFilter<"Asset"> | string | null
    criticality?: StringFilter<"Asset"> | string
    specification?: JsonNullableFilter<"Asset">
    createdAt?: DateTimeFilter<"Asset"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Asset"> | Date | string | null
    updatedAt?: DateTimeFilter<"Asset"> | Date | string
    parent?: XOR<AssetNullableRelationFilter, AssetWhereInput> | null
    children?: AssetListRelationFilter
  }

  export type AssetOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    parentId?: SortOrderInput | SortOrder
    criticality?: SortOrder
    specification?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    parent?: AssetOrderByWithRelationInput
    children?: AssetOrderByRelationAggregateInput
  }

  export type AssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    name?: StringFilter<"Asset"> | string
    subsystem?: StringFilter<"Asset"> | string
    parentId?: StringNullableFilter<"Asset"> | string | null
    criticality?: StringFilter<"Asset"> | string
    specification?: JsonNullableFilter<"Asset">
    createdAt?: DateTimeFilter<"Asset"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Asset"> | Date | string | null
    updatedAt?: DateTimeFilter<"Asset"> | Date | string
    parent?: XOR<AssetNullableRelationFilter, AssetWhereInput> | null
    children?: AssetListRelationFilter
  }, "id" | "code">

  export type AssetOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    parentId?: SortOrderInput | SortOrder
    criticality?: SortOrder
    specification?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: AssetCountOrderByAggregateInput
    _max?: AssetMaxOrderByAggregateInput
    _min?: AssetMinOrderByAggregateInput
  }

  export type AssetScalarWhereWithAggregatesInput = {
    AND?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    OR?: AssetScalarWhereWithAggregatesInput[]
    NOT?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Asset"> | string
    code?: StringWithAggregatesFilter<"Asset"> | string
    name?: StringWithAggregatesFilter<"Asset"> | string
    subsystem?: StringWithAggregatesFilter<"Asset"> | string
    parentId?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    criticality?: StringWithAggregatesFilter<"Asset"> | string
    specification?: JsonNullableWithAggregatesFilter<"Asset">
    createdAt?: DateTimeWithAggregatesFilter<"Asset"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Asset"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"Asset"> | Date | string
  }

  export type TelemetryReadingWhereInput = {
    AND?: TelemetryReadingWhereInput | TelemetryReadingWhereInput[]
    OR?: TelemetryReadingWhereInput[]
    NOT?: TelemetryReadingWhereInput | TelemetryReadingWhereInput[]
    id?: StringFilter<"TelemetryReading"> | string
    assetId?: StringFilter<"TelemetryReading"> | string
    metric?: StringFilter<"TelemetryReading"> | string
    value?: FloatFilter<"TelemetryReading"> | number
    unit?: StringNullableFilter<"TelemetryReading"> | string | null
    timestamp?: DateTimeFilter<"TelemetryReading"> | Date | string
  }

  export type TelemetryReadingOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    unit?: SortOrderInput | SortOrder
    timestamp?: SortOrder
  }

  export type TelemetryReadingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TelemetryReadingWhereInput | TelemetryReadingWhereInput[]
    OR?: TelemetryReadingWhereInput[]
    NOT?: TelemetryReadingWhereInput | TelemetryReadingWhereInput[]
    assetId?: StringFilter<"TelemetryReading"> | string
    metric?: StringFilter<"TelemetryReading"> | string
    value?: FloatFilter<"TelemetryReading"> | number
    unit?: StringNullableFilter<"TelemetryReading"> | string | null
    timestamp?: DateTimeFilter<"TelemetryReading"> | Date | string
  }, "id">

  export type TelemetryReadingOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    unit?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: TelemetryReadingCountOrderByAggregateInput
    _avg?: TelemetryReadingAvgOrderByAggregateInput
    _max?: TelemetryReadingMaxOrderByAggregateInput
    _min?: TelemetryReadingMinOrderByAggregateInput
    _sum?: TelemetryReadingSumOrderByAggregateInput
  }

  export type TelemetryReadingScalarWhereWithAggregatesInput = {
    AND?: TelemetryReadingScalarWhereWithAggregatesInput | TelemetryReadingScalarWhereWithAggregatesInput[]
    OR?: TelemetryReadingScalarWhereWithAggregatesInput[]
    NOT?: TelemetryReadingScalarWhereWithAggregatesInput | TelemetryReadingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TelemetryReading"> | string
    assetId?: StringWithAggregatesFilter<"TelemetryReading"> | string
    metric?: StringWithAggregatesFilter<"TelemetryReading"> | string
    value?: FloatWithAggregatesFilter<"TelemetryReading"> | number
    unit?: StringNullableWithAggregatesFilter<"TelemetryReading"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"TelemetryReading"> | Date | string
  }

  export type SnmpConfigWhereInput = {
    AND?: SnmpConfigWhereInput | SnmpConfigWhereInput[]
    OR?: SnmpConfigWhereInput[]
    NOT?: SnmpConfigWhereInput | SnmpConfigWhereInput[]
    id?: StringFilter<"SnmpConfig"> | string
    assetId?: StringFilter<"SnmpConfig"> | string
    ip?: StringFilter<"SnmpConfig"> | string
    community?: StringFilter<"SnmpConfig"> | string
    oid?: StringFilter<"SnmpConfig"> | string
    metricName?: StringFilter<"SnmpConfig"> | string
    intervalSeconds?: IntFilter<"SnmpConfig"> | number
    lastPolled?: DateTimeNullableFilter<"SnmpConfig"> | Date | string | null
  }

  export type SnmpConfigOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    ip?: SortOrder
    community?: SortOrder
    oid?: SortOrder
    metricName?: SortOrder
    intervalSeconds?: SortOrder
    lastPolled?: SortOrderInput | SortOrder
  }

  export type SnmpConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    assetId?: string
    AND?: SnmpConfigWhereInput | SnmpConfigWhereInput[]
    OR?: SnmpConfigWhereInput[]
    NOT?: SnmpConfigWhereInput | SnmpConfigWhereInput[]
    ip?: StringFilter<"SnmpConfig"> | string
    community?: StringFilter<"SnmpConfig"> | string
    oid?: StringFilter<"SnmpConfig"> | string
    metricName?: StringFilter<"SnmpConfig"> | string
    intervalSeconds?: IntFilter<"SnmpConfig"> | number
    lastPolled?: DateTimeNullableFilter<"SnmpConfig"> | Date | string | null
  }, "id" | "assetId">

  export type SnmpConfigOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    ip?: SortOrder
    community?: SortOrder
    oid?: SortOrder
    metricName?: SortOrder
    intervalSeconds?: SortOrder
    lastPolled?: SortOrderInput | SortOrder
    _count?: SnmpConfigCountOrderByAggregateInput
    _avg?: SnmpConfigAvgOrderByAggregateInput
    _max?: SnmpConfigMaxOrderByAggregateInput
    _min?: SnmpConfigMinOrderByAggregateInput
    _sum?: SnmpConfigSumOrderByAggregateInput
  }

  export type SnmpConfigScalarWhereWithAggregatesInput = {
    AND?: SnmpConfigScalarWhereWithAggregatesInput | SnmpConfigScalarWhereWithAggregatesInput[]
    OR?: SnmpConfigScalarWhereWithAggregatesInput[]
    NOT?: SnmpConfigScalarWhereWithAggregatesInput | SnmpConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SnmpConfig"> | string
    assetId?: StringWithAggregatesFilter<"SnmpConfig"> | string
    ip?: StringWithAggregatesFilter<"SnmpConfig"> | string
    community?: StringWithAggregatesFilter<"SnmpConfig"> | string
    oid?: StringWithAggregatesFilter<"SnmpConfig"> | string
    metricName?: StringWithAggregatesFilter<"SnmpConfig"> | string
    intervalSeconds?: IntWithAggregatesFilter<"SnmpConfig"> | number
    lastPolled?: DateTimeNullableWithAggregatesFilter<"SnmpConfig"> | Date | string | null
  }

  export type AssetCreateInput = {
    id?: string
    code: string
    name: string
    subsystem: string
    criticality?: string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    parent?: AssetCreateNestedOneWithoutChildrenInput
    children?: AssetCreateNestedManyWithoutParentInput
  }

  export type AssetUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    subsystem: string
    parentId?: string | null
    criticality?: string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    children?: AssetUncheckedCreateNestedManyWithoutParentInput
  }

  export type AssetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    criticality?: StringFieldUpdateOperationsInput | string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: AssetUpdateOneWithoutChildrenNestedInput
    children?: AssetUpdateManyWithoutParentNestedInput
  }

  export type AssetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    criticality?: StringFieldUpdateOperationsInput | string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: AssetUncheckedUpdateManyWithoutParentNestedInput
  }

  export type AssetCreateManyInput = {
    id?: string
    code: string
    name: string
    subsystem: string
    parentId?: string | null
    criticality?: string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type AssetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    criticality?: StringFieldUpdateOperationsInput | string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    criticality?: StringFieldUpdateOperationsInput | string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryReadingCreateInput = {
    id?: string
    assetId: string
    metric: string
    value: number
    unit?: string | null
    timestamp?: Date | string
  }

  export type TelemetryReadingUncheckedCreateInput = {
    id?: string
    assetId: string
    metric: string
    value: number
    unit?: string | null
    timestamp?: Date | string
  }

  export type TelemetryReadingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    metric?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryReadingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    metric?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryReadingCreateManyInput = {
    id?: string
    assetId: string
    metric: string
    value: number
    unit?: string | null
    timestamp?: Date | string
  }

  export type TelemetryReadingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    metric?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryReadingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    metric?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnmpConfigCreateInput = {
    id?: string
    assetId: string
    ip: string
    community?: string
    oid: string
    metricName: string
    intervalSeconds?: number
    lastPolled?: Date | string | null
  }

  export type SnmpConfigUncheckedCreateInput = {
    id?: string
    assetId: string
    ip: string
    community?: string
    oid: string
    metricName: string
    intervalSeconds?: number
    lastPolled?: Date | string | null
  }

  export type SnmpConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    community?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    intervalSeconds?: IntFieldUpdateOperationsInput | number
    lastPolled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SnmpConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    community?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    intervalSeconds?: IntFieldUpdateOperationsInput | number
    lastPolled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SnmpConfigCreateManyInput = {
    id?: string
    assetId: string
    ip: string
    community?: string
    oid: string
    metricName: string
    intervalSeconds?: number
    lastPolled?: Date | string | null
  }

  export type SnmpConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    community?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    intervalSeconds?: IntFieldUpdateOperationsInput | number
    lastPolled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SnmpConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    community?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    intervalSeconds?: IntFieldUpdateOperationsInput | number
    lastPolled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type AssetNullableRelationFilter = {
    is?: AssetWhereInput | null
    isNot?: AssetWhereInput | null
  }

  export type AssetListRelationFilter = {
    every?: AssetWhereInput
    some?: AssetWhereInput
    none?: AssetWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AssetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssetCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    parentId?: SortOrder
    criticality?: SortOrder
    specification?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssetMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    parentId?: SortOrder
    criticality?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AssetMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    subsystem?: SortOrder
    parentId?: SortOrder
    criticality?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
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

  export type TelemetryReadingCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    timestamp?: SortOrder
  }

  export type TelemetryReadingAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type TelemetryReadingMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    timestamp?: SortOrder
  }

  export type TelemetryReadingMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    timestamp?: SortOrder
  }

  export type TelemetryReadingSumOrderByAggregateInput = {
    value?: SortOrder
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

  export type SnmpConfigCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    ip?: SortOrder
    community?: SortOrder
    oid?: SortOrder
    metricName?: SortOrder
    intervalSeconds?: SortOrder
    lastPolled?: SortOrder
  }

  export type SnmpConfigAvgOrderByAggregateInput = {
    intervalSeconds?: SortOrder
  }

  export type SnmpConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    ip?: SortOrder
    community?: SortOrder
    oid?: SortOrder
    metricName?: SortOrder
    intervalSeconds?: SortOrder
    lastPolled?: SortOrder
  }

  export type SnmpConfigMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    ip?: SortOrder
    community?: SortOrder
    oid?: SortOrder
    metricName?: SortOrder
    intervalSeconds?: SortOrder
    lastPolled?: SortOrder
  }

  export type SnmpConfigSumOrderByAggregateInput = {
    intervalSeconds?: SortOrder
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

  export type AssetCreateNestedOneWithoutChildrenInput = {
    create?: XOR<AssetCreateWithoutChildrenInput, AssetUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: AssetCreateOrConnectWithoutChildrenInput
    connect?: AssetWhereUniqueInput
  }

  export type AssetCreateNestedManyWithoutParentInput = {
    create?: XOR<AssetCreateWithoutParentInput, AssetUncheckedCreateWithoutParentInput> | AssetCreateWithoutParentInput[] | AssetUncheckedCreateWithoutParentInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutParentInput | AssetCreateOrConnectWithoutParentInput[]
    createMany?: AssetCreateManyParentInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type AssetUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<AssetCreateWithoutParentInput, AssetUncheckedCreateWithoutParentInput> | AssetCreateWithoutParentInput[] | AssetUncheckedCreateWithoutParentInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutParentInput | AssetCreateOrConnectWithoutParentInput[]
    createMany?: AssetCreateManyParentInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
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

  export type AssetUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<AssetCreateWithoutChildrenInput, AssetUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: AssetCreateOrConnectWithoutChildrenInput
    upsert?: AssetUpsertWithoutChildrenInput
    disconnect?: AssetWhereInput | boolean
    delete?: AssetWhereInput | boolean
    connect?: AssetWhereUniqueInput
    update?: XOR<XOR<AssetUpdateToOneWithWhereWithoutChildrenInput, AssetUpdateWithoutChildrenInput>, AssetUncheckedUpdateWithoutChildrenInput>
  }

  export type AssetUpdateManyWithoutParentNestedInput = {
    create?: XOR<AssetCreateWithoutParentInput, AssetUncheckedCreateWithoutParentInput> | AssetCreateWithoutParentInput[] | AssetUncheckedCreateWithoutParentInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutParentInput | AssetCreateOrConnectWithoutParentInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutParentInput | AssetUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: AssetCreateManyParentInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutParentInput | AssetUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutParentInput | AssetUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type AssetUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<AssetCreateWithoutParentInput, AssetUncheckedCreateWithoutParentInput> | AssetCreateWithoutParentInput[] | AssetUncheckedCreateWithoutParentInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutParentInput | AssetCreateOrConnectWithoutParentInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutParentInput | AssetUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: AssetCreateManyParentInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutParentInput | AssetUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutParentInput | AssetUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type AssetCreateWithoutChildrenInput = {
    id?: string
    code: string
    name: string
    subsystem: string
    criticality?: string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    parent?: AssetCreateNestedOneWithoutChildrenInput
  }

  export type AssetUncheckedCreateWithoutChildrenInput = {
    id?: string
    code: string
    name: string
    subsystem: string
    parentId?: string | null
    criticality?: string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type AssetCreateOrConnectWithoutChildrenInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutChildrenInput, AssetUncheckedCreateWithoutChildrenInput>
  }

  export type AssetCreateWithoutParentInput = {
    id?: string
    code: string
    name: string
    subsystem: string
    criticality?: string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    children?: AssetCreateNestedManyWithoutParentInput
  }

  export type AssetUncheckedCreateWithoutParentInput = {
    id?: string
    code: string
    name: string
    subsystem: string
    criticality?: string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    children?: AssetUncheckedCreateNestedManyWithoutParentInput
  }

  export type AssetCreateOrConnectWithoutParentInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutParentInput, AssetUncheckedCreateWithoutParentInput>
  }

  export type AssetCreateManyParentInputEnvelope = {
    data: AssetCreateManyParentInput | AssetCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type AssetUpsertWithoutChildrenInput = {
    update: XOR<AssetUpdateWithoutChildrenInput, AssetUncheckedUpdateWithoutChildrenInput>
    create: XOR<AssetCreateWithoutChildrenInput, AssetUncheckedCreateWithoutChildrenInput>
    where?: AssetWhereInput
  }

  export type AssetUpdateToOneWithWhereWithoutChildrenInput = {
    where?: AssetWhereInput
    data: XOR<AssetUpdateWithoutChildrenInput, AssetUncheckedUpdateWithoutChildrenInput>
  }

  export type AssetUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    criticality?: StringFieldUpdateOperationsInput | string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: AssetUpdateOneWithoutChildrenNestedInput
  }

  export type AssetUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    criticality?: StringFieldUpdateOperationsInput | string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetUpsertWithWhereUniqueWithoutParentInput = {
    where: AssetWhereUniqueInput
    update: XOR<AssetUpdateWithoutParentInput, AssetUncheckedUpdateWithoutParentInput>
    create: XOR<AssetCreateWithoutParentInput, AssetUncheckedCreateWithoutParentInput>
  }

  export type AssetUpdateWithWhereUniqueWithoutParentInput = {
    where: AssetWhereUniqueInput
    data: XOR<AssetUpdateWithoutParentInput, AssetUncheckedUpdateWithoutParentInput>
  }

  export type AssetUpdateManyWithWhereWithoutParentInput = {
    where: AssetScalarWhereInput
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyWithoutParentInput>
  }

  export type AssetScalarWhereInput = {
    AND?: AssetScalarWhereInput | AssetScalarWhereInput[]
    OR?: AssetScalarWhereInput[]
    NOT?: AssetScalarWhereInput | AssetScalarWhereInput[]
    id?: StringFilter<"Asset"> | string
    code?: StringFilter<"Asset"> | string
    name?: StringFilter<"Asset"> | string
    subsystem?: StringFilter<"Asset"> | string
    parentId?: StringNullableFilter<"Asset"> | string | null
    criticality?: StringFilter<"Asset"> | string
    specification?: JsonNullableFilter<"Asset">
    createdAt?: DateTimeFilter<"Asset"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Asset"> | Date | string | null
    updatedAt?: DateTimeFilter<"Asset"> | Date | string
  }

  export type AssetCreateManyParentInput = {
    id?: string
    code: string
    name: string
    subsystem: string
    criticality?: string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type AssetUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    criticality?: StringFieldUpdateOperationsInput | string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: AssetUpdateManyWithoutParentNestedInput
  }

  export type AssetUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    criticality?: StringFieldUpdateOperationsInput | string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: AssetUncheckedUpdateManyWithoutParentNestedInput
  }

  export type AssetUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subsystem?: StringFieldUpdateOperationsInput | string
    criticality?: StringFieldUpdateOperationsInput | string
    specification?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use AssetCountOutputTypeDefaultArgs instead
     */
    export type AssetCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AssetCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AssetDefaultArgs instead
     */
    export type AssetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AssetDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TelemetryReadingDefaultArgs instead
     */
    export type TelemetryReadingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TelemetryReadingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SnmpConfigDefaultArgs instead
     */
    export type SnmpConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SnmpConfigDefaultArgs<ExtArgs>

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