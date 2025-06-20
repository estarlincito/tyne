/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

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
  }

  safeValidate(value: unknown): { success: boolean; error?: string } {
    if (!Array.isArray(value)) {
      return { error: 'Expected tuple', success: false };
    }

    const minLength = this.elements.length;
    const hasRest = this.restType !== null;

    // Validate minimum length
    if (value.length < minLength) {
      return {
        error: `Expected at least ${minLength} elements, got ${value.length}`,
        success: false,
      };
    }

    // Validate fixed elements
    for (let i = 0; i < minLength; i += 1) {
      const result = this.elements[i].safeValidate(value[i]);
      if (!result.success) {
        return {
          error: `[${i}]: ${result.error}`,
          success: false,
        };
      }
    }

    // Validate rest elements
    if (hasRest && this.restType) {
      for (let i = minLength; i < value.length; i += 1) {
        const result = this.restType.safeValidate(value[i]);
        if (!result.success) {
          return {
            error: `[${i}]: ${result.error}`,
            success: false,
          };
        }
      }
    }
    // Validate exact length when no rest
    else if (value.length > minLength) {
      return {
        error: `Expected exactly ${minLength} elements, got ${value.length}`,
        success: false,
      };
    }

    return { success: true };
  }

  validate(value: unknown) {
    const result = this.safeValidate(value);
    if (result.success) {
      return value as any;
    }
    throw new Error(result.error ?? 'Unknown tuple validation error');
  }

  toDts(name: string): string {
    const fixedTypes = this.elements.map((ty) => ty.toDts(''));
    let restType = '';

    if (this.restType) {
      restType = `, ...${this.restType.toDts('')}[]`;
    }

    const innerType = `[${fixedTypes.join(', ')}${restType}]`;

    return name ? `export type ${name} = ${innerType};` : innerType;
  }

  rest<NewRest extends TyneType>(restType: NewRest): TyneTuple<T, NewRest> {
    return new TyneTuple(this.elements, restType);
  }
}

export const tuple = <T extends TyneType[]>(...elements: T) =>
  new TyneTuple(elements);
