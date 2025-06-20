/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneInstanceOf<T> extends TyneType<T> {
  readonly kind = 'instanceof';

  constructor(private readonly ctor: new (...args: any[]) => T) {
    super();
  }

  safeValidate(value: unknown): { success: boolean; error?: string } {
    if (value instanceof this.ctor) {
      return { success: true };
    }
    return {
      error: `Expected instance of ${this.ctor.name}`,
      success: false,
    };
  }

  validate(value: unknown): T {
    const result = this.safeValidate(value);
    if (result.success) return value as T;
    throw new Error(result.error ?? `Expected ${this.ctor.name} instance`);
  }

  toDts(name: string): string {
    const typeName = this.ctor.name;

    return name ? `export type ${name} = ${typeName};` : typeName;
  }
}

export const instanceOf = <T>(ctor: new (...args: any[]) => T) =>
  new TyneInstanceOf<T>(ctor);
