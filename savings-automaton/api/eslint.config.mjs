import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
  {
    files: ['**/*.test.{js,mjs,cjs}', '**/__tests__/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.jest,
    },
  },
]);
