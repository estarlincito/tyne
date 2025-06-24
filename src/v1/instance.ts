/* eslint-disable @typescript-eslint/no-explicit-any */

import { TyneType } from './tyne/index.js';

export class TyneInstanceof<T> extends TyneType<T> {
  readonly kind = 'instanceof';

  constructor(private readonly ctor: new (...args: any[]) => T) {
    super();
    this.checks.push((value, ctx) => {
      if (value instanceof this.ctor === false) {
        ctx.addIssue({
          code: 'invalid_type',
          message: `Expected ${this.ctor.name}`,
        });
      }
    });
  }

  toDts = (): string => this.ctor.name;
}

export const instanceOf = <T>(ctor: new (...args: any[]) => T) =>
  new TyneInstanceof<T>(ctor);
