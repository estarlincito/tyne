/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable safeguard/no-raw-error */

import { TyneDefault, TyneOptional, TyneType } from './tyne.js';

type Shape = Record<string, TyneType<any>>;

type TypeFor<T> = T extends TyneType<infer U>
  ? T extends TyneOptional<any> | TyneDefault<any, any>
    ? U | undefined
    : U
  : never;

type ReturnType<T extends Shape> = {
  [K in keyof T]: T[K] extends TyneOptional<any> | TyneDefault<any, any>
    ? { [K in keyof T]?: TypeFor<T[K]> }
    : { [K in keyof T]: TypeFor<T[K]> };
}[keyof T];

export class TyneObject<T extends Shape> extends TyneType<ReturnType<T>> {
  readonly kind = 'object';

  constructor(public readonly shape: T) {
    super();
  }

  safeValidate(value: unknown): { success: boolean; error?: string } {
    if (value === null || typeof value !== 'object') {
      return {
        error: `Expected object, got ${value === null ? 'null' : typeof value}`,
        success: false,
      };
    }

    const valueObj = value as Record<string, unknown>;
    const errors: string[] = [];
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
          errors.push(`"${key}": ${result.error}`);
        }
      }
    }

    const unexpectedKeys = Object.keys(valueObj).filter(
      (k) => !allowedKeys.has(k),
    );

    if (unexpectedKeys.length > 0) {
      errors.push(
        `Unexpected properties: ${unexpectedKeys
          .map((k) => `"${k}"`)
          .join(', ')}`,
      );
    }

    if (errors.length > 0) {
      return {
        error: `Object validation failed:\n  - ${errors.join('\n  - ')}`,
        success: false,
      };
    }

    return { success: true };
  }

  validate(value: unknown): ReturnType<T> {
    const result = this.safeValidate(value);
    if (result.success) return value as ReturnType<T>;
    throw new Error(result.error);
  }

  toDts(name: string): string {
    const entries = Object.entries(this.shape);

    if (entries.length === 0) {
      return name ? `export type ${name} = Record<string, never>;` : '{}';
    }

    const fields = entries.map(([key, type]) => {
      const typeDef = type.toDts('');
      const isOptional =
        type instanceof TyneOptional || type instanceof TyneDefault;

      return `  ${JSON.stringify(key)}${isOptional ? '?' : ''}: ${typeDef}`;
    });

    const body = `{\n${fields.join(';\n')}\n}`;

    return name ? `export type ${name} = ${body};` : body;
  }
}

export const object = <T extends Shape>(shape: T) => new TyneObject(shape);
