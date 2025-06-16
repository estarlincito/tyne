/* eslint-disable safeguard/no-raw-error */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TyneType } from './tyne.js';

type Shape = Record<string, TyneType<any>>;

export class TyneObject<T extends Shape> extends TyneType<{
  [K in keyof T]: T[K]['_type'];
}> {
  readonly kind = 'object';

  constructor(public readonly shape: T) {
    super();
  }

  safeValidate(value: unknown) {
    if (typeof value !== 'object' || value === null)
      return { error: 'Expected object', success: false };

    for (const key in this.shape) {
      const res = this.shape[key].safeValidate((value as any)[key]);

      if (!res.success)
        return { error: `${key}: ${res.error}`, success: false };
    }

    return { success: true };
  }

  validate(value: unknown) {
    const safe = this.safeValidate(value);
    if (safe.success)
      return value as {
        [K in keyof T]: T[K]['_type'];
      };
    throw new Error(safe.error);
  }

  toDts(name: string) {
    const keys = Object.keys(this.shape) as (keyof T)[];
    if (keys.length === 0) {
      return name ? `export type ${name} = any;` : `any`;
    }

    const fields = keys
      .map((key) => `  ${String(key)}: ${this.shape[key].toDts('')};`)
      .join('\n');

    const body = `{\n${fields}\n}`;

    return name ? `export type ${name} = ${body};` : body;
  }
}

export const object = <T extends Shape>(shape: T) => new TyneObject(shape);
