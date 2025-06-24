/* eslint-disable @typescript-eslint/no-explicit-any */
import { TyneType } from './base.js';
import { registerDependency } from './dependencies.js';

/** Type definition for transformation functions */
export type TransformFn<T, U> = (data: T) => U;

/** Represents a transformed TyneType instance */
class TyneTransformed<T, U> extends TyneType<U> {
  readonly kind = 'transformed';

  constructor(
    private readonly inner: TyneType<T>,
    private readonly transformer: (data: T) => U,
  ) {
    super();

    // 1. Loading base checks
    this.checks.push(...inner.checks);

    // 2. Loading transformer checks
    this.checks.push((data, ctx) => {
      if (ctx.issues.length === 0) {
        try {
          this.transformer(data as T);
          return;
        } catch (error) {
          ctx.addIssue({
            code: 'custom',
            message: error instanceof Error ? error.message : 'Transformation',
          });
        }
      }
    });
  }

  safeValidate(data: unknown) {
    const safe = this.inner.safeValidate(data);

    if (!safe.success) {
      return { error: safe.error, success: false };
    }
    return { data: this.transformer(data as T), success: true };
  }

  toDts = (): string => {
    const transformed = this.transformer(null as any);
    if (typeof transformed === 'string') return 'string';
    if (typeof transformed === 'number') return 'number';
    if (typeof transformed === 'boolean') return 'boolean';
    if (Array.isArray(transformed)) return 'any[]';
    if (transformed instanceof Date) return 'Date';
    if (typeof transformed === 'object' && transformed !== null) {
      return 'Record<string, any>';
    }

    return 'any';
  };
}

registerDependency('transform', TyneTransformed);
