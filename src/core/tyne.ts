/* eslint-disable safeguard/no-raw-error */
/* eslint-disable @typescript-eslint/no-explicit-any */

export abstract class TyneType<T = any> {
  abstract kind: string;
  declare _type: T;

  abstract safeValidate(value: unknown): { success: boolean; error?: string };
  abstract validate(value: unknown): T;

  abstract toDts(name: string): string;

  optional(): TyneOptional<T> {
    return new TyneOptional(this);
  }

  default<D extends T>(value: D): TyneDefault<T, D> {
    return new TyneDefault(this, value);
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
