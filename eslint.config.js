/** @type {import("eslint").Linter.Config} */
import { baseConfig } from '@estarlincito/eslint';

export default [...baseConfig, { ignores: ['dist'] }];
// node src/scripts/build-content.ts
