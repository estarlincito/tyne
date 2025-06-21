/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { TyneType } from './tyne.js';

export class TyneAny extends TyneType<any> {
  readonly kind = 'any';

  safeValidate(_value: unknown): { success: boolean; error?: string } {
    return { success: true };
  }

  validate(value: unknown): any {
    return value;
  }

  toDts(name: string): string {
    return name ? `export type ${name} = any;` : 'any';
  }
}

export const any = () => new TyneAny();
