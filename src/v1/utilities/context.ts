/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
export interface TyneIssue {
  path?: (string | number)[];
  message: string;
  code: string;
}

export type CheckFn<T> = (value: unknown, ctx: TyneContext) => void;

export class TyneContext {
  constructor(public issues: TyneIssue[]) {}

  addIssue(issue: TyneIssue) {
    this.issues.push({
      ...issue,
      path: issue.path ?? [],
    });
  }

  // withPath(key: string | number) {
  //   return new TyneContext(this.issues, [...this.path, key]);
  // }
}
