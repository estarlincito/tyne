import { TyneType } from '@/v1/utilities/index.js';

export class TyneNull extends TyneType<null> {
  readonly kind = 'null';

  constructor() {
    super();
    this.checks.push((value, ctx) => {
      if (value !== null) {
        ctx.addIssue({
          code: 'invalid_type',
          message: `Expected ${this.kind}`,
        });
      }
    });
  }

  toDts = () => this.kind;
}

export const nullType = () => new TyneNull();
