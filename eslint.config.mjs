// This file uses the new ESLint Flat Config format

import next from 'eslint-config-next';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    // 1. Configuration to ignore build and other unnecessary files
    {
        ignores: [
            '.next/',
            'node_modules/',
            'out/',
            'build/',
            'next-env.d.ts',
            '**/*.d.ts'
        ],
    },

    // 2. ESLint's recommended rules for general JavaScript
    js.configs.recommended,

    // 3. Recommended rules for TypeScript
    ...tseslint.configs.recommended,

    // 4. Next.js/React configuration (including Core Web Vitals)
    // This uses the 'core-web-vitals' preset you were trying to extend before
    ...next,

    // 5. Optionally, add specific overrides or custom rules here
    {
        files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
        rules: {
            // Example: turn off an annoying rule
            'react/react-in-jsx-scope': 'off',
            // Example: ensure you always use explicit imports
            // 'import/no-unresolved': 'error'
        },
    },
);
