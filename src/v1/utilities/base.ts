/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import {
  type CheckFn,
  TyneContext,
  type TyneIssue,
} from '@/v1/utilities/context.js';
import { TyneError } from '@/v1/utilities/error.js';

import { getDependency } from './dependencies.js';
import type { RefineFn, RefineOpts } from './refined.js';
import type { TransformFn } from './transformed.js';

interface SafeValidate<T> {
  success: boolean;
  error?: TyneIssue[];
  data?: T;
}

export abstract class TyneType<T = any> {
  checks: CheckFn<T>[] = [];
  abstract readonly kind: string;
  declare readonly _type: T;

  validate(data: unknown): T {
    const result = this.safeValidate(data);
    if (!result.success) {
      throw new TyneError(result.error!);
    }
    return result.data as T;
  }

  safeValidate(data: unknown): SafeValidate<T> {
    const issues: TyneIssue[] = [];
    const ctx = new TyneContext(issues);

    for (const check of this.checks) {
      check(data, ctx);
    }

    if (issues.length === 0) {
      return { success: true, data: data as T };
    }
    return { success: false, error: issues };
  }

  toDts = (): string => 'any';

  optional = (): TyneType<T | undefined> => {
    const TyneOptional = getDependency('optional');

    return new TyneOptional(this);
  };

  nullable = (): TyneType<T | null> => {
    const TyneNullable = getDependency('nullable');

    return new TyneNullable(this);
  };

  default = <D>(def: D): TyneType<D> => {
    const TyneDefault = getDependency('default');

    return new TyneDefault(this, def);
  };

  refine = (refiner: RefineFn<T>, options: RefineOpts): TyneType<T> => {
    const TyneRefined = getDependency('refined');

    return new TyneRefined(this, refiner, options);
  };

  transform = <U>(transformer: TransformFn<T, U>): TyneType<U> => {
    const TyneTransformed = getDependency('transform');

    return new TyneTransformed(this, transformer);
  };
}
