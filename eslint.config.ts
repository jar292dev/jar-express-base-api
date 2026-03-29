import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
    },
  },
  tseslint.configs.recommended,
  {
    rules: {
      // Variables y código muerto
      'no-unused-vars': 'off', // desactivar la base (usa la de TS)
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn', // evitar usar 'any'

      // Buenas prácticas
      eqeqeq: 'error', // === obligatorio
      'no-var': 'error', // prohibir var
      'prefer-const': 'warn', // preferir const
      'no-console': ['warn', { allow: ['warn', 'error'] }], // recordar quitar logs

      // Estilo
      // 'semi': ['error', 'always'],                    // punto y coma obligatorio
      // 'quotes': ['error', 'single'],                  // comillas simples
    },
    ignores: ['node_modules/', 'dist/'],
  },
]);
