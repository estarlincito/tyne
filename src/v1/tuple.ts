/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TyneType } from './tyne/index.js';

export class TyneTuple<
  T extends TyneType[],
  R extends TyneType | null = null,
> extends TyneType<
  R extends TyneType<infer V>
    ? [
        ...{ [K in keyof T]: T[K] extends TyneType<infer U> ? U : never },
        ...V[],
      ]
    : { [K in keyof T]: T[K] extends TyneType<infer U> ? U : never }
> {
  readonly kind = 'tuple';

  constructor(
    public readonly elements: T,
    public readonly restType: R = null as R,
  ) {
    super();

    this.checks.push((value, ctx) => {
      if (!Array.isArray(value)) {
        ctx.addIssue({
          code: 'invalid_type',
          message: `Expected tuple`,
        });
      } else {
        const minLength = this.elements.length;
        const hasRest = this.restType !== null;

        // Validate minimum length
        if (value.length < minLength) {
          ctx.addIssue({
            code: 'invalid_type',
            message: `Expected at least ${minLength} elements, got ${value.length}`,
          });
        }

        // Validate fixed elements
        for (let i = 0; i < minLength; i += 1) {
          const result = this.elements[i].safeValidate(value[i]);
          if (!result.success) {
            ctx.addIssue({
              code: 'invalid_type',
              message: `[${i}]: ${result.error![0]?.message ?? 'Invalid'}`,
            });
          }
        }

        // Validate rest elements
        if (hasRest && this.restType) {
          for (let i = minLength; i < value.length; i += 1) {
            const result = this.restType.safeValidate(value[i]);
            if (!result.success) {
              ctx.addIssue({
                code: 'invalid_type',
                message: `[${i}]: ${result.error![0]?.message ?? 'Invalid'}`,
              });
            }
          }
        }
        // Validate exact length when no rest
        else if (value.length > minLength) {
          ctx.addIssue({
            code: 'invalid_type',
            message: `Expected exactly ${minLength} elements, got ${value.length}`,
          });
        }
      }
    });
  }

  toDts = (): string => {
    const fixedTypes = this.elements.map((ty) => ty.toDts());
    let restType = '';

    if (this.restType) {
      restType = `, ...${this.restType.toDts()}[]`;
    }

    const innerType = `[${fixedTypes.join(', ')}${restType}]`;

    return innerType;
  };

  rest<NewRest extends TyneType>(restType: NewRest): TyneTuple<T, NewRest> {
    return new TyneTuple(this.elements, restType);
  }
}

export const tuple = <T extends TyneType[]>(...elements: T) =>
  new TyneTuple(elements);
