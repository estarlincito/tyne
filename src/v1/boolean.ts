import { TyneType } from './tyne/index.js';

export class TyneBoolean extends TyneType<boolean> {
  readonly kind = 'boolean';

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

export const boolean = () => new TyneBoolean();
