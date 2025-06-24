/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TyneTuple } from './tuple.js';
import { TyneDefault, TyneOptional, TyneType } from './tyne/index.js';

type Shape = Record<string, TyneType<any>>;

type TypeFor<T> = T extends TyneTuple<infer Fixed, infer Rest>
  ? [...{ [K in keyof Fixed]: TypeFor<Fixed[K]> }, ...TypeFor<Rest>[]]
  : T extends TyneOptional<infer U>
  ? U | undefined // Handle optional types (e.g., string().optional() becomes string | undefined)
  : T extends TyneDefault<infer U, any>
  ? U // Handle default values
  : T extends TyneType<infer U>
  ? U // Base case for TyneType
  : never;

type OptionalKeys<T extends Shape> = {
  [K in keyof T]: T[K] extends TyneOptional<any> | TyneDefault<any, any>
    ? K
    : never;
}[keyof T];

type RequiredKeys<T extends Shape> = Exclude<keyof T, OptionalKeys<T>>;

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type ReturnType<T extends Shape> = Prettify<
  Pick<{ [K in keyof T]: TypeFor<T[K]> }, RequiredKeys<T>> &
    Partial<Pick<{ [K in keyof T]: TypeFor<T[K]> }, OptionalKeys<T>>>
>;

export class TyneObject<T extends Shape> extends TyneType<ReturnType<T>> {
  readonly kind = 'object';

  constructor(public readonly shape: T) {
    super();

    this.checks.push((value, ctx) => {
      if (value === null || typeof value !== 'object') {
        ctx.addIssue({
          code: 'invalid_type',
          message: `Expected object, got ${
            value === null ? 'null' : typeof value
          }`,
        });
      } else {
        const valueObj = value as Record<string, unknown>;
        const allowedKeys = new Set(Object.keys(this.shape));

        for (const key in this.shape) {
          if (Object.prototype.hasOwnProperty.call(this.shape, key)) {
            const validator = this.shape[key];
            const propValue = valueObj[key];

            if (
              propValue === undefined &&
              (validator instanceof TyneOptional ||
                validator instanceof TyneDefault)
            ) {
              continue;
            }

            const result = validator.safeValidate(propValue);
            if (!result.success) {
              ctx.addIssue({
                code: 'invalid_type',
                message: `"${key}": ${result.error![0].message}`,
              });
            }
          }
        }

        const unexpectedKeys = Object.keys(valueObj).filter(
          (k) => !allowedKeys.has(k),
        );

        if (unexpectedKeys.length > 0) {
          ctx.addIssue({
            code: 'invalid_type',
            message: `Unexpected properties: ${unexpectedKeys
              .map((k) => `"${k}"`)
              .join(', ')}`,
          });
        }
      }
    });
  }

  toDts = (): string => {
    const entries = Object.entries(this.shape);

    if (entries.length === 0) {
      return '{}';
    }

    const fields = entries.map(([key, type]) => {
      const typeDef = type.toDts();
      const isOptional =
        type instanceof TyneOptional || type instanceof TyneDefault;

      return `  ${JSON.stringify(key)}${isOptional ? '?' : ''}: ${typeDef}`;
    });

    return `{\n${fields.join(';\n')}\n}`;
  };
}
export const object = <T extends Shape>(shape: T) => new TyneObject(shape);
