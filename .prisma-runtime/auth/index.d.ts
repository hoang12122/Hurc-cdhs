
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model PasswordResetRequest
 * 
 */
export type PasswordResetRequest = $Result.DefaultSelection<Prisma.$PasswordResetRequestPayload>
/**
 * Model TwoFADevice
 * 
 */
export type TwoFADevice = $Result.DefaultSelection<Prisma.$TwoFADevicePayload>
/**
 * Model BackupCode
 * 
 */
export type BackupCode = $Result.DefaultSelection<Prisma.$BackupCodePayload>
/**
 * Model AccessToken
 * 
 */
export type AccessToken = $Result.DefaultSelection<Prisma.$AccessTokenPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs>;

  /**
   * `prisma.passwordResetRequest`: Exposes CRUD operations for the **PasswordResetRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetRequests
    * const passwordResetRequests = await prisma.passwordResetRequest.findMany()
    * ```
    */
  get passwordResetRequest(): Prisma.PasswordResetRequestDelegate<ExtArgs>;

  /**
   * `prisma.twoFADevice`: Exposes CRUD operations for the **TwoFADevice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TwoFADevices
    * const twoFADevices = await prisma.twoFADevice.findMany()
    * ```
    */
  get twoFADevice(): Prisma.TwoFADeviceDelegate<ExtArgs>;

  /**
   * `prisma.backupCode`: Exposes CRUD operations for the **BackupCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BackupCodes
    * const backupCodes = await prisma.backupCode.findMany()
    * ```
    */
  get backupCode(): Prisma.BackupCodeDelegate<ExtArgs>;

  /**
   * `prisma.accessToken`: Exposes CRUD operations for the **AccessToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccessTokens
    * const accessTokens = await prisma.accessToken.findMany()
    * ```
    */
  get accessToken(): Prisma.AccessTokenDelegate<ExtArgs>;
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
    User: 'User',
    Role: 'Role',
    PasswordResetRequest: 'PasswordResetRequest',
    TwoFADevice: 'TwoFADevice',
    BackupCode: 'BackupCode',
    AccessToken: 'AccessToken'
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
      modelProps: "user" | "role" | "passwordResetRequest" | "twoFADevice" | "backupCode" | "accessToken"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetRequest: {
        payload: Prisma.$PasswordResetRequestPayload<ExtArgs>
        fields: Prisma.PasswordResetRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload>
          }
          findMany: {
            args: Prisma.PasswordResetRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload>[]
          }
          create: {
            args: Prisma.PasswordResetRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload>
          }
          createMany: {
            args: Prisma.PasswordResetRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload>[]
          }
          delete: {
            args: Prisma.PasswordResetRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload>
          }
          update: {
            args: Prisma.PasswordResetRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PasswordResetRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetRequestPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetRequest>
          }
          groupBy: {
            args: Prisma.PasswordResetRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetRequestCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetRequestCountAggregateOutputType> | number
          }
        }
      }
      TwoFADevice: {
        payload: Prisma.$TwoFADevicePayload<ExtArgs>
        fields: Prisma.TwoFADeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TwoFADeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TwoFADeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload>
          }
          findFirst: {
            args: Prisma.TwoFADeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TwoFADeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload>
          }
          findMany: {
            args: Prisma.TwoFADeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload>[]
          }
          create: {
            args: Prisma.TwoFADeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload>
          }
          createMany: {
            args: Prisma.TwoFADeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TwoFADeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload>[]
          }
          delete: {
            args: Prisma.TwoFADeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload>
          }
          update: {
            args: Prisma.TwoFADeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload>
          }
          deleteMany: {
            args: Prisma.TwoFADeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TwoFADeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TwoFADeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TwoFADevicePayload>
          }
          aggregate: {
            args: Prisma.TwoFADeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTwoFADevice>
          }
          groupBy: {
            args: Prisma.TwoFADeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<TwoFADeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.TwoFADeviceCountArgs<ExtArgs>
            result: $Utils.Optional<TwoFADeviceCountAggregateOutputType> | number
          }
        }
      }
      BackupCode: {
        payload: Prisma.$BackupCodePayload<ExtArgs>
        fields: Prisma.BackupCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackupCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackupCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          findFirst: {
            args: Prisma.BackupCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackupCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          findMany: {
            args: Prisma.BackupCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>[]
          }
          create: {
            args: Prisma.BackupCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          createMany: {
            args: Prisma.BackupCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BackupCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>[]
          }
          delete: {
            args: Prisma.BackupCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          update: {
            args: Prisma.BackupCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          deleteMany: {
            args: Prisma.BackupCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackupCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BackupCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupCodePayload>
          }
          aggregate: {
            args: Prisma.BackupCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackupCode>
          }
          groupBy: {
            args: Prisma.BackupCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackupCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackupCodeCountArgs<ExtArgs>
            result: $Utils.Optional<BackupCodeCountAggregateOutputType> | number
          }
        }
      }
      AccessToken: {
        payload: Prisma.$AccessTokenPayload<ExtArgs>
        fields: Prisma.AccessTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccessTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccessTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          findFirst: {
            args: Prisma.AccessTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccessTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          findMany: {
            args: Prisma.AccessTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>[]
          }
          create: {
            args: Prisma.AccessTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          createMany: {
            args: Prisma.AccessTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccessTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>[]
          }
          delete: {
            args: Prisma.AccessTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          update: {
            args: Prisma.AccessTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          deleteMany: {
            args: Prisma.AccessTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccessTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccessTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          aggregate: {
            args: Prisma.AccessTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccessToken>
          }
          groupBy: {
            args: Prisma.AccessTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccessTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccessTokenCountArgs<ExtArgs>
            result: $Utils.Optional<AccessTokenCountAggregateOutputType> | number
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    twoFADevices: number
    backupCodes: number
    accessTokens: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    twoFADevices?: boolean | UserCountOutputTypeCountTwoFADevicesArgs
    backupCodes?: boolean | UserCountOutputTypeCountBackupCodesArgs
    accessTokens?: boolean | UserCountOutputTypeCountAccessTokensArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTwoFADevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TwoFADeviceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBackupCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupCodeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccessTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessTokenWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    status: string | null
    department: string | null
    isVerified: boolean | null
    passwordLastChangedAt: Date | null
    avatarUrl: string | null
    verificationOtp: string | null
    otpExpiry: Date | null
    twoFactorEnabled: boolean | null
    createdAt: Date | null
    deletedAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    status: string | null
    department: string | null
    isVerified: boolean | null
    passwordLastChangedAt: Date | null
    avatarUrl: string | null
    verificationOtp: string | null
    otpExpiry: Date | null
    twoFactorEnabled: boolean | null
    createdAt: Date | null
    deletedAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    status: number
    department: number
    isVerified: number
    passwordLastChangedAt: number
    permissions: number
    assignedSubsystems: number
    avatarUrl: number
    verificationOtp: number
    otpExpiry: number
    twoFactorEnabled: number
    createdAt: number
    deletedAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    status?: true
    department?: true
    isVerified?: true
    passwordLastChangedAt?: true
    avatarUrl?: true
    verificationOtp?: true
    otpExpiry?: true
    twoFactorEnabled?: true
    createdAt?: true
    deletedAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    status?: true
    department?: true
    isVerified?: true
    passwordLastChangedAt?: true
    avatarUrl?: true
    verificationOtp?: true
    otpExpiry?: true
    twoFactorEnabled?: true
    createdAt?: true
    deletedAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    status?: true
    department?: true
    isVerified?: true
    passwordLastChangedAt?: true
    permissions?: true
    assignedSubsystems?: true
    avatarUrl?: true
    verificationOtp?: true
    otpExpiry?: true
    twoFactorEnabled?: true
    createdAt?: true
    deletedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string | null
    role: string
    status: string
    department: string | null
    isVerified: boolean
    passwordLastChangedAt: Date | null
    permissions: string[]
    assignedSubsystems: string[]
    avatarUrl: string | null
    verificationOtp: string | null
    otpExpiry: Date | null
    twoFactorEnabled: boolean
    createdAt: Date
    deletedAt: Date | null
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    department?: boolean
    isVerified?: boolean
    passwordLastChangedAt?: boolean
    permissions?: boolean
    assignedSubsystems?: boolean
    avatarUrl?: boolean
    verificationOtp?: boolean
    otpExpiry?: boolean
    twoFactorEnabled?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    updatedAt?: boolean
    twoFADevices?: boolean | User$twoFADevicesArgs<ExtArgs>
    backupCodes?: boolean | User$backupCodesArgs<ExtArgs>
    accessTokens?: boolean | User$accessTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    department?: boolean
    isVerified?: boolean
    passwordLastChangedAt?: boolean
    permissions?: boolean
    assignedSubsystems?: boolean
    avatarUrl?: boolean
    verificationOtp?: boolean
    otpExpiry?: boolean
    twoFactorEnabled?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    department?: boolean
    isVerified?: boolean
    passwordLastChangedAt?: boolean
    permissions?: boolean
    assignedSubsystems?: boolean
    avatarUrl?: boolean
    verificationOtp?: boolean
    otpExpiry?: boolean
    twoFactorEnabled?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    twoFADevices?: boolean | User$twoFADevicesArgs<ExtArgs>
    backupCodes?: boolean | User$backupCodesArgs<ExtArgs>
    accessTokens?: boolean | User$accessTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      twoFADevices: Prisma.$TwoFADevicePayload<ExtArgs>[]
      backupCodes: Prisma.$BackupCodePayload<ExtArgs>[]
      accessTokens: Prisma.$AccessTokenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string | null
      role: string
      status: string
      department: string | null
      isVerified: boolean
      passwordLastChangedAt: Date | null
      permissions: string[]
      assignedSubsystems: string[]
      avatarUrl: string | null
      verificationOtp: string | null
      otpExpiry: Date | null
      twoFactorEnabled: boolean
      createdAt: Date
      deletedAt: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    twoFADevices<T extends User$twoFADevicesArgs<ExtArgs> = {}>(args?: Subset<T, User$twoFADevicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "findMany"> | Null>
    backupCodes<T extends User$backupCodesArgs<ExtArgs> = {}>(args?: Subset<T, User$backupCodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findMany"> | Null>
    accessTokens<T extends User$accessTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$accessTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'String'>
    readonly department: FieldRef<"User", 'String'>
    readonly isVerified: FieldRef<"User", 'Boolean'>
    readonly passwordLastChangedAt: FieldRef<"User", 'DateTime'>
    readonly permissions: FieldRef<"User", 'String[]'>
    readonly assignedSubsystems: FieldRef<"User", 'String[]'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly verificationOtp: FieldRef<"User", 'String'>
    readonly otpExpiry: FieldRef<"User", 'DateTime'>
    readonly twoFactorEnabled: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.twoFADevices
   */
  export type User$twoFADevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    where?: TwoFADeviceWhereInput
    orderBy?: TwoFADeviceOrderByWithRelationInput | TwoFADeviceOrderByWithRelationInput[]
    cursor?: TwoFADeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TwoFADeviceScalarFieldEnum | TwoFADeviceScalarFieldEnum[]
  }

  /**
   * User.backupCodes
   */
  export type User$backupCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    where?: BackupCodeWhereInput
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    cursor?: BackupCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BackupCodeScalarFieldEnum | BackupCodeScalarFieldEnum[]
  }

  /**
   * User.accessTokens
   */
  export type User$accessTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    where?: AccessTokenWhereInput
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    cursor?: AccessTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccessTokenScalarFieldEnum | AccessTokenScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type RoleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    name: number
    description: number
    permissions: number
    _all: number
  }


  export type RoleMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    permissions?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: string
    name: string
    description: string
    permissions: string[]
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
  }


  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      permissions: string[]
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
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
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Role model
   */ 
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'String'>
    readonly name: FieldRef<"Role", 'String'>
    readonly description: FieldRef<"Role", 'String'>
    readonly permissions: FieldRef<"Role", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
  }


  /**
   * Model PasswordResetRequest
   */

  export type AggregatePasswordResetRequest = {
    _count: PasswordResetRequestCountAggregateOutputType | null
    _min: PasswordResetRequestMinAggregateOutputType | null
    _max: PasswordResetRequestMaxAggregateOutputType | null
  }

  export type PasswordResetRequestMinAggregateOutputType = {
    id: string | null
    userId: string | null
    userEmail: string | null
    userName: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PasswordResetRequestMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    userEmail: string | null
    userName: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PasswordResetRequestCountAggregateOutputType = {
    id: number
    userId: number
    userEmail: number
    userName: number
    status: number
    createdAt: number
    _all: number
  }


  export type PasswordResetRequestMinAggregateInputType = {
    id?: true
    userId?: true
    userEmail?: true
    userName?: true
    status?: true
    createdAt?: true
  }

  export type PasswordResetRequestMaxAggregateInputType = {
    id?: true
    userId?: true
    userEmail?: true
    userName?: true
    status?: true
    createdAt?: true
  }

  export type PasswordResetRequestCountAggregateInputType = {
    id?: true
    userId?: true
    userEmail?: true
    userName?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetRequest to aggregate.
     */
    where?: PasswordResetRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetRequests to fetch.
     */
    orderBy?: PasswordResetRequestOrderByWithRelationInput | PasswordResetRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetRequests
    **/
    _count?: true | PasswordResetRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetRequestMaxAggregateInputType
  }

  export type GetPasswordResetRequestAggregateType<T extends PasswordResetRequestAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetRequest[P]>
      : GetScalarType<T[P], AggregatePasswordResetRequest[P]>
  }




  export type PasswordResetRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetRequestWhereInput
    orderBy?: PasswordResetRequestOrderByWithAggregationInput | PasswordResetRequestOrderByWithAggregationInput[]
    by: PasswordResetRequestScalarFieldEnum[] | PasswordResetRequestScalarFieldEnum
    having?: PasswordResetRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetRequestCountAggregateInputType | true
    _min?: PasswordResetRequestMinAggregateInputType
    _max?: PasswordResetRequestMaxAggregateInputType
  }

  export type PasswordResetRequestGroupByOutputType = {
    id: string
    userId: string
    userEmail: string
    userName: string
    status: string
    createdAt: Date
    _count: PasswordResetRequestCountAggregateOutputType | null
    _min: PasswordResetRequestMinAggregateOutputType | null
    _max: PasswordResetRequestMaxAggregateOutputType | null
  }

  type GetPasswordResetRequestGroupByPayload<T extends PasswordResetRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetRequestGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetRequestGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    userName?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordResetRequest"]>

  export type PasswordResetRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    userName?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordResetRequest"]>

  export type PasswordResetRequestSelectScalar = {
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    userName?: boolean
    status?: boolean
    createdAt?: boolean
  }


  export type $PasswordResetRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      userEmail: string
      userName: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["passwordResetRequest"]>
    composites: {}
  }

  type PasswordResetRequestGetPayload<S extends boolean | null | undefined | PasswordResetRequestDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetRequestPayload, S>

  type PasswordResetRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PasswordResetRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PasswordResetRequestCountAggregateInputType | true
    }

  export interface PasswordResetRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetRequest'], meta: { name: 'PasswordResetRequest' } }
    /**
     * Find zero or one PasswordResetRequest that matches the filter.
     * @param {PasswordResetRequestFindUniqueArgs} args - Arguments to find a PasswordResetRequest
     * @example
     * // Get one PasswordResetRequest
     * const passwordResetRequest = await prisma.passwordResetRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetRequestFindUniqueArgs>(args: SelectSubset<T, PasswordResetRequestFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetRequestClient<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PasswordResetRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PasswordResetRequestFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetRequest
     * @example
     * // Get one PasswordResetRequest
     * const passwordResetRequest = await prisma.passwordResetRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetRequestClient<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PasswordResetRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetRequestFindFirstArgs} args - Arguments to find a PasswordResetRequest
     * @example
     * // Get one PasswordResetRequest
     * const passwordResetRequest = await prisma.passwordResetRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetRequestFindFirstArgs>(args?: SelectSubset<T, PasswordResetRequestFindFirstArgs<ExtArgs>>): Prisma__PasswordResetRequestClient<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PasswordResetRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetRequestFindFirstOrThrowArgs} args - Arguments to find a PasswordResetRequest
     * @example
     * // Get one PasswordResetRequest
     * const passwordResetRequest = await prisma.passwordResetRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetRequestClient<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PasswordResetRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetRequests
     * const passwordResetRequests = await prisma.passwordResetRequest.findMany()
     * 
     * // Get first 10 PasswordResetRequests
     * const passwordResetRequests = await prisma.passwordResetRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetRequestWithIdOnly = await prisma.passwordResetRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetRequestFindManyArgs>(args?: SelectSubset<T, PasswordResetRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PasswordResetRequest.
     * @param {PasswordResetRequestCreateArgs} args - Arguments to create a PasswordResetRequest.
     * @example
     * // Create one PasswordResetRequest
     * const PasswordResetRequest = await prisma.passwordResetRequest.create({
     *   data: {
     *     // ... data to create a PasswordResetRequest
     *   }
     * })
     * 
     */
    create<T extends PasswordResetRequestCreateArgs>(args: SelectSubset<T, PasswordResetRequestCreateArgs<ExtArgs>>): Prisma__PasswordResetRequestClient<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PasswordResetRequests.
     * @param {PasswordResetRequestCreateManyArgs} args - Arguments to create many PasswordResetRequests.
     * @example
     * // Create many PasswordResetRequests
     * const passwordResetRequest = await prisma.passwordResetRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetRequestCreateManyArgs>(args?: SelectSubset<T, PasswordResetRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResetRequests and returns the data saved in the database.
     * @param {PasswordResetRequestCreateManyAndReturnArgs} args - Arguments to create many PasswordResetRequests.
     * @example
     * // Create many PasswordResetRequests
     * const passwordResetRequest = await prisma.passwordResetRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResetRequests and only return the `id`
     * const passwordResetRequestWithIdOnly = await prisma.passwordResetRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PasswordResetRequest.
     * @param {PasswordResetRequestDeleteArgs} args - Arguments to delete one PasswordResetRequest.
     * @example
     * // Delete one PasswordResetRequest
     * const PasswordResetRequest = await prisma.passwordResetRequest.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetRequest
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetRequestDeleteArgs>(args: SelectSubset<T, PasswordResetRequestDeleteArgs<ExtArgs>>): Prisma__PasswordResetRequestClient<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PasswordResetRequest.
     * @param {PasswordResetRequestUpdateArgs} args - Arguments to update one PasswordResetRequest.
     * @example
     * // Update one PasswordResetRequest
     * const passwordResetRequest = await prisma.passwordResetRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetRequestUpdateArgs>(args: SelectSubset<T, PasswordResetRequestUpdateArgs<ExtArgs>>): Prisma__PasswordResetRequestClient<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PasswordResetRequests.
     * @param {PasswordResetRequestDeleteManyArgs} args - Arguments to filter PasswordResetRequests to delete.
     * @example
     * // Delete a few PasswordResetRequests
     * const { count } = await prisma.passwordResetRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetRequestDeleteManyArgs>(args?: SelectSubset<T, PasswordResetRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetRequests
     * const passwordResetRequest = await prisma.passwordResetRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetRequestUpdateManyArgs>(args: SelectSubset<T, PasswordResetRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PasswordResetRequest.
     * @param {PasswordResetRequestUpsertArgs} args - Arguments to update or create a PasswordResetRequest.
     * @example
     * // Update or create a PasswordResetRequest
     * const passwordResetRequest = await prisma.passwordResetRequest.upsert({
     *   create: {
     *     // ... data to create a PasswordResetRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetRequest we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetRequestUpsertArgs>(args: SelectSubset<T, PasswordResetRequestUpsertArgs<ExtArgs>>): Prisma__PasswordResetRequestClient<$Result.GetResult<Prisma.$PasswordResetRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PasswordResetRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetRequestCountArgs} args - Arguments to filter PasswordResetRequests to count.
     * @example
     * // Count the number of PasswordResetRequests
     * const count = await prisma.passwordResetRequest.count({
     *   where: {
     *     // ... the filter for the PasswordResetRequests we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetRequestCountArgs>(
      args?: Subset<T, PasswordResetRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PasswordResetRequestAggregateArgs>(args: Subset<T, PasswordResetRequestAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetRequestAggregateType<T>>

    /**
     * Group by PasswordResetRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetRequestGroupByArgs} args - Group by arguments.
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
      T extends PasswordResetRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetRequestGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetRequestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PasswordResetRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetRequest model
   */
  readonly fields: PasswordResetRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PasswordResetRequest model
   */ 
  interface PasswordResetRequestFieldRefs {
    readonly id: FieldRef<"PasswordResetRequest", 'String'>
    readonly userId: FieldRef<"PasswordResetRequest", 'String'>
    readonly userEmail: FieldRef<"PasswordResetRequest", 'String'>
    readonly userName: FieldRef<"PasswordResetRequest", 'String'>
    readonly status: FieldRef<"PasswordResetRequest", 'String'>
    readonly createdAt: FieldRef<"PasswordResetRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetRequest findUnique
   */
  export type PasswordResetRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
    /**
     * Filter, which PasswordResetRequest to fetch.
     */
    where: PasswordResetRequestWhereUniqueInput
  }

  /**
   * PasswordResetRequest findUniqueOrThrow
   */
  export type PasswordResetRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
    /**
     * Filter, which PasswordResetRequest to fetch.
     */
    where: PasswordResetRequestWhereUniqueInput
  }

  /**
   * PasswordResetRequest findFirst
   */
  export type PasswordResetRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
    /**
     * Filter, which PasswordResetRequest to fetch.
     */
    where?: PasswordResetRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetRequests to fetch.
     */
    orderBy?: PasswordResetRequestOrderByWithRelationInput | PasswordResetRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetRequests.
     */
    cursor?: PasswordResetRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetRequests.
     */
    distinct?: PasswordResetRequestScalarFieldEnum | PasswordResetRequestScalarFieldEnum[]
  }

  /**
   * PasswordResetRequest findFirstOrThrow
   */
  export type PasswordResetRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
    /**
     * Filter, which PasswordResetRequest to fetch.
     */
    where?: PasswordResetRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetRequests to fetch.
     */
    orderBy?: PasswordResetRequestOrderByWithRelationInput | PasswordResetRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetRequests.
     */
    cursor?: PasswordResetRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetRequests.
     */
    distinct?: PasswordResetRequestScalarFieldEnum | PasswordResetRequestScalarFieldEnum[]
  }

  /**
   * PasswordResetRequest findMany
   */
  export type PasswordResetRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
    /**
     * Filter, which PasswordResetRequests to fetch.
     */
    where?: PasswordResetRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetRequests to fetch.
     */
    orderBy?: PasswordResetRequestOrderByWithRelationInput | PasswordResetRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetRequests.
     */
    cursor?: PasswordResetRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetRequests.
     */
    skip?: number
    distinct?: PasswordResetRequestScalarFieldEnum | PasswordResetRequestScalarFieldEnum[]
  }

  /**
   * PasswordResetRequest create
   */
  export type PasswordResetRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetRequest.
     */
    data: XOR<PasswordResetRequestCreateInput, PasswordResetRequestUncheckedCreateInput>
  }

  /**
   * PasswordResetRequest createMany
   */
  export type PasswordResetRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetRequests.
     */
    data: PasswordResetRequestCreateManyInput | PasswordResetRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetRequest createManyAndReturn
   */
  export type PasswordResetRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PasswordResetRequests.
     */
    data: PasswordResetRequestCreateManyInput | PasswordResetRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetRequest update
   */
  export type PasswordResetRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetRequest.
     */
    data: XOR<PasswordResetRequestUpdateInput, PasswordResetRequestUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetRequest to update.
     */
    where: PasswordResetRequestWhereUniqueInput
  }

  /**
   * PasswordResetRequest updateMany
   */
  export type PasswordResetRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetRequests.
     */
    data: XOR<PasswordResetRequestUpdateManyMutationInput, PasswordResetRequestUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetRequests to update
     */
    where?: PasswordResetRequestWhereInput
  }

  /**
   * PasswordResetRequest upsert
   */
  export type PasswordResetRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetRequest to update in case it exists.
     */
    where: PasswordResetRequestWhereUniqueInput
    /**
     * In case the PasswordResetRequest found by the `where` argument doesn't exist, create a new PasswordResetRequest with this data.
     */
    create: XOR<PasswordResetRequestCreateInput, PasswordResetRequestUncheckedCreateInput>
    /**
     * In case the PasswordResetRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetRequestUpdateInput, PasswordResetRequestUncheckedUpdateInput>
  }

  /**
   * PasswordResetRequest delete
   */
  export type PasswordResetRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
    /**
     * Filter which PasswordResetRequest to delete.
     */
    where: PasswordResetRequestWhereUniqueInput
  }

  /**
   * PasswordResetRequest deleteMany
   */
  export type PasswordResetRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetRequests to delete
     */
    where?: PasswordResetRequestWhereInput
  }

  /**
   * PasswordResetRequest without action
   */
  export type PasswordResetRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetRequest
     */
    select?: PasswordResetRequestSelect<ExtArgs> | null
  }


  /**
   * Model TwoFADevice
   */

  export type AggregateTwoFADevice = {
    _count: TwoFADeviceCountAggregateOutputType | null
    _min: TwoFADeviceMinAggregateOutputType | null
    _max: TwoFADeviceMaxAggregateOutputType | null
  }

  export type TwoFADeviceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    name: string | null
    secret: string | null
    isDefault: boolean | null
    confirmed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TwoFADeviceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    name: string | null
    secret: string | null
    isDefault: boolean | null
    confirmed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TwoFADeviceCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    name: number
    secret: number
    isDefault: number
    confirmed: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TwoFADeviceMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    name?: true
    secret?: true
    isDefault?: true
    confirmed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TwoFADeviceMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    name?: true
    secret?: true
    isDefault?: true
    confirmed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TwoFADeviceCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    name?: true
    secret?: true
    isDefault?: true
    confirmed?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TwoFADeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TwoFADevice to aggregate.
     */
    where?: TwoFADeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TwoFADevices to fetch.
     */
    orderBy?: TwoFADeviceOrderByWithRelationInput | TwoFADeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TwoFADeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TwoFADevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TwoFADevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TwoFADevices
    **/
    _count?: true | TwoFADeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TwoFADeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TwoFADeviceMaxAggregateInputType
  }

  export type GetTwoFADeviceAggregateType<T extends TwoFADeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateTwoFADevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTwoFADevice[P]>
      : GetScalarType<T[P], AggregateTwoFADevice[P]>
  }




  export type TwoFADeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TwoFADeviceWhereInput
    orderBy?: TwoFADeviceOrderByWithAggregationInput | TwoFADeviceOrderByWithAggregationInput[]
    by: TwoFADeviceScalarFieldEnum[] | TwoFADeviceScalarFieldEnum
    having?: TwoFADeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TwoFADeviceCountAggregateInputType | true
    _min?: TwoFADeviceMinAggregateInputType
    _max?: TwoFADeviceMaxAggregateInputType
  }

  export type TwoFADeviceGroupByOutputType = {
    id: string
    userId: string
    type: string
    name: string
    secret: string
    isDefault: boolean
    confirmed: boolean
    createdAt: Date
    updatedAt: Date
    _count: TwoFADeviceCountAggregateOutputType | null
    _min: TwoFADeviceMinAggregateOutputType | null
    _max: TwoFADeviceMaxAggregateOutputType | null
  }

  type GetTwoFADeviceGroupByPayload<T extends TwoFADeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TwoFADeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TwoFADeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TwoFADeviceGroupByOutputType[P]>
            : GetScalarType<T[P], TwoFADeviceGroupByOutputType[P]>
        }
      >
    >


  export type TwoFADeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    name?: boolean
    secret?: boolean
    isDefault?: boolean
    confirmed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["twoFADevice"]>

  export type TwoFADeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    name?: boolean
    secret?: boolean
    isDefault?: boolean
    confirmed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["twoFADevice"]>

  export type TwoFADeviceSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    name?: boolean
    secret?: boolean
    isDefault?: boolean
    confirmed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TwoFADeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TwoFADeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TwoFADevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TwoFADevice"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      name: string
      secret: string
      isDefault: boolean
      confirmed: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["twoFADevice"]>
    composites: {}
  }

  type TwoFADeviceGetPayload<S extends boolean | null | undefined | TwoFADeviceDefaultArgs> = $Result.GetResult<Prisma.$TwoFADevicePayload, S>

  type TwoFADeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TwoFADeviceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TwoFADeviceCountAggregateInputType | true
    }

  export interface TwoFADeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TwoFADevice'], meta: { name: 'TwoFADevice' } }
    /**
     * Find zero or one TwoFADevice that matches the filter.
     * @param {TwoFADeviceFindUniqueArgs} args - Arguments to find a TwoFADevice
     * @example
     * // Get one TwoFADevice
     * const twoFADevice = await prisma.twoFADevice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TwoFADeviceFindUniqueArgs>(args: SelectSubset<T, TwoFADeviceFindUniqueArgs<ExtArgs>>): Prisma__TwoFADeviceClient<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TwoFADevice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TwoFADeviceFindUniqueOrThrowArgs} args - Arguments to find a TwoFADevice
     * @example
     * // Get one TwoFADevice
     * const twoFADevice = await prisma.twoFADevice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TwoFADeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, TwoFADeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TwoFADeviceClient<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TwoFADevice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwoFADeviceFindFirstArgs} args - Arguments to find a TwoFADevice
     * @example
     * // Get one TwoFADevice
     * const twoFADevice = await prisma.twoFADevice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TwoFADeviceFindFirstArgs>(args?: SelectSubset<T, TwoFADeviceFindFirstArgs<ExtArgs>>): Prisma__TwoFADeviceClient<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TwoFADevice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwoFADeviceFindFirstOrThrowArgs} args - Arguments to find a TwoFADevice
     * @example
     * // Get one TwoFADevice
     * const twoFADevice = await prisma.twoFADevice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TwoFADeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, TwoFADeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__TwoFADeviceClient<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TwoFADevices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwoFADeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TwoFADevices
     * const twoFADevices = await prisma.twoFADevice.findMany()
     * 
     * // Get first 10 TwoFADevices
     * const twoFADevices = await prisma.twoFADevice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const twoFADeviceWithIdOnly = await prisma.twoFADevice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TwoFADeviceFindManyArgs>(args?: SelectSubset<T, TwoFADeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TwoFADevice.
     * @param {TwoFADeviceCreateArgs} args - Arguments to create a TwoFADevice.
     * @example
     * // Create one TwoFADevice
     * const TwoFADevice = await prisma.twoFADevice.create({
     *   data: {
     *     // ... data to create a TwoFADevice
     *   }
     * })
     * 
     */
    create<T extends TwoFADeviceCreateArgs>(args: SelectSubset<T, TwoFADeviceCreateArgs<ExtArgs>>): Prisma__TwoFADeviceClient<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TwoFADevices.
     * @param {TwoFADeviceCreateManyArgs} args - Arguments to create many TwoFADevices.
     * @example
     * // Create many TwoFADevices
     * const twoFADevice = await prisma.twoFADevice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TwoFADeviceCreateManyArgs>(args?: SelectSubset<T, TwoFADeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TwoFADevices and returns the data saved in the database.
     * @param {TwoFADeviceCreateManyAndReturnArgs} args - Arguments to create many TwoFADevices.
     * @example
     * // Create many TwoFADevices
     * const twoFADevice = await prisma.twoFADevice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TwoFADevices and only return the `id`
     * const twoFADeviceWithIdOnly = await prisma.twoFADevice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TwoFADeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, TwoFADeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TwoFADevice.
     * @param {TwoFADeviceDeleteArgs} args - Arguments to delete one TwoFADevice.
     * @example
     * // Delete one TwoFADevice
     * const TwoFADevice = await prisma.twoFADevice.delete({
     *   where: {
     *     // ... filter to delete one TwoFADevice
     *   }
     * })
     * 
     */
    delete<T extends TwoFADeviceDeleteArgs>(args: SelectSubset<T, TwoFADeviceDeleteArgs<ExtArgs>>): Prisma__TwoFADeviceClient<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TwoFADevice.
     * @param {TwoFADeviceUpdateArgs} args - Arguments to update one TwoFADevice.
     * @example
     * // Update one TwoFADevice
     * const twoFADevice = await prisma.twoFADevice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TwoFADeviceUpdateArgs>(args: SelectSubset<T, TwoFADeviceUpdateArgs<ExtArgs>>): Prisma__TwoFADeviceClient<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TwoFADevices.
     * @param {TwoFADeviceDeleteManyArgs} args - Arguments to filter TwoFADevices to delete.
     * @example
     * // Delete a few TwoFADevices
     * const { count } = await prisma.twoFADevice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TwoFADeviceDeleteManyArgs>(args?: SelectSubset<T, TwoFADeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TwoFADevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwoFADeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TwoFADevices
     * const twoFADevice = await prisma.twoFADevice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TwoFADeviceUpdateManyArgs>(args: SelectSubset<T, TwoFADeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TwoFADevice.
     * @param {TwoFADeviceUpsertArgs} args - Arguments to update or create a TwoFADevice.
     * @example
     * // Update or create a TwoFADevice
     * const twoFADevice = await prisma.twoFADevice.upsert({
     *   create: {
     *     // ... data to create a TwoFADevice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TwoFADevice we want to update
     *   }
     * })
     */
    upsert<T extends TwoFADeviceUpsertArgs>(args: SelectSubset<T, TwoFADeviceUpsertArgs<ExtArgs>>): Prisma__TwoFADeviceClient<$Result.GetResult<Prisma.$TwoFADevicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TwoFADevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwoFADeviceCountArgs} args - Arguments to filter TwoFADevices to count.
     * @example
     * // Count the number of TwoFADevices
     * const count = await prisma.twoFADevice.count({
     *   where: {
     *     // ... the filter for the TwoFADevices we want to count
     *   }
     * })
    **/
    count<T extends TwoFADeviceCountArgs>(
      args?: Subset<T, TwoFADeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TwoFADeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TwoFADevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwoFADeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TwoFADeviceAggregateArgs>(args: Subset<T, TwoFADeviceAggregateArgs>): Prisma.PrismaPromise<GetTwoFADeviceAggregateType<T>>

    /**
     * Group by TwoFADevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TwoFADeviceGroupByArgs} args - Group by arguments.
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
      T extends TwoFADeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TwoFADeviceGroupByArgs['orderBy'] }
        : { orderBy?: TwoFADeviceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TwoFADeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTwoFADeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TwoFADevice model
   */
  readonly fields: TwoFADeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TwoFADevice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TwoFADeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the TwoFADevice model
   */ 
  interface TwoFADeviceFieldRefs {
    readonly id: FieldRef<"TwoFADevice", 'String'>
    readonly userId: FieldRef<"TwoFADevice", 'String'>
    readonly type: FieldRef<"TwoFADevice", 'String'>
    readonly name: FieldRef<"TwoFADevice", 'String'>
    readonly secret: FieldRef<"TwoFADevice", 'String'>
    readonly isDefault: FieldRef<"TwoFADevice", 'Boolean'>
    readonly confirmed: FieldRef<"TwoFADevice", 'Boolean'>
    readonly createdAt: FieldRef<"TwoFADevice", 'DateTime'>
    readonly updatedAt: FieldRef<"TwoFADevice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TwoFADevice findUnique
   */
  export type TwoFADeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    /**
     * Filter, which TwoFADevice to fetch.
     */
    where: TwoFADeviceWhereUniqueInput
  }

  /**
   * TwoFADevice findUniqueOrThrow
   */
  export type TwoFADeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    /**
     * Filter, which TwoFADevice to fetch.
     */
    where: TwoFADeviceWhereUniqueInput
  }

  /**
   * TwoFADevice findFirst
   */
  export type TwoFADeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    /**
     * Filter, which TwoFADevice to fetch.
     */
    where?: TwoFADeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TwoFADevices to fetch.
     */
    orderBy?: TwoFADeviceOrderByWithRelationInput | TwoFADeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TwoFADevices.
     */
    cursor?: TwoFADeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TwoFADevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TwoFADevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TwoFADevices.
     */
    distinct?: TwoFADeviceScalarFieldEnum | TwoFADeviceScalarFieldEnum[]
  }

  /**
   * TwoFADevice findFirstOrThrow
   */
  export type TwoFADeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    /**
     * Filter, which TwoFADevice to fetch.
     */
    where?: TwoFADeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TwoFADevices to fetch.
     */
    orderBy?: TwoFADeviceOrderByWithRelationInput | TwoFADeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TwoFADevices.
     */
    cursor?: TwoFADeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TwoFADevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TwoFADevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TwoFADevices.
     */
    distinct?: TwoFADeviceScalarFieldEnum | TwoFADeviceScalarFieldEnum[]
  }

  /**
   * TwoFADevice findMany
   */
  export type TwoFADeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    /**
     * Filter, which TwoFADevices to fetch.
     */
    where?: TwoFADeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TwoFADevices to fetch.
     */
    orderBy?: TwoFADeviceOrderByWithRelationInput | TwoFADeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TwoFADevices.
     */
    cursor?: TwoFADeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TwoFADevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TwoFADevices.
     */
    skip?: number
    distinct?: TwoFADeviceScalarFieldEnum | TwoFADeviceScalarFieldEnum[]
  }

  /**
   * TwoFADevice create
   */
  export type TwoFADeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a TwoFADevice.
     */
    data: XOR<TwoFADeviceCreateInput, TwoFADeviceUncheckedCreateInput>
  }

  /**
   * TwoFADevice createMany
   */
  export type TwoFADeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TwoFADevices.
     */
    data: TwoFADeviceCreateManyInput | TwoFADeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TwoFADevice createManyAndReturn
   */
  export type TwoFADeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TwoFADevices.
     */
    data: TwoFADeviceCreateManyInput | TwoFADeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TwoFADevice update
   */
  export type TwoFADeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a TwoFADevice.
     */
    data: XOR<TwoFADeviceUpdateInput, TwoFADeviceUncheckedUpdateInput>
    /**
     * Choose, which TwoFADevice to update.
     */
    where: TwoFADeviceWhereUniqueInput
  }

  /**
   * TwoFADevice updateMany
   */
  export type TwoFADeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TwoFADevices.
     */
    data: XOR<TwoFADeviceUpdateManyMutationInput, TwoFADeviceUncheckedUpdateManyInput>
    /**
     * Filter which TwoFADevices to update
     */
    where?: TwoFADeviceWhereInput
  }

  /**
   * TwoFADevice upsert
   */
  export type TwoFADeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the TwoFADevice to update in case it exists.
     */
    where: TwoFADeviceWhereUniqueInput
    /**
     * In case the TwoFADevice found by the `where` argument doesn't exist, create a new TwoFADevice with this data.
     */
    create: XOR<TwoFADeviceCreateInput, TwoFADeviceUncheckedCreateInput>
    /**
     * In case the TwoFADevice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TwoFADeviceUpdateInput, TwoFADeviceUncheckedUpdateInput>
  }

  /**
   * TwoFADevice delete
   */
  export type TwoFADeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
    /**
     * Filter which TwoFADevice to delete.
     */
    where: TwoFADeviceWhereUniqueInput
  }

  /**
   * TwoFADevice deleteMany
   */
  export type TwoFADeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TwoFADevices to delete
     */
    where?: TwoFADeviceWhereInput
  }

  /**
   * TwoFADevice without action
   */
  export type TwoFADeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TwoFADevice
     */
    select?: TwoFADeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TwoFADeviceInclude<ExtArgs> | null
  }


  /**
   * Model BackupCode
   */

  export type AggregateBackupCode = {
    _count: BackupCodeCountAggregateOutputType | null
    _min: BackupCodeMinAggregateOutputType | null
    _max: BackupCodeMaxAggregateOutputType | null
  }

  export type BackupCodeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    codeHash: string | null
    used: boolean | null
    createdAt: Date | null
  }

  export type BackupCodeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    codeHash: string | null
    used: boolean | null
    createdAt: Date | null
  }

  export type BackupCodeCountAggregateOutputType = {
    id: number
    userId: number
    codeHash: number
    used: number
    createdAt: number
    _all: number
  }


  export type BackupCodeMinAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    used?: true
    createdAt?: true
  }

  export type BackupCodeMaxAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    used?: true
    createdAt?: true
  }

  export type BackupCodeCountAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    used?: true
    createdAt?: true
    _all?: true
  }

  export type BackupCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupCode to aggregate.
     */
    where?: BackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupCodes to fetch.
     */
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BackupCodes
    **/
    _count?: true | BackupCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackupCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackupCodeMaxAggregateInputType
  }

  export type GetBackupCodeAggregateType<T extends BackupCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateBackupCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackupCode[P]>
      : GetScalarType<T[P], AggregateBackupCode[P]>
  }




  export type BackupCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupCodeWhereInput
    orderBy?: BackupCodeOrderByWithAggregationInput | BackupCodeOrderByWithAggregationInput[]
    by: BackupCodeScalarFieldEnum[] | BackupCodeScalarFieldEnum
    having?: BackupCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackupCodeCountAggregateInputType | true
    _min?: BackupCodeMinAggregateInputType
    _max?: BackupCodeMaxAggregateInputType
  }

  export type BackupCodeGroupByOutputType = {
    id: string
    userId: string
    codeHash: string
    used: boolean
    createdAt: Date
    _count: BackupCodeCountAggregateOutputType | null
    _min: BackupCodeMinAggregateOutputType | null
    _max: BackupCodeMaxAggregateOutputType | null
  }

  type GetBackupCodeGroupByPayload<T extends BackupCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackupCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackupCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackupCodeGroupByOutputType[P]>
            : GetScalarType<T[P], BackupCodeGroupByOutputType[P]>
        }
      >
    >


  export type BackupCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    used?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["backupCode"]>

  export type BackupCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    used?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["backupCode"]>

  export type BackupCodeSelectScalar = {
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    used?: boolean
    createdAt?: boolean
  }

  export type BackupCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BackupCodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BackupCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BackupCode"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      codeHash: string
      used: boolean
      createdAt: Date
    }, ExtArgs["result"]["backupCode"]>
    composites: {}
  }

  type BackupCodeGetPayload<S extends boolean | null | undefined | BackupCodeDefaultArgs> = $Result.GetResult<Prisma.$BackupCodePayload, S>

  type BackupCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BackupCodeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BackupCodeCountAggregateInputType | true
    }

  export interface BackupCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BackupCode'], meta: { name: 'BackupCode' } }
    /**
     * Find zero or one BackupCode that matches the filter.
     * @param {BackupCodeFindUniqueArgs} args - Arguments to find a BackupCode
     * @example
     * // Get one BackupCode
     * const backupCode = await prisma.backupCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackupCodeFindUniqueArgs>(args: SelectSubset<T, BackupCodeFindUniqueArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BackupCode that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BackupCodeFindUniqueOrThrowArgs} args - Arguments to find a BackupCode
     * @example
     * // Get one BackupCode
     * const backupCode = await prisma.backupCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackupCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, BackupCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BackupCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeFindFirstArgs} args - Arguments to find a BackupCode
     * @example
     * // Get one BackupCode
     * const backupCode = await prisma.backupCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackupCodeFindFirstArgs>(args?: SelectSubset<T, BackupCodeFindFirstArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BackupCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeFindFirstOrThrowArgs} args - Arguments to find a BackupCode
     * @example
     * // Get one BackupCode
     * const backupCode = await prisma.backupCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackupCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, BackupCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BackupCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BackupCodes
     * const backupCodes = await prisma.backupCode.findMany()
     * 
     * // Get first 10 BackupCodes
     * const backupCodes = await prisma.backupCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const backupCodeWithIdOnly = await prisma.backupCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BackupCodeFindManyArgs>(args?: SelectSubset<T, BackupCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BackupCode.
     * @param {BackupCodeCreateArgs} args - Arguments to create a BackupCode.
     * @example
     * // Create one BackupCode
     * const BackupCode = await prisma.backupCode.create({
     *   data: {
     *     // ... data to create a BackupCode
     *   }
     * })
     * 
     */
    create<T extends BackupCodeCreateArgs>(args: SelectSubset<T, BackupCodeCreateArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BackupCodes.
     * @param {BackupCodeCreateManyArgs} args - Arguments to create many BackupCodes.
     * @example
     * // Create many BackupCodes
     * const backupCode = await prisma.backupCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackupCodeCreateManyArgs>(args?: SelectSubset<T, BackupCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BackupCodes and returns the data saved in the database.
     * @param {BackupCodeCreateManyAndReturnArgs} args - Arguments to create many BackupCodes.
     * @example
     * // Create many BackupCodes
     * const backupCode = await prisma.backupCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BackupCodes and only return the `id`
     * const backupCodeWithIdOnly = await prisma.backupCode.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BackupCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, BackupCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BackupCode.
     * @param {BackupCodeDeleteArgs} args - Arguments to delete one BackupCode.
     * @example
     * // Delete one BackupCode
     * const BackupCode = await prisma.backupCode.delete({
     *   where: {
     *     // ... filter to delete one BackupCode
     *   }
     * })
     * 
     */
    delete<T extends BackupCodeDeleteArgs>(args: SelectSubset<T, BackupCodeDeleteArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BackupCode.
     * @param {BackupCodeUpdateArgs} args - Arguments to update one BackupCode.
     * @example
     * // Update one BackupCode
     * const backupCode = await prisma.backupCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackupCodeUpdateArgs>(args: SelectSubset<T, BackupCodeUpdateArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BackupCodes.
     * @param {BackupCodeDeleteManyArgs} args - Arguments to filter BackupCodes to delete.
     * @example
     * // Delete a few BackupCodes
     * const { count } = await prisma.backupCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackupCodeDeleteManyArgs>(args?: SelectSubset<T, BackupCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BackupCodes
     * const backupCode = await prisma.backupCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackupCodeUpdateManyArgs>(args: SelectSubset<T, BackupCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BackupCode.
     * @param {BackupCodeUpsertArgs} args - Arguments to update or create a BackupCode.
     * @example
     * // Update or create a BackupCode
     * const backupCode = await prisma.backupCode.upsert({
     *   create: {
     *     // ... data to create a BackupCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BackupCode we want to update
     *   }
     * })
     */
    upsert<T extends BackupCodeUpsertArgs>(args: SelectSubset<T, BackupCodeUpsertArgs<ExtArgs>>): Prisma__BackupCodeClient<$Result.GetResult<Prisma.$BackupCodePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BackupCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeCountArgs} args - Arguments to filter BackupCodes to count.
     * @example
     * // Count the number of BackupCodes
     * const count = await prisma.backupCode.count({
     *   where: {
     *     // ... the filter for the BackupCodes we want to count
     *   }
     * })
    **/
    count<T extends BackupCodeCountArgs>(
      args?: Subset<T, BackupCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackupCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BackupCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BackupCodeAggregateArgs>(args: Subset<T, BackupCodeAggregateArgs>): Prisma.PrismaPromise<GetBackupCodeAggregateType<T>>

    /**
     * Group by BackupCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCodeGroupByArgs} args - Group by arguments.
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
      T extends BackupCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackupCodeGroupByArgs['orderBy'] }
        : { orderBy?: BackupCodeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BackupCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackupCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BackupCode model
   */
  readonly fields: BackupCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BackupCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackupCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the BackupCode model
   */ 
  interface BackupCodeFieldRefs {
    readonly id: FieldRef<"BackupCode", 'String'>
    readonly userId: FieldRef<"BackupCode", 'String'>
    readonly codeHash: FieldRef<"BackupCode", 'String'>
    readonly used: FieldRef<"BackupCode", 'Boolean'>
    readonly createdAt: FieldRef<"BackupCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BackupCode findUnique
   */
  export type BackupCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCode to fetch.
     */
    where: BackupCodeWhereUniqueInput
  }

  /**
   * BackupCode findUniqueOrThrow
   */
  export type BackupCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCode to fetch.
     */
    where: BackupCodeWhereUniqueInput
  }

  /**
   * BackupCode findFirst
   */
  export type BackupCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCode to fetch.
     */
    where?: BackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupCodes to fetch.
     */
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupCodes.
     */
    cursor?: BackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupCodes.
     */
    distinct?: BackupCodeScalarFieldEnum | BackupCodeScalarFieldEnum[]
  }

  /**
   * BackupCode findFirstOrThrow
   */
  export type BackupCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCode to fetch.
     */
    where?: BackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupCodes to fetch.
     */
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupCodes.
     */
    cursor?: BackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupCodes.
     */
    distinct?: BackupCodeScalarFieldEnum | BackupCodeScalarFieldEnum[]
  }

  /**
   * BackupCode findMany
   */
  export type BackupCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which BackupCodes to fetch.
     */
    where?: BackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupCodes to fetch.
     */
    orderBy?: BackupCodeOrderByWithRelationInput | BackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BackupCodes.
     */
    cursor?: BackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupCodes.
     */
    skip?: number
    distinct?: BackupCodeScalarFieldEnum | BackupCodeScalarFieldEnum[]
  }

  /**
   * BackupCode create
   */
  export type BackupCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a BackupCode.
     */
    data: XOR<BackupCodeCreateInput, BackupCodeUncheckedCreateInput>
  }

  /**
   * BackupCode createMany
   */
  export type BackupCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BackupCodes.
     */
    data: BackupCodeCreateManyInput | BackupCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackupCode createManyAndReturn
   */
  export type BackupCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BackupCodes.
     */
    data: BackupCodeCreateManyInput | BackupCodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BackupCode update
   */
  export type BackupCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a BackupCode.
     */
    data: XOR<BackupCodeUpdateInput, BackupCodeUncheckedUpdateInput>
    /**
     * Choose, which BackupCode to update.
     */
    where: BackupCodeWhereUniqueInput
  }

  /**
   * BackupCode updateMany
   */
  export type BackupCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BackupCodes.
     */
    data: XOR<BackupCodeUpdateManyMutationInput, BackupCodeUncheckedUpdateManyInput>
    /**
     * Filter which BackupCodes to update
     */
    where?: BackupCodeWhereInput
  }

  /**
   * BackupCode upsert
   */
  export type BackupCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the BackupCode to update in case it exists.
     */
    where: BackupCodeWhereUniqueInput
    /**
     * In case the BackupCode found by the `where` argument doesn't exist, create a new BackupCode with this data.
     */
    create: XOR<BackupCodeCreateInput, BackupCodeUncheckedCreateInput>
    /**
     * In case the BackupCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackupCodeUpdateInput, BackupCodeUncheckedUpdateInput>
  }

  /**
   * BackupCode delete
   */
  export type BackupCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
    /**
     * Filter which BackupCode to delete.
     */
    where: BackupCodeWhereUniqueInput
  }

  /**
   * BackupCode deleteMany
   */
  export type BackupCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupCodes to delete
     */
    where?: BackupCodeWhereInput
  }

  /**
   * BackupCode without action
   */
  export type BackupCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupCode
     */
    select?: BackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BackupCodeInclude<ExtArgs> | null
  }


  /**
   * Model AccessToken
   */

  export type AggregateAccessToken = {
    _count: AccessTokenCountAggregateOutputType | null
    _min: AccessTokenMinAggregateOutputType | null
    _max: AccessTokenMaxAggregateOutputType | null
  }

  export type AccessTokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    name: string | null
    tokenHash: string | null
    calendar: string | null
    project: string | null
    active: boolean | null
    lastRefreshedAt: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccessTokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    name: string | null
    tokenHash: string | null
    calendar: string | null
    project: string | null
    active: boolean | null
    lastRefreshedAt: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccessTokenCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    name: number
    tokenHash: number
    calendar: number
    project: number
    active: number
    lastRefreshedAt: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccessTokenMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    name?: true
    tokenHash?: true
    calendar?: true
    project?: true
    active?: true
    lastRefreshedAt?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccessTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    name?: true
    tokenHash?: true
    calendar?: true
    project?: true
    active?: true
    lastRefreshedAt?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccessTokenCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    name?: true
    tokenHash?: true
    calendar?: true
    project?: true
    active?: true
    lastRefreshedAt?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccessTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessToken to aggregate.
     */
    where?: AccessTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessTokens to fetch.
     */
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccessTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccessTokens
    **/
    _count?: true | AccessTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccessTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccessTokenMaxAggregateInputType
  }

  export type GetAccessTokenAggregateType<T extends AccessTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateAccessToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccessToken[P]>
      : GetScalarType<T[P], AggregateAccessToken[P]>
  }




  export type AccessTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessTokenWhereInput
    orderBy?: AccessTokenOrderByWithAggregationInput | AccessTokenOrderByWithAggregationInput[]
    by: AccessTokenScalarFieldEnum[] | AccessTokenScalarFieldEnum
    having?: AccessTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccessTokenCountAggregateInputType | true
    _min?: AccessTokenMinAggregateInputType
    _max?: AccessTokenMaxAggregateInputType
  }

  export type AccessTokenGroupByOutputType = {
    id: string
    userId: string
    type: string
    name: string
    tokenHash: string
    calendar: string | null
    project: string | null
    active: boolean
    lastRefreshedAt: Date | null
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AccessTokenCountAggregateOutputType | null
    _min: AccessTokenMinAggregateOutputType | null
    _max: AccessTokenMaxAggregateOutputType | null
  }

  type GetAccessTokenGroupByPayload<T extends AccessTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccessTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccessTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccessTokenGroupByOutputType[P]>
            : GetScalarType<T[P], AccessTokenGroupByOutputType[P]>
        }
      >
    >


  export type AccessTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    name?: boolean
    tokenHash?: boolean
    calendar?: boolean
    project?: boolean
    active?: boolean
    lastRefreshedAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accessToken"]>

  export type AccessTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    name?: boolean
    tokenHash?: boolean
    calendar?: boolean
    project?: boolean
    active?: boolean
    lastRefreshedAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accessToken"]>

  export type AccessTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    name?: boolean
    tokenHash?: boolean
    calendar?: boolean
    project?: boolean
    active?: boolean
    lastRefreshedAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccessTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccessTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccessTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccessToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      name: string
      tokenHash: string
      calendar: string | null
      project: string | null
      active: boolean
      lastRefreshedAt: Date | null
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["accessToken"]>
    composites: {}
  }

  type AccessTokenGetPayload<S extends boolean | null | undefined | AccessTokenDefaultArgs> = $Result.GetResult<Prisma.$AccessTokenPayload, S>

  type AccessTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AccessTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AccessTokenCountAggregateInputType | true
    }

  export interface AccessTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccessToken'], meta: { name: 'AccessToken' } }
    /**
     * Find zero or one AccessToken that matches the filter.
     * @param {AccessTokenFindUniqueArgs} args - Arguments to find a AccessToken
     * @example
     * // Get one AccessToken
     * const accessToken = await prisma.accessToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccessTokenFindUniqueArgs>(args: SelectSubset<T, AccessTokenFindUniqueArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AccessToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AccessTokenFindUniqueOrThrowArgs} args - Arguments to find a AccessToken
     * @example
     * // Get one AccessToken
     * const accessToken = await prisma.accessToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccessTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, AccessTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AccessToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenFindFirstArgs} args - Arguments to find a AccessToken
     * @example
     * // Get one AccessToken
     * const accessToken = await prisma.accessToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccessTokenFindFirstArgs>(args?: SelectSubset<T, AccessTokenFindFirstArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AccessToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenFindFirstOrThrowArgs} args - Arguments to find a AccessToken
     * @example
     * // Get one AccessToken
     * const accessToken = await prisma.accessToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccessTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, AccessTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AccessTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccessTokens
     * const accessTokens = await prisma.accessToken.findMany()
     * 
     * // Get first 10 AccessTokens
     * const accessTokens = await prisma.accessToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accessTokenWithIdOnly = await prisma.accessToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccessTokenFindManyArgs>(args?: SelectSubset<T, AccessTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AccessToken.
     * @param {AccessTokenCreateArgs} args - Arguments to create a AccessToken.
     * @example
     * // Create one AccessToken
     * const AccessToken = await prisma.accessToken.create({
     *   data: {
     *     // ... data to create a AccessToken
     *   }
     * })
     * 
     */
    create<T extends AccessTokenCreateArgs>(args: SelectSubset<T, AccessTokenCreateArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AccessTokens.
     * @param {AccessTokenCreateManyArgs} args - Arguments to create many AccessTokens.
     * @example
     * // Create many AccessTokens
     * const accessToken = await prisma.accessToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccessTokenCreateManyArgs>(args?: SelectSubset<T, AccessTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AccessTokens and returns the data saved in the database.
     * @param {AccessTokenCreateManyAndReturnArgs} args - Arguments to create many AccessTokens.
     * @example
     * // Create many AccessTokens
     * const accessToken = await prisma.accessToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AccessTokens and only return the `id`
     * const accessTokenWithIdOnly = await prisma.accessToken.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccessTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, AccessTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AccessToken.
     * @param {AccessTokenDeleteArgs} args - Arguments to delete one AccessToken.
     * @example
     * // Delete one AccessToken
     * const AccessToken = await prisma.accessToken.delete({
     *   where: {
     *     // ... filter to delete one AccessToken
     *   }
     * })
     * 
     */
    delete<T extends AccessTokenDeleteArgs>(args: SelectSubset<T, AccessTokenDeleteArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AccessToken.
     * @param {AccessTokenUpdateArgs} args - Arguments to update one AccessToken.
     * @example
     * // Update one AccessToken
     * const accessToken = await prisma.accessToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccessTokenUpdateArgs>(args: SelectSubset<T, AccessTokenUpdateArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AccessTokens.
     * @param {AccessTokenDeleteManyArgs} args - Arguments to filter AccessTokens to delete.
     * @example
     * // Delete a few AccessTokens
     * const { count } = await prisma.accessToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccessTokenDeleteManyArgs>(args?: SelectSubset<T, AccessTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccessTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccessTokens
     * const accessToken = await prisma.accessToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccessTokenUpdateManyArgs>(args: SelectSubset<T, AccessTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AccessToken.
     * @param {AccessTokenUpsertArgs} args - Arguments to update or create a AccessToken.
     * @example
     * // Update or create a AccessToken
     * const accessToken = await prisma.accessToken.upsert({
     *   create: {
     *     // ... data to create a AccessToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccessToken we want to update
     *   }
     * })
     */
    upsert<T extends AccessTokenUpsertArgs>(args: SelectSubset<T, AccessTokenUpsertArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AccessTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenCountArgs} args - Arguments to filter AccessTokens to count.
     * @example
     * // Count the number of AccessTokens
     * const count = await prisma.accessToken.count({
     *   where: {
     *     // ... the filter for the AccessTokens we want to count
     *   }
     * })
    **/
    count<T extends AccessTokenCountArgs>(
      args?: Subset<T, AccessTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccessTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccessToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccessTokenAggregateArgs>(args: Subset<T, AccessTokenAggregateArgs>): Prisma.PrismaPromise<GetAccessTokenAggregateType<T>>

    /**
     * Group by AccessToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenGroupByArgs} args - Group by arguments.
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
      T extends AccessTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccessTokenGroupByArgs['orderBy'] }
        : { orderBy?: AccessTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AccessTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccessTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccessToken model
   */
  readonly fields: AccessTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccessToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccessTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the AccessToken model
   */ 
  interface AccessTokenFieldRefs {
    readonly id: FieldRef<"AccessToken", 'String'>
    readonly userId: FieldRef<"AccessToken", 'String'>
    readonly type: FieldRef<"AccessToken", 'String'>
    readonly name: FieldRef<"AccessToken", 'String'>
    readonly tokenHash: FieldRef<"AccessToken", 'String'>
    readonly calendar: FieldRef<"AccessToken", 'String'>
    readonly project: FieldRef<"AccessToken", 'String'>
    readonly active: FieldRef<"AccessToken", 'Boolean'>
    readonly lastRefreshedAt: FieldRef<"AccessToken", 'DateTime'>
    readonly expiresAt: FieldRef<"AccessToken", 'DateTime'>
    readonly createdAt: FieldRef<"AccessToken", 'DateTime'>
    readonly updatedAt: FieldRef<"AccessToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AccessToken findUnique
   */
  export type AccessTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessToken to fetch.
     */
    where: AccessTokenWhereUniqueInput
  }

  /**
   * AccessToken findUniqueOrThrow
   */
  export type AccessTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessToken to fetch.
     */
    where: AccessTokenWhereUniqueInput
  }

  /**
   * AccessToken findFirst
   */
  export type AccessTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessToken to fetch.
     */
    where?: AccessTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessTokens to fetch.
     */
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessTokens.
     */
    cursor?: AccessTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessTokens.
     */
    distinct?: AccessTokenScalarFieldEnum | AccessTokenScalarFieldEnum[]
  }

  /**
   * AccessToken findFirstOrThrow
   */
  export type AccessTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessToken to fetch.
     */
    where?: AccessTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessTokens to fetch.
     */
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessTokens.
     */
    cursor?: AccessTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessTokens.
     */
    distinct?: AccessTokenScalarFieldEnum | AccessTokenScalarFieldEnum[]
  }

  /**
   * AccessToken findMany
   */
  export type AccessTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessTokens to fetch.
     */
    where?: AccessTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessTokens to fetch.
     */
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccessTokens.
     */
    cursor?: AccessTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessTokens.
     */
    skip?: number
    distinct?: AccessTokenScalarFieldEnum | AccessTokenScalarFieldEnum[]
  }

  /**
   * AccessToken create
   */
  export type AccessTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a AccessToken.
     */
    data: XOR<AccessTokenCreateInput, AccessTokenUncheckedCreateInput>
  }

  /**
   * AccessToken createMany
   */
  export type AccessTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccessTokens.
     */
    data: AccessTokenCreateManyInput | AccessTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccessToken createManyAndReturn
   */
  export type AccessTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AccessTokens.
     */
    data: AccessTokenCreateManyInput | AccessTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccessToken update
   */
  export type AccessTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a AccessToken.
     */
    data: XOR<AccessTokenUpdateInput, AccessTokenUncheckedUpdateInput>
    /**
     * Choose, which AccessToken to update.
     */
    where: AccessTokenWhereUniqueInput
  }

  /**
   * AccessToken updateMany
   */
  export type AccessTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccessTokens.
     */
    data: XOR<AccessTokenUpdateManyMutationInput, AccessTokenUncheckedUpdateManyInput>
    /**
     * Filter which AccessTokens to update
     */
    where?: AccessTokenWhereInput
  }

  /**
   * AccessToken upsert
   */
  export type AccessTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the AccessToken to update in case it exists.
     */
    where: AccessTokenWhereUniqueInput
    /**
     * In case the AccessToken found by the `where` argument doesn't exist, create a new AccessToken with this data.
     */
    create: XOR<AccessTokenCreateInput, AccessTokenUncheckedCreateInput>
    /**
     * In case the AccessToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccessTokenUpdateInput, AccessTokenUncheckedUpdateInput>
  }

  /**
   * AccessToken delete
   */
  export type AccessTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter which AccessToken to delete.
     */
    where: AccessTokenWhereUniqueInput
  }

  /**
   * AccessToken deleteMany
   */
  export type AccessTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessTokens to delete
     */
    where?: AccessTokenWhereInput
  }

  /**
   * AccessToken without action
   */
  export type AccessTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    status: 'status',
    department: 'department',
    isVerified: 'isVerified',
    passwordLastChangedAt: 'passwordLastChangedAt',
    permissions: 'permissions',
    assignedSubsystems: 'assignedSubsystems',
    avatarUrl: 'avatarUrl',
    verificationOtp: 'verificationOtp',
    otpExpiry: 'otpExpiry',
    twoFactorEnabled: 'twoFactorEnabled',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    permissions: 'permissions'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const PasswordResetRequestScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    userEmail: 'userEmail',
    userName: 'userName',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type PasswordResetRequestScalarFieldEnum = (typeof PasswordResetRequestScalarFieldEnum)[keyof typeof PasswordResetRequestScalarFieldEnum]


  export const TwoFADeviceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    name: 'name',
    secret: 'secret',
    isDefault: 'isDefault',
    confirmed: 'confirmed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TwoFADeviceScalarFieldEnum = (typeof TwoFADeviceScalarFieldEnum)[keyof typeof TwoFADeviceScalarFieldEnum]


  export const BackupCodeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    codeHash: 'codeHash',
    used: 'used',
    createdAt: 'createdAt'
  };

  export type BackupCodeScalarFieldEnum = (typeof BackupCodeScalarFieldEnum)[keyof typeof BackupCodeScalarFieldEnum]


  export const AccessTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    name: 'name',
    tokenHash: 'tokenHash',
    calendar: 'calendar',
    project: 'project',
    active: 'active',
    lastRefreshedAt: 'lastRefreshedAt',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccessTokenScalarFieldEnum = (typeof AccessTokenScalarFieldEnum)[keyof typeof AccessTokenScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


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


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    department?: StringNullableFilter<"User"> | string | null
    isVerified?: BoolFilter<"User"> | boolean
    passwordLastChangedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    permissions?: StringNullableListFilter<"User">
    assignedSubsystems?: StringNullableListFilter<"User">
    avatarUrl?: StringNullableFilter<"User"> | string | null
    verificationOtp?: StringNullableFilter<"User"> | string | null
    otpExpiry?: DateTimeNullableFilter<"User"> | Date | string | null
    twoFactorEnabled?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    updatedAt?: DateTimeFilter<"User"> | Date | string
    twoFADevices?: TwoFADeviceListRelationFilter
    backupCodes?: BackupCodeListRelationFilter
    accessTokens?: AccessTokenListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    status?: SortOrder
    department?: SortOrderInput | SortOrder
    isVerified?: SortOrder
    passwordLastChangedAt?: SortOrderInput | SortOrder
    permissions?: SortOrder
    assignedSubsystems?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    verificationOtp?: SortOrderInput | SortOrder
    otpExpiry?: SortOrderInput | SortOrder
    twoFactorEnabled?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    twoFADevices?: TwoFADeviceOrderByRelationAggregateInput
    backupCodes?: BackupCodeOrderByRelationAggregateInput
    accessTokens?: AccessTokenOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    department?: StringNullableFilter<"User"> | string | null
    isVerified?: BoolFilter<"User"> | boolean
    passwordLastChangedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    permissions?: StringNullableListFilter<"User">
    assignedSubsystems?: StringNullableListFilter<"User">
    avatarUrl?: StringNullableFilter<"User"> | string | null
    verificationOtp?: StringNullableFilter<"User"> | string | null
    otpExpiry?: DateTimeNullableFilter<"User"> | Date | string | null
    twoFactorEnabled?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    updatedAt?: DateTimeFilter<"User"> | Date | string
    twoFADevices?: TwoFADeviceListRelationFilter
    backupCodes?: BackupCodeListRelationFilter
    accessTokens?: AccessTokenListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    status?: SortOrder
    department?: SortOrderInput | SortOrder
    isVerified?: SortOrder
    passwordLastChangedAt?: SortOrderInput | SortOrder
    permissions?: SortOrder
    assignedSubsystems?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    verificationOtp?: SortOrderInput | SortOrder
    otpExpiry?: SortOrderInput | SortOrder
    twoFactorEnabled?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    status?: StringWithAggregatesFilter<"User"> | string
    department?: StringNullableWithAggregatesFilter<"User"> | string | null
    isVerified?: BoolWithAggregatesFilter<"User"> | boolean
    passwordLastChangedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    permissions?: StringNullableListFilter<"User">
    assignedSubsystems?: StringNullableListFilter<"User">
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    verificationOtp?: StringNullableWithAggregatesFilter<"User"> | string | null
    otpExpiry?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    twoFactorEnabled?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: StringFilter<"Role"> | string
    name?: StringFilter<"Role"> | string
    description?: StringFilter<"Role"> | string
    permissions?: StringNullableListFilter<"Role">
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    permissions?: SortOrder
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    name?: StringFilter<"Role"> | string
    description?: StringFilter<"Role"> | string
    permissions?: StringNullableListFilter<"Role">
  }, "id">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    permissions?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Role"> | string
    name?: StringWithAggregatesFilter<"Role"> | string
    description?: StringWithAggregatesFilter<"Role"> | string
    permissions?: StringNullableListFilter<"Role">
  }

  export type PasswordResetRequestWhereInput = {
    AND?: PasswordResetRequestWhereInput | PasswordResetRequestWhereInput[]
    OR?: PasswordResetRequestWhereInput[]
    NOT?: PasswordResetRequestWhereInput | PasswordResetRequestWhereInput[]
    id?: StringFilter<"PasswordResetRequest"> | string
    userId?: StringFilter<"PasswordResetRequest"> | string
    userEmail?: StringFilter<"PasswordResetRequest"> | string
    userName?: StringFilter<"PasswordResetRequest"> | string
    status?: StringFilter<"PasswordResetRequest"> | string
    createdAt?: DateTimeFilter<"PasswordResetRequest"> | Date | string
  }

  export type PasswordResetRequestOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    userName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PasswordResetRequestWhereInput | PasswordResetRequestWhereInput[]
    OR?: PasswordResetRequestWhereInput[]
    NOT?: PasswordResetRequestWhereInput | PasswordResetRequestWhereInput[]
    userId?: StringFilter<"PasswordResetRequest"> | string
    userEmail?: StringFilter<"PasswordResetRequest"> | string
    userName?: StringFilter<"PasswordResetRequest"> | string
    status?: StringFilter<"PasswordResetRequest"> | string
    createdAt?: DateTimeFilter<"PasswordResetRequest"> | Date | string
  }, "id">

  export type PasswordResetRequestOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    userName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetRequestCountOrderByAggregateInput
    _max?: PasswordResetRequestMaxOrderByAggregateInput
    _min?: PasswordResetRequestMinOrderByAggregateInput
  }

  export type PasswordResetRequestScalarWhereWithAggregatesInput = {
    AND?: PasswordResetRequestScalarWhereWithAggregatesInput | PasswordResetRequestScalarWhereWithAggregatesInput[]
    OR?: PasswordResetRequestScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetRequestScalarWhereWithAggregatesInput | PasswordResetRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasswordResetRequest"> | string
    userId?: StringWithAggregatesFilter<"PasswordResetRequest"> | string
    userEmail?: StringWithAggregatesFilter<"PasswordResetRequest"> | string
    userName?: StringWithAggregatesFilter<"PasswordResetRequest"> | string
    status?: StringWithAggregatesFilter<"PasswordResetRequest"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PasswordResetRequest"> | Date | string
  }

  export type TwoFADeviceWhereInput = {
    AND?: TwoFADeviceWhereInput | TwoFADeviceWhereInput[]
    OR?: TwoFADeviceWhereInput[]
    NOT?: TwoFADeviceWhereInput | TwoFADeviceWhereInput[]
    id?: StringFilter<"TwoFADevice"> | string
    userId?: StringFilter<"TwoFADevice"> | string
    type?: StringFilter<"TwoFADevice"> | string
    name?: StringFilter<"TwoFADevice"> | string
    secret?: StringFilter<"TwoFADevice"> | string
    isDefault?: BoolFilter<"TwoFADevice"> | boolean
    confirmed?: BoolFilter<"TwoFADevice"> | boolean
    createdAt?: DateTimeFilter<"TwoFADevice"> | Date | string
    updatedAt?: DateTimeFilter<"TwoFADevice"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type TwoFADeviceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    secret?: SortOrder
    isDefault?: SortOrder
    confirmed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TwoFADeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TwoFADeviceWhereInput | TwoFADeviceWhereInput[]
    OR?: TwoFADeviceWhereInput[]
    NOT?: TwoFADeviceWhereInput | TwoFADeviceWhereInput[]
    userId?: StringFilter<"TwoFADevice"> | string
    type?: StringFilter<"TwoFADevice"> | string
    name?: StringFilter<"TwoFADevice"> | string
    secret?: StringFilter<"TwoFADevice"> | string
    isDefault?: BoolFilter<"TwoFADevice"> | boolean
    confirmed?: BoolFilter<"TwoFADevice"> | boolean
    createdAt?: DateTimeFilter<"TwoFADevice"> | Date | string
    updatedAt?: DateTimeFilter<"TwoFADevice"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type TwoFADeviceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    secret?: SortOrder
    isDefault?: SortOrder
    confirmed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TwoFADeviceCountOrderByAggregateInput
    _max?: TwoFADeviceMaxOrderByAggregateInput
    _min?: TwoFADeviceMinOrderByAggregateInput
  }

  export type TwoFADeviceScalarWhereWithAggregatesInput = {
    AND?: TwoFADeviceScalarWhereWithAggregatesInput | TwoFADeviceScalarWhereWithAggregatesInput[]
    OR?: TwoFADeviceScalarWhereWithAggregatesInput[]
    NOT?: TwoFADeviceScalarWhereWithAggregatesInput | TwoFADeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TwoFADevice"> | string
    userId?: StringWithAggregatesFilter<"TwoFADevice"> | string
    type?: StringWithAggregatesFilter<"TwoFADevice"> | string
    name?: StringWithAggregatesFilter<"TwoFADevice"> | string
    secret?: StringWithAggregatesFilter<"TwoFADevice"> | string
    isDefault?: BoolWithAggregatesFilter<"TwoFADevice"> | boolean
    confirmed?: BoolWithAggregatesFilter<"TwoFADevice"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TwoFADevice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TwoFADevice"> | Date | string
  }

  export type BackupCodeWhereInput = {
    AND?: BackupCodeWhereInput | BackupCodeWhereInput[]
    OR?: BackupCodeWhereInput[]
    NOT?: BackupCodeWhereInput | BackupCodeWhereInput[]
    id?: StringFilter<"BackupCode"> | string
    userId?: StringFilter<"BackupCode"> | string
    codeHash?: StringFilter<"BackupCode"> | string
    used?: BoolFilter<"BackupCode"> | boolean
    createdAt?: DateTimeFilter<"BackupCode"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type BackupCodeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type BackupCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BackupCodeWhereInput | BackupCodeWhereInput[]
    OR?: BackupCodeWhereInput[]
    NOT?: BackupCodeWhereInput | BackupCodeWhereInput[]
    userId?: StringFilter<"BackupCode"> | string
    codeHash?: StringFilter<"BackupCode"> | string
    used?: BoolFilter<"BackupCode"> | boolean
    createdAt?: DateTimeFilter<"BackupCode"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type BackupCodeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    _count?: BackupCodeCountOrderByAggregateInput
    _max?: BackupCodeMaxOrderByAggregateInput
    _min?: BackupCodeMinOrderByAggregateInput
  }

  export type BackupCodeScalarWhereWithAggregatesInput = {
    AND?: BackupCodeScalarWhereWithAggregatesInput | BackupCodeScalarWhereWithAggregatesInput[]
    OR?: BackupCodeScalarWhereWithAggregatesInput[]
    NOT?: BackupCodeScalarWhereWithAggregatesInput | BackupCodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BackupCode"> | string
    userId?: StringWithAggregatesFilter<"BackupCode"> | string
    codeHash?: StringWithAggregatesFilter<"BackupCode"> | string
    used?: BoolWithAggregatesFilter<"BackupCode"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"BackupCode"> | Date | string
  }

  export type AccessTokenWhereInput = {
    AND?: AccessTokenWhereInput | AccessTokenWhereInput[]
    OR?: AccessTokenWhereInput[]
    NOT?: AccessTokenWhereInput | AccessTokenWhereInput[]
    id?: StringFilter<"AccessToken"> | string
    userId?: StringFilter<"AccessToken"> | string
    type?: StringFilter<"AccessToken"> | string
    name?: StringFilter<"AccessToken"> | string
    tokenHash?: StringFilter<"AccessToken"> | string
    calendar?: StringNullableFilter<"AccessToken"> | string | null
    project?: StringNullableFilter<"AccessToken"> | string | null
    active?: BoolFilter<"AccessToken"> | boolean
    lastRefreshedAt?: DateTimeNullableFilter<"AccessToken"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"AccessToken"> | Date | string | null
    createdAt?: DateTimeFilter<"AccessToken"> | Date | string
    updatedAt?: DateTimeFilter<"AccessToken"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type AccessTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    tokenHash?: SortOrder
    calendar?: SortOrderInput | SortOrder
    project?: SortOrderInput | SortOrder
    active?: SortOrder
    lastRefreshedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccessTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: AccessTokenWhereInput | AccessTokenWhereInput[]
    OR?: AccessTokenWhereInput[]
    NOT?: AccessTokenWhereInput | AccessTokenWhereInput[]
    userId?: StringFilter<"AccessToken"> | string
    type?: StringFilter<"AccessToken"> | string
    name?: StringFilter<"AccessToken"> | string
    calendar?: StringNullableFilter<"AccessToken"> | string | null
    project?: StringNullableFilter<"AccessToken"> | string | null
    active?: BoolFilter<"AccessToken"> | boolean
    lastRefreshedAt?: DateTimeNullableFilter<"AccessToken"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"AccessToken"> | Date | string | null
    createdAt?: DateTimeFilter<"AccessToken"> | Date | string
    updatedAt?: DateTimeFilter<"AccessToken"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "tokenHash">

  export type AccessTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    tokenHash?: SortOrder
    calendar?: SortOrderInput | SortOrder
    project?: SortOrderInput | SortOrder
    active?: SortOrder
    lastRefreshedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccessTokenCountOrderByAggregateInput
    _max?: AccessTokenMaxOrderByAggregateInput
    _min?: AccessTokenMinOrderByAggregateInput
  }

  export type AccessTokenScalarWhereWithAggregatesInput = {
    AND?: AccessTokenScalarWhereWithAggregatesInput | AccessTokenScalarWhereWithAggregatesInput[]
    OR?: AccessTokenScalarWhereWithAggregatesInput[]
    NOT?: AccessTokenScalarWhereWithAggregatesInput | AccessTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AccessToken"> | string
    userId?: StringWithAggregatesFilter<"AccessToken"> | string
    type?: StringWithAggregatesFilter<"AccessToken"> | string
    name?: StringWithAggregatesFilter<"AccessToken"> | string
    tokenHash?: StringWithAggregatesFilter<"AccessToken"> | string
    calendar?: StringNullableWithAggregatesFilter<"AccessToken"> | string | null
    project?: StringNullableWithAggregatesFilter<"AccessToken"> | string | null
    active?: BoolWithAggregatesFilter<"AccessToken"> | boolean
    lastRefreshedAt?: DateTimeNullableWithAggregatesFilter<"AccessToken"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"AccessToken"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AccessToken"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AccessToken"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: string
    status: string
    department?: string | null
    isVerified?: boolean
    passwordLastChangedAt?: Date | string | null
    permissions?: UserCreatepermissionsInput | string[]
    assignedSubsystems?: UserCreateassignedSubsystemsInput | string[]
    avatarUrl?: string | null
    verificationOtp?: string | null
    otpExpiry?: Date | string | null
    twoFactorEnabled?: boolean
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    twoFADevices?: TwoFADeviceCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    accessTokens?: AccessTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: string
    status: string
    department?: string | null
    isVerified?: boolean
    passwordLastChangedAt?: Date | string | null
    permissions?: UserCreatepermissionsInput | string[]
    assignedSubsystems?: UserCreateassignedSubsystemsInput | string[]
    avatarUrl?: string | null
    verificationOtp?: string | null
    otpExpiry?: Date | string | null
    twoFactorEnabled?: boolean
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    twoFADevices?: TwoFADeviceUncheckedCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    accessTokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    twoFADevices?: TwoFADeviceUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    accessTokens?: AccessTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    twoFADevices?: TwoFADeviceUncheckedUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    accessTokens?: AccessTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: string
    status: string
    department?: string | null
    isVerified?: boolean
    passwordLastChangedAt?: Date | string | null
    permissions?: UserCreatepermissionsInput | string[]
    assignedSubsystems?: UserCreateassignedSubsystemsInput | string[]
    avatarUrl?: string | null
    verificationOtp?: string | null
    otpExpiry?: Date | string | null
    twoFactorEnabled?: boolean
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleCreateInput = {
    id?: string
    name: string
    description: string
    permissions?: RoleCreatepermissionsInput | string[]
  }

  export type RoleUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    permissions?: RoleCreatepermissionsInput | string[]
  }

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    permissions?: RoleUpdatepermissionsInput | string[]
  }

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    permissions?: RoleUpdatepermissionsInput | string[]
  }

  export type RoleCreateManyInput = {
    id?: string
    name: string
    description: string
    permissions?: RoleCreatepermissionsInput | string[]
  }

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    permissions?: RoleUpdatepermissionsInput | string[]
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    permissions?: RoleUpdatepermissionsInput | string[]
  }

  export type PasswordResetRequestCreateInput = {
    id?: string
    userId: string
    userEmail: string
    userName: string
    status: string
    createdAt?: Date | string
  }

  export type PasswordResetRequestUncheckedCreateInput = {
    id?: string
    userId: string
    userEmail: string
    userName: string
    status: string
    createdAt?: Date | string
  }

  export type PasswordResetRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetRequestCreateManyInput = {
    id?: string
    userId: string
    userEmail: string
    userName: string
    status: string
    createdAt?: Date | string
  }

  export type PasswordResetRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TwoFADeviceCreateInput = {
    id?: string
    type: string
    name: string
    secret: string
    isDefault?: boolean
    confirmed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTwoFADevicesInput
  }

  export type TwoFADeviceUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    name: string
    secret: string
    isDefault?: boolean
    confirmed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TwoFADeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secret?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTwoFADevicesNestedInput
  }

  export type TwoFADeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secret?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TwoFADeviceCreateManyInput = {
    id?: string
    userId: string
    type: string
    name: string
    secret: string
    isDefault?: boolean
    confirmed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TwoFADeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secret?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TwoFADeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secret?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeCreateInput = {
    id?: string
    codeHash: string
    used?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutBackupCodesInput
  }

  export type BackupCodeUncheckedCreateInput = {
    id?: string
    userId: string
    codeHash: string
    used?: boolean
    createdAt?: Date | string
  }

  export type BackupCodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBackupCodesNestedInput
  }

  export type BackupCodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeCreateManyInput = {
    id?: string
    userId: string
    codeHash: string
    used?: boolean
    createdAt?: Date | string
  }

  export type BackupCodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessTokenCreateInput = {
    id?: string
    type: string
    name: string
    tokenHash: string
    calendar?: string | null
    project?: string | null
    active?: boolean
    lastRefreshedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccessTokensInput
  }

  export type AccessTokenUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    name: string
    tokenHash: string
    calendar?: string | null
    project?: string | null
    active?: boolean
    lastRefreshedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccessTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    calendar?: NullableStringFieldUpdateOperationsInput | string | null
    project?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    lastRefreshedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccessTokensNestedInput
  }

  export type AccessTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    calendar?: NullableStringFieldUpdateOperationsInput | string | null
    project?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    lastRefreshedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessTokenCreateManyInput = {
    id?: string
    userId: string
    type: string
    name: string
    tokenHash: string
    calendar?: string | null
    project?: string | null
    active?: boolean
    lastRefreshedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccessTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    calendar?: NullableStringFieldUpdateOperationsInput | string | null
    project?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    lastRefreshedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    calendar?: NullableStringFieldUpdateOperationsInput | string | null
    project?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    lastRefreshedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type TwoFADeviceListRelationFilter = {
    every?: TwoFADeviceWhereInput
    some?: TwoFADeviceWhereInput
    none?: TwoFADeviceWhereInput
  }

  export type BackupCodeListRelationFilter = {
    every?: BackupCodeWhereInput
    some?: BackupCodeWhereInput
    none?: BackupCodeWhereInput
  }

  export type AccessTokenListRelationFilter = {
    every?: AccessTokenWhereInput
    some?: AccessTokenWhereInput
    none?: AccessTokenWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TwoFADeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BackupCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccessTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    department?: SortOrder
    isVerified?: SortOrder
    passwordLastChangedAt?: SortOrder
    permissions?: SortOrder
    assignedSubsystems?: SortOrder
    avatarUrl?: SortOrder
    verificationOtp?: SortOrder
    otpExpiry?: SortOrder
    twoFactorEnabled?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    department?: SortOrder
    isVerified?: SortOrder
    passwordLastChangedAt?: SortOrder
    avatarUrl?: SortOrder
    verificationOtp?: SortOrder
    otpExpiry?: SortOrder
    twoFactorEnabled?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    department?: SortOrder
    isVerified?: SortOrder
    passwordLastChangedAt?: SortOrder
    avatarUrl?: SortOrder
    verificationOtp?: SortOrder
    otpExpiry?: SortOrder
    twoFactorEnabled?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    permissions?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type PasswordResetRequestCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    userName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    userName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetRequestMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    userName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TwoFADeviceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    secret?: SortOrder
    isDefault?: SortOrder
    confirmed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TwoFADeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    secret?: SortOrder
    isDefault?: SortOrder
    confirmed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TwoFADeviceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    secret?: SortOrder
    isDefault?: SortOrder
    confirmed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupCodeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
  }

  export type BackupCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
  }

  export type BackupCodeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
  }

  export type AccessTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    tokenHash?: SortOrder
    calendar?: SortOrder
    project?: SortOrder
    active?: SortOrder
    lastRefreshedAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccessTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    tokenHash?: SortOrder
    calendar?: SortOrder
    project?: SortOrder
    active?: SortOrder
    lastRefreshedAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccessTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    tokenHash?: SortOrder
    calendar?: SortOrder
    project?: SortOrder
    active?: SortOrder
    lastRefreshedAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCreatepermissionsInput = {
    set: string[]
  }

  export type UserCreateassignedSubsystemsInput = {
    set: string[]
  }

  export type TwoFADeviceCreateNestedManyWithoutUserInput = {
    create?: XOR<TwoFADeviceCreateWithoutUserInput, TwoFADeviceUncheckedCreateWithoutUserInput> | TwoFADeviceCreateWithoutUserInput[] | TwoFADeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TwoFADeviceCreateOrConnectWithoutUserInput | TwoFADeviceCreateOrConnectWithoutUserInput[]
    createMany?: TwoFADeviceCreateManyUserInputEnvelope
    connect?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
  }

  export type BackupCodeCreateNestedManyWithoutUserInput = {
    create?: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput> | BackupCodeCreateWithoutUserInput[] | BackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BackupCodeCreateOrConnectWithoutUserInput | BackupCodeCreateOrConnectWithoutUserInput[]
    createMany?: BackupCodeCreateManyUserInputEnvelope
    connect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
  }

  export type AccessTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<AccessTokenCreateWithoutUserInput, AccessTokenUncheckedCreateWithoutUserInput> | AccessTokenCreateWithoutUserInput[] | AccessTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccessTokenCreateOrConnectWithoutUserInput | AccessTokenCreateOrConnectWithoutUserInput[]
    createMany?: AccessTokenCreateManyUserInputEnvelope
    connect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
  }

  export type TwoFADeviceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TwoFADeviceCreateWithoutUserInput, TwoFADeviceUncheckedCreateWithoutUserInput> | TwoFADeviceCreateWithoutUserInput[] | TwoFADeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TwoFADeviceCreateOrConnectWithoutUserInput | TwoFADeviceCreateOrConnectWithoutUserInput[]
    createMany?: TwoFADeviceCreateManyUserInputEnvelope
    connect?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
  }

  export type BackupCodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput> | BackupCodeCreateWithoutUserInput[] | BackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BackupCodeCreateOrConnectWithoutUserInput | BackupCodeCreateOrConnectWithoutUserInput[]
    createMany?: BackupCodeCreateManyUserInputEnvelope
    connect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
  }

  export type AccessTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccessTokenCreateWithoutUserInput, AccessTokenUncheckedCreateWithoutUserInput> | AccessTokenCreateWithoutUserInput[] | AccessTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccessTokenCreateOrConnectWithoutUserInput | AccessTokenCreateOrConnectWithoutUserInput[]
    createMany?: AccessTokenCreateManyUserInputEnvelope
    connect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdatepermissionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateassignedSubsystemsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TwoFADeviceUpdateManyWithoutUserNestedInput = {
    create?: XOR<TwoFADeviceCreateWithoutUserInput, TwoFADeviceUncheckedCreateWithoutUserInput> | TwoFADeviceCreateWithoutUserInput[] | TwoFADeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TwoFADeviceCreateOrConnectWithoutUserInput | TwoFADeviceCreateOrConnectWithoutUserInput[]
    upsert?: TwoFADeviceUpsertWithWhereUniqueWithoutUserInput | TwoFADeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TwoFADeviceCreateManyUserInputEnvelope
    set?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
    disconnect?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
    delete?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
    connect?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
    update?: TwoFADeviceUpdateWithWhereUniqueWithoutUserInput | TwoFADeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TwoFADeviceUpdateManyWithWhereWithoutUserInput | TwoFADeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TwoFADeviceScalarWhereInput | TwoFADeviceScalarWhereInput[]
  }

  export type BackupCodeUpdateManyWithoutUserNestedInput = {
    create?: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput> | BackupCodeCreateWithoutUserInput[] | BackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BackupCodeCreateOrConnectWithoutUserInput | BackupCodeCreateOrConnectWithoutUserInput[]
    upsert?: BackupCodeUpsertWithWhereUniqueWithoutUserInput | BackupCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BackupCodeCreateManyUserInputEnvelope
    set?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    disconnect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    delete?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    connect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    update?: BackupCodeUpdateWithWhereUniqueWithoutUserInput | BackupCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BackupCodeUpdateManyWithWhereWithoutUserInput | BackupCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BackupCodeScalarWhereInput | BackupCodeScalarWhereInput[]
  }

  export type AccessTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccessTokenCreateWithoutUserInput, AccessTokenUncheckedCreateWithoutUserInput> | AccessTokenCreateWithoutUserInput[] | AccessTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccessTokenCreateOrConnectWithoutUserInput | AccessTokenCreateOrConnectWithoutUserInput[]
    upsert?: AccessTokenUpsertWithWhereUniqueWithoutUserInput | AccessTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccessTokenCreateManyUserInputEnvelope
    set?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    disconnect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    delete?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    connect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    update?: AccessTokenUpdateWithWhereUniqueWithoutUserInput | AccessTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccessTokenUpdateManyWithWhereWithoutUserInput | AccessTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccessTokenScalarWhereInput | AccessTokenScalarWhereInput[]
  }

  export type TwoFADeviceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TwoFADeviceCreateWithoutUserInput, TwoFADeviceUncheckedCreateWithoutUserInput> | TwoFADeviceCreateWithoutUserInput[] | TwoFADeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TwoFADeviceCreateOrConnectWithoutUserInput | TwoFADeviceCreateOrConnectWithoutUserInput[]
    upsert?: TwoFADeviceUpsertWithWhereUniqueWithoutUserInput | TwoFADeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TwoFADeviceCreateManyUserInputEnvelope
    set?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
    disconnect?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
    delete?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
    connect?: TwoFADeviceWhereUniqueInput | TwoFADeviceWhereUniqueInput[]
    update?: TwoFADeviceUpdateWithWhereUniqueWithoutUserInput | TwoFADeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TwoFADeviceUpdateManyWithWhereWithoutUserInput | TwoFADeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TwoFADeviceScalarWhereInput | TwoFADeviceScalarWhereInput[]
  }

  export type BackupCodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput> | BackupCodeCreateWithoutUserInput[] | BackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BackupCodeCreateOrConnectWithoutUserInput | BackupCodeCreateOrConnectWithoutUserInput[]
    upsert?: BackupCodeUpsertWithWhereUniqueWithoutUserInput | BackupCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BackupCodeCreateManyUserInputEnvelope
    set?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    disconnect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    delete?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    connect?: BackupCodeWhereUniqueInput | BackupCodeWhereUniqueInput[]
    update?: BackupCodeUpdateWithWhereUniqueWithoutUserInput | BackupCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BackupCodeUpdateManyWithWhereWithoutUserInput | BackupCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BackupCodeScalarWhereInput | BackupCodeScalarWhereInput[]
  }

  export type AccessTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccessTokenCreateWithoutUserInput, AccessTokenUncheckedCreateWithoutUserInput> | AccessTokenCreateWithoutUserInput[] | AccessTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccessTokenCreateOrConnectWithoutUserInput | AccessTokenCreateOrConnectWithoutUserInput[]
    upsert?: AccessTokenUpsertWithWhereUniqueWithoutUserInput | AccessTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccessTokenCreateManyUserInputEnvelope
    set?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    disconnect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    delete?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    connect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    update?: AccessTokenUpdateWithWhereUniqueWithoutUserInput | AccessTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccessTokenUpdateManyWithWhereWithoutUserInput | AccessTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccessTokenScalarWhereInput | AccessTokenScalarWhereInput[]
  }

  export type RoleCreatepermissionsInput = {
    set: string[]
  }

  export type RoleUpdatepermissionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserCreateNestedOneWithoutTwoFADevicesInput = {
    create?: XOR<UserCreateWithoutTwoFADevicesInput, UserUncheckedCreateWithoutTwoFADevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTwoFADevicesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTwoFADevicesNestedInput = {
    create?: XOR<UserCreateWithoutTwoFADevicesInput, UserUncheckedCreateWithoutTwoFADevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTwoFADevicesInput
    upsert?: UserUpsertWithoutTwoFADevicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTwoFADevicesInput, UserUpdateWithoutTwoFADevicesInput>, UserUncheckedUpdateWithoutTwoFADevicesInput>
  }

  export type UserCreateNestedOneWithoutBackupCodesInput = {
    create?: XOR<UserCreateWithoutBackupCodesInput, UserUncheckedCreateWithoutBackupCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBackupCodesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBackupCodesNestedInput = {
    create?: XOR<UserCreateWithoutBackupCodesInput, UserUncheckedCreateWithoutBackupCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBackupCodesInput
    upsert?: UserUpsertWithoutBackupCodesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBackupCodesInput, UserUpdateWithoutBackupCodesInput>, UserUncheckedUpdateWithoutBackupCodesInput>
  }

  export type UserCreateNestedOneWithoutAccessTokensInput = {
    create?: XOR<UserCreateWithoutAccessTokensInput, UserUncheckedCreateWithoutAccessTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccessTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccessTokensNestedInput = {
    create?: XOR<UserCreateWithoutAccessTokensInput, UserUncheckedCreateWithoutAccessTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccessTokensInput
    upsert?: UserUpsertWithoutAccessTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccessTokensInput, UserUpdateWithoutAccessTokensInput>, UserUncheckedUpdateWithoutAccessTokensInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type TwoFADeviceCreateWithoutUserInput = {
    id?: string
    type: string
    name: string
    secret: string
    isDefault?: boolean
    confirmed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TwoFADeviceUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    name: string
    secret: string
    isDefault?: boolean
    confirmed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TwoFADeviceCreateOrConnectWithoutUserInput = {
    where: TwoFADeviceWhereUniqueInput
    create: XOR<TwoFADeviceCreateWithoutUserInput, TwoFADeviceUncheckedCreateWithoutUserInput>
  }

  export type TwoFADeviceCreateManyUserInputEnvelope = {
    data: TwoFADeviceCreateManyUserInput | TwoFADeviceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BackupCodeCreateWithoutUserInput = {
    id?: string
    codeHash: string
    used?: boolean
    createdAt?: Date | string
  }

  export type BackupCodeUncheckedCreateWithoutUserInput = {
    id?: string
    codeHash: string
    used?: boolean
    createdAt?: Date | string
  }

  export type BackupCodeCreateOrConnectWithoutUserInput = {
    where: BackupCodeWhereUniqueInput
    create: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput>
  }

  export type BackupCodeCreateManyUserInputEnvelope = {
    data: BackupCodeCreateManyUserInput | BackupCodeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccessTokenCreateWithoutUserInput = {
    id?: string
    type: string
    name: string
    tokenHash: string
    calendar?: string | null
    project?: string | null
    active?: boolean
    lastRefreshedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccessTokenUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    name: string
    tokenHash: string
    calendar?: string | null
    project?: string | null
    active?: boolean
    lastRefreshedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccessTokenCreateOrConnectWithoutUserInput = {
    where: AccessTokenWhereUniqueInput
    create: XOR<AccessTokenCreateWithoutUserInput, AccessTokenUncheckedCreateWithoutUserInput>
  }

  export type AccessTokenCreateManyUserInputEnvelope = {
    data: AccessTokenCreateManyUserInput | AccessTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TwoFADeviceUpsertWithWhereUniqueWithoutUserInput = {
    where: TwoFADeviceWhereUniqueInput
    update: XOR<TwoFADeviceUpdateWithoutUserInput, TwoFADeviceUncheckedUpdateWithoutUserInput>
    create: XOR<TwoFADeviceCreateWithoutUserInput, TwoFADeviceUncheckedCreateWithoutUserInput>
  }

  export type TwoFADeviceUpdateWithWhereUniqueWithoutUserInput = {
    where: TwoFADeviceWhereUniqueInput
    data: XOR<TwoFADeviceUpdateWithoutUserInput, TwoFADeviceUncheckedUpdateWithoutUserInput>
  }

  export type TwoFADeviceUpdateManyWithWhereWithoutUserInput = {
    where: TwoFADeviceScalarWhereInput
    data: XOR<TwoFADeviceUpdateManyMutationInput, TwoFADeviceUncheckedUpdateManyWithoutUserInput>
  }

  export type TwoFADeviceScalarWhereInput = {
    AND?: TwoFADeviceScalarWhereInput | TwoFADeviceScalarWhereInput[]
    OR?: TwoFADeviceScalarWhereInput[]
    NOT?: TwoFADeviceScalarWhereInput | TwoFADeviceScalarWhereInput[]
    id?: StringFilter<"TwoFADevice"> | string
    userId?: StringFilter<"TwoFADevice"> | string
    type?: StringFilter<"TwoFADevice"> | string
    name?: StringFilter<"TwoFADevice"> | string
    secret?: StringFilter<"TwoFADevice"> | string
    isDefault?: BoolFilter<"TwoFADevice"> | boolean
    confirmed?: BoolFilter<"TwoFADevice"> | boolean
    createdAt?: DateTimeFilter<"TwoFADevice"> | Date | string
    updatedAt?: DateTimeFilter<"TwoFADevice"> | Date | string
  }

  export type BackupCodeUpsertWithWhereUniqueWithoutUserInput = {
    where: BackupCodeWhereUniqueInput
    update: XOR<BackupCodeUpdateWithoutUserInput, BackupCodeUncheckedUpdateWithoutUserInput>
    create: XOR<BackupCodeCreateWithoutUserInput, BackupCodeUncheckedCreateWithoutUserInput>
  }

  export type BackupCodeUpdateWithWhereUniqueWithoutUserInput = {
    where: BackupCodeWhereUniqueInput
    data: XOR<BackupCodeUpdateWithoutUserInput, BackupCodeUncheckedUpdateWithoutUserInput>
  }

  export type BackupCodeUpdateManyWithWhereWithoutUserInput = {
    where: BackupCodeScalarWhereInput
    data: XOR<BackupCodeUpdateManyMutationInput, BackupCodeUncheckedUpdateManyWithoutUserInput>
  }

  export type BackupCodeScalarWhereInput = {
    AND?: BackupCodeScalarWhereInput | BackupCodeScalarWhereInput[]
    OR?: BackupCodeScalarWhereInput[]
    NOT?: BackupCodeScalarWhereInput | BackupCodeScalarWhereInput[]
    id?: StringFilter<"BackupCode"> | string
    userId?: StringFilter<"BackupCode"> | string
    codeHash?: StringFilter<"BackupCode"> | string
    used?: BoolFilter<"BackupCode"> | boolean
    createdAt?: DateTimeFilter<"BackupCode"> | Date | string
  }

  export type AccessTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: AccessTokenWhereUniqueInput
    update: XOR<AccessTokenUpdateWithoutUserInput, AccessTokenUncheckedUpdateWithoutUserInput>
    create: XOR<AccessTokenCreateWithoutUserInput, AccessTokenUncheckedCreateWithoutUserInput>
  }

  export type AccessTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: AccessTokenWhereUniqueInput
    data: XOR<AccessTokenUpdateWithoutUserInput, AccessTokenUncheckedUpdateWithoutUserInput>
  }

  export type AccessTokenUpdateManyWithWhereWithoutUserInput = {
    where: AccessTokenScalarWhereInput
    data: XOR<AccessTokenUpdateManyMutationInput, AccessTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type AccessTokenScalarWhereInput = {
    AND?: AccessTokenScalarWhereInput | AccessTokenScalarWhereInput[]
    OR?: AccessTokenScalarWhereInput[]
    NOT?: AccessTokenScalarWhereInput | AccessTokenScalarWhereInput[]
    id?: StringFilter<"AccessToken"> | string
    userId?: StringFilter<"AccessToken"> | string
    type?: StringFilter<"AccessToken"> | string
    name?: StringFilter<"AccessToken"> | string
    tokenHash?: StringFilter<"AccessToken"> | string
    calendar?: StringNullableFilter<"AccessToken"> | string | null
    project?: StringNullableFilter<"AccessToken"> | string | null
    active?: BoolFilter<"AccessToken"> | boolean
    lastRefreshedAt?: DateTimeNullableFilter<"AccessToken"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"AccessToken"> | Date | string | null
    createdAt?: DateTimeFilter<"AccessToken"> | Date | string
    updatedAt?: DateTimeFilter<"AccessToken"> | Date | string
  }

  export type UserCreateWithoutTwoFADevicesInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: string
    status: string
    department?: string | null
    isVerified?: boolean
    passwordLastChangedAt?: Date | string | null
    permissions?: UserCreatepermissionsInput | string[]
    assignedSubsystems?: UserCreateassignedSubsystemsInput | string[]
    avatarUrl?: string | null
    verificationOtp?: string | null
    otpExpiry?: Date | string | null
    twoFactorEnabled?: boolean
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
    accessTokens?: AccessTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTwoFADevicesInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: string
    status: string
    department?: string | null
    isVerified?: boolean
    passwordLastChangedAt?: Date | string | null
    permissions?: UserCreatepermissionsInput | string[]
    assignedSubsystems?: UserCreateassignedSubsystemsInput | string[]
    avatarUrl?: string | null
    verificationOtp?: string | null
    otpExpiry?: Date | string | null
    twoFactorEnabled?: boolean
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
    accessTokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTwoFADevicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTwoFADevicesInput, UserUncheckedCreateWithoutTwoFADevicesInput>
  }

  export type UserUpsertWithoutTwoFADevicesInput = {
    update: XOR<UserUpdateWithoutTwoFADevicesInput, UserUncheckedUpdateWithoutTwoFADevicesInput>
    create: XOR<UserCreateWithoutTwoFADevicesInput, UserUncheckedCreateWithoutTwoFADevicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTwoFADevicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTwoFADevicesInput, UserUncheckedUpdateWithoutTwoFADevicesInput>
  }

  export type UserUpdateWithoutTwoFADevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
    accessTokens?: AccessTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTwoFADevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
    accessTokens?: AccessTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutBackupCodesInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: string
    status: string
    department?: string | null
    isVerified?: boolean
    passwordLastChangedAt?: Date | string | null
    permissions?: UserCreatepermissionsInput | string[]
    assignedSubsystems?: UserCreateassignedSubsystemsInput | string[]
    avatarUrl?: string | null
    verificationOtp?: string | null
    otpExpiry?: Date | string | null
    twoFactorEnabled?: boolean
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    twoFADevices?: TwoFADeviceCreateNestedManyWithoutUserInput
    accessTokens?: AccessTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBackupCodesInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: string
    status: string
    department?: string | null
    isVerified?: boolean
    passwordLastChangedAt?: Date | string | null
    permissions?: UserCreatepermissionsInput | string[]
    assignedSubsystems?: UserCreateassignedSubsystemsInput | string[]
    avatarUrl?: string | null
    verificationOtp?: string | null
    otpExpiry?: Date | string | null
    twoFactorEnabled?: boolean
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    twoFADevices?: TwoFADeviceUncheckedCreateNestedManyWithoutUserInput
    accessTokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBackupCodesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBackupCodesInput, UserUncheckedCreateWithoutBackupCodesInput>
  }

  export type UserUpsertWithoutBackupCodesInput = {
    update: XOR<UserUpdateWithoutBackupCodesInput, UserUncheckedUpdateWithoutBackupCodesInput>
    create: XOR<UserCreateWithoutBackupCodesInput, UserUncheckedCreateWithoutBackupCodesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBackupCodesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBackupCodesInput, UserUncheckedUpdateWithoutBackupCodesInput>
  }

  export type UserUpdateWithoutBackupCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    twoFADevices?: TwoFADeviceUpdateManyWithoutUserNestedInput
    accessTokens?: AccessTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBackupCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    twoFADevices?: TwoFADeviceUncheckedUpdateManyWithoutUserNestedInput
    accessTokens?: AccessTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAccessTokensInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: string
    status: string
    department?: string | null
    isVerified?: boolean
    passwordLastChangedAt?: Date | string | null
    permissions?: UserCreatepermissionsInput | string[]
    assignedSubsystems?: UserCreateassignedSubsystemsInput | string[]
    avatarUrl?: string | null
    verificationOtp?: string | null
    otpExpiry?: Date | string | null
    twoFactorEnabled?: boolean
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    twoFADevices?: TwoFADeviceCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccessTokensInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: string
    status: string
    department?: string | null
    isVerified?: boolean
    passwordLastChangedAt?: Date | string | null
    permissions?: UserCreatepermissionsInput | string[]
    assignedSubsystems?: UserCreateassignedSubsystemsInput | string[]
    avatarUrl?: string | null
    verificationOtp?: string | null
    otpExpiry?: Date | string | null
    twoFactorEnabled?: boolean
    createdAt?: Date | string
    deletedAt?: Date | string | null
    updatedAt?: Date | string
    twoFADevices?: TwoFADeviceUncheckedCreateNestedManyWithoutUserInput
    backupCodes?: BackupCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccessTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccessTokensInput, UserUncheckedCreateWithoutAccessTokensInput>
  }

  export type UserUpsertWithoutAccessTokensInput = {
    update: XOR<UserUpdateWithoutAccessTokensInput, UserUncheckedUpdateWithoutAccessTokensInput>
    create: XOR<UserCreateWithoutAccessTokensInput, UserUncheckedCreateWithoutAccessTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccessTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccessTokensInput, UserUncheckedUpdateWithoutAccessTokensInput>
  }

  export type UserUpdateWithoutAccessTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    twoFADevices?: TwoFADeviceUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccessTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    passwordLastChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permissions?: UserUpdatepermissionsInput | string[]
    assignedSubsystems?: UserUpdateassignedSubsystemsInput | string[]
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationOtp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    twoFactorEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    twoFADevices?: TwoFADeviceUncheckedUpdateManyWithoutUserNestedInput
    backupCodes?: BackupCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TwoFADeviceCreateManyUserInput = {
    id?: string
    type: string
    name: string
    secret: string
    isDefault?: boolean
    confirmed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupCodeCreateManyUserInput = {
    id?: string
    codeHash: string
    used?: boolean
    createdAt?: Date | string
  }

  export type AccessTokenCreateManyUserInput = {
    id?: string
    type: string
    name: string
    tokenHash: string
    calendar?: string | null
    project?: string | null
    active?: boolean
    lastRefreshedAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TwoFADeviceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secret?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TwoFADeviceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secret?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TwoFADeviceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secret?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    confirmed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupCodeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    calendar?: NullableStringFieldUpdateOperationsInput | string | null
    project?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    lastRefreshedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    calendar?: NullableStringFieldUpdateOperationsInput | string | null
    project?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    lastRefreshedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    calendar?: NullableStringFieldUpdateOperationsInput | string | null
    project?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    lastRefreshedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoleDefaultArgs instead
     */
    export type RoleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PasswordResetRequestDefaultArgs instead
     */
    export type PasswordResetRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PasswordResetRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TwoFADeviceDefaultArgs instead
     */
    export type TwoFADeviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TwoFADeviceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BackupCodeDefaultArgs instead
     */
    export type BackupCodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BackupCodeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AccessTokenDefaultArgs instead
     */
    export type AccessTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AccessTokenDefaultArgs<ExtArgs>

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