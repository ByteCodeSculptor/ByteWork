import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Resolve "@/..." imports to the repo root, matching jsconfig.json paths.
const root = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.{js,mjs}'],
  },
  resolve: {
    alias: { '@': root },
  },
});
