/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneString extends TyneType<string> {
  readonly kind = 'string';

  safeValidate(value: unknown) {
    return typeof value === 'string'
      ? { success: true }
      : { error: 'Expected string', success: false };
  }

  validate(value: unknown) {
    const safe = this.safeValidate(value);
    if (safe.success) return value as string;
    throw new Error(safe.error);
  }

  toDts(name: string) {
    return name ? `export type ${name} = string` : `string`;
  }
}

export const string = () => new TyneString();
