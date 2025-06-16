/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneNumber extends TyneType<number> {
  readonly kind = 'number';

  safeValidate(value: unknown) {
    return typeof value === 'number'
      ? { success: true }
      : { error: 'Expected number', success: false };
  }

  validate(value: unknown) {
    const safe = this.safeValidate(value);
    if (safe.success) return value as number;
    throw new Error(safe.error);
  }

  toDts(name: string) {
    return name ? `export type ${name} = number` : `number`;
  }
}

export const number = () => new TyneNumber();
