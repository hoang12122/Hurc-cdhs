import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@next/next/no-img-element': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'coverage/**',
    'dist/**',
    'dist-init/**',
    '.prisma-runtime/**',
    '.build-logs/**',
    'public/**',
    'docs/**',
  ]),
]);
