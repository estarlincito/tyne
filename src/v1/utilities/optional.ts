import { TyneType } from './base.js';
import { registerDependency } from './dependencies.js';

export class TyneOptional<T> extends TyneType<T | undefined> {
  readonly kind = 'optional';

  constructor(private readonly inner: TyneType<T>) {
    super();
    this.checks.push((value, ctx) => {
      const safe = this.inner.safeValidate(value);

      if (value === undefined || safe.success) return;

      ctx.addIssue({
        code: 'invalid_type',
        message: `Expected ${this.inner.kind} or undefined`,
      });
    });
  }

  toDts = (): string => `${this.inner.toDts()} | undefined`;
}

registerDependency('optional', TyneOptional);
