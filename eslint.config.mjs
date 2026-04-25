import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    stylistic: false,
    tooling: false,
  },
})
  .append({
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/attributes-order': 'off',
      'vue/html-self-closing': 'off',
    },
  })
  .append({
    ignores: [
      '.data/**',
      '.nuxt/**',
      '.output/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'private/**',
      'test-results/**',
    ],
  })
