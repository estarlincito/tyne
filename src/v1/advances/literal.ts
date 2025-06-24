/* eslint-disable @typescript-eslint/no-base-to-string */

import { TyneType } from '@/v1/utilities/index.js';

export class TyneLiteral<
  T extends string | number | boolean | null,
> extends TyneType<T> {
  readonly kind = 'literal';

  constructor(private readonly literalValue: T) {
    super();
    this.checks.push((value, ctx) => {
      // Handle special cases for NaN and -0

      if (
        typeof this.literalValue === 'number' &&
        Number.isNaN(this.literalValue)
      ) {
        if (typeof value === 'number' && !Number.isNaN(value)) {
          ctx.addIssue({
            code: 'invalid_type',
            message: `Expected NaN`,
          });
        }
      }

      if (
        typeof this.literalValue === 'number' &&
        Object.is(this.literalValue, -0)
      ) {
        if (!Object.is(value, -0)) {
          ctx.addIssue({
            code: 'invalid_type',
            message: `Expected -0`,
          });
        }
      }

      // Handle normal equality comparison
      if (value !== this.literalValue) {
        ctx.addIssue({
          code: 'invalid_type',
          message: `Expected literal ${this.formatLiteralForError(
            this.literalValue,
          )}, got ${this.formatLiteralForError(value)}`,
        });
      }
    });
  }

  toDts = (): string => this.formatLiteralForType(this.literalValue);

  private formatLiteralForError(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
    if (typeof value === 'number' && Object.is(value, -0)) return '-0';
    return String(value);
  }

  private formatLiteralForType(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${this.escapeString(value)}"`;
    if (typeof value === 'number' && Number.isNaN(value)) return 'number'; // NaN has no literal representation
    if (typeof value === 'number' && Object.is(value, -0)) return '0'; // TypeScript doesn't distinguish -0
    return String(value);
  }

  private escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }
}

export const literal = <T extends string | number | boolean | null>(value: T) =>
  new TyneLiteral(value);
