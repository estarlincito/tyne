/* eslint-disable @typescript-eslint/no-explicit-any */

import { TyneType } from './tyne/index.js';

export class TyneAny extends TyneType<any> {
  readonly kind = 'any';
  toDts = (): string => this.kind;
}

export const any = () => new TyneAny();
