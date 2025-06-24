import { TyneType } from '@/v1/utilities/index.js';

export class TyneUnion<T extends TyneType[]> extends TyneType<
  T[number]['_type']
> {
  readonly kind = 'union';

  constructor(public readonly elements: T) {
    super();
    this.checks.push((value, ctx) => {
      for (const ty of this.elements) {
        const safe = ty.safeValidate(value);
        if (safe.success) return;
      }
      ctx.addIssue({
        code: 'invalid_type',
        message: `No branch in union matched the value`,
      });
    });
  }

  toDts = (): string => this.elements.map((ty) => ty.toDts()).join(' | ');
}

export const union = <T extends TyneType[]>(...elements: T) =>
  new TyneUnion(elements);
