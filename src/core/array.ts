/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneArray<T extends TyneType> extends TyneType<T['_type'][]> {
  readonly kind = 'array';

  constructor(public readonly element: T) {
    super();
  }

  safeValidate(value: unknown) {
    if (!Array.isArray(value))
      return { error: 'Expected array', success: false };

    for (let i = 0; i < value.length; i += 1) {
      const safe = this.element.safeValidate(value[i]);

      if (!safe.success) {
        return { error: `[${i}]: ${safe.error}`, success: false };
      }
    }

    return { success: true };
  }

  validate(value: unknown) {
    const safe = this.safeValidate(value);
    if (safe.success) return value as T['_type'][];
    throw new Error(safe.error);
  }

  toDts(name: string) {
    const innerType = this.element.toDts('');

    return name ? `export type ${name} = ${innerType}[]` : `${innerType}[]`;
  }
}

export const array = <T extends TyneType>(element: T) => new TyneArray(element);
