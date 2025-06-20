/* eslint-disable safeguard/no-raw-error */

import { TyneType } from './tyne.js';

export class TyneUnion<T extends TyneType[]> extends TyneType<
  T[number]['_type']
> {
  readonly kind = 'union';

  constructor(public readonly elements: T) {
    super();
  }

  safeValidate(value: unknown) {
    for (const ty of this.elements) {
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
      ? `export type ${name} = ${this.elements
          .map((ty) => ty.toDts(''))
          .join(' | ')}`
      : `${this.elements.map((ty) => ty.toDts('')).join(' | ')}`;
  }
}

export const union = <T extends TyneType[]>(...elements: T) =>
  new TyneUnion(elements);
