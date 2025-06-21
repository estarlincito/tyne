/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable safeguard/no-raw-error */
/* eslint-disable @typescript-eslint/no-explicit-any */

/** Abstract base class for all Tyne types */
export abstract class TyneType<T = any> {
  /** The kind of type, to be defined by subclasses */
  abstract readonly kind: string;
  /** Type declaration for TypeScript inference */
  declare _type: T;

  /** Safely validates a value, returning success or an error */
  abstract safeValidate(value: unknown): { success: boolean; error?: string };

  /** Validates a value, throwing an error if invalid */
  abstract validate(value: unknown): T;

  /** Generates a TypeScript definition string */
  abstract toDts(name: string): string;

  /**
   * Marks this type as optional, allowing it to be undefined.
   * @returns A new TyneOptional instance wrapping this type.
   */
  optional(): TyneOptional<T> {
    return new TyneOptional(this);
  }

  /**
   * Sets a default value to use when the input is undefined.
   * @param value The default value to use.
   * @returns A new TyneDefault instance with the specified default value.
   */
  default<D extends T>(value: D): TyneDefault<T, D> {
    return new TyneDefault(this, value);
  }

  /**
   * Refines the current type with additional validation logic
   * @param refiner Function to apply additional validation
   * @returns A new refined TyneType instance
   */
  refine(refiner: RefineFn<T>): TyneType<T> {
    return new TyneRefined(this, refiner);
  }
  /**
   * Transforms the current type using the provided transformer function
   * @param transformer Function to apply the transformation
   * @returns A new transformed TyneType instance
   */
  transform<U>(transformer: TransformFn<T, U>): TyneType<U> {
    return new TyneTransformed(this, transformer);
  }
}

/**
 * Wraps a schema, making it optional (allows undefined).
 */
export class TyneOptional<T> extends TyneType<T | undefined> {
  readonly kind = 'optional';

  constructor(private readonly inner: TyneType<T>) {
    super();
  }

  safeValidate(value: unknown) {
    if (value === undefined) return { success: true };
    return this.inner.safeValidate(value);
  }

  validate(value: unknown) {
    const res = this.safeValidate(value);
    if (res.success) return value as undefined;
    throw new Error(res.error);
  }

  toDts(name: string): string {
    const innerType = this.inner.toDts('');

    return name
      ? `type ${name} = ${innerType} | undefined`
      : `${innerType} | undefined`;
  }

  /**
   * Access the wrapped schema.
   */
  getInner(): TyneType<T> {
    return this.inner;
  }
}

/**
 * Wraps a schema, providing a default value when input is undefined.
 */
export class TyneDefault<T, D extends T> extends TyneType<T> {
  readonly kind = 'default';

  constructor(
    private readonly inner: TyneType<T>,
    private readonly defaultValue: D,
  ) {
    super();
  }

  safeValidate(value: unknown) {
    const toValidate = value === undefined ? this.defaultValue : value;

    return this.inner.safeValidate(toValidate);
  }

  validate(value: unknown) {
    const toValidate = value === undefined ? this.defaultValue : value;

    const safe = this.safeValidate(toValidate);
    if (safe.success) return toValidate as T;
    throw new Error(safe.error);
  }

  toDts(name: string): string {
    return this.inner.toDts(name);
  }

  /**
   * Access the wrapped schema.
   */
  getInner(): TyneType<T> {
    return this.inner;
  }
}

/** Type definition for refinement functions */
export type RefineFn<T> = (
  value: T,
  ctx: { error: (message: string) => void },
) => void | boolean | string;

/** A refined type that adds validation logic to an existing TyneType */
export class TyneRefined<T> extends TyneType<T> {
  readonly kind = 'refined';

  constructor(
    private readonly inner: TyneType<T>,
    private readonly refiner: RefineFn<T>,
  ) {
    super();
  }

  safeValidate(value: unknown): { success: boolean; error?: string } {
    // First, validate with the inner type
    const innerResult = this.inner.safeValidate(value);
    if (!innerResult.success) return innerResult;

    try {
      let errorMessage: string | null = null;

      // Apply the refiner function
      const result = this.refiner(value as T, {
        error: (msg) => {
          errorMessage = msg;
        },
      });

      // Handle different return types from the refiner
      if (typeof result === 'string') {
        return { error: result, success: false };
      }
      if (result === false) {
        return { error: 'Refinement failed', success: false };
      }
      if (errorMessage) {
        return { error: errorMessage, success: false };
      }

      return { success: true };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Refinement error',
        success: false,
      };
    }
  }

  validate(value: unknown): T {
    const result = this.safeValidate(value);
    if (result.success) return value as T;
    throw new Error(result.error ?? 'Validation failed');
  }

  toDts(name: string): string {
    return this.inner.toDts(name); // Delegate to the inner type
  }
}
/** Type definition for transformation functions */
export type TransformFn<T, U> = (value: T) => U;
/** Represents a transformed TyneType instance */
export class TyneTransformed<T, U> extends TyneType<U> {
  readonly kind = 'transformed';

  constructor(
    private readonly inner: TyneType<T>,
    private readonly transformer: (value: T) => U,
  ) {
    super();
  }

  safeValidate(value: unknown): {
    success: boolean;
    error?: string;
    transformed?: U;
  } {
    const innerResult = this.inner.safeValidate(value);
    if (!innerResult.success) {
      return innerResult;
    }

    try {
      const transformed = this.transformer(value as T);

      return {
        success: true,
        transformed,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Transformation error',
        success: false,
      };
    }
  }

  validate(value: unknown): U {
    const result = this.safeValidate(value);
    if (result.success) {
      return result.transformed as U;
    }
    throw new Error(result.error ?? 'Transformation failed');
  }

  toDts(name: string): string {
    return this.inner.toDts(name);
  }
}
