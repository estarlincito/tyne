import type { TyneIssue } from './context.js';

export class TyneError extends Error {
  constructor(public issues: TyneIssue[]) {
    super('Validation failed');
    this.name = 'TyneError';
  }
}
