/* eslint-disable safeguard/no-raw-error */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { TyneType } from './tyne.js';

type Shape = TyneType<any>[];

export class TyneUnion<T extends Shape> extends TyneType<T[number]['_type']> {
  readonly kind = 'union';

  constructor(public readonly shape: T) {
    super();
  }

  safeValidate(value: unknown) {
    for (const ty of this.shape) {
      const safe = ty.safeValidate(value);
      if (safe.success) return { success: true };
    }
    return {
      error: 'No branch in union matched the value',
      success: false,
    };
  }

  validate(value: unknown) {
    const safe = this.safeValidate(value);
    if (safe.success) return value as T[number]['_type'];
    throw new Error(safe.error);
  }

  toDts(name: string): string {
    return name
      ? `export type ${name} = ${this.shape
          .map((ty) => ty.toDts(''))
          .join(' | ')}`
      : `${this.shape.map((ty) => ty.toDts('')).join(' | ')}`;
  }
}

export const union = <T extends Shape>(shape: T) => new TyneUnion(shape);
