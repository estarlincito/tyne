/* eslint-disable prettier/prettier */
import { TyneType } from './base.js';
import { registerDependency } from './dependencies.js';

export class TyneDefault<T, D extends T> extends TyneType<T> {
  readonly kind = 'default';

  constructor(private readonly inner: TyneType<T>, private readonly def: D) {
    super();
  }

  safeValidate(data: unknown) {
    const value = data ?? this.def;
    const safe = this.inner.safeValidate(value);

    if (!safe.success) {
      return { error: safe.error, success: false };
    }
    return { data: value as T, success: true };
  }

  toDts = (): string => this.inner.toDts();
}

registerDependency('default', TyneDefault);
