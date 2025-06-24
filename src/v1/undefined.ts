import { TyneType } from './tyne/index.js';

export class TyneUndefined extends TyneType<undefined> {
  readonly kind = 'undefined';

  constructor() {
    super();
    this.checks.push((value, ctx) => {
      if (typeof value !== this.kind) {
        ctx.addIssue({
          code: 'invalid_type',
          message: `Expected ${this.kind}`,
        });
      }
    });
  }

  toDts = () => this.kind;
}

export const undef = () => new TyneUndefined();
