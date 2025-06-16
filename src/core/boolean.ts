/* eslint-disable safeguard/no-raw-error */
import { TyneType } from './tyne.js';

export class TyneBoolean extends TyneType<boolean> {
  readonly kind = 'boolean';

  safeValidate(value: unknown) {
    return typeof value === 'boolean'
      ? { success: true }
      : { error: 'Expected boolean', success: false };
  }

  validate(value: unknown) {
    const safe = this.safeValidate(value);
    if (safe.success) return value as boolean;
    throw new Error(safe.error);
  }

  toDts(name: string) {
    return name ? `export type ${name} = boolean` : `boolean`;
  }
}

export const boolean = () => new TyneBoolean();
