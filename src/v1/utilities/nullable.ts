import { TyneType } from './base.js';
import { registerDependency } from './dependencies.js';

export class TyneNullable<T> extends TyneType<T | null> {
  readonly kind = 'nullable';

  constructor(private readonly inner: TyneType<T>) {
    super();

    this.checks.push((value, ctx) => {
      const safe = this.inner.safeValidate(value);

      if (value === null || safe.success) return;

      ctx.addIssue({
        code: 'invalid_type',
        message: `Expected ${this.inner.kind} or null`,
      });
    });
  }

  toDts = () => `${this.inner.toDts()} | null`;
}

registerDependency('nullable', TyneNullable);
