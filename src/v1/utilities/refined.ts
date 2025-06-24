/** Type definition for refinement functions */

import { TyneType } from './base.js';
import { registerDependency } from './dependencies.js';

export type RefineFn<T> = (arg: T) => boolean;

export interface RefineOpts {
  message: string;
  code?: string;
  path?: (string | number)[];
}

/** A refined type that adds validation logic to an existing TyneType */
export class TyneRefined<T> extends TyneType<T> {
  readonly kind = 'refined';

  constructor(
    private readonly inner: TyneType<T>,
    private readonly refiner: RefineFn<T>,
    private readonly options: RefineOpts,
  ) {
    super();
    // 1. Loading base checks
    this.checks.push(...inner.checks);

    // 2. Loading refiner checks
    this.checks.push((data, ctx) => {
      if (ctx.issues.length === 0) {
        const refined = this.refiner(data as T);

        if (refined) {
          ctx.addIssue({
            ...this.options,
            code: this.options.code ?? 'custom',
            message: this.options.message ?? 'Refinement failed',
          });
        }
      }
    });
  }

  toDts = (): string => this.inner.toDts();
}

registerDependency('refined', TyneRefined);
