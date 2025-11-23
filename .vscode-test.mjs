import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
  files: '__E2E__/out/**/*.test.js',
  version: '1.90.0',
  mocha: {
    ui: 'tdd',
    color: true,
    timeout: 20000,
  },
});
